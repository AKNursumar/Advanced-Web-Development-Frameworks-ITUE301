import React, { useEffect } from 'react';

export default function Toast({ message, type, onClose }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3500);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="toast-container" role="status" aria-live="polite">
      <div className={`toast toast-${type === 'error' ? 'error' : 'success'}`}>
        <span>{type === 'error' ? '❌' : '✅'}</span>
        <span>{message}</span>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', marginLeft: '0.75rem', fontSize: '1rem' }}
          aria-label="Close notification"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
