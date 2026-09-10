
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { getTransferAccountsApi, createTransferApi } from '../../api/transactionsApi';
import { PageHeading, Notice, Loading, Empty, money } from '../../components/common/Imperial';
import { prepareTransfer, toCents, displayCents, transferKey } from '../../utils/transfers';

function storedReview(key) {
  try {
    const value = JSON.parse(sessionStorage.getItem(key));
    if (value?.payload?.idempotencyKey && typeof value.sourceName === 'string' && typeof value.destinationName === 'string') return value;
  } catch { /* A fresh review can still be created when no draft is available. */ }
  return null;
}

export default function TransferPage() {
  const { user } = useAuth();
  const [params] = useSearchParams();
  const storageKey = 'imperial-transfer-' + user.id;
  const [review, setReview] = useState(() => storedReview(storageKey));
  const [form, setForm] = useState({
    sourceAccountId: params.get('from') || '', destinationAccountId: '', amount: '', description: '',
  });
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [loadError, setLoadError] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [uncertain, setUncertain] = useState(() => Boolean(storedReview(storageKey)?.submitted));
  const inFlight = useRef(false);
  const heading = useRef(null);

  const load = useCallback(async () => {
    const { data } = await getTransferAccountsApi();
    setAccounts(data);
    setLoadError('');
    return data;
  }, []);

  useEffect(() => {
    let active = true;
    getTransferAccountsApi().then(({ data }) => { if (active) setAccounts(data); })
      .catch(() => { if (active) setLoadError('The vault register could not be retrieved.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => { if (review || receipt) heading.current?.focus(); }, [review, receipt]);

  const reviewTransfer = async event => {
    event.preventDefault();
    if (inFlight.current) return;
    inFlight.current = true; setBusy(true); setError('');
    try {
      const fresh = await load();
      const prepared = prepareTransfer(fresh, form, transferKey());
      sessionStorage.setItem(storageKey, JSON.stringify(prepared));
      setReview(prepared);
      setUncertain(false);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Unable to review this transfer.');
    } finally { inFlight.current = false; setBusy(false); }
  };

  const edit = () => {
    if (!review || review.submitted) return;
    setForm({
      sourceAccountId: String(review.payload.sourceAccountId),
      destinationAccountId: String(review.payload.destinationAccountId),
      amount: review.payload.amount, description: review.payload.description,
    });
    sessionStorage.removeItem(storageKey);
    setReview(null); setError('');
  };

  const confirm = async () => {
    if (!review || inFlight.current) return;
    inFlight.current = true; setBusy(true); setError('');
    const pending = { ...review, submitted: true };
    try {
      // Persist the exact request before sending it. Reloads and network retries
      // must reuse this key and payload, never invent a second transfer.
      sessionStorage.setItem(storageKey, JSON.stringify(pending));
    } catch {
      setError('Browser storage is unavailable. Allow storage for this site before confirming a transfer.');
      inFlight.current = false; setBusy(false);
      return;
    }
    setReview(pending);
    try {
      const { data } = await createTransferApi(pending.payload);
      setReceipt(data.transfer);
      setUncertain(false);
      try { sessionStorage.removeItem(storageKey); } catch { /* Replaying the retained request is safe. */ }
      window.dispatchEvent(new Event('notifications-changed'));
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.error;
      if ([400, 404, 409, 422].includes(status)) {
        // These responses confirm rejection without moving funds.
        sessionStorage.removeItem(storageKey);
        setForm({
          sourceAccountId: String(pending.payload.sourceAccountId),
          destinationAccountId: String(pending.payload.destinationAccountId),
          amount: pending.payload.amount, description: pending.payload.description,
        });
        setReview(null); setUncertain(false);
        setError(message || 'The transfer was declined. Review the details and try again.');
        load().catch(() => setLoadError('Refresh the vault register before reviewing again.'));
      } else {
        setUncertain(true);
        setError('Confirmation was interrupted. Check this transfer again to retrieve its result safely; retrying will not move funds twice.');
      }
    } finally { inFlight.current = false; setBusy(false); }
  };

  const retryLoad = async () => {
    setLoading(true);
    try { await load(); } catch { setLoadError('The vault register could not be retrieved.'); }
    finally { setLoading(false); }
  };

  return <div className="workspace transfer-workspace">
    <Link className="back-link" to="/dashboard">← Vault command</Link>
    <PageHeading eyebrow="ADEPTUS ADMINISTRATUM / ASSET REQUISITION" title="Requisition transfer">
      Move throne gelt between the vaults under your command.
    </PageHeading>
    <ol className="transfer-steps" aria-label="Transfer progress">
      {['Requisition', 'Review & authorize', 'Recorded'].map((label, index) =>
        <li key={label} aria-current={(receipt ? 2 : review ? 1 : 0) === index ? 'step' : undefined}>
          <span>{String(index + 1).padStart(2, '0')}</span>{label}
        </li>
      )}
    </ol>
    {error && <Notice error>{error}</Notice>}
    {receipt ? <section className="transfer-receipt">
      <p className="eyebrow">REQUISITION FULFILLED</p>
      <h2 ref={heading} tabIndex={-1}>The ledger is balanced.</h2>
      <p className="receipt-amount">{money(receipt.amount)} <span>₮</span></p>
      <p>Transferred from <strong>{review.sourceName}</strong> to <strong>{review.destinationName}</strong>.</p>
      <div className="transfer-balance-grid">
        <Balance title={review.sourceName} before={receipt.sourceBalanceBefore} after={receipt.sourceBalanceAfter} />
        <Balance title={review.destinationName} before={receipt.destinationBalanceBefore} after={receipt.destinationBalanceAfter} />
      </div>
      <dl className="receipt-details"><div><dt>Transfer reference</dt><dd>{receipt.id}</dd></div>
        <div><dt>Recorded</dt><dd>{new Date(receipt.createdAt).toLocaleString()}</dd></div>
        {receipt.description && <div><dt>Description</dt><dd>{receipt.description}</dd></div>}
      </dl>
      <div className="button-row">
        <Link className="btn btn-primary" to={'/account/' + receipt.sourceAccountId}>View source ledger →</Link>
        <Link className="btn btn-outline" to={'/account/' + receipt.destinationAccountId}>View destination ledger →</Link>
      </div>
    </section> : review ? <section className="transfer-review">
      <p className="eyebrow">{uncertain ? 'AWAITING CONFIRMATION' : 'AUTHORIZATION REQUIRED'}</p>
      <h2 ref={heading} tabIndex={-1}>{uncertain ? 'Check your requisition.' : 'Review your requisition.'}</h2>
      {uncertain && <Notice>This tab has retained your original request. Use “Check transfer result” before starting another transfer.</Notice>}
      <p className="receipt-amount">{money(review.payload.amount)} <span>₮</span></p>
      <div className="transfer-route"><span>{review.sourceName}<small>Source vault #{review.payload.sourceAccountId}</small></span><b aria-hidden="true">→</b><span>{review.destinationName}<small>Destination vault #{review.payload.destinationAccountId}</small></span></div>
      <div className="transfer-balance-grid">
        <Balance title="Source holdings" before={review.payload.expectedSourceBalance} after={displayCents(review.sourceAfter)} formatted />
        <Balance title="Destination holdings" before={review.payload.expectedDestinationBalance} after={displayCents(review.destinationAfter)} formatted />
      </div>
      {review.payload.description && <p className="transfer-note">{review.payload.description}</p>}
      <p className="fine-print">Both ledger entries are recorded together. If either balance changes before authorization, you will be asked to review again.</p>
      <div className="button-row">
        <button className="btn btn-primary" onClick={confirm} disabled={busy}>{busy ? 'Confirming…' : uncertain ? 'Check transfer result' : 'Authorize transfer'} →</button>
        {!review.submitted && <button className="btn btn-quiet" onClick={edit} disabled={busy}>Edit requisition</button>}
      </div>
    </section> : loading ? <Loading label="Retrieving the vault register" /> : loadError ?
      <Notice error>{loadError} <button className="text-link" onClick={retryLoad}>Retry</button></Notice> : accounts.length < 2 ?
      <Empty title="Two vaults are required."><p>Establish another vault before requisitioning a transfer.</p><Link className="btn btn-outline" to="/account/create">Establish a vault →</Link></Empty> :
      <div className="transfer-layout"><section className="form-panel">
        <p className="eyebrow">TRANSFER INSTRUCTIONS</p><h2>Prepare the requisition.</h2>
        <form onSubmit={reviewTransfer}>
          <label>Source vault<select required value={form.sourceAccountId} onChange={e => setForm({ ...form, sourceAccountId: e.target.value })}>
            <option value="">Select a source vault</option>{accounts.map(a => <option key={a.id} value={a.id}>{a.name || 'Vault #' + a.id} · {money(a.balance)} ₮</option>)}
          </select></label>
          <label>Destination vault<select required value={form.destinationAccountId} onChange={e => setForm({ ...form, destinationAccountId: e.target.value })}>
            <option value="">Select a destination vault</option>{accounts.filter(a => String(a.id) !== form.sourceAccountId).map(a => <option key={a.id} value={a.id}>{a.name || 'Vault #' + a.id} · {money(a.balance)} ₮</option>)}
          </select></label>
          <label>Amount (₮)<input required type="number" min="0.01" step="0.01" max="99999999999.99" inputMode="decimal" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="0.00" /></label>
          <label>Description <span className="optional">optional</span><textarea rows={3} maxLength={512} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Purpose of the requisition" /></label>
          <button className="btn btn-primary" disabled={busy}>{busy ? 'Preparing review…' : 'Review requisition'} →</button>
        </form>
      </section><aside className="transfer-guidance"><p className="eyebrow">TRANSFER PROTOCOL</p><h2>One order.<br />Two ledger entries.</h2><ol><li>Select vaults you can access.</li><li>Review the resulting balances.</li><li>Authorize the requisition.</li></ol><p>The source vault’s overdraft setting applies. Every completed transfer receives a shared reference in both ledgers.</p></aside></div>}
  </div>;
}

function Balance({ title, before, after, formatted = false }) {
  return <div className="transfer-balance"><h3>{title}</h3><div><span>Before</span><strong>{displayCents(toCents(before))} ₮</strong></div><div><span>After</span><strong>{formatted ? after : displayCents(toCents(after))} ₮</strong></div></div>;
}

