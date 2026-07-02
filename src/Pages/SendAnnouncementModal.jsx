import { useState, useEffect } from "react";
import { SupervisorService } from "../Services/SupervisorServices";
import { customFetch } from "../apis/apiMain";
import { toast } from "react-hot-toast";
import "./SendAnnouncementModal.css";

export default function SendAnnouncementModal({ onClose, onSuccess }) {
  const [sendTo, setSendTo] = useState("all_teams");
  const [announcement, setAnnouncement] = useState("");
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // ✅ نفس الـ endpoint الشغّال في ProjectsManagedTeams
        const res = await customFetch("supervisor/team-management", { method: "GET" });
        console.log("Teams for announcement:", res);

        const projects =
          res?.data?.projects ||
          res?.projects ||
          (Array.isArray(res?.data) ? res.data : null) ||
          (Array.isArray(res) ? res : []);

        setTeams(projects);
      } catch (e) {
        console.error("Teams fetch error:", e);
      } finally {
        setFetching(false);
      }
    })();
  }, []);

  const handleSend = async () => {
    if (!announcement.trim()) {
      toast.error("Please write an announcement first");
      return;
    }
    if (sendTo === "single_team" && !selectedTeamId) {
      toast.error("Please select a team");
      return;
    }
    try {
      setLoading(true);

      // ✅ الـ API بيقبل formdata مش JSON
      const formData = new FormData();
      formData.append("send_to", sendTo);          // "all_teams" أو "single_team"
      formData.append("message", announcement);
      if (sendTo === "single_team") {
        formData.append("team_id", selectedTeamId);
      }

      await SupervisorService.sendAnnouncement(formData);
      toast.success("Announcement sent successfully! 📣");
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.message || "Failed to send announcement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="sa-overlay"
      onClick={(e) => e.target === e.currentTarget && !loading && onClose()}
    >
      <div className="sa-modal">
        {/* Header */}
        <div className="sa-header">
          <span className="sa-title">Send Announcement</span>
          <button className="sa-close" onClick={onClose} disabled={loading}>✕</button>
        </div>

        {/* Send To */}
        <div className="sa-field">
          <label className="sa-label">Send to</label>
          <div className="sa-select-wrap">
            <select
              className="sa-select"
              value={sendTo}
              onChange={(e) => {
                setSendTo(e.target.value);
                setSelectedTeamId("");
              }}
              disabled={fetching}
            >
              <option value="all_teams">All Teams</option>
              <option value="single_team">Specific Team</option>
            </select>
            <span className="sa-arrow">▾</span>
          </div>
        </div>

        {/* Team selector - يظهر بس لو single_team */}
        {sendTo === "single_team" && (
          <div className="sa-field">
            <label className="sa-label">Select Team</label>
            <div className="sa-select-wrap">
              <select
                className="sa-select"
                value={selectedTeamId}
                onChange={(e) => setSelectedTeamId(e.target.value)}
                disabled={fetching}
              >
                <option value="">— Choose a team —</option>
                {teams.map((t) => (
                  <option key={t.team_id || t.id} value={t.team_id || t.id}>
                    {t.project?.title || t.name || `Team ${t.team_id || t.id}`}
                  </option>
                ))}
              </select>
              <span className="sa-arrow">▾</span>
            </div>
          </div>
        )}

        {/* Announcement */}
        <div className="sa-field">
          <label className="sa-label">
            <span className="sa-announce-icon">📣</span> Announcement
          </label>
          <textarea
            className="sa-textarea"
            placeholder="Write your announcement for the team..."
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            rows={5}
            disabled={loading}
          />
        </div>

        {/* Buttons */}
        <div className="sa-btns">
          <button className="sa-cancel" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button className="sa-send" onClick={handleSend} disabled={loading}>
            {loading ? "Sending…" : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
