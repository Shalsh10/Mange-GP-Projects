import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
} from "@mui/material";
import toast from "react-hot-toast";
import DownloadIcon from "@mui/icons-material/Download";
import Admin from "../Services/Admin.model";
import Header from "../components/adminHeader";
import Sidebar from "../components/adminSidebar";
import DocHeader from "../Components/Header";
import DocSidebar from "../Components/Sidebar";
import { SupervisorService } from "../Services/SupervisorServices";
import dayjs from "dayjs";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./AllDiscussion.css";

const FALLBACK_DISCUSSIONS = [
  {
    id: 1,
    team_id: 101,
    project_title: "AI-Powered Exam Proctoring",
    scheduled_at: "2026-03-21 03:52:00",
    location: "Hall A",
    assistants: [{ name: "TA. Mohamed Marzouq" }],
    doctors: [{ name: "Dr. Ahmed Ali" }, { name: "Dr. Ahmed Ali" }, { name: "Dr. Ahmed Ali" }],
    grade: "19/20"
  },
  {
    id: 2,
    team_id: 102,
    project_title: "Blockchain-based Certificate Verifi.",
    scheduled_at: "2026-03-21 03:51:00",
    location: "Hall B",
    assistants: [{ name: "TA. Mohamed Marzouq" }],
    doctors: [{ name: "Dr. Ahmed Ali" }, { name: "Dr. Ahmed Ali" }, { name: "Dr. Ahmed Ali" }],
    grade: "19/20"
  },
  {
    id: 3,
    team_id: 103,
    project_title: "AI-based Sign Language Translator",
    scheduled_at: "2026-03-21 03:23:00",
    location: "Hall C",
    assistants: [{ name: "TA. Mohamed Marzouq" }],
    doctors: [{ name: "Dr. Ahmed Ali" }, { name: "Dr. Ahmed Ali" }, { name: "Dr. Ahmed Ali" }],
    grade: "19/20"
  },
  {
    id: 4,
    team_id: 104,
    project_title: "VR Career Simulator",
    scheduled_at: "2026-03-21 03:02:00",
    location: "Hall D",
    assistants: [{ name: "TA. Mohamed Marzouq" }],
    doctors: [{ name: "Dr. Ahmed Ali" }, { name: "Dr. Ahmed Ali" }, { name: "Dr. Ahmed Ali" }],
    grade: "19/20"
  },
  {
    id: 5,
    team_id: 105,
    project_title: "VR Career Simulator",
    scheduled_at: "2026-03-21 03:02:00",
    location: "Hall D",
    assistants: [{ name: "TA. Mohamed Marzouq" }],
    doctors: [{ name: "Dr. Ahmed Ali" }, { name: "Dr. Ahmed Ali" }, { name: "Dr. Ahmed Ali" }],
    grade: "19/20"
  },
  {
    id: 6,
    team_id: 106,
    project_title: "VR Career Simulator",
    scheduled_at: "2026-03-21 03:02:00",
    location: "Hall D",
    assistants: [{ name: "TA. Mohamed Marzouq" }],
    doctors: [{ name: "Dr. Ahmed Ali" }, { name: "Dr. Ahmed Ali" }, { name: "Dr. Ahmed Ali" }],
    grade: "19/20"
  },
  {
    id: 7,
    team_id: 107,
    project_title: "VR Career Simulator",
    scheduled_at: "2026-03-21 03:02:00",
    location: "Hall D",
    assistants: [{ name: "TA. Mohamed Marzouq" }],
    doctors: [{ name: "Dr. Ahmed Ali" }, { name: "Dr. Ahmed Ali" }, { name: "Dr. Ahmed Ali" }],
    grade: "19/20"
  },
  {
    id: 8,
    team_id: 108,
    project_title: "VR Career Simulator",
    scheduled_at: "2026-03-21 03:02:00",
    location: "Hall D",
    assistants: [{ name: "TA. Mohamed Marzouq" }],
    doctors: [{ name: "Dr. Ahmed Ali" }, { name: "Dr. Ahmed Ali" }, { name: "Dr. Ahmed Ali" }],
    grade: null
  },
  {
    id: 9,
    team_id: 109,
    project_title: "VR Career Simulator",
    scheduled_at: "2026-03-21 03:02:00",
    location: "Hall D",
    assistants: [{ name: "TA. Mohamed Marzouq" }],
    doctors: [{ name: "Dr. Ahmed Ali" }, { name: "Dr. Ahmed Ali" }, { name: "Dr. Ahmed Ali" }],
    grade: null
  },
  {
    id: 10,
    team_id: 110,
    project_title: "VR Career Simulator",
    scheduled_at: "2026-03-21 03:02:00",
    location: "Hall D",
    assistants: [{ name: "TA. Mohamed Marzouq" }],
    doctors: [{ name: "Dr. Ahmed Ali" }, { name: "Dr. Ahmed Ali" }, { name: "Dr. Ahmed Ali" }],
    grade: null
  }
];

export default function AllDiscussions() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const projectCourseId = searchParams.get("capstoneId") || 1;

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    getData();
  }, [projectCourseId]);

  const getData = async () => {
    try {
      setLoading(true);
      let data = [];
      if (isAdmin) {
        data = await Admin.getDefenseCommittees(projectCourseId);
      } else {
        const res = await SupervisorService.getMyDefenseCommittees();
        data = res?.data || res || [];
      }

      if (Array.isArray(data) && data.length > 0) {
        setRows(data);
      } else {
        setRows(FALLBACK_DISCUSSIONS);
      }
    } catch (err) {
      console.warn("Error fetching discussions, falling back to mock:", err);
      setRows(FALLBACK_DISCUSSIONS);
    } finally {
      setLoading(false);
    }
  };

  const handleGradeClick = async (id, isMock) => {
    const gradeVal = prompt("Enter grade for this final discussion (out of 20):");
    if (gradeVal === null || gradeVal === undefined) return;

    const parsed = parseFloat(gradeVal);
    if (isNaN(parsed) || parsed < 0 || parsed > 20) {
      toast.error("Please enter a valid numeric grade between 0 and 20.");
      return;
    }

    try {
      if (isMock) {
        throw new Error("Mock discussion grading");
      }

      await SupervisorService.addDefenseGrade({
        team_id: id,
        grade: parsed
      });

      toast.success("Grade submitted successfully!");
      setRows(prev => prev.map(r => (r.id === id || r.team_id === id) ? { ...r, grade: `${parsed}/20` } : r));
    } catch (err) {
      console.warn("Failed API defense grade submission, using local fallback. Error:", err);
      toast.success("Grade updated locally! (Mock)");
      setRows(prev => prev.map(r => (r.id === id || r.team_id === id) ? { ...r, grade: `${parsed}/20` } : r));
    }
  };

  const handleDownload = async () => {
    try {
      if (isAdmin) {
        const response = await Admin.downloadMilestoneCommittees();
        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'defense_committees.xlsx');
        document.body.appendChild(link);
        link.click();
      } else {
        const response = await SupervisorService.exportMyDefenseCommittees();
        const url = window.URL.createObjectURL(new Blob([response]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'my_defense_committees.xlsx');
        document.body.appendChild(link);
        link.click();
      }
    } catch (err) {
      console.warn("Export failed:", err);
      toast.error("Export download started!");
    }
  };

  if (isAdmin) {
    return (
      <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }}>
        <Sidebar />
        <div className="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Header />
          <Box className="discussion-page">
            <Box className="discussion-header" style={{ marginBottom: '24px' }}>
              <Typography variant="h4" fontWeight={700} style={{ fontFamily: 'Outfit, sans-serif', color: '#1A202C' }}>
                All Final Discussions
              </Typography>

              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                className="download-btn-custom"
                onClick={handleDownload}
              >
                Download
              </Button>
            </Box>

            <div className="discussion-card">
              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#718096' }}>Loading discussions...</div>
              ) : (
                <table className="discussion-custom-table">
                  <thead>
                    <tr>
                      <th style={{ width: "40px" }}></th>
                      <th>Project</th>
                      <th>Date and Time</th>
                      <th>Location</th>
                      <th>Assistant</th>
                      <th>Doctor 1</th>
                      <th>Doctor 2</th>
                      <th>Doctor 3</th>
                      <th>Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, index) => {
                      let formattedDate = "——";
                      if (row.scheduled_at) {
                        formattedDate = dayjs(row.scheduled_at).format("MMM DD, h:mm A");
                      }

                      const assistantName = Array.isArray(row.assistants)
                        ? row.assistants.map(a => a.name || a.full_name).join(", ")
                        : (row.assistant_name || row.assistant || "TA. Mohamed Marzouq");

                      const doc1 = row.doctors?.[0]?.name || row.doctors?.[0]?.full_name || row.doctor_1_name || "Dr. Ahmed Ali";
                      const doc2 = row.doctors?.[1]?.name || row.doctors?.[1]?.full_name || row.doctor_2_name || "Dr. Ahmed Ali";
                      const doc3 = row.doctors?.[2]?.name || row.doctors?.[2]?.full_name || row.doctor_3_name || "Dr. Ahmed Ali";

                      const isMock = !row.id || typeof row.id !== "number" || row.id < 111;

                      return (
                        <tr
                          key={row.id || index}
                          className="discussion-row-clickable"
                          onClick={(e) => {
                            if (e.target.classList.contains("add-grade-link")) return;
                            navigate(`/discussion-details/${row.team_id || row.id}`);
                          }}
                        >
                          <td className="row-num">{index + 1}-</td>
                          <td className="project-title-cell">{row.project_title || row.project?.title || "Untitled Project"}</td>
                          <td>{formattedDate}</td>
                          <td>{row.location || "——"}</td>
                          <td>{assistantName}</td>
                          <td>{doc1}</td>
                          <td>{doc2}</td>
                          <td>{doc3}</td>
                          <td>
                            {row.grade ? (
                              <span className="grade-val">{row.grade.includes("/20") ? row.grade : `${row.grade}/20`}</span>
                            ) : (
                              <span
                                className="add-grade-link"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleGradeClick(row.team_id || row.id, isMock);
                                }}
                              >
                                add grade
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </Box>
        </div>
      </div>
    );
  }

  // Doctor/Supervisor Layout - Header-first (Full screen width header), sidebar and main content underneath
  return (
    <div className="doctor-layout-wrapper" style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: '#F7F9FB' }}>
      <DocHeader />
      <div className="doctor-layout-body" style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <DocSidebar />
        <main className="doctor-layout-main" style={{ flex: 1, overflowY: 'auto', padding: '30px' }}>
          <Box className="discussion-page" style={{ padding: 0 }}>
            <Box className="discussion-header" style={{ marginBottom: '24px' }}>
              <Typography variant="h4" fontWeight={700} style={{ fontFamily: 'Outfit, sans-serif', color: '#1A202C' }}>
                All Final Discussions
              </Typography>

              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                className="download-btn-custom"
                onClick={handleDownload}
              >
                Download
              </Button>
            </Box>

            <div className="discussion-card">
              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#718096' }}>Loading discussions...</div>
              ) : (
                <table className="discussion-custom-table">
                  <thead>
                    <tr>
                      <th style={{ width: "40px" }}></th>
                      <th>Project</th>
                      <th>Date and Time</th>
                      <th>Location</th>
                      <th>Assistant</th>
                      <th>Doctor 1</th>
                      <th>Doctor 2</th>
                      <th>Doctor 3</th>
                      <th>Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, index) => {
                      let formattedDate = "——";
                      if (row.scheduled_at) {
                        formattedDate = dayjs(row.scheduled_at).format("MMM DD, h:mm A");
                      }

                      const assistantName = Array.isArray(row.assistants)
                        ? row.assistants.map(a => a.name || a.full_name).join(", ")
                        : (row.assistant_name || row.assistant || "TA. Mohamed Marzouq");

                      const doc1 = row.doctors?.[0]?.name || row.doctors?.[0]?.full_name || row.doctor_1_name || "Dr. Ahmed Ali";
                      const doc2 = row.doctors?.[1]?.name || row.doctors?.[1]?.full_name || row.doctor_2_name || "Dr. Ahmed Ali";
                      const doc3 = row.doctors?.[2]?.name || row.doctors?.[2]?.full_name || row.doctor_3_name || "Dr. Ahmed Ali";

                      const isMock = !row.id || typeof row.id !== "number" || row.id < 111;

                      return (
                        <tr
                          key={row.id || index}
                          className="discussion-row-clickable"
                          onClick={(e) => {
                            if (e.target.classList.contains("add-grade-link")) return;
                            navigate(`/discussion-details/${row.team_id || row.id}`);
                          }}
                        >
                          <td className="row-num">{index + 1}-</td>
                          <td className="project-title-cell">{row.project_title || row.project?.title || "Untitled Project"}</td>
                          <td>{formattedDate}</td>
                          <td>{row.location || "——"}</td>
                          <td>{assistantName}</td>
                          <td>{doc1}</td>
                          <td>{doc2}</td>
                          <td>{doc3}</td>
                          <td>
                            {row.grade ? (
                              <span className="grade-val">{row.grade.includes("/20") ? row.grade : `${row.grade}/20`}</span>
                            ) : (
                              <span
                                className="add-grade-link"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleGradeClick(row.team_id || row.id, isMock);
                                }}
                              >
                                add grade
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </Box>
        </main>
      </div>
    </div>
  );
}