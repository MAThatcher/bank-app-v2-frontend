import React, { useEffect, useRef, useState } from 'react';
import { getImpersonation, clearImpersonation, navigateImpersonation } from '../../services/impersonationService';
import { stopImpersonationApi } from '../../api/adminApi';
export default function ImpersonationShell({ children }) {
    const [context, setContext] = useState(getImpersonation), [invalid, setInvalid] = useState(false), [busy, setBusy] = useState(false), [error, setError] = useState('');
    const flight = useRef(false);
    useEffect(() => {
        const invalidate = () => setInvalid(true);
        const ended = () => { clearImpersonation(); setContext(null); setInvalid(false); };
        const tick = () => { if (context && Date.now() >= new Date(context.expiresAt).getTime()) setInvalid(true); };
        tick(); const timer = setInterval(tick, 1000);
        window.addEventListener('impersonation-invalid', invalidate); window.addEventListener('session-ended', ended);
        return () => { clearInterval(timer); window.removeEventListener('impersonation-invalid', invalidate); window.removeEventListener('session-ended', ended); };
    }, [context]);
    async function stop() {
        if (flight.current) return; flight.current = true; setBusy(true); setError('');
        try { await stopImpersonationApi(context.id); clearImpersonation(); navigateImpersonation('/admin?section=users'); }
        catch (err) { if ([401, 404].includes(err.response?.status)) { clearImpersonation(); navigateImpersonation(err.response.status === 401 ? '/login' : '/admin'); } else setError('Unable to end impersonation. Please retry.'); }
        finally { flight.current = false; setBusy(false); }
    }
    return <>{context && <aside className="impersonation-banner" aria-label="Admin impersonation"><div><strong>{invalid ? 'Impersonation ended or expired' : 'Read-only impersonation'}</strong><p>Viewing {context.user?.email || `user #${context.user?.id}`} · Admin access stays with your original account.</p>{error && <p role="alert">{error}</p>}</div><button className="btn btn-primary" onClick={stop} disabled={busy}>{busy ? 'Returning…' : 'Return to admin'}</button></aside>}{invalid && context ? <div className="workspace"><h1>Return to your admin account.</h1><p>This support session is no longer available.</p></div> : children}</>;
}
