import { NavLink } from "react-router-dom";
import {
  User,
  FileText,
  Flag,
  LogOut,
} from "lucide-react";

import "./ProfileSidebar.css";

export default function ProfileSidebar() {
  const menuItems = [
    {
      title: "Edit Profile",
      icon: <User size={16} />,
      path: "/profile",
    },
    {
      title: "Terms & Policies",
      icon: <FileText size={16} />,
      path: "/terms",
    },
    {
      title: "Report a Problem",
      icon: <Flag size={16} />,
      path: "/report",
    },
  ];

  return (
    <div className="sidebar">
      <div>
        <div className="sidebar-header">
          <h2 className="sidebar-title">
            User Info
          </h2>
        </div>

        <div className="sidebar-links">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? "sidebar-link active"
                  : "sidebar-link"
              }
            >
              {item.icon}

              <span className="sidebar-text">
                {item.title}
              </span>
            </NavLink>
          ))}
        </div>
      </div>

      <div className="logout-container">
        <button className="logout-btn">
          <LogOut size={16} />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
}