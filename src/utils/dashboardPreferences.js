export const shortcutLabels = { transfer: 'Transfer funds', archives: 'Ledger archives', notifications: 'Notifications', disputes: 'Disputes', security: 'Security Sanctum', create: 'Establish vault' };
export const shortcutPath = (key, defaultId) => ({ transfer: '/transfer' + (defaultId ? `?from=${defaultId}` : ''), archives: '/archives', notifications: '/notifications', disputes: '/disputes', security: '/settings/security', create: '/account/create' })[key];
export function orderAccounts(accounts, order = []) {
    const rank = new Map(order.map((id, index) => [id, index]));
    return [...accounts].sort((a, b) => (rank.get(a.id) ?? Infinity) - (rank.get(b.id) ?? Infinity));
}
