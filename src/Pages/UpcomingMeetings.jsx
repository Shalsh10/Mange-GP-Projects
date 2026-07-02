import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SupervisorService } from "../Services/SupervisorServices";
import { toast } from "react-hot-toast";
import {
  Calendar,
  Clock,
  Link2,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import "./UpcomingMeetings.css";

// ─── New Meeting Modal ───────────────────────────────────────────────────────
function NewMeetingModal({ teams, onClose, onSuccess }) {
  const today = new Date();
  const [selectedProject, setSelectedProject] = useState("");
  const [meetingName, setMeetingName]         = useState("");
  const [currentMonth, setCurrentMonth]       = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDate, setSelectedDate]       = useState(null);
  const [time, setTime]                       = useState("10:00 AM");
  const [meetingLink, setMeetingLink]         = useState("");
  const [loading, setLoading]                 = useState(false);

  const DAYS   = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  /* build calendar grid */
  const buildCalendar = () => {
    const year  = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const first = new Date(year, month, 1);
    // getDay() → 0=Sun … 6=Sat; we want Mon=0
    const startOffset = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return { cells, year, month };
  };

  const { cells, year, month } = buildCalendar();

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const isToday = (d) => {
    return d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };
  const isSelected = (d) => {
    if (!selectedDate || !d) return false;
    return selectedDate.getDate() === d && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;
  };

  const handleSet = async () => {
    if (!selectedProject || !meetingName || !selectedDate) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      setLoading(true);
      const dateStr = `${year}-${String(month + 1).padStart(2,"0")}-${String(selectedDate.getDate()).padStart(2,"0")}`;
      await SupervisorService.scheduleMeeting({
        team_id:      selectedProject,
        meeting_name: meetingName,
        date:         dateStr,
        time,
        link:         meetingLink,
      });
      toast.success("Meeting scheduled successfully! ✅");
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.message || "Failed to schedule meeting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="nm-overlay" onClick={(e) => e.target === e.currentTarget && !loading && onClose()}>
      <div className="nm-modal">
        {/* Header */}
        <div className="nm-header">
          <span className="nm-title">New Meeting</span>
          <button className="nm-close" onClick={onClose} disabled={loading}>
            <X size={16} />
          </button>
        </div>

        {/* Select Project */}
        <div className="nm-field">
          <label className="nm-label">Select Project</label>
          <div className="nm-select-wrap">
            <select
              className="nm-select"
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
            >
              <option value="">— Choose a project —</option>
              {teams.map((t) => (
                <option key={t.team_id || t.id} value={t.team_id || t.id}>
                  {t.project?.title || t.name || `Team ${t.team_id || t.id}`}
                </option>
              ))}
            </select>
            <span className="nm-arrow">▾</span>
          </div>
        </div>

        {/* Meeting Name */}
        <div className="nm-field">
          <label className="nm-label">Meeting Name</label>
          <input
            className="nm-input"
            placeholder="Design Discussion"
            value={meetingName}
            onChange={(e) => setMeetingName(e.target.value)}
          />
        </div>

        {/* Calendar */}
        <div className="nm-calendar">
          <div className="nm-cal-nav">
            <button className="nm-nav-btn" onClick={prevMonth}>
              <ChevronLeft size={15} />
            </button>
            <span className="nm-cal-month">{MONTHS[month]} {year}</span>
            <button className="nm-nav-btn" onClick={nextMonth}>
              <ChevronRight size={15} />
            </button>
          </div>
          <div className="nm-cal-grid">
            {DAYS.map((d) => <span key={d} className="nm-cal-day-label">{d}</span>)}
            {cells.map((d, i) => (
              <button
                key={i}
                className={[
                  "nm-cal-cell",
                  !d ? "nm-cal-empty" : "",
                  d && isToday(d) && !isSelected(d) ? "nm-cal-today" : "",
                  d && isSelected(d) ? "nm-cal-selected" : "",
                ].join(" ")}
                onClick={() => d && setSelectedDate(new Date(year, month, d))}
                disabled={!d}
              >
                {d || ""}
              </button>
            ))}
          </div>
        </div>

        {/* Time */}
        <div className="nm-field">
          <label className="nm-label">Time</label>
          <div className="nm-time-field">
            <span className="nm-clock-icon">
              <Clock size={15} />
            </span>
            <select
              className="nm-time-select"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            >
              {["08:00 AM","09:00 AM","10:00 AM","11:00 AM","12:00 PM","01:00 PM","02:00 PM","03:00 PM","04:00 PM","05:00 PM"].map(t=>(
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <span className="nm-arrow" style={{ right: 16 }}>▾</span>
          </div>
        </div>

        {/* Link */}
        <div className="nm-field">
          <label className="nm-label">Attach Link :</label>
          <div className="nm-link-wrap">
            <span className="nm-link-icon">
              <Link2 size={15} />
            </span>
            <input
              className="nm-link-input"
              placeholder="Add Meeting Link"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="nm-btns">
          <button className="nm-cancel" onClick={onClose} disabled={loading}>Cancel</button>
          <button className="nm-set" onClick={handleSet} disabled={loading}>
            {loading ? "Saving…" : "Set"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
const TEAM_STYLES = [
  { color: "#2563eb", bg: "#eff6ff" }, // Team C Style (blue)
  { color: "#16a34a", bg: "#f0fdf4" }, // Team A Style (green)
  { color: "#db2777", bg: "#fdf2f8" }, // Team D Style (pink)
  { color: "#d97706", bg: "#fffbeb" },
  { color: "#dc2626", bg: "#fef2f2" },
];

export default function UpcomingMeetings() {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState([]);
  const [teams, setTeams]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [meetingsRes, teamsRes] = await Promise.all([
        SupervisorService.getComingMeetings(),
        SupervisorService.getMeetingTeamsList(),
      ]);

      console.log("📅 Meetings Response:", meetingsRes);
      console.log("👥 Teams Response:", teamsRes);

      const parsedMeetings =
        Array.isArray(meetingsRes) ? meetingsRes :
        Array.isArray(meetingsRes?.data) ? meetingsRes.data :
        Array.isArray(meetingsRes?.meetings) ? meetingsRes.meetings : [];

      const parsedTeams =
        Array.isArray(teamsRes) ? teamsRes :
        Array.isArray(teamsRes?.data) ? teamsRes.data :
        Array.isArray(teamsRes?.teams) ? teamsRes.teams : [];

      setMeetings(parsedMeetings);
      setTeams(parsedTeams);
    } catch (err) {
      console.error("❌ Failed to load data:", err);
      toast.error("Failed to load data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div className="um-page">
      {/* Back + Title */}
      <div className="um-header">
        <button className="um-back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} />
        </button>
        <h1 className="um-title">Upcoming Meetings</h1>
      </div>

      {/* Card */}
      <div className="um-card">
        <p className="um-count">
          Meetings ({loading ? "…" : meetings.length})
        </p>

        {loading ? (
          <p className="um-loading">Loading…</p>
        ) : meetings.length === 0 ? (
          <p className="um-empty">No upcoming meetings scheduled.</p>
        ) : (
          meetings.map((m, idx) => {
            const tStyle = TEAM_STYLES[idx % TEAM_STYLES.length];
            return (
              <div key={m.id || idx} className="um-meeting-item">
                <p className="um-meeting-name">{m.meeting_name || m.name || "Meeting"}</p>

                <div className="um-meeting-row">
                  <span className="um-meeting-label">Team</span>
                  <span
                    className="um-meeting-team"
                    style={{ color: tStyle.color, backgroundColor: tStyle.bg }}
                  >
                    {m.team?.name || m.team_name || `Team ${idx + 1}`}
                  </span>
                </div>

                <div className="um-meeting-meta">
                  <span className="um-meta-icon">
                    <Calendar size={13} />
                  </span>
                  <span className="um-meta-text">
                    {m.date
                      ? new Date(m.date).toLocaleDateString("en-US", { weekday:"short", year:"numeric", month:"short", day:"numeric" })
                      : "—"}
                  </span>
                  <span className="um-meta-icon um-ml">
                    <Clock size={13} />
                  </span>
                  <span className="um-meta-text">{m.time || "—"}</span>
                </div>

                {m.link && (
                  <div className="um-meeting-link-row">
                    <span className="um-link-icon">
                      <Link2 size={13} />
                    </span>
                    <a className="um-link" href={m.link} target="_blank" rel="noreferrer">{m.link}</a>
                  </div>
                )}
              </div>
            );
          })
        )}

        <div className="um-add-btn-wrap">
          <button className="um-add-btn" onClick={() => setShowModal(true)}>
            + Add New Meeting
          </button>
        </div>
      </div>

      {showModal && (
        <NewMeetingModal
          teams={teams}
          onClose={() => setShowModal(false)}
          onSuccess={fetchData}
        />
      )}
    </div>
  );
}
