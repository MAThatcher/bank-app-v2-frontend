// LoginPage.js
import React, { useState } from 'react';
//import '../Css/LoginPage.css';
//import axios from axios;
const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        
        console.log('email:', email);
        console.log('Password:', password);
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input 
                        type="text" 
                        id="email" 
                        name="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        placeholder="Enter your email" 
                    />
                </div>

                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        placeholder="Enter your password" 
                    />
                </div>

                <button type="submit" className="login-button">Login</button>
            </form>

            <div className="forgot-password">
                <p>Forgot your password?</p>{/* TODO Setup forgot password button */}
            </div>
            <div className="Create Account">
                <p><a href="/Register">Create Account</a></p>{/* TODO Setup forgot password button */}
            </div>
        </div>
    );
};

export default LoginPage;
