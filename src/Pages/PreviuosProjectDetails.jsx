import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FaArrowLeft,
  FaDownload,
  FaShareAlt,
  FaFolderOpen,
  FaGithub,
  FaExclamationTriangle,
  FaStar,
  FaTimes
} from "react-icons/fa";
import DocHeader from "../Components/Header";
import DocSidebar from "../Components/Sidebar";
import Header from "../components/adminHeader";
import Sidebar from "../components/adminSidebar";
import { StudentNavbar } from "../Components/StudentNavbar";
import Project from "../Services/Project.model";
import projectImage from "../assets/motherboard_project.png";
import "./PreviuosProjectDetails.css";

const FALLBACK_DETAILS = {
  id: 2,
  title: "AI Mental Health Companion",
  year: 2024,
  description: 'The "Smart Health Monitoring System" project focuses on developing an innovative solution for real-time tracking and analysis of vital health parameters. This system aims to provide individuals with comprehensive insights into their well-being, enabling proactive health management and timely interventions. It incorporates advanced sensor technology and data analytics to deliver accurate and actionable health data directly to users and, with consent, to healthcare providers.',
  problem_statement: "The current healthcare landscape faces challenges in continuous patient monitoring outside clinical settings, leading to delayed interventions and inefficient management",
  grade: 92,
  feedback: {
    text: "Excellent work on the design system! The color palette is cohesive and accessible, meeting WCAG standards. The component library is well-documented with clear usage examples. Minor improvement needed in the responsive behavior of some components. Overall, this is a solid foundation for the company's design needs",
    graded_by: "Ahmed El-naggar",
    date: "November 16, 2024"
  },
  technologies: "Hardware: ESP32, Heart Rate & Temp Sensors.,Mobile App: Flutter (for iOS & Android).,Database: Firebase (Real-time data).,Cloud: Google Cloud (Storage & Hosting).",
  team: {
    members: [
      { id: 1, name: "Mohamed Ali", image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100" },
      { id: 2, name: "Yara Tarek", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100" },
      { id: 3, name: "Farida Khaled", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100" },
      { id: 4, name: "Shahd Mostafa", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100" },
      { id: 5, name: "Ahmed Kamal", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100" },
      { id: 6, name: "Rana Saleh", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&h=100" }
    ],
    supervisors: [
      { id: 10, name: "Ahmed El-Nagar", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100" },
      { id: 11, name: "Ahmed Fayez", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100" },
      { id: 12, name: "Mohamed Qayed", image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=100&h=100" }
    ]
  }
};

export default function PreviuosProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareTarget, setShareTarget] = useState("All Teams");

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const role = (user?.role || user?.role_code || "").toLowerCase();
  const isAdmin = role === "admin";
  const isDoctor = role === "doctor" || role === "supervisor" || role === "doctor/supervisor" || role === "doctor_supervisor";
  const isStudent = role === "student" || !user || (!isAdmin && !isDoctor);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await Project.getProjectDetails(id);
        if (response && response.title) {
          setProject(response);
        } else {
          setProject(FALLBACK_DETAILS);
        }
      } catch (error) {
        console.warn("Failed loading project details, using mock fallback:", error);
        setProject(FALLBACK_DETAILS);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (!project) return <div className="loading">No Project Found</div>;

  const handleShareSubmit = () => {
    toast.success(`Project shared successfully with ${shareTarget}! 🚀`);
    setShowShareModal(false);
  };

  const projectDetailsContent = (
    <div className="details-page">
      {/* LEFT SIDE */}
      <div className="details-left">
        <div className="details-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <FaArrowLeft />
          </button>

          <div className="title-box">
            <h2>{project.title}</h2>
            <span>{project.year}</span>
          </div>

          <a
            href={project.attachment_file || "#"}
            onClick={(e) => project.attachment_file ? null : e.preventDefault()}
            className="download-btn"
          >
            <FaDownload />
          </a>
        </div>

        {/* IMAGE */}
        <img
          src={projectImage}
          alt={project.title}
          className="project-image"
        />

        {/* DESCRIPTION */}
        <p className="project-description">
          {project.description}
        </p>

        {/* PROBLEM */}
        <div className="problem-box">
          <div className="problem-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaExclamationTriangle style={{ color: '#E53E3E', fontSize: '14px' }} />
            <h4 style={{ margin: 0, fontFamily: 'Outfit, sans-serif', fontWeight: 700 }}>Problem Statement</h4>
          </div>
          <p style={{ marginTop: '8px' }}>{project.problem_statement}</p>
          
          {/* Critical button premium styling */}
          <span 
            className="critical-badge"
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              background: '#FFF5F5', 
              color: '#E53E3E', 
              border: '1px solid #FEB2B2', 
              padding: '6px 16px', 
              borderRadius: '20px', 
              fontSize: '11px', 
              fontWeight: '700', 
              textTransform: 'uppercase', 
              letterSpacing: '0.5px', 
              marginTop: '12px', 
              fontFamily: 'Outfit, sans-serif' 
            }}
          >
            Critical
          </span>
        </div>

        {/* GRADE */}
        <div className="grade-box" style={{ borderTop: '1px solid #EDF2F7', paddingTop: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <FaStar style={{ color: '#ECC94B' }} />
            <h4 style={{ margin: 0, fontFamily: 'Outfit, sans-serif', fontWeight: 700 }}>Grade</h4>
          </div>
          <span className="final-score">Final Score</span>
          <div className="grade-score" style={{ color: '#0052CC', fontWeight: '800' }}>{project.grade}%</div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${project.grade}%`,
                background: '#0052CC'
              }}
            ></div>
          </div>
        </div>

        {/* FEEDBACK */}
        <div className="feedback-box" style={{ marginTop: '26px' }}>
          <h4 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700 }}>Feedback</h4>
          <p>{project.feedback?.text || "No Feedback Yet"}</p>
          <div className="feedback-footer">
            <span>
              Graded By: {project.feedback?.graded_by || "-"}
            </span>
            <span>{project.feedback?.date || "November 16, 2024"}</span>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="details-right">
        {/* RESOURCES */}
        <div className="side-card">
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700 }}>Resources</h3>
          <a href="#doc" style={{ color: '#0052CC' }}>
            <FaFolderOpen />
            Documentation
          </a>
          <a href="#code" style={{ color: '#0052CC' }}>
            <FaGithub />
            Source Code
          </a>
        </div>

        {/* MEMBERS */}
        <div className="side-card">
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700 }}>Members</h3>
          <div className="members-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {project.team?.members?.map((member) => (
              <div className="member-item" key={member.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img
                  src={member.image}
                  alt={member.name}
                  style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #E2E8F0' }}
                />
                <span style={{ fontSize: '10px', color: '#0052CC', fontWeight: '600', width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '6px' }}>
                  {member.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* SUPERVISION */}
        <div className="side-card">
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700 }}>Supervision</h3>
          <div className="members-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {project.team?.supervisors?.map((supervisor) => (
              <div className="member-item" key={supervisor.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img
                  src={supervisor.image}
                  alt={supervisor.name}
                  style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #E2E8F0' }}
                />
                <span style={{ fontSize: '10px', color: '#0052CC', fontWeight: '600', width: '100%', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '6px' }}>
                  {supervisor.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* TECH STACK */}
        <div className="side-card">
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700 }}>Tech Stack</h3>
          <ul className="tech-list" style={{ paddingLeft: '16px', margin: 0 }}>
            {project.technologies?.split(",").map((tech, index) => {
              const parts = tech.split(":");
              if (parts.length > 1) {
                return (
                  <li key={index} style={{ fontSize: '12px', color: '#4A5568', marginBottom: '8px' }}>
                    <strong style={{ color: '#0052CC' }}>{parts[0].trim()}:</strong>{parts.slice(1).join(":").trim()}
                  </li>
                );
              }
              return (
                <li key={index} style={{ fontSize: '12px', color: '#4A5568', marginBottom: '8px' }}>
                  {tech.trim()}
                </li>
              );
            })}
          </ul>
        </div>

        {/* SHARE */}
        <button
          className="share-btn"
          onClick={() => setShowShareModal(true)}
          style={{
            background: '#0052CC',
            fontWeight: '700',
            fontSize: '13px',
            borderRadius: '8px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            border: 'none',
            color: '#ffffff',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          <FaShareAlt />
          Share with Team
        </button>
      </div>

      {/* Share Modal overlay */}
      {showShareModal && (
        <div style={{ position: 'fixed', left: 0, top: 0, right: 0, bottom: 0, zIndex: 1000, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#ffffff', borderRadius: '12px', width: '480px', padding: '24px', boxSizing: 'border-box', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', position: 'relative' }}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1A202C' }}>
                <FaShareAlt />
                <h3 style={{ margin: 0, fontFamily: 'Outfit, sans-serif', fontSize: '16px', fontWeight: 700 }}>
                  Share Project
                </h3>
              </div>
              <button onClick={() => setShowShareModal(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#718096' }}>
                <FaTimes size={18} />
              </button>
            </div>

            <div style={{ borderTop: '1px solid #EDF2F7', paddingTop: '16px', marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#4A5568', marginBottom: '8px' }}>
                Send to
              </label>
              <select
                value={shareTarget}
                onChange={(e) => setShareTarget(e.target.value)}
                style={{
                  width: '100%',
                  height: '40px',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  background: '#F8FAFC',
                  padding: '0 12px',
                  boxSizing: 'border-box',
                  fontSize: '13px',
                  color: '#2D3748',
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="All Teams">All Teams</option>
                <option value="Team CS-01">Team CS-01</option>
                <option value="Team AI-02">Team AI-02</option>
                <option value="Team IS-03">Team IS-03</option>
              </select>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowShareModal(false)}
                style={{
                  height: '36px',
                  padding: '0 16px',
                  border: '1px solid #E2E8F0',
                  borderRadius: '6px',
                  background: '#ffffff',
                  color: '#4A5568',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleShareSubmit}
                style={{
                  height: '36px',
                  padding: '0 20px',
                  border: 'none',
                  borderRadius: '6px',
                  background: '#0052CC',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer'
                }}
              >
                Share
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (isAdmin) {
    return (
      <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }}>
        <Sidebar />
        <div className="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Header />
          <div style={{ padding: '24px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              {projectDetailsContent}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Doctor/Supervisor view: has top doctor bar (DocHeader) and doctor sidebar (DocSidebar)
  if (isDoctor) {
    return (
      <div className="doctor-layout-wrapper" style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: '#F7F9FB' }}>
        <DocHeader />
        <div className="doctor-layout-body" style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <DocSidebar />
          <main className="doctor-layout-main" style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
              {projectDetailsContent}
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Student view: renders StudentNavbar at the top, and centered page content below
  return (
    <div className="project-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#F3F4F6' }}>
      <StudentNavbar />
      <div style={{ flex: 1, padding: '24px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {projectDetailsContent}
        </div>
      </div>
    </div>
  );
}