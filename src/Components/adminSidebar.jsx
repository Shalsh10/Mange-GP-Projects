import "./adminSidebar.css";
import { NavLink } from "react-router-dom";
import {
  FaUsers,
  FaClipboardList,
  FaFilter,
  FaFlag,
  FaLightbulb,
  FaUserFriends,
  FaFileAlt,
  FaUserTie,
} from "react-icons/fa";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <nav>
        <NavLink
          to="/management"
          className={({ isActive }) =>
            isActive ? "sidebar-item active" : "sidebar-item"
          }
        >
          <FaUsers />
          <span>Management</span>
        </NavLink>

        <NavLink
          to="/rules"
          className={({ isActive }) =>
            isActive ? "sidebar-item active" : "sidebar-item"
          }
        >
          <FaClipboardList />
          <span>Rules</span>
        </NavLink>

        <NavLink
          to="/ai-filter"
          className={({ isActive }) =>
            isActive ? "sidebar-item active" : "sidebar-item"
          }
        >
          <FaFilter />
          <span>AI Filter</span>
        </NavLink>

        <NavLink
          to="/milestones"
          className={({ isActive }) =>
            isActive ? "sidebar-item active" : "sidebar-item"
          }
        >
          <FaFlag />
          <span>Milestones Setup</span>
        </NavLink>

        <NavLink
          to="/suggested-projects"
          className={({ isActive }) =>
            isActive ? "sidebar-item active" : "sidebar-item"
          }
        >
          <FaLightbulb />
          <span>Suggestions Projects</span>
        </NavLink>

        <NavLink
          to="/teams"
          className={({ isActive }) =>
            isActive ? "sidebar-item active" : "sidebar-item"
          }
        >
          <FaUserFriends />
          <span>Teams</span>
        </NavLink>

        <NavLink
          to="/final-discussions"
          className={({ isActive }) =>
            isActive ? "sidebar-item active" : "sidebar-item"
          }
        >
          <FaFileAlt />
          <span>Final discussions</span>
        </NavLink>

        <NavLink
          to="/milestone-committee"
          className={({ isActive }) =>
            isActive ? "sidebar-item active" : "sidebar-item"
          }
        >
          <FaUserTie />
          <span>Milestone Committee</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;