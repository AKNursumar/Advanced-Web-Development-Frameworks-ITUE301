function Skills({ skillList }) {
  return (
    <section>
      <h2>Skills</h2>

      <ul className="skills-list">
        {skillList.map((skill) => (
          <li key={skill} className="skill-item">
            {skill}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Skills;