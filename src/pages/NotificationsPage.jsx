import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getNotificationsApi, dismissNotificationApi, dismissAllNotificationsApi } from '../api/notificationsApi';
import { useNotifications } from '../contexts/NotificationsProvider';
import { PageHeading, Notice, Loading, Empty } from '../components/common/Imperial';
const PAGE_SIZE = 30;
const labels = { transfer: 'Transfer confirmed', membership: 'Vault access', general: 'Imperial dispatch' };
export default function NotificationsPage() {
  const { count, refresh } = useNotifications();
  const [items, setItems] = useState([]);
  const [unread, setUnread] = useState(false);
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [more, setMore] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const sequence = useRef(0);
  const load = useCallback(async before => {
    const request = ++sequence.current;
    setLoading(true); setError('');
    try {
      const { data } = await getNotificationsApi({ limit: PAGE_SIZE, ...(before ? { before } : {}), ...(unread ? { unread: 'true' } : {}), ...(type ? { type } : {}) });
      if (request !== sequence.current) return;
      setItems(old => before ? [...old, ...data.filter(row => !old.some(item => item.id === row.id))] : data);
      setMore(data.length === PAGE_SIZE);
    } catch {
      if (request === sequence.current) setError('The astropathic channel is unavailable. Please retry.');
    } finally { if (request === sequence.current) setLoading(false); }
  }, [unread, type]);
  useEffect(() => {
    const requests = sequence;
    setItems([]); setMore(false); setStatus(''); load();
    return () => { ++requests.current; };
  }, [load]);
  async function dismiss(id) {
    if (busy) return;
    setBusy(true); setError(''); setStatus('');
    const request = sequence.current;
    try {
      if (id) await dismissNotificationApi(id); else await dismissAllNotificationsApi();
      if (request !== sequence.current) return;
      setStatus(id ? 'Transmission dismissed.' : 'All unread transmissions dismissed.');
      await load(); await refresh();
    } catch { if (request === sequence.current) setError('The dismissal could not be confirmed. Refresh or retry.'); }
    finally { setBusy(false); }
  }
  return <div className="workspace inbox-workspace">
    <PageHeading eyebrow="ASTROPATHIC COMMUNICATIONS / SECURE CHANNEL" title="Your transmissions." action={<span className="inbox-total">{count == null ? 'INBOX' : `${count} UNREAD`}</span>}>Transfer confirmations and vault access dispatches from the Administratum.</PageHeading>
    <div className="inbox-toolbar">
      <div className="inbox-tabs" role="group" aria-label="Notification status">
        <button className="btn btn-outline" aria-pressed={!unread} disabled={busy || loading} onClick={() => setUnread(false)}>All transmissions</button>
        <button className="btn btn-outline" aria-pressed={unread} disabled={busy || loading} onClick={() => setUnread(true)}>Unread</button>
      </div>
      <label>Dispatch type<select value={type} disabled={busy || loading} onChange={e => setType(e.target.value)}><option value="">All types</option><option value="transfer">Transfers</option><option value="membership">Vault access</option><option value="general">General</option></select></label>
      <div className="button-row"><button className="btn btn-quiet" disabled={busy || loading} onClick={() => { load(); refresh(); }}>Refresh</button><button className="btn btn-outline" disabled={busy || loading || !(count > 0 || items.some(item => !item.dismissed))} onClick={() => dismiss()}>Dismiss all unread</button></div>
    </div>
    <p className="fine-print">Dismissed transmissions remain in your archives. Dismiss all applies to every unread transmission, including those outside the current filter.</p>
    {error && <Notice error>{error}</Notice>}{status && <Notice>{status}</Notice>}
    {loading && <Loading label="Receiving transmissions" />}
    {!loading && !error && !items.length && <Empty title={unread ? 'No unread transmissions.' : 'No transmissions found.'}>New transfer and vault access alerts will appear here.</Empty>}
    <ol className="inbox-list" aria-label="Transmissions" aria-busy={loading || busy}>{items.map(item => <li key={item.id} className={`dispatch ${item.dismissed ? 'dispatch-dismissed' : 'dispatch-unread'}`}>
      <span className="dispatch-sigil" aria-hidden="true">{item.type === 'transfer' ? '⇄' : item.type === 'membership' ? 'I' : '✦'}</span>
      <article><div className="dispatch-meta"><span>{item.dismissed ? 'ARCHIVED' : 'UNREAD'} / {item.type || 'general'}</span>{item.create_date && <time dateTime={item.create_date}>{new Date(item.create_date).toLocaleString()}</time>}</div><h2>{labels[item.type] || 'Imperial dispatch'}</h2><p>{item.message}</p></article>
      {!item.dismissed && <button className="btn btn-quiet" aria-label={`Dismiss transmission ${item.id}`} disabled={busy || loading} onClick={() => dismiss(item.id)}>Dismiss ×</button>}
    </li>)}</ol>
    {more && <button className="btn btn-outline" disabled={busy || loading} onClick={() => load(items[items.length - 1].id)}>Load older transmissions</button>}
  </div>;
}
