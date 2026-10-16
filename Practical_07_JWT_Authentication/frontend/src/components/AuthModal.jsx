import React, { useState } from 'react';
import { registerUser, loginUser, setStoredToken } from '../api';

export default function AuthModal({ onAuthSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isRegister && !name.trim()) {
      setError('Please provide your name.');
      return;
    }
    if (!email.trim() || !password) {
      setError('Email and password are required.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      let data;
      if (isRegister) {
        data = await registerUser({ name: name.trim(), email: email.trim(), password });
      } else {
        data = await loginUser({ email: email.trim(), password });
      }

      setStoredToken(data.token);
      onAuthSuccess(data.user);
    } catch (err) {
      setError(err.message || 'Authentication request failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="card">
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${!isRegister ? 'active' : ''}`}
            onClick={() => {
              setIsRegister(false);
              setError('');
            }}
          >
            Log In
          </button>
          <button
            type="button"
            className={`auth-tab ${isRegister ? 'active' : ''}`}
            onClick={() => {
              setIsRegister(true);
              setError('');
            }}
          >
            Register Account
          </button>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {isRegister && (
            <div className="form-group">
              <label className="form-label" htmlFor="authName">Full Name</label>
              <input
                id="authName"
                type="text"
                className="form-input"
                placeholder="e.g. Abdulkadir Nursumar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="authEmail">Email Address</label>
            <input
              id="authEmail"
              type="email"
              className="form-input"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="authPassword">Password (min 6 characters)</label>
            <input
              id="authPassword"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : isRegister ? 'Create Account & Sign In' : 'Sign In'}
          </button>
        </form>

        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1.25rem', textAlign: 'center' }}>
          🔒 Passwords hashed with bcrypt (salt 10). Session verified via JWT tokens.
        </p>
      </div>
    </div>
  );
}
