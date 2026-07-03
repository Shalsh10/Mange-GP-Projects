import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/adminHeader";
import Sidebar from "../components/adminSidebar";
import DocHeader from "../Components/Header";
import DocSidebar from "../Components/Sidebar";
import Admin from "../Services/Admin.model";
import { SupervisorService } from "../Services/SupervisorServices";

import {
  Box,
  Paper,
  Typography,
  Avatar,
} from "@mui/material";

import "./FinalDiscussionDetails.css";

const getImageUrl = (path) => {
  if (!path) return "https://images.unsplash.com/photo-1631553127988-348ecb321a48?auto=format&fit=crop&w=800&q=80";
  if (path.startsWith("http")) return path;
  return `https://mango-attendant-handyman.ngrok-free.dev${path.startsWith("/") ? "" : "/"}${path}`;
};

export default function FinalDiscussionDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [noData, setNoData] = useState(false);

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    getTeam();
  }, [id]);

  const getTeam = async () => {
    // Guard: don't call API if id is invalid
    if (!id || id === 'undefined') {
      console.warn("[FinalDiscussionDetails] id is undefined, skipping API call");
      setNoData(true);
      return;
    }

    try {
      let res;
      if (isAdmin) {
        res = await Admin.viewTeams(id);
      } else {
        // Use supervisor endpoint
        res = await SupervisorService.showDefenseCommittee(id);
      }

      console.log("[Debug] Defense committee response:", res);

      if (res && (res.project || res.team || res.committee || res.data)) {
        setData(res.data ?? res);
      } else if (res && typeof res === 'object' && Object.keys(res).length > 0) {
        // API returned something — use it directly
        setData(res);
      } else {
        setNoData(true);
      }
    } catch (err) {
      console.warn("Failed to load defense committee details:", err);
      setNoData(true);
    }
  };


  if (!data && !noData) return null;

  if (noData) {
    // Show no data message in appropriate layout
    const emptyContent = (
      <div style={{ padding: '40px', textAlign: 'center', color: '#A0AEC0', fontFamily: 'Inter, sans-serif' }}>
        No details available for this committee.
      </div>
    );
    if (isAdmin) {
      return (
        <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }}>
          <Sidebar />
          <div className="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Header />{emptyContent}
          </div>
        </div>
      );
    }
    return (
      <div className="doctor-layout-wrapper" style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: '#F7F9FB' }}>
        <DocHeader />
        <div className="doctor-layout-body" style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <DocSidebar />
          <main className="doctor-layout-main" style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>{emptyContent}</main>
        </div>
      </div>
    );
  }

  const supervisors = (() => {
    const committeeMembers = data.defense_committee_members ?? data.committee_members;
    if (committeeMembers) {
      const docs = Array.isArray(committeeMembers.doctors)
        ? committeeMembers.doctors.map(d => ({ name: d.name || d.full_name, image: getImageUrl(d.profile_image) }))
        : [];
      const tas = Array.isArray(committeeMembers.teaching_assistants)
        ? committeeMembers.teaching_assistants.map(t => ({ name: t.name || t.full_name, image: getImageUrl(t.profile_image) }))
        : [];
      return [...docs, ...tas].filter(s => s.name);
    }
    if (data.supervisors) {
      return [
        { name: data.supervisors.doctor?.name || data.supervisors.doctor?.full_name, image: "" },
        { name: data.supervisors.ta?.name || data.supervisors.ta?.full_name, image: "" }
      ].filter(s => s.name);
    }
    return data.supervisorsList || [];
  })();



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
            src={getImageUrl(data.project?.image_url)}
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
              {data.team?.members && data.team.members.length > 0 ? (
                data.team.members.map((member) => (
                  <div
                    key={member.id}
                    className="member-item"
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
                  >
                    <Avatar
                      src={getImageUrl(member.profile_image || member.image)}
                      style={{ width: '48px', height: '48px', marginBottom: '6px', border: '2px solid #E2E8F0' }}
                    />
                    <Typography
                      variant="caption"
                      style={{ fontFamily: 'Inter, sans-serif', fontSize: '10px', color: '#0052CC', fontWeight: '600', width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                    >
                      {member.name || member.full_name}
                    </Typography>
                  </div>
                ))
              ) : (
                <Typography variant="caption" style={{ color: '#718096', gridColumn: 'span 3', textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>
                  {data.team?.members_count ? `${data.team.members_count} Member(s)` : "No member details listed"}
                </Typography>
              )}
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

            {data.project?.technologies ? (
              data.project.technologies
                .split(",")
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
                })
            ) : (
              <Typography variant="caption" style={{ color: '#718096', fontFamily: 'Inter, sans-serif' }}>
                No tech stack details provided.
              </Typography>
            )}
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