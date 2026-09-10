import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/index';
import AboutPage from './pages/AboutPage';
import HelpPage from './pages/HelpPage';
import ContactPage from './pages/ContactPage';
import SecurityPage from './pages/SecurityPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import CompliancePage from './pages/CompliancePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import CreateAccountPage from './pages/account/CreateAccountPage';
import AccountDetailPage from './pages/account/AccountDetailPage';
import TransferPage from './pages/account/TransferPage';
import VaultSettingsPage from './pages/account/VaultSettingsPage';
import NotificationsPage from './pages/NotificationsPage';
import LedgerArchivesPage from './pages/LedgerArchivesPage';
import NotFoundPage from './pages/NotFoundPage';
import useAuth from './hooks/useAuth';
import { Loading } from './components/common/Imperial';
function ScrollToTop() {
  const {
    pathname
  } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
function ProtectedRoute({
  children
}) {
  const {
    user,
    loading
  } = useAuth();
  if (loading) return <Loading label="Authorizing vault access" />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
export default function Router() {
  return <BrowserRouter><ScrollToTop />
            <div className="app-frame"><a className="skip-link" href="#main-content">Skip to content</a>
                <Header />
                <main id="main-content" className="app-main" tabIndex={-1}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/help" element={<HelpPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/security" element={<SecurityPage />} />
                        <Route path="/privacy" element={<PrivacyPage />} />
                        <Route path="/terms" element={<TermsPage />} />
                        <Route path="/compliance" element={<CompliancePage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                        <Route path="/dashboard" element={<ProtectedRoute>
                                    <DashboardPage />
                                </ProtectedRoute>} />
                        <Route path="/account/create" element={<ProtectedRoute>
                                    <CreateAccountPage />
                                </ProtectedRoute>} />
                        <Route path="/transfer" element={<ProtectedRoute><TransferPage /></ProtectedRoute>} />
                        <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
                        <Route path="/archives" element={<ProtectedRoute><LedgerArchivesPage /></ProtectedRoute>} />
                        <Route path="/account/:accountId/settings" element={<ProtectedRoute><VaultSettingsPage /></ProtectedRoute>} />
                        <Route path="/account/:accountId" element={<ProtectedRoute>
                                    <AccountDetailPage />
                                </ProtectedRoute>} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </BrowserRouter>;
}
