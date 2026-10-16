import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="container" style={{ textAlign: 'center', padding: '6rem 1.5rem' }}>
      <div style={{ fontSize: '6rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)' }}>
        404
      </div>
      <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>
        Route Not Found
      </h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        The requested URL path does not exist in the routing table.
      </p>
      <div>
        <Link to="/" className="btn btn-primary">
          &larr; Return to Home
        </Link>
      </div>
    </div>
  );
}
