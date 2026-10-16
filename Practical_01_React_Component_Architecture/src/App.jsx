import React from 'react';
import NavBar from './components/NavBar';
import Header from './components/Header';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Footer from './components/Footer';
import { studentProfile } from './config/profile';

export default function App() {
  return (
    <div className="portfolio-app">
      <NavBar brandName={studentProfile.shortName} />
      
      <main>
        <Header
          name={studentProfile.displayName}
          headline={studentProfile.headline}
          role={studentProfile.role}
          themeColor={studentProfile.themeColor}
          email={studentProfile.email}
          socialLinks={studentProfile.socialLinks}
        />

        <About
          bio={studentProfile.bio}
          institute={studentProfile.institute}
          semester={studentProfile.semester}
          achievements={studentProfile.achievements}
        />

        <Skills skillCategories={studentProfile.skillCategories} />

        <Projects projects={studentProfile.projects} />
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
