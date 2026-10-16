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

    setSubmittedMessage({
      name: formData.senderName,
      email: formData.senderEmail,
      subject: formData.subject || 'General Inquiry',
      message: formData.message,
      timestamp: new Date().toLocaleTimeString()
    });

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
        </div>

        <div className="contact-layout">
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
                  placeholder="Project Inquiry"
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

          <div>
            <div className="card">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                Direct Contact
              </h3>
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
              <div className="info-item">
                <span className="info-label">GitHub:</span>
                <span className="info-value">
                  <a href={studentProfile.socialLinks.github} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-cyan)' }}>
                    github.com/AKNursumar
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
