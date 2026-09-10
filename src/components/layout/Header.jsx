import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { Aquila } from '../common/Imperial';
import { useNotifications } from '../../contexts/NotificationsProvider';
export default function Header() {
  const { count } = useNotifications();
  const {
    user,
    logout
  } = useAuth();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const signOut = async () => {
    setBusy(true);
    await logout();
    setBusy(false);
    setOpen(false);
    navigate('/login');
  };
  return <><div className="authority-strip"><span>ADEPTUS ADMINISTRATUM <b> / </b> DIVISIO FINANCIA</span><span>TERRA · SOL SYSTEM · SEGMENTUM SOLAR</span></div><header className="site-header">
 <Link className="brand" to={user ? '/dashboard' : '/'} aria-label="Imperial Bank of Terra home"><Aquila /><span>IMPERIAL BANK<small>OF HOLY TERRA</small></span></Link>
 <button className="menu-toggle btn-quiet" aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}>{open ? 'Close ×' : 'Menu ☰'}</button>
 <nav id="main-navigation" className={open ? 'main-nav is-open' : 'main-nav'} aria-label="Main navigation" onClick={() => setOpen(false)}>
 {user ? <><NavLink to="/dashboard">Vault command</NavLink><NavLink to="/transfer">Transfers</NavLink></> : <><NavLink to="/" end>Sanctum</NavLink><NavLink to="/about">Imperial charter</NavLink></>}
 {user && <NavLink to="/notifications" aria-label={count == null ? 'Notifications' : `Notifications, ${count} unread`}>Notifications{count > 0 && <span className="notification-badge" aria-hidden="true">{count > 99 ? '99+' : count}</span>}</NavLink>}
 {user ? <NavLink to="/archives">Ledger archives</NavLink> : <NavLink to="/help">Help</NavLink>}<NavLink to="/security">Security</NavLink>
 {user ? <button className="btn btn-outline" onClick={signOut} disabled={busy}>{busy ? 'Signing out…' : 'Sign out'} ↗</button> : <Link className="btn btn-primary" to="/login">Access your vault ↗</Link>}
 </nav></header></>;
}
