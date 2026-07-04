import { useState, useEffect } from "react";
import {
  FaRegCalendarAlt,
  FaSearch,
  FaBell,
  FaUsers,
  FaUser,
  FaPlus,
  FaTimes,
  FaCheckSquare,
  FaRegSquare,
  FaEdit,
  FaChevronDown,
  FaExclamationTriangle
} from "react-icons/fa";
import { useAcademicYear } from "../context/Academicyearcontext";
import Milestones from "../Services/MilestonEs.model";
import { SupervisorService } from "../Services/SupervisorServices";
import logo from "../assets/logo2.png";
import Sidebar from "../Components/Sidebar";


// Mock Fallback Milestones matching the exact dataset, status, and layout from the mockup screens
const FALLBACK_MILESTONES = [
  {
    id: 1,
    phase: 1,
    title: "Project Kick-off & Discovery",
    status: "Completed",
    marks: 5,
    deadline: "Submitted: Nov 30, 2025",
    isOverdue: false,
    lateCount: 3,
    teamsSubmittedCount: 4,
    reqs: [
      "Lorem ipsum dolor sit amet, consectetur",
      "Lorem ipsum dolor sit amet, consectetur",
      "Lorem ipsum dolor sit amet, consectetur",
      "Lorem ipsum dolor sit amet, consectetur",
      "Lorem ipsum dolor sit amet, consectetur"
    ],
    teamsData: [
      { id: "t1", name: "Team A", status: "On Time", date: "10 Jan 2025", action: "View", grade: "18/20" },
      { id: "t2", name: "Team B", status: "Late", date: "10 Jan 2025", action: "View", grade: "16/20" },
      { id: "t3", name: "Team C", status: "On Time", date: "15 Jan 2025", action: "View", grade: "4/20" },
      { id: "t4", name: "Team D", status: "Late", date: "——", action: "Remind", grade: "Add Grade / 20" },
      { id: "t5", name: "Team E", status: "Late", date: "20 Jan 2025", action: "View", grade: "15/20" }
    ]
  },
  {
    id: 2,
    phase: 2,
    title: "User Interface Design & Prototyping",
    status: "On Progress",
    marks: 5,
    deadline: "Due: Jan 30, 2025",
    isOverdue: false,
    lateCount: 0,
    teamsSubmittedCount: 3,
    reqs: [
      "Lorem ipsum dolor sit amet, consectetur",
      "Lorem ipsum dolor sit amet, consectetur",
      "Lorem ipsum dolor sit amet, consectetur",
      "Lorem ipsum dolor sit amet, consectetur",
      "Lorem ipsum dolor sit amet, consectetur"
    ],
    teamsData: [
      { id: "t1", name: "Team A", status: "Submitted", date: "10 Jan 2025", action: "View" },
      { id: "t2", name: "Team B", status: "Not Yet", date: "——", action: "Remind" },
      { id: "t3", name: "Team C", status: "Submitted", date: "15 Jan 2025", action: "View" },
      { id: "t4", name: "Team D", status: "Not Yet", date: "——", action: "Remind" },
      { id: "t5", name: "Team E", status: "Submitted", date: "20 Jan 2025", action: "View" }
    ]
  },
  {
    id: 3,
    phase: 3,
    title: "Backend Development & API Integration",
    status: "On Progress",
    marks: 5,
    deadline: "Due: Jan 30, 2025",
    isOverdue: false,
    lateCount: 0,
    teamsSubmittedCount: 0,
    reqs: [
      "Lorem ipsum dolor sit amet, consectetur",
      "Lorem ipsum dolor sit amet, consectetur",
      "Lorem ipsum dolor sit amet, consectetur",
      "Lorem ipsum dolor sit amet, consectetur",
      "Lorem ipsum dolor sit amet, consectetur"
    ],
    teamsData: [
      { id: "t1", name: "Team A", status: "Not Yet", date: "——", action: "Remind" },
      { id: "t2", name: "Team B", status: "Not Yet", date: "——", action: "Remind" },
      { id: "t3", name: "Team C", status: "Not Yet", date: "——", action: "Remind" },
      { id: "t4", name: "Team D", status: "Not Yet", date: "——", action: "Remind" },
      { id: "t5", name: "Team E", status: "Not Yet", date: "——", action: "Remind" }
    ]
  },
  {
    id: 4,
    phase: 4,
    title: "Backend Development & API Integration",
    status: "Pending",
    marks: 5,
    deadline: "Due: Jan 30, 2025",
    isOverdue: false,
    lateCount: 0,
    teamsSubmittedCount: 0,
    reqs: [
      "Lorem ipsum dolor sit amet, consectetur",
      "Lorem ipsum dolor sit amet, consectetur",
      "Lorem ipsum dolor sit amet, consectetur",
      "Lorem ipsum dolor sit amet, consectetur",
      "Lorem ipsum dolor sit amet, consectetur"
    ]
  },
  {
    id: 5,
    phase: 5,
    title: "Testing & QA Deployment",
    status: "Pending",
    marks: 5,
    deadline: "Due: Feb 20, 2025",
    isOverdue: false,
    lateCount: 0,
    teamsSubmittedCount: 0,
    reqs: [
      "Lorem ipsum dolor sit amet, consectetur",
      "Lorem ipsum dolor sit amet, consectetur",
      "Lorem ipsum dolor sit amet, consectetur"
    ]
  },
  {
    id: 6,
    phase: 6,
    title: "Final Submission & Presentation",
    status: "Pending",
    marks: 5,
    deadline: "Due: Mar 15, 2025",
    isOverdue: true,
    lateCount: 0,
    teamsSubmittedCount: 4,
    reqs: [
      "Lorem ipsum dolor sit amet, consectetur",
      "Lorem ipsum dolor sit amet, consectetur"
    ],
    teamsData: [
      { id: "t4", name: "Team D", status: "Late", daysLate: "5 Days" }
    ]
  }
];

const TAB_CONFIG = [
  { k: "All", api: "all", label: "All" },
  { k: "On Progress", api: "on_progress", label: "On Progress" },
  { k: "Completed", api: "completed", label: "Completed" },
  { k: "Pending", api: "pending", label: "Pending" },
  { k: "Overdue", api: "overdue", label: "Overdue" },
];

const firstFilled = (...values) =>
  values.find((value) => value !== undefined && value !== null && value !== "") ?? "";

const hasFlag = (value) => value === true || value === 1 || value === "1" || value === "true";

const toStatus = (status) => {
  const raw = String(status || "").toLowerCase().replace(/[_-]+/g, " ");

  if (raw.includes("complete") || raw.includes("submitted")) return "Completed";
  if (raw.includes("progress") || raw.includes("ongoing") || raw.includes("current") || raw.includes("open")) {
    return "On Progress";
  }
  if (raw.includes("pending") || raw.includes("locked") || raw.includes("upcoming") || raw.includes("not started")) {
    return "Pending";
  }

  return status || "Pending";
};

const isOverdueMilestone = (milestone) => {
  const rawStatus = String(firstFilled(milestone.status, milestone.state)).toLowerCase();
  return (
    hasFlag(milestone.is_overdue) ||
    hasFlag(milestone.overdue) ||
    rawStatus.includes("overdue") ||
    rawStatus.includes("late") ||
    rawStatus.includes("delayed")
  );
};

const formatWithPrefix = (value, prefix) => {
  const text = firstFilled(value, "TBD");
  if (/^(due|submitted|deadline)\s*:/i.test(String(text))) return text;
  return `${prefix}: ${text}`;
};

const getArrayFromResponse = (response, preferredKeys = []) => {
  const roots = [response?.data?.data, response?.data, response].filter(Boolean);
  const keys = [...preferredKeys, "milestones", "teams", "items", "results", "data"];

  for (const root of roots) {
    if (Array.isArray(root)) return root;

    for (const key of keys) {
      const value = root?.[key];
      if (Array.isArray(value)) return value;
      if (value && typeof value === "object") {
        for (const nestedKey of keys) {
          if (Array.isArray(value[nestedKey])) return value[nestedKey];
        }
      }
    }
  }

  return [];
};

const getTabsFromResponse = (response) => {
  const roots = [response?.data?.data, response?.data, response].filter(Boolean);

  for (const root of roots) {
    const tabs = firstFilled(
      root?.tabs,
      root?.tab_counts,
      root?.tabs_counts,
      root?.counts,
      root?.filters,
      root?.meta?.tabs,
      root?.meta?.counts
    );

    if (tabs) return tabs;
  }

  return null;
};

const getTabCount = (tabs, tab, fallback) => {
  if (!tabs) return fallback;

  const config = TAB_CONFIG.find((item) => item.k === tab);
  const possibleKeys = [
    config?.api,
    config?.k,
    config?.label,
    config?.k?.toLowerCase(),
    config?.label?.toLowerCase(),
    config?.label?.toLowerCase().replace(/\s+/g, "_"),
  ].filter(Boolean);

  if (Array.isArray(tabs)) {
    const match = tabs.find((item) => {
      const key = String(firstFilled(item.key, item.name, item.label, item.status, item.tab)).toLowerCase();
      return possibleKeys.some((possible) => key === String(possible).toLowerCase());
    });

    return Number(firstFilled(match?.count, match?.total, match?.value, fallback));
  }

  if (typeof tabs === "object") {
    for (const key of possibleKeys) {
      const value = tabs[key];
      if (typeof value === "number") return value;
      if (value && typeof value === "object") {
        return Number(firstFilled(value.count, value.total, value.value, fallback));
      }
    }
  }

  return fallback;
};

const normalizeRequirementText = (item) => {
  const value = firstFilled(
    item?.requirement,
    item?.title,
    item?.name,
    item?.description,
    item?.text,
    item?.value,
    typeof item === "object" ? "" : item
  );

  return value === undefined || value === null ? "" : String(value);
};

const normalizeRequirements = (requirements) => {
  const list = Array.isArray(requirements) ? requirements : [];
  const normalized = list
    .map(normalizeRequirementText)
    .filter(Boolean);

  return normalized.length ? normalized : ["Requirement details"];
};

const formatGrade = (grade, maxMarks = 20) => {
  if (grade === undefined || grade === null || grade === "") return `Add Grade / ${maxMarks}`;
  const text = String(grade);
  if (text.includes("/")) {
    const parts = text.split("/");
    const numerator = parts[0].trim();
    const denominator = parts[1]?.trim();
    if (denominator === "20" && String(maxMarks) !== "20") {
      return `${numerator}/${maxMarks}`;
    }
    return text;
  }
  return text.toLowerCase().includes("add") ? text : `${text}/${maxMarks}`;
};


const formatDaysLate = (value) => {
  if (value === undefined || value === null || value === "") return "Late";
  const text = String(value);
  if (text.toLowerCase().includes("day")) return text;
  return `${text} Days`;
};

const normalizeLookupText = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/phase\s*\d+\s*:?\s*/g, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const getMilestoneCandidateId = (milestone) =>
  firstFilled(
    milestone?.id,
    milestone?.milestone_id,
    milestone?.milestone?.id,
    milestone?.project_course_milestone_id,
    milestone?.pivot?.milestone_id
  );

const normalizeMilestone = (milestone, index = 0) => {
  const isOverdue = isOverdueMilestone(milestone);
  const status = toStatus(firstFilled(milestone.status, milestone.state));
  const submittedAt = firstFilled(milestone.submitted_at, milestone.submission_date, milestone.submitted_date);
  const deadline = firstFilled(milestone.deadline, milestone.due_date, milestone.end_date, milestone.date);

  return {
    id: firstFilled(milestone.id, milestone.milestone_id, milestone.milestone?.id, index + 1),
    committeeId: firstFilled(
      milestone.committee_id,
      milestone.milestone_committee_id,
      milestone.milestone_committee?.id,
      milestone.committee?.id,
      milestone.id,
      milestone.milestone_id,
      index + 1
    ),
    phase: firstFilled(milestone.phase, milestone.phase_number, milestone.order, milestone.sort_order, index + 1),
    title: firstFilled(milestone.title, milestone.name, milestone.milestone_title, milestone.milestone?.title, "Untitled Milestone"),
    status,
    marks: firstFilled(milestone.marks, milestone.mark, milestone.max_marks, milestone.max_score, milestone.score, 5),
    deadline: submittedAt && status === "Completed" ? formatWithPrefix(submittedAt, "Submitted") : formatWithPrefix(deadline, "Due"),
    isOverdue,
    lateCount: Number(firstFilled(milestone.late_count, milestone.late_teams_count, milestone.teams_late_count, milestone.stats?.late, 0)),
    teamsSubmittedCount: Number(
      firstFilled(
        milestone.teams_submitted_count,
        milestone.submitted_teams_count,
        milestone.submitted_count,
        milestone.teams_submitted,
        milestone.stats?.submitted,
        0
      )
    ),
    teamsTotalCount: Number(
      firstFilled(milestone.teams_total_count, milestone.total_teams, milestone.teams_count, milestone.stats?.total, 5)
    ),
    reqs: normalizeRequirements(firstFilled(milestone.requirements, milestone.reqs, milestone.tasks, [])),
    teamsData: Array.isArray(milestone.teamsData) ? milestone.teamsData : [],
  };
};

const normalizeTeamStatus = (team) => {
  const raw = String(firstFilled(team.status, team.submission_status, team.state)).toLowerCase().replace(/[_-]+/g, " ");

  if (hasFlag(team.is_late) || raw.includes("late") || raw.includes("overdue") || raw.includes("delayed")) {
    return "Late";
  }
  if (raw.includes("submitted") || raw.includes("complete") || raw.includes("on time")) return "Submitted";
  if (raw.includes("not") || raw.includes("pending") || raw.includes("missing")) return "Not Yet";

  return firstFilled(team.status, team.submission_status, "Not Yet");
};

const normalizeTeam = (team, maxMarks = 20) => {
  const status = normalizeTeamStatus(team);
  const daysLate = firstFilled(team.days_late, team.late_days, team.delay_days);
  const nestedTeam = firstFilled(
    team.team,
    team.project_team,
    team.projectTeam,
    team.group,
    team.project?.team,
    {}
  );
  const project = firstFilled(team.project, nestedTeam.project, team.team?.project, {});
  const teamId = firstFilled(
    team.team_id,
    nestedTeam.id,
    team.project_team_id,
    team.projectTeam?.id,
    team.group_id,
    team.group?.id,
    team.id
  );
  const teamName = firstFilled(
    team.team_name,
    nestedTeam.name,
    team.name,
    project.title,
    project.name,
    team.project_title,
    teamId ? `Team ${teamId}` : "Unknown Team"
  );

  return {
    id: teamId,
    gradeMilestoneId: firstFilled(
      team.milestone_id,
      team.current_milestone_id,
      team.current_milestone?.id,
      team.milestone?.id,
      team.milestone_committee?.milestone_id,
      team.milestone_committee?.milestone?.id,
      team.committee_milestone_id,
      team.project_course_milestone_id,
      team.pivot?.milestone_id
    ),
    name: String(teamName),
    status,
    date: firstFilled(team.submission_date, team.submitted_at, team.date, "--"),
    action: status === "Submitted" || status === "On Time" ? "View" : "Remind",
    grade: formatGrade(firstFilled(team.grade, team.milestone_grade, team.score), maxMarks),
    daysLate: formatDaysLate(firstFilled(daysLate, team.daysLate)),
  };
};

const countForTab = (list, tab) =>
  list.filter((milestone) => {
    if (tab === "All") return !milestone.isOverdue;
    if (tab === "On Progress") return milestone.status === "On Progress" && !milestone.isOverdue;
    if (tab === "Completed") return milestone.status === "Completed" && !milestone.isOverdue;
    if (tab === "Pending") return milestone.status === "Pending" && !milestone.isOverdue;
    if (tab === "Overdue") return milestone.isOverdue;
    return true;
  }).length;

const getMockGrades = () => {
  try {
    const saved = localStorage.getItem("mock_milestone_grades");
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
};

const getRestoredFallback = () => {
  const grades = getMockGrades();
  return FALLBACK_MILESTONES.map(m => {
    if (!m.teamsData) return m;
    const updatedTeams = m.teamsData.map(t => {
      const key = `${m.id}-${t.id}`;
      if (grades[key]) {
        return { ...t, grade: grades[key] };
      }
      return t;
    });
    return { ...m, teamsData: updatedTeams };
  });
};

const resolveGradeMilestoneId = async (teamId, milestone, team) => {
  try {
    const response = await Milestones.getAllowableMilestones(teamId);
    const list = getArrayFromResponse(response, ["milestones"]);
    const currentTitle = normalizeLookupText(milestone.title);

    const matched = list.find((item) => {
      const itemTitle = normalizeLookupText(
        firstFilled(item.title, item.name, item.milestone, item.milestone?.title)
      );

      return (
        itemTitle === currentTitle ||
        String(getMilestoneCandidateId(item)) === String(team.gradeMilestoneId) ||
        String(getMilestoneCandidateId(item)) === String(milestone.id)
      );
    });

    const matchedId = getMilestoneCandidateId(matched);
    if (matchedId) return matchedId;
  } catch (err) {
    console.warn("Failed to resolve allowable milestone for grading:", err);
  }

  return firstFilled(team.gradeMilestoneId, milestone.id);
};

export default function MilestonesSetup() {
  const { academicYear } = useAcademicYear();
  const [viewAs, setViewAs] = useState("supervisor"); // committee or supervisor
  const [activeTab, setActiveTab] = useState("All"); // All, On Progress, Completed, Pending, Overdue
  const [showModal, setShowModal] = useState(false);
  const [expandedMsTableId, setExpandedMsTableId] = useState(null); // ID of currently expanded milestone table
  const [milestones, setMilestones] = useState([]);
  const [tabCounts, setTabCounts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notesState, setNotesState] = useState({}); // Stores the note value of milestone inputs
  const [doctorTeamsCount, setDoctorTeamsCount] = useState(null);

  // Fetch the count of doctor's managed teams (either supervised or in committee)
  useEffect(() => {
    const fetchDoctorTeamsCount = async () => {
      try {
        let count = 0;
        if (viewAs === "supervisor") {
          const res = await SupervisorService.getSupervisedTeams();
          const fetched = getArrayFromResponse(res, ["projects", "teams"]);
          count = fetched.length;
        } else {
          const res = await SupervisorService.getAllMilestoneTeams();
          const fetched = getArrayFromResponse(res, ["projects", "teams"]);
          count = fetched.length;
        }
        if (count > 0) {
          setDoctorTeamsCount(count);
        }
      } catch (err) {
        console.warn("Failed to fetch doctor teams count:", err);
      }
    };
    fetchDoctorTeamsCount();
  }, [viewAs]);

  useEffect(() => {
    const fetchMilestones = async () => {
      try {
        setLoading(true);
        setExpandedMsTableId(null);

        const response = await Milestones.getMilestonesWithTabs(viewAs, activeTab);
        const list = getArrayFromResponse(response, ["milestones"]);
        const formatted = list.map((item, index) => {
          const normalized = normalizeMilestone(item, index);
          if (activeTab === "Overdue") {
            normalized.isOverdue = true;
          } else if (activeTab === "On Progress") {
            normalized.status = "On Progress";
            normalized.isOverdue = false;
          } else if (activeTab === "Completed") {
            normalized.status = "Completed";
            normalized.isOverdue = false;
          } else if (activeTab === "Pending") {
            normalized.status = "Pending";
            normalized.isOverdue = false;
          }
          return normalized;
        });

        setTabCounts(getTabsFromResponse(response));
        setMilestones(formatted);
      } catch (err) {
        console.error("Error fetching milestones, falling back to mock:", err);
        setTabCounts(null);
        setMilestones(getRestoredFallback().map((item, index) => normalizeMilestone(item, index)));
      } finally {
        setLoading(false);
      }
    };

    fetchMilestones();
  }, [viewAs, activeTab]);

  const getTeamsStats = (m) => {
    const total = m.teamsData && m.teamsData.length > 0
      ? m.teamsData.length
      : (doctorTeamsCount || m.teamsTotalCount || 3);

    const submitted = m.teamsData && m.teamsData.length > 0
      ? m.teamsData.filter(t => t.status === "Submitted" || t.status === "On Time").length
      : m.teamsSubmittedCount;

    return { submitted, total };
  };

  // Handle toggling the team submissions table expansion via API.
  const handleToggleTable = async (milestoneId) => {
    if (expandedMsTableId === milestoneId) {
      setExpandedMsTableId(null);
      return;
    }
    setExpandedMsTableId(milestoneId);

    const currentMilestone = milestones.find(m => m.id === milestoneId);
    const maxMarks = currentMilestone?.marks || 20;

    try {
      const response = await Milestones.getTeamsInMilestone(
        milestoneId,
        viewAs,
        activeTab === "Overdue" ? "late" : ""
      );
      const teams = getArrayFromResponse(response, ["teams"]).map(t => normalizeTeam(t, maxMarks));

      setMilestones(prev => prev.map(m => m.id === milestoneId ? { ...m, teamsData: teams } : m));
    } catch (err) {
      console.error("Error fetching teams list, falling back to mock:", err);
      const targetMs = getRestoredFallback().find(fm => String(fm.id) === String(milestoneId));
      if (targetMs) {
        const teams = (targetMs.teamsData || []).map(t => normalizeTeam(t, maxMarks));
        setMilestones(prev => prev.map(m => m.id === milestoneId ? { ...m, teamsData: teams } : m));
      }
    }
  };

  // Submit notes to students via API.
  const handleAddNote = async (milestone) => {
    const noteText = notesState[milestone.id] || "";
    if (!noteText.trim()) return;

    try {
      await Milestones.addNoteOnMilestone(milestone.committeeId || milestone.id, noteText);
      alert("Note added successfully for students!");
      setNotesState(prev => ({ ...prev, [milestone.id]: "" }));
    } catch (err) {
      console.error("Error submitting note:", err);
      alert(err.message || "Failed to submit note.");
    }
  };

  // Grade team is available only in committee view.
  const handleGradeTeam = async (milestone, team) => {
    if (viewAs !== "committee") return;

    const teamId = team.id;
    const currentGrade = team.grade;
    const maxMarks = milestone.marks || 20;

    if (!teamId) {
      alert("Cannot add grade because the team id is missing from the API response.");
      return;
    }

    const currentVal = currentGrade.includes("Add") ? "" : currentGrade.split("/")[0];
    const newGrade = prompt(`Enter grade for this team (out of ${maxMarks}):`, currentVal);
    if (newGrade === null || newGrade === undefined) return;

    const parsed = parseFloat(newGrade);
    if (isNaN(parsed) || parsed < 0 || parsed > maxMarks) {
      alert(`Please enter a valid numeric grade between 0 and ${maxMarks}.`);
      return;
    }

    try {
      if (typeof teamId === "string" && teamId.startsWith("t")) {
        const grades = getMockGrades();
        grades[`${milestone.id}-${teamId}`] = `${parsed}/${maxMarks}`;
        localStorage.setItem("mock_milestone_grades", JSON.stringify(grades));
      } else {
        const gradeMilestoneId = await resolveGradeMilestoneId(teamId, milestone, team);
        if (!gradeMilestoneId) {
          throw new Error("Cannot find an allowed milestone for this team.");
        }
        await Milestones.addGradeOnMilestone(teamId, gradeMilestoneId, parsed);
      }

      setMilestones(prev => prev.map(m => {
        if (m.id === milestone.id) {
          return {
            ...m,
            teamsData: m.teamsData.map(t => t.id === teamId ? { ...t, grade: `${parsed}/${maxMarks}` } : t)
          };
        }
        return m;
      }));
      alert("Grade submitted successfully!");
    } catch (err) {
      console.error("Error grading team:", err);
      const message = err.message?.includes("does not belong")
        ? "This team is not assigned to this milestone in the current project course. Please choose the team's allowed milestone."
        : err.message || "Failed to submit grade.";
      alert(message);
    }
  };

  // Handle adding new milestone
  const handleSaveMilestone = (newMs) => {
    setMilestones([
      ...milestones,
      {
        id: Date.now(),
        phase: milestones.length + 1,
        title: newMs.title,
        status: "Pending",
        marks: 5,
        deadline: `Due: ${newMs.deadline || "TBD"}`,
        isOverdue: false,
        lateCount: 0,
        teamsSubmittedCount: 0,
        teamsTotalCount: 0,
        reqs: newMs.reqs,
        teamsData: []
      }
    ]);
    setShowModal(false);
  };

  const filterTabs = TAB_CONFIG.map((tab) => ({
    k: tab.k,
    l: `${tab.label} (${getTabCount(tabCounts, tab.k, countForTab(milestones, tab.k))})`,
  }));

  const filteredMilestones = milestones.filter(m => {
    if (activeTab === "All") return !m.isOverdue;
    if (activeTab === "On Progress") return m.status === "On Progress" && !m.isOverdue;
    if (activeTab === "Completed") return m.status === "Completed" && !m.isOverdue;
    if (activeTab === "Pending") return m.status === "Pending" && !m.isOverdue;
    if (activeTab === "Overdue") return m.isOverdue;
    return true;
  });

  const getDotColor = (m) => {
    if (m.isOverdue) return "#ef4444";
    if (m.status === "Completed") return "#10b981";
    if (m.status === "On Progress") return "#f97316";
    return "#cbd5e1";
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      overflow: "hidden",
      background: "#F4F6F9"
    }}>
      {/* 1. Top Navbar Banner */}
      <header style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingLeft: "24px",
        paddingRight: "24px",
        background: "#1A2E4C",
        height: "64px",
        color: "#ffffff",
        flexShrink: 0,
        zIndex: 50,
        boxSizing: "border-box"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <img src={logo} alt="logo" style={{ height: "40px", objectFit: "contain" }} />
          <div style={{ position: "relative", width: "320px" }}>
            <span style={{
              position: "absolute",
              insetY: 0,
              left: 0,
              display: "flex",
              alignItems: "center",
              paddingLeft: "12px",
              height: "100%"
            }}>
              <FaSearch style={{ color: "#9ca3af", width: "16px", height: "16px" }} />
            </span>
            <input
              type="text"
              placeholder="Search Projects or Students"
              style={{
                width: "100%",
                height: "36px",
                paddingLeft: "36px",
                paddingRight: "16px",
                fontSize: "14px",
                color: "#111827",
                background: "#ffffff",
                border: "none",
                borderRadius: "6px",
                outline: "none",
                boxSizing: "border-box"
              }}
            />
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <button style={{
            position: "relative",
            padding: "4px",
            background: "none",
            border: "none",
            cursor: "pointer"
          }}>
            <FaBell style={{ color: "#d1d5db", width: "20px", height: "20px" }} />
            <span style={{
              position: "absolute",
              top: "4px",
              right: "4px",
              width: "8px",
              height: "8px",
              background: "#ef4444",
              borderRadius: "50%"
            }}></span>
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="Profile"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                border: "1px solid #9ca3af",
                objectFit: "cover"
              }}
            />
            <span style={{ fontSize: "14px", fontWeight: 500 }}>Ahmed Khaled</span>
          </div>
        </div>
      </header>

      {/* Outer Content Area */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar />

        {/* 3. Main Dashboard Content */}
        <main style={{
          flex: 1,
          overflowY: "auto",
          padding: "32px",
          boxSizing: "border-box"
        }}>
          {/* Header & Subtitle */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "24px"
          }}>
            <div>
              <h1 style={{ margin: 0, fontSize: "28px", fontWeight: 700, color: "#111827" }}>Milestones</h1>
              <p style={{ margin: "4px 0 0 0", fontSize: "14px", color: "#6b7280", fontStyle: "italic" }}>
                Academic Year {academicYear ? `${academicYear}-${academicYear + 1}` : "2025-2026"}
              </p>
            </div>
          </div>

          {/* View As Toggle Buttons */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "24px"
          }}>
            <span style={{ fontSize: "14px", fontWeight: 600, color: "#374151" }}>View as:</span>
            <div style={{
              display: "flex",
              background: "#e5e7eb",
              borderRadius: "8px",
              padding: "3px"
            }}>
              <button
                onClick={() => setViewAs("committee")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  border: "none",
                  borderRadius: "6px",
                  padding: "6px 16px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  background: viewAs === "committee" ? "#0066FF" : "transparent",
                  color: viewAs === "committee" ? "#ffffff" : "#4b5563",
                  transition: "all 0.2s"
                }}
              >
                <FaUsers /> As Committee
              </button>
              <button
                onClick={() => setViewAs("supervisor")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  border: "none",
                  borderRadius: "6px",
                  padding: "6px 16px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  background: viewAs === "supervisor" ? "#0066FF" : "transparent",
                  color: viewAs === "supervisor" ? "#ffffff" : "#4b5563",
                  transition: "all 0.2s"
                }}
              >
                <FaUser /> As Supervisor
              </button>
            </div>
          </div>

          {/* Status filter Pills */}
          <div style={{
            display: "flex",
            gap: "10px",
            marginBottom: "32px",
            flexWrap: "wrap"
          }}>
            {filterTabs.map((t) => (
              <button
                key={t.k}
                onClick={() => setActiveTab(t.k)}
                style={{
                  padding: "8px 18px",
                  borderRadius: "20px",
                  border: "1px solid " + (activeTab === t.k ? "#0066FF" : "#e5e7eb"),
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: 600,
                  background: activeTab === t.k ? "#0066FF" : "#ffffff",
                  color: activeTab === t.k ? "#ffffff" : "#4b5563",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  transition: "all 0.15s ease"
                }}
              >
                {t.l}
              </button>
            ))}
          </div>

          {/* Timeline Cards Container */}
          <div style={{ position: "relative", paddingLeft: "40px" }}>
            {/* Timeline Line */}
            <div style={{
              position: "absolute",
              left: "20px",
              top: "24px",
              bottom: "24px",
              width: "2px",
              background: "#cbd5e1"
            }}></div>

            {loading ? (
              <div style={{ textAlign: "center", padding: "40px", fontSize: "16px", color: "#6b7280" }}>
                Loading Milestones...
              </div>
            ) : filteredMilestones.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px", fontSize: "16px", color: "#6b7280" }}>
                No milestones found for this tab.
              </div>
            ) : filteredMilestones.map((m) => {
              const dotColor = getDotColor(m);
              const isCompleted = m.status === "Completed";
              const isOverdue = m.isOverdue;
              const canGrade = viewAs === "committee" && !isOverdue;
              const showNoteInput = !isCompleted;
              const { submitted, total } = getTeamsStats(m);


              return (
                <div key={m.id} style={{ marginBottom: "32px" }}>
                  <div style={{
                    display: "flex",
                    gap: "24px",
                    alignItems: "flex-start",
                    position: "relative"
                  }}>
                    {/* Timeline Dot Node */}
                    <div style={{
                      width: "24px",
                      display: "flex",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: "20px",
                      zIndex: 10
                    }}>
                      <div style={{
                        width: "14px",
                        height: "14px",
                        borderRadius: "50%",
                        border: "3px solid " + dotColor,
                        background: isCompleted ? dotColor : "#ffffff",
                        boxShadow: "0 0 0 4px #F4F6F9"
                      }} />
                    </div>

                    {/* Speech Bubble Card */}
                    <div style={{ flex: 1, position: "relative" }}>
                      {/* speech bubble triangle pointer */}
                      <div style={{
                        position: "absolute",
                        left: "-8px",
                        top: "20px",
                        width: 0,
                        height: 0,
                        borderTop: "8px solid transparent",
                        borderBottom: "8px solid transparent",
                        borderRight: "8px solid " + (isOverdue ? "#ef4444" : "#ffffff"),
                        filter: "drop-shadow(-1px 0px 0.5px rgba(0,0,0,0.03))"
                      }} />

                      {/* Card Content container */}
                      <div style={{
                        background: "#ffffff",
                        borderRadius: "12px",
                        border: isOverdue ? "2px solid #ef4444" : "1px solid #e5e7eb",
                        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)",
                        padding: "20px 24px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "16px",
                        boxSizing: "border-box"
                      }}>

                        {/* Title and details block */}
                        <div style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          gap: "16px",
                          flexWrap: "wrap"
                        }}>
                          {/* Left details */}
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                              {isOverdue && <FaExclamationTriangle style={{ color: "#f59e0b", fontSize: "18px" }} />}
                              <span style={{ fontSize: "16px", fontWeight: 700, color: "#111827" }}>
                                Phase {m.phase} : {m.title}
                              </span>
                              <span style={{
                                background: "#eff6ff",
                                color: "#1d4ed8",
                                fontSize: "12px",
                                fontWeight: 700,
                                padding: "3px 10px",
                                borderRadius: "6px"
                              }}>
                                {m.marks} Marks
                              </span>
                            </div>

                            {/* Alert for missed deadline */}
                            {isOverdue && (
                              <div style={{ marginTop: "4px" }}>
                                <div style={{ color: "#ef4444", fontSize: "15px", fontWeight: "bold" }}>
                                  Deadline was: {m.deadline.replace(/^Due:\s*/i, "")} (Missed)
                                </div>
                                <div style={{ color: "#4b5563", fontSize: "12px", marginTop: "2px" }}>
                                  Teams missed the deadline: {m.lateCount}
                                </div>
                              </div>
                            )}

                            {/* Checklist items */}
                            {!isOverdue && (
                              <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "4px" }}>
                                {m.reqs.map((r, idx) => (
                                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <span style={{
                                      color: isCompleted ? "#10b981" : "#9ca3af",
                                      display: "flex",
                                      alignItems: "center"
                                    }}>
                                      {isCompleted ? <FaCheckSquare /> : <FaRegSquare />}
                                    </span>
                                    <span style={{ fontSize: "13px", color: "#4b5563" }}>{r}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Right Status Badge & Calendar info */}
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
                            <span style={{
                              padding: "4px 16px",
                              borderRadius: "20px",
                              fontSize: "12px",
                              fontWeight: 700,
                              color: "#ffffff",
                              background: isOverdue ? "#ef4444" : isCompleted ? "#10b981" : m.status === "Pending" ? "#9ca3af" : "#f97316"
                            }}>
                              {isOverdue ? "Overdue" : m.status}
                            </span>

                            {/* Calendar Box */}
                            {!isOverdue && (
                              <div style={{
                                border: "1px solid #e5e7eb",
                                borderRadius: "8px",
                                padding: "6px 14px",
                                background: "#f9fafb",
                                fontSize: "13px",
                                color: "#4b5563",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                boxShadow: "0 1px 2px rgba(0,0,0,0.02)"
                              }}>
                                <FaRegCalendarAlt style={{ color: "#6b7280" }} />
                                <span>{m.deadline}</span>
                              </div>
                            )}

                            {/* Floating details for completed */}
                            {isCompleted && (
                              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "4px" }}>
                                <span style={{
                                  fontSize: "11px",
                                  fontWeight: 700,
                                  color: "#ef4444",
                                  marginTop: "6px",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "4px"
                                }}>
                                  ❌ Late: {m.lateCount}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Middle Actions Footer block (Submissions stats & Notes input) */}
                        {!isCompleted && !m.isOverdue && m.status !== "Pending" && (
                          <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: "12px", marginTop: "4px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                <span style={{ fontSize: "13px", color: "#4b5563", fontWeight: 600 }}>
                                  Teams Submitted : <span style={{ color: "#10b981" }}>{submitted}</span>/{total}
                                </span>
                                <button
                                  onClick={() => handleToggleTable(m.id)}
                                  style={{
                                    background: "#0066FF",
                                    color: "#ffffff",
                                    fontSize: "12px",
                                    fontWeight: "bold",
                                    border: "none",
                                    borderRadius: "4px",
                                    padding: "6px 12px",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px"
                                  }}
                                >
                                  View Teams <FaChevronDown style={{ fontSize: "10px" }} />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Completed Milestone Submissions Footer block */}
                        {isCompleted && (
                          <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: "12px", marginTop: "4px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                              <span style={{ fontSize: "13px", color: "#4b5563", fontWeight: 600 }}>
                                Teams Submitted : <span style={{ color: "#10b981" }}>{submitted}</span>/{total}
                              </span>
                              <button
                                onClick={() => handleToggleTable(m.id)}
                                style={{
                                  background: "#0066FF",
                                  color: "#ffffff",
                                  fontSize: "12px",
                                  fontWeight: "bold",
                                  border: "none",
                                  borderRadius: "4px",
                                  padding: "6px 12px",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "6px"
                                }}
                              >
                                View Teams <FaChevronDown style={{ fontSize: "10px" }} />
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Overdue card submissions and Remind All actions block */}
                        {isOverdue && (
                          <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: "12px", marginTop: "4px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                <span style={{ fontSize: "13px", color: "#4b5563", fontWeight: 600 }}>
                                  Teams Submitted : <span style={{ color: "#10b981" }}>{submitted}</span>/{total}
                                </span>
                                <button
                                  onClick={() => handleToggleTable(m.id)}
                                  style={{
                                    background: "#0066FF",
                                    color: "#ffffff",
                                    fontSize: "12px",
                                    fontWeight: "bold",
                                    border: "none",
                                    borderRadius: "4px",
                                    padding: "6px 12px",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "6px"
                                  }}
                                >
                                  View Late Teams <FaChevronDown style={{ fontSize: "10px" }} />
                                </button>
                              </div>

                              <button style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                background: "#ffffff",
                                border: "1px solid #cbd5e1",
                                borderRadius: "6px",
                                padding: "6px 14px",
                                color: "#ef4444",
                                fontSize: "12px",
                                fontWeight: "bold",
                                cursor: "pointer",
                                boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                              }}>
                                <FaExclamationTriangle /> Remind All
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Notes input box */}
                        {showNoteInput && (
                          <div style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            border: "1px solid #e5e7eb",
                            borderRadius: "6px",
                            padding: "8px 12px",
                            background: "#ffffff",
                            boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
                            boxSizing: "border-box",
                            width: m.status === "Pending" ? "240px" : "100%"
                          }}>
                            <FaEdit style={{ color: "#9ca3af", fontSize: "13px" }} />
                            <input
                              type="text"
                              value={notesState[m.id] || ""}
                              onChange={(e) => setNotesState({ ...notesState, [m.id]: e.target.value })}
                              onKeyDown={(e) => e.key === "Enter" && handleAddNote(m)}
                              placeholder="Add notes for students (press Enter to save)"
                              style={{
                                border: "none",
                                outline: "none",
                                fontSize: "13px",
                                color: "#4b5563",
                                width: "100%",
                                background: "transparent"
                              }}
                            />
                          </div>
                        )}

                      </div>
                    </div>
                  </div>

                  {/* Expanded Submissions Table (INDENTED + HOOK ARROW CONNECTOR) */}
                  {expandedMsTableId === m.id && m.teamsData && (
                    <div style={{ display: "flex", gap: "24px", marginTop: "16px", position: "relative" }}>
                      {/* Left Hook Connector */}
                      <div style={{ width: "24px", position: "relative", flexShrink: 0 }}>
                        <div style={{
                          position: "absolute",
                          left: "11px",
                          top: "-36px",
                          bottom: "50%",
                          width: "20px",
                          borderLeft: "2px solid #cbd5e1",
                          borderBottom: "2px solid #cbd5e1",
                          borderRadius: "0 0 0 8px"
                        }}>
                          {/* arrowhead pointer */}
                          <div style={{
                            position: "absolute",
                            right: "-4px",
                            bottom: "-5px",
                            width: 0,
                            height: 0,
                            borderTop: "4px solid transparent",
                            borderBottom: "4px solid transparent",
                            borderLeft: "6px solid #cbd5e1"
                          }} />
                        </div>
                      </div>

                      {/* Indented Table Container */}
                      <div style={{
                        flex: 1,
                        background: "#ffffff",
                        borderRadius: "12px",
                        border: "1px solid #e5e7eb",
                        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)",
                        overflow: "hidden"
                      }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left" }}>
                          <thead>
                            <tr style={{ background: "#b0b8c4", color: "#ffffff" }}>
                              <th style={{ padding: "12px 16px", fontWeight: 600 }}>Team</th>
                              <th style={{ padding: "12px 16px", fontWeight: 600 }}>Status</th>
                              {isOverdue ? (
                                <th style={{ padding: "12px 16px", fontWeight: 600 }}>Days Late</th>
                              ) : (
                                <>
                                  <th style={{ padding: "12px 16px", fontWeight: 600 }}>Submission Date</th>
                                  <th style={{ padding: "12px 16px", fontWeight: 600 }}>Action</th>
                                  {canGrade && <th style={{ padding: "12px 16px", fontWeight: 600 }}>Grades</th>}
                                </>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {m.teamsData.length === 0 ? (
                              <tr>
                                <td
                                  colSpan={isOverdue ? 3 : canGrade ? 5 : 4}
                                  style={{ padding: "16px", color: "#6b7280", textAlign: "center" }}
                                >
                                  No teams found for this milestone.
                                </td>
                              </tr>
                            ) : m.teamsData.map((team, idx) => (
                              <tr key={idx} style={{ borderBottom: "1px solid #e5e7eb" }}>
                                <td style={{ padding: "12px 16px", fontWeight: 600, color: "#1b2d4c" }}>{team.name}</td>

                                <td style={{ padding: "12px 16px" }}>
                                  <span style={{
                                    color: team.status === "Submitted" || team.status === "On Time" ? "#065f46" : team.status === "Late" ? "#991b1b" : "#4b5563",
                                    fontWeight: 500
                                  }}>
                                    {team.status}
                                  </span>
                                </td>

                                {isOverdue ? (
                                  <td style={{ padding: "12px 16px", fontWeight: 600, color: "#ef4444" }}>{team.daysLate}</td>
                                ) : (
                                  <>
                                    <td style={{ padding: "12px 16px", color: "#4b5563" }}>{team.date}</td>

                                    <td style={{ padding: "12px 16px" }}>
                                      {team.action === "View" ? (
                                        <span style={{ color: "#111827", fontWeight: "bold", cursor: "pointer" }}>View</span>
                                      ) : (
                                        <span style={{ color: "#ef4444", fontWeight: "bold", cursor: "pointer" }}>Remind</span>
                                      )}
                                    </td>

                                    {canGrade && (
                                       <td style={{ padding: "12px 16px" }}>
                                         {team.grade.includes("Add") ? (
                                           <span
                                             onClick={() => handleGradeTeam(m, team)}
                                             style={{ color: "#0066FF", fontWeight: "bold", cursor: "pointer" }}
                                           >
                                             Add Grade <span style={{ color: "#6b7280", fontWeight: 500 }}>/ {m.marks}</span>
                                           </span>
                                         ) : (
                                           <span
                                             onClick={() => handleGradeTeam(m, team)}
                                             style={{
                                               color: parseFloat(team.grade.split("/")[0]) >= (m.marks / 2) ? "#10b981" : "#ef4444",
                                               fontWeight: "bold",
                                               cursor: "pointer"
                                             }}
                                           >
                                             {team.grade.split("/")[0]}<span style={{ color: "#6b7280", fontWeight: 500 }}>/{m.marks}</span>
                                           </span>
                                         )}
                                       </td>
                                     )}
                                  </>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>


        </main>
      </div>

      {/* Add New Milestone Modal */}
      {showModal && (
        <AddMsModal
          onClose={() => setShowModal(false)}
          onSave={handleSaveMilestone}
          nextPhase={milestones.length + 1}
        />
      )}
    </div>
  );
}

// Modal Form Component
function AddMsModal({ onClose, onSave, nextPhase }) {
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [reqText, setReqText] = useState("");
  const [reqs, setReqs] = useState(["UI Wireframes", "Mockups"]);

  const addReq = () => {
    if (reqText.trim()) {
      setReqs([...reqs, reqText.trim()]);
      setReqText("");
    }
  };

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.4)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000
    }}>
      <div style={{
        background: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
        width: "480px",
        overflow: "hidden"
      }}>
        <div style={{
          background: "#1A2E4C",
          padding: "16px 20px",
          color: "#ffffff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <span style={{ fontWeight: "bold", fontSize: "14px" }}>Add Phase {nextPhase} Milestone</span>
          <button onClick={onClose} style={{
            background: "none",
            border: "none",
            color: "#ffffff",
            cursor: "pointer",
            fontSize: "18px"
          }}>
            <FaTimes />
          </button>
        </div>
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ fontSize: "12px", fontWeight: "semibold", color: "#374151", display: "block", marginBottom: "4px" }}>Milestone Title</label>
            <input
              type="text"
              placeholder="e.g. Backend Development & API"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box"
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: "12px", fontWeight: "semibold", color: "#374151", display: "block", marginBottom: "4px" }}>Deadline</label>
            <input
              type="text"
              placeholder="e.g. Due: Jan 30, 2025"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "14px",
                outline: "none",
                boxSizing: "border-box"
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: "12px", fontWeight: "semibold", color: "#374151", display: "block", marginBottom: "4px" }}>Requirements</label>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="text"
                placeholder="Add requirement"
                value={reqText}
                onChange={(e) => setReqText(e.target.value)}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  border: "1px solid #d1d5db",
                  borderRadius: "6px",
                  fontSize: "14px",
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />
              <button
                onClick={addReq}
                style={{
                  background: "#0066FF",
                  color: "#ffffff",
                  fontSize: "12px",
                  fontWeight: "bold",
                  padding: "0 16px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer"
                }}
              >
                Add
              </button>
            </div>
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              marginTop: "12px",
              maxHeight: "96px",
              overflowY: "auto",
              borderTop: "1px solid #f3f4f6",
              paddingTop: "8px"
            }}>
              {reqs.map((r, idx) => (
                <div key={idx} style={{ fontSize: "12px", color: "#4b5563", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ color: "#0066FF", fontWeight: "bold" }}>•</span> {r}
                </div>
              ))}
            </div>
          </div>
          <div style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "12px",
            marginTop: "16px",
            borderTop: "1px solid #f3f4f6",
            paddingTop: "16px"
          }}>
            <button
              onClick={onClose}
              style={{
                border: "1px solid #d1d5db",
                color: "#666666",
                fontSize: "12px",
                fontWeight: "bold",
                padding: "8px 16px",
                borderRadius: "6px",
                background: "none",
                cursor: "pointer"
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => onSave({ title, deadline, reqs })}
              style={{
                background: "#0066FF",
                color: "#ffffff",
                fontSize: "12px",
                fontWeight: "bold",
                padding: "8px 20px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer"
              }}
            >
              Save Milestone
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
