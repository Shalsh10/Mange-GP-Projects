import React, { useState, useEffect } from "react";
import "./Supervising.css";
import { useNavigate } from "react-router-dom";
import {
  MessageSquare,
  Clock,
  AlertTriangle,
  Calendar as CalendarIcon,
  Check,
  Search,
  FolderOpen,
  Star,
  Plus,
  Trophy,
  Megaphone,
  X,
  FileText,
} from "lucide-react";
import SendAnnouncementModal from "./SendAnnouncementModal";
import NewMeetingModal from "../Components/NewMeetingModal";
import { SupervisorService } from "../Services/SupervisorServices";
import { toast } from "react-hot-toast";

// Import local images
import blockchainImg from "../assets/blockchain_project.png";
import aiHealthImg from "../assets/ai_health_project.png";
import vrImg from "../assets/vr_project.png";
import iotImg from "../assets/iot_project.png";

const defaultTeams = [
  {
    team_id: "A",
    title: "Blockchain-based Certificate",
    description: "Secure academic credential verification using Ethereum smart contracts.",
    image: blockchainImg,
    badge: "On Track",
    badgeBg: "#DCFCE7",
    badgeColor: "#22C55E",
    tags: ["CS", "Blockchain", "Web"],
    ta: "Ahmed Fayez",
    status: "On Track",
    statusColor: "#22C55E",
    statusBg: "#DCFCE7",
    committee: ["Khaled Kareem", "Mariam Emad", "Abanoub Yaqoub"],
    avatars: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
    ],
  },
  {
    team_id: "B",
    title: "AI Mental Health Companion",
    description: "An AI-powered chatbot providing emotional support and mental health tracking.",
    image: aiHealthImg,
    badge: "Delayed",
    badgeBg: "#FEE2E2",
    badgeColor: "#EF4444",
    tags: ["CS", "Blockchain", "Web"],
    ta: "Mahmoud Nasr",
    status: "Delayed",
    statusColor: "#EF4444",
    statusBg: "#FEE2E2",
    committee: ["Khaled Kareem", "Mariam Emad", "Abanoub Yaqoub"],
    avatars: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
    ],
  },
  {
    team_id: "C",
    title: "VR Career Simulator",
    description: "Immersive virtual reality environments for professional training and skill testing.",
    image: vrImg,
    badge: "Pending Submission",
    badgeBg: "#FFEDD5",
    badgeColor: "#F97316",
    tags: ["CS", "Blockchain", "Web"],
    ta: "Ali Gaber",
    status: "Pending Submission",
    statusColor: "#F97316",
    statusBg: "#FFEDD5",
    committee: ["Khaled Kareem", "Mariam Emad", "Abanoub Yaqoub"],
    avatars: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
    ],
  },
  {
    team_id: "D",
    title: "IoT Smart Campus",
    description: "Monitoring campus facilities and energy consumption using real-time IoT sensors.",
    image: iotImg,
    badge: "On Track",
    badgeBg: "#DCFCE7",
    badgeColor: "#22C55E",
    tags: ["CS", "Blockchain", "Web"],
    ta: "Mohamed Wael",
    status: "On Track",
    statusColor: "#22C55E",
    statusBg: "#DCFCE7",
    committee: ["Khaled Kareem", "Mariam Emad", "Abanoub Yaqoub"],
    avatars: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
    ],
  },
  {
    team_id: "E",
    title: "VR Career Simulator",
    description: "Immersive virtual reality environments for professional training and skill testing.",
    image: vrImg,
    badge: "On Track",
    badgeBg: "#DCFCE7",
    badgeColor: "#22C55E",
    tags: ["CS", "Blockchain", "Web"],
    ta: "Ali Gaber",
    status: "On Track",
    statusColor: "#22C55E",
    statusBg: "#DCFCE7",
    committee: ["Khaled Kareem", "Mariam Emad", "Abanoub Yaqoub"],
    avatars: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
    ],
  },
];

const calendarWeeks = [
  ["29", "30", "31", "1", "2", "3", "4"],
  ["5", "6", "7", "8", "9", "10", "11"],
  ["12", "13", "14", "15", "16", "17", "18"],
  ["19", "20", "21", "22", "23", "24", "25"],
  ["26", "27", "28", "29", "30", "31", "1"],
];

export default function Supervising() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState(defaultTeams);
  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [gradeFilter, setGradeFilter] = useState("All");

  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [showNewMeeting, setShowNewMeeting] = useState(false);
  const [meetingTeam, setMeetingTeam] = useState(null);

  // Fetch supervised teams from API
  useEffect(() => {
    (async () => {
      try {
        const params = {};
        if (searchTerm) params.search = searchTerm;
        if (deptFilter !== "All") {
          params.department_id = deptFilter === "CS" ? 1 : 2;
        }
        if (statusFilter !== "All") {
          params.status = statusFilter.toLowerCase().replace(" ", "");
        }
        const res = await SupervisorService.getSupervisedTeams(params);
        console.log("Supervised Teams Response:", res);
        
        // Extract project list if backend returns it
        const fetched = res?.data?.projects || res?.projects || res?.data || res;
        if (Array.isArray(fetched) && fetched.length > 0) {
          // Map fetched elements to layout keys or adapt them
          const adapted = fetched.map(item => {
            const teamId = item.team_id || item.id || "A";
            // Map index pictures or values
            let localImg = blockchainImg;
            if (teamId === "B") localImg = aiHealthImg;
            else if (teamId === "C" || teamId === "E") localImg = vrImg;
            else if (teamId === "D") localImg = iotImg;

            return {
              team_id: teamId,
              title: item.project?.title || item.title || "Project Title",
              description: item.project?.description || item.description || "Description",
              image: localImg,
              badge: item.status || "On Track",
              badgeBg: item.status === "Delayed" ? "#FEE2E2" : (item.status === "Pending" ? "#FFEDD5" : "#DCFCE7"),
              badgeColor: item.status === "Delayed" ? "#EF4444" : (item.status === "Pending" ? "#F97316" : "#22C55E"),
              tags: item.project?.tags || item.tags || ["CS", "Blockchain", "Web"],
              ta: item.ta?.name || item.ta || "Teacher Assistant",
              status: item.status || "On Track",
              statusColor: item.status === "Delayed" ? "#EF4444" : (item.status === "Pending" ? "#F97316" : "#22C55E"),
              statusBg: item.status === "Delayed" ? "#FEE2E2" : (item.status === "Pending" ? "#FFEDD5" : "#DCFCE7"),
              committee: item.committee?.map(c => c.name || c) || ["Khaled Kareem", "Mariam Emad", "Abanoub Yaqoub"],
              avatars: item.students?.map(s => s.avatar) || [
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
              ],
            };
          });
          setTeams(adapted);
        }
      } catch (err) {
        console.warn("Failed fetching supervised teams from API, using default mock data. Error:", err);
      }
    })();
  }, [searchTerm, deptFilter, statusFilter]);

  // Filtering Logic
  const filteredTeams = teams.filter((t) => {
    const matchSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.ta.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.team_id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchDept =
      deptFilter === "All" ||
      t.tags.some(tag => tag.toLowerCase() === deptFilter.toLowerCase());

    const matchStatus =
      statusFilter === "All" ||
      t.status.toLowerCase().replace(" ", "") === statusFilter.toLowerCase().replace(" ", "");

    return matchSearch && matchDept && matchStatus;
  });

  // Calendar Day Interaction
  const handleCalendarDayClick = (day, idx) => {
    if (idx === 28) {
      toast.success("Meeting with Team A scheduled on Jan 26 at 11:00 AM 📅", { id: "cal-jan-26" });
    } else if (idx === 31) {
      toast.success("Meeting with Team C scheduled on Jan 29 at 02:00 PM 📅", { id: "cal-jan-29" });
    } else {
      toast.dismiss();
      toast(`No meetings scheduled for Jan ${day}.`, { icon: "ℹ️", id: `cal-jan-${day}` });
    }
  };

  // Open Message Chat Drawer/Toast
  const handleMessageTeam = (teamId) => {
    toast.success(`Opening chat with Team ${teamId}... 💬`, { id: `chat-${teamId}` });
    // Navigate to community chat
    setTimeout(() => {
      navigate("/all-discussions");
    }, 800);
  };

  return (
    <div className="sv-container">
      {/* ================= MAIN CONTENT ================= */}
      <div className="sv-main-content">
        {/* ================= HEADER ================= */}
        <header className="sv-header">
          <div className="sv-header-title">
            <h1>Supervising Teams</h1>
            <p>Academic Year 2025-2026</p>
          </div>

          <div className="sv-header-info">
            <div>
              <span className="sv-milestone-label">Current Milestone: </span>
              <span className="sv-milestone-value">User Interface Design & Prototyping</span>
            </div>
            <div className="sv-deadline-row">
              <CalendarIcon size={15} strokeWidth={2.4} />
              <span>Deadline: Jan 30, 2026</span>
            </div>
          </div>
        </header>

        {/* ================= STATS CARDS ================= */}
        <section className="sv-stats-grid">
          <div className="sv-stat-card" onClick={() => setStatusFilter("All")} style={{ cursor: "pointer" }}>
            <div className="sv-stat-top">
              <div className="sv-stat-top-left">
                <div className="sv-stat-icon-wrapper" style={{ color: "#0052CC" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <span>Total Teams</span>
              </div>
              <span className="sv-stat-arrow">&gt;</span>
            </div>
            <div className="sv-stat-value" style={{ color: "#0052CC" }}>5</div>
          </div>

          <div className="sv-stat-card" onClick={() => setStatusFilter("On Track")} style={{ cursor: "pointer" }}>
            <div className="sv-stat-top">
              <div className="sv-stat-top-left">
                <div className="sv-stat-icon-wrapper" style={{ color: "#22C55E" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
                </div>
                <span>On Track</span>
              </div>
              <span className="sv-stat-arrow">&gt;</span>
            </div>
            <div className="sv-stat-value" style={{ color: "#22C55E" }}>3</div>
          </div>

          <div className="sv-stat-card" onClick={() => setStatusFilter("Delayed")} style={{ cursor: "pointer" }}>
            <div className="sv-stat-top">
              <div className="sv-stat-top-left">
                <div className="sv-stat-icon-wrapper" style={{ color: "#EF4444" }}>
                  <AlertTriangle size={18} strokeWidth={2.5} />
                </div>
                <span>Delayed</span>
              </div>
              <span className="sv-stat-arrow">&gt;</span>
            </div>
            <div className="sv-stat-value" style={{ color: "#EF4444" }}>1</div>
          </div>

          <div className="sv-stat-card" style={{ cursor: "default" }}>
            <div className="sv-stat-top">
              <div className="sv-stat-top-left">
                <div className="sv-stat-icon-wrapper" style={{ color: "#718096" }}>
                  <CalendarIcon size={18} strokeWidth={2.5} />
                </div>
                <span>Meetings This Week</span>
              </div>
              <span className="sv-stat-arrow">&gt;</span>
            </div>
            <div className="sv-stat-value" style={{ color: "#4A5568" }}>2</div>
          </div>
        </section>

        {/* ================= FILTERS BAR ================= */}
        <section className="sv-filters-bar">
          <div className="sv-search-wrapper">
            <Search className="sv-search-icon" size={16} strokeWidth={2.4} />
            <input
              type="text"
              placeholder="Search by team, project, or student"
              className="sv-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="sv-filter-group">
            <span>Department:</span>
            <select
              className="sv-filter-select"
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="CS">CS</option>
              <option value="Blockchain">Blockchain</option>
              <option value="Web">Web</option>
            </select>
          </div>

          <div className="sv-filter-group">
            <span>Status:</span>
            <select
              className="sv-filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="On Track">On Track</option>
              <option value="Delayed">Delayed</option>
              <option value="Pending Submission">Pending Submission</option>
            </select>
          </div>

          <div className="sv-filter-group">
            <span>Grade:</span>
            <select
              className="sv-filter-select"
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="High">High</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </section>

        {/* ================= TEAMS LIST ================= */}
        <section className="sv-teams-list">
          {filteredTeams.length === 0 ? (
            <div className="sv-empty-state">No supervising teams match your filters.</div>
          ) : (
            filteredTeams.map((team) => (
              <div key={`${team.team_id}-${team.title}`} className="sv-card">
                {/* Image and status badge on left */}
                <div className="sv-card-left">
                  <img src={team.image} alt={team.title} className="sv-card-image" />
                  <div
                    className="sv-card-badge"
                    style={{ background: team.badgeBg, color: team.badgeColor }}
                  >
                    {team.status === "On Track" && <Check size={11} strokeWidth={3} />}
                    {team.status === "Delayed" && <AlertTriangle size={11} strokeWidth={3} />}
                    {team.status === "Pending Submission" && <Clock size={11} strokeWidth={3} />}
                    <span>{team.badge}</span>
                  </div>
                </div>

                {/* Details middle */}
                <div className="sv-card-middle">
                  <h2 className="sv-card-title">{team.title}</h2>
                  <p className="sv-card-desc">"{team.description}"</p>
                  
                  <div className="sv-card-tags-row">
                    <span className="sv-team-label">Team {team.team_id}:</span>
                    <div className="sv-tags-container">
                      {team.tags.map((tag) => (
                        <span key={tag} className="sv-chip">{tag}</span>
                      ))}
                    </div>
                  </div>

                  <div className="sv-avatars-row">
                    <div className="sv-avatars">
                      {team.avatars.map((url, idx) => (
                        <img key={idx} src={url} alt="student" className="sv-avatar" />
                      ))}
                      <div className="sv-avatar-more">+2</div>
                    </div>
                  </div>

                  <p className="sv-ta-info">
                    Teacher Assistant: <strong>{team.ta}</strong>
                  </p>
                </div>

                {/* Milestone Committee column */}
                <div className="sv-card-committee">
                  <h4 className="sv-committee-title">Milestone Committee :</h4>
                  <ul className="sv-committee-list">
                    {team.committee.map((member) => (
                      <li key={member}>{member}</li>
                    ))}
                  </ul>
                </div>

                {/* Actions column */}
                <div className="sv-card-actions">
                  <button className="sv-action-btn" onClick={() => handleMessageTeam(team.team_id)}>
                    <MessageSquare size={13} strokeWidth={2.4} />
                    <span>Message</span>
                  </button>
                  <button
                    className="sv-action-btn grade"
                    onClick={() => navigate(`/doctor/project-details?teamId=${team.team_id}&grade=true&type=supervised`)}
                  >
                    <Star size={13} strokeWidth={2.4} />
                    <span>Grade Project</span>
                  </button>
                  <button
                    className="sv-action-btn"
                    onClick={() => navigate(`/doctor/project-details?teamId=${team.team_id}&type=supervised`)}
                  >
                    <FolderOpen size={13} strokeWidth={2.4} />
                    <span>Open Files</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      </div>

      {/* ================= SIDEBAR ================= */}
      <aside className="sv-sidebar">
        {/* Calendar Section */}
        <div className="sv-side-section">
          <h3 className="sv-side-title">Upcoming Meetings</h3>
          <div className="sv-calendar-wrapper">
            <div className="sv-calendar-header">
              <button className="sv-calendar-arrow">&lt;</button>
              <div className="sv-calendar-title-text">January 2026</div>
              <button className="sv-calendar-arrow">&gt;</button>
            </div>

            <div className="sv-calendar-weekdays">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>

            <div className="sv-calendar-days">
              {calendarWeeks.flat().map((day, idx) => {
                const faded = idx < 3 || idx > 33;
                const active = idx === 28 || idx === 31; // Days 26 and 29

                return (
                  <span
                    key={`${day}-${idx}`}
                    className={`sv-calendar-day ${faded ? "sv-calendar-muted" : ""} ${
                      active ? "sv-calendar-active" : ""
                    }`}
                    onClick={() => handleCalendarDayClick(day, idx)}
                  >
                    {day}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recently Graded Section */}
        <div className="sv-side-section">
          <h3 className="sv-side-title">Recently Graded</h3>

          <div className="sv-graded-card">
            <div className="sv-graded-row">
              <div className="sv-graded-left">
                <Star className="sv-graded-star" size={13} fill="currentColor" />
                <div>
                  <h4 className="sv-graded-team">Team C</h4>
                  <p className="sv-graded-desc">AI Mental Health Companion</p>
                </div>
              </div>
              <div className="sv-grade-badge">92%</div>
            </div>
            <div className="sv-graded-date">Jan 26</div>
          </div>

          <div className="sv-graded-card">
            <div className="sv-graded-row">
              <div className="sv-graded-left">
                <Star className="sv-graded-star" size={13} fill="currentColor" />
                <div>
                  <h4 className="sv-graded-team">Team E</h4>
                  <p className="sv-graded-desc">VR Career Simulator</p>
                </div>
              </div>
              <div className="sv-grade-badge">86%</div>
            </div>
            <div className="sv-graded-date">Jan 23</div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="sv-side-section">
          <h3 className="sv-side-title">Recent Activity</h3>
          <div className="sv-activity-card">
            <div className="sv-activity-row">
              <FileText className="sv-activity-icon" size={14} />
              <div className="sv-activity-copy">
                <div>
                  <span className="sv-activity-team-link" style={{ color: "#22C55E" }}>
                    Team A
                  </span>{" "}
                  submitted UI Prototype
                </div>
                <div className="sv-activity-time">30 mints ago</div>
              </div>
            </div>

            <div className="sv-activity-row">
              <svg className="sv-activity-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              <div className="sv-activity-copy">
                <div>
                  <span className="sv-activity-team-link" style={{ color: "#22C55E" }}>
                    Team C
                  </span>{" "}
                  uploaded a file
                </div>
                <div className="sv-activity-time">2 hours ago</div>
              </div>
            </div>

            <div className="sv-activity-row">
              <CalendarIcon className="sv-activity-icon" size={14} />
              <div className="sv-activity-copy">
                <div>
                  <span className="sv-activity-team-link" style={{ color: "#0052CC" }}>
                    Team B
                  </span>{" "}
                  requested a meeting
                </div>
                <div className="sv-activity-time">1 day ago</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="sv-side-section">
          <h3 className="sv-side-title">Quick Actions</h3>
          <div className="sv-actions-card">
            <div
              className="sv-action-link"
              onClick={() => {
                setMeetingTeam(null);
                setShowNewMeeting(true);
              }}
            >
              <CalendarIcon size={14} />
              <span>Schedule Meeting</span>
            </div>
            <div className="sv-action-link" onClick={() => setShowAnnouncement(true)}>
              <Megaphone size={14} />
              <span>Send Announcement</span>
            </div>
            <div className="sv-action-link" onClick={() => navigate("/doctor/milestones")}>
              <Trophy size={14} />
              <span>View All Milestones</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ================= MODALS ================= */}
      {showAnnouncement && (
        <SendAnnouncementModal onClose={() => setShowAnnouncement(false)} />
      )}

      {showNewMeeting && (
        <NewMeetingModal
          teamId={meetingTeam?.team_id}
          teamName={meetingTeam?.title}
          onClose={() => setShowNewMeeting(false)}
          onSet={(payload) => {
            console.log("New meeting set:", payload);
          }}
        />
      )}
    </div>
  );
}