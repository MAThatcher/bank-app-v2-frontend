import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import AuthLayout from '../../components/common/AuthLayout';
import { Notice, Loading } from '../../components/common/Imperial';
import useAuth from '../../hooks/useAuth';
import { registerApi, verifyEmailApi } from '../../api/usersApi';
import { forgotPasswordApi, resetPasswordApi } from '../../api/authApi';
const errorText = (err, fallback) => err.response?.data?.error || err.response?.data?.message || fallback;
export function Login() {
  const {
      login
    } = useAuth(),
    navigate = useNavigate();
  const [email, setEmail] = useState(''),
    [password, setPassword] = useState(''),
    [busy, setBusy] = useState(false),
    [error, setError] = useState('');
  const submit = async e => {
    e.preventDefault();
    setBusy(true);
    setError('');
    const result = await login({
      email,
      password
    });
    if (result.ok) navigate('/dashboard');else setError(result.error || 'Access denied. Check your credentials.');
    setBusy(false);
  };
  return <AuthLayout eyebrow="IDENTITY AUTHORIZATION / 01" title="Enter the vault." description="Present your credentials to the Administratum."><form onSubmit={submit}><label>Vox-mail address<input type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="citizen@imperium.terra" /></label><label>Security cipher<input type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" /></label><div className="form-link-row"><Link to="/forgot-password">Forgot your cipher?</Link></div>{error && <Notice error>{error}</Notice>}<button className="btn btn-primary full-width" disabled={busy}>{busy ? 'Authorizing…' : 'Authorize access'} →</button></form><p className="auth-switch">Not yet enlisted? <Link to="/register">Register with the Imperium →</Link></p></AuthLayout>;
}
export function Register() {
  const [form, setForm] = useState({
      email: '',
      password: '',
      confirm: ''
    }),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [success, setSuccess] = useState(false);
  const submit = async e => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      setError('Your ciphers do not match.');
      return;
    }
    setBusy(true);
    try {
      await registerApi({
        email: form.email,
        password: form.password
      });
      setSuccess(true);
    } catch (err) {
      setError(errorText(err, 'Registration could not be completed. Please try again.'));
    } finally {
      setBusy(false);
    }
  };
  return <AuthLayout eyebrow="CITIZEN ENROLLMENT / 02" title={success ? 'Await your summons.' : 'Take your place.'} description={success ? 'Verify your vox-mail to complete your enrollment.' : 'Establish your credentials. Begin your service.'}>{success ? <><Notice>A verification link has been dispatched to {form.email}. Follow the link in your inbox before signing in.</Notice><Link className="btn btn-primary full-width" to="/login">Proceed to vault access →</Link></> : <><form onSubmit={submit}><label>Vox-mail address<input type="email" autoComplete="email" required value={form.email} onChange={e => setForm({
            ...form,
            email: e.target.value
          })} placeholder="citizen@imperium.terra" /></label><label>Choose a security cipher<input type="password" autoComplete="new-password" minLength={8} required value={form.password} onChange={e => setForm({
            ...form,
            password: e.target.value
          })} placeholder="At least 8 characters" /></label><label>Confirm your cipher<input type="password" autoComplete="new-password" minLength={8} required value={form.confirm} onChange={e => setForm({
            ...form,
            confirm: e.target.value
          })} placeholder="Repeat your password" /></label>{error && <Notice error>{error}</Notice>}<button className="btn btn-primary full-width" disabled={busy}>{busy ? 'Enrolling…' : 'Enlist with the Imperium'} →</button></form><p className="auth-switch">Already enlisted? <Link to="/login">Access your vault →</Link></p><p className="fine-print">Your enrollment is governed by the <Link to="/terms">Terms of Binding</Link> and <Link to="/privacy">Privacy Sanctum</Link>.</p></>}</AuthLayout>;
}
export function Forgot() {
  const [email, setEmail] = useState(''),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [success, setSuccess] = useState(false);
  const submit = async e => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await forgotPasswordApi(email);
      setSuccess(true);
    } catch (err) {
      setError(errorText(err, 'Unable to request a cipher reset.'));
    } finally {
      setBusy(false);
    }
  };
  return <AuthLayout eyebrow="CIPHER RECOVERY / 03" title={success ? 'Transmission sent.' : 'Recover your cipher.'} description={success ? 'Consult your vox-mail for the next instruction.' : 'Request a reset link for your verified vox-mail address.'}>{success ? <Notice>Reset instructions have been sent to {email}. Follow the link to establish a new cipher.</Notice> : <form onSubmit={submit}><label>Vox-mail address<input type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="citizen@imperium.terra" /></label>{error && <Notice error>{error}</Notice>}<button className="btn btn-primary full-width" disabled={busy}>{busy ? 'Dispatching…' : 'Request cipher reset'} →</button></form>}<p className="auth-switch"><Link to="/login">← Return to vault access</Link></p></AuthLayout>;
}
export function Reset() {
  const {
    token
  } = useParams();
  const [password, setPassword] = useState(''),
    [confirm, setConfirm] = useState(''),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(''),
    [success, setSuccess] = useState(false);
  const submit = async e => {
    e.preventDefault();
    setError('');
    if (password !== confirm) {
      setError('Your ciphers do not match.');
      return;
    }
    setBusy(true);
    try {
      await resetPasswordApi(password, token);
      setSuccess(true);
    } catch (err) {
      setError(errorText(err, 'Your reset link may have expired. Request a new one.'));
    } finally {
      setBusy(false);
    }
  };
  return <AuthLayout eyebrow="CIPHER RESTORATION / 04" title={success ? 'Access restored.' : 'Forge a new cipher.'} description={success ? 'Your new credentials are ready for use.' : 'Establish a new password for your Imperial vault access.'}>{success ? <><Notice>Your security cipher has been changed.</Notice><Link className="btn btn-primary full-width" to="/login">Access your vault →</Link></> : <form onSubmit={submit}><label>New security cipher<input type="password" autoComplete="new-password" minLength={8} required value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 8 characters" /></label><label>Confirm new cipher<input type="password" autoComplete="new-password" minLength={8} required value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repeat your password" /></label>{error && <Notice error>{error} <Link to="/forgot-password">Request another link</Link></Notice>}<button className="btn btn-primary full-width" disabled={busy}>{busy ? 'Updating…' : 'Establish new cipher'} →</button></form>}</AuthLayout>;
}
export function Verify() {
  const {
    token
  } = useParams();
  const [status, setStatus] = useState('loading'),
    [message, setMessage] = useState('');
  useEffect(() => {
    let active = true;
    verifyEmailApi(token).then(({
      data
    }) => {
      if (active) {
        setStatus('success');
        setMessage(data.message || 'Your identity has been verified.');
      }
    }).catch(err => {
      if (active) {
        setStatus('error');
        setMessage(errorText(err, 'Verification failed. Your link may have expired.'));
      }
    });
    return () => {
      active = false;
    };
  }, [token]);
  return <AuthLayout eyebrow="IDENTITY VERIFICATION / 05" title={status === 'success' ? 'Identity sanctioned.' : status === 'error' ? 'Authorization failed.' : 'Consulting the records.'} description="Vox-mail verification by the Adeptus Administratum.">{status === 'loading' ? <Loading label="Verifying your credentials" /> : <><Notice error={status === 'error'}>{message}</Notice><Link className="btn btn-primary full-width" to={status === 'success' ? '/login' : '/register'}>{status === 'success' ? 'Proceed to vault access' : 'Return to enrollment'} →</Link></>}</AuthLayout>;
}
