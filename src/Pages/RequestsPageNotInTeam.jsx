import { useEffect, useState } from "react";
import Requests from "../Services/Requests.model";
import "./RequestsPageNotInTeam.css";

export default function RequestsPageNotInTeam() {
  const [activeTab, setActiveTab] = useState("received");
  const [filterType, setFilterType] = useState("all");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

const fetchRequests = async () => {
  try {
    setLoading(true);

    let response;

    if (activeTab === "sent") {
      response = await Requests.getSentRequests();
    } else {
      response = await Requests.getReceivedRequests();
    }

    setRequests(response?.data|| []);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchRequests();
  }, [activeTab, filterType]);

  const handleAccept = async (id) => {
    await Requests.requestRespond(id, "accepted");
    fetchRequests();
  };

  const handleReject = async (id) => {
    await Requests.requestRespond(id, "rejected");
    fetchRequests();
  };

  const filteredRequests = requests.filter((request) => {
    const name =
      request?.team?.name ||
      request?.from_user?.name ||
      "";
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });
const displayedRequests = filteredRequests.filter((request) => {
  if (filterType === "students") {
    return request.request_type === "team_form";
  }

  if (filterType === "teams") {
    return request.request_type === "team_join";
  }

  return true;
});
const isTeamRequest = (request) =>
  request?.request_type === "team_join";

const getMembers = (request) => {
  if (request.team?.members?.length > 0) {
    return request.team.members;
  }

  if (request.to_user) {
    return [request.to_user];
  }

  if (request.from_user) {
    return [request.from_user];
  }

  return [];
};

  return (
    <div className="requests-page">

      {/* Header */}
      <div className="header">
        <div className="header-left">
          <button className="back-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <h2>Requests</h2>
        </div>
        <button className="send-btnn">Send New Requests</button>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={activeTab === "received" ? "active" : ""}
          onClick={() => setActiveTab("received")}
        >
          Received
        </button>
        <button
          className={activeTab === "sent" ? "active" : ""}
          onClick={() => setActiveTab("sent")}
        >
          Sent
        </button>
      </div>

      {/* Content */}
      <div className="content">

        {/* Search */}
        <div className="search-wrapper">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24"
            fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters */}
        {activeTab === "received" && (
          <div className="filters">
            <button
              className={filterType === "all" ? "active" : ""}
              onClick={() => setFilterType("all")}
            >
              All
            </button>
            <button
              className={filterType === "teams" ? "active" : ""}
              onClick={() => setFilterType("teams")}
            >
              Teams
            </button>
            <button
              className={filterType === "students" ? "active" : ""}
              onClick={() => setFilterType("students")}
            >
              Students
            </button>
          </div>
        )}

        {/* List */}
        {loading ? (
          <p className="loading-text">Loading...</p>
        ) : (
         displayedRequests.map((request) => {
            const isTeam = isTeamRequest(request);
            const members = getMembers(request);

            return (
              <div className="request-card" key={request.id}>

                <div className="request-info">

                  {/* Label */}
                  <div className={`request-label ${isTeam ? "team" : "student"}`}>
                    {isTeam ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                      </svg>
                    )}
                    <span>{isTeam ? "Team Invite" : "Student Request"}</span>
                  </div>

                  {/* Members */}
                  <div className="members-row">
                    {members.map((member, i) => (
                      <div className="member" key={i}>
                        <div className="avatar">
                          {member.profile_image ? (
                            <img src={member.profile_image} alt="" />
                          ) : (
                            member.name?.charAt(0)
                          )}
                        </div>
                        <span className="member-name">{member.name}</span>
                        <span className="member-track">{member.track}</span>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Actions */}
{activeTab === "received" ? (
  request.status === "pending" && (
    <div className="actions">
      <button
        className="accept"
        onClick={() => handleAccept(request.id)}
      >
        Accept
      </button>

      <button
        className="reject"
        onClick={() => handleReject(request.id)}
      >
        Reject
      </button>
    </div>
  )
) : (
  <div className={`sent-status ${request.status}`}>
    {request.status === "accepted"
      ? "Accepted"
      : request.status === "rejected"
      ? "Declined"
      : "Pending"}
  </div>
)}

              </div>
            );
          })
        )}

        {!loading && filteredRequests.length === 0 && (
          <div className="empty-state">
            <h3>No Requests Yet</h3>
            <p>You don't have any requests right now.</p>
          </div>
        )}

      </div>
    </div>
  );
}
