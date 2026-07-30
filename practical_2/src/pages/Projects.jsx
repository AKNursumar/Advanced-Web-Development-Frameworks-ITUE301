function Projects() {
  const projects = [
    "Portfolio Website",
    "Weather App",
    "Student Management System",
  ];

  return (
    <div>
      <h1>My Projects</h1>

      <ul>
        {projects.map((project, index) => (
          <li key={index}>{project}</li>
        ))}
      </ul>
    </div>
  );
}

export default Projects;