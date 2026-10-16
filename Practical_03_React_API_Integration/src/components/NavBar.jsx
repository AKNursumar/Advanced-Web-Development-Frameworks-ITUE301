import React from 'react';
import { NavLink, Link } from 'react-router-dom';

export default function NavBar({ brandName, theme, onToggleTheme }) {
  return (
    <nav className="navbar" aria-label="Main Navigation">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <span className="brand-dot"></span>
          <span>{brandName}</span>
        </Link>

        <ul className="nav-links">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              end
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/projects"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Live GitHub Repos
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contact"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Contact
            </NavLink>
          </li>
          <li>
            <button
              onClick={onToggleTheme}
              className="theme-toggle-btn"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              aria-label="Toggle Color Theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
