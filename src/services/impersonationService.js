const KEY = 'imperial-impersonation';
export function getImpersonation() { try { const value = JSON.parse(sessionStorage.getItem(KEY)); return value && typeof value.id === 'string' ? value : null; } catch { return null; } }
export function storeImpersonation(value) { sessionStorage.setItem(KEY, JSON.stringify(value)); }
export function clearImpersonation() { sessionStorage.removeItem(KEY); }
export function navigateImpersonation(path) { window.location.assign(path); }
