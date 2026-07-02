import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  X,
} from "lucide-react";
import SendAnnouncementModal from "./SendAnnouncementModal";
import { customFetch } from "../apis/apiMain";
import { SupervisorService } from "../Services/SupervisorServices";
import { toast } from "react-hot-toast";
import NewMeetingModal from "../Components/NewMeetingModal";

// Import local images
import blockchainImg from "../assets/blockchain_project.png";
import aiHealthImg from "../assets/ai_health_project.png";
import vrImg from "../assets/vr_project.png";
import iotImg from "../assets/iot_project.png";

const pmtCss = `
.pmt-container {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  display: flex;
  min-height: calc(100vh - 64px);
  background: #F4F6F9;
  box-sizing: border-box;
}

.pmt-main-content {
  flex: 1;
  padding: 32px 36px;
  box-sizing: border-box;
}

.pmt-sidebar {
  width: 320px;
  flex: 0 0 320px;
  background: #F8FAFC;
  border-left: 1px solid #E2E8F0;
  padding: 32px 24px;
  box-sizing: border-box;
}

/* Header style */
.pmt-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;
}

.pmt-header-title h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  color: #1A202C;
}

.pmt-header-title p {
  margin: 4px 0 0;
  font-size: 14px;
  color: #718096;
  font-style: italic;
  font-family: "Georgia", serif;
}

.pmt-header-info {
  text-align: right;
  font-size: 14px;
  line-height: 1.4;
}

.pmt-milestone-label {
  color: #0052CC;
  font-weight: 700;
}

.pmt-milestone-value {
  color: #4A5568;
  font-weight: 500;
}

.pmt-deadline-row {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  margin-top: 6px;
  color: #EF534A;
  font-weight: 700;
}

/* Stats Cards */
.pmt-stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 28px;
}

.pmt-stat-card {
  background: #ffffff;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.pmt-stat-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #4A5568;
  font-size: 14px;
  font-weight: 600;
}

.pmt-stat-top-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pmt-stat-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.pmt-stat-arrow {
  color: #A0AEC0;
  font-size: 14px;
  font-weight: 400;
}

.pmt-stat-value {
  text-align: center;
  font-size: 36px;
  font-weight: 700;
  margin-top: 14px;
  line-height: 1;
}

/* Filters */
.pmt-filters-bar {
  display: flex;
  gap: 16px;
  margin-bottom: 28px;
}

.pmt-search-wrapper {
  position: relative;
  flex: 1;
}

.pmt-search-icon {
  position: absolute;
  top: 50%;
  left: 14px;
  transform: translateY(-50%);
  color: #A0AEC0;
}

.pmt-search-input {
  width: 100%;
  height: 40px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  padding: 0 16px 0 40px;
  font-size: 14px;
  outline: none;
  background: #ffffff;
  box-sizing: border-box;
}

.pmt-filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #4A5568;
  font-weight: 600;
}

.pmt-filter-select {
  height: 40px;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  padding: 0 32px 0 12px;
  font-size: 13px;
  outline: none;
  background: #ffffff;
  color: #0052CC;
  font-weight: 700;
  min-width: 80px;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%230052CC' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  box-sizing: border-box;
}

/* Project Cards */
.pmt-card {
  background: #ffffff;
  border: 1px solid #E2E8F0;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  display: flex;
  margin-bottom: 24px;
  overflow: hidden;
}

.pmt-card-left {
  width: 200px;
  flex: 0 0 200px;
  display: flex;
  flex-direction: column;
  padding: 16px 0 16px 16px;
  box-sizing: border-box;
}

.pmt-card-image {
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

.pmt-card-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 6px 12px;
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  box-sizing: border-box;
  border-radius: 8px;
  margin-top: 10px;
  width: 100%;
}

.pmt-card-middle {
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
}

.pmt-card-title {
  font-size: 18px;
  font-weight: 700;
  color: #1A202C;
  margin: 0 0 8px;
}

.pmt-card-desc {
  font-size: 13px;
  color: #718096;
  margin: 0 0 16px;
  line-height: 1.4;
}

.pmt-card-tags {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  font-size: 13px;
}

.pmt-team-tag-label {
  font-weight: 700;
  color: #4A5568;
}

.pmt-chip {
  background: #EBF8FF;
  color: #2B6CB0;
  font-weight: 600;
  font-size: 11px;
  padding: 3px 8px;
  border-radius: 4px;
}

.pmt-ta-info {
  font-size: 13px;
  color: #4A5568;
  margin: 0;
}

.pmt-ta-info strong {
  color: #0052CC;
  font-weight: 700;
}

.pmt-card-right-mid {
  width: 160px;
  padding: 24px 12px;
  border-right: 1px solid #F1F5F9;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  box-sizing: border-box;
}

.pmt-avatars {
  display: flex;
  align-items: center;
}

.pmt-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid #ffffff;
  margin-right: -8px;
  object-fit: cover;
}

.pmt-avatar-more {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #E2E8F0;
  color: #4A5568;
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #ffffff;
}

.pmt-status-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
}

.pmt-submission-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-align: center;
}

.pmt-sub-date-title {
  font-size: 10px;
  color: #718096;
  font-weight: 600;
}

.pmt-sub-file-row {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: #4A5568;
  font-weight: 500;
}

.pmt-card-actions {
  width: 150px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  box-sizing: border-box;
}

.pmt-action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 32px;
  background: #ffffff;
  border: 1px solid #E2E8F0;
  border-radius: 6px;
  color: #4A5568;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.pmt-action-btn:hover {
  background: #F7FAFC;
  border-color: #CBD5E0;
}

.pmt-action-btn.grade {
  border-color: #F6AD55;
}

.pmt-action-btn.grade:hover {
  background: #FFFAF0;
}

/* Sidebar Sections */
.pmt-side-section {
  margin-bottom: 28px;
}

.pmt-side-title {
  font-size: 15px;
  font-weight: 700;
  color: #1A202C;
  margin: 0 0 12px;
}

/* Calendar styling override */
.pmt-calendar-wrapper {
  background: #ffffff;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 16px 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}

.pmt-calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.pmt-calendar-title-text {
  font-size: 12px;
  font-weight: 600;
  color: #718096;
}

.pmt-calendar-arrow {
  border: 0;
  background: transparent;
  color: #718096;
  cursor: pointer;
  padding: 0 4px;
}

.pmt-calendar-weekdays,
.pmt-calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
}

.pmt-calendar-weekdays {
  color: #0052CC;
  font-size: 10px;
  font-weight: 700;
  margin-bottom: 8px;
}

.pmt-calendar-days {
  row-gap: 12px;
  color: #4A5568;
  font-size: 10px;
  font-weight: 600;
}

.pmt-calendar-day {
  display: flex;
  width: 22px;
  height: 22px;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  border-radius: 999px;
}

.pmt-calendar-muted {
  color: #A0AEC0;
}

.pmt-calendar-active {
  background: #0052CC;
  color: #ffffff !important;
  font-weight: 700;
}

/* Feedback card */
.pmt-feedback-card {
  background: #ffffff;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  position: relative;
}

.pmt-feedback-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: #EBF8FF;
  color: #2B6CB0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pmt-feedback-info {
  flex: 1;
}

.pmt-feedback-team {
  font-size: 14px;
  font-weight: 700;
  color: #1A202C;
  margin: 0;
}

.pmt-feedback-desc {
  font-size: 11px;
  color: #718096;
  margin: 2px 0 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 140px;
}

.pmt-feedback-edit {
  color: #DD6B20;
  cursor: pointer;
  position: absolute;
  top: 16px;
  right: 16px;
}

.pmt-feedback-time {
  font-size: 10px;
  color: #A0AEC0;
  margin-top: 12px;
}

/* Graded Card */
.pmt-graded-card {
  background: #ffffff;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 14px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  margin-bottom: 12px;
}

.pmt-graded-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.pmt-graded-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pmt-graded-star {
  color: #D69E2E;
}

.pmt-graded-team {
  font-size: 13px;
  font-weight: 700;
  color: #1A202C;
  margin: 0;
}

.pmt-graded-desc {
  font-size: 11px;
  color: #718096;
  margin: 2px 0 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 140px;
}

.pmt-grade-badge {
  background: #EBF8FF;
  color: #2B6CB0;
  font-size: 11px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
}

.pmt-graded-date {
  font-size: 10px;
  color: #A0AEC0;
  text-align: right;
  margin-top: 6px;
}

/* Activity */
.pmt-activity-card {
  background: #ffffff;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}

.pmt-activity-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 10px 0;
  border-bottom: 1px solid #F1F5F9;
}

.pmt-activity-row:last-child {
  border-bottom: none;
}

.pmt-activity-icon {
  color: #718096;
  margin-top: 2px;
}

.pmt-activity-copy {
  flex: 1;
  font-size: 12px;
  color: #4A5568;
}

.pmt-activity-team-link {
  font-weight: 700;
  cursor: pointer;
}

.pmt-activity-time {
  font-size: 10px;
  color: #A0AEC0;
  margin-top: 2px;
}

/* Actions list */
.pmt-actions-card {
  background: #ffffff;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  overflow: hidden;
}

.pmt-action-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  color: #4A5568;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  border-bottom: 1px solid #F1F5F9;
  transition: background 0.2s ease;
}

.pmt-action-link:last-child {
  border-bottom: none;
}

.pmt-action-link:hover {
  background: #F8FAFC;
}

.pmt-action-link svg {
  color: #718096;
}
`;

const defaultProjects = [
  {
    team_id: "A",
    title: "Blockchain-based Certificate",
    description: "Secure academic credential verification using Ethereum smart contracts.",
    image: blockchainImg,
    badge: "Completed",
    badgeColor: "#22C55E",
    tags: ["CS", "Blockchain", "Web"],
    ta: "Ahmed Fayez",
    status: "On Track",
    statusColor: "#22C55E",
    statusBg: "#DCFCE7",
    submissionType: "UI/UX Prototypes",
    submissionDate: "Jan 15",
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
    badge: "Pending Feedback",
    badgeColor: "#F97316",
    tags: ["CS", "Blockchain", "Web"],
    ta: "Mahmoud Nasr",
    status: "Delayed",
    statusColor: "#EF4444",
    statusBg: "#FEE2E2",
    submissionType: "UI/UX Prototypes",
    submissionDate: "Jan 15",
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
    badge: "Nothing",
    badgeColor: "#EF4444",
    tags: ["CS", "Blockchain", "Web"],
    ta: "Ali Gaber",
    status: "Pending Submission",
    statusColor: "#F97316",
    statusBg: "#FFEDD5",
    submissionType: "UI/UX Prototypes",
    submissionDate: "Jan 15",
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
    badge: "Pending Grades",
    badgeColor: "#2563EB",
    tags: ["CS", "Blockchain", "Web"],
    ta: "Mohamed Wael",
    status: "On Track",
    statusColor: "#22C55E",
    statusBg: "#DCFCE7",
    submissionType: "UI/UX Prototypes",
    submissionDate: "Jan 15",
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

export default function ProjectsManagedTeams() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState(defaultProjects);
  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [gradeFilter, setGradeFilter] = useState("All");
  
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [showNewMeeting, setShowNewMeeting] = useState(false);
  const [meetingTeam, setMeetingTeam] = useState(null);

  const fetchTeams = async () => {
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (deptFilter !== "All") {
        params.department_id = deptFilter === "CS" ? 1 : 2;
      }
      if (statusFilter !== "All") {
        params.status = statusFilter.toLowerCase().replace(/\s+/g, "_");
      }
      
      const res = await SupervisorService.getAllMilestoneTeams(params);
      console.log("Projects & Managed Teams loaded:", res);
      
      const fetched = res?.data?.projects || res?.projects || res?.data || res;
      if (Array.isArray(fetched) && fetched.length > 0) {
        const adapted = fetched.map(item => {
          const teamId = item.team_id || item.id || "A";
          let localImg = blockchainImg;
          if (teamId === "B") localImg = aiHealthImg;
          else if (teamId === "C") localImg = vrImg;
          else if (teamId === "D") localImg = iotImg;

          return {
            team_id: teamId,
            title: item.project?.title || item.title || "Project Title",
            description: item.project?.description || item.description || "Description",
            image: localImg,
            badge: item.status || "On Track",
            badgeColor: item.status === "Delayed" ? "#EF4444" : (item.status === "Pending" ? "#F97316" : "#22C55E"),
            tags: item.project?.tags || item.tags || ["CS", "Blockchain", "Web"],
            ta: item.ta?.name || item.ta || "Teacher Assistant",
            status: item.status || "On Track",
            statusColor: item.status === "Delayed" ? "#EF4444" : (item.status === "Pending" ? "#F97316" : "#22C55E"),
            statusBg: item.status === "Delayed" ? "#FEE2E2" : (item.status === "Pending" ? "#FFEDD5" : "#DCFCE7"),
            submissionType: item.last_submission?.type || "UI/UX Prototypes",
            submissionDate: item.last_submission?.date || "Jan 15",
            avatars: item.students?.map(s => s.avatar) || [
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
              "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
            ]
          };
        });
        setProjects(adapted);
      }
    } catch (e) {
      console.warn("Failed fetching teams from API, using local filtering. Error:", e);
      let localFiltered = defaultProjects;
      if (searchTerm) {
        localFiltered = localFiltered.filter(p => 
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
          p.ta.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      if (deptFilter !== "All") {
        localFiltered = localFiltered.filter(p => p.tags.includes(deptFilter));
      }
      if (statusFilter !== "All") {
        localFiltered = localFiltered.filter(p => p.status === statusFilter);
      }
      setProjects(localFiltered);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, [searchTerm, deptFilter, statusFilter]);

  return (
    <>
      <style>{pmtCss}</style>
      <div className="pmt-container">
        {/* ================= MAIN CONTENT ================= */}
        <div className="pmt-main-content">
          {/* ================= HEADER ================= */}
          <header className="pmt-header">
            <div className="pmt-header-title">
              <h1>Projects & Managed Teams</h1>
              <p>Academic Year 2025-2026</p>
            </div>

            <div className="pmt-header-info">
              <div>
                <span className="pmt-milestone-label">Current Milestone: </span>
                <span className="pmt-milestone-value">User Interface Design & Prototyping</span>
              </div>
              <div className="pmt-deadline-row">
                <Calendar size={15} strokeWidth={2.4} />
                <span>Deadline: Jan 30, 2026</span>
              </div>
            </div>
          </header>

          {/* ================= STATS ================= */}
          <section className="pmt-stats-grid">
            <div className="pmt-stat-card">
              <div className="pmt-stat-top">
                <div className="pmt-stat-top-left">
                  <div className="pmt-stat-icon-wrapper" style={{ color: "#0052CC" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  </div>
                  <span>Total Teams</span>
                </div>
                <span className="pmt-stat-arrow">&gt;</span>
              </div>
              <div className="pmt-stat-value" style={{ color: "#0052CC" }}>5</div>
            </div>

            <div className="pmt-stat-card">
              <div className="pmt-stat-top">
                <div className="pmt-stat-top-left">
                  <div className="pmt-stat-icon-wrapper" style={{ color: "#22C55E" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>
                  </div>
                  <span>On Track</span>
                </div>
                <span className="pmt-stat-arrow">&gt;</span>
              </div>
              <div className="pmt-stat-value" style={{ color: "#22C55E" }}>3</div>
            </div>

            <div className="pmt-stat-card">
              <div className="pmt-stat-top">
                <div className="pmt-stat-top-left">
                  <div className="pmt-stat-icon-wrapper" style={{ color: "#EF4444" }}>
                    <AlertTriangle size={18} strokeWidth={2.5} />
                  </div>
                  <span>Delayed</span>
                </div>
                <span className="pmt-stat-arrow">&gt;</span>
              </div>
              <div className="pmt-stat-value" style={{ color: "#EF4444" }}>1</div>
            </div>

            <div className="pmt-stat-card">
              <div className="pmt-stat-top">
                <div className="pmt-stat-top-left">
                  <div className="pmt-stat-icon-wrapper" style={{ color: "#718096" }}>
                    <Calendar size={18} strokeWidth={2.5} />
                  </div>
                  <span>Meetings This Week</span>
                </div>
                <span className="pmt-stat-arrow">&gt;</span>
              </div>
              <div className="pmt-stat-value" style={{ color: "#4A5568" }}>2</div>
            </div>
          </section>

          {/* ================= SEARCH & FILTERS ================= */}
          <section className="pmt-filters-bar">
            <div className="pmt-search-wrapper">
              <Search className="pmt-search-icon" size={16} strokeWidth={2.4} />
              <input
                type="text"
                placeholder="Search by team, project, or student"
                className="pmt-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="pmt-filter-group">
              <span>Department:</span>
              <select
                className="pmt-filter-select"
                value={deptFilter}
                onChange={(e) => setDeptFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="CS">CS</option>
                <option value="IS">IS</option>
              </select>
            </div>

            <div className="pmt-filter-group">
              <span>Status:</span>
              <select
                className="pmt-filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="On Track">On Track</option>
                <option value="Delayed">Delayed</option>
                <option value="Pending Submission">Pending Submission</option>
              </select>
            </div>

            <div className="pmt-filter-group">
              <span>Grade:</span>
              <select
                className="pmt-filter-select"
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
              >
                <option value="All">All</option>
                <option value="High">High</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </section>

          {/* ================= PROJECT LIST ================= */}
          <section>
            {projects.map((project) => (
              <div key={project.team_id} className="pmt-card">
                {/* Image and side-badge */}
                <div className="pmt-card-left">
                  <img src={project.image} alt={project.title} className="pmt-card-image" />
                  <div
                    className="pmt-card-badge"
                    style={{ background: project.badgeColor }}
                  >
                    {project.badge === "Completed" && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 2 }}><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2.5"/><polyline points="9 11 12 14 16 9"/></svg>
                    )}
                    {project.badge === "Pending Feedback" && (
                      <MessageSquare size={13} strokeWidth={2.5} style={{ marginRight: 2 }} />
                    )}
                    {project.badge === "Nothing" && (
                      <X size={13} strokeWidth={3} style={{ marginRight: 2 }} />
                    )}
                    {project.badge === "Pending Grades" && (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 2 }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                    )}
                    <span>{project.badge}</span>
                  </div>
                </div>

                {/* Details middle */}
                <div className="pmt-card-middle">
                  <h2 className="pmt-card-title">{project.title}</h2>
                  <p className="pmt-card-desc">"{project.description}"</p>
                  <div className="pmt-card-tags">
                    <span className="pmt-team-tag-label">Team {project.team_id}:</span>
                    {project.tags.map((tag) => (
                      <span key={tag} className="pmt-chip">{tag}</span>
                    ))}
                  </div>
                  <p className="pmt-ta-info">
                    Teacher Assistant: <strong>{project.ta}</strong>
                  </p>
                </div>

                {/* Middle Right Status */}
                <div className="pmt-card-right-mid">
                  {/* Avatars */}
                  <div className="pmt-avatars">
                    {project.avatars.map((url, idx) => (
                      <img key={idx} src={url} alt="student" className="pmt-avatar" />
                    ))}
                    <div className="pmt-avatar-more">+2</div>
                  </div>

                  {/* Status Pill */}
                  <div
                    className="pmt-status-pill"
                    style={{ background: project.statusBg, color: project.statusColor }}
                  >
                    {project.status === "On Track" && <Check size={11} strokeWidth={3} />}
                    {project.status === "Delayed" && <AlertTriangle size={11} strokeWidth={3} />}
                    {project.status === "Pending Submission" && <Clock size={11} strokeWidth={3} />}
                    <span>{project.status}</span>
                  </div>

                  {/* Submission */}
                  <div className="pmt-submission-block">
                    <div className="pmt-sub-date-title">Last Submission</div>
                    <div className="pmt-sub-file-row">
                      <FileText size={12} style={{ color: "#718096" }} />
                      <span>{project.submissionType}</span>
                    </div>
                    <div className="pmt-sub-date-title">{project.submissionDate}</div>
                  </div>
                </div>

                {/* Vertical actions */}
                <div className="pmt-card-actions">
                  <button className="pmt-action-btn">
                    <MessageSquare size={13} strokeWidth={2.4} />
                    <span>Message</span>
                  </button>
                  <button
                    className="pmt-action-btn"
                    onClick={() => navigate(`/doctor/project-details?teamId=${project.team_id}&giveFeedback=true&type=committee`)}
                  >
                    <Edit size={13} strokeWidth={2.4} />
                    <span>Give Feedback</span>
                  </button>
                  <button 
                    className="pmt-action-btn grade"
                    onClick={() => navigate(`/doctor/project-details?teamId=${project.team_id}&grade=true&type=committee`)}
                  >
                    <Star size={13} strokeWidth={2.4} />
                    <span>Grade Project</span>
                  </button>
                  <button
                    className="pmt-action-btn"
                    onClick={() => navigate(`/doctor/project-details?teamId=${project.team_id}&type=committee`)}
                  >
                    <FolderOpen size={13} strokeWidth={2.4} />
                    <span>Open Files</span>
                  </button>
                  <button className="pmt-action-btn">
                    <Edit size={13} strokeWidth={2.4} />
                    <span>Request Edit</span>
                  </button>
                </div>
              </div>
            ))}
          </section>
        </div>

        {/* ================= SIDEBAR ================= */}
        <aside className="pmt-sidebar">
          {/* Calendar Section */}
          <div className="pmt-side-section">
            <h3 className="pmt-side-title">Upcoming Meetings</h3>
            <div className="pmt-calendar-wrapper">
              <div className="pmt-calendar-header">
                <button className="pmt-calendar-arrow">&lt;</button>
                <div className="pmt-calendar-title-text">January 2026</div>
                <button className="pmt-calendar-arrow">&gt;</button>
              </div>

              <div className="pmt-calendar-weekdays">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>

              <div className="pmt-calendar-days">
                {calendarWeeks.flat().map((day, idx) => {
                  const faded = idx < 3 || idx > 33;
                  const active = idx === 28 || idx === 31; // Days 26 and 29

                  return (
                    <span
                      key={`${day}-${idx}`}
                      className={`pmt-calendar-day ${faded ? "pmt-calendar-muted" : ""} ${
                        active ? "pmt-calendar-active" : ""
                      }`}
                    >
                      {day}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Pending Feedback Section */}
          <div className="pmt-side-section">
            <h3 className="pmt-side-title">Pending Feedback</h3>
            <div className="pmt-feedback-card">
              <div className="pmt-feedback-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <div className="pmt-feedback-info">
                <h4 className="pmt-feedback-team">Team B</h4>
                <p className="pmt-feedback-desc">AI Mental Health Companion</p>
                <div className="pmt-feedback-time">3 days</div>
              </div>
              <div className="pmt-feedback-edit">
                <Edit size={14} strokeWidth={2.5} />
              </div>
            </div>
          </div>

          {/* Recently Graded Section */}
          <div className="pmt-side-section">
            <h3 className="pmt-side-title">Recently Graded</h3>

            <div className="pmt-graded-card">
              <div className="pmt-graded-row">
                <div className="pmt-graded-left">
                  <Star className="pmt-graded-star" size={13} fill="currentColor" />
                  <div>
                    <h4 className="pmt-graded-team">Team C</h4>
                    <p className="pmt-graded-desc">AI Mental Health Companion</p>
                  </div>
                </div>
                <div className="pmt-grade-badge">92%</div>
              </div>
              <div className="pmt-graded-date">Jan 26</div>
            </div>

            <div className="pmt-graded-card">
              <div className="pmt-graded-row">
                <div className="pmt-graded-left">
                  <Star className="pmt-graded-star" size={13} fill="currentColor" />
                  <div>
                    <h4 className="pmt-graded-team">Team E</h4>
                    <p className="pmt-graded-desc">VR Career Simulator</p>
                  </div>
                </div>
                <div className="pmt-grade-badge">86%</div>
              </div>
              <div className="pmt-graded-date">Jan 23</div>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="pmt-side-section">
            <h3 className="pmt-side-title">Recent Activity</h3>
            <div className="pmt-activity-card">
              <div className="pmt-activity-row">
                <FileText className="pmt-activity-icon" size={14} />
                <div className="pmt-activity-copy">
                  <div>
                    <span className="pmt-activity-team-link" style={{ color: "#22C55E" }}>
                      Team A
                    </span>{" "}
                    submitted UI Prototype
                  </div>
                  <div className="pmt-activity-time">30 mints ago</div>
                </div>
              </div>

              <div className="pmt-activity-row">
                <svg className="pmt-activity-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                <div className="pmt-activity-copy">
                  <div>
                    <span className="pmt-activity-team-link" style={{ color: "#22C55E" }}>
                      Team C
                    </span>{" "}
                    uploaded a file in Messages
                  </div>
                  <div className="pmt-activity-time">2 hours ago</div>
                </div>
              </div>

              <div className="pmt-activity-row">
                <Calendar className="pmt-activity-icon" size={14} />
                <div className="pmt-activity-copy">
                  <div>
                    <span className="pmt-activity-team-link" style={{ color: "#0052CC" }}>
                      Team B
                    </span>{" "}
                    requested a meeting
                  </div>
                  <div className="pmt-activity-time">1 day ago</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Section */}
          <div className="pmt-side-section">
            <h3 className="pmt-side-title">Quick Actions</h3>
            <div className="pmt-actions-card">
              <div
                className="pmt-action-link"
                onClick={() => {
                  setMeetingTeam(null);
                  setShowNewMeeting(true);
                }}
              >
                <Calendar size={14} />
                <span>Schedule Meeting</span>
              </div>
              <div className="pmt-action-link" onClick={() => setShowAnnouncement(true)}>
                <Megaphone size={14} />
                <span>Send Announcement</span>
              </div>
              <div className="pmt-action-link" onClick={() => navigate("/doctor/milestones")}>
                <Trophy size={14} />
                <span>View All Milestones</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {showAnnouncement && (
        <SendAnnouncementModal onClose={() => setShowAnnouncement(false)} />
      )}

      {showNewMeeting && (
        <NewMeetingModal
          teamId={meetingTeam?.team_id}
          teamName={meetingTeam?.title}
          onClose={() => setShowNewMeeting(false)}
        />
      )}
    </>
  );
}