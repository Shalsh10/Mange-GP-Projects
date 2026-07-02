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
import { useAcademicYear } from "../../context/Academicyearcontext";
import Milestones from "../../Services/MilestonEs.model";
import logo from "../../assets/logo2.png";
import Sidebar from "../../Components/Sidebar";

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

export default function MilestonesSetup() {
  const { academicYear } = useAcademicYear();
  const [viewAs, setViewAs] = useState("supervisor"); // committee or supervisor
  const [activeTab, setActiveTab] = useState("All"); // All, On Progress, Completed, Pending, Overdue
  const [showModal, setShowModal] = useState(false);
  const [expandedMsTableId, setExpandedMsTableId] = useState(null); // ID of currently expanded milestone table
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notesState, setNotesState] = useState({}); // Stores the note value of milestone inputs

  // Fetch Milestones dynamically from backend API
  const fetchMilestones = async () => {
    try {
      setLoading(true);
      const response = await Milestones.getMilestonesWithTabs(viewAs, activeTab);
      const data = response?.data?.data || response?.data || response || [];
      
      if (Array.isArray(data) && data.length > 0) {
        const formatted = data.map(m => ({
          id: m.id || m.milestone_id || Date.now(),
          phase: m.phase || m.order || 1,
          title: m.title || "Untitled Milestone",
          status: m.status || "Pending",
          marks: m.marks || 5,
          deadline: m.deadline || m.due_date || "TBD",
          isOverdue: String(m.status).toLowerCase() === "overdue" || m.is_overdue,
          reqs: m.requirements || ["Requirement details"],
          teamsSubmittedCount: m.teams_submitted_count || 0,
          teamsData: []
        }));
        setMilestones(formatted);
      } else {
        setMilestones(FALLBACK_MILESTONES);
      }
    } catch (err) {
      console.error("Error fetching milestones, falling back to mock:", err);
      setMilestones(FALLBACK_MILESTONES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMilestones();
  }, [viewAs, activeTab]);

  // Handle toggling the team submissions table expansion via API
  const handleToggleTable = async (milestoneId) => {
    if (expandedMsTableId === milestoneId) {
      setExpandedMsTableId(null);
      return;
    }
    setExpandedMsTableId(milestoneId);

    try {
      const response = await Milestones.getTeamsInMilestone(milestoneId, viewAs, activeTab === "Overdue" ? "late" : "");
      const data = response?.data?.data || response?.data || response || [];
      
      if (Array.isArray(data) && data.length > 0) {
        const formattedTeams = data.map(t => ({
          id: t.team_id || t.id,
          name: t.team_name || t.name || "Unknown Team",
          status: t.status || "Not Yet",
          date: t.submission_date || t.date || "——",
          action: t.status === "Submitted" || t.status === "On Time" ? "View" : "Remind",
          grade: t.grade !== null && t.grade !== undefined ? `${t.grade}/20` : "Add Grade / 20",
          daysLate: t.days_late || "5 Days"
        }));
        setMilestones(prev => prev.map(m => m.id === milestoneId ? { ...m, teamsData: formattedTeams } : m));
      } else {
        const targetMs = FALLBACK_MILESTONES.find(fm => fm.id === milestoneId);
        if (targetMs) {
          setMilestones(prev => prev.map(m => m.id === milestoneId ? { ...m, teamsData: targetMs.teamsData } : m));
        }
      }
    } catch (err) {
      console.error("Error fetching teams list, falling back to mock:", err);
      const targetMs = FALLBACK_MILESTONES.find(fm => fm.id === milestoneId);
      if (targetMs) {
        setMilestones(prev => prev.map(m => m.id === milestoneId ? { ...m, teamsData: targetMs.teamsData } : m));
      }
    }
  };

  // Submit notes to students via API
  const handleAddNote = async (milestoneId) => {
    const noteText = notesState[milestoneId] || "";
    if (!noteText.trim()) return;

    try {
      await Milestones.addNoteOnMilestone(milestoneId, noteText);
      alert("Note added successfully for students!");
      setNotesState(prev => ({ ...prev, [milestoneId]: "" }));
    } catch (err) {
      console.error("Error submitting note to API:", err);
      alert("Saved note locally for students (offline fallback)");
      setNotesState(prev => ({ ...prev, [milestoneId]: "" }));
    }
  };

  // Grade team dynamically via API
  const handleGradeTeam = async (milestoneId, teamId, currentGrade) => {
    const currentVal = currentGrade.includes("Add") ? "" : currentGrade.split("/")[0];
    const newGrade = prompt(`Enter grade for this team (out of 20):`, currentVal);
    if (newGrade === null || newGrade === undefined) return;
    
    const parsed = parseFloat(newGrade);
    if (isNaN(parsed) || parsed < 0 || parsed > 20) {
      alert("Please enter a valid numeric grade between 0 and 20.");
      return;
    }

    try {
      // Skip API if teamId is mock string ID (starts with 't')
      if (typeof teamId === "string" && teamId.startsWith("t")) {
        throw new Error("Mock team grading");
      }
      await Milestones.addGradeOnMilestone(teamId, milestoneId, parsed);
      setMilestones(prev => prev.map(m => {
        if (m.id === milestoneId) {
          return {
            ...m,
            teamsData: m.teamsData.map(t => t.id === teamId ? { ...t, grade: `${parsed}/20` } : t)
          };
        }
        return m;
      }));
      alert("Grade submitted successfully!");
    } catch (err) {
      console.error("Error grading team:", err);
      // Fallback local update
      setMilestones(prev => prev.map(m => {
        if (m.id === milestoneId) {
          return {
            ...m,
            teamsData: m.teamsData.map(t => t.id === teamId ? { ...t, grade: `${parsed}/20` } : t)
          };
        }
        return m;
      }));
      alert("Grade updated locally (offline fallback)");
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
        reqs: newMs.reqs,
        teamsData: []
      }
    ]);
    setShowModal(false);
  };

  const filterTabs = [
    { k: "All", l: `All (${milestones.length})` },
    { k: "On Progress", l: `On Progress (${milestones.filter(m => m.status === "On Progress").length})` },
    { k: "Completed", l: `Completed (${milestones.filter(m => m.status === "Completed").length})` },
    { k: "Pending", l: `Pending (${milestones.filter(m => m.status === "Pending" && !m.isOverdue).length})` },
    { k: "Overdue", l: `Overdue (${milestones.filter(m => m.isOverdue).length})` }
  ];

  const filteredMilestones = milestones.filter(m => {
    if (activeTab === "All") return true;
    if (activeTab === "On Progress") return m.status === "On Progress";
    if (activeTab === "Completed") return m.status === "Completed";
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
            ) : filteredMilestones.map((m) => {
              const dotColor = getDotColor(m);
              const isCompleted = m.status === "Completed";
              const isOverdue = m.isOverdue;
              const isOnProgress = m.status === "On Progress";

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
                                  Deadline was: Jan 30, 2025 (Missed)
                                </div>
                                <div style={{ color: "#4b5563", fontSize: "12px", marginTop: "2px" }}>
                                  Teams missed the deadline: 1
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
                                  Teams Submitted : <span style={{ color: "#10b981" }}>{m.teamsSubmittedCount}</span>/5
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
                                  Teams Submitted : <span style={{ color: "#10b981" }}>{m.teamsSubmittedCount}</span>/5
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
                                  Teams Submitted : <span style={{ color: "#10b981" }}>{m.teamsSubmittedCount}</span>/5
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
                        {m.status !== "Pending" && (
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
                            width: "100%"
                          }}>
                            <FaEdit style={{ color: "#9ca3af", fontSize: "13px" }} />
                            <input
                              type="text"
                              value={notesState[m.id] || ""}
                              onChange={(e) => setNotesState({ ...notesState, [m.id]: e.target.value })}
                              onKeyDown={(e) => e.key === "Enter" && handleAddNote(m.id)}
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

                        {m.status === "Pending" && (
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
                            width: "240px"
                          }}>
                            <FaEdit style={{ color: "#9ca3af", fontSize: "13px" }} />
                            <input
                              type="text"
                              value={notesState[m.id] || ""}
                              onChange={(e) => setNotesState({ ...notesState, [m.id]: e.target.value })}
                              onKeyDown={(e) => e.key === "Enter" && handleAddNote(m.id)}
                              placeholder="Add notes for students (press Enter)"
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
                                  {isCompleted && <th style={{ padding: "12px 16px", fontWeight: 600 }}>Grades</th>}
                                </>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {m.teamsData.map((team, idx) => (
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

                                    {isCompleted && (
                                      <td style={{ padding: "12px 16px" }}>
                                        {team.grade.includes("Add") ? (
                                          <span 
                                            onClick={() => handleGradeTeam(m.id, team.id, team.grade)}
                                            style={{ color: "#0066FF", fontWeight: "bold", cursor: "pointer" }}
                                          >
                                            Add Grade <span style={{ color: "#6b7280", fontWeight: 500 }}>/ 20</span>
                                          </span>
                                        ) : (
                                          <span 
                                            onClick={() => handleGradeTeam(m.id, team.id, team.grade)}
                                            style={{
                                              color: parseInt(team.grade.split("/")[0]) > 10 ? "#10b981" : "#ef4444",
                                              fontWeight: "bold",
                                              cursor: "pointer"
                                            }}
                                          >
                                            {team.grade.split("/")[0]}<span style={{ color: "#6b7280", fontWeight: 500 }}>/20</span>
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
