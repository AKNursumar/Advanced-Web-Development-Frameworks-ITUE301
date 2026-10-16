import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="container notfound-container">
      <div className="notfound-code">404</div>
      <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>
        Route Not Found
      </h2>
      <p className="notfound-message">
        The URL path you requested does not exist in this single-page React router configuration.
      </p>
      <div>
        <Link to="/" className="btn btn-primary">
          &larr; Return to Home
        </Link>
      </div>
    </div>
  );
}
