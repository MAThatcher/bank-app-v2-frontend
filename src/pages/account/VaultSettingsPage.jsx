import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import * as api from '../../api/accountsApi';
import { PageHeading, Loading, Notice, money } from '../../components/common/Imperial';
export default function VaultSettingsPage() {
  const { accountId } = useParams();
  const [data, setData] = useState(null), [loading, setLoading] = useState(true), [busy, setBusy] = useState(false);
  const [name, setName] = useState(''), [email, setEmail] = useState(''), [successor, setSuccessor] = useState('');
  const [pending, setPending] = useState(null), [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState(''), [status, setStatus] = useState(''), [outcome, setOutcome] = useState(null);
  const [mustRefresh, setMustRefresh] = useState(false);
  const requests = useRef(0), inFlight = useRef(false), heading = useRef(null);
  const load = useCallback(async () => {
    const request = ++requests.current;
    setLoading(true); setError('');
    try {
      const response = await api.getVaultSettingsApi(accountId);
      if (request !== requests.current) return;
      setData(response.data); setName(response.data.account.name || ''); setMustRefresh(false); setPending(null);
    } catch (err) {
      if (request !== requests.current) return;
      setData(null); setError(err.response?.data?.error || 'Unable to retrieve vault settings. Please retry.');
    } finally { if (request === requests.current) setLoading(false); }
  }, [accountId]);
  useEffect(() => {
    const tracker = requests;
    setData(null); setOutcome(null); setStatus(''); setEmail(''); setSuccessor(''); load();
    return () => { ++tracker.current; };
  }, [load]);
  useEffect(() => { if (pending) heading.current?.focus(); }, [pending]);
  const stage = item => { setPending(item); setConfirmation(''); setError(''); setStatus(''); };
  async function execute(action) {
    if (inFlight.current) return;
    inFlight.current = true; setBusy(true); setError(''); setStatus('');
    const request = requests.current;
    try {
      const operations = {
        rename: () => api.updateAccountDetailsApi(accountId, { accountName: name.trim() }),
        add: () => api.addUserToAccountApi(accountId, { email: action.email }),
        remove: () => api.removeUserFromAccountApi(accountId, { userId: action.member.id }),
        overdraft: () => api.changeOverdraftApi(accountId, { overdraft: !data.account.overdraft }),
        transfer: () => api.transferOwnershipApi(accountId, { email: action.member.email, confirm: true }),
        close: () => api.deleteAccountApi(accountId, { confirmName: confirmation }),
      };
      const response = await operations[action.kind]();
      if (request !== requests.current) return;
      window.dispatchEvent(new Event('notifications-changed'));
      setPending(null); setEmail('');
      if (['transfer', 'close'].includes(action.kind)) { setOutcome({ kind: action.kind, message: response.data.message }); return; }
      setStatus(response.data.message); await load();
    } catch (err) {
      if (request !== requests.current) return;
      setError(err.response?.data?.error || 'The change could not be confirmed. Refresh the vault before trying again.');
      setPending(null); setMustRefresh(true);
    } finally { inFlight.current = false; setBusy(false); }
  }
  if (outcome) return <div className="workspace"><PageHeading eyebrow="IMPERIAL ASSET REGISTRY" title={outcome.kind === 'close' ? 'Vault sealed.' : 'Command transferred.'} /><Notice>{outcome.message}</Notice><div className="button-row"><Link className="btn btn-primary" to="/dashboard">Return to vault command</Link>{outcome.kind === 'transfer' && <Link className="btn btn-outline" to={`/account/${accountId}`}>View vault ledger</Link>}</div></div>;
  const account = data?.account;
  const candidates = data?.members.filter(member => member.id !== account.owner) || [];
  return <div className="workspace vault-settings">
    <Link className="back-link" to={`/account/${accountId}`}>← Vault ledger</Link>
    <PageHeading eyebrow={`OWNER AUTHORITY / VAULT ${accountId}`} title="Vault command.">Manage your holding and the citizens entrusted with access.</PageHeading>
    {error && <Notice error>{error}</Notice>}{status && <Notice>{status}</Notice>}
    {(mustRefresh || (!data && !loading)) && <div className="button-row"><button className="btn btn-primary" onClick={load} disabled={busy || loading}>Refresh vault</button><Link to="/dashboard" className="text-link">Return to dashboard</Link></div>}
    {loading && <Loading label="Retrieving command authority" />}
    {account && !loading && <>
      <div className="settings-summary"><div><span className="eyebrow">VAULT DESIGNATION</span><h2>{account.name}</h2></div><div><span className="eyebrow">CURRENT HOLDINGS</span><p>{money(account.balance)} ₮</p></div><span className="badge badge-gold">Owner authority</span></div>
      {pending && <section className="settings-confirm" aria-labelledby="confirm-heading"><p className="eyebrow">AUTHORIZATION REQUIRED</p><h2 ref={heading} tabIndex={-1} id="confirm-heading">{pending.title}</h2><p>{pending.detail}</p>
        {pending.kind === 'close' && <label>Type the vault name to confirm<input value={confirmation} onChange={e => setConfirmation(e.target.value)} disabled={busy} autoComplete="off" /></label>}
        <div className="button-row"><button className="btn btn-primary" disabled={busy || (pending.kind === 'close' && confirmation !== account.name)} onClick={() => execute(pending)}>{busy ? 'Applying order…' : 'Confirm order'}</button><button className="btn btn-outline" disabled={busy} onClick={() => setPending(null)}>Cancel</button></div>
      </section>}
      <fieldset className="settings-controls" disabled={busy || mustRefresh || Boolean(pending)}><legend className="sr-only">Vault settings</legend>
        <div className="settings-grid"><section className="form-panel"><p className="eyebrow">ASSET DESIGNATION</p><h2>Rename vault</h2><form onSubmit={e => { e.preventDefault(); execute({ kind: 'rename' }); }}><label>Vault name<input required maxLength={100} value={name} onChange={e => setName(e.target.value)} /></label><button className="btn btn-outline" disabled={!name.trim() || name.trim() === account.name}>Save name</button></form></section>
        <section className="form-panel"><p className="eyebrow">CREDIT AUTHORITY</p><h2>Overdraft permission</h2><p>{account.overdraft ? 'This vault may carry a negative balance.' : 'Withdrawals and transfers cannot reduce this vault below zero.'}</p><p className="fine-print">Overdraft is a permission switch; no separate credit limit is configured. A negative balance must be cleared before disabling it.</p><button className="btn btn-outline" disabled={account.balance == null || (account.overdraft && Number(account.balance) < 0)} onClick={() => stage({ kind: 'overdraft', title: account.overdraft ? 'Disable overdraft?' : 'Enable overdraft?', detail: account.overdraft ? 'Future withdrawals and transfers must remain within the available balance.' : 'All active vault members will be able to withdraw or transfer funds into a negative balance.' })}>{account.overdraft ? 'Disable overdraft' : 'Enable overdraft'}</button></section></div>
        <section className="form-panel settings-members"><p className="eyebrow">AUTHORIZED CITIZENS</p><h2>Vault members</h2><p className="muted">Members can view the ledger, record deposits and withdrawals, and transfer funds. Only the owner can manage access and settings.</p>
          <ul className="member-list">{data.members.map(member => <li key={member.id}><div><strong>{member.email || `Citizen #${member.id}`}</strong><small>{member.id === account.owner ? 'Vault owner' : 'Member'}{!member.verified && ' · Email unverified'}</small></div>{member.id !== account.owner && <button className="btn btn-quiet" aria-label={`Remove ${member.email}`} onClick={() => stage({ kind: 'remove', member, title: 'Revoke member access?', detail: `${member.email} will lose access to this vault. Their historical ledger entries will remain.` })}>Remove ×</button>}</li>)}</ul>
          <form className="settings-add" onSubmit={e => { e.preventDefault(); stage({ kind: 'add', email: email.trim(), title: 'Grant vault access?', detail: `${email.trim()} will be able to view and move funds in this vault. The user must already have a verified account.` }); }}><label>Member email<input type="email" required maxLength={255} value={email} onChange={e => setEmail(e.target.value)} /></label><button className="btn btn-primary">Add member</button></form>
        </section>
        <div className="settings-grid"><section className="form-panel settings-danger"><p className="eyebrow">SUCCESSION OF COMMAND</p><h2>Transfer ownership</h2><p>You will lose owner controls and remain a member. The new owner can then remove your access.</p><label>New owner<select value={successor} onChange={e => setSuccessor(e.target.value)}><option value="">Choose an active member</option>{candidates.filter(member => member.verified).map(member => <option key={member.id} value={member.id}>{member.email}</option>)}</select></label><button className="btn btn-outline" disabled={!successor || !candidates.some(member => String(member.id) === successor)} onClick={() => { const member = candidates.find(item => String(item.id) === successor); stage({ kind: 'transfer', member, title: 'Transfer command authority?', detail: `${member.email} will become the owner of ${account.name}. You will retain member access but lose all owner controls.` }); }}>Review ownership transfer</button></section>
        <section className="form-panel settings-danger"><p className="eyebrow">FINAL SEAL</p><h2>Close vault</h2><p>Closure removes access for every member. Historical ledger records are retained. This interface cannot reopen a closed vault.</p><p className="fine-print">The balance must be exactly 0.00 ₮. Current holdings: {money(account.balance)} ₮.</p><button className="btn btn-outline" disabled={account.balance == null || Number(account.balance) !== 0} onClick={() => stage({ kind: 'close', title: 'Seal this vault?', detail: `Closing ${account.name} will revoke all member access. Type “${account.name}” below to confirm.` })}>Review vault closure</button></section></div>
      </fieldset>
    </>}
  </div>;
}
