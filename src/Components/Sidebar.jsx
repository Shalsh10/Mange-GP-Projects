import { NavLink, useLocation } from "react-router-dom";
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

  const checkActive = (isActive) => {
    if (isActive) return true;
    if (label === "Library" && location.pathname.startsWith("/project-details")) {
      return true;
    }
    return false;
  };

  return (
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
  );
}
