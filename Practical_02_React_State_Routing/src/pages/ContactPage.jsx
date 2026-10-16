import React, { useState } from 'react';
import { studentProfile } from '../config/profile';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    senderName: '',
    senderEmail: '',
    subject: '',
    message: ''
  });

  const [submittedMessage, setSubmittedMessage] = useState(null);
  const [validationError, setValidationError] = useState('');

  const MAX_MESSAGE_LENGTH = 300;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'message' && value.length > MAX_MESSAGE_LENGTH) return;
    
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    setValidationError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.senderName.trim() || !formData.senderEmail.trim() || !formData.message.trim()) {
      setValidationError('Please fill in all required fields before submitting.');
      return;
    }

    if (!formData.senderEmail.includes('@') || !formData.senderEmail.includes('.')) {
      setValidationError('Please enter a valid email address.');
      return;
    }

    // Local demo submission
    setSubmittedMessage({
      name: formData.senderName,
      email: formData.senderEmail,
      subject: formData.subject || 'General Inquiry',
      message: formData.message,
      timestamp: new Date().toLocaleTimeString()
    });

    // Reset form fields
    setFormData({
      senderName: '',
      senderEmail: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="section">
      <div className="container">
        <div className="section-header">
          <p className="section-tag">Reach Out</p>
          <h2 className="section-title">Contact & Communication</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Interactive controlled form demonstration with real-time input echoing and dynamic character counting.
          </p>
        </div>

        <div className="notice-banner">
          ⚠️ <strong>Lab Demo Notice:</strong> This is a controlled frontend form demonstrating React state management. Form submissions are captured in component state for demonstration and are not dispatched to an external mail server.
        </div>

        <div className="contact-layout">
          {/* Form Card */}
          <div className="card">
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem' }}>
              Send a Message
            </h3>

            {validationError && (
              <div style={{ color: 'var(--accent-rose)', fontSize: '0.875rem', marginBottom: '1rem', fontWeight: 600 }}>
                {validationError}
              </div>
            )}

            {submittedMessage && (
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', color: 'var(--accent-emerald)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.875rem' }}>
                ✓ Local state submission recorded at {submittedMessage.timestamp} for {submittedMessage.name}!
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="senderName">Your Name *</label>
                <input
                  id="senderName"
                  name="senderName"
                  type="text"
                  className="form-input"
                  placeholder="e.g. John Doe"
                  value={formData.senderName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="senderEmail">Your Email *</label>
                <input
                  id="senderEmail"
                  name="senderEmail"
                  type="email"
                  className="form-input"
                  placeholder="name@example.com"
                  value={formData.senderEmail}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="subject">Subject</label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  className="form-input"
                  placeholder="Project Collaboration / Academic Inquiry"
                  value={formData.subject}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  className="form-textarea"
                  placeholder="Write your message here..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
                <div className="char-counter">
                  <span>Live character count:</span>
                  <span style={{ color: formData.message.length >= MAX_MESSAGE_LENGTH ? 'var(--accent-rose)' : 'var(--accent-cyan)' }}>
                    {formData.message.length} / {MAX_MESSAGE_LENGTH}
                  </span>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                Submit Local Form
              </button>
            </form>
          </div>

          {/* Live Typing Preview & Contact Info Card */}
          <div>
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div className="live-preview-title">🔴 Real-Time State Echo (Controlled Input)</div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                As you type in the form, the values below update synchronously via <code>useState</code>.
              </p>
              
              <div className="live-preview-box">
                <div style={{ fontSize: '0.9rem', marginBottom: '0.35rem' }}>
                  <strong>Name:</strong> {formData.senderName || <span style={{ color: 'var(--text-muted)' }}>(empty)</span>}
                </div>
                <div style={{ fontSize: '0.9rem', marginBottom: '0.35rem' }}>
                  <strong>Email:</strong> {formData.senderEmail || <span style={{ color: 'var(--text-muted)' }}>(empty)</span>}
                </div>
                <div style={{ fontSize: '0.9rem', marginBottom: '0.35rem' }}>
                  <strong>Subject:</strong> {formData.subject || <span style={{ color: 'var(--text-muted)' }}>(empty)</span>}
                </div>
                <div style={{ fontSize: '0.9rem' }}>
                  <strong>Message:</strong> {formData.message || <span style={{ color: 'var(--text-muted)' }}>(empty)</span>}
                </div>
              </div>
            </div>

            <div className="card">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                Direct Contact Information
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Prefer direct communication? Feel free to reach out via official academic channels:
              </p>
              <div className="info-item">
                <span className="info-label">Email:</span>
                <span className="info-value">
                  <a href={`mailto:${studentProfile.email}`} style={{ color: 'var(--accent-cyan)' }}>
                    {studentProfile.email}
                  </a>
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Institute:</span>
                <span className="info-value">{studentProfile.institute}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
