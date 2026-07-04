import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField as MuiTextField,
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

const extractDiscussionRowDetails = (row) => {
  if (!row) return {};

  const committeeId = row.id ?? row.defense_committee_id ?? row.committee_id ?? row.team_id;

  // 1. Find Project Title dynamically
  let projectTitle = "—";
  if (row.project_title) {
    projectTitle = row.project_title;
  } else if (row.project?.title) {
    projectTitle = row.project.title;
  } else if (row.project?.name) {
    projectTitle = row.project.name;
  } else {
    // Search top-level keys for something containing "project" or "title"
    for (const key of Object.keys(row)) {
      if (row[key] && typeof row[key] === 'object') {
        if (row[key].title) { projectTitle = row[key].title; break; }
        if (row[key].name) { projectTitle = row[key].name; break; }
      } else if (typeof row[key] === 'string' && (key.includes("project") || key.includes("title"))) {
        projectTitle = row[key];
        break;
      }
    }
  }

  // 2. Find Date & Time dynamically
  let scheduledAt = row.scheduled_at ?? row.defense_details?.scheduled_at ?? row.date ?? row.time;
  if (!scheduledAt) {
    for (const key of Object.keys(row)) {
      if (row[key] && typeof row[key] === 'object') {
        const nested = row[key];
        if (nested.scheduled_at || nested.date || nested.time) {
          scheduledAt = nested.scheduled_at || nested.date || (nested.time ? `${nested.date || ''} ${nested.time}` : null);
          break;
        }
      } else if (row[key] && typeof row[key] === 'string' && (key.includes("scheduled") || key.includes("date") || key.includes("time"))) {
        scheduledAt = row[key];
        break;
      }
    }
  }
  let formattedDate = "——";
  if (scheduledAt) {
    const parsed = dayjs(scheduledAt);
    if (parsed.isValid()) {
      formattedDate = parsed.format("MMM DD, h:mm A");
    } else {
      formattedDate = String(scheduledAt);
    }
  }

  // 3. Find Location dynamically
  let location = row.location ?? row.defense_details?.location ?? "——";
  if (location === "——") {
    for (const key of Object.keys(row)) {
      if (row[key] && typeof row[key] === 'object' && row[key].location) {
        location = row[key].location;
        break;
      } else if (row[key] && typeof row[key] === 'string' && (key.includes("location") || key.includes("hall") || key.includes("room"))) {
        location = row[key];
        break;
      }
    }
  }

  // 4. Find Assistants and Doctors dynamically
  let doctorsList = [];
  let assistantsList = [];

  const memberContainer = row.committee_members ?? row.supervisors ?? row;
  if (memberContainer) {
    if (Array.isArray(memberContainer.doctors)) {
      doctorsList = memberContainer.doctors;
    } else if (memberContainer.doctor) {
      doctorsList = [memberContainer.doctor];
    }
    
    if (Array.isArray(memberContainer.teaching_assistants)) {
      assistantsList = memberContainer.teaching_assistants;
    } else if (Array.isArray(memberContainer.assistants)) {
      assistantsList = memberContainer.assistants;
    } else if (memberContainer.ta) {
      assistantsList = [memberContainer.ta];
    } else if (memberContainer.assistant) {
      assistantsList = [memberContainer.assistant];
    }
  }

  if (doctorsList.length === 0 || assistantsList.length === 0) {
    for (const key of Object.keys(row)) {
      if (row[key] && typeof row[key] === 'object') {
        const val = row[key];
        if (Array.isArray(val)) {
          if (key.includes("doctor")) doctorsList = val;
          else if (key.includes("ta") || key.includes("assistant") || key.includes("teaching")) assistantsList = val;
        }
      }
    }
  }

  const doc1 = doctorsList[0]?.full_name || doctorsList[0]?.name || row.doctor_1_name || '—';
  const doc2 = doctorsList[1]?.full_name || doctorsList[1]?.name || row.doctor_2_name || '—';
  const doc3 = doctorsList[2]?.full_name || doctorsList[2]?.name || row.doctor_3_name || '—';

  const assistantName = assistantsList.length > 0
    ? assistantsList.map(a => a.full_name || a.name || '—').join(', ')
    : (row.assistant_name || row.ta_name || row.assistant || '—');

  // 5. Find Grade dynamically
  const maxScore = row.max_score ?? row.project_course?.max_score ?? row.defense_details?.max_score ?? 20;

  const rawGrade = row.grade ?? row.defense_grade ?? row.score ?? row.mark;
  const gradeVal = rawGrade !== null && rawGrade !== undefined
    ? (typeof rawGrade === 'object'
        ? (rawGrade.grade ?? rawGrade.value ?? rawGrade.score ?? Object.values(rawGrade)[0] ?? null)
        : rawGrade)
    : null;
  const gradeDisplay = gradeVal !== null && gradeVal !== undefined && gradeVal !== ''
    ? (String(gradeVal).includes("/") ? String(gradeVal) : `${gradeVal}/${maxScore}`)
    : null;

  return {
    committeeId,
    projectTitle,
    formattedDate,
    location,
    assistantName,
    doc1,
    doc2,
    doc3,
    gradeDisplay,
    maxScore
  };
};



export default function AllDiscussions() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const projectCourseId = searchParams.get("capstoneId") || 1;

  // Grade modal state
  const [gradeModalOpen, setGradeModalOpen] = useState(false);
  const [gradeInput, setGradeInput] = useState("");
  const [gradeTarget, setGradeTarget] = useState(null); // { committeeId, rowId }
  const [gradeSubmitting, setGradeSubmitting] = useState(false);

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
        data = Array.isArray(res) ? res : (res?.data || res?.committees || []);
        if (data.length > 0) console.log("[Debug] First row keys:", Object.keys(data[0]), "| Sample:", data[0]);

      }
      setRows(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn("Error fetching discussions:", err);
      toast.error("Failed to load discussions.");
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  // Open grade modal
  const openGradeModal = (committeeId, maxScore = 20) => {
    setGradeTarget({ committeeId, maxScore });
    setGradeInput("");
    setGradeModalOpen(true);
  };

  // Submit grade
  const handleGradeSubmit = async () => {
    const maxScore = gradeTarget?.maxScore ?? 20;
    const parsed = parseFloat(gradeInput);
    if (isNaN(parsed) || parsed < 0 || parsed > maxScore) {
      toast.error(`Please enter a valid grade between 0 and ${maxScore}.`);
      return;
    }

    try {
      setGradeSubmitting(true);
      await SupervisorService.addDefenseGrade(gradeTarget.committeeId, parsed);
      toast.success("Grade submitted successfully!");
      setGradeModalOpen(false);
      // Refresh list to update grade field
      await getData();
    } catch (err) {
      console.error("Grade submission failed:", err);
      toast.error(err.message || "Failed to submit grade.");
    } finally {
      setGradeSubmitting(false);
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
        link.remove();
      } else {
        // Use raw fetch with Bearer token for binary download
        const token = localStorage.getItem("token");
        const response = await fetch(
          "https://d97c-154-183-132-96.ngrok-free.app/api/supervisor/my-defense-committees/export",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "69420",
            },
          }
        );

        const contentType = response.headers.get("content-type") || "";
        if (!response.ok) {
          const text = await response.text();
          let errMsg = "Export request failed";
          try {
            const parsed = JSON.parse(text);
            errMsg = parsed.message || parsed.error || errMsg;
          } catch (e) {
            errMsg = `Export failed with status: ${response.status}`;
          }
          throw new Error(errMsg);
        }

        if (contentType.includes("application/json")) {
          const text = await response.text();
          let errMsg = "Export returned JSON instead of spreadsheet";
          try {
            const parsed = JSON.parse(text);
            console.log("Parsed export JSON:", parsed);
            
            const downloadUrl = parsed.download_url || parsed.data?.download_url || 
                                parsed.file_url || parsed.data?.file_url ||
                                parsed.url || parsed.data?.url ||
                                parsed.file || parsed.data?.file;
            const fileName = parsed.file_name || parsed.data?.file_name || "defense_committees.xlsx";
            
            if (downloadUrl) {
              const link = document.createElement('a');
              const resolvedUrl = downloadUrl.startsWith("http") 
                ? downloadUrl 
                : `https://d97c-154-183-132-96.ngrok-free.app${downloadUrl.startsWith("/") ? "" : "/"}${downloadUrl}`;
              
              link.href = resolvedUrl;
              link.setAttribute('download', fileName);
              document.body.appendChild(link);
              link.click();
              link.remove();
              toast.success(parsed.message || "Export started! 📥");
              return;
            }
            
            errMsg = parsed.message || parsed.error || errMsg;
          } catch (e) {
            console.warn("JSON parse failed for export response:", e);
          }
          throw new Error(errMsg);
        }

        const blob = await response.blob();
        const contentDisposition = response.headers.get("content-disposition") || "";
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        const filename = filenameMatch ? filenameMatch[1].replace(/["']/g, "") : "my_defense_committees.xlsx";
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.warn("Export failed:", err);
      toast.error("Export failed: " + (err.message || "Unknown error"));
    }
  };

  if (isAdmin) {
    return (
      <>
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
                      const {
                        committeeId,
                        projectTitle,
                        formattedDate,
                        location: locationVal,
                        assistantName,
                        doc1,
                        doc2,
                        doc3,
                        gradeDisplay,
                        maxScore
                      } = extractDiscussionRowDetails(row);

                      return (
                        <tr
                          key={committeeId || index}
                          className="discussion-row-clickable"
                          onClick={(e) => {
                            if (e.target.classList.contains("add-grade-link")) return;
                            if (!committeeId) { console.warn("No committee id found for row:", row); return; }
                            navigate(`/discussion-details/${committeeId}`);
                          }}
                        >
                          <td className="row-num">{index + 1}-</td>
                          <td className="project-title-cell">{projectTitle}</td>
                          <td>{formattedDate}</td>
                          <td>{locationVal}</td>
                          <td>{assistantName}</td>
                          <td>{doc1}</td>
                          <td>{doc2}</td>
                          <td>{doc3}</td>
                          <td>
                            {gradeDisplay ? (
                              <span className="grade-val">{gradeDisplay}</span>
                            ) : (
                              <span
                                className="add-grade-link"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openGradeModal(committeeId, maxScore);
                                }}
                              >
                                add grade
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                    {rows.length === 0 && !loading && (
                      <tr><td colSpan={9} style={{ textAlign: 'center', padding: '40px', color: '#A0AEC0' }}>No discussions found.</td></tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </Box>
        </div>
      </div>

      {/* Grade Modal */}
      <Dialog open={gradeModalOpen} onClose={() => setGradeModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, fontFamily: 'Outfit, sans-serif' }}>Add Defense Grade</DialogTitle>
        <DialogContent>
          <MuiTextField
            autoFocus
            label={`Grade (out of ${gradeTarget?.maxScore ?? 20})`}
            type="number"
            inputProps={{ min: 0, max: gradeTarget?.maxScore ?? 20, step: 0.5 }}
            fullWidth
            variant="outlined"
            size="small"
            value={gradeInput}
            onChange={(e) => setGradeInput(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setGradeModalOpen(false)} color="inherit">Cancel</Button>
          <Button
            onClick={handleGradeSubmit}
            variant="contained"
            disabled={gradeSubmitting}
            sx={{ background: '#0052CC', '&:hover': { background: '#0043A4' } }}
          >
            {gradeSubmitting ? "Submitting…" : "Submit Grade"}
          </Button>
        </DialogActions>
      </Dialog>
      </>
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
                      const {
                        committeeId,
                        projectTitle,
                        formattedDate,
                        location: locationVal,
                        assistantName,
                        doc1,
                        doc2,
                        doc3,
                        gradeDisplay,
                        maxScore
                      } = extractDiscussionRowDetails(row);

                      return (
                        <tr
                          key={committeeId || index}
                          className="discussion-row-clickable"
                          onClick={(e) => {
                            if (e.target.classList.contains("add-grade-link")) return;
                            if (!committeeId) { console.warn("No committee id found for row:", row); return; }
                            navigate(`/discussion-details/${committeeId}`);
                          }}
                        >
                          <td className="row-num">{index + 1}-</td>
                          <td className="project-title-cell">{projectTitle}</td>
                          <td>{formattedDate}</td>
                          <td>{locationVal}</td>
                          <td>{assistantName}</td>
                          <td>{doc1}</td>
                          <td>{doc2}</td>
                          <td>{doc3}</td>
                          <td>
                            {gradeDisplay ? (
                              <span className="grade-val">{gradeDisplay}</span>
                            ) : (
                              <span
                                className="add-grade-link"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openGradeModal(committeeId, maxScore);
                                }}
                              >
                                add grade
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                    {rows.length === 0 && !loading && (
                      <tr><td colSpan={9} style={{ textAlign: 'center', padding: '40px', color: '#A0AEC0' }}>No discussions found.</td></tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </Box>
        </main>
      </div>

      {/* Grade Modal */}
      <Dialog open={gradeModalOpen} onClose={() => setGradeModalOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, fontFamily: 'Outfit, sans-serif' }}>Add Defense Grade</DialogTitle>
        <DialogContent>
          <MuiTextField
            autoFocus
            label={`Grade (out of ${gradeTarget?.maxScore ?? 20})`}
            type="number"
            inputProps={{ min: 0, max: gradeTarget?.maxScore ?? 20, step: 0.5 }}
            fullWidth
            variant="outlined"
            size="small"
            value={gradeInput}
            onChange={(e) => setGradeInput(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setGradeModalOpen(false)} color="inherit">Cancel</Button>
          <Button
            onClick={handleGradeSubmit}
            variant="contained"
            disabled={gradeSubmitting}
            sx={{ background: '#0052CC', '&:hover': { background: '#0043A4' } }}
          >
            {gradeSubmitting ? "Submitting…" : "Submit Grade"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}