import React from 'react';

export default function Spinner({ message = "Fetching public repositories from GitHub API..." }) {
  return (
    <div className="spinner-container" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true"></div>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{message}</p>
    </div>
  );
}
