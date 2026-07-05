import { NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  CalendarDays,
  CircleDot,
  Folder,
  LayoutDashboard,
  MessageCircle,
  University,
  UserPlus,
  UsersRound,
} from "lucide-react";
const sidebarCss = `
.doctor-sidebar {
  width: 256px;
  height: 100%;
  flex: 0 0 256px;
  background: #1A2E4C;
  color: #ffffff;
}

.doctor-sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 24px 0px;
}

.doctor-sidebar-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 24px;
  border-radius: 0px;
  color: #ffffff;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  transition: background 0.2s ease;
}

.doctor-sidebar-link:hover {
  background: #203A5D;
}

.doctor-sidebar-link.active {
  background: #0052CC;
}

.doctor-sidebar-icon {
  display: flex;
  width: 16px;
  height: 16px;
  align-items: center;
  justify-content: center;
  flex: 0 0 16px;
}

@media (max-width: 760px) {
  .doctor-sidebar {
    width: 72px;
    flex-basis: 72px;
  }

  .doctor-sidebar-link {
    justify-content: center;
    padding: 0;
    font-size: 0;
  }

  .doctor-sidebar-label {
    display: none;
  }
}
`;

const iconProps = { size: 16, strokeWidth: 2.2 };

const items = [
  { to: "/doctor/dashboard", icon: <LayoutDashboard {...iconProps} />, label: "Dashboard", end: true },
  { to: "/doctor/projects", icon: <UsersRound {...iconProps} />, label: "Projects & Teams" },
  { to: "/chat", icon: <MessageCircle {...iconProps} />, label: "Community Chat" },
  { to: "/milestones", icon: <CalendarDays {...iconProps} />, label: "Milestones" },
  { to: "/doctor/join-requests", icon: <UserPlus {...iconProps} />, label: "Join Requests" },
  { to: "/library", icon: <Folder {...iconProps} />, label: "Library" },
  { to: "/all-discussions", icon: <University {...iconProps} />, label: "Final discussions" },
  { to: "/doctor/supervising", icon: <CircleDot {...iconProps} />, label: "Supervising" },
];

export default function Sidebar() {
  return (
    <aside className="doctor-sidebar">
      <style>{sidebarCss}</style>

      <nav className="doctor-sidebar-nav">
        {items.map((item) => (
          <SidebarItem key={item.label} {...item} />
        ))}
      </nav>
    </aside>
  );
}

function SidebarItem({ icon, label, to, end }) {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const selectedConvId = params.get("convId") ? Number(params.get("convId")) : null;

  const isChatActive = label === "Community Chat" && location.pathname.startsWith("/chat");

  // ── Fetch conversations dynamically from API ──────────────────────────────
  const [chatConvs, setChatConvs] = useState([]);

  useEffect(() => {
    if (!isChatActive) return;
    const token = localStorage.getItem("token");
    fetch("/api/chat/conversations", {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": "69420",
      },
    })
      .then((r) => r.ok ? r.json() : null)
      .then((res) => {
        const data = res?.data || res || [];
        setChatConvs(Array.isArray(data) ? data : []);
      })
      .catch(() => {});
  }, [isChatActive]);

  const checkActive = (isActive) => {
    if (isActive) return true;
    if (label === "Library" && location.pathname.startsWith("/project-details")) return true;
    return false;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <NavLink
        to={to}
        end={end}
        className={({ isActive }) =>
          `doctor-sidebar-link${checkActive(isActive) ? " active" : ""}`
        }
      >
        <span className="doctor-sidebar-icon">{icon}</span>
        <span className="doctor-sidebar-label">{label}</span>
      </NavLink>

      {isChatActive && chatConvs.length > 0 && (
        <div className="doctor-sidebar-submenu" style={{ display: "flex", flexDirection: "column", paddingLeft: "40px", gap: "2px", margin: "4px 0" }}>
          {chatConvs.map((conv) => {
            const isActiveConv = selectedConvId === conv.conversation_id;
            return (
              <NavLink
                key={conv.conversation_id}
                to={`/chat?convId=${conv.conversation_id}`}
                className="doctor-sidebar-sublink"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "8px 16px 8px 12px",
                  color: isActiveConv ? "#ffffff" : "#cbd5e1",
                  background: isActiveConv ? "rgba(255, 255, 255, 0.15)" : "transparent",
                  textDecoration: "none",
                  fontSize: "13px",
                  fontWeight: isActiveConv ? "600" : "400",
                  borderRadius: "4px 0 0 4px",
                  transition: "all 0.15s ease",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                  {conv.team_name}
                </span>
              </NavLink>
            );
          })}
        </div>
      )}
    </div>
  );
}
