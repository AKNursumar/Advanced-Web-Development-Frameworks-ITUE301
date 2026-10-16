import React from 'react';

export default function Skills({ skillCategories }) {
  return (
    <section className="section" aria-labelledby="skills-heading">
      <div className="container">
        <div className="section-header">
          <p className="section-tag">Competencies</p>
          <h2 id="skills-heading" className="section-title">Technical Skills</h2>
        </div>

        <div className="skills-grid">
          {skillCategories && skillCategories.map((group) => (
            <div key={group.category} className="card">
              <h3 className="skill-category-title">
                <span>⚡</span>
                <span>{group.category}</span>
              </h3>
              <div className="skill-pills">
                {group.skills.map((skill) => (
                  <span key={skill} className="skill-pill">
                    {skill}
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
