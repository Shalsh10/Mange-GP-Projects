import { useState } from "react";
import { toast } from "react-hot-toast";
import { SupervisorService } from "../Services/SupervisorServices";
import { FileText, MessageSquare, Video } from "lucide-react";

const gfmCss = `
.gfm-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

.gfm-modal {
  background: #ffffff;
  border-radius: 16px;
  width: 440px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.18);
  padding: 24px;
  box-sizing: border-box;
}

.gfm-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.gfm-title {
  font-size: 17px;
  font-weight: 700;
  color: #111827;
}

.gfm-close {
  border: none;
  background: none;
  font-size: 18px;
  cursor: pointer;
  color: #9CA3AF;
  padding: 2px 6px;
  border-radius: 6px;
  transition: all 0.15s;
}

.gfm-close:hover {
  background: #F3F4F6;
  color: #111827;
}

.gfm-info-row {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  margin-bottom: 18px;
}

.gfm-file-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-weight: 800;
  font-size: 10px;
}

.gfm-info-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.gfm-info-label {
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
}

.gfm-info-val {
  font-weight: 700;
  color: #111827;
}

.gfm-divider {
  height: 1px;
  background: #E2E8F0;
  margin-bottom: 18px;
}

.gfm-field {
  margin-bottom: 20px;
}

.gfm-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.gfm-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  font-size: 13px;
  color: #1F2937;
  resize: vertical;
  box-sizing: border-box;
  font-family: inherit;
  outline: none;
  min-height: 110px;
  transition: border-color 0.15s;
}

.gfm-textarea:focus {
  border-color: #0052CC;
}

.gfm-btns {
  display: flex;
  gap: 12px;
}

.gfm-cancel {
  flex: 1;
  padding: 10px 0;
  border: 1px solid #D1D5DB;
  border-radius: 8px;
  background: #ffffff;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: background 0.15s;
}

.gfm-cancel:hover {
  background: #F9FAFB;
}

.gfm-send {
  flex: 1;
  padding: 10px 0;
  border: none;
  border-radius: 8px;
  background: #0052CC;
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
}

.gfm-send:hover {
  background: #0043A4;
}

.gfm-send:disabled,
.gfm-cancel:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
`;

const FILE_ICONS = {
  pdf: { bg: "#fee2e2", color: "#dc2626", label: "PDF" },
  fig: { bg: "#ede9fe", color: "#7c3aed", label: "FIG" },
  mp4: { bg: "#dbeafe", color: "#2563eb", label: "MP4" },
};

export default function GiveFeedbackModal({ file, onClose, onSend }) {
  const [feedback, setFeedback] = useState(file?.rawFeedback || "");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    try {
      if (!feedback.trim()) {
        toast.error("Please write feedback first");
        return;
      }

      const fileId = file?.id || file?.file_id || file?.submission_file_id;

      if (!fileId) {
        toast.error("File ID not found");
        return;
      }

      setLoading(true);

      // Try sending as JSON first
      try {
        await SupervisorService.giveFeedbackOnFile(fileId, { feedback });
      } catch (jsonErr) {
        console.warn("JSON feedback submit failed, trying FormData fallback...", jsonErr);
        const formData = new FormData();
        formData.append("feedback", feedback);
        await SupervisorService.giveFeedbackOnFile(fileId, formData);
      }

      toast.success("Feedback sent successfully! ✅");

      if (onSend) {
        onSend(file, feedback);
      }

      onClose();
    } catch (err) {
      console.error("Error sending feedback:", err);
      toast.error(err.message || "حدث خطأ أثناء إرسال الفيدباك");
    } finally {
      setLoading(false);
    }
  };

  const iconStyle = FILE_ICONS[file?.icon] || FILE_ICONS.pdf;

  return (
    <>
      <style>{gfmCss}</style>
      <div
        className="gfm-overlay"
        onClick={(e) => e.target === e.currentTarget && !loading && onClose()}
      >
        <div className="gfm-modal">
          {/* Header */}
          <div className="gfm-header">
            <span className="gfm-title">Give Feedback on File</span>
            <button className="gfm-close" onClick={onClose} disabled={loading}>
              ✕
            </button>
          </div>

          {/* Info Details Row */}
          <div className="gfm-info-row">
            <div
              className="gfm-file-icon"
              style={{
                background: iconStyle.bg,
                color: iconStyle.color,
              }}
            >
              {iconStyle.label}
            </div>

            <div className="gfm-info-details">
              <div className="gfm-info-label">
                File: <span className="gfm-info-val">{file?.name}</span>
              </div>
              <div className="gfm-info-label" style={{ marginTop: 2, display: "flex", alignItems: "center", gap: "4px" }}>
                <span>⚡</span>
                <span>Milestone:</span>{" "}
                <span className="gfm-info-val">{file?.milestone}</span>
              </div>
            </div>
          </div>

          <div className="gfm-divider" />

          {/* Feedback Form */}
          <div className="gfm-field">
            <label className="gfm-label">
              <MessageSquare size={14} />
              <span>Feedback</span>
            </label>

            <textarea
              className="gfm-textarea"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Write your feedback for the team..."
              rows={5}
              disabled={loading}
            />
          </div>

          {/* Buttons */}
          <div className="gfm-btns">
            <button className="gfm-cancel" onClick={onClose} disabled={loading}>
              Cancel
            </button>

            <button className="gfm-send" onClick={handleSend} disabled={loading}>
              {loading ? "Sending..." : "Send Feedback"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}