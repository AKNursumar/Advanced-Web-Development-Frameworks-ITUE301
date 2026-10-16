import React, { useState } from 'react';
import Projects from '../components/Projects';
import { studentProfile } from '../config/profile';

export default function ProjectsPage() {
  const [filterTag, setFilterTag] = useState('All');

  const allTags = ['All', 'Python', 'Full Stack', 'REST APIs', 'Data Analytics', 'Optimization'];

  const filteredProjects = filterTag === 'All'
    ? studentProfile.projects
    : studentProfile.projects.filter(p => p.tags.some(tag => tag.toLowerCase().includes(filterTag.toLowerCase())));

  return (
    <div className="section">
      <div className="container">
        <div className="section-header">
          <p className="section-tag">Explore Work</p>
          <h2 className="section-title">Verified Technical Projects</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            Interactive project gallery with reactive tag filtering powered by <code>useState</code>.
          </p>
        </div>

        {/* Tag Filter Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setFilterTag(tag)}
              className="skill-pill"
              style={{
                cursor: 'pointer',
                background: filterTag === tag ? 'var(--accent-primary)' : undefined,
                color: filterTag === tag ? '#ffffff' : undefined,
                borderColor: filterTag === tag ? 'var(--accent-primary)' : undefined
              }}
            >
              {tag}
            </button>
          ))}
        </div>

        <Projects projects={filteredProjects} />
      </div>
    </div>
  );
}
