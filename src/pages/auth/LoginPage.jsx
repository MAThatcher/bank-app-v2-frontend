import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';


export default function LoginPage() {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);


    const submit = async (e) => {
        e.preventDefault();
        setError(null);
        const { ok, error: msg } = await login({ email, password });
        if (!ok) setError(msg)
        else {
            // Redirect to dashboard
            window.location.href = '/';
        };
    };


    return (
        <div style={{ maxWidth: 420, margin: '80px auto' }}>
            <h2>Login</h2>
            <form onSubmit={submit}>
                <div>
                    <label>Email</label>
                    <input value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
                {error && <div style={{ color: 'red' }}>{error}</div>}
                <button type="submit">Sign In</button>
            </form>
        </div>
    );
}