import React from 'react';

export default function Projects({ projects }) {
  return (
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
  );
}
