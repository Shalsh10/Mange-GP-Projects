import "./GuestHomePage.css";

import {
  FaSearch,
  FaStar,
  FaLightbulb,
  FaBuilding,
  FaProjectDiagram,
} from "react-icons/fa";

export default function GuestHomePage() {

  /* ================= API DATA ================= */

  const apiData = {
    success: true,
    data: {
      user_status: "guest",

      project_rules: {
        min_team_size: 4,
        max_team_size: 6,
        project1_team_formation_deadline: "2026-06-10",
        supervisor_max_score: "40.00",
        defense_max_score: "40.00",
        passing_percentage: 50,
        total_score: 100,
        milestone_committee_total_score: 20,
      },

      featured_projects: [
        {
          title: "AI Smart Attendance System Team 1",
          department: "MM",
          year: null,
        },
      ],

      statistics: {
        projects: 1,
        ideas: 8,
        departments: 4,
      },

      project_guidelines: [
        "The idea should be original and innovative.",
        "The project must address a real-world problem.",
        "Project ideas from previous years cannot be repeated.",
      ],

      suggested_projects_ideas: [
        {
          id: 1,
          title: "AI Study Planner",
        },
        {
          id: 2,
          title: "Smart Clinic Queue System",
        },
        {
          id: 3,
          title: "Campus Lost & Found Platform",
        },
        {
          id: 4,
          title: "Cyber Awareness Game",
        },
      ],
    },
  };

  /* ================= DATA ================= */

  const {
    statistics,
    featured_projects,
    project_guidelines,
    suggested_projects_ideas,
    project_rules,
  } = apiData.data;

  return (
    <div className="guest-home">
      <div className="guest-container">

        {/* ================= Welcome Section ================= */}

        <div className="welcome-section">
          <h1>
            Welcome ! <span>👋🏻</span>
          </h1>

          <p>
            Explore graduation projects and discover new ideas.
          </p>

          {/* ================= Search ================= */}

          <div className="search-box">
            <FaSearch className="search-icon" />

            <input
              type="text"
              placeholder="Search Projects"
            />
          </div>

          {/* ================= Statistics ================= */}

          <div className="stats-box">

            <div className="stat-item">
              <FaProjectDiagram />

              <strong>{statistics.projects}+</strong>

              <span>Projects</span>
            </div>

            <div className="stat-item">
              <FaLightbulb />

              <strong>{statistics.ideas}+</strong>

              <span>Ideas</span>
            </div>

            <div className="stat-item">
              <FaBuilding />

              <strong>{statistics.departments}</strong>

              <span>Departments</span>
            </div>

          </div>
        </div>

        {/* ================= Featured Projects ================= */}

        <div className="featured-section">

          <div className="section-title">
            <FaStar />

            <h2>Featured Projects</h2>
          </div>

          <div className="projects-grid">

            {featured_projects.map((project, index) => (
              <div
                className="project-card"
                key={index}
              >

                <img
                  src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
                  alt={project.title}
                />

                <div className="project-info">

                  <h3>{project.title}</h3>

                  <p>
                    {project.department}
                    {project.year && ` • ${project.year}`}
                  </p>

                </div>
              </div>
            ))}

          </div>

          <a
            href="#"
            className="browse-btn"
          >
            Browse All Projects →
          </a>

        </div>

        {/* ================= Bottom Sections ================= */}

        <div className="bottom-sections">

          {/* ================= Guidelines ================= */}

          <div className="info-box">

            <div className="info-header">

              <div className="info-header-left">
                <span>📑</span>

                <h3>Project Guidelines</h3>
              </div>

              <span>⌃</span>

            </div>

            <div className="info-content">

              <ul className="info-list">

                {project_guidelines.map((item, index) => (
                  <li key={index}>
                    {item}
                  </li>
                ))}

                <li>
                  Minimum Team size is{" "}
                  {project_rules.min_team_size}{" "}
                  members and maximum is{" "}
                  {project_rules.max_team_size}.
                </li>

              </ul>

            </div>
          </div>

          {/* ================= Suggested Ideas ================= */}

          <div className="info-box">

            <div className="info-header">

              <div className="info-header-left">
                <FaLightbulb />

                <h3>Suggested Project Ideas</h3>
              </div>

            </div>

            <div className="info-content">

              <ul className="info-list">

                {suggested_projects_ideas.map((idea) => (
                  <li key={idea.id}>
                    {idea.title}
                  </li>
                ))}

              </ul>

              <a
                href="#"
                className="explore-link"
              >
                Explore All Ideas →
              </a>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}