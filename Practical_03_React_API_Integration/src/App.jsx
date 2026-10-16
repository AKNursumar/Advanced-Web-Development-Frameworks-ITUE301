import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProjectsPage from './pages/ProjectsPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';
import { studentProfile } from './config/profile';

export default function App() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="portfolio-app" data-theme={theme}>
      <NavBar
        brandName={studentProfile.shortName}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer
        name={studentProfile.displayName}
        institute={studentProfile.institute}
        email={studentProfile.email}
        socialLinks={studentProfile.socialLinks}
      />
    </div>
  );
}
