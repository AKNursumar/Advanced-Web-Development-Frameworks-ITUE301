import React, { useState } from 'react';

/**
 * Lazy Loaded Contact Page
 * Default export for React.lazy()
 */
export default function ContactPage() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <p className="section-tag">Lazy Route Chunk</p>
        <h1 className="section-title">Contact & Support</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          This component chunk (<code>ContactPage.chunk.js</code>) was fetched asynchronously when navigating to <code>/contact</code>.
        </p>

        {submitted ? (
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981', padding: '1rem', borderRadius: '8px' }}>
            ✓ Message received in local state demo.
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: '8px', background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                required
              />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', marginBottom: '0.35rem', color: 'var(--text-secondary)' }}>
                Your Feedback / Inquiry
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{ width: '100%', minHeight: '90px', padding: '0.65rem 0.9rem', borderRadius: '8px', background: '#1f2937', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Submit Contact Form
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
