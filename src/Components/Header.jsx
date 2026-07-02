import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CheckCircle2, ChevronLeft, Menu, Search, Upload, UserCircle, Zap } from "lucide-react";
import { useProfile } from "../context/ProfileContext";
import logo from "../assets/logo2.png";

const headerCss = `
.doctor-header {
  position: relative;
  z-index: 50;
  display: flex;
  height: 64px;
  flex: 0 0 64px;
  align-items: center;
  justify-content: space-between;
  background: #1A2E4C;
  color: #ffffff;
  padding: 0 24px;
  box-sizing: border-box;
}

.doctor-header-left,
.doctor-header-right,
.doctor-profile {
  display: flex;
  align-items: center;
}

.doctor-header-left {
  min-width: 0;
  gap: 16px;
}

.doctor-header-logo {
  width: auto;
  height: 40px;
  object-fit: contain;
}

.doctor-menu-button,
.doctor-bell-button {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  background: transparent;
  color: #ffffff;
  cursor: pointer;
}

.doctor-menu-button {
  width: 24px;
  height: 24px;
}

.doctor-search {
  position: relative;
  width: 320px;
  height: 36px;
}

.doctor-search-icon {
  position: absolute;
  top: 50%;
  left: 10px;
  z-index: 1;
  color: #4b5563;
  transform: translateY(-50%);
}

.doctor-search input {
  width: 100%;
  height: 100%;
  border: 1px solid #e4e4e4;
  border-radius: 8px;
  background: #ffffff;
  color: #303846;
  font-size: 14px;
  font-weight: 500;
  outline: none;
  padding: 0 16px 0 36px;
  box-sizing: border-box;
}

.doctor-header-right {
  gap: 24px;
}

.doctor-bell-button {
  position: relative;
  width: 28px;
  height: 28px;
}

.doctor-bell-dot {
  position: absolute;
  top: 0px;
  right: 2px;
  width: 14px;
  height: 14px;
  border-radius: 999px;
  background: #ef4444;
  color: #ffffff;
  font-size: 9px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #1A2E4C;
}

.doctor-profile {
  gap: 12px;
}

.doctor-avatar {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  object-fit: cover;
}

.doctor-profile-name {
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
}

.doctor-notification-backdrop {
  position: fixed;
  z-index: 90;
  inset: 64px 0 0 256px;
  background: rgba(0, 0, 0, 0.35);
  animation: doctorBackdropIn 220ms ease-out both;
}

.doctor-notification-panel {
  position: absolute;
  top: 0;
  right: 0;
  width: 390px;
  height: 100%;
  overflow-y: auto;
  background: #ffffff;
  color: #202124;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.25);
  animation: doctorPanelIn 320ms cubic-bezier(0.22, 1, 0.36, 1) both;
  will-change: transform, opacity;
}

.doctor-notification-backdrop.closing {
  pointer-events: none;
  animation: doctorBackdropOut 220ms ease-in both;
}

.doctor-notification-backdrop.closing .doctor-notification-panel {
  animation: doctorPanelOut 260ms cubic-bezier(0.4, 0, 0.2, 1) both;
}

.doctor-notification-heading {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px 20px 0;
}

.doctor-notification-heading button {
  border: 0;
  background: transparent;
  cursor: pointer;
}

.doctor-notification-heading h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
}

.doctor-notification-tabs {
  display: flex;
  gap: 32px;
  margin-top: 24px;
  border-bottom: 1px solid #e0e0e0;
  padding: 0 58px;
  color: #777777;
  font-size: 12px;
  font-weight: 500;
}

.doctor-notification-tabs button {
  border: 0;
  background: transparent;
  color: inherit;
  padding: 0 0 12px;
  cursor: pointer;
}

.doctor-notification-tabs button:first-child {
  border-bottom: 2px solid #f15b5b;
  color: #f15b5b;
}

.doctor-notification-list {
  padding: 0 20px;
}

.doctor-notification-item {
  border-bottom: 1px solid #e4e4e4;
  padding: 12px 0;
}

.doctor-notification-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.doctor-notification-avatar,
.doctor-notification-icon {
  width: 32px;
  height: 32px;
  flex: 0 0 32px;
  border-radius: 999px;
}

.doctor-notification-avatar {
  object-fit: cover;
}

.doctor-notification-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
}

.doctor-notification-copy {
  min-width: 0;
  flex: 1;
}

.doctor-notification-copy p {
  margin: 0;
}

.doctor-notification-title {
  color: #202124;
  font-size: 11px;
  font-weight: 600;
  line-height: 1.35;
}

.doctor-notification-detail {
  margin-left: 4px;
  color: #2f64d6;
}

.doctor-notification-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.doctor-notification-actions button {
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  padding: 4px 12px;
  cursor: pointer;
}

.doctor-notification-accept {
  border: 0;
  background: #f26b6b;
  color: #ffffff;
}

.doctor-notification-reject {
  border: 1px solid #d6d6d6;
  background: #ffffff;
  color: #555555;
}

.doctor-notification-time {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
  color: #8b8b8b;
  font-size: 10px;
}

@media (max-width: 760px) {
  .doctor-search {
    width: 220px;
  }

  .doctor-profile-name {
    display: none;
  }

  .doctor-notification-backdrop {
    left: 72px;
  }

  .doctor-notification-panel {
    width: min(390px, 100%);
  }
}

@keyframes doctorBackdropIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes doctorBackdropOut {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}

@keyframes doctorPanelIn {
  from {
    opacity: 0.85;
    transform: translateX(100%) scale(0.985);
  }
  to {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
}

@keyframes doctorPanelOut {
  from {
    opacity: 1;
    transform: translateX(0) scale(1);
  }
  to {
    opacity: 0.85;
    transform: translateX(100%) scale(0.985);
  }
}
`;

const profilePhoto =
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80";

const notifications = [
  {
    avatar: profilePhoto,
    title: "Dennis Nedry requested to join your team",
    detail: "( Data analysis )",
    time: "Last Wednesday at 9:42 AM",
    actions: true,
  },
  {
    initials: "DN",
    color: "#1e88e5",
    title: "Dennis Nedry leaved a note",
    time: "Last Wednesday at 9:42 AM",
  },
  {
    icon: Zap,
    color: "#eef1f5",
    title:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    time: "Last Wednesday at 9:42 AM",
  },
  {
    icon: Upload,
    color: "#eef1f5",
    title: "Your Task has been uploaded",
    time: "Last Wednesday at 9:42 AM",
  },
  {
    avatar: profilePhoto,
    title: "Dennis Nedry rejected to join your team",
    detail: "( AI )",
    time: "Last Wednesday at 9:42 AM",
  },
  {
    icon: Zap,
    color: "#eef1f5",
    title: "Your Project Idea has been accepted",
    time: "Last Wednesday at 9:42 AM",
    accepted: true,
  },
];

function Header() {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isClosingNotifications, setIsClosingNotifications] = useState(false);
  const closeTimerRef = useRef(null);
  const { profileName, profileImage } = useProfile();
  const avatar = profileImage || profilePhoto;

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const openNotifications = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
    setIsClosingNotifications(false);
    setShowNotifications(true);
  };

  const closeNotifications = () => {
    if (!showNotifications || isClosingNotifications) return;

    setIsClosingNotifications(true);
    closeTimerRef.current = setTimeout(() => {
      setShowNotifications(false);
      setIsClosingNotifications(false);
      closeTimerRef.current = null;
    }, 260);
  };

  return (
    <>
      <style>{headerCss}</style>
      <header className="doctor-header">
        <div className="doctor-header-left">
          <img src={logo} alt="Logo" className="doctor-header-logo" />
          <button className="doctor-menu-button" aria-label="Toggle menu">
            <Menu size={18} strokeWidth={2.4} />
          </button>

          <div className="doctor-search">
            <Search className="doctor-search-icon" size={14} />
            <input type="text" placeholder="Search Projects or Students" />
          </div>
        </div>

        <div className="doctor-header-right">
          <button
            type="button"
            onClick={openNotifications}
            className="doctor-bell-button"
            aria-label="Open notifications"
          >
            <Bell size={20} strokeWidth={2.2} />
            <span className="doctor-bell-dot">1</span>
          </button>

          <div 
            className="doctor-profile" 
            onClick={() => navigate("/doctor/edit-profile")}
            style={{ cursor: 'pointer' }}
          >
            {avatar ? (
              <img src={avatar} alt={profileName || "Ahmed Khaled"} className="doctor-avatar" />
            ) : (
              <UserCircle size={32} />
            )}
            <span className="doctor-profile-name">{profileName || "Ahmed Khaled"}</span>
          </div>
        </div>
      </header>

      {showNotifications && (
        <div
          className={`doctor-notification-backdrop${isClosingNotifications ? " closing" : ""}`}
          onClick={closeNotifications}
        >
          <NotificationPanel onClose={closeNotifications} />
        </div>
      )}
    </>
  );
}

function NotificationPanel({ onClose }) {
  return (
    <aside className="doctor-notification-panel" onClick={(event) => event.stopPropagation()}>
      <div className="doctor-notification-heading">
        <button type="button" onClick={onClose} aria-label="Close notifications">
          <ChevronLeft size={21} strokeWidth={2.5} />
        </button>
        <h2>Notifications</h2>
      </div>

      <div className="doctor-notification-tabs">
        <button>All</button>
        <button>Unread</button>
        <button>Read</button>
      </div>

      <div className="doctor-notification-list">
        {notifications.map((item, index) => (
          <NotificationItem key={`${item.title}-${index}`} item={item} />
        ))}
      </div>
    </aside>
  );
}

function NotificationItem({ item }) {
  const Icon = item.icon;

  return (
    <div className="doctor-notification-item">
      <div className="doctor-notification-row">
        {item.avatar ? (
          <img src={item.avatar} alt="" className="doctor-notification-avatar" />
        ) : item.initials ? (
          <div
            className="doctor-notification-icon"
            style={{ background: item.color, color: "#ffffff", fontSize: 11, fontWeight: 700 }}
          >
            {item.initials}
          </div>
        ) : (
          <div className="doctor-notification-icon" style={{ background: item.color }}>
            <Icon size={17} />
          </div>
        )}

        <div className="doctor-notification-copy">
          <p className="doctor-notification-title">
            {item.title}
            {item.detail && <span className="doctor-notification-detail">{item.detail}</span>}
          </p>

          {item.actions && (
            <div className="doctor-notification-actions">
              <button className="doctor-notification-accept">Accept</button>
              <button className="doctor-notification-reject">Reject</button>
            </div>
          )}

          <div className="doctor-notification-time">
            <span>{item.time}</span>
            {item.accepted && <CheckCircle2 size={15} color="#22c55e" />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
