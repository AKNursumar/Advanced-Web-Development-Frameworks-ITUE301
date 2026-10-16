import React from 'react';

export default function Header({ name, headline, role, themeColor, email, socialLinks }) {
  return (
    <header id="home" className="hero-header" style={{ borderTop: `3px solid ${themeColor || '#4f46e5'}` }}>
      <div className="container">
        <div className="hero-pill" style={{ borderColor: themeColor ? `${themeColor}66` : undefined }}>
          <span>💻</span>
          <span>{role}</span>
        </div>
        <h1 className="hero-title">
          Hi, I'm <span className="gradient-text">{name}</span>
        </h1>
        <p className="hero-subtitle">
          {headline}
        </p>
        <div className="hero-actions">
          <a href="#projects" className="btn btn-primary" style={{ backgroundColor: themeColor }}>
            View Projects
          </a>
          <a href={`mailto:${email}`} className="btn btn-outline" aria-label={`Email ${name}`}>
            Get In Touch
          </a>
          {socialLinks?.github && (
            <a
              href={socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
              aria-label="GitHub Profile"
            >
              GitHub ↗
            </a>
          )}
          {socialLinks?.linkedin && (
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
              aria-label="LinkedIn Profile"
            >
              LinkedIn ↗
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
