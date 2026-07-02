import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/adminHeader";
import Sidebar from "../components/adminSidebar";
import DocHeader from "../Components/Header";
import DocSidebar from "../Components/Sidebar";
import Admin from "../Services/Admin.model";

import {
  Box,
  Paper,
  Typography,
  Avatar,
} from "@mui/material";

import "./FinalDiscussionDetails.css";

const FALLBACK_DETAILS = {
  project: {
    title: "AI Mental Health Companion",
    description: 'The "Smart Health Monitoring System" project focuses on developing an innovative solution for real-time tracking and analysis of vital health parameters. This system aims to provide individuals with comprehensive insights into their well-being, enabling proactive health management and timely interventions. It incorporates advanced sensor technology and data',
    problem_statement: "The current healthcare landscape faces challenges in continuous patient monitoring outside clinical settings, leading to delayed interventions and inefficient management",
    technologies: "Hardware: ESP32, Heart Rate & Temp Sensors.,Mobile App: Flutter (for iOS & Android).,Database: Firebase (Real-time data).,Cloud: Google Cloud (Storage & Hosting)."
  },
  team: {
    members: [
      { id: 1, name: "Mohamed Ali", image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100" },
      { id: 2, name: "Yara Tarek", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100" },
      { id: 3, name: "Farida Khaled", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100" },
      { id: 4, name: "Shahd Mostafa", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100" },
      { id: 5, name: "Ahmed Kamal", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100" },
      { id: 6, name: "Rana Saleh", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&h=100" }
    ]
  },
  supervisorsList: [
    { name: "Ahmed El-Nagar", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100" },
    { name: "Ahmed Fayez", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100" },
    { name: "Mohamed Qayed", image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=100&h=100" }
  ]
};

const projectImage = "https://images.unsplash.com/photo-1631553127988-348ecb321a48?auto=format&fit=crop&w=800&q=80";

export default function FinalDiscussionDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    getTeam();
  }, [id]);

  const getTeam = async () => {
    try {
      const res = await Admin.viewTeams(id);
      if (res && res.project) {
        setData(res);
      } else {
        setData(FALLBACK_DETAILS);
      }
    } catch (err) {
      console.warn("Failed viewTeams API, using fallback details:", err);
      setData(FALLBACK_DETAILS);
    }
  };

  if (!data) return null;

  const supervisors = data.supervisors
    ? [
        { name: data.supervisors.doctor?.name || data.supervisors.doctor?.full_name, image: "" },
        { name: data.supervisors.ta?.name || data.supervisors.ta?.full_name, image: "" }
      ].filter(s => s.name)
    : (data.supervisorsList || []);

  const pageContent = (
    <div className="discussion-details-page" style={{ padding: 0 }}>
      <div className="details-wrapper">
        {/* LEFT COLUMN */}
        <Paper className="project-card" style={{ padding: '24px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <Typography
            variant="h5"
            fontWeight={700}
            style={{ fontFamily: 'Outfit, sans-serif', color: '#1A202C', marginBottom: '16px' }}
          >
            {data.project?.title || "Untitled Project"}
          </Typography>

          <img
            src={projectImage}
            alt="Project hardware illustration"
            className="project-image"
            style={{ width: '100%', height: '340px', objectFit: 'cover', borderRadius: '8px', marginBottom: '20px' }}
          />

          <Typography className="project-description" style={{ color: '#4A5568', fontSize: '13px', lineHeight: '1.7', marginBottom: '24px', fontFamily: 'Inter, sans-serif' }}>
            {data.project?.description || "No project description provided."}
          </Typography>

          <div className="problem-section" style={{ borderTop: '1px solid #EDF2F7', paddingTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ color: '#E53E3E', fontSize: '16px', fontWeight: 'bold' }}>⚠️</span>
              <Typography fontWeight={700} style={{ fontFamily: 'Outfit, sans-serif', color: '#2D3748', fontSize: '14px' }}>
                Problem Statement
              </Typography>
            </div>

            <Typography style={{ color: '#718096', fontSize: '13px', lineHeight: '1.6', marginBottom: '16px', fontFamily: 'Inter, sans-serif' }}>
              {data.project?.problem_statement || "No problem statement defined."}
            </Typography>

            <span style={{ display: 'inline-block', background: '#E53E3E', color: '#ffffff', padding: '4px 14px', borderRadius: '14px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Critical
            </span>
          </div>
        </Paper>

        {/* RIGHT COLUMN */}
        <div className="side-section" style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Members Card */}
          <Paper className="side-card" style={{ padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <Typography
              fontWeight={700}
              style={{ fontFamily: 'Outfit, sans-serif', color: '#2D3748', fontSize: '15px', marginBottom: '16px' }}
            >
              Members
            </Typography>

            <div className="members-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {data.team?.members?.map((member) => (
                <div
                  key={member.id}
                  className="member-item"
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
                >
                  <Avatar
                    src={member.image}
                    style={{ width: '48px', height: '48px', marginBottom: '6px', border: '2px solid #E2E8F0' }}
                  />
                  <Typography
                    variant="caption"
                    style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: '#0052CC', fontWeight: '600', width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                  >
                    {member.name}
                  </Typography>
                </div>
              ))}
            </div>
          </Paper>

          {/* Supervision Card */}
          <Paper className="side-card" style={{ padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <Typography
              fontWeight={700}
              style={{ fontFamily: 'Outfit, sans-serif', color: '#2D3748', fontSize: '15px', marginBottom: '16px' }}
            >
              Supervision
            </Typography>

            <div className="members-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {supervisors.map((sup, idx) => (
                <div
                  key={idx}
                  className="member-item"
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
                >
                  <Avatar
                    src={sup.image}
                    style={{ width: '48px', height: '48px', marginBottom: '6px', border: '2px solid #E2E8F0' }}
                  />
                  <Typography
                    variant="caption"
                    style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: '#0052CC', fontWeight: '600', width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                  >
                    {sup.name}
                  </Typography>
                </div>
              ))}
            </div>
          </Paper>

          {/* Tech Stack Card */}
          <Paper className="side-card" style={{ padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <Typography
              fontWeight={700}
              style={{ fontFamily: 'Outfit, sans-serif', color: '#2D3748', fontSize: '15px', marginBottom: '16px' }}
            >
              Tech Stack
            </Typography>

            {data.project?.technologies
              ?.split(",")
              .map((tech, idx) => {
                const parts = tech.split(":");
                if (parts.length > 1) {
                  return (
                    <Typography
                      key={idx}
                      style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#4A5568', marginBottom: '10px', lineHeight: '1.5' }}
                    >
                      <strong style={{ color: '#0052CC' }}>{parts[0].trim()}:</strong>{parts.slice(1).join(":").trim()}
                    </Typography>
                  );
                }
                return (
                  <Typography
                    key={idx}
                    style={{ fontFamily: 'Inter, sans-serif', fontSize: '12px', color: '#4A5568', marginBottom: '8px' }}
                  >
                    • {tech.trim()}
                  </Typography>
                );
              })}
          </Paper>
        </div>
      </div>
    </div>
  );

  if (isAdmin) {
    return (
      <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }}>
        <Sidebar />
        <div className="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Header />
          <div style={{ padding: '24px' }}>
            {pageContent}
          </div>
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
        <main className="doctor-layout-main" style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {pageContent}
        </main>
      </div>
    </div>
  );
}