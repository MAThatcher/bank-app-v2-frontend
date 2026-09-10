import React from 'react';

export default function Button({ children, onClick, className = '', type = 'button', disabled = false, ...props }) {
    return (
        <button
            type={type}
            onClick={onClick}
            className={className}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
}
