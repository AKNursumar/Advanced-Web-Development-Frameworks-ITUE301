import React from 'react';

export default function Projects({ projects }) {
  return (
    <section id="projects" className="section" aria-labelledby="projects-heading">
      <div className="container">
        <div className="section-header">
          <p className="section-tag">Portfolio Work</p>
          <h2 id="projects-heading" className="section-title">Featured Projects</h2>
        </div>

        <div className="projects-grid">
          {projects && projects.map((project) => (
            <div key={project.id} className="card project-card">
              <div>
                <h3 className="project-title">{project.title}</h3>
                <p className="project-desc">{project.description}</p>
              </div>
              <div className="project-tags">
                {project.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
