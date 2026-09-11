import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAccountsApi } from '../api/accountsApi';
import { getPreferencesApi } from '../api/preferencesApi';
import { orderAccounts, shortcutLabels, shortcutPath } from '../utils/dashboardPreferences';
import { Aquila, PageHeading, Loading, Notice, Empty, money } from '../components/common/Imperial';
export default function DashboardPage() {
  const [preferences, setPreferences] = useState(null);
  const [accounts, setAccounts] = useState([]),
    [loading, setLoading] = useState(true),
    [error, setError] = useState('');
  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [vaults, settings] = await Promise.all([getAccountsApi().catch(err => { if (err.response?.status === 404) return { data: [] }; throw err; }), getPreferencesApi()]);
      setAccounts(orderAccounts(Array.isArray(vaults.data) ? vaults.data : [], settings.data.dashboard.order));
      setPreferences(settings.data.dashboard);
    } catch (err) {
      if (err.response?.status === 404) setAccounts([]);else setError('The vault records could not be retrieved. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    load();
  }, [load]);
  const defaultId = accounts.some(a => a.id === preferences?.defaultAccountId) ? preferences.defaultAccountId : null;
  const hidden = loading || Boolean(error) || !preferences || preferences.hideBalances;
  const balance = accounts.reduce((sum, a) => sum + (Number(a.balance) || 0), 0);
  return <div className="workspace"><PageHeading eyebrow="ADEPTUS ADMINISTRATUM / PERSONAL HOLDINGS" title="Vault command" action={<div className="button-row"><Link className="btn btn-outline" to="/settings/preferences">Customize</Link><Link className="btn btn-primary" to="/account/create">+ Establish vault</Link></div>}>Your holdings. Your ledger. Your duty.</PageHeading>{error && <Notice error>{error} <button className="text-link" onClick={load}>Retry</button></Notice>}
    <div className="dashboard-shortcuts" aria-label="Quick shortcuts">{!loading && !error && preferences?.shortcuts.map(key => <Link className="btn btn-outline" key={key} to={shortcutPath(key, defaultId)}>{shortcutLabels[key]}</Link>)}{!loading && !error && defaultId && <Link className="btn btn-primary" to={`/account/${defaultId}`}>Open default vault →</Link>}</div><div className="command-grid"><section className="balance-panel"><div><p className="eyebrow">TOTAL THRONE GELT</p><p className="grand-balance">{hidden ? '••••' : money(balance)} <span>₮</span></p><p className="muted">Combined holdings across your Imperial vaults</p></div><Aquila /><div className="panel-foot"><span>PERSONAL TREASURY</span><span>HOLY TERRA / M41</span></div></section><aside className="command-aside"><p className="eyebrow">VAULT REGISTER</p><strong>{loading || error ? '—' : String(accounts.length).padStart(2, '0')}</strong><p>Active vaults under your command</p><Link className="text-link" to="/help">Consult the archives →</Link></aside></div>
    <section className="vault-section"><div className="section-heading-row"><div><p className="eyebrow">ASSET REGISTRY</p><h2>Your Imperial vaults</h2></div><span className="count-label">{accounts.length} REGISTERED</span></div>{loading ? <Loading /> : error ? null : accounts.length ? <div className="vault-grid">{accounts.map((a, i) => <Link className="vault-card" key={a.id} to={'/account/' + a.id}><div className="vault-card-top"><span className="vault-number">{String(i + 1).padStart(2, '0')}</span><span>VAULT / {String(a.id).padStart(5, '0')}</span><span className="card-arrow">↗</span></div><h3>{a.name || 'Imperial vault'}</h3><p className="eyebrow">AVAILABLE HOLDINGS</p><p className={'vault-balance ' + (!hidden && Number(a.balance) < 0 ? 'negative' : '')}>{hidden ? '••••' : money(a.balance)} <span>₮</span></p><div className="vault-card-bottom">Open vault ledger <span>→</span></div></Link>)}</div> : <Empty title="The ledger awaits."><p>Establish your first vault to begin recording your holdings.</p><Link className="btn btn-outline" to="/account/create">Establish your first vault →</Link></Empty>}</section><div className="oath"><span>✦</span><p>Let no coin go uncounted. Let no duty go unfulfilled.</p><span>✦</span></div></div>;
}
