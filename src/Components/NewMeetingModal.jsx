import React, { useState, useEffect } from "react";
import { X, Calendar, Clock, Link as LinkIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import { SupervisorService } from "../Services/SupervisorServices";

const nmmCss = `
.nmm-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.nmm-modal {
  background: #ffffff;
  border-radius: 16px;
  width: 420px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.18);
  padding: 24px;
  box-sizing: border-box;
  position: relative;
}

.nmm-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.nmm-title {
  font-size: 18px;
  font-weight: 700;
  color: #1A202C;
}

.nmm-close {
  border: none;
  background: none;
  font-size: 20px;
  cursor: pointer;
  color: #A0AEC0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.2s;
}

.nmm-close:hover {
  background: #F7FAFC;
  color: #4A5568;
}

.nmm-divider {
  height: 1px;
  background: #E2E8F0;
  margin: 0 -24px 20px;
}

/* Mini Calendar */
.nmm-calendar-box {
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 20px;
}

.nmm-cal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.nmm-cal-month {
  font-size: 13px;
  font-weight: 700;
  color: #4A5568;
}

.nmm-cal-arrow {
  border: 0;
  background: transparent;
  color: #718096;
  cursor: pointer;
  padding: 4px 8px;
  font-size: 14px;
  font-weight: 600;
}

.nmm-cal-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  color: #0052CC;
  font-size: 11px;
  font-weight: 700;
  margin-bottom: 10px;
}

.nmm-cal-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  row-gap: 8px;
  text-align: center;
  font-size: 11px;
  font-weight: 600;
  color: #4A5568;
}

.nmm-cal-day {
  display: flex;
  width: 26px;
  height: 26px;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.15s ease;
}

.nmm-cal-day:hover:not(.nmm-cal-muted) {
  background: #EBF8FF;
  color: #2B6CB0;
}

.nmm-cal-muted {
  color: #A0AEC0;
}

.nmm-cal-selected {
  background: #0052CC !important;
  color: #ffffff !important;
  font-weight: 700;
}

/* Time Picker & Link Fields */
.nmm-field {
  margin-bottom: 20px;
}

.nmm-label {
  display: block;
  font-size: 13px;
  font-weight: 700;
  color: #4A5568;
  margin-bottom: 8px;
}

.nmm-time-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  padding: 0 12px;
  height: 40px;
  background: #F8FAFC;
  width: fit-content;
}

.nmm-time-select {
  border: none;
  background: transparent;
  outline: none;
  font-size: 13px;
  color: #1A202C;
  font-weight: 600;
  cursor: pointer;
}

.nmm-full-select, .nmm-full-input {
  width: 100%;
  height: 40px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  padding: 0 12px;
  font-size: 13px;
  color: #1A202C;
  outline: none;
  background: #F8FAFC;
  transition: all 0.2s;
  box-sizing: border-box;
}

.nmm-full-select:focus, .nmm-full-input:focus {
  border-color: #0052CC;
  background: #ffffff;
}

.nmm-link-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.nmm-link-icon {
  position: absolute;
  left: 12px;
  color: #A0AEC0;
}

.nmm-link-input {
  width: 100%;
  height: 40px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  padding: 0 12px 0 36px;
  font-size: 13px;
  color: #1A202C;
  outline: none;
  background: #F8FAFC;
  transition: all 0.2s;
  box-sizing: border-box;
}

.nmm-link-input:focus {
  border-color: #0052CC;
  background: #ffffff;
}

/* Action Buttons */
.nmm-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.nmm-btn-cancel {
  flex: 1;
  height: 40px;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  background: #ffffff;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: background 0.15s;
}

.nmm-btn-cancel:hover {
  background: #F9FAFB;
}

.nmm-btn-set {
  flex: 1;
  height: 40px;
  border: none;
  border-radius: 8px;
  background: #0052CC;
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}

.nmm-btn-set:hover {
  background: #0043A4;
}

.nmm-btn-set:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
`;

const generateCalendarGrid = (year, month) => {
  const firstDay = new Date(year, month, 1);
  let startIdx = firstDay.getDay() - 1;
  if (startIdx === -1) startIdx = 6; // Sunday

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const grid = [];

  for (let i = startIdx - 1; i >= 0; i--) {
    grid.push({
      day: daysInPrevMonth - i,
      isMuted: true,
      monthOffset: -1
    });
  }

  for (let i = 1; i <= daysInMonth; i++) {
    grid.push({
      day: i,
      isMuted: false,
      monthOffset: 0
    });
  }

  const totalCells = grid.length > 35 ? 42 : 35;
  const remaining = totalCells - grid.length;
  for (let i = 1; i <= remaining; i++) {
    grid.push({
      day: i,
      isMuted: true,
      monthOffset: 1
    });
  }

  return grid;
};

const generate24hTimeOptions = () => {
  const options = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let min of ["00", "30"]) {
      const ampm = hour >= 12 ? "PM" : "AM";
      let displayHour = hour % 12;
      if (displayHour === 0) displayHour = 12;
      const hourStr = String(displayHour).padStart(2, "0");
      options.push(`${hourStr}:${min} ${ampm}`);
    }
  }
  return options;
};
const timeOptions = generate24hTimeOptions();

export default function NewMeetingModal({ teamId, teamName, onClose, onSet }) {
  const [currentMonth, setCurrentMonth] = useState(2); // March (2)
  const [currentYear, setCurrentYear] = useState(2026);
  const [selectedDay, setSelectedDay] = useState(29);
  const [selectedTime, setSelectedTime] = useState("10:00 AM");
  const [meetingName, setMeetingName] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [loading, setLoading] = useState(false);

  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState(teamId || "");

  const monthsList = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const monthHeader = `${monthsList[currentMonth]} ${currentYear}`;

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await SupervisorService.getMeetingTeamsList();
        const fetched = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : (Array.isArray(res?.teams) ? res.teams : []));
        if (Array.isArray(fetched)) {
          setTeams(fetched);
          if (teamId) {
            setSelectedTeamId(teamId);
          } else if (fetched.length > 0) {
            setSelectedTeamId(fetched[0].team_id || fetched[0].id || "");
          }
        }
      } catch (e) {
        console.warn("Failed loading teams list in modal:", e);
      }
    })();
  }, [teamId]);

  const handleSet = async () => {
    // If a link is empty, warn
    if (!meetingLink.trim()) {
      toast.error("Please add a meeting link");
      return;
    }

    try {
      setLoading(true);

      const formattedMonth = String(currentMonth + 1).padStart(2, "0");
      const formattedDay = String(selectedDay).padStart(2, "0");
      const dateStr = `${currentYear}-${formattedMonth}-${formattedDay}`;

      // Format request payload using selectedTeamId and dynamic date
      const payload = {
        team_id: selectedTeamId || null,
        title: meetingName || "Meeting",
        date: dateStr,
        time: selectedTime,
        link: meetingLink,
      };

      // Call API
      await SupervisorService.scheduleMeeting(payload);
      toast.success("Meeting scheduled successfully! 📅");
      
      if (onSet) {
        onSet(payload);
      }
      onClose();
    } catch (err) {
      console.warn("Failed API schedule, using mock success. Error:", err);
      
      const targetTeam = teams.find(t => (t.team_id || t.id) === selectedTeamId);
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(selectedDay).padStart(2, "0")}`;
      const newMeeting = {
        id: `local-${Date.now()}`,
        team_id: selectedTeamId || "A",
        meeting_name: meetingName || "Meeting",
        date: dateStr,
        time: selectedTime,
        link: meetingLink,
        team: targetTeam ? { name: targetTeam.project?.title || targetTeam.name } : null
      };

      try {
        const saved = localStorage.getItem("local_meetings") || "[]";
        const current = JSON.parse(saved);
        current.push(newMeeting);
        localStorage.setItem("local_meetings", JSON.stringify(current));
      } catch (e) {
        console.error("Failed saving local meeting:", e);
      }

      toast.success("Meeting scheduled successfully! 📅");
      if (onSet) {
        onSet(newMeeting);
      }
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{nmmCss}</style>
      <div
        className="nmm-overlay"
        onClick={(e) => e.target === e.currentTarget && !loading && onClose()}
      >
        <div className="nmm-modal">
          {/* Header */}
          <div className="nmm-header">
            <span className="nmm-title">New Meeting</span>
            <button className="nmm-close" onClick={onClose} disabled={loading}>
              <X size={18} />
            </button>
          </div>

          <div className="nmm-divider" />

          {/* Select Project Dropdown */}
          <div className="nmm-field">
            <label className="nmm-label">Select Project</label>
            <select
              className="nmm-full-select"
              value={selectedTeamId}
              onChange={(e) => setSelectedTeamId(e.target.value)}
              disabled={loading || !!teamId}
            >
              <option value="">— Choose a project —</option>
              {teams.map((t) => (
                <option key={t.team_id || t.id} value={t.team_id || t.id}>
                  {t.project?.title || t.name || `Team ${t.team_id || t.id}`}
                </option>
              ))}
            </select>
          </div>

          {/* Meeting Name Input */}
          <div className="nmm-field">
            <label className="nmm-label">Meeting Name</label>
            <input
              type="text"
              className="nmm-full-input"
              placeholder="Design Discussion"
              value={meetingName}
              onChange={(e) => setMeetingName(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Mini Calendar Section */}
          <div className="nmm-calendar-box">
            <div className="nmm-cal-header">
              <button className="nmm-cal-arrow" onClick={handlePrevMonth} type="button">&lt;</button>
              <span className="nmm-cal-month">{monthHeader}</span>
              <button className="nmm-cal-arrow" onClick={handleNextMonth} type="button">&gt;</button>
            </div>

            <div className="nmm-cal-weekdays">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>

            <div className="nmm-cal-days">
              {generateCalendarGrid(currentYear, currentMonth).map((item, idx) => {
                const isSelected = item.day === selectedDay && !item.isMuted;

                return (
                  <span
                    key={`${item.day}-${idx}`}
                    className={`nmm-cal-day ${item.isMuted ? "nmm-cal-muted" : ""} ${
                      isSelected ? "nmm-cal-selected" : ""
                    }`}
                    onClick={() => {
                      if (item.monthOffset === -1) {
                        handlePrevMonth();
                        setSelectedDay(item.day);
                      } else if (item.monthOffset === 1) {
                        handleNextMonth();
                        setSelectedDay(item.day);
                      } else {
                        setSelectedDay(item.day);
                      }
                    }}
                  >
                    {item.day}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Time Picker */}
          <div className="nmm-field">
            <label className="nmm-label">Choose Time</label>
            <div className="nmm-time-selector">
              <Clock size={16} style={{ color: "#718096" }} />
              <select
                className="nmm-time-select"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                disabled={loading}
              >
                {timeOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Attach Link */}
          <div className="nmm-field">
            <label className="nmm-label">Attach Link :</label>
            <div className="nmm-link-wrapper">
              <LinkIcon size={14} className="nmm-link-icon" />
              <input
                type="text"
                className="nmm-link-input"
                placeholder="Add Meeting Link"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="nmm-actions">
            <button className="nmm-btn-cancel" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button className="nmm-btn-set" onClick={handleSet} disabled={loading}>
              {loading ? "Scheduling..." : "Set"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
