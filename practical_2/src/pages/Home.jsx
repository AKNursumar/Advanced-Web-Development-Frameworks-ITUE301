import Header from "../components/Header";
import About from "../components/About";
import Skills from "../components/Skills";
import Footer from "../components/Footer";

function Home() {
  const studentName = "AK Nursumar";

  const skills = [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Python",
    "Django",
  ];

  return (
    <>
      <Header name={studentName} />
      <About />
      <Skills skillList={skills} />
      <Footer />
    </>
  );
}

export default Home;