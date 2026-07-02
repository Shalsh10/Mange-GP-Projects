import { useState } from "react";
import Project from "../Services/Project.model";
import {
  FaExclamationTriangle,
  FaLightbulb,
  FaCheckCircle,
  FaClock,
  FaCloudUploadAlt,
  FaPaperPlane,
} from "react-icons/fa";
import "./reportProblem.css";

export default function ReportProblemPage() {
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("subject", subject);
      formData.append("description", description);

      if (attachment) {
        formData.append("attachment", attachment);
      }

      await Project.reportProblem(formData);

      alert("Report submitted successfully");

      setSubject("");
      setDescription("");
      setAttachment(null);
    } catch (error) {
      console.log(error);
      alert("Failed to submit report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="report-wrapper">
      <div className="report-container">
        <div className="report-header">
          <div>
            <div className="title-row">
              <FaExclamationTriangle className="main-icon" />
              <h1>Report a Problem</h1>
            </div>

            <p>
              Let us know what went wrong. Our team will review your report and get back to
              you as soon as possible.
            </p>
          </div>
        </div>

        <div className="report-content">
          <div className="form-section">

            {/* Subject */}
            <div className="field-group">
              <label>Subject <span>*</span></label>

              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Write a short title for your issue"
              />
            </div>

            {/* Description */}
            <div className="field-group">
              <label>Describe your issue <span>*</span></label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please describe your issue in as much detail as possible..."
              ></textarea>
            </div>

            {/* File Upload */}
<div className="field-group ">
  <label>
    Attach File <small>(optional)</small>
  </label>

  <label className="upload-box cursor-pointer block text-center">
    <input
      type="file"
      className="hidden"
      onChange={(e) => setAttachment(e.target.files[0])}
    />

    <div className="upload-row flex items-center justify-center gap-2 pt-6">
      <FaCloudUploadAlt />

      <span>
        {attachment
          ? attachment.name
          : "Click to upload or drag and drop"}
      </span>
    </div>

    <p>PNG, JPG or PDF (Max. 5MB)</p>
  </label>
</div>

            {/* Buttons */}
            <div className="button-row">
              <button
                className="cancel-btn"
                onClick={() => {
                  setSubject("");
                  setDescription("");
                  setAttachment(null);
                }}
              >
                Cancel
              </button>

              <button
                className="submit-btn"
                onClick={handleSubmit}
                disabled={loading}
              >
                <FaPaperPlane />
                {loading ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </div>

          {/* Side Section (unchanged) */}
          <div className="side-section">
            <div className="info-card">
              <div className="card-title">
                <FaLightbulb />
                <h3>Before you submit</h3>
              </div>

              <ul>
                <li><FaCheckCircle /> Make sure your information is correct.</li>
                <li><FaCheckCircle /> Provide clear details about the issue.</li>
                <li><FaCheckCircle /> Attach screenshots if possible.</li>
              </ul>
            </div>

            <div className="info-card">
              <div className="card-title">
                <FaClock />
                <h3>What happens next?</h3>
              </div>

              <ul className="steps">
                <li><div className="step-number">1</div>Report sent to support team.</li>
                <li><div className="step-number">2</div>We review and may contact you.</li>
                <li><div className="step-number">3</div>You get a response soon.</li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}