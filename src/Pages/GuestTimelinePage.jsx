import { useEffect, useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import Project from "../Services/Project.model";
import "./TimelinePage.css";

function GuestTimelinePage() {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMilestones();
  }, []);

  const fetchMilestones = async () => {
    try {
      setLoading(true);

      const response =
        await Project.getMyGuestMilestones();

      setMilestones(response || []);
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

      default:
        return "Pending";
    }
  };

  return (
    <div className="timeline-page">
      <div className="timeline-header">
        <h2>Project Timeline Overview</h2>

        <p>
          Track the progress of key project milestones and
          phases. Each card represents a significant event
          in the project lifecycle.
        </p>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="timeline-wrapper">

          <div className="timeline-line" />

          {milestones.map((item) => (
            <div
              className="timeline-item"
              key={item.id}
            >
              <div className="timeline-dot" />

              <div className="timeline-card guest-card">

                <div className="timeline-top">
                  <div>
                    <h3>{item.title}</h3>

                    <div className="timeline-date">
                      <FaCalendarAlt />

                      <span>
                        {item.deadline}
                      </span>
                    </div>
                  </div>

                  <div className="marks">
                    {item.max_score} Marks
                  </div>
                </div>

                <p className="timeline-description">
                  {item.description}
                </p>

                <div
                  className={`status-badge ${getStatusClass(
                    item.status
                  )}`}
                >
                  {getStatusText(item.status)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GuestTimelinePage;