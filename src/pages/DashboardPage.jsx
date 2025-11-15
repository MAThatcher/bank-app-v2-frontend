import React from 'react';
import useAuth from '../hooks/useAuth';


export default function DashboardPage() {
    const { user, logout } = useAuth();
    return (
        <div>
            <h1>Dashboard</h1>
            <div>Welcome {user?.name || '---'}</div>
            <button onClick={logout}>Logout</button>
        </div>
    );
}