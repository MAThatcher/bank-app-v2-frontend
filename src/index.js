import './styles/imperial.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AuthProvider } from './contexts/AuthProvider';
import NotificationsProvider from './contexts/NotificationsProvider';
createRoot(document.getElementById('root')).render(<React.StrictMode>
    <AuthProvider>
      <NotificationsProvider><App /></NotificationsProvider>
    </AuthProvider>
  </React.StrictMode>);
