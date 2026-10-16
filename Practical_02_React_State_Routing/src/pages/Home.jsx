import React, { useState } from 'react';
import Header from '../components/Header';
import About from '../components/About';
import Skills from '../components/Skills';
import { studentProfile } from '../config/profile';

export default function Home() {
  // useState variable for toggling UI element visibility (help tooltip / lab note)
  const [showTip, setShowTip] = useState(true);

  return (
    <div className="home-page">
      <Header
        name={studentProfile.displayName}
        headline={studentProfile.headline}
        role={studentProfile.role}
        themeColor={studentProfile.themeColor}
        email={studentProfile.email}
        socialLinks={studentProfile.socialLinks}
      />

      <div className="container">
        {showTip ? (
          <div className="help-banner" role="region" aria-label="Quick Tip">
            <div className="help-content">
              <strong>💡 Lab Concept Tip:</strong> In React, <code>useState</code> triggers a component re-render whenever the state updater function is invoked. Notice how toggling this alert updates the DOM dynamically without reloading the page.
            </div>
            <button
              onClick={() => setShowTip(false)}
              className="help-toggle-btn"
              aria-label="Dismiss Tip"
            >
              Dismiss ✕
            </button>
          </div>
        ) : (
          <div style={{ textAlign: 'right', margin: '1rem 0' }}>
            <button
              onClick={() => setShowTip(true)}
              className="help-toggle-btn"
              aria-label="Show Lab Tip"
            >
              Show Lab Tip 💡
            </button>
          </div>
        )}
      </div>

      <About
        bio={studentProfile.bio}
        institute={studentProfile.institute}
        semester={studentProfile.semester}
        achievements={studentProfile.achievements}
      />

      <Skills skillCategories={studentProfile.skillCategories} />
    </div>
  );
}
