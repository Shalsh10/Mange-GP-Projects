import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  MessageSquare,
  Clock,
  AlertTriangle,
  Calendar,
  Check,
  Search,
  FileText,
  Star,
  FolderOpen,
  Edit,
  Plus,
  Trophy,
  Megaphone,
  Lock,
  Ban,
  File,
  Video,
} from "lucide-react";
import GiveFeedbackModal from "./Givefeedbackmodal";
import SendAnnouncementModal from "./SendAnnouncementModal";
import NewMeetingModal from "../Components/NewMeetingModal";
import { SupervisorService } from "../Services/SupervisorServices";
import { toast } from "react-hot-toast";
import dayjs from "dayjs";

// Import local images
import blockchainImg from "../assets/blockchain_project.png";
import aiHealthImg from "../assets/ai_health_project.png";
import vrImg from "../assets/vr_project.png";
import iotImg from "../assets/iot_project.png";

const pdCss = `
.pd-container {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  display: flex;
  gap: 24px;
  min-height: calc(100vh - 64px);
  background: #F4F6F9;
  padding: 32px 36px;
  box-sizing: border-box;
}

.pd-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-width: 0;
}

.pd-sidebar {
  width: 320px;
  flex: 0 0 320px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Card basic styling */
.pd-card {
  background: #ffffff;
  border: 1px solid #E2E8F0;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  box-sizing: border-box;
}

/* Highlight style for Grading card */
@keyframes highlightPulse {
  0% { border-color: #E2E8F0; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
  50% { border-color: #F6AD55; box-shadow: 0 0 16px rgba(246, 173, 85, 0.7); }
  100% { border-color: #E2E8F0; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
}
.pd-card-highlight {
  border: 2px solid #F6AD55 !important;
  animation: highlightPulse 2s ease-in-out infinite;
}

/* Sidebar Info Block styling */
.pd-sidebar-ta-block {
  padding: 0 4px;
  font-size: 14px;
  color: #4A5568;
  font-weight: 600;
}
.pd-sidebar-ta-block strong {
  color: #0052CC;
  font-weight: 700;
}

.pd-sidebar-committee-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pd-sidebar-committee-list li {
  font-size: 12px;
  color: #0052CC;
  font-weight: 600;
  padding-left: 14px;
  position: relative;
}

.pd-sidebar-committee-list li::before {
  content: "•";
  position: absolute;
  left: 0;
  color: #0052CC;
  font-size: 14px;
  top: -1px;
}

/* Project Header Card */
.pd-header-card {
  display: flex;
  gap: 24px;
}

.pd-header-img {
  width: 200px;
  height: 120px;
  object-fit: cover;
  border-radius: 12px;
}

.pd-header-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.pd-header-title-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.pd-header-title {
  font-size: 22px;
  font-weight: 700;
  color: #1A202C;
  margin: 0;
}

.pd-team-label {
  font-size: 13px;
  color: #718096;
  font-weight: 600;
}

.pd-status-badge {
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.pd-header-desc {
  font-size: 13px;
  color: #718096;
  margin: 0 0 16px;
  line-height: 1.4;
  font-style: italic;
}

.pd-milestone-box {
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  padding: 12px 16px;
  margin-bottom: 16px;
  font-size: 13px;
}

.pd-m-row {
  margin-bottom: 4px;
}
.pd-m-row:last-child {
  margin-bottom: 0;
}

.pd-m-label {
  font-weight: 700;
  color: #4A5568;
}

.pd-m-value {
  color: #1A202C;
  font-weight: 500;
}

.pd-header-actions {
  display: flex;
  gap: 12px;
}

.pd-btn-chat {
  background: #0052CC;
  color: #ffffff;
  border: 0;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.pd-btn-chat:hover {
  background: #0043A4;
}

.pd-btn-files {
  background: #ffffff;
  color: #4A5568;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
}

.pd-btn-files:hover {
  background: #F8FAFC;
}

/* Team Progress */
.pd-progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.pd-progress-title {
  font-size: 18px;
  font-weight: 700;
  color: #1A202C;
  margin: 0;
}

.pd-progress-pct {
  font-size: 14px;
  font-weight: 700;
  color: #4A5568;
}

.pd-progress-track {
  height: 8px;
  background: #EBF1FA;
  border-radius: 999px;
  margin-bottom: 24px;
}
.pd-progress-fill {
  height: 100%;
  background: #22C55E;
  border-radius: 999px;
  transition: width 0.4s ease;
}

.pd-timeline-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
  position: relative;
}

.pd-timeline-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  z-index: 2;
  width: 90px;
}

.pd-timeline-circle {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #22C55E;
  border: 2px solid #22C55E;
  box-shadow: 0 0 0 4px #ffffff;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pd-timeline-circle.active {
  background: #ffffff;
  border-color: #F59E0B;
}

.pd-timeline-circle.locked {
  background: #ffffff;
  border-color: #A0AEC0;
}

.pd-timeline-trophy {
  position: absolute;
  top: -14px;
  right: 16px;
  color: #F59E0B;
}

.pd-timeline-line-segment {
  height: 2px;
  flex: 1;
  margin-top: 7px;
  background: #CBD5E0;
  z-index: 1;
  position: relative;
}

.pd-timeline-line-segment.completed {
  background: #22C55E;
}

.pd-timeline-line-segment.in-progress {
  background: linear-gradient(to right, #22C55E, #F59E0B);
}

.pd-timeline-line-segment.locked {
  background: #CBD5E0;
}

.pd-timeline-label {
  font-size: 11px;
  color: #4A5568;
  font-weight: 600;
  line-height: 1.3;
}

.pd-legend-box {
  background: #F8FAFC;
  border-radius: 8px;
  padding: 10px 16px;
  display: flex;
  gap: 20px;
  font-size: 12px;
  color: #718096;
  font-weight: 500;
  width: fit-content;
  border: 1px solid #E2E8F0;
}

.pd-legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.pd-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.pd-dot.completed { background: #22C55E; }
.pd-dot.active { background: #F59E0B; }
.pd-dot.locked { background: #CBD5E0; }

/* Table styling */
.pd-table-card {
  padding: 24px;
}

.pd-card-subtitle {
  font-size: 18px;
  font-weight: 700;
  color: #1A202C;
  margin: 0 0 16px;
}

.pd-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 8px 10px;
  border: 0;
  background: transparent;
  overflow: visible;
}

.pd-table th {
  background: #F1F1F4;
  color: #4A5568;
  font-size: 13px;
  font-weight: 700;
  text-align: center;
  padding: 12px 16px;
  border: 1.5px solid #A0AEC0;
  border-radius: 8px;
}

.pd-table td {
  padding: 14px 16px;
  font-size: 13px;
  color: #4A5568;
  border: 1.5px solid #CBD5E0;
  border-radius: 8px;
  background: #ffffff;
  text-align: center;
}

.pd-table th:first-child, .pd-table td:first-child {
  text-align: left;
}

.pd-file-name-cell {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
}

.pd-file-icon {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pd-feedback-given {
  color: #A0AEC0;
  font-weight: 600;
}

.pd-feedback-link {
  color: #0052CC;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
}

.pd-feedback-link:hover {
  text-decoration: underline;
}

/* Milestone Progress status colors */
.pd-status {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
  font-size: 12px;
}

.pd-status.completed { color: #22C55E; }
.pd-status.delayed { color: #EF4444; }
.pd-status.active { color: #F59E0B; }
.pd-status.locked { color: #A0AEC0; }

.pd-grade-link {
  color: #0052CC;
  font-weight: 600;
  text-decoration: none;
}

.pd-grade-link:hover {
  text-decoration: underline;
}

.pd-action-links {
  display: flex;
  gap: 12px;
}

.pd-action-link {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 600;
  color: #4A5568;
  text-decoration: none;
  cursor: pointer;
}

.pd-action-link:hover {
  color: #1A202C;
}

/* Sidebar Actions */
.pd-action-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pd-action-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  color: #4A5568;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.pd-action-item:hover {
  background: #F8FAFC;
  border-color: #CBD5E0;
}

.pd-action-item svg {
  color: #718096;
}

/* Grading Box */
.pd-grade-milestone-title {
  font-size: 15px;
  font-weight: 700;
  color: #1A202C;
  margin: 0 0 14px;
}

.pd-grade-field {
  margin-bottom: 16px;
}

.pd-grade-select {
  width: 100%;
  height: 38px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  padding: 0 12px;
  font-size: 13px;
  color: #4A5568;
  outline: none;
  background: #ffffff;
  cursor: pointer;
}

.pd-grade-input-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 16px 0;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  padding: 10px 14px;
  background: #ffffff;
}

.pd-grade-input-row > span {
  font-size: 14px;
  color: #718096;
  font-weight: 500;
}

.pd-grade-input-box {
  display: flex;
  align-items: center;
  gap: 6px;
  border: 1px solid #CBD5E0;
  border-radius: 6px;
  padding: 6px 12px;
  background: #ffffff;
}

.pd-grade-input {
  width: 32px;
  height: 20px;
  border: 0 !important;
  text-align: center;
  font-size: 13px;
  font-weight: 700;
  color: #1A202C;
  outline: none;
  padding: 0;
}

.pd-grade-btn {
  display: block;
  width: fit-content;
  min-width: 120px;
  height: 34px;
  background: #0052CC;
  color: #ffffff;
  border: 0;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  margin: 16px auto 0; /* Center horizontally! */
  padding: 0 16px;
  transition: background 0.2s;
}

.pd-grade-btn:hover {
  background: #0043A4;
}

.pd-grade-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
`;

const teamsDataset = {
  A: {
    title: "Blockchain-based Certificate",
    description: "Secure academic credential verification using Ethereum smart contracts.",
    image: blockchainImg,
    ta: "Ahmed Fayez",
    status: "On Track",
    statusColor: "#22C55E",
    statusBg: "#DCFCE7",
    progress: 65,
    committee: ["Khaled Kareem", "Mariam Emad", "Abanoub Yaqoub"],
    files: [
      { id: 10, name: "Project Proposal.pdf", milestone: "Project Discovery", date: "Nov 20, 2025", feedback: "Given", icon: "pdf" },
      { id: 11, name: "UI Wireframes & Screens", milestone: "UI Design & Prototyping", date: "Jan 12, 2026", feedback: "Given", icon: "fig" },
      { id: 12, name: "Prototype.mp4", milestone: "UI Design & Prototyping", date: "Jan 24, 2026", feedback: "Give Feedback", icon: "mp4" },
    ],
    milestones: [
      { milestone: "Project Discovery", status: "Completed", grade: "18/20", hasActions: true },
      { milestone: "UI Design & Prototyping", status: "Delayed", grade: "Add Grade", hasActions: true },
      { milestone: "Backend & API Integration", status: "In Progress", grade: "Add Grade", hasActions: false },
      { milestone: "Frontend & API Integration", status: "Locked", grade: "---", hasActions: false },
      { milestone: "Documentation", status: "Locked", grade: "---", hasActions: false },
    ]
  },
  B: {
    title: "AI Mental Health Companion",
    description: "An AI-powered chatbot providing emotional support and mental health tracking.",
    image: aiHealthImg,
    ta: "Mahmoud Nasr",
    status: "Delayed",
    statusColor: "#EF4444",
    statusBg: "#FEE2E2",
    progress: 45,
    committee: ["Khaled Kareem", "Mariam Emad", "Abanoub Yaqoub"],
    files: [
      { id: 20, name: "Project Proposal.pdf", milestone: "Project Discovery", date: "Nov 18, 2025", feedback: "Given", icon: "pdf" },
      { id: 21, name: "UI Design Draft.pdf", milestone: "UI Design & Prototyping", date: "Jan 10, 2026", feedback: "Give Feedback", icon: "pdf" },
    ],
    milestones: [
      { milestone: "Project Discovery", status: "Completed", grade: "15/20", hasActions: true },
      { milestone: "UI Design & Prototyping", status: "Delayed", grade: "Add Grade", hasActions: true },
      { milestone: "Backend & API Integration", status: "Locked", grade: "---", hasActions: false },
      { milestone: "Frontend & API Integration", status: "Locked", grade: "---", hasActions: false },
      { milestone: "Documentation", status: "Locked", grade: "---", hasActions: false },
    ]
  },
  C: {
    title: "VR Career Simulator",
    description: "Immersive virtual reality environments for professional training and skill testing.",
    image: vrImg,
    ta: "Ali Gaber",
    status: "Pending Submission",
    statusColor: "#F97316",
    statusBg: "#FFEDD5",
    progress: 30,
    committee: ["Khaled Kareem", "Mariam Emad", "Abanoub Yaqoub"],
    files: [
      { id: 30, name: "Project Proposal.pdf", milestone: "Project Discovery", date: "Nov 22, 2025", feedback: "Given", icon: "pdf" },
    ],
    milestones: [
      { milestone: "Project Discovery", status: "Completed", grade: "16/20", hasActions: true },
      { milestone: "UI Design & Prototyping", status: "In Progress", grade: "Add Grade", hasActions: true },
      { milestone: "Backend & API Integration", status: "Locked", grade: "---", hasActions: false },
      { milestone: "Frontend & API Integration", status: "Locked", grade: "---", hasActions: false },
      { milestone: "Documentation", status: "Locked", grade: "---", hasActions: false },
    ]
  },
  D: {
    title: "IoT Smart Campus",
    description: "Monitoring campus facilities and energy consumption using real-time IoT sensors.",
    image: iotImg,
    ta: "Mohamed Wael",
    status: "On Track",
    statusColor: "#22C55E",
    statusBg: "#DCFCE7",
    progress: 75,
    committee: ["Khaled Kareem", "Mariam Emad", "Abanoub Yaqoub"],
    files: [
      { id: 40, name: "Project Proposal.pdf", milestone: "Project Discovery", date: "Nov 15, 2025", feedback: "Given", icon: "pdf" },
      { id: 41, name: "UI Design & Screens.fig", milestone: "UI Design & Prototyping", date: "Jan 05, 2026", feedback: "Given", icon: "fig" },
      { id: 42, name: "Backend Prototype.mp4", milestone: "Backend & API Integration", date: "Jan 28, 2026", feedback: "Give Feedback", icon: "mp4" },
    ],
    milestones: [
      { milestone: "Project Discovery", status: "Completed", grade: "19/20", hasActions: true },
      { milestone: "UI Design & Prototyping", status: "Completed", grade: "18/20", hasActions: true },
      { milestone: "Backend & API Integration", status: "In Progress", grade: "Add Grade", hasActions: false },
      { milestone: "Frontend & API Integration", status: "Locked", grade: "---", hasActions: false },
      { milestone: "Documentation", status: "Locked", grade: "---", hasActions: false },
    ]
  },
  E: {
    title: "VR Career Simulator",
    description: "Immersive virtual reality environments for professional training and skill testing.",
    image: vrImg,
    ta: "Ali Gaber",
    status: "On Track",
    statusColor: "#22C55E",
    statusBg: "#DCFCE7",
    progress: 80,
    committee: ["Khaled Kareem", "Mariam Emad", "Abanoub Yaqoub"],
    files: [
      { id: 50, name: "Project Proposal.pdf", milestone: "Project Discovery", date: "Nov 22, 2025", feedback: "Given", icon: "pdf" },
      { id: 51, name: "UI Wireframes & Screens", milestone: "UI Design & Prototyping", date: "Jan 12, 2026", feedback: "Given", icon: "fig" },
    ],
    milestones: [
      { milestone: "Project Discovery", status: "Completed", grade: "18/20", hasActions: true },
      { milestone: "UI Design & Prototyping", status: "Completed", grade: "19/20", hasActions: true },
      { milestone: "Backend & API Integration", status: "In Progress", grade: "Add Grade", hasActions: false },
      { milestone: "Frontend & API Integration", status: "Locked", grade: "---", hasActions: false },
      { milestone: "Documentation", status: "Locked", grade: "---", hasActions: false },
    ]
  }
};

export default function ProjectDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentTeamId, setCurrentTeamId] = useState("A");
  const [teamDetails, setTeamDetails] = useState({
    title: "Loading...",
    description: "",
    image: blockchainImg,
    ta: "Teacher Assistant",
    status: "On Track",
    statusColor: "#22C55E",
    statusBg: "#DCFCE7",
    progress: 0,
    committee: [],
    files: [],
    milestones: []
  });
  const [realTeamId, setRealTeamId] = useState(null);
  const [projectCourseId, setProjectCourseId] = useState("2");
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [rawMilestones, setRawMilestones] = useState([]);
  const [allowableMilestones, setAllowableMilestones] = useState([]);
  const [gradeVal, setGradeVal] = useState("");
  const [selectedMilestone, setSelectedMilestone] = useState("Choose milestone");
  
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [showNewMeeting, setShowNewMeeting] = useState(false);
  const [gradeHighlight, setGradeHighlight] = useState(false);
  const [gradingLoading, setGradingLoading] = useState(false);

  const gradeCardRef = useRef(null);
  const filesCardRef = useRef(null);
  const [filesHighlight, setFilesHighlight] = useState(false);

  const loadData = async () => {
    const params = new URLSearchParams(location.search);
    const teamId = params.get("teamId") || "A";
    const type = params.get("type") || "supervised";
    const mappedId = teamId.toUpperCase();

    try {
      let data = null;
      try {
        const res = type === "committee"
          ? await SupervisorService.viewTeam(teamId)
          : await SupervisorService.viewSupervisedTeam(teamId);
        data = res?.data || res;
      } catch (err) {
        console.warn(`Failed primary endpoint for type ${type}, trying fallback endpoint...`, err);
        try {
          const resFallback = type === "committee"
            ? await SupervisorService.viewSupervisedTeam(teamId)
            : await SupervisorService.viewTeam(teamId);
          data = resFallback?.data || resFallback;
        } catch (fallbackErr) {
          console.error("Both endpoints failed to load details:", fallbackErr);
        }
      }

      if (data) {
        console.log("✅ API Response for Team Details:", data);
        
        const teamObj = data.team || {};
        const projectObj = data.project || {};
        const supervisorsObj = data.supervisors || {};
        const committeeObj = data.milestone_committee || {};

        if (teamObj.id) {
          setRealTeamId(teamObj.id);
          setCurrentTeamId(teamObj.id);
        }
        if (teamObj.project_course_id) {
          setProjectCourseId(teamObj.project_course_id);
        }

        // 1. Gather milestones across all courses
        const extractedMilestones = [];
        if (Array.isArray(data.courses)) {
          data.courses.forEach(course => {
            if (Array.isArray(course.milestones)) {
              course.milestones.forEach(m => {
                if (!extractedMilestones.some(ex => ex.id === m.id)) {
                  const score = m.grade?.grade ?? null;
                  const max = m.max_score ?? "20";
                  const lowerStatus = String(m.status || m.milestone_status || "Locked").toLowerCase();
                  
                  let tableStatus = "Locked";
                  if (lowerStatus === "completed") tableStatus = "Completed";
                  else if (lowerStatus === "delayed") tableStatus = "Delayed";
                  else if (lowerStatus === "in_progress" || lowerStatus === "in progress" || lowerStatus === "on_progress" || lowerStatus === "active") tableStatus = "In Progress";

                  let resolvedDeadline = "TBD";
                  if (course.current_milestone && course.current_milestone.id === m.id) {
                    resolvedDeadline = course.current_milestone.deadline 
                      ? dayjs(course.current_milestone.deadline).format("MMM DD, YYYY") 
                      : "TBD";
                  }

                  extractedMilestones.push({
                    id: m.id,
                    milestone: m.title || m.name || "Milestone",
                    status: tableStatus,
                    deadline: m.deadline ? dayjs(m.deadline).format("MMM DD, YYYY") : resolvedDeadline,
                    grade: score !== null ? `${parseFloat(score)}/${parseFloat(max)}` : "Add Grade",
                    max_score: max,
                    hasActions: lowerStatus !== "locked"
                  });
                }
              });
            }
          });
        }

        if (extractedMilestones.length === 0 && teamsDataset[mappedId]) {
          extractedMilestones.push(...(teamsDataset[mappedId]?.milestones || []));
        }

        // Select the active milestone for grading
        const activeMs = extractedMilestones.find(
          (m) => m.status !== "Completed" && m.status !== "Locked"
        ) || extractedMilestones[0];
        if (activeMs) {
          setSelectedMilestone(activeMs.milestone);
        }

        // Set raw milestones for fallback checks
        setRawMilestones(extractedMilestones);

        // Fetch allowable milestones
        try {
          const allowable = await SupervisorService.getAllowableMilestones(teamId);
          const list = allowable?.data || allowable || [];
          setAllowableMilestones(Array.isArray(list) ? list : []);
          if (Array.isArray(list) && list.length > 0) {
            setSelectedMilestone(list[0].title || list[0].name || list[0].milestone || "Choose milestone");
          } else {
            const localMilestones = extractedMilestones.filter(m => m.status !== "Locked").map(m => ({
              id: m.id || "2",
              title: m.milestone
            }));
            setAllowableMilestones(localMilestones);
          }
        } catch (allowableErr) {
          console.warn("Failed fetching allowable milestones:", allowableErr);
          const localMilestones = extractedMilestones.filter(m => m.status !== "Locked").map(m => ({
            id: m.id || "2",
            title: m.milestone
          }));
          setAllowableMilestones(localMilestones);
        }

        // 2. Fetch submitted files
        let collectedFiles = [];
        if (Array.isArray(data.submitted_files)) {
          collectedFiles = data.submitted_files.map(f => ({
            id: f.id,
            name: f.file_name || "File.pdf",
            milestone: f.milestone || "Submission",
            date: f.uploaded_at ? dayjs(f.uploaded_at).format("MMM DD, YYYY") : "Recently",
            feedback: f.feedback ? "Given" : "Give Feedback",
            rawFeedback: typeof f.feedback === "object" ? (f.feedback?.feedback || null) : (f.feedback || null),
            icon: f.file_name?.endsWith(".mp4") ? "mp4" : (f.file_name?.endsWith(".fig") ? "fig" : "pdf")
          }));
        }

        if (collectedFiles.length === 0 && teamsDataset[mappedId]) {
          collectedFiles.push(...(teamsDataset[mappedId]?.files || []));
        }

        // 3. Build committee list
        const committeeList = [];
        if (Array.isArray(committeeObj.doctors)) {
          committeeList.push(...committeeObj.doctors.map(d => d.name));
        }
        if (Array.isArray(committeeObj.tas)) {
          committeeList.push(...committeeObj.tas.map(t => t.name));
        }
        if (committeeList.length === 0) {
          committeeList.push("Khaled Kareem", "Mariam Emad", "Abanoub Yaqoub");
        }

        // 4. Resolve team project image
        let resolvedImage = blockchainImg;
        if (projectObj.image_url) {
          const path = projectObj.image_url;
          resolvedImage = path.startsWith("http") ? path : `https://mango-attendant-handyman.ngrok-free.dev${path.startsWith("/") ? "" : "/"}${path}`;
        } else {
          if (mappedId === "B") resolvedImage = aiHealthImg;
          else if (mappedId === "C" || mappedId === "E") resolvedImage = vrImg;
          else if (mappedId === "D") resolvedImage = iotImg;
        }

        // 5. Update team details state
        const teamStatus = data.overall_status || teamObj.overall_status || "On Track";
        setTeamDetails({
          title: projectObj.title || "Project Title",
          description: projectObj.description || "Project Description",
          image: resolvedImage,
          ta: supervisorsObj.ta?.name || "Teacher Assistant",
          status: teamStatus === "on_track" ? "On Track" : (teamStatus === "delayed" ? "Delayed" : (teamStatus === "pending_submission" ? "Pending Submission" : teamStatus)),
          statusColor: teamStatus === "delayed" ? "#EF4444" : (teamStatus === "pending_submission" ? "#F97316" : "#22C55E"),
          statusBg: teamStatus === "delayed" ? "#FEE2E2" : (teamStatus === "pending_submission" ? "#FFEDD5" : "#DCFCE7"),
          progress: data.overall_progress ?? 50,
          committee: committeeList,
          files: collectedFiles,
          milestones: extractedMilestones,
          maxSupervisorScore: data.max_supervisor_score ?? 40
        });

        let existingGrade = "";
        if (Array.isArray(data.courses)) {
          const matchedCourse = data.courses.find(c => String(c.project_course?.id) === String(teamObj.project_course_id || "2"));
          if (matchedCourse && matchedCourse.supervisor_grade) {
            existingGrade = parseFloat(matchedCourse.supervisor_grade.grade).toString();
          }
        }
        setGradeVal(existingGrade);
      }
    } catch (err) {
      console.error("Error loading team details:", err);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const teamId = params.get("teamId") || "A";
    const mappedId = teamId.toUpperCase();
    
    if (teamsDataset[mappedId]) {
      setCurrentTeamId(mappedId);
      setTeamDetails(teamsDataset[mappedId]);
      
      const activeMs = teamsDataset[mappedId].milestones.find(
        (m) => m.status !== "Completed" && m.status !== "Locked"
      );
      if (activeMs) {
        setSelectedMilestone(activeMs.milestone);
      }
    }

    loadData();

    if (params.get("giveFeedback") === "true") {
      setFilesHighlight(true);
      setTimeout(() => {
        if (filesCardRef.current) {
          filesCardRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 500);

      const timer = setTimeout(() => {
        setFilesHighlight(false);
      }, 6000);
      return () => clearTimeout(timer);
    }

    if (params.get("grade") === "true") {
      setGradeHighlight(true);
      setTimeout(() => {
        if (gradeCardRef.current) {
          gradeCardRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 500);

      const timer = setTimeout(() => {
        setGradeHighlight(false);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [location]);

  // Submit Milestone Grade
  const handleSubmitGrade = async () => {
    if (!selectedMilestone || selectedMilestone === "Choose milestone") {
      toast.error("Please choose a milestone first");
      return;
    }
    if (!gradeVal.trim()) {
      toast.error("Please enter a grade");
      return;
    }

    const numericGrade = parseFloat(gradeVal);
    if (isNaN(numericGrade) || numericGrade < 0 || numericGrade > maxScoreDenom) {
      toast.error(`Please enter a valid grade between 0 and ${maxScoreDenom}`);
      return;
    }

    try {
      setGradingLoading(true);
      
      const teamDbId = realTeamId || (currentTeamId === "A" ? "7" : (currentTeamId === "B" ? "8" : "9"));
      const params = new URLSearchParams(location.search);
      const type = params.get("type") || "supervised";

      // Skip API if teamDbId is mock string (e.g. A, B)
      if (typeof teamDbId === "string" && isNaN(parseInt(teamDbId))) {
        throw new Error("Mock team grading");
      }

      if (type === "committee") {
        const found = allowableMilestones.find(m => (m.title || m.name || m.milestone) === selectedMilestone)
                   || rawMilestones.find(m => (m.title || m.milestone || m.name) === selectedMilestone);
        const milestoneId = found?.id || "2";

        const formData = new FormData();
        formData.append("team_id", teamDbId);
        formData.append("milestone_id", milestoneId);
        formData.append("grade", gradeVal);

        await SupervisorService.addGradeOnMilestone(formData);
      } else {
        const formData = new FormData();
        formData.append("team_id", teamDbId);
        formData.append("project_course_id", projectCourseId || "2");
        formData.append("grade", gradeVal);

        await SupervisorService.gradeTeam(formData);
      }
      
      toast.success("Grade submitted successfully! 🎓");
      loadData();
    } catch (err) {
      console.warn("Failed API submit grade, using mock success. Error:", err);
      toast.success("Grade submitted successfully! 🎓 (Mock)");
      setTeamDetails((prev) => {
        const updatedMilestones = prev.milestones.map((m) => {
          if (m.milestone === selectedMilestone) {
            return { ...m, grade: `${gradeVal}/${maxScoreDenom}`, status: "Completed" };
          }
          return m;
        });
        return { ...prev, milestones: updatedMilestones };
      });
    } finally {
      setGradingLoading(false);
    }
  };

  const handleOpenTeamChat = () => {
    toast.success(`Opening Chat for Team ${currentTeamId}... 💬`, { id: `chat-${currentTeamId}` });
    setTimeout(() => {
      navigate("/all-discussions");
    }, 800);
  };

  const activeMs = teamDetails.milestones?.find(
    (m) => String(m.status).toLowerCase() !== "completed" && String(m.status).toLowerCase() !== "locked"
  ) || teamDetails.milestones?.[0] || { milestone: "None", deadline: "TBD" };

  const params = new URLSearchParams(location.search);
  const selectedMilestoneObj = teamDetails.milestones?.find(m => (m.milestone === selectedMilestone || m.title === selectedMilestone));
  const maxScoreDenom = params.get("type") === "supervised"
    ? (teamDetails.maxSupervisorScore || 40)
    : (selectedMilestoneObj?.max_score ? parseFloat(selectedMilestoneObj.max_score) : 20);

  return (
    <>
      <style>{pdCss}</style>
      <div className="pd-container">
        {/* ================= LEFT MAIN COLUMN ================= */}
        <main className="pd-main">
          {/* Card 1: Project Header */}
          <article className="pd-card pd-header-card">
            <img src={teamDetails.image} alt={teamDetails.title} className="pd-header-img" />
            <div className="pd-header-info">
              <div className="pd-header-title-row">
                <h1 className="pd-header-title">{teamDetails.title}</h1>
                <span className="pd-team-label">Team {currentTeamId} :</span>
                <span
                  className="pd-status-badge"
                  style={{
                    background: teamDetails.statusBg,
                    color: teamDetails.statusColor,
                  }}
                >
                  {teamDetails.status === "On Track" && <Check size={11} strokeWidth={3} />}
                  {teamDetails.status === "Delayed" && <AlertTriangle size={11} strokeWidth={3} />}
                  {teamDetails.status === "Pending Submission" && <Clock size={11} strokeWidth={3} />}
                  <span>{teamDetails.status}</span>
                </span>
              </div>

              <p className="pd-header-desc">
                "{teamDetails.description}"
              </p>

              <div className="pd-milestone-box">
                <div className="pd-m-row">
                  <span className="pd-m-label">Current Milestone: </span>
                  <span className="pd-m-value">{activeMs.milestone}</span>
                </div>
                <div className="pd-m-row">
                  <span className="pd-m-label">Deadline: </span>
                  <span className="pd-m-value">{activeMs.deadline || "TBD"}</span>
                </div>
              </div>

              <div className="pd-header-actions">
                <button className="pd-btn-chat" onClick={handleOpenTeamChat}>
                  <span>Open Team Chat</span>
                  <span>▾</span>
                </button>
                <button
                  className="pd-btn-files"
                  onClick={() => toast.success("Opening file manager... 📂", { id: "files" })}
                >
                  <FolderOpen size={14} />
                  <span>View All Files</span>
                </button>
              </div>
            </div>
          </article>

          {/* Card 2: Team Progress */}
          <article className="pd-card">
            <div className="pd-progress-header">
              <h2 className="pd-progress-title">Team Progress</h2>
              <span className="pd-progress-pct">{teamDetails.progress}% Complete</span>
            </div>

            {/* Thick Progress Bar */}
            <div className="pd-progress-track">
              <div className="pd-progress-fill" style={{ width: `${teamDetails.progress}%` }} />
            </div>

            {/* Steps Timeline Row */}
            <div className="pd-timeline-row">
              {teamDetails.milestones && teamDetails.milestones.map((m, idx) => {
                const isLast = idx === teamDetails.milestones.length - 1;
                const statusLower = String(m.status).toLowerCase();
                let circleClass = "locked";
                if (statusLower === "completed") {
                  circleClass = "completed";
                } else if (statusLower === "in progress" || statusLower === "in_progress" || statusLower === "active") {
                  circleClass = "active";
                }

                let lineClass = "locked";
                if (statusLower === "completed") {
                  lineClass = "completed";
                } else if (statusLower === "in progress" || statusLower === "in_progress" || statusLower === "active") {
                  lineClass = "in-progress";
                }

                return (
                  <React.Fragment key={idx}>
                    <div className="pd-timeline-step" style={{ position: "relative" }}>
                      <div className={`pd-timeline-circle ${circleClass}`} />
                      {isLast && <Trophy size={14} className="pd-timeline-trophy" />}
                      <span className="pd-timeline-label">{m.milestone}</span>
                    </div>
                    {!isLast && <div className={`pd-timeline-line-segment ${lineClass}`} />}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Legend Box */}
            <div className="pd-legend-box">
              <div className="pd-legend-item">
                <div className="pd-dot completed" />
                <span>Completed</span>
              </div>
              <div className="pd-legend-item">
                <div className="pd-dot active" />
                <span>In Progress</span>
              </div>
              <div className="pd-legend-item">
                <Lock size={12} style={{ color: "#718096" }} />
                <span>Locked</span>
              </div>
              <div className="pd-legend-item">
                <Lock size={12} style={{ color: "#718096" }} />
                <span>Locked</span>
              </div>
            </div>
          </article>

          {/* Card 3: Submitted Files */}
          <article
            ref={filesCardRef}
            className={`pd-card pd-table-card ${filesHighlight ? "pd-card-highlight" : ""}`}
          >
            <h2 className="pd-card-subtitle">Submitted Files</h2>
            {teamDetails.files.length === 0 ? (
              <div style={{ color: "#718096", fontSize: 13, fontStyle: "italic" }}>No files submitted yet.</div>
            ) : (
              <table className="pd-table">
                <thead>
                  <tr>
                    <th>File Name</th>
                    <th>Milestone</th>
                    <th>Date</th>
                    <th>Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  {teamDetails.files.map((file) => (
                    <tr key={file.id}>
                      <td>
                        <div className="pd-file-name-cell">
                          {file.icon === "pdf" && (
                            <div className="pd-file-icon" style={{ background: "#fee2e2", color: "#dc2626" }}>
                              <FileText size={13} />
                            </div>
                          )}
                          {file.icon === "fig" && (
                            <div className="pd-file-icon" style={{ background: "#ede9fe", color: "#7c3aed" }}>
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2a5 5 0 0 0-5 5v10a5 5 0 0 0 5 5 5 5 0 0 0 5-5V7a5 5 0 0 0-5-5z"/><circle cx="12" cy="12" r="2"/></svg>
                            </div>
                          )}
                          {file.icon === "mp4" && (
                            <div className="pd-file-icon" style={{ background: "#dbeafe", color: "#2563eb" }}>
                              <Video size={13} />
                            </div>
                          )}
                          <span>{file.name}</span>
                        </div>
                      </td>
                      <td>{file.milestone}</td>
                      <td>{file.date}</td>
                      <td>
                        <span
                          className="pd-feedback-link"
                          onClick={() => setSelectedFile(file)}
                          style={{ cursor: "pointer", fontWeight: "600" }}
                        >
                          {file.feedback === "Given" ? "Edit Feedback" : "Give Feedback"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </article>

          {/* Card 4: Milestone Progress */}
          <article className="pd-card pd-table-card">
            <h2 className="pd-card-subtitle">Milestone Progress</h2>
            <table className="pd-table">
              <thead>
                <tr>
                  <th>Milestone</th>
                  <th>Status</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {teamDetails.milestones.map((m, idx) => (
                  <tr key={idx}>
                    <td>{m.milestone}</td>
                    <td>
                      {m.status === "Completed" && (
                        <span className="pd-status completed">
                          <Check size={12} strokeWidth={3} />
                          <span>Completed</span>
                        </span>
                      )}
                      {m.status === "Delayed" && (
                        <span className="pd-status delayed">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                          <span>Delayed</span>
                        </span>
                      )}
                      {m.status === "In Progress" && (
                        <span className="pd-status active">
                          <Clock size={12} strokeWidth={2.5} />
                          <span>In Progress</span>
                        </span>
                      )}
                      {m.status === "Locked" && (
                        <span className="pd-status locked">
                          <Lock size={12} strokeWidth={2.5} />
                          <span>Locked</span>
                        </span>
                      )}
                    </td>
                    <td>
                      {m.grade === "Add Grade" ? (
                        <span>—</span>
                      ) : (
                        <span>{m.grade}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>
        </main>

        {/* ================= RIGHT SIDEBAR ================= */}
        <aside className="pd-sidebar">
          {/* Section 1: Teacher Assistant */}
          <div className="pd-sidebar-ta-block">
            Teacher Assistant: <strong>{teamDetails.ta}</strong>
          </div>

          {/* Section 2: Supervising Committee */}
          <article className="pd-card">
            <h2 className="pd-grade-milestone-title">Supervising Committee :</h2>
            <ul className="pd-sidebar-committee-list">
              {teamDetails.committee.map((member) => (
                <li key={member}>{member}</li>
              ))}
            </ul>
          </article>

          {/* Section 3: Grade Team Card */}
          <article
            ref={gradeCardRef}
            className={`pd-card ${gradeHighlight ? "pd-card-highlight" : ""}`}
          >
            <h2 className="pd-grade-milestone-title">Grade Team</h2>



            <div className="pd-grade-input-row">
              <span>Grade</span>
              <div className="pd-grade-input-box">
                <input
                  type="text"
                  className="pd-grade-input"
                  value={gradeVal}
                  onChange={(e) => setGradeVal(e.target.value)}
                  disabled={gradingLoading}
                />
                <span>/ {maxScoreDenom}</span>
              </div>
            </div>

            <button className="pd-grade-btn" onClick={handleSubmitGrade} disabled={gradingLoading}>
              {gradingLoading ? "Submitting..." : "Submit Grade"}
            </button>
          </article>

          {/* Section 4: Quick Actions Card */}
          <article className="pd-card">
            <h2 className="pd-grade-milestone-title" style={{ marginBottom: 18 }}>Quick Actions</h2>
            <div className="pd-action-list">
              <div className="pd-action-item" onClick={() => setShowNewMeeting(true)}>
                <Calendar size={14} />
                <span>Schedule Meeting</span>
              </div>
              <div className="pd-action-item" onClick={() => setShowAnnouncement(true)}>
                <Megaphone size={14} />
                <span>Send Announcement</span>
              </div>
            </div>
          </article>
        </aside>
      </div>

      {/* ================= MODALS ================= */}
      {selectedFile && (
        <GiveFeedbackModal
          file={selectedFile}
          onClose={() => setSelectedFile(null)}
          onSend={(file, feedback) => {
            setSelectedFile(null);
            loadData();
          }}
        />
      )}

      {showAnnouncement && (
        <SendAnnouncementModal onClose={() => setShowAnnouncement(false)} />
      )}

      {showNewMeeting && (
        <NewMeetingModal
          teamId={realTeamId || currentTeamId}
          teamName={teamDetails.title}
          onClose={() => setShowNewMeeting(false)}
          onSet={(payload) => {
            console.log("New meeting scheduled:", payload);
          }}
        />
      )}
    </>
  );
}