import React from 'react';

export default function About({ bio, institute, semester, achievements }) {
  return (
    <section className="section" aria-labelledby="about-heading">
      <div className="container">
        <div className="section-header">
          <p className="section-tag">Background</p>
          <h2 id="about-heading" className="section-title">About Me</h2>
        </div>

        <div className="about-grid">
          <div className="card">
            <p className="about-bio">{bio}</p>
            <div className="info-item">
              <span className="info-label">Institution:</span>
              <span className="info-value">{institute}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Academic Stage:</span>
              <span className="info-value">{semester}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Focus Areas:</span>
              <span className="info-value">Backend Systems, REST APIs, DSA, Data Engineering</span>
            </div>
          </div>

          <div className="card">
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem' }}>
              Key Achievements
            </h3>
            <ul className="achievements-list">
              {achievements && achievements.map((item, idx) => (
                <li key={`achieve-${idx}`} className="achievement-item">
                  <span className="achievement-icon">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
