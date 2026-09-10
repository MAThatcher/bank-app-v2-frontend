import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getAccountByIdApi } from '../../api/accountsApi';
import { getTransactionsApi, createTransactionApi } from '../../api/transactionsApi';
import { PageHeading, Loading, Notice, Empty, money } from '../../components/common/Imperial';
import useAuth from '../../hooks/useAuth';
export default function AccountDetailPage() {
  const { user } = useAuth();
  const {
    accountId
  } = useParams();
  const [account, setAccount] = useState(null),
    [transactions, setTransactions] = useState([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState('');
  const [open, setOpen] = useState(false),
    [busy, setBusy] = useState(false),
    [formError, setFormError] = useState(''),
    [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    transactionAmount: '',
    description: '',
    category: ''
  });
  const amountRef = useRef(null),
    triggerRef = useRef(null);
  const load = useCallback(async () => {
    setError('');
    try {
      const [a, t] = await Promise.all([getAccountByIdApi(accountId), getTransactionsApi(accountId)]);
      setAccount(a.data);
      setTransactions(t.data || []);
    } catch {
      setError('Unable to retrieve this vault. Check your access or try again.');
    } finally {
      setLoading(false);
    }
  }, [accountId]);
  useEffect(() => {
    setLoading(true);
    load();
  }, [load]);
  useEffect(() => {
    if (open) amountRef.current?.focus();
  }, [open]);
  const close = () => {
    setOpen(false);
    setFormError('');
    triggerRef.current?.focus();
  };
  const submit = async e => {
    e.preventDefault();
    setFormError('');
    setSuccess('');
    const amount = Number(form.transactionAmount);
    if (!Number.isFinite(amount) || amount === 0 || !form.description.trim()) {
      setFormError('Enter a non-zero amount and a description.');
      return;
    }
    setBusy(true);
    try {
      await createTransactionApi({
        accountId: Number(accountId),
        transactionAmount: amount,
        description: form.description.trim(),
        category: form.category.trim() || 'General'
      });
      setForm({
        transactionAmount: '',
        description: '',
        category: ''
      });
      close();
      setSuccess('Transaction recorded in the vault ledger.');
      await load();
    } catch (err) {
      setFormError(err.response?.data?.error || err.response?.data?.message || 'The transaction could not be recorded. Please try again.');
    } finally {
      setBusy(false);
    }
  };
  if (loading) return <div className="workspace"><Loading label="Retrieving vault ledger" /></div>;
  return <div className="workspace"><Link className="back-link" to="/dashboard">← Vault command</Link>{error && <Notice error>{error} <button className="text-link" onClick={load}>Retry</button></Notice>}{account && <><PageHeading eyebrow={'ASSET REGISTRY / VAULT ' + String(account.id).padStart(5, '0')} title={account.name || 'Imperial vault'} action={<div className="account-actions">{Number(account.owner) === Number(user.id) && <Link className="btn btn-outline" to={`/account/${accountId}/settings`}>Manage vault</Link>}<Link className="btn btn-outline" to={"/transfer?from=" + accountId}>Transfer funds ↗</Link><button ref={triggerRef} className="btn btn-primary" onClick={() => {
        setOpen(!open);
        setSuccess('');
      }} aria-expanded={open} aria-controls="transaction-form">{open ? '− Close form' : '+ Record transaction'}</button></div>}>The complete record of your sanctioned holdings.</PageHeading>{success && <Notice>{success}</Notice>}<div className="account-stats"><div><p className="eyebrow">CURRENT HOLDINGS</p><p className="grand-balance">{money(account.balance)} <span>₮</span></p></div><div><p className="eyebrow">OVERDRAFT</p><span className={'badge ' + (account.overdraft ? 'badge-gold' : '')}>{account.overdraft ? 'Sanctioned' : 'Not permitted'}</span></div><div><p className="eyebrow">LEDGER ENTRIES</p><strong className="stat-value">{transactions.length}</strong></div></div>
      {open && <section id="transaction-form" className="transaction-compose"><div><p className="eyebrow">NEW LEDGER ENTRY</p><h2>Record a transaction</h2><p className="muted">Positive amounts deposit throne gelt. Negative amounts withdraw it.</p></div><form onSubmit={submit}><div className="form-grid"><label>Amount (₮)<input ref={amountRef} type="number" step="0.01" required value={form.transactionAmount} onChange={e => setForm({
                ...form,
                transactionAmount: e.target.value
              })} placeholder="0.00" /></label><label>Category <span className="optional">optional</span><input value={form.category} maxLength={1020} onChange={e => setForm({
                ...form,
                category: e.target.value
              })} placeholder="Tithe, trade, wages…" /></label></div><label>Description<textarea required maxLength={1020} rows="3" value={form.description} onChange={e => setForm({
              ...form,
              description: e.target.value
            })} placeholder="Enter the purpose of this transaction" /></label>{formError && <Notice error>{formError}</Notice>}<div className="button-row"><button type="submit" className="btn btn-primary" disabled={busy}>{busy ? 'Recording…' : 'Commit to ledger'} →</button><button type="button" className="btn btn-quiet" onClick={close} disabled={busy}>Cancel</button></div></form></section>}
      <section className="ledger"><div className="section-heading-row"><div><p className="eyebrow">BOOK OF JUDGMENT</p><h2>Transaction ledger</h2></div><span className="count-label">NEWEST FIRST</span></div>{transactions.length ? <div className="ledger-rows">{transactions.map(t => <details className="ledger-row" key={t.id}><summary><span className={'transaction-direction ' + (Number(t.amount) < 0 ? 'debit' : '')} aria-hidden="true">{Number(t.amount) < 0 ? '↗' : '↙'}</span><span className="transaction-title"><strong>{t.description}</strong><span>{new Date(t.create_date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })} · {t.transfer_id ? (Number(t.amount) < 0 ? 'Transfer out' : 'Transfer in') : (Number(t.amount) < 0 ? 'Withdrawal' : 'Deposit')}</span></span><span className={'transaction-amount ' + (Number(t.amount) < 0 ? 'negative' : 'positive')}>{Number(t.amount) > 0 ? '+' : ''}{money(t.amount)} ₮</span><span className="expand-mark" aria-hidden="true">+</span></summary><div className="transaction-expanded"><div><span className="eyebrow">ENTRY REFERENCE</span><p>#{t.id}</p></div><div><span className="eyebrow">RECORDED</span><p>{new Date(t.create_date).toLocaleString()}</p></div>{t.category && <div><span className="eyebrow">CATEGORY</span><p>{t.category}</p></div>}<div><span className="eyebrow">DESCRIPTION</span><p>{t.description}</p></div>{t.transfer_id && <div className="transfer-reference"><span className="eyebrow">LINKED TRANSFER REFERENCE</span><p>{t.transfer_id}</p></div>}</div></details>)}</div> : <Empty title="No entries in this ledger."><p>Record a deposit or withdrawal to begin.</p></Empty>}</section></>}</div>;
}
