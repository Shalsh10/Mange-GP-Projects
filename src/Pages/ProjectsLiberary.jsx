import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Search, Heart, ChevronDown, ArrowLeft } from "lucide-react";
import DocHeader from "../Components/Header";
import DocSidebar from "../Components/Sidebar";
import Project from "../Services/Project.model";
import "./projectsPage.css";

const MOCK_PROJECTS = [
  {
    id: 1,
    title: "Blockchain-based Certificate Verification",
    department: "CS Department",
    year: 2023,
    description: "A secure system built on blockchain technology to verify academic certificates and prevent fraud.",
    tags: ["CS", "Blockchain", "Web"],
    favorite: true
  },
  {
    id: 2,
    title: "AI Mental Health Companion",
    department: "CS Department",
    year: 2024,
    description: "A mobile application that uses artificial intelligence to support mental health through personalized conversations.",
    tags: ["AI", "Healthcare", "Mobile"],
    favorite: false
  },
  {
    id: 3,
    title: "IoT Smart Campus",
    department: "AI Department",
    year: 2023,
    description: "A smart campus system that uses IoT devices to monitor and manage energy consumption, security, and facilities.",
    tags: ["AI", "IoT", "Embedded"],
    favorite: false
  },
  {
    id: 4,
    title: "AI-Powered Exam Proctoring",
    department: "CS Department",
    year: 2023,
    description: "An AI-driven system designed to monitor online exams, detect cheating behavior, and ensure exam integrity using webcam",
    tags: ["CS", "AI", "Security"],
    favorite: true
  },
  {
    id: 5,
    title: "VR Career Simulator",
    department: "IS Department",
    year: 2023,
    description: "A secure system built on blockchain technology to verify academic certificates and prevent fraud.",
    tags: ["IS", "VR"],
    favorite: false
  },
  {
    id: 6,
    title: "AI-based Sign Language Translator",
    department: "AI Department",
    year: 2023,
    description: "A secure system built on blockchain technology to verify academic certificates and prevent fraud.",
    tags: ["CS", "AI"],
    favorite: true
  }
];

export default function ProjectsPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load favorites state from localStorage if available
    const savedFavs = localStorage.getItem("library_favorites");
    let favMap = {};
    if (savedFavs) {
      favMap = JSON.parse(savedFavs);
    } else {
      MOCK_PROJECTS.forEach(p => {
        if (p.favorite) favMap[p.id] = true;
      });
      localStorage.setItem("library_favorites", JSON.stringify(favMap));
    }

    (async () => {
      try {
        setLoading(true);
        const response = await Project.getPreviousProjects();
        const data = Array.isArray(response) ? response : (response?.data || []);
        
        if (data.length > 0) {
          const formatted = data.map(p => ({
            id: p.id,
            title: p.title || "Untitled Project",
            department: p.department_name || p.department || "CS Department",
            year: p.year || 2023,
            description: p.description || "Project description details.",
            tags: Array.isArray(p.technologies) ? p.technologies : (p.technologies?.split(",") || ["Web"]),
            favorite: !!favMap[p.id]
          }));
          setProjects(formatted);
        } else {
          // Use MOCK_PROJECTS with correct localized favorites
          const withFavs = MOCK_PROJECTS.map(p => ({
            ...p,
            favorite: !!favMap[p.id]
          }));
          setProjects(withFavs);
        }
      } catch (err) {
        console.warn("Failed API previous projects loading, using fallback mock list:", err);
        const withFavs = MOCK_PROJECTS.map(p => ({
          ...p,
          favorite: !!favMap[p.id]
        }));
        setProjects(withFavs);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleFavorite = (id) => {
    const updated = projects.map(p => {
      if (p.id === id) {
        const nextFav = !p.favorite;
        // Update localStorage persistence
        const savedFavs = localStorage.getItem("library_favorites");
        const favMap = savedFavs ? JSON.parse(savedFavs) : {};
        if (nextFav) {
          favMap[id] = true;
        } else {
          delete favMap[id];
        }
        localStorage.setItem("library_favorites", JSON.stringify(favMap));
        return { ...p, favorite: nextFav };
      }
      return p;
    });
    setProjects(updated);
    toast.success("Favorites updated! ❤️");
  };

  // Filters logic
  const filteredProjects = projects.filter(p => {
    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title.toLowerCase().includes(q);
      const matchDesc = p.description.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc) return false;
    }
    // 2. Favorites only
    if (favoritesOnly && !p.favorite) return false;

    // 3. Department
    if (selectedDept !== "All") {
      if (!p.department.toLowerCase().includes(selectedDept.toLowerCase().replace(" department", ""))) return false;
    }

    // 4. Year
    if (selectedYear !== "All") {
      if (String(p.year) !== selectedYear) return false;
    }

    // 5. Category
    if (selectedCategory !== "All") {
      const matchTag = p.tags.some(t => t.toLowerCase() === selectedCategory.toLowerCase());
      if (!matchTag) return false;
    }

    return true;
  });

  return (
    <div className="doctor-layout-wrapper" style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: '#F7F9FB' }}>
      <DocHeader />
      <div className="doctor-layout-body" style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <DocSidebar />
        <main className="doctor-layout-main" style={{ flex: 1, overflowY: 'auto', padding: '32px' }}>
          
          {/* Header Title section */}
          <div className="library-header-box" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {favoritesOnly && (
                  <button onClick={() => setFavoritesOnly(false)} style={{ border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#1A202C' }}>
                    <ArrowLeft size={20} />
                  </button>
                )}
                <h1 style={{ margin: 0, fontFamily: 'Outfit, sans-serif', fontSize: '24px', color: '#1A202C', fontWeight: 700 }}>
                  {favoritesOnly ? "My Favorite Projects" : "Graduation Projects Library"}
                </h1>
              </div>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#718096', fontFamily: 'Inter, sans-serif' }}>
                {favoritesOnly ? "Projects you saved for quick access and future reference" : "Explore past projects for inspiration and reference"}
              </p>
            </div>

            <button
              onClick={() => setFavoritesOnly(!favoritesOnly)}
              className={`fav-toggle-btn ${favoritesOnly ? "active" : ""}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                background: favoritesOnly ? '#F56565' : '#ffffff',
                color: favoritesOnly ? '#ffffff' : '#1A202C',
                fontSize: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
              }}
            >
              <Heart size={14} fill={favoritesOnly ? "#ffffff" : "transparent"} stroke={favoritesOnly ? "#ffffff" : "#4A5568"} />
              Favorites
            </button>
          </div>

          {/* Search and Filters row */}
          <div className="library-filters-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <div className="search-box-custom" style={{ position: 'relative', width: '380px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#718096' }} />
              <input
                type="text"
                placeholder="Search Projects"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  height: '40px',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  background: '#ffffff',
                  padding: '0 16px 0 38px',
                  boxSizing: 'border-box',
                  fontSize: '13px',
                  color: '#2D3748',
                  outline: 'none',
                  fontFamily: 'Inter, sans-serif'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              {/* Department filter */}
              <div className="filter-select-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#718096', marginRight: '6px', fontWeight: 600 }}>Department:</span>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  style={{
                    appearance: 'none',
                    border: 'none',
                    background: 'transparent',
                    fontSize: '12px',
                    color: '#0052CC',
                    fontWeight: 700,
                    outline: 'none',
                    cursor: 'pointer',
                    paddingRight: '16px'
                  }}
                >
                  <option value="All">All</option>
                  <option value="AI">AI Department</option>
                  <option value="CS">CS Department</option>
                  <option value="IS">IS Department</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="IT">IT Department</option>
                  <option value="MM">MM Department</option>
                </select>
                <ChevronDown size={12} style={{ position: 'absolute', right: 0, pointerEvents: 'none', color: '#0052CC' }} />
              </div>

              {/* Year filter */}
              <div className="filter-select-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#718096', marginRight: '6px', fontWeight: 600 }}>Year:</span>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  style={{
                    appearance: 'none',
                    border: 'none',
                    background: 'transparent',
                    fontSize: '12px',
                    color: '#0052CC',
                    fontWeight: 700,
                    outline: 'none',
                    cursor: 'pointer',
                    paddingRight: '16px'
                  }}
                >
                  <option value="All">All</option>
                  <option value="2023">2023</option>
                  <option value="2024">2024</option>
                </select>
                <ChevronDown size={12} style={{ position: 'absolute', right: 0, pointerEvents: 'none', color: '#0052CC' }} />
              </div>

              {/* Category filter */}
              <div className="filter-select-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: '12px', color: '#718096', marginRight: '6px', fontWeight: 600 }}>Category:</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{
                    appearance: 'none',
                    border: 'none',
                    background: 'transparent',
                    fontSize: '12px',
                    color: '#0052CC',
                    fontWeight: 700,
                    outline: 'none',
                    cursor: 'pointer',
                    paddingRight: '16px'
                  }}
                >
                  <option value="All">All</option>
                  <option value="AI">AI</option>
                  <option value="Web">Web</option>
                  <option value="Mobile">Mobile</option>
                  <option value="Blockchain">Blockchain</option>
                  <option value="IoT">IoT</option>
                  <option value="Security">Security</option>
                  <option value="VR">VR</option>
                </select>
                <ChevronDown size={12} style={{ position: 'absolute', right: 0, pointerEvents: 'none', color: '#0052CC' }} />
              </div>
            </div>
          </div>

          {/* Cards grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#718096' }}>Loading Library...</div>
          ) : filteredProjects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#718096' }}>No projects match your filter.</div>
          ) : (
            <div className="projects-grid-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
              {filteredProjects.map((p) => (
                <div
                  key={p.id}
                  className="library-card-custom"
                  style={{
                    background: '#ffffff',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.01)',
                    position: 'relative'
                  }}
                >
                  <div>
                    {/* Top title and heart row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px', gap: '8px' }}>
                      <h3 style={{ margin: 0, fontFamily: 'Outfit, sans-serif', fontSize: '15px', color: '#1A202C', fontWeight: 700, lineHeight: '1.4' }}>
                        {p.title}
                      </h3>
                      <button
                        onClick={() => toggleFavorite(p.id)}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 0 }}
                      >
                        <Heart size={16} fill={p.favorite ? "#F56565" : "transparent"} stroke={p.favorite ? "#F56565" : "#A0AEC0"} />
                      </button>
                    </div>

                    {/* Department and year badges */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <span style={{ background: '#EBF8FF', color: '#2B6CB0', fontSize: '10px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '4px' }}>
                        {p.department}
                      </span>
                      <span style={{ fontSize: '11px', color: '#4A5568', fontWeight: '600' }}>
                        {p.year}
                      </span>
                    </div>

                    {/* Description text */}
                    <p style={{ margin: '0 0 16px 0', fontSize: '12px', color: '#4A5568', lineHeight: '1.6', fontFamily: 'Inter, sans-serif', minHeight: '48px' }}>
                      {p.description}
                    </p>
                  </div>

                  <div>
                    {/* Categories pills */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
                      {p.tags.map((tag, idx) => (
                        <span key={idx} style={{ background: '#EDF2F7', color: '#4A5568', fontSize: '10px', fontWeight: '600', padding: '2px 8px', borderRadius: '4px' }}>
                          {tag.trim()}
                        </span>
                      ))}
                    </div>

                    {/* Bottom Details link */}
                    <button
                      onClick={() => navigate(`/project-details/${p.id}`)}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        color: '#0052CC',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
        </main>
      </div>
    </div>
  );
}