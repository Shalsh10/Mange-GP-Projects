import "./TeamPage.css";

import {
  FaCheckCircle,
} from "react-icons/fa";

import {
  useEffect,
  useState,
} from "react";

import { IoClose } from "react-icons/io5";

import { toast } from "react-hot-toast";
import Team from "../Services/Team.model";
import { useNavigate } from "react-router-dom";
function TeamPage() {

  const [note, setNote] = useState("");
const navigate = useNavigate();
  const [teamData, setTeamData] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [hoveredMember, setHoveredMember] =
    useState(null);

  const [showLeaveModal, setShowLeaveModal] =
    useState(false);

  useEffect(() => {

    fetchTeam();

  }, []);

  const fetchTeam = async () => {

    try {

      setLoading(true);

      const response =
        await Team.getTeamMembers();

      setTeamData(response);

      console.log("response", response);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };
const handleLeaveTeam = async () => {

  try {

    const response =
      await Team.leaveTeam();

    console.log(response);

    toast.success("You left the team");

    setShowLeaveModal(false);

  } catch (error) {

    console.log("FULL ERROR", error);

    console.log(
      "SERVER RESPONSE",
      error?.response?.data
    );

    toast.error(
      error?.response?.data?.message ||
      "Failed to leave team"
    );
  }
};
  const handleSendNote = async () => {

    try {

      const data = {
        note: note
      };

      const response =
        await Team.leaveNote(data);

      console.log(response);

      toast.success("Note sent successfully");

      setNote("");

    } catch (error) {

      console.log(error);

      toast.error("Failed to send note");
    }
  };

  // LEAVE TEAM


  if (loading) {

    return (
      <div className="loading">
        Loading...
      </div>
    );
  }

  return (

    <div className="team-page">

      {/* HEADER */}

      <div className="project-header">

        <h2>
          {teamData?.project?.title || "My Team"}
        </h2>

        <div className="project-status">

          <FaCheckCircle />

          <span>
            Completed
          </span>

        </div>

      </div>

      {/* IMAGE */}

      <img
        src={
          teamData?.project?.image_url ||
          "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1200"
        }
        alt=""
        className="project-banner"
      />

      {/* DESCRIPTION */}

      <p className="project-description">

        {teamData?.project?.description || "No project assigned yet"}

      </p>

      {/* MEMBERS */}

      <div className="section-header">

        <h3>
          Members
        </h3>

     <span
  className="section-link"
  onClick={() =>
    navigate("/received")
  }
>
  Requests
</span>

      </div>

      <div className="members-row">

        {teamData?.members?.map(
          (member) => (

            <div
              className="member-wrapper"
              key={member.id}
              onMouseEnter={() =>
                setHoveredMember(member)
              }
              onMouseLeave={() =>
                setHoveredMember(null)
              }
            >

              <div className="member-card-small">

                <img
                  src={`https://i.pravatar.cc/150?u=${member.id}`}
                  alt=""
                />

                <span>
                  {member.name}
                </span>

              </div>

              {/* HOVER CARD */}

              {hoveredMember?.id === member.id && (

                <div className="hover-card">

                  <div className="hover-top">

                    <img
                      src={`https://i.pravatar.cc/150?u=${member.id}`}
                      alt=""
                    />

                    <div>

                      <h4>
                        {member.name}
                      </h4>

                      <p>
                        {member.track}
                      </p>

                    </div>

                  </div>

                  <div className="hover-info">

                    <p>
                      <strong>Email:</strong>
                      {" "}
                      {member.email}
                    </p>

                    <p>
                      <strong>Role:</strong>
                      {" "}
                      {member.role}
                    </p>

                    <p>
                      <strong>Department:</strong>
                      {" "}
                      {member.department || "-"}
                    </p>

                  </div>

                </div>
              )}

            </div>
          )
        )}

      </div>

      {/* SUPERVISION */}

      <div className="section-header">

        <h3>
          Supervision
        </h3>

        <span className="section-link">
          Choose Supervision
        </span>

      </div>

      <div className="members-row">

        {teamData?.supervisors?.map(
          (supervisor) => (

            <div
              className="member-card-small"
              key={supervisor.id}
            >

              <img
                src={`https://i.pravatar.cc/150?u=${supervisor.id}`}
                alt=""
              />

              <span>
                {supervisor.name}
              </span>

            </div>
          )
        )}

      </div>

      {/* NOTE */}

      <textarea
        className="team-note"
        placeholder="Leave a note to your team..."
        value={note}
        onChange={(e) =>
          setNote(e.target.value)
        }
      />

      <div className="buttons-row">

        <button
          className="send-btn"
          onClick={handleSendNote}
        >
          Send Note
        </button>

        <button
          className="leave-btn"
          onClick={() =>
            setShowLeaveModal(true)
          }
        >
          Leave Team
        </button>

      </div>

      {/* LEAVE MODAL */}

      {showLeaveModal && (

        <div className="modal-overlay">

          <div className="leave-modal">

            <button
              className="close-modal"
              onClick={() =>
                setShowLeaveModal(false)
              }
            >
              <IoClose />
            </button>

            <div className="leave-icon">
              ↩
            </div>

            <h3>
              Leave My Team
            </h3>

            <p>
              Are you sure you want to leave your team ?
            </p>

            <div className="modal-actions">

              <button
                className="cancel-btn"
                onClick={() =>
                  setShowLeaveModal(false)
                }
              >
                Cancel
              </button>

              <button
                className="confirm-leave-btn"
                onClick={handleLeaveTeam}
              >
                Leave
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default TeamPage;