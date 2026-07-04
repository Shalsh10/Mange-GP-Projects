import React, { useState, useEffect, useRef } from "react";
import DocHeader from "../Components/Header";
import DocSidebar from "../Components/Sidebar";
import { 
  Send, 
  Plus, 
  FileText, 
  Link2, 
  Users, 
  TrendingUp, 
  Search,
  CheckCheck
} from "lucide-react";
import toast from "react-hot-toast";
import "./CommunityChat.css";

// Premium mock data for teams and their respective chats
const INITIAL_TEAMS_DATA = [
  {
    id: "A",
    name: "Team A",
    title: "Smart Health Monitoring System",
    unread: 0,
    members: [
      { name: "Jav", role: "Engineering", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80", active: true },
      { name: "Aubrey", role: "Product", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80", active: true },
      { name: "Janet", role: "Engineering", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80", active: true },
      { name: "Marc", role: "Design", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80", active: false },
    ],
    sharedLinks: [
      { type: "figma", label: "Figma Design System (Project Prototype)", url: "https://figma.com" },
      { type: "github", label: "GitHub Repository (Front-end Source Code)", url: "https://github.com" },
      { type: "docs", label: "Research Paper Draft (Google Docs)", url: "https://docs.google.com" }
    ],
    messages: [
      { id: 1, sender: "doctor", text: "Hi team 👋", time: "11:31 AM", isDoctor: true },
      { id: 2, sender: "doctor", text: "Anyone on for lunch today?", time: "11:31 AM", isDoctor: true },
      { id: 3, sender: "Jav", role: "Engineering", text: "I'm down! Any ideas??", time: "11:35 AM", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" },
      { id: 4, sender: "doctor", text: "I am down for whatever!", time: "11:36 AM", isDoctor: true },
      { id: 5, sender: "Aubrey", role: "Product", text: "I was thinking the cafe downtown", time: "11:45 AM", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" },
      { id: 6, sender: "Aubrey", role: "Product", text: "But limited vegan options @Janet!", time: "11:46 AM", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" },
      { id: 7, sender: "doctor", text: "Agreed", time: "11:52 AM", isDoctor: true },
      { id: 8, sender: "Janet", role: "Engineering", text: "That works- I was actually planning to get a smoothie anyways 👍", time: "12:03 PM", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" },
      { id: 9, sender: "Janet", role: "Product", text: "On for 12:30 PM then?", time: "12:04 PM", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" },
    ]
  },
  {
    id: "B",
    name: "Team B",
    title: "Blockchain-based Certificate System",
    unread: 28,
    members: [
      { name: "Ali", role: "Blockchain", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80", active: true },
      { name: "Sara", role: "Frontend", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80", active: false }
    ],
    sharedLinks: [
      { type: "github", label: "Smart Contracts Repo", url: "https://github.com" }
    ],
    messages: [
      { id: 1, sender: "Ali", role: "Blockchain", text: "Dr. Mohammed, we have deployed the contracts to Sepolia testnet!", time: "09:15 AM", avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&q=80" }
    ]
  },
  {
    id: "C",
    name: "Team C",
    title: "VR Career Simulator",
    unread: 0,
    members: [
      { name: "Kareem", role: "Unity Dev", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80", active: true },
      { name: "Hoda", role: "3D Artist", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80", active: true }
    ],
    sharedLinks: [
      { type: "figma", label: "VR Storyboard & Assets", url: "https://figma.com" }
    ],
    messages: [
      { id: 1, sender: "doctor", text: "How is the progress on the hospital environment?", time: "Yesterday", isDoctor: true }
    ]
  },
  {
    id: "D",
    name: "Team D",
    title: "IoT Smart Campus Platform",
    unread: 0,
    members: [
      { name: "Wael", role: "Hardware", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80", active: false }
    ],
    sharedLinks: [],
    messages: []
  },
  {
    id: "E",
    name: "Team E",
    title: "AI Attendance Recognition",
    unread: 32,
    members: [
      { name: "Mona", role: "AI Engineer", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80", active: true }
    ],
    sharedLinks: [],
    messages: [
      { id: 1, sender: "Mona", role: "AI Engineer", text: "We updated the facial recognition model to 98% accuracy.", time: "2 days ago", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" }
    ]
  }
];

import { useSearchParams } from "react-router-dom";

export default function CommunityChat() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTeamId = searchParams.get("teamId") || "A";

  const [teamsData, setTeamsData] = useState(INITIAL_TEAMS_DATA);
  const [messageInput, setMessageInput] = useState("");
  const [selectedPoll, setSelectedPoll] = useState("");
  const messagesEndRef = useRef(null);

  const activeTeam = teamsData.find(t => t.id === activeTeamId) || teamsData[0];

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeTeam.messages]);

  // Clear unread count on team select
  useEffect(() => {
    setTeamsData(prev => prev.map(t => t.id === activeTeamId ? { ...t, unread: 0 } : t));
  }, [activeTeamId]);

  // Handle sending a new message
  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (!messageInput.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: "doctor",
      text: messageInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isDoctor: true
    };

    setTeamsData(prev => prev.map(t => {
      if (t.id === activeTeamId) {
        return {
          ...t,
          messages: [...t.messages, newMsg]
        };
      }
      return t;
    }));
    setMessageInput("");
  };

  return (
    <>
      <DocHeader />
      <div className="chat-container">
        <DocSidebar />
        
        <div className="chat-main-wrap">
          {/* Active Team Header Bar */}
          <div className="chat-header-bar">
            <div className="chat-header-left">
              <h2>{activeTeam.name} - {activeTeam.title}</h2>
            </div>
            <button className="chat-progress-btn" onClick={() => toast.success("Opening Team Progress Dashboard...")}>
              View Team Progress
            </button>
          </div>

          <div className="chat-body-layout">
            
            {/* MIDDLE CHAT VIEWPORT */}
            <div className="chat-viewport">
              {/* Online members list */}
              <div className="chat-members-row">
                {activeTeam.members.map((m, index) => (
                  <div key={index} className="chat-member-avatar-wrapper">
                    <img src={m.avatar} alt={m.name} className="chat-member-avatar" />
                    {m.active && <span className="chat-status-dot"></span>}
                  </div>
                ))}
              </div>

              {/* Chat Message Scroll Area */}
              <div className="chat-messages-scroll">
                <div className="chat-date-divider">
                  <span>Today</span>
                </div>

                {activeTeam.messages.length === 0 ? (
                  <div className="chat-empty-feed">
                    <p>No messages yet. Say hello to start the discussion!</p>
                  </div>
                ) : (
                  activeTeam.messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`chat-message-row ${msg.isDoctor ? "doctor-right" : "student-left"}`}
                    >
                      {!msg.isDoctor && (
                        <img src={msg.avatar} alt={msg.sender} className="chat-msg-avatar" />
                      )}

                      <div className="chat-msg-bubble-wrap">
                        {!msg.isDoctor && (
                          <span className="chat-msg-sender-meta">
                            {msg.sender} <span className="chat-msg-role">{msg.role}</span>
                          </span>
                        )}
                        <div className="chat-msg-bubble">
                          <p>{msg.text}</p>
                          <div className="chat-msg-time-status">
                            <span>{msg.time}</span>
                            {msg.isDoctor && <CheckCheck size={13} className="chat-double-check" />}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Box */}
              <form onSubmit={handleSendMessage} className="chat-input-bar">
                <button type="button" className="chat-attach-btn" onClick={() => toast.success("Attachments feature coming soon!")}>
                  <Plus size={20} />
                </button>
                <input 
                  type="text" 
                  placeholder="When we gonna meet?" 
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="chat-input-field"
                />
                <button type="submit" className="chat-send-btn">
                  <Send size={16} />
                </button>
              </form>
            </div>

            {/* RIGHT SIDEBAR: SHARED LINKS & QUICK POLL */}
            <div className="chat-right-sidebar">
              {/* Shared Files & Links */}
              <div className="chat-right-card">
                <h3>Shared Files & Links</h3>
                <div className="chat-shared-list">
                  {activeTeam.sharedLinks.length === 0 ? (
                    <p className="chat-empty-subtext">No shared links yet.</p>
                  ) : (
                    activeTeam.sharedLinks.map((link, idx) => (
                      <a 
                        key={idx} 
                        href={link.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="chat-shared-item"
                      >
                        {link.type === "figma" && <Link2 size={14} className="shared-icon figma" />}
                        {link.type === "github" && <Link2 size={14} className="shared-icon github" />}
                        {link.type === "docs" && <FileText size={14} className="shared-icon docs" />}
                        <span>{link.label}</span>
                      </a>
                    ))
                  )}
                </div>
              </div>

              {/* Quick Poll */}
              <div className="chat-right-card">
                <h3>Quick Poll</h3>
                <div className="chat-poll-wrap">
                  <h4 className="chat-poll-question">Preferred meeting time?</h4>
                  <div className="chat-poll-options">
                    {["Monday AM", "Tuesday PM", "Friday AM"].map((option) => (
                      <label 
                        key={option} 
                        className={`chat-poll-option ${selectedPoll === option ? "selected" : ""}`}
                      >
                        <input 
                          type="radio" 
                          name="poll-option" 
                          value={option}
                          checked={selectedPoll === option}
                          onChange={() => {
                            setSelectedPoll(option);
                            toast.success(`Voted for ${option}! 🗳️`);
                          }}
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </>
  );
}
