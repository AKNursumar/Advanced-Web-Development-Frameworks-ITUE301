import React from 'react';
import { NavLink, Link } from 'react-router-dom';

export default function NavBar() {
  return (
    <nav className="navbar" aria-label="Main Navigation">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <span className="brand-dot"></span>
          <span>TaskFlow • Practical 8</span>
        </Link>

        <ul className="nav-links">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              end
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/tasks"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Tasks (Lazy)
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/analytics"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Analytics (Lazy)
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contact"
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              Contact (Lazy)
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
