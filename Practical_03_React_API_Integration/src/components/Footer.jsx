import React from 'react';

export default function Footer({ name, institute, email, socialLinks }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer" role="contentinfo">
      <div className="container footer-content">
        <div className="footer-links">
          {socialLinks?.github && (
            <a
              href={socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
              aria-label="GitHub profile of Abdulkadir Nursumar"
            >
              GitHub
            </a>
          )}
          {socialLinks?.linkedin && (
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
              aria-label="LinkedIn profile of Abdulkadir Nursumar"
            >
              LinkedIn
            </a>
          )}
          {socialLinks?.leetcode && (
            <a
              href={socialLinks.leetcode}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
              aria-label="LeetCode profile of Abdulkadir Nursumar"
            >
              LeetCode
            </a>
          )}
          <a
            href={`mailto:${email}`}
            className="footer-link"
            aria-label={`Send email to ${email}`}
          >
            {email}
          </a>
        </div>
        <p className="footer-text">
          Designed & Developed by {name} | {institute}
        </p>
        <p className="footer-text" style={{ fontSize: '0.8rem', color: '#6b7280' }}>
          &copy; {currentYear} • Advanced Web Development Frameworks (ITUE301) Lab Practical 3 (API Integration)
        </p>
      </div>
    </footer>
  );
}
