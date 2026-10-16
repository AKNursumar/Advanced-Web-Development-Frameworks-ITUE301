import React, { useState } from 'react';
import Header from '../components/Header';
import About from '../components/About';
import Skills from '../components/Skills';
import { studentProfile } from '../config/profile';

export default function Home() {
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
          <div className="card" style={{ borderLeft: '4px solid var(--accent-cyan)', margin: '1rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '0.925rem', color: 'var(--text-secondary)' }}>
              <strong>🚀 Practical 3 Active:</strong> Check out the <strong>"Live GitHub Repos"</strong> tab in the navigation bar to observe live asynchronous data fetching from GitHub's REST API using <code>useEffect</code>.
            </div>
            <button
              onClick={() => setShowTip(false)}
              className="btn btn-outline"
              style={{ padding: '0.3rem 0.7rem', fontSize: '0.8rem' }}
            >
              Dismiss ✕
            </button>
          </div>
        ) : null}
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
