import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { getDisputesApi, getDisputeApi, createDisputeApi, updateDisputeApi } from '../api/disputesApi';
import { PageHeading, Notice, Loading, Empty, money } from '../components/common/Imperial';
const label = status => ({ Open: 'Open', UnderReview: 'Under review', Resolved: 'Resolved', Rejected: 'Rejected', Withdrawn: 'Withdrawn' })[status] || status;
const states = ['Open', 'UnderReview', 'Resolved', 'Rejected', 'Withdrawn'];
export default function DisputesPage() {
    const { user } = useAuth(), navigate = useNavigate(), [params] = useSearchParams();
    const [scope, setScope] = useState('mine'), [status, setStatus] = useState(''), [items, setItems] = useState([]), [next, setNext] = useState(null), [loading, setLoading] = useState(true), [busy, setBusy] = useState(false), [error, setError] = useState('');
    const [form, setForm] = useState({ transactionId: params.get('transaction') || '', reason: '', details: '' });
    const sequence = useRef(0), flight = useRef(false);
    const load = useCallback(async before => {
        const request = ++sequence.current; setLoading(true); setError('');
        try { const { data } = await getDisputesApi({ scope, ...(status ? { status } : {}), ...(before ? { before } : {}) });
            if (request === sequence.current) { setItems(old => before ? [...old, ...data.items.filter(row => !old.some(item => item.id === row.id))] : data.items); setNext(data.next); }
        } catch (err) { if (request === sequence.current) setError(err.response?.data?.error || 'Cases could not be loaded. Please retry.'); }
        finally { if (request === sequence.current) setLoading(false); }
    }, [scope, status]);
    useEffect(() => { const requests = sequence; setItems([]); setNext(null); load(); return () => { requests.current++; }; }, [load]);
    async function submit(event) {
        event.preventDefault(); if (flight.current) return; flight.current = true; setBusy(true); setError('');
        try { const { data } = await createDisputeApi(form.transactionId, { reason: form.reason.trim(), details: form.details.trim() }); navigate(`/disputes/${data.id}`); }
        catch (err) { setError(err.response?.data?.error || 'Submission could not be confirmed. Refresh your cases before retrying.'); }
        finally { flight.current = false; setBusy(false); }
    }
    return <div className="workspace"><Link className="back-link" to="/dashboard">← Vault command</Link><PageHeading eyebrow="ADEPTUS ARBITES / LEDGER INQUIRIES" title="Dispute tribunal.">Flag a ledger entry and follow its review through to a recorded decision.</PageHeading>
        {error && <Notice error>{error}</Notice>}
        <details className="form-panel dispute-compose" open={Boolean(params.get('transaction')) || undefined}><summary>File a transaction dispute</summary><p className="muted">Use the reference from your vault ledger. Filing a case requests an internal review and does not reverse or freeze funds.</p><form onSubmit={submit}><fieldset className="security-fieldset" disabled={busy}><label>Transaction reference<input required inputMode="numeric" pattern="[1-9][0-9]*" value={form.transactionId} onChange={e => setForm({ ...form, transactionId: e.target.value })} /></label><label>Reason<input required minLength={5} maxLength={1020} value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} placeholder="Unrecognized transaction, incorrect amount…" /></label><label>Supporting details<textarea maxLength={2048} rows={4} value={form.details} onChange={e => setForm({ ...form, details: e.target.value })} /></label><button className="btn btn-primary">Submit dispute</button></fieldset></form></details>
        <section className="form-panel"><div className="section-heading-row"><h2>Your case register</h2><button className="btn btn-quiet" disabled={loading || busy} onClick={() => load()}>Refresh cases</button></div><div className="dispute-filters">{user.super_user && <label>Case scope<select value={scope} disabled={loading} onChange={e => setScope(e.target.value)}><option value="mine">My cases</option><option value="review">Administrator review queue</option></select></label>}<label>Case status<select value={status} disabled={loading} onChange={e => setStatus(e.target.value)}><option value="">All statuses</option>{states.map(value => <option value={value} key={value}>{label(value)}</option>)}</select></label></div>
        {loading && <Loading label="Retrieving cases" />}{!loading && !error && !items.length && <Empty title="No cases found.">Cases matching your filters will appear here.</Empty>}
        <ul className="case-list">{items.map(row => <li key={row.id}><Link to={`/disputes/${row.id}`}><div><span className="eyebrow">CASE #{row.id} / TRANSACTION #{row.transaction_id}</span><h3>{row.reason}</h3><p>{row.create_date && new Date(row.create_date).toLocaleString()}</p></div><span className="badge badge-gold">{label(row.status)}</span></Link></li>)}</ul>{next && <button className="btn btn-outline" disabled={loading} onClick={() => load(next)}>Load older cases</button>}</section>
    </div>;
}
export function DisputeDetailPage({ adminView = false }) {
    const { disputeId } = useParams();
    const [item, setItem] = useState(null), [loading, setLoading] = useState(true), [error, setError] = useState(''), [status, setStatus] = useState(''), [note, setNote] = useState(''), [busy, setBusy] = useState(false), [confirmation, setConfirmation] = useState(false), [saved, setSaved] = useState('');
    const sequence = useRef(0), flight = useRef(false), heading = useRef(null);
    const load = useCallback(async () => { const request = ++sequence.current; setLoading(true); setError(''); setConfirmation(false);
        try { const { data } = await getDisputeApi(disputeId); if (request === sequence.current) { setItem(data); setStatus(''); setNote(''); } }
        catch (err) { if (request === sequence.current) { setItem(null); setError(err.response?.data?.error || 'Case unavailable. Please retry.'); } }
        finally { if (request === sequence.current) setLoading(false); }
    }, [disputeId]);
    useEffect(() => { const requests = sequence; load(); return () => { requests.current++; }; }, [load]);
    useEffect(() => { if (confirmation) heading.current?.focus(); }, [confirmation]);
    async function commit() { if (flight.current) return; flight.current = true; setBusy(true); setError(''); setSaved('');
        try { await updateDisputeApi(item.id, { expectedStatus: item.status, status, note: note.trim() }); await load(); setSaved('Case updated. The reporter has been notified according to their preferences.'); }
        catch (err) { setConfirmation(false); setError(err.response?.data?.error || 'The update could not be confirmed. Refresh before another decision.'); }
        finally { flight.current = false; setBusy(false); }
    }
    const active = item && ['Open', 'UnderReview'].includes(item.status);
    return <div className="workspace"><Link className="back-link" to={adminView ? "/admin?section=disputes" : "/disputes"}>← Case register</Link><PageHeading eyebrow="ARBITES CASE FILE" title={`Dispute #${disputeId}`} action={<button className="btn btn-outline" disabled={loading || busy} onClick={load}>Refresh case</button>}>A permanent record of the inquiry and its decisions.</PageHeading>{error && <Notice error>{error}</Notice>}{saved && <Notice>{saved}</Notice>}{loading && <Loading label="Opening case file" />}
        {!loading && item && <><section className="form-panel"><span className="badge badge-gold">{label(item.status)}</span><h2>{item.reason}</h2><p className="muted">Transaction #{item.transaction_id} · Filed by user #{item.user_id} · {item.create_date && new Date(item.create_date).toLocaleString()}</p>{item.details && <p className="case-prose">{item.details}</p>}{item.resolution && <><h3>Recorded decision</h3><p className="case-prose">{item.resolution}</p></>}<p className="fine-print">Case decisions record the outcome of an internal review. They do not adjust vault balances.</p></section>
        <section className="form-panel">{item.transaction && <div className="admin-evidence"><p className="eyebrow">ADMINISTRATOR / LEDGER EVIDENCE</p><h2>Transaction #{item.transaction.id}</h2><p className="case-prose">{item.transaction.description}</p><p>Vault #{item.transaction.account_id} · {money(item.transaction.amount)} ₮ · {item.transaction.category}</p><p>{item.transaction.archived ? "Archived ledger entry" : "Active ledger entry"}</p>{item.transaction.transfer_id && <p className="case-prose">Linked transfer: {item.transaction.transfer_id}</p>}</div>}<h2>Case history</h2>{!item.events.length && <p className="muted">This case predates status history. Future decisions will appear here.</p>}<ol className="case-history">{item.events.map(event => <li key={event.id}><span className="eyebrow">{label(event.status)} / USER #{event.actor_id}</span><p className="case-prose">{event.note}</p><time dateTime={event.created_at}>{new Date(event.created_at).toLocaleString()}</time></li>)}</ol></section>
        {active && (item.canReview || item.canWithdraw) && <section className="form-panel"><h2>{item.canReview ? 'Review this case' : 'Withdraw this case'}</h2><form onSubmit={event => { event.preventDefault(); setConfirmation(true); }}><fieldset className="security-fieldset" disabled={busy || confirmation}><label>Next status<select required value={status} onChange={e => setStatus(e.target.value)}><option value="">Choose an action</option>{item.canReview && <>{item.status === 'Open' && <option value="UnderReview">Begin review</option>}<option value="Resolved">Resolve</option><option value="Rejected">Reject</option></>}{item.canWithdraw && <option value="Withdrawn">Withdraw my case</option>}</select></label><label>Decision or withdrawal note<textarea required minLength={5} maxLength={2048} rows={4} value={note} onChange={e => setNote(e.target.value)} /></label><button className="btn btn-primary">Review case update</button></fieldset></form>
        {confirmation && <div className="settings-confirm"><h3 ref={heading} tabIndex={-1}>Confirm case update</h3><p>Set case #{item.id} to <strong>{label(status)}</strong>.</p><p className="case-prose">{note}</p><div className="button-row"><button className="btn btn-primary" disabled={busy} onClick={commit}>Confirm update</button><button className="btn btn-quiet" disabled={busy} onClick={() => setConfirmation(false)}>Cancel</button></div></div>}</section>}</>}
    </div>;
}
