import {
  FaSearch,
  FaRegFileAlt,
  FaBookOpen,
  FaUserFriends,
  FaCalendarAlt,
  FaClock,
  FaLink,
} from "react-icons/fa";

import { HiOutlineSpeakerphone } from "react-icons/hi";
import { MdErrorOutline, MdExpandMore } from "react-icons/md";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import landing from "../assets/homee2.jpg";
import Auth from "../services/Auth.model";
import "./Home.css";
function Home() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [homeData, setHomeData] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      const role = (user?.role || user?.role_code || "").toLowerCase();
      if (role === "admin") {
        navigate("/management", { replace: true });
        return;
      } else if (role === "doctor" || role === "supervisor" || role === "doctor/supervisor" || role === "doctor_supervisor") {
        navigate("/doctor/dashboard", { replace: true });
        return;
      }
    }

    let mounted = true;

    const fetchHome = async () => {
      try {
        const res = await Auth.getHome();

        if (mounted) {
          setHomeData(res);
        }
      } catch (err) {
        console.log(err);
      }
    };

    fetchHome();

    return () => {
      mounted = false;
    };
  }, [navigate]);



  if (!homeData) return null;

  const {
    user,
    project_guidelines,
    next_deadline,
    last_feedback,
    important_notes,
    supervisors,
    milestone_committee,
  } = homeData;

  return (
    <div className="home-page">
      <div className="home-container">
        {/* Hero */}
        <div className="hero">
          <img src={landing} alt="" />
          <div className="overlay" />

          <div className="hero-content">
            <h2>Welcome {user?.name} 👋🏻</h2>

            <div className="search-boxx">
              <FaSearch />
              <input
                type="text"
                placeholder="Search Projects or Students"
              />
            </div>
          </div>
        </div>

        {/* Project */}
        <div className="project-section">
          <h3>Project</h3>

          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit,
            sed do eiusmod tempor incididunt ut labore et dolore.
          </p>

          {/* Guidelines */}
          <div className="guidelines-card">
            <div
              className="guidelines-header"
              onClick={() => setOpen(!open)}
            >
              <div className="title">
                <FaRegFileAlt />
                <span>Project Guidelines</span>
              </div>

              <MdExpandMore
                className={open ? "rotate" : ""}
              />
            </div>

            {open && (
              <div className="guidelines-body">
                <ul>
                  {project_guidelines?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Deadline */}
          {next_deadline && (
            <div className="deadline-alert">
              <MdErrorOutline />
              <span>{next_deadline}</span>
            </div>
          )}

          {/* Upcoming Meetings */}
          <div className="meeting-card">
            <h4>Upcoming Meetings</h4>

            {important_notes?.map((item, index) => (
              <div className="meeting-item" key={index}>
                <div className="meeting-left">
                  <div className="meeting-avatar">
                    📅
                  </div>

                  <div>
                    <h5>{item.text}</h5>

                    <span>{item.location}</span>
                  </div>
                </div>

                <div className="meeting-center">
                  <div>
                    <FaCalendarAlt />
                    {item.date}
                  </div>

                  <div>
                    <FaClock />
                    {item.time}
                  </div>
                </div>

                <div className="meeting-link">
                  <FaLink />
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Cards */}
          <div className="cards-grid">
            {/* Feedback */}

            <div className="info-card">
              <div className="card-title">
                <FaBookOpen />
                Last Feedback
              </div>

              <div className="feedback-box">
                {last_feedback?.text}
              </div>

              <div className="card-footer">
                <div>
                  Created By
                  <b>{last_feedback?.feedback_by?.name}</b>
                </div>

                <span>
                  {last_feedback?.feedback_at}
                </span>
              </div>
            </div>

            {/* Notes */}

            <div className="info-card">
              <div className="card-title">
                <HiOutlineSpeakerphone />
                Important Notes
              </div>

              <ul className="notes-list">
                {important_notes?.map((note, i) => (
                  <li key={i}>
                    {note.text}
                  </li>
                ))}
              </ul>
            </div>

            {/* Supervisors */}

            <div className="info-card">
              <div className="card-title">
                <FaUserFriends />
                Supervisors
              </div>

              {supervisors?.map((item) => (
                <div className="person-row" key={item.id}>
                  <img
                    src={`https://i.pravatar.cc/40?u=${item.id}`}
                    alt=""
                  />

                  <span>{item.name}</span>
                </div>
              ))}
            </div>

            {/* Committee */}

            <div className="info-card">
              <div className="card-title">
                <FaUserFriends />
                Supervising Committee
              </div>

              {milestone_committee?.members?.map(
                (member) => (
                  <div
                    className="person-row"
                    key={member.id}
                  >
                    <img
                      src={`https://i.pravatar.cc/40?u=${member.id}`}
                      alt=""
                    />

                    <span>{member.name}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;