import { useEffect, useState } from "react";
import { 
  FaSearch, 
  FaBell, 
  FaFilter,
  FaRegFilePdf,
  FaTag,
  FaTimes
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import Requests from "../Services/Requests.model";
import logo from "../assets/logo2.png";
import Sidebar from "../Components/Sidebar";

// Mock requests representing the exact target screens from the mockup
const MOCK_REQUESTS = [
  {
    id: "fb1",
    status: "pending",
    project: {
      title: "Smart Farming System",
      description: "An innovative agricultural solution that utilizes IoT sensors to monitor soil moisture, temperature, and pH levels in real-time. The system automatically controls irrigation pumps through a mobile app to optimize water consumption and improve crop yield using automated data analysis.",
      proposal_file: "Smart_Farming_Proposal.pdf",
      category: "IoT & Embedded Systems"
    },
    team: {
      name: "Smart Farming Team",
      department_id: 1,
      department_name: "CS Department",
      members_count: 6
    },
    requested_at: "Jan 30, 2025"
  },
  {
    id: "fb2",
    status: "pending",
    project: {
      title: "SecurePass: AI Detection",
      description: "A comprehensive security platform designed to protect corporate networks from sophisticated cyber attacks. The system uses advanced Artificial Intelligence to analyze network traffic patterns and detect anomalies or potential threats in real-time, providing an automated response to...",
      proposal_file: "SecurePass_Architecture_Proposal.pdf",
      category: "Cybersecurity & Networking"
    },
    team: {
      name: "SecurePass Team",
      department_id: 5,
      department_name: "Cybersecurity Department",
      members_count: 6
    },
    requested_at: "Jan 30, 2025"
  },
  {
    id: "fb3",
    status: "accepted",
    project: {
      title: "Smart Logistics",
      description: "An AI-powered system for shipment tracking and delivery prediction to reduce transportation costs. An AI-powered system.",
      proposal_file: "Logistics_System.pdf",
      category: "Supply Chain & AI"
    },
    team: {
      name: "Logistics Team",
      department_id: 6,
      department_name: "AI Department",
      members_count: 6
    },
    requested_at: "Jan 30, 2025"
  },
  {
    id: "fb4",
    status: "accepted",
    project: {
      title: "TeleMed App",
      description: "A remote medical consultation platform connecting patients with doctors, featuring appointment scheduling and e-prescriptions.",
      proposal_file: "TeleMed_Proposal.pdf",
      category: "Mobile Computing"
    },
    team: {
      name: "TeleMed Team",
      department_id: 1,
      department_name: "CS Department",
      members_count: 6
    },
    requested_at: "Jan 30, 2025"
  },
  {
    id: "fb5",
    status: "accepted",
    project: {
      title: "BizFlow ERP",
      description: "An innovative agricultural solution that utilizes IoT sensors to monitor soil moisture, temperature, and pH levels in real-time.",
      proposal_file: "BizFlow_System_Design.pdf",
      category: "ERP Solutions"
    },
    team: {
      name: "BizFlow Team",
      department_id: 2,
      department_name: "IS Department",
      members_count: 6
    },
    requested_at: "Jan 30, 2025"
  },
  {
    id: "fb6",
    status: "rejected",
    project: {
      title: "EduCode Platform",
      description: "An interactive e-learning environment that teaches coding to children through gamified challenges and simplified tutorials.",
      proposal_file: "EduCode_Draft.pdf",
      category: "Software Engineering"
    },
    team: {
      name: "EduCode Team",
      department_id: 1,
      department_name: "CS Department",
      members_count: 6
    },
    requested_at: "Jan 30, 2025"
  },
  {
    id: "fb7",
    status: "rejected",
    project: {
      title: "PayWise Wallet",
      description: "A smart digital wallet that helps users manage daily expenses and save money using automated data analytics. A smart digital wallet.",
      proposal_file: "PayWise_Project.pdf",
      category: "Fintech & IT"
    },
    team: {
      name: "PayWise Team",
      department_id: 3,
      department_name: "IT Department",
      members_count: 6
    },
    requested_at: "Jan 30, 2025"
  },
  {
    id: "fb8",
    status: "rejected",
    project: {
      title: "InsightHub",
      description: "A Business Intelligence platform that transforms raw retail data into visual dashboards to help store owners make data-driven stock decisions.",
      proposal_file: "InsightHub_Proposal.pdf",
      category: "Data Analytics Dashboard & BI"
    },
    team: {
      name: "InsightHub Team",
      department_id: 2,
      department_name: "IS Department",
      members_count: 6
    },
    requested_at: "Jan 30, 2025"
  }
];

export default function JoinRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [activeTab, setActiveTab] = useState("All"); // All, pending, accepted, rejected
  const [selectedTeamMembers, setSelectedTeamMembers] = useState(null); // null or list of members
  const [summaryCounts, setSummaryCounts] = useState({
    all: 0,
    pending: 0,
    accepted: 0,
    rejected: 0
  });

  const getMockRequestStatus = () => {
    try {
      const saved = localStorage.getItem("mock_join_requests_status");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  };

  const getRestoredMocks = () => {
    const statuses = getMockRequestStatus();
    return MOCK_REQUESTS.map(r => {
      if (statuses[r.id]) {
        return { ...r, status: statuses[r.id] };
      }
      return r;
    });
  };

  // Filter States
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedDeps, setSelectedDeps] = useState([]); // Selected department IDs
  const [selectedCats, setSelectedCats] = useState([]);
  const [selectedTeamSize, setSelectedTeamSize] = useState(null);
  
  // Dynamic list of Departments with fallback defaults
  const [departments, setDepartments] = useState([
    { id: 1, name: "Computer Science", code: "CS" },
    { id: 2, name: "Information Systems", code: "IS" },
    { id: 3, name: "Information Technology", code: "IT" },
    { id: 4, name: "Multimedia", code: "MM" },
    { id: 5, name: "Cyber Security", code: "Cyber Security" },
    { id: 6, name: "Artificial Intelligence", code: "AI" }
  ]);
  const staticCategories = ['AI', 'Embedded System', 'Data', 'IOT', 'Cyber Security', '3D Modeling'];

  const fetchDepartments = async () => {
    try {
      const response = await Requests.getDepartments();
      const data = response?.data?.data || response?.data || response || [];
      if (Array.isArray(data) && data.length > 0) {
        setDepartments(data);
      }
    } catch (err) {
      console.warn("Using fallback static departments list:", err);
    }
  };

  const fetchRequests = async (appliedFilters = {}) => {
    try {
      setLoading(true);
      console.log("Fetching join requests with filters:", appliedFilters);
      const response = await Requests.getDoctorRequests(appliedFilters);
      console.log("Raw response from Requests.getDoctorRequests:", response);
      
      const resData = response?.data || response?.data?.data || response || {};
      const data = Array.isArray(resData) ? resData : (Array.isArray(resData.data) ? resData.data : []);
      console.log("Extracted requests array (data):", data);
      
      const formatted = data.map((item, index) => {
        console.log(`Processing item ${index}:`, item);
        const rawStatus = String(item.status !== undefined && item.status !== null ? item.status : "").toLowerCase().trim();
        let parsedStatus = "pending";
        if (rawStatus === "accepted" || rawStatus === "1" || rawStatus === "approved") {
          parsedStatus = "accepted";
        } else if (rawStatus === "rejected" || rawStatus === "2" || rawStatus === "declined") {
          parsedStatus = "rejected";
        }

        const projectTitle = item.project?.title || item.project_title || item.title || "Project";
        const projectDesc = item.project?.description || item.project_description || item.description || "";
        const projectFile = item.project?.proposal_file || item.proposal_file || item.proposal_pdf || item.project?.file_url || null;
        const projectCat = item.project?.category || item.category || "General";

        const teamName = item.team?.name || item.team_name || "Team";
        const deptId = item.team?.department_id || item.department_id || 1;
        const deptName = item.team?.department_name || item.team?.department?.name || item.department_name || item.department || "CS Department";
        const mCount = Number(item.team?.members_count || item.members_count || 1);

        const rawMembers = item.team?.members || item.members || [];
        const parsedMembers = Array.isArray(rawMembers) ? rawMembers.map(m => ({
          name: m.name || "Student",
          role: m.role || m.role_in_team || "Member",
          img: m.profile_image || m.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        })) : [];

        return {
          id: item.id || `req-${Date.now()}-${Math.random()}`,
          status: parsedStatus,
          project: {
            title: projectTitle,
            description: projectDesc,
            proposal_file: projectFile,
            category: projectCat
          },
          team: {
            name: teamName,
            department_id: deptId,
            department_name: deptName,
            members_count: mCount,
            members: parsedMembers
          },
          requested_at: item.requested_at || (item.created_at ? new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "Recently")
        };
      });

      setRequests(formatted);

      if (response && response.summary) {
        setSummaryCounts({
          all: response.summary.all ?? 0,
          pending: response.summary.pending ?? 0,
          accepted: response.summary.accepted ?? 0,
          rejected: response.summary.rejected ?? 0
        });
      } else {
        setSummaryCounts({
          all: formatted.length,
          pending: formatted.filter(r => r.status === "pending").length,
          accepted: formatted.filter(r => r.status === "accepted").length,
          rejected: formatted.filter(r => r.status === "rejected").length
        });
      }
    } catch (err) {
      console.error("CRITICAL error fetching/parsing requests:", err);
      setRequests([]);
      setSummaryCounts({ all: 0, pending: 0, accepted: 0, rejected: 0 });
    } finally {
      setLoading(false);
    }
  };

  // Run dynamic fetch on tab switches or mount
  useEffect(() => {
    const filters = {};
    if (activeTab !== "All") {
      filters.status = activeTab;
    }
    if (selectedDeps.length > 0) {
      filters.department_id = selectedDeps[0];
    }
    if (selectedCats.length > 0) {
      filters.categories = selectedCats;
    }
    if (selectedTeamSize) {
      filters.team_size = selectedTeamSize;
    }
    fetchRequests(filters);
  }, [activeTab]);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleRespond = async (requestId, status) => {
    try {
      setActionLoading(requestId);
      if (!String(requestId).startsWith("fb")) {
        await Requests.requestRespond(requestId, status);
      } else {
        // Save mock response state to localStorage
        try {
          const statuses = getMockRequestStatus();
          statuses[requestId] = status;
          localStorage.setItem("mock_join_requests_status", JSON.stringify(statuses));
        } catch (e) {
          console.error("Failed saving mock request status:", e);
        }
      }
      setRequests((prev) =>
        prev.map((item) =>
          item.id === requestId ? { ...item, status: status } : item
        )
      );
      toast.success(`Request ${status === "accepted" ? "accepted" : "rejected"} successfully!`);
    } catch (err) {
      console.error("Error responding to request:", err);
      toast.error(err.message || "حدث خطأ أثناء إرسال الرد");
    } finally {
      setActionLoading(null);
    }
  };

  const handleApplyFilters = () => {
    const filters = {};
    if (activeTab !== "All") {
      filters.status = activeTab;
    }
    if (selectedDeps.length > 0) {
      // Send the first selected department ID
      filters.department_id = selectedDeps[0];
    }
    if (selectedCats.length > 0) {
      filters.categories = selectedCats;
    }
    if (selectedTeamSize) {
      filters.team_size = selectedTeamSize;
    }
    fetchRequests(filters);
    setIsFilterOpen(false);
  };

  const handleClearAll = () => {
    setSelectedDeps([]);
    setSelectedCats([]);
    setSelectedTeamSize(null);
  };

  const tabs = [
    { k: "All", l: `All (${summaryCounts.all})` },
    { k: "pending", l: `New (${summaryCounts.pending})` },
    { k: "accepted", l: `Accepted (${summaryCounts.accepted})` },
    { k: "rejected", l: `Rejected (${summaryCounts.rejected})` }
  ];

  const filteredRequests = requests.filter(r => {
    if (activeTab !== "All" && r.status !== activeTab) return false;
    return true;
  });

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      overflow: "hidden",
      background: "#F4F6F9",
      fontFamily: "'Segoe UI', Roboto, sans-serif"
    }}>
      {/* 1. Top Navbar Banner */}
      <header style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingLeft: "24px",
        paddingRight: "24px",
        background: "#1A2E4C",
        height: "64px",
        color: "#ffffff",
        flexShrink: 0,
        zIndex: 50,
        boxSizing: "border-box"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <img src={logo} alt="logo" style={{ height: "40px", objectFit: "contain" }} />
          <div style={{ position: "relative", width: "320px" }}>
            <span style={{
              position: "absolute",
              insetY: 0,
              left: 0,
              display: "flex",
              alignItems: "center",
              paddingLeft: "12px",
              height: "100%"
            }}>
              <FaSearch style={{ color: "#9ca3af", width: "16px", height: "16px" }} />
            </span>
            <input
              type="text"
              placeholder="Search Projects or Students"
              style={{
                width: "100%",
                height: "36px",
                paddingLeft: "36px",
                paddingRight: "16px",
                fontSize: "14px",
                color: "#111827",
                background: "#ffffff",
                border: "none",
                borderRadius: "6px",
                outline: "none",
                boxSizing: "border-box"
              }}
            />
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <button style={{
            position: "relative",
            padding: "4px",
            background: "none",
            border: "none",
            cursor: "pointer"
          }}>
            <FaBell style={{ color: "#d1d5db", width: "20px", height: "20px" }} />
            <span style={{
              position: "absolute",
              top: "4px",
              right: "4px",
              width: "8px",
              height: "8px",
              background: "#ef4444",
              borderRadius: "50%"
            }}></span>
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
              alt="Profile"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                border: "1px solid #9ca3af",
                objectFit: "cover"
              }}
            />
            <span style={{ fontSize: "14px", fontWeight: 500 }}>Ahmed Khaled</span>
          </div>
        </div>
      </header>

      {/* Outer Content Area */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        <Sidebar />

        {/* 3. Main Content Grid */}
        <main style={{
          flex: 1,
          overflowY: "auto",
          padding: "32px",
          boxSizing: "border-box"
        }}>
          {/* Controls Bar: Filters & Button */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "32px",
            flexWrap: "wrap",
            gap: "16px"
          }}>
            {/* Tabs */}
            <div style={{ display: "flex", gap: "10px" }}>
              {tabs.map((t) => (
                <button
                  key={t.k}
                  onClick={() => setActiveTab(t.k)}
                  style={{
                    padding: "8px 18px",
                    borderRadius: "20px",
                    border: "1px solid " + (activeTab === t.k ? "#0066FF" : "#e5e7eb"),
                    cursor: "pointer",
                    fontSize: "13px",
                    fontWeight: 600,
                    background: activeTab === t.k ? "#0066FF" : "#ffffff",
                    color: activeTab === t.k ? "#ffffff" : "#4b5563",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    transition: "all 0.15s ease"
                  }}
                >
                  {t.l}
                </button>
              ))}
            </div>

            {/* Filter button */}
            <button 
              onClick={() => setIsFilterOpen(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
                padding: "8px 16px",
                fontSize: "13px",
                fontWeight: 600,
                color: "#4b5563",
                cursor: "pointer",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
              }}
            >
              <FaFilter /> Filter
            </button>
          </div>

          {/* Cards Grid */}
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px", fontSize: "16px", color: "#6b7280" }}>
              Loading Join Requests...
            </div>
          ) : requests.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px", fontSize: "16px", color: "#6b7280" }}>
              No join requests found.
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))",
              gap: "24px",
              boxSizing: "border-box"
            }}>
              {filteredRequests.map((req) => {
                const isPending = req.status === "pending";

                return (
                  <div key={req.id} style={{
                    background: "#ffffff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)",
                    padding: "24px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    boxSizing: "border-box",
                    minHeight: "340px"
                  }}>
                    {/* Top Content Info */}
                    <div>
                      {/* Project Title */}
                      <h3 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "#111827", marginBottom: "8px" }}>
                        {req.project?.title}
                      </h3>

                      {/* Department Tag */}
                      <span style={{
                        display: "inline-block",
                        background: "#eff6ff",
                        color: "#1d4ed8",
                        fontSize: "12px",
                        fontWeight: 700,
                        padding: "3px 10px",
                        borderRadius: "6px",
                        marginBottom: "16px"
                      }}>
                        {req.team?.department_name || "CS Department"}
                      </span>

                      {/* Avatar Overlay List (Clickable to open Team Members Modal) */}
                      {/* Avatar Overlay List (Clickable to open Team Members Modal) */}
                      <div 
                        onClick={() => setSelectedTeamMembers(req.team?.members && req.team.members.length > 0 ? req.team.members : [
                          { name: "Aliya Othman", role: "UI/UX", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" },
                          { name: "Howida Ayman", role: "Backend", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" },
                          { name: "Rehab Hosni", role: "Frontend", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" },
                          { name: "Mena Mostafa", role: "AI", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" },
                          { name: "Rahma Touni", role: "Frontend", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" },
                          { name: "Shahed Kamal", role: "Backend", img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" }
                        ])}
                        style={{ display: "flex", alignItems: "center", marginBottom: "16px", cursor: "pointer" }}
                      >
                        {(req.team?.members && req.team.members.length > 0 ? req.team.members.slice(0, 4) : [
                          { img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" },
                          { img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" },
                          { img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" },
                          { img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" }
                        ]).map((m, idx) => (
                          <img
                            key={idx}
                            src={m.img}
                            alt="avatar"
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "50%",
                              border: "2px solid #ffffff",
                              objectFit: "cover",
                              marginLeft: idx > 0 ? "-8px" : "0"
                            }}
                          />
                        ))}
                        {req.team?.members_count > 4 && (
                          <div style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            background: "#e5e7eb",
                            color: "#4b5563",
                            fontSize: "12px",
                            fontWeight: "bold",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "2px solid #ffffff",
                            marginLeft: "-8px"
                          }}>
                            +{req.team.members_count - 4}
                          </div>
                        )}
                      </div>

                      {/* Description Paragraph */}
                      <p style={{
                        margin: 0,
                        fontSize: "13px",
                        color: "#4b5563",
                        lineHeight: "1.6",
                        marginBottom: "16px"
                      }}>
                        {req.project?.description}
                      </p>

                      {/* Attachment file */}
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "13px",
                        color: "#4b5563",
                        marginBottom: "8px"
                      }}>
                        <FaRegFilePdf style={{ color: "#ef4444" }} />
                        <span style={{ textDecoration: "underline", cursor: "pointer" }}>
                          {req.project?.proposal_file || "Proposal.pdf"}
                        </span>
                      </div>

                      {/* Category field */}
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "13px",
                        color: "#6b7280"
                      }}>
                        <FaTag style={{ color: "#9ca3af" }} />
                        <span>Category : {req.project?.category || "IoT & Embedded Systems"}</span>
                      </div>
                    </div>

                    {/* Bottom Actions or Status info */}
                    <div style={{ marginTop: "24px" }}>
                      {isPending && (
                        <div style={{ display: "flex", gap: "12px", marginBottom: "12px" }}>
                          <button
                            disabled={actionLoading === req.id}
                            onClick={() => handleRespond(req.id, "rejected")}
                            style={{
                              flex: 1,
                              background: "#e5e7eb",
                              color: "#374151",
                              fontSize: "13px",
                              fontWeight: "bold",
                              padding: "10px 0",
                              border: "none",
                              borderRadius: "6px",
                              cursor: "pointer",
                              transition: "all 0.2s"
                            }}
                          >
                            Reject
                          </button>
                          <button
                            disabled={actionLoading === req.id}
                            onClick={() => handleRespond(req.id, "accepted")}
                            style={{
                              flex: 1,
                              background: "#10B981",
                              color: "#ffffff",
                              fontSize: "13px",
                              fontWeight: "bold",
                              padding: "10px 0",
                              border: "none",
                              borderRadius: "6px",
                              cursor: "pointer",
                              transition: "all 0.2s"
                            }}
                          >
                            {actionLoading === req.id ? "جاري..." : "Accept Request"}
                          </button>
                        </div>
                      )}
                      
                      {/* Request date stamp */}
                      <div style={{
                        fontSize: "12px",
                        color: "#9ca3af",
                        textAlign: "right",
                        marginTop: "12px"
                      }}>
                        Requested on: {req.requested_at}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Filter Sidebar Drawer */}
      {isFilterOpen && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.3)",
          display: "flex",
          justifyContent: "flex-end",
          zIndex: 1000
        }}
        onClick={() => setIsFilterOpen(false)}
        >
          <div style={{
            width: "360px",
            background: "#ffffff",
            height: "100%",
            boxShadow: "-4px 0 25px rgba(0,0,0,0.15)",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box",
            position: "relative"
          }}
          onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              marginBottom: "24px", 
              borderBottom: "1px solid #f3f4f6", 
              paddingBottom: "16px" 
            }}>
              <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "bold", color: "#1f2937" }}>Filter</h2>
              <button 
                onClick={() => setIsFilterOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "20px",
                  color: "#9ca3af",
                  cursor: "pointer"
                }}
              >
                <FaTimes />
              </button>
            </div>

            {/* Scrollable Content */}
            <div style={{ display: "flex", flexDirection: "column", gap: "24px", overflowY: "auto", flex: 1, paddingRight: "4px" }}>
              
              {/* Department Section */}
              <div>
                <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "#111827", marginBottom: "12px" }}>Department</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {departments.map(dep => {
                    const depId = dep.id;
                    const depCode = dep.code || dep.name;
                    const isChecked = selectedDeps.includes(depId);
                    return (
                      <label key={depId} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#4b5563", cursor: "pointer" }}>
                        <input 
                          type="checkbox" 
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setSelectedDeps(selectedDeps.filter(id => id !== depId));
                            } else {
                              setSelectedDeps([...selectedDeps, depId]);
                            }
                          }}
                          style={{
                            width: "16px",
                            height: "16px",
                            borderRadius: "4px",
                            border: "1px solid #d1d5db",
                            cursor: "pointer"
                          }}
                        />
                        <span>{depCode}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <hr style={{ border: "none", borderTop: "1px solid #f3f4f6", margin: 0 }} />

              {/* Category Section */}
              <div>
                <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "#111827", marginBottom: "12px" }}>Category</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {staticCategories.map(cat => {
                    const isChecked = selectedCats.includes(cat);
                    return (
                      <label key={cat} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#4b5563", cursor: "pointer" }}>
                        <input 
                          type="checkbox" 
                          checked={isChecked}
                          onChange={() => {
                            if (isChecked) {
                              setSelectedCats(selectedCats.filter(c => c !== cat));
                            } else {
                              setSelectedCats([...selectedCats, cat]);
                            }
                          }}
                          style={{
                            width: "16px",
                            height: "16px",
                            borderRadius: "4px",
                            border: "1px solid #d1d5db",
                            cursor: "pointer"
                          }}
                        />
                        <span>{cat}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <hr style={{ border: "none", borderTop: "1px solid #f3f4f6", margin: 0 }} />

              {/* Team Size Section */}
              <div>
                <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 700, color: "#111827", marginBottom: "12px" }}>Team Size</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {['2-3', '4-5', '5-6'].map(size => (
                    <label key={size} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#4b5563", cursor: "pointer" }}>
                      <input 
                        type="radio" 
                        name="teamSize"
                        checked={selectedTeamSize === size}
                        onChange={() => setSelectedTeamSize(size)}
                        style={{
                          width: "16px",
                          height: "16px",
                          cursor: "pointer"
                        }}
                      />
                      <span>{size}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div style={{ 
              display: "flex", 
              gap: "12px", 
              marginTop: "24px", 
              borderTop: "1px solid #f3f4f6", 
              paddingTop: "16px" 
            }}>
              <button 
                onClick={handleClearAll}
                style={{
                  flex: 1,
                  background: "#e5e7eb",
                  color: "#374151",
                  fontSize: "14px",
                  fontWeight: "bold",
                  padding: "12px 0",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                Clear All
              </button>
              <button 
                onClick={handleApplyFilters}
                style={{
                  flex: 1,
                  background: "#0066FF",
                  color: "#ffffff",
                  fontSize: "14px",
                  fontWeight: "bold",
                  padding: "12px 0",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                Apply Filters
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Team Members Popup Modal */}
      {selectedTeamMembers && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.3)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000
        }}
        onClick={() => setSelectedTeamMembers(null)}
        >
          <div style={{
            width: "380px",
            background: "#ffffff",
            maxHeight: "85vh",
            borderRadius: "12px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box",
            position: "relative"
          }}
          onClick={(e) => e.stopPropagation()}
          >
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              marginBottom: "24px", 
              borderBottom: "1px solid #f3f4f6", 
              paddingBottom: "16px" 
            }}>
              <h2 style={{ margin: 0, fontSize: "20px", fontWeight: "bold", color: "#1f2937" }}>Team Members</h2>
              <button 
                onClick={() => setSelectedTeamMembers(null)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "20px",
                  color: "#9ca3af",
                  cursor: "pointer"
                }}
              >
                <FaTimes />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px", overflowY: "auto", flex: 1 }}>
              {selectedTeamMembers.map((m, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <img 
                    src={m.img} 
                    alt={m.name} 
                    style={{ width: "44px", height: "44px", borderRadius: "50%", objectFit: "cover" }} 
                  />
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: "14px", fontWeight: "bold", color: "#0066FF" }}>{m.name}</span>
                    <span style={{ fontSize: "12px", color: "#6b7280" }}>{m.role}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
