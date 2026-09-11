import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getPreferencesApi, saveNotificationPreferencesApi, saveDashboardPreferencesApi } from '../api/preferencesApi';
import { getAccountsApi } from '../api/accountsApi';
import { PageHeading, Notice, Loading } from '../components/common/Imperial';
import { shortcutLabels, orderAccounts } from '../utils/dashboardPreferences';
const types = { transfer: 'Transfers', membership: 'Vault access', security: 'Security alerts', dispute: 'Disputes', general: 'General dispatches' };
export default function PreferencesPage() {
    const [preferences, setPreferences] = useState(null), [accounts, setAccounts] = useState([]), [error, setError] = useState(''), [status, setStatus] = useState(''), [busy, setBusy] = useState(false), [attempt, setAttempt] = useState(0);
    const flight = useRef(false);
    useEffect(() => { let active = true; setError(''); setPreferences(null);
        Promise.all([getPreferencesApi(), getAccountsApi().catch(err => { if (err.response?.status === 404) return { data: [] }; throw err; })]).then(([p, a]) => {
            if (!active) return;
            const rows = a.data || [], sorted = orderAccounts(rows, p.data.dashboard.order);
            setAccounts(rows); setPreferences({ ...p.data, dashboard: { ...p.data.dashboard, order: sorted.map(row => row.id), defaultAccountId: rows.some(row => row.id === p.data.dashboard.defaultAccountId) ? p.data.dashboard.defaultAccountId : null } });
        }).catch(() => { if (active) setError('Preferences could not be loaded. Please retry.'); });
        return () => { active = false; };
    }, [attempt]);
    const dashboard = preferences?.dashboard;
    const setDashboard = patch => setPreferences(p => ({ ...p, dashboard: { ...p.dashboard, ...patch } }));
    async function save(event, section) {
        event.preventDefault(); if (flight.current) return; flight.current = true; setBusy(true); setError(''); setStatus('');
        try { const { data } = await (section === 'notifications' ? saveNotificationPreferencesApi(preferences.notifications) : saveDashboardPreferencesApi(dashboard));
            setPreferences(p => ({ ...p, [section]: data })); setStatus(section === 'notifications' ? 'Notification preferences saved.' : 'Dashboard preferences saved.');
        } catch (err) { setError(err.response?.data?.error || 'The save could not be confirmed. Retry to save these settings.'); }
        finally { flight.current = false; setBusy(false); }
    }
    function move(id, direction) { const order = [...dashboard.order], index = order.indexOf(id); [order[index], order[index + direction]] = [order[index + direction], order[index]]; setDashboard({ order }); }
    return <div className="workspace"><Link className="back-link" to="/dashboard">← Vault command</Link><PageHeading eyebrow="PERSONAL PROTOCOLS / COMMAND PREFERENCES" title="Your command. Your rules.">Choose your transmissions and arrange your personal command station.</PageHeading>
        {error && <Notice error>{error} {!preferences && <button className="btn btn-quiet" onClick={() => setAttempt(a => a + 1)}>Retry</button>}</Notice>}{status && <Notice>{status}</Notice>}
        {!preferences && !error && <Loading label="Loading command preferences" />}
        {preferences && <div className="preferences-grid"><section className="form-panel"><p className="eyebrow">ASTROPATHIC CHANNELS</p><h2>Notification preferences</h2><p className="muted">Choose each delivery channel. Changes apply to new alerts; email preferences also apply to queued mail that has not begun sending. Existing inbox history stays available.</p><form onSubmit={e => save(e, 'notifications')}><fieldset disabled={busy} className="security-fieldset"><div className="channel-heading"><span>Alert type</span><span>In-app</span><span>Email</span></div>{Object.entries(types).map(([key, label]) => <div className="channel-row" key={key}><strong>{label}</strong>{['inApp', 'email'].map(channel => <label key={channel}><span className="sr-only">{label} {channel === 'inApp' ? 'in-app' : 'email'}</span><input type="checkbox" checked={preferences.notifications[key][channel]} onChange={e => { const checked = e.target.checked; setPreferences(p => ({ ...p, notifications: { ...p.notifications, [key]: { ...p.notifications[key], [channel]: checked } } })); }} /></label>)}</div>)}<p className="fine-print">Password reset and email verification messages are requested directly and remain available. Keeping security alerts enabled helps you notice unexpected access.</p><button className="btn btn-primary">Save notification preferences</button></fieldset></form></section>
        <section className="form-panel"><p className="eyebrow">COMMAND STATION</p><h2>Dashboard customization</h2><form onSubmit={e => save(e, 'dashboard')}><fieldset disabled={busy} className="security-fieldset"><label className="check-label"><input type="checkbox" checked={dashboard.hideBalances} onChange={e => setDashboard({ hideBalances: e.target.checked })} />Hide balances on the dashboard</label><p className="fine-print">Masks the dashboard total and vault amounts. Opening a vault still shows its ledger and balance.</p><label>Default vault<select value={dashboard.defaultAccountId ?? ''} onChange={e => setDashboard({ defaultAccountId: e.target.value ? Number(e.target.value) : null })}><option value="">No default vault</option>{accounts.map(row => <option value={row.id} key={row.id}>{row.name} · #{row.id}</option>)}</select></label><p className="fine-print">Adds a direct link to this vault and preselects it when using the dashboard transfer shortcut.</p><h3>Vault order</h3><ol className="preference-order">{orderAccounts(accounts, dashboard.order).map((row, index) => <li key={row.id}><span>{row.name} · #{row.id}</span><div><button className="btn btn-quiet" type="button" disabled={index === 0} aria-label={`Move vault ${row.id} up`} onClick={() => move(row.id, -1)}>↑</button><button className="btn btn-quiet" type="button" disabled={index === accounts.length - 1} aria-label={`Move vault ${row.id} down`} onClick={() => move(row.id, 1)}>↓</button></div></li>)}</ol>{!accounts.length && <p className="muted">Create a vault to arrange your register.</p>}<h3>Quick shortcuts</h3><div className="shortcut-options">{Object.entries(shortcutLabels).map(([key, label]) => <label className="check-label" key={key}><input type="checkbox" checked={dashboard.shortcuts.includes(key)} onChange={e => setDashboard({ shortcuts: e.target.checked ? [...dashboard.shortcuts, key] : dashboard.shortcuts.filter(value => value !== key) })} />{label}</label>)}</div><button className="btn btn-primary">Save dashboard preferences</button></fieldset></form></section></div>}
    </div>;
}
