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
  min-width: 360px;
  text-align: left;
  font-size: 14px;
  line-height: 1.4;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pmt-current-milestone-row {
  display: grid;
  grid-template-columns: 86px minmax(0, 1fr);
  column-gap: 8px;
  row-gap: 2px;
  align-items: start;
}

.pmt-capstone-label {
  color: #0052CC;
  font-weight: 800;
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
  justify-content: flex-start;
  gap: 6px;
  margin-top: 3px;
  color: #EF534A;
  font-weight: 700;
  grid-column: 2;
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

const DEFAULT_CAPSTONE_OPTIONS = [
  { id: "1", name: "Capstone 1" },
  { id: "2", name: "Capstone 2" },
];

const firstFilled = (...values) =>
  values.find((value) => value !== undefined && value !== null && value !== "") ?? "";

const formatCapstoneLabel = (course, index = 0) => {
  const raw = String(firstFilled(course?.name, course?.title, course?.label, course, ""));
  const match = raw.match(/[12]/);

  if (/capstone/i.test(raw) && match) return `Capstone ${match[0]}`;
  if (match) return `Capstone ${match[0]}`;
  return raw || `Capstone ${index + 1}`;
};

const getCapstoneOptions = (projectCourses = []) => {
  const courses = Array.isArray(projectCourses) && projectCourses.length > 0
    ? projectCourses
    : DEFAULT_CAPSTONE_OPTIONS;

  return courses.map((course, index) => ({
    id: firstFilled(course.id, course.value, course.project_course_id, `${index + 1}`),
    name: formatCapstoneLabel(course, index),
    raw: course,
  }));
};

const normalizeMilestoneInfo = (source, fallbackCourse, index = 0) => {
  const milestone = firstFilled(source?.current_milestone, source?.milestone, source, {});
  const course = firstFilled(source?.project_course, source?.course, fallbackCourse, {});

  return {
    key: firstFilled(source?.key, source?.course_id, source?.project_course_id, course?.id, `capstone-${index + 1}`),
    label: formatCapstoneLabel(course, index),
    title: firstFilled(milestone?.title, milestone?.name, source?.title, source?.name, "Not assigned yet"),
    deadline: firstFilled(milestone?.deadline, milestone?.due_date, source?.deadline, source?.due_date, "TBD"),
  };
};

const extractCurrentMilestones = (dataObj, projectCourses = []) => {
  const courseOptions = getCapstoneOptions(projectCourses);
  const directSources = [
    dataObj?.current_milestones,
    dataObj?.current_milestones_by_course,
    dataObj?.current_milestones_by_project_course,
    dataObj?.capstone_current_milestones,
  ].filter(Boolean);

  let rows = [];

  directSources.forEach((source) => {
    if (Array.isArray(source)) {
      rows.push(...source.map((item, index) => normalizeMilestoneInfo(item, courseOptions[index]?.raw, index)));
    } else if (typeof source === "object") {
      rows.push(
        ...Object.entries(source).map(([key, value], index) =>
          normalizeMilestoneInfo({ key, ...value }, courseOptions[index]?.raw, index)
        )
      );
    }
  });

  if (rows.length === 0) {
    const withEmbeddedMilestones = courseOptions
      .filter((course) => course.raw?.current_milestone || course.raw?.milestone)
      .map((course, index) => normalizeMilestoneInfo(course.raw, course.raw, index));

    rows = withEmbeddedMilestones;
  }

  if (rows.length === 0 && dataObj?.current_milestone) {
    rows = [normalizeMilestoneInfo(dataObj, courseOptions[0]?.raw, 0)];
  }

  const normalized = rows.slice(0, 2);
  while (normalized.length < 2) {
    const option = courseOptions[normalized.length] || DEFAULT_CAPSTONE_OPTIONS[normalized.length];
    normalized.push({
      key: firstFilled(option?.id, `capstone-${normalized.length + 1}`),
      label: formatCapstoneLabel(option?.raw || option, normalized.length),
      title: "Not assigned yet",
      deadline: "TBD",
    });
  }

  return normalized;
};

const getImageUrl = (path) => {
  if (!path) return blockchainImg;
  if (path.startsWith("http")) return path;
  return `https://mango-attendant-handyman.ngrok-free.dev${path.startsWith("/") ? "" : "/"}${path}`;
};


export default function ProjectsManagedTeams() {
  const navigate = useNavigate();
  
  const [allTeams, setAllTeams] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [courseFilter, setCourseFilter] = useState("All");
  
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [showNewMeeting, setShowNewMeeting] = useState(false);
  const [meetingTeam, setMeetingTeam] = useState(null);

  const [meetings, setMeetings] = useState([]);
  const [meetingsCount, setMeetingsCount] = useState(0);

  // Dynamic Header states from API
  const [academicYearCode, setAcademicYearCode] = useState("2024-2025");
  const [currentMilestonesInfo, setCurrentMilestonesInfo] = useState([
    { key: "capstone-1", label: "Capstone 1", title: "Mid Evaluation", deadline: "2026-07-25" },
    { key: "capstone-2", label: "Capstone 2", title: "Not assigned yet", deadline: "TBD" },
  ]);

  // Dynamic Stats from API
  const [statsData, setStatsData] = useState({
    total_teams: 8,
    on_track: 3,
    delayed: 5,
    meetings_count: 1
  });

  // Dynamic Sidebar states from API
  const [pendingFeedbackState, setPendingFeedbackState] = useState([]);

  // Dynamic filter options from API
  const [filterOptions, setFilterOptions] = useState({
    departments: [],
    statuses: [],
    project_courses: []
  });

  // Calendar month & year state
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());

  const fetchTeams = async () => {
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (deptFilter !== "All") params.department_id = deptFilter;
      if (statusFilter !== "All") params.status = statusFilter;
      if (courseFilter !== "All") params.project_course_id = courseFilter;

      const [committeeRes, supervisedRes] = await Promise.allSettled([
        SupervisorService.getAllMilestoneTeams(params),
        SupervisorService.getSupervisedTeams(params)
      ]);

      let committeeDataObj = committeeRes.status === "fulfilled" ? committeeRes.value : null;
      let supervisedDataObj = supervisedRes.status === "fulfilled" ? supervisedRes.value : null;

      // Extract metadata & header info from committeeDataObj if available
      if (committeeDataObj) {
        const apiFilterOptions = committeeDataObj.filters?.options || {};
        const projectCourseOptions = apiFilterOptions.project_courses || committeeDataObj.project_courses || [];

        if (committeeDataObj.academic_year?.code) {
          setAcademicYearCode(committeeDataObj.academic_year.code);
        }

        setCurrentMilestonesInfo(extractCurrentMilestones(committeeDataObj, projectCourseOptions));

        if (committeeDataObj.statistics) {
          setStatsData({
            total_teams: committeeDataObj.statistics.total_teams ?? 0,
            on_track: committeeDataObj.statistics.on_track ?? 0,
            delayed: committeeDataObj.statistics.delayed ?? 0,
            meetings_count: committeeDataObj.statistics.meetings_count ?? 0
          });
          setMeetingsCount(committeeDataObj.statistics.meetings_count ?? 0);
        }
        if (committeeDataObj.filters?.options) {
          setFilterOptions(apiFilterOptions);
        }
      }

      const committeeFetched = committeeDataObj?.data || committeeDataObj?.projects || committeeDataObj || [];
      const supervisedFetched = supervisedDataObj?.data || supervisedDataObj?.projects || supervisedDataObj || [];

      const mapOverallStatus = (status) => {
        if (!status) return "On Track";
        const lower = status.toLowerCase();
        if (lower === "on_track") return "On Track";
        if (lower === "delayed") return "Delayed";
        if (lower === "pending_submission") return "Pending Submission";
        return status;
      };

      const mapCardStatus = (status) => {
        if (!status) return "Nothing";
        const lower = status.toLowerCase();
        if (lower === "pending_grades") return "Pending Grades";
        if (lower === "no_submission") return "Nothing";
        if (lower === "completed") return "Completed";
        if (lower === "pending_feedback") return "Pending Feedback";
        return status;
      };

      const adaptTeamItem = (item, type) => {
        const teamId = item.team_id || item.id || "A";
        const projectImage = getImageUrl(item.project?.image_url);

        // Parse milestones
        const adaptedMilestones = item.milestones?.map(m => ({
          milestone: m.title || m.milestone || m.name,
          status: m.status || "Completed",
          deadline: m.deadline || m.due_date || "TBD",
          grade: m.grade ? `${m.grade}/20` : "Add Grade",
          hasActions: m.status !== "Locked"
        })) || [];

        // Collect files
        let collectedFiles = [];
        if (item.last_submission?.file) {
          collectedFiles.push({
            id: item.last_submission.submission_id || item.last_submission.file.id,
            name: item.last_submission.file.file_name || "File.pdf",
            milestone: item.current_milestone?.title || "Last Submission",
            date: item.last_submission.submitted_at_human || "Recently",
            feedback: item.card_status === "pending_feedback" ? "Give Feedback" : "Given",
            icon: item.last_submission.file.file_name?.endsWith(".mp4") ? "mp4" : "pdf"
          });
        }

        // Tag values
        const tags = [];
        if (item.department?.name) tags.push(item.department.name);
        if (item.project?.category) tags.push(item.project.category);
        if (tags.length === 0) tags.push("IT", "Web");

        // Real members' avatars with fallbacks
        const avatars = Array.isArray(item.members) && item.members.length > 0
          ? item.members.map(m => getImageUrl(m.profile_image || m.image || ""))
          : [
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
              "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
            ];

        return {
          team_id: teamId,
          type: type,
          title: item.project?.title || item.title || "Project Title",
          description: item.project?.description || item.description || "Description",
          image: projectImage,
          badge: mapCardStatus(item.card_status),
          badgeColor: item.overall_status === "delayed" ? "#EF4444" : (item.overall_status === "pending_submission" ? "#F97316" : "#22C55E"),
          tags: tags,
          ta: item.supervisors?.ta?.name || item.supervisors?.ta_name || item.ta || "Teacher Assistant",
          status: mapOverallStatus(item.overall_status),
          statusColor: item.overall_status === "delayed" ? "#EF4444" : (item.overall_status === "pending_submission" ? "#F97316" : "#22C55E"),
          statusBg: item.overall_status === "delayed" ? "#FEE2E2" : (item.overall_status === "pending_submission" ? "#FFEDD5" : "#DCFCE7"),
          submissionType: item.last_submission?.file?.file_name || "No submission yet",
          submissionDate: item.last_submission?.submitted_at_human || "",
          avatars: avatars,
          files: collectedFiles,
          milestones: adaptedMilestones
        };
      };

      const adaptedCommittee = Array.isArray(committeeFetched) ? committeeFetched.map(t => adaptTeamItem(t, "committee")) : [];
      const adaptedSupervised = Array.isArray(supervisedFetched) ? supervisedFetched.map(t => adaptTeamItem(t, "supervised")) : [];

      const combined = [...adaptedCommittee, ...adaptedSupervised];
      const uniqueTeams = [];
      const seenIds = new Set();
      for (const t of combined) {
        if (!seenIds.has(t.team_id)) {
          seenIds.add(t.team_id);
          uniqueTeams.push(t);
        }
      }

      setAllTeams(uniqueTeams);

      // Map sidebar items directly if provided by API
      if (committeeDataObj) {
        if (Array.isArray(committeeDataObj.pending_feedback)) {
          const adaptedFeedbacks = committeeDataObj.pending_feedback.map(f => ({
            teamId: f.team_id,
            title: f.project_title,
            ta: "Teacher Assistant",
            file: {
              name: "Submitted File",
              date: f.submitted_at ? new Date(f.submitted_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "3 weeks ago",
              feedback: "Give Feedback"
            }
          }));
          setPendingFeedbackState(adaptedFeedbacks);
        }

        if (Array.isArray(committeeDataObj.upcoming_meetings)) {
          const adaptedMeetings = committeeDataObj.upcoming_meetings.map(m => ({
            id: m.id,
            team_id: m.team_id,
            meeting_name: m.title || "Meeting",
            date: m.date || m.scheduled_at?.split(" ")[0],
            time: m.time,
            link: m.link || "",
            team: { name: m.project_title }
          }));
          setMeetings(adaptedMeetings);
        }
      }

    } catch (e) {
      console.warn("Failed fetching teams from API:", e);
    }
  };

  const fetchMeetings = async () => {
    try {
      const res = await SupervisorService.getComingMeetings();
      const parsed = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : (Array.isArray(res?.meetings) ? res.meetings : []));
      
      const saved = localStorage.getItem("local_meetings") || "[]";
      const local = JSON.parse(saved);
      const combined = [...parsed, ...local];
      
      setMeetings(combined);
    } catch (e) {
      console.warn("Failed loading meetings:", e);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, [searchTerm, deptFilter, statusFilter, courseFilter]);

  useEffect(() => {
    fetchMeetings();
  }, []);

  const filteredProjects = allTeams.filter(project => {
    // 1. Search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const titleMatch = (project.title || "").toLowerCase().includes(term);
      const descMatch = (project.description || "").toLowerCase().includes(term);
      const taMatch = (project.ta || "").toLowerCase().includes(term);
      const teamIdMatch = String(project.team_id).toLowerCase().includes(term);
      if (!titleMatch && !descMatch && !taMatch && !teamIdMatch) return false;
    }

    // 2. Department filter
    if (deptFilter !== "All") {
      const deptMatch = project.tags?.some(tag => tag.toLowerCase() === deptFilter.toLowerCase());
      if (!deptMatch) return false;
    }

    // 3. Status filter
    if (statusFilter !== "All") {
      const statusMatch = String(project.status).toLowerCase().replace(/\s+/g, "_") === statusFilter.toLowerCase().replace(/\s+/g, "_");
      if (!statusMatch) return false;
    }

    return true;
  });

  const totalTeamsCount = allTeams.length;
  const onTrackCount = allTeams.filter(p => p.status === "On Track").length;
  const delayedCount = allTeams.filter(p => p.status === "Delayed").length;

  const getDaysInMonth = (year, month) => {
    const firstDay = new Date(year, month, 1).getDay(); // Sun=0, Mon=1...
    const numDays = new Date(year, month + 1, 0).getDate();
    const startOffset = firstDay === 0 ? 6 : firstDay - 1;
    
    const cells = [];
    const prevNumDays = new Date(year, month, 0).getDate();
    for (let i = startOffset - 1; i >= 0; i--) {
      cells.push({ day: prevNumDays - i, isMuted: true, monthOffset: -1 });
    }
    
    for (let d = 1; d <= numDays; d++) {
      cells.push({ day: d, isMuted: false, monthOffset: 0 });
    }
    
    const totalCells = cells.length <= 35 ? 35 : 42;
    const remaining = totalCells - cells.length;
    for (let d = 1; d <= remaining; d++) {
      cells.push({ day: d, isMuted: true, monthOffset: 1 });
    }
    
    return cells;
  };

  const calendarCells = getDaysInMonth(calYear, calMonth);
  const MONTHS_LIST = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrevMonth = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear(prev => prev - 1);
    } else {
      setCalMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear(prev => prev + 1);
    } else {
      setCalMonth(prev => prev + 1);
    }
  };

  const checkHasMeeting = (dayObj) => {
    if (dayObj.isMuted) return false;
    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(dayObj.day).padStart(2, "0")}`;
    return meetings.some(meet => {
      if (!meet.date) return false;
      return meet.date.split("T")[0] === dateStr;
    });
  };

  // 1. Pending Feedback List from real files & API state
  const combinedPendingFeedback = [];
  const seenFeedbackIds = new Set();
  
  // Add from API state first
  if (Array.isArray(pendingFeedbackState)) {
    pendingFeedbackState.forEach(item => {
      const key = `${item.teamId}-${item.file?.name}`;
      if (item.teamId && !seenFeedbackIds.has(key)) {
        seenFeedbackIds.add(key);
        combinedPendingFeedback.push(item);
      }
    });
  }

  // Add from file list
  allTeams.forEach(t => {
    if (Array.isArray(t.files)) {
      t.files.forEach(f => {
        if (f.feedback === "Give Feedback") {
          const key = `${t.team_id}-${f.name}`;
          if (!seenFeedbackIds.has(key)) {
            seenFeedbackIds.add(key);
            combinedPendingFeedback.push({
              teamId: t.team_id,
              title: t.title,
              ta: t.ta,
              file: f,
              type: t.type
            });
          }
        }
      });
    }
  });

  // 2. Recently Graded List from real milestones
  const recentlyGradedList = [];
  allTeams.forEach(t => {
    if (Array.isArray(t.milestones)) {
      t.milestones.forEach(m => {
        if (m.grade && m.grade !== "Add Grade" && m.grade !== "---") {
          const numGrade = parseFloat(m.grade);
          const percent = isNaN(numGrade) ? 90 : Math.round((numGrade / 20) * 100);
          recentlyGradedList.push({
            teamId: t.team_id,
            title: t.title,
            milestone: m.milestone,
            grade: m.grade,
            percent: percent,
            date: m.deadline || "Jan 25"
          });
        }
      });
    }
  });

  // 3. Recent Activity List from submissions and grading
  const recentActivityList = [];
  allTeams.forEach(t => {
    if (Array.isArray(t.files)) {
      t.files.forEach(f => {
        recentActivityList.push({
          type: "submission",
          teamId: t.team_id,
          action: `submitted ${f.milestone}`,
          time: f.date || "1 day ago"
        });
      });
    }
    if (Array.isArray(t.milestones)) {
      t.milestones.forEach(m => {
        if (m.grade && m.grade !== "Add Grade" && m.grade !== "---") {
          recentActivityList.push({
            type: "grade",
            teamId: t.team_id,
            action: `graded ${m.milestone} (${m.grade})`,
            time: "recently"
          });
        }
      });
    }
  });

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
              <p>Academic Year {academicYearCode}</p>
            </div>

            <div className="pmt-header-info">
              {currentMilestonesInfo.map((milestone) => (
                <div className="pmt-current-milestone-row" key={milestone.key}>
                  <span className="pmt-capstone-label">{milestone.label}:</span>
                  <div>
                    <span className="pmt-milestone-label">Current Milestone: </span>
                    <span className="pmt-milestone-value">{milestone.title}</span>
                  </div>
                  <div className="pmt-deadline-row">
                    <Calendar size={15} strokeWidth={2.4} />
                    <span>Deadline: {milestone.deadline}</span>
                  </div>
                </div>
              ))}
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
              <div className="pmt-stat-value" style={{ color: "#0052CC" }}>{statsData.total_teams}</div>
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
              <div className="pmt-stat-value" style={{ color: "#22C55E" }}>{statsData.on_track}</div>
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
              <div className="pmt-stat-value" style={{ color: "#EF4444" }}>{statsData.delayed}</div>
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
              <div className="pmt-stat-value" style={{ color: "#4A5568" }}>{statsData.meetings_count}</div>
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
                {filterOptions.departments?.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
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
                {filterOptions.statuses?.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            <div className="pmt-filter-group">
              <span>Capstone:</span>
              <select
                className="pmt-filter-select"
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
              >
                <option value="All">All</option>
                {filterOptions.project_courses?.map(pc => (
                  <option key={pc.id} value={pc.id}>{pc.name}</option>
                ))}
              </select>
            </div>
          </section>

          {/* ================= PROJECT LIST ================= */}
          <section>
            {filteredProjects.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '80px 40px',
                background: '#ffffff',
                borderRadius: '16px',
                color: '#A0AEC0',
                border: '1px dashed #E2E8F0',
                boxShadow: '0 4px 12px rgba(0,0,0,0.01)',
                marginTop: '20px',
                fontFamily: 'Inter, sans-serif'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
                <h3 style={{ margin: '0 0 8px', color: '#4A5568', fontWeight: 600 }}>No Managed Teams Found</h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#718096' }}>There are no projects or teams matching the selected criteria.</p>
              </div>
            ) : (
              filteredProjects.map((project) => (
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
                    <h2
                      className="pmt-card-title"
                      onClick={() => navigate(`/doctor/project-details?teamId=${project.team_id}&type=${project.type || 'supervised'}`)}
                      style={{ cursor: "pointer" }}
                    >
                      {project.title}
                    </h2>
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
                      onClick={() => navigate(`/doctor/project-details?teamId=${project.team_id}&giveFeedback=true&type=${project.type || 'supervised'}`)}
                    >
                      <Edit size={13} strokeWidth={2.4} />
                      <span>Give Feedback</span>
                    </button>
                    <button 
                      className="pmt-action-btn grade"
                      onClick={() => navigate(`/doctor/project-details?teamId=${project.team_id}&grade=true&type=${project.type || 'supervised'}`)}
                    >
                      <Star size={13} strokeWidth={2.4} />
                      <span>Grade Project</span>
                    </button>
                    <button
                      className="pmt-action-btn"
                      onClick={() => navigate(`/doctor/project-details?teamId=${project.team_id}&type=${project.type || 'supervised'}`)}
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
              ))
            )}
          </section>
        </div>

        {/* ================= SIDEBAR ================= */}
        <aside className="pmt-sidebar">
          {/* Calendar Section */}
          <div className="pmt-side-section">
            <h3 className="pmt-side-title">Upcoming Meetings</h3>
            <div className="pmt-calendar-wrapper">
              <div className="pmt-calendar-header">
                <button className="pmt-calendar-arrow" onClick={handlePrevMonth}>&lt;</button>
                <div className="pmt-calendar-title-text">{MONTHS_LIST[calMonth]} {calYear}</div>
                <button className="pmt-calendar-arrow" onClick={handleNextMonth}>&gt;</button>
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
                {calendarCells.map((cell, idx) => {
                  const hasMeet = checkHasMeeting(cell);

                  return (
                    <span
                      key={`${cell.day}-${idx}`}
                      className={`pmt-calendar-day ${cell.isMuted ? "pmt-calendar-muted" : ""} ${
                        hasMeet ? "pmt-calendar-active" : ""
                      }`}
                      title={hasMeet ? "Scheduled Meeting" : ""}
                    >
                      {cell.day}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Pending Feedback Section */}
          <div className="pmt-side-section">
            <h3 className="pmt-side-title">Pending Feedback</h3>
            {combinedPendingFeedback.length === 0 ? (
              <p className="pmt-empty-text" style={{ fontSize: "12px", color: "#A0AEC0", margin: "8px 0" }}>No pending feedbacks</p>
            ) : (
              combinedPendingFeedback.slice(0, 2).map((item, idx) => (
                <div
                  key={idx}
                  className="pmt-feedback-card"
                  onClick={() => navigate(`/doctor/project-details?teamId=${item.teamId}&giveFeedback=true&type=${item.type || 'supervised'}`)}
                  style={{ cursor: "pointer", marginBottom: "8px" }}
                >
                  <div className="pmt-feedback-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  </div>
                  <div className="pmt-feedback-info">
                    <h4 className="pmt-feedback-team">{String(item.teamId).length > 2 ? item.title : `Team ${item.teamId}`}</h4>
                    <p className="pmt-feedback-desc">{item.file?.name}</p>
                    <div className="pmt-feedback-time">{item.file?.date}</div>
                  </div>
                  <div className="pmt-feedback-edit">
                    <Edit size={14} strokeWidth={2.5} />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Recently Graded Section */}
          <div className="pmt-side-section">
            <h3 className="pmt-side-title">Recently Graded</h3>
            {recentlyGradedList.length === 0 ? (
              <p className="pmt-empty-text" style={{ fontSize: "12px", color: "#A0AEC0", margin: "8px 0" }}>No graded milestones yet</p>
            ) : (
              recentlyGradedList.slice(0, 2).map((item, idx) => (
                <div key={idx} className="pmt-graded-card" style={{ marginBottom: "8px" }}>
                  <div className="pmt-graded-row">
                    <div className="pmt-graded-left">
                      <Star className="pmt-graded-star" size={13} fill="currentColor" />
                      <div>
                        <h4 className="pmt-graded-team">{item.teamId.length > 2 ? item.title : `Team ${item.teamId}`}</h4>
                        <p className="pmt-graded-desc">{item.milestone}</p>
                      </div>
                    </div>
                    <div className="pmt-grade-badge">{item.percent}%</div>
                  </div>
                  <div className="pmt-graded-date">{item.date}</div>
                </div>
              ))
            )}
          </div>

          {/* Recent Activity Section */}
          <div className="pmt-side-section">
            <h3 className="pmt-side-title">Recent Activity</h3>
            <div className="pmt-activity-card">
              {recentActivityList.length === 0 ? (
                <p className="pmt-empty-text" style={{ fontSize: "12px", color: "#A0AEC0", padding: "8px 0" }}>No recent activity</p>
              ) : (
                recentActivityList.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="pmt-activity-row" style={{ marginBottom: "8px" }}>
                    {item.type === "submission" ? (
                      <FileText className="pmt-activity-icon" size={14} />
                    ) : (
                      <Star className="pmt-activity-icon" size={14} />
                    )}
                    <div className="pmt-activity-copy">
                      <div>
                        <span
                          className="pmt-activity-team-link"
                          style={{ color: "#22C55E" }}
                          onClick={() => navigate(`/doctor/project-details?teamId=${item.teamId}&type=committee`)}
                        >
                          {item.teamId.length > 2 ? "Team" : `Team ${item.teamId}`}
                        </span>{" "}
                        {item.action}
                      </div>
                      <div className="pmt-activity-time">{item.time}</div>
                    </div>
                  </div>
                ))
              )}
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
