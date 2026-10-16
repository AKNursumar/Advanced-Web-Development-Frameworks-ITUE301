import React, { useState, useEffect } from 'react';

export default function NavBar({ brandName }) {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'skills', 'projects'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="navbar" aria-label="Main Navigation">
      <div className="nav-container">
        <a href="#home" className="nav-brand">
          <span className="brand-dot"></span>
          <span>{brandName}</span>
        </a>
        <ul className="nav-links">
          <li>
            <a
              href="#home"
              className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="#about"
              className={`nav-link ${activeSection === 'about' ? 'active' : ''}`}
            >
              About
            </a>
          </li>
          <li>
            <a
              href="#skills"
              className={`nav-link ${activeSection === 'skills' ? 'active' : ''}`}
            >
              Skills
            </a>
          </li>
          <li>
            <a
              href="#projects"
              className={`nav-link ${activeSection === 'projects' ? 'active' : ''}`}
            >
              Projects
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
