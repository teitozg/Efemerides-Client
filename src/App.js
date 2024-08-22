import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [posts, setPosts] = useState([]);
  const [isShrunk, setIsShrunk] = useState(false);
  const [showMenu, setShowMenu] = useState(true);
  const [selectedSection, setSelectedSection] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const sections = [
    "Cultura",
    "Ciencia y Tecnología",
    "Deportes",
    "Historia",
    "Exploración",
    "Cine",
    "Política",
    "Música",
  ];

  const handleScroll = () => {
    if (window.scrollY > 10) {
      setIsShrunk(true);
    } else {
      setIsShrunk(false);
    }
  };

  useEffect(() => {
    axios.get("http://localhost:5001/posts").then((response) => {
      setPosts(response.data);
    });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Add event listeners for scroll and resize
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount

  const filteredPosts = selectedSection
    ? posts.filter((post) => post.section === selectedSection)
    : posts;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();

    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    const dateClass = isToday ? "today-date" : "";

    return {
      formattedDate: isToday
        ? `Hoy, ${date.getDate()} de ${date.toLocaleString("es-ES", {
            month: "long",
          })}`
        : `${date.getDate()} de ${date.toLocaleString("es-ES", {
            month: "long",
          })}`,
      dateClass,
    };
  };

  return (
    <div className="App">
      <header className={`App-header ${isShrunk ? "shrink" : ""}`}>
        <h1>Efemérides</h1>
      </header>
      {showMenu && (
        <nav className="sections-menu">
          {isMobile ? (
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
            >
              <option value="">Mostrar Todos</option>
              {sections.map((section) => (
                <option key={section} value={section}>
                  {section}
                </option>
              ))}
            </select>
          ) : (
            sections.map((section) => (
              <button
                key={section}
                onClick={() => setSelectedSection(section)}
                className={selectedSection === section ? "active" : ""}
              >
                {section}
              </button>
            ))
          )}
          {!isMobile && (
            <button onClick={() => setSelectedSection("")}>
              Mostrar Todos
            </button>
          )}
        </nav>
      )}
      <div className="posts-container">
        {filteredPosts.map((post) => {
          const { formattedDate, dateClass } = formatDate(
            post.date_of_publishing
          );

          return (
            <div key={post.id} className="post">
              <div className={`post-date ${dateClass}`}>
                <h4>{formattedDate}</h4>
              </div>
              <h2>{post.title}</h2>
              <img src={post.image_path} alt={post.title} />
              <p>{post.body}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
