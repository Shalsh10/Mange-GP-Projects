import { useState, useEffect } from "react";
import { useProfile } from "../context/ProfileContext";
import { SupervisorService } from "../Services/SupervisorServices";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Container,
  FileText,
  PenLine,
  UsersRound,
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

.doctor-dashboard-shell {
  width: 100%;
  max-width: 1500px;
}

.doctor-dashboard-title {
  display: flex;
  align-items: center;
  margin: 0 0 28px;
  color: #1A202C;
  font-size: 32px;
  font-weight: 700;
  line-height: 1;
}

.doctor-dashboard-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 32px;
  margin-bottom: 28px;
}

.doctor-stat-card {
  height: 132px;
  background: #ffffff;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  padding: 22px 18px;
  box-sizing: border-box;
}

.doctor-stat-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.doctor-stat-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #4A5568;
  font-size: 14px;
  font-weight: 600;
}

.doctor-stat-icon {
  display: flex;
  width: 32px;
  height: 32px;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  color: #ffffff;
}

.doctor-stat-bottom {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-top: 18px;
}

.doctor-stat-value {
  color: #1A202C;
  font-size: 36px;
  font-weight: 700;
  line-height: 1;
}

.doctor-stat-helper {
  margin-bottom: 4px;
  color: #0052CC;
  font-size: 12px;
  font-weight: 600;
}

.doctor-dashboard-grid {
  display: grid;
  grid-template-columns: minmax(520px, 1fr) minmax(520px, 0.95fr);
  gap: 32px;
  align-items: start;
}

.doctor-left-stack {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.doctor-card {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.02);
  border: 1px solid #E2E8F0;
}

.doctor-grade-card {
  width: 100%;
  height: 380px;
  padding: 28px 24px 20px;
  box-sizing: border-box;
}

.doctor-activity-card {
  width: 100%;
  min-height: 220px;
  padding: 24px 28px;
  box-sizing: border-box;
}

.doctor-section-title {
  margin: 0 0 18px;
  color: #1A202C;
  font-size: 20px;
  font-weight: 700;
  line-height: 1;
}

.doctor-activity-row {
  display: flex;
  align-items: center;
  gap: 14px;
  border-bottom: 1px solid #F1F5F9;
  padding: 14px 0;
}

.doctor-activity-row:last-child {
  border-bottom: none;
}

.doctor-activity-icon {
  display: flex;
  width: 32px;
  height: 32px;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  color: #ffffff;
}

.doctor-activity-copy {
  min-width: 0;
  line-height: 1.2;
}

.doctor-activity-text {
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #2D3748;
  font-size: 13px;
  font-weight: 500;
}

.doctor-activity-time {
  margin: 4px 0 0;
  color: #718096;
  font-size: 11px;
}

.doctor-view-link {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 14px 0 0 auto;
  padding: 0;
  border: 0;
  background: transparent;
  color: #0052CC;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.doctor-process-card {
  width: 100%;
  min-height: auto;
  padding: 32px;
  box-sizing: border-box;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.02);
  border: 1px solid #E2E8F0;
}

.doctor-process-title {
  margin: 0 0 24px;
  color: #1A202C;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.1;
}

.doctor-donut-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px;
  margin-bottom: 24px;
}

.doctor-donut-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 10px 0;
}

.doctor-donut {
  position: relative;
  width: 180px;
  height: 180px;
}

.doctor-donut circle {
  transition: stroke-dasharray 0.8s ease;
}

.doctor-donut-center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.doctor-donut-value {
  color: #1A202C;
  font-size: 38px;
  font-weight: 800;
  letter-spacing: -1px;
  line-height: 1;
}

.doctor-donut-label {
  max-width: 140px;
  color: #718096;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.3;
  text-align: center;
  margin-top: 4px;
}

.doctor-process-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 24px 0;
  padding-top: 18px;
  border-top: 1px solid #F1F5F9;
  font-size: 15px;
  line-height: 1.4;
}

.doctor-process-meta-label {
  color: #0052CC;
  font-weight: 700;
}

.doctor-process-meta-value {
  color: #4A5568;
  font-weight: 500;
}

.doctor-calendar-title {
  margin: 24px 0 12px;
  padding-top: 18px;
  border-top: 1px solid #F1F5F9;
  color: #1A202C;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.1;
}

.doctor-calendar-panel {
  padding: 0;
  width: 100%;
}

.doctor-calendar {
  width: 100%;
}

.doctor-calendar-month {
  margin-bottom: 14px;
  text-align: center;
  color: #718096;
  font-size: 13px;
  font-weight: 600;
}

.doctor-calendar-weekdays,
.doctor-calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
}

.doctor-calendar-weekdays {
  color: #EF534A;
  font-size: 11px;
  font-weight: 700;
  margin-bottom: 8px;
}

.doctor-calendar-days {
  row-gap: 12px;
  color: #4A5568;
  font-size: 11px;
  font-weight: 500;
}

.doctor-calendar-day {
  display: flex;
  width: 24px;
  height: 24px;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  border-radius: 999px;
}

.doctor-calendar-muted {
  color: #A0AEC0;
}

.doctor-calendar-active {
  background: #EF534A;
  color: #ffffff !important;
  font-weight: 700;
}

.doctor-action-button {
  display: flex;
  width: 100%;
  max-width: 240px;
  height: 42px;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin: 24px 0 0 auto;
  border: 0;
  border-radius: 8px;
  background: #0052CC;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  line-height: 1;
  box-shadow: 0 4px 6px rgba(0, 82, 204, 0.2);
  cursor: pointer;
  transition: background 0.2s ease, transform 0.1s ease;
}

.doctor-action-button:hover {
  background: #0043A4;
}

.doctor-action-button:active {
  transform: scale(0.98);
}

@media (max-width: 1180px) {
  .doctor-dashboard-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 900px) {
  .doctor-dashboard-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .doctor-dashboard-page {
    padding: 16px 12px;
  }

  .doctor-dashboard-title {
    font-size: 24px;
  }
}
`;

const stats = [
  { title: "Total Projects", value: 6, color: "#EF534A", icon: Container },
  { title: "Teams On Track", value: 4, color: "#22C55E", icon: UsersRound },
  {
    title: "Upcoming Meetings",
    value: 2,
    color: "#3B82F6",
    icon: CalendarDays,
    helper: "Supervisor",
  },
  { title: "Teams Supervising", value: 5, color: "#C84FC7", icon: UsersRound },
];

const grades = [
  { team: "Team A", grade: 86.73, color: "#2AD45F" },
  { team: "Team E", grade: 65.97, color: "#2AD45F" },
  { team: "Team D", grade: 45.64, color: "#2F76D2" },
  { team: "Team B", grade: 39.95, color: "#2F76D2" },
  { team: "Team C", grade: 20.09, color: "#F13A3A" },
  { team: "Team F", grade: 17.69, color: "#F13A3A" },
];

const activities = [
  {
    icon: FileText,
    color: "#2ECC71",
    team: "Team A",
    text: "submitted UI Prototype",
    time: "30 mints ago",
  },
  {
    icon: Clock3,
    color: "#FFC04D",
    team: "Team C",
    text: "uploaded a file in Messages",
    time: "2 hours ago",
  },
  {
    icon: CalendarDays,
    color: "#2F80ED",
    team: "Team B",
    text: "requested a meeting",
    time: "1 day ago",
  },
];

const calendarWeeks = [
  ["29", "30", "31", "1", "2", "3", "4"],
  ["5", "6", "7", "8", "9", "10", "11"],
  ["12", "13", "14", "15", "16", "17", "18"],
  ["19", "20", "21", "22", "23", "24", "25"],
  ["26", "27", "28", "29", "30", "31", "1"],
];

export default function DoctorDashboard() {
  const { profileName } = useProfile();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await SupervisorService.getDashboard();
        setDashboardData(res);
      } catch (error) {
        console.error("Error loading doctor dashboard:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const statsList = [
    { 
      title: "Total Projects", 
      value: dashboardData?.total_projects ?? dashboardData?.projects_count ?? 6, 
      color: "#EF534A", 
      icon: Container 
    },
    { 
      title: "Teams On Track", 
      value: dashboardData?.teams_on_track ?? dashboardData?.on_track_count ?? 4, 
      color: "#22C55E", 
      icon: UsersRound 
    },
    {
      title: "Upcoming Meetings",
      value: dashboardData?.upcoming_meetings ?? dashboardData?.meetings_count ?? 2,
      color: "#3B82F6",
      icon: CalendarDays,
      helper: "Supervisor",
    },
    { 
      title: "Teams Supervising", 
      value: dashboardData?.teams_supervising ?? dashboardData?.supervising_count ?? 5, 
      color: "#C84FC7", 
      icon: UsersRound 
    },
  ];

  const projectCompletion = dashboardData?.project_completion ?? dashboardData?.completion_rate ?? 28;
  const pendingEvaluations = dashboardData?.pending_evaluations ?? dashboardData?.pending_count ?? 47;
  const currentMilestone = dashboardData?.current_milestone ?? "User Interface Design & Prototyping";

  return (
    <div className="doctor-dashboard-page">
      <style>{dashboardCss}</style>

      <div className="doctor-dashboard-shell">
        <h1 className="doctor-dashboard-title">
          Welcome Dr. {profileName || "Ahmed"} ! <span style={{ marginLeft: 8 }}>{"\uD83D\uDC4B\uD83C\uDFFC"}</span>
        </h1>

        <section className="doctor-dashboard-stats">
          {statsList.map((item) => (
            <StatCard key={item.title} item={item} />
          ))}
        </section>

        <section className="doctor-dashboard-grid">
          <div className="doctor-left-stack">
            <GradeChart />
            <RecentActivity />
          </div>

          <div>
            <ProjectProcess 
              completion={projectCompletion} 
              pending={pendingEvaluations} 
              milestone={currentMilestone} 
            />
            <button className="doctor-action-button">
              <PenLine size={15} strokeWidth={2.4} />
              Write Announcement
            </button>
          </div>
        </section>
      </div>
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
        <strong className="doctor-stat-value">{item.value}</strong>
        {item.helper && <span className="doctor-stat-helper">{item.helper}</span>}
      </div>
    </article>
  );
}

function GradeChart() {
  return (
    <article className="doctor-card doctor-grade-card">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={grades}
          layout="vertical"
          margin={{ top: 18, right: 34, bottom: 22, left: 8 }}
          barCategoryGap={18}
        >
          <CartesianGrid stroke="#EDF0F4" />
          <XAxis
            type="number"
            domain={[0, 100]}
            ticks={[0, 20, 40, 60, 80, 100]}
            orientation="top"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#777", fontSize: 10 }}
          />
          <YAxis
            dataKey="team"
            type="category"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#505A66", fontSize: 11 }}
            width={54}
          />
          <Bar dataKey="grade" barSize={20}>
            {grades.map((entry) => (
              <Cell key={entry.team} fill={entry.color} />
            ))}
            <LabelList
              dataKey="grade"
              position="right"
              formatter={(value) => value.toFixed(2)}
              fill="#777"
              fontSize={9}
            />
          </Bar>
          <text
            x="50%"
            y="99%"
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#777"
            fontSize="11"
          >
            Grades
          </text>
        </BarChart>
      </ResponsiveContainer>
    </article>
  );
}

function RecentActivity() {
  return (
    <article className="doctor-card doctor-activity-card">
      <h2 className="doctor-section-title">Recent Activity</h2>

      <div>
        {activities.map((activity) => {
          const Icon = activity.icon;

          return (
            <div key={`${activity.team}-${activity.text}`} className="doctor-activity-row">
              <span className="doctor-activity-icon" style={{ background: activity.color }}>
                <Icon size={17} strokeWidth={2.4} />
              </span>

              <div className="doctor-activity-copy">
                <p className="doctor-activity-text">
                  <span style={{ color: activity.color, fontWeight: 700 }}>{activity.team}</span>{" "}
                  {activity.text}
                </p>
                <p className="doctor-activity-time">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>

      <button className="doctor-view-link">
        View all activity
        <ArrowRight size={12} strokeWidth={2.4} />
      </button>
    </article>
  );
}

function ProjectProcess({ completion, pending, milestone }) {
  return (
    <article className="doctor-card doctor-process-card">
      <h2 className="doctor-process-title">Project Process</h2>

      <div className="doctor-donut-row">
        <div className="doctor-donut-card">
          <Donut value={completion} color="#22C55E" track="#DBEAFE" label="Project Completion" />
        </div>
        <div className="doctor-donut-card">
          <Donut value={pending} color="#EF534A" track="#F1F5F9" label="Pending Evaluations" />
        </div>
      </div>

      <div className="doctor-process-meta">
        <span className="doctor-process-meta-label">Current Milestone:</span>
        <span className="doctor-process-meta-value">{milestone}</span>
      </div>

      <h3 className="doctor-calendar-title">Deadline Calendar</h3>
      <div className="doctor-calendar-panel">
        <MiniCalendar />
      </div>
    </article>
  );
}

function Donut({ value, color, track, label }) {
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  const dash = `${(value / 100) * circumference} ${circumference}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      {/* Circle Wrapper */}
      <div className="doctor-donut" style={{ width: '140px', height: '140px', position: 'relative' }}>
        <svg viewBox="0 0 200 200" width="100%" height="100%">
          <circle cx="100" cy="100" r={radius} fill="none" stroke={track} strokeWidth="18" />
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke={color}
            strokeDasharray={dash}
            strokeLinecap="round"
            strokeWidth="18"
            transform="rotate(-90 100 100)"
          />
        </svg>

        {/* Center Percentage Text */}
        <div className="doctor-donut-center" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <strong className="doctor-donut-value" style={{ fontSize: '30px', fontWeight: '800', color: '#1A202C' }}>{value}%</strong>
        </div>
      </div>

      {/* Label BELOW the circle */}
      <div 
        className="doctor-donut-label" 
        style={{ 
          marginTop: '12px', 
          color: '#4A5568', 
          fontSize: '13px', 
          fontWeight: '700', 
          textAlign: 'center',
          fontFamily: 'Outfit, sans-serif'
        }}
      >
        {label}
      </div>
    </div>
  );
}

function MiniCalendar() {
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="doctor-calendar">
      <div className="doctor-calendar-month">January 2026</div>

      <div className="doctor-calendar-weekdays">
        {weekdays.map((day) => (
          <span key={day}>{day}</span>
        ))}
      </div>

      <div className="doctor-calendar-days">
        {calendarWeeks.flat().map((day, index) => {
          const faded = index < 3 || index > 33;
          const active = index === 24;

          return (
            <span
              key={`${day}-${index}`}
              className={`doctor-calendar-day ${faded ? "doctor-calendar-muted" : ""} ${
                active ? "doctor-calendar-active" : ""
              }`}
            >
              {day}
            </span>
          );
        })}
      </div>
    </div>
  );
}
