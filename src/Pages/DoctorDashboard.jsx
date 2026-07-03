import { useState, useEffect } from "react";
import { useProfile } from "../context/ProfileContext";
import { SupervisorService } from "../Services/SupervisorServices";
import dayjs from "dayjs";
import SendAnnouncementModal from "./SendAnnouncementModal";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Container,
  FileText,
  PenLine,
  UsersRound,
  Trophy,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

const dashboardCss = `
.doctor-dashboard-page {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  min-height: calc(100vh - 64px);
  overflow: auto;
  background: #F4F6F9;
  padding: 32px 36px;
  box-sizing: border-box;
}
.doctor-dashboard-shell { width: 100%; max-width: 1500px; }
.doctor-dashboard-title {
  display: flex; align-items: center; margin: 0 0 28px;
  color: #1A202C; font-size: 32px; font-weight: 700; line-height: 1;
}
.doctor-dashboard-stats {
  display: grid; grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 32px; margin-bottom: 28px;
}
.doctor-stat-card {
  height: 132px; background: #ffffff; border: 1px solid #E2E8F0;
  border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  padding: 22px 18px; box-sizing: border-box;
}
.doctor-stat-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
.doctor-stat-title { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #4A5568; font-size: 14px; font-weight: 600; }
.doctor-stat-icon { display: flex; width: 32px; height: 32px; flex: 0 0 auto; align-items: center; justify-content: center; border-radius: 999px; color: #ffffff; }
.doctor-stat-bottom { display: flex; align-items: flex-end; justify-content: space-between; margin-top: 18px; }
.doctor-stat-value { color: #1A202C; font-size: 36px; font-weight: 700; line-height: 1; }
.doctor-stat-helper { margin-bottom: 4px; color: #0052CC; font-size: 12px; font-weight: 600; }
.doctor-dashboard-grid {
  display: grid; grid-template-columns: minmax(520px, 1fr) minmax(520px, 0.95fr);
  gap: 32px; align-items: start;
}
.doctor-left-stack { display: flex; flex-direction: column; gap: 24px; }
.doctor-card { background: #ffffff; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.03), 0 1px 3px rgba(0,0,0,0.02); border: 1px solid #E2E8F0; }
.doctor-grade-card { width: 100%; height: 380px; padding: 28px 24px 20px; box-sizing: border-box; }
.doctor-activity-card { width: 100%; min-height: 220px; padding: 24px 28px; box-sizing: border-box; }
.doctor-section-title { margin: 0 0 18px; color: #1A202C; font-size: 20px; font-weight: 700; line-height: 1; }
.doctor-activity-row { display: flex; align-items: center; gap: 14px; border-bottom: 1px solid #F1F5F9; padding: 14px 0; }
.doctor-activity-row:last-child { border-bottom: none; }
.doctor-activity-icon { display: flex; width: 32px; height: 32px; flex: 0 0 auto; align-items: center; justify-content: center; border-radius: 999px; color: #ffffff; }
.doctor-activity-copy { min-width: 0; line-height: 1.2; }
.doctor-activity-text { margin: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #2D3748; font-size: 13px; font-weight: 500; }
.doctor-activity-time { margin: 4px 0 0; color: #718096; font-size: 11px; }
.doctor-view-link { display: flex; align-items: center; gap: 6px; margin: 14px 0 0 auto; padding: 0; border: 0; background: transparent; color: #0052CC; font-size: 13px; font-weight: 600; cursor: pointer; }
.doctor-process-card { width: 100%; min-height: auto; padding: 32px; box-sizing: border-box; border-radius: 16px; background: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.03), 0 1px 3px rgba(0,0,0,0.02); border: 1px solid #E2E8F0; }
.doctor-process-title { margin: 0 0 24px; color: #1A202C; font-size: 20px; font-weight: 700; line-height: 1.1; }
.doctor-donut-row { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 22px; margin-bottom: 8px; }
.doctor-donut-card { display: flex; flex-direction: column; align-items: center; justify-content: flex-start; gap: 10px; padding: 20px 16px; background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 12px; }
.doctor-capstone-meta { width: 100%; margin-top: 10px; padding-top: 10px; border-top: 1px solid #E2E8F0; font-size: 12px; line-height: 1.6; }
.doctor-capstone-meta-row { display: flex; align-items: flex-start; gap: 4px; }
.doctor-capstone-meta-label { color: #0052CC; font-weight: 700; flex-shrink: 0; }
.doctor-capstone-meta-value { color: #4A5568; font-weight: 500; }
.doctor-capstone-deadline { display: flex; align-items: center; gap: 5px; margin-top: 4px; color: #EF534A; font-size: 11px; font-weight: 700; }
.doctor-calendar-title { margin: 24px 0 12px; padding-top: 18px; border-top: 1px solid #F1F5F9; color: #1A202C; font-size: 18px; font-weight: 700; line-height: 1.1; }
.doctor-calendar-panel { padding: 0; width: 100%; }
.doctor-calendar { width: 100%; }
.doctor-calendar-month { margin-bottom: 14px; text-align: center; color: #718096; font-size: 13px; font-weight: 600; }
.doctor-calendar-weekdays, .doctor-calendar-days { display: grid; grid-template-columns: repeat(7, 1fr); text-align: center; }
.doctor-calendar-weekdays { color: #EF534A; font-size: 11px; font-weight: 700; margin-bottom: 8px; }
.doctor-calendar-days { row-gap: 12px; color: #4A5568; font-size: 11px; font-weight: 500; }
.doctor-calendar-day { display: flex; width: 24px; height: 24px; align-items: center; justify-content: center; margin: 0 auto; border-radius: 999px; }
.doctor-calendar-muted { color: #A0AEC0; }
.doctor-calendar-active { background: #EF534A; color: #ffffff !important; font-weight: 700; }
.doctor-action-button { display: flex; width: 100%; max-width: 240px; height: 42px; align-items: center; justify-content: center; gap: 10px; margin: 24px 0 0 auto; border: 0; border-radius: 8px; background: #0052CC; color: #ffffff; font-size: 14px; font-weight: 600; line-height: 1; box-shadow: 0 4px 6px rgba(0,82,204,0.2); cursor: pointer; transition: background 0.2s ease, transform 0.1s ease; }
.doctor-action-button:hover { background: #0043A4; }
.doctor-action-button:active { transform: scale(0.98); }
.doctor-empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 32px 16px; color: #A0AEC0; font-size: 13px; font-weight: 500; text-align: center; gap: 8px; }
@media (max-width: 1180px) { .doctor-dashboard-grid { grid-template-columns: 1fr; } }
@media (max-width: 900px) { .doctor-dashboard-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 760px) { .doctor-dashboard-page { padding: 16px 12px; } .doctor-dashboard-title { font-size: 24px; } }
`;

function buildCalendarWeeks(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;
  const cells = [];
  for (let i = startOffset - 1; i >= 0; i--) cells.push({ day: daysInPrev - i, muted: true });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, muted: false });
  const total = cells.length <= 35 ? 35 : 42;
  for (let d = 1; cells.length < total; d++) cells.push({ day: d, muted: true });
  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

export default function DoctorDashboard() {
  const { profileName } = useProfile();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAnnouncement, setShowAnnouncement] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await SupervisorService.getDashboard();
        setDashboardData(res?.data ?? res);
      } catch (err) {
        console.error("Error loading doctor dashboard:", err);
        setError(err.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Stats from API
  const statsList = [
    { title: "Total Projects", value: dashboardData?.statistics?.total_projects ?? dashboardData?.total_projects ?? dashboardData?.projects_count ?? null, color: "#EF534A", icon: Container },
    { title: "Teams On Track", value: dashboardData?.statistics?.teams_on_track ?? dashboardData?.teams_on_track ?? dashboardData?.on_track_count ?? null, color: "#22C55E", icon: UsersRound },
    { title: "Upcoming Meetings", value: dashboardData?.statistics?.upcoming_meetings ?? dashboardData?.upcoming_meetings ?? dashboardData?.meetings_count ?? null, color: "#3B82F6", icon: CalendarDays, helper: "Supervisor" },
    { title: "Teams in Milestone", value: dashboardData?.statistics?.teams_in_committee ?? dashboardData?.statistics?.teams_supervising ?? dashboardData?.teams_supervising ?? dashboardData?.supervising_count ?? dashboardData?.teams_in_milestone ?? null, color: "#C84FC7", icon: Trophy },
  ];
  const hasAnyStats = statsList.some((s) => s.value !== null);

  // Capstone progress from API
  const capstones = (() => {
    const d = dashboardData;
    if (!d) return null;

    const proj1Progress = d.average_progress?.project_1?.average_completion ?? d.average_progress?.project_1?.completion ?? 0;
    const proj2Progress = d.average_progress?.project_2?.average_completion ?? d.average_progress?.project_2?.completion ?? 0;

    const milestonesList = d.current_milestones ?? d.milestones ?? [];
    const milestone1 = Array.isArray(milestonesList) 
      ? milestonesList.find(m => m.project_course_id === 1 || String(m.project_course_name || '').includes("I"))
      : null;
    const milestone2 = Array.isArray(milestonesList)
      ? milestonesList.find(m => m.project_course_id === 2 || String(m.project_course_name || '').includes("II"))
      : null;

    return [
      {
        label: "Capstone 1",
        completion: proj1Progress,
        milestone: milestone1?.title ?? "Not assigned yet",
        deadline: milestone1?.deadline ? dayjs(milestone1.deadline).format("MMM DD, YYYY") : "TBD",
      },
      {
        label: "Capstone 2",
        completion: proj2Progress,
        milestone: milestone2?.title ?? "Not assigned yet",
        deadline: milestone2?.deadline ? dayjs(milestone2.deadline).format("MMM DD, YYYY") : "TBD",
      }
    ];
  })();

  // Grade chart data from API
  const gradeData = (() => {
    const d = dashboardData;
    if (!d) return null;
    const raw = d.grade_progress ?? d.team_grades ?? d.grades ?? d.teams_grades ?? d.grade_chart ?? null;
    if (!Array.isArray(raw) || raw.length === 0) return null;
    return raw.map((item) => {
      const score = item.total_score ?? item.grade ?? 0;
      const max = item.max_score ?? 100;
      const percent = item.progress_percentage ?? ((score / max) * 100);
      return {
        team: item.project_title ?? item.team_name ?? item.team ?? "Team",
        grade: parseFloat(percent),
        color: parseFloat(percent) >= 50 ? "#22C55E" : "#EF534A",
      };
    });
  })();

  // Recent activity from API
  const activityData = (() => {
    const d = dashboardData;
    if (!d) return null;
    const raw = d.recent_activity ?? d.recent_activities ?? d.activities ?? null;
    if (!Array.isArray(raw) || raw.length === 0) return null;
    const iconMap = { submission: FileText, meeting: CalendarDays, feedback: Clock3, defense_grade: Trophy, milestone_grade: Trophy };
    const colorMap = { submission: "#2ECC71", meeting: "#2F80ED", feedback: "#FFC04D", defense_grade: "#C84FC7", milestone_grade: "#9B51E0" };
    return raw.map((item) => {
      const type = item.type ?? "submission";
      return {
        icon: iconMap[type] ?? FileText,
        color: colorMap[type] ?? "#2ECC71",
        team: item.project_title ?? item.team_name ?? item.team ?? "Team",
        text: item.message ?? item.description ?? item.action ?? "",
        time: item.created_at_human ?? item.time_ago ?? item.time ?? item.created_at ?? ""
      };
    });
  })();

  const now = new Date();
  const calendarWeeks = buildCalendarWeeks(now.getFullYear(), now.getMonth());
  const monthName = now.toLocaleString("en-US", { month: "long" });
  const yearName = now.getFullYear();

  if (loading) {
    return (
      <div className="doctor-dashboard-page">
        <style>{dashboardCss}</style>
        <div className="doctor-dashboard-shell">
          <div className="doctor-empty-state" style={{ minHeight: "60vh" }}>
            <div style={{ fontSize: "32px" }}>⏳</div>
            <p>Loading dashboard data…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="doctor-dashboard-page">
      <style>{dashboardCss}</style>
      <div className="doctor-dashboard-shell">
        <h1 className="doctor-dashboard-title">
          Welcome Dr. {profileName || "Ahmed"} !{" "}
          <span style={{ marginLeft: 8 }}>{"\uD83D\uDC4B\uD83C\uDFFC"}</span>
        </h1>

        {/* Stats */}
        {!hasAnyStats ? (
          <div className="doctor-empty-state" style={{ background: "#fff", borderRadius: "12px", marginBottom: "28px", border: "1px solid #E2E8F0" }}>
            <div style={{ fontSize: "28px" }}>📊</div>
            <p>No statistics data available</p>
          </div>
        ) : (
          <section className="doctor-dashboard-stats">
            {statsList.map((item) => (<StatCard key={item.title} item={item} />))}
          </section>
        )}

        {/* Grid */}
        <section className="doctor-dashboard-grid">
          <div className="doctor-left-stack">
            <GradeChart data={gradeData} />
            <RecentActivity data={activityData} />
          </div>
          <div>
            <ProjectProcess capstones={capstones} calendarWeeks={calendarWeeks} monthName={monthName} yearName={yearName} today={now.getDate()} />
            <button className="doctor-action-button" onClick={() => setShowAnnouncement(true)}>
              <PenLine size={15} strokeWidth={2.4} />
              Write Announcement
            </button>
          </div>
        </section>
      </div>

      {showAnnouncement && (
        <SendAnnouncementModal onClose={() => setShowAnnouncement(false)} />
      )}
    </div>
  );
}

function StatCard({ item }) {
  const Icon = item.icon;
  return (
    <article className="doctor-stat-card">
      <div className="doctor-stat-top">
        <p className="doctor-stat-title">{item.title}</p>
        <span className="doctor-stat-icon" style={{ background: item.color }}>
          <Icon size={16} strokeWidth={2.4} />
        </span>
      </div>
      <div className="doctor-stat-bottom">
        <strong className="doctor-stat-value">{item.value !== null ? item.value : "—"}</strong>
        {item.helper && <span className="doctor-stat-helper">{item.helper}</span>}
      </div>
    </article>
  );
}

function GradeChart({ data }) {
  if (!data) {
    return (
      <article className="doctor-card doctor-grade-card" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="doctor-empty-state">
          <div style={{ fontSize: "28px" }}>📉</div>
          <p>No grade data available</p>
        </div>
      </article>
    );
  }
  return (
    <article className="doctor-card doctor-grade-card">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 18, right: 34, bottom: 22, left: 8 }} barCategoryGap={18}>
          <CartesianGrid stroke="#EDF0F4" />
          <XAxis type="number" domain={[0, 100]} ticks={[0, 20, 40, 60, 80, 100]} orientation="top" axisLine={false} tickLine={false} tick={{ fill: "#777", fontSize: 10 }} />
          <YAxis dataKey="team" type="category" axisLine={false} tickLine={false} tick={{ fill: "#505A66", fontSize: 11 }} width={54} />
          <Bar dataKey="grade" barSize={20}>
            {data.map((entry) => (<Cell key={entry.team} fill={entry.color} />))}
            <LabelList dataKey="grade" position="right" formatter={(v) => Number(v).toFixed(2)} fill="#777" fontSize={9} />
          </Bar>
          <text x="50%" y="99%" textAnchor="middle" dominantBaseline="middle" fill="#777" fontSize="11">Grades</text>
        </BarChart>
      </ResponsiveContainer>
    </article>
  );
}

function RecentActivity({ data }) {
  return (
    <article className="doctor-card doctor-activity-card">
      <h2 className="doctor-section-title">Recent Activity</h2>
      {!data ? (
        <div className="doctor-empty-state">
          <div style={{ fontSize: "24px" }}>🕑</div>
          <p>No recent activity</p>
        </div>
      ) : (
        <div>
          {data.map((activity, idx) => {
            const Icon = activity.icon;
            return (
              <div key={idx} className="doctor-activity-row">
                <span className="doctor-activity-icon" style={{ background: activity.color }}>
                  <Icon size={17} strokeWidth={2.4} />
                </span>
                <div className="doctor-activity-copy">
                  <p className="doctor-activity-text">
                    <span style={{ color: activity.color, fontWeight: 700 }}>{activity.team}</span>{" "}{activity.text}
                  </p>
                  <p className="doctor-activity-time">{activity.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <button className="doctor-view-link">
        View all activity <ArrowRight size={12} strokeWidth={2.4} />
      </button>
    </article>
  );
}

function ProjectProcess({ capstones, calendarWeeks, monthName, yearName, today }) {
  return (
    <article className="doctor-card doctor-process-card">
      <h2 className="doctor-process-title">Project Process</h2>
      {!capstones ? (
        <div className="doctor-empty-state">
          <div style={{ fontSize: "28px" }}>📋</div>
          <p>No project process data available</p>
        </div>
      ) : (
        <div className="doctor-donut-row">
          {capstones.map((cap) => (<CapstoneDonut key={cap.label} capstone={cap} />))}
        </div>
      )}
      <h3 className="doctor-calendar-title">Deadline Calendar</h3>
      <div className="doctor-calendar-panel">
        <MiniCalendar calendarWeeks={calendarWeeks} monthName={monthName} yearName={yearName} today={today} />
      </div>
    </article>
  );
}

function CapstoneDonut({ capstone }) {
  const { label, completion, milestone, deadline } = capstone;
  const value = Math.round(Number(completion) || 0);
  const color = value >= 50 ? "#22C55E" : "#EF534A";
  const track = "#E2E8F0";
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const dash = `${(value / 100) * circumference} ${circumference}`;

  return (
    <div className="doctor-donut-card">
      <p style={{ margin: 0, fontWeight: 700, fontSize: "13px", color: "#1A202C" }}>{label}</p>

      <div style={{ position: "relative", width: "130px", height: "130px" }}>
        <svg viewBox="0 0 160 160" width="100%" height="100%">
          <circle cx="80" cy="80" r={radius} fill="none" stroke={track} strokeWidth="16" />
          <circle cx="80" cy="80" r={radius} fill="none" stroke={color} strokeDasharray={dash} strokeLinecap="round" strokeWidth="16" transform="rotate(-90 80 80)" />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <strong style={{ fontSize: "26px", fontWeight: "800", color: "#1A202C" }}>{value}%</strong>
          <span style={{ fontSize: "10px", color: "#718096", fontWeight: "600" }}>Complete</span>
        </div>
      </div>

      <p style={{ margin: 0, fontSize: "12px", fontWeight: "700", color: "#4A5568", textAlign: "center" }}>
        {label} Completion
      </p>

      <div className="doctor-capstone-meta">
        <div className="doctor-capstone-meta-row">
          <span className="doctor-capstone-meta-label">Milestone:</span>
          <span className="doctor-capstone-meta-value">{milestone}</span>
        </div>
        <div className="doctor-capstone-deadline">
          <CalendarDays size={12} strokeWidth={2.4} />
          <span>Deadline: {deadline}</span>
        </div>
      </div>
    </div>
  );
}

function MiniCalendar({ calendarWeeks, monthName, yearName, today }) {
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const allCells = calendarWeeks.flat();
  return (
    <div className="doctor-calendar">
      <div className="doctor-calendar-month">{monthName} {yearName}</div>
      <div className="doctor-calendar-weekdays">
        {weekdays.map((day) => (<span key={day}>{day}</span>))}
      </div>
      <div className="doctor-calendar-days">
        {allCells.map((cell, index) => {
          const isToday = !cell.muted && cell.day === today;
          return (
            <span key={index} className={`doctor-calendar-day ${cell.muted ? "doctor-calendar-muted" : ""} ${isToday ? "doctor-calendar-active" : ""}`}>
              {cell.day}
            </span>
          );
        })}
      </div>
    </div>
  );
}
