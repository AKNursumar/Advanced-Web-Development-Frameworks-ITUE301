import React from 'react';

export default function ErrorMessage({ error, onRetry }) {
  return (
    <div className="error-card" role="alert">
      <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>⚠️</div>
      <h3 className="error-title">API Request Error</h3>
      <p className="error-desc">
        {error || "Failed to communicate with GitHub's REST API. Please check your connection or rate limit."}
      </p>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-primary">
          🔄 Retry Request
        </button>
      )}
    </div>
  );
}
