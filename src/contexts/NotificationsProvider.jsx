import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import useAuth from '../hooks/useAuth';
import { getUnreadCountApi } from '../api/notificationsApi';
const Context = createContext({ count: null, refresh: async () => {} });
export const useNotifications = () => useContext(Context);
export default function NotificationsProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id;
  const [snapshot, setSnapshot] = useState(null);
  const sequence = useRef(0);
  const refresh = useCallback(async () => {
    const request = ++sequence.current;
    if (!userId) return;
    try {
      const { data } = await getUnreadCountApi();
      if (request === sequence.current) setSnapshot({ userId, count: data.count });
    } catch {
      if (request === sequence.current) setSnapshot(null);
    }
  }, [userId]);
  useEffect(() => {
    const requests = sequence;
    refresh();
    const visibleRefresh = () => { if (document.visibilityState !== 'hidden') refresh(); };
    const timer = setInterval(visibleRefresh, 30000);
    window.addEventListener('focus', visibleRefresh);
    document.addEventListener('visibilitychange', visibleRefresh);
    window.addEventListener('notifications-changed', visibleRefresh);
    return () => {
      ++requests.current;
      clearInterval(timer);
      window.removeEventListener('focus', visibleRefresh);
      document.removeEventListener('visibilitychange', visibleRefresh);
      window.removeEventListener('notifications-changed', visibleRefresh);
    };
  }, [refresh]);
  return <Context.Provider value={{ count: snapshot && snapshot.userId === userId ? snapshot.count : null, refresh }}>{children}</Context.Provider>;
}
