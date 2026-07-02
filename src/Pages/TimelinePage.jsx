import "./TimelinePage.css";

import {
  useEffect,
  useState,
} from "react";

import {
  FaCalendarAlt,
} from "react-icons/fa";

import {
  MdAccessTime,
} from "react-icons/md";

import {
  IoLocationSharp,
} from "react-icons/io5";

import {
  HiMiniUsers,
} from "react-icons/hi2";

import Project from "../Services/Project.model";
import { useNavigate } from "react-router-dom";

import GuestTimelinePage from "./GuestTimelinePage";
function TimelinePage() {

  
const navigate = useNavigate();
  const [timeline, setTimeline] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchTimeline();
  }, []);

  const fetchTimeline = async () => {
    try {

      setLoading(true);

      const response =
        await Project.getMytimeline();

      setTimeline(response);
   
    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  const getStatusClass = (status) => {

    switch (status) {

      case "completed":
        return "completed";

      case "on_progress":
        return "progress";

      case "delayed":
        return "delayed";

      default:
        return "pending";
    }
  };

  const getStatusText = (status) => {

    switch (status) {

      case "completed":
        return "Completed";

      case "on_progress":
        return "On Progress";

      case "delayed":
        return "Delayed";

      default:
        return "Pending";
    }
  };
  const token = localStorage.getItem("token");

  if (!token) {
    return <GuestTimelinePage />;
  }
  return (

    <div className="timeline-page">

      <div className="timeline-header">

        <h2>
          Project Timeline Overview
        </h2>

        <p>
          Track the progress of key
          project milestones and phases.
        </p>

      </div>

      {loading ? (

        <p>
          Loading...
        </p>

      ) : (

        <div className="timeline-wrapper">

          <div className="timeline-line"></div>

          {timeline.map((course) => (

            <div
              key={course.project_course.id}
            >

             {course.milestones?.map(
                (item) => (

                  <div
                    className="timeline-item"
                    key={item.id}
                  >

                    <div className="timeline-dot"></div>

                   <div
  className="timeline-card"
  onClick={() =>
    navigate(`/milestones/${item.id}`)
  }
>

                      <div className="timeline-top">

                        <div>

                          <h3>
                            {item.title}
                          </h3>

                          <div className="timeline-date">

                            <FaCalendarAlt />

                            <span>
                              {
                                item.deadline
                              }
                            </span>

                          </div>

                        </div>

                        <div className="marks">

                          {
                            item.max_score
                          }
                          {" "}
                          Marks

                        </div>

                      </div>

                      <p className="timeline-description">

                        {
                          item.description
                        }

                      </p>

                      <div
                        className={`status-badge ${getStatusClass(
                          item.milestone_status
                        )}`}
                      >

                        {getStatusText(
                          item.milestone_status
                        )}

                      </div>

                    </div>

                  </div>
                )
              )}

              {/* FINAL DISCUSSION */}

              {course.final_discussion
                .exists && (

                <div className="timeline-item">

                  <div className="timeline-dot"></div>

                  <div className="timeline-card">

                    <div className="discussion-title">

                      Final Discussion

                    </div>

                    <div className="timeline-top">

                      <div>

                        <h3>

                          Backend Development & API Integration

                        </h3>

                      </div>

                      <div className="marks">

                        {
                          course
                            .final_discussion
                            .max_score
                        }
                        {" "}
                        Marks

                      </div>

                    </div>

                    <div className="discussion-info">

                      <div>

                        <FaCalendarAlt />

                        <span>

                          {
                            course
                              .final_discussion
                              .date
                          }

                        </span>

                      </div>

                      <div>

                        <MdAccessTime />

                        <span>

                          {
                            course
                              .final_discussion
                              .time
                          }

                        </span>

                      </div>

                      <div>

                        <IoLocationSharp />

                        <span>

                          {
                            course
                              .final_discussion
                              .location
                          }

                        </span>

                      </div>

                    </div>

                    <div className="doctors">

                      <HiMiniUsers />

                      <span>

                        {course.final_discussion.doctors.map(
                          (
                            doctor
                          ) =>
                            doctor.name
                        ).join(
                          " • "
                        )}

                      </span>

                    </div>

                    <p className="timeline-description">

                      Final discussion and project evaluation.

                    </p>

                    <div className="status-badge discussion">

                      Discussion

                    </div>

                  </div>

                </div>
              )}

              {/* FOOTER */}

              <div className="timeline-footer">

                <div>

                  Total Project Marks:
                  {" "}
                  <strong>

                    {
                      course
                        .course_total
                        .total_max_score
                    }
                    {" "}
                    Marks

                  </strong>

                </div>

                <div>

                  Supervisor Assessment:
                  {" "}
                  <strong>

                    {
                      course
                        .course_total
                        .supervisor_max_score
                    }
                    {" "}
                    Marks

                  </strong>

                </div>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default TimelinePage;