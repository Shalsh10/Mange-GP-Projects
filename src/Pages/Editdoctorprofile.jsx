import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { 
  FaCamera, 
  FaUser, 
  FaShieldAlt, 
  FaLock, 
  FaQuestionCircle, 
  FaInfoCircle, 
  FaFlag, 
  FaSignOutAlt,
  FaEye,
  FaEyeSlash,
  FaArrowLeft
} from "react-icons/fa";
import { useProfile } from "../context/ProfileContext";
import DocHeader from "../Components/Header";
import Auth from "../Services/Auth.model";

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=150&h=150";

export default function EditDoctorProfile() {
  const navigate = useNavigate();
  const { profileName, profileImage, saveProfile } = useProfile();

  const [previewImage, setPreviewImage] = useState(profileImage);
  const [imageFile, setImageFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load from localStorage user details or fallbacks matching the screenshot
  const [formData, setFormData] = useState({
    name: "Ahmed Khaled Yasser",
    track: "AI",
    department: "CS",
    universityEmail: "AhmedKhaled1240@fcis.bsu.eg",
    phone: "01223479790",
    password: "password123",
  });

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setFormData({
        name: user.full_name || user.name || "Ahmed Khaled Yasser",
        track: user.track || user.track_name || "AI",
        department: user.department || "CS",
        universityEmail: user.email || user.universityEmail || "AhmedKhaled1240@fcis.bsu.eg",
        phone: user.phone || "01223479790",
        password: user.password || "password123",
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.universityEmail ||
      !formData.phone
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("full_name", formData.name);
      fd.append("email", formData.universityEmail);
      fd.append("phone", formData.phone);
      fd.append("track_name", formData.track);

      let deptId = "1";
      if (formData.department === "CS") deptId = "1";
      else if (formData.department === "IT") deptId = "2";
      else if (formData.department === "IS") deptId = "3";
      else if (formData.department === "AI") deptId = "4";
      fd.append("department_id", deptId);

      if (imageFile) {
        fd.append("profile_image_url", imageFile);
      }

      // Call Backend API to update profile
      await Auth.updateProfile(fd);
      
      // Save locally to context and localStorage
      saveProfile(previewImage, formData.name, {
        track: formData.track,
        department: formData.department,
        phone: formData.phone,
        email: formData.universityEmail,
        password: formData.password
      });
      
      toast.success("Profile changes saved successfully! 🚀");
      navigate("/doctor/dashboard");
    } catch (error) {
      console.error("Update Profile Error:", error);
      toast.error(error.message || "Failed to update profile on the server");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="doctor-layout-wrapper" style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: '#F7F9FB' }}>
      <DocHeader />
      
      <div className="doctor-layout-body" style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        
        {/* CUSTOM SIDEBAR MATCHING SCREENSHOT */}
        <aside className="doctor-sidebar" style={{ width: '256px', background: '#1A2E4C', color: '#ffffff', display: 'flex', flexDirection: 'column', padding: '24px 0', boxSizing: 'border-box' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {/* SECTION 1: User Info */}
            <div style={{ padding: '0 24px', fontSize: '11px', color: '#718096', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '12px' }}>
              User Info
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  padding: '14px 24px', 
                  background: '#0052CC', 
                  color: '#ffffff', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  cursor: 'pointer' 
                }}
              >
                <FaUser size={14} />
                <span>Edit Profile</span>
              </div>

              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  padding: '14px 24px', 
                  color: '#A0AEC0', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  cursor: 'pointer' 
                }}
                onClick={() => toast("Security settings coming soon!")}
              >
                <FaShieldAlt size={14} />
                <span>Security</span>
              </div>

              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  padding: '14px 24px', 
                  color: '#A0AEC0', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  cursor: 'pointer' 
                }}
                onClick={() => toast("Privacy settings coming soon!")}
              >
                <FaLock size={14} />
                <span>Privacy</span>
              </div>
            </div>

            {/* SECTION 2: Support and About */}
            <div style={{ padding: '0 24px', fontSize: '11px', color: '#718096', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '24px', marginBottom: '12px' }}>
              Support and About
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  padding: '14px 24px', 
                  color: '#A0AEC0', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  cursor: 'pointer' 
                }}
                onClick={() => toast("Help desk loaded!")}
              >
                <FaQuestionCircle size={14} />
                <span>Help & Support</span>
              </div>

              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  padding: '14px 24px', 
                  color: '#A0AEC0', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  cursor: 'pointer' 
                }}
                onClick={() => navigate("/user/policies")}
              >
                <FaInfoCircle size={14} />
                <span>Terms & Policies</span>
              </div>

              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  padding: '14px 24px', 
                  color: '#A0AEC0', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  cursor: 'pointer' 
                }}
                onClick={() => navigate("/user/report-problem")}
              >
                <FaFlag size={14} />
                <span>Report a Problem</span>
              </div>

              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  padding: '14px 24px', 
                  color: '#F56565', 
                  fontSize: '14px', 
                  fontWeight: '500', 
                  cursor: 'pointer',
                  marginTop: '12px'
                }}
                onClick={handleLogout}
              >
                <FaSignOutAlt size={14} />
                <span>Log Out</span>
              </div>
            </div>

          </div>

        </aside>

        {/* MAIN EDIT PROFILE SECTION */}
        <main className="doctor-layout-main" style={{ flex: 1, overflowY: 'auto', padding: '48px', boxSizing: 'border-box' }}>
          
          <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '1000px' }}>
            
            {/* Header Section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '28px', marginBottom: '40px' }}>
              <button 
                type="button"
                onClick={() => navigate("/doctor/dashboard")}
                style={{
                  border: '1px solid #E2E8F0',
                  cursor: 'pointer',
                  color: '#4A5568',
                  fontSize: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '10px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                  transition: 'background 0.2s, color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#EDF2F7';
                  e.currentTarget.style.color = '#1A202C';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#ffffff';
                  e.currentTarget.style.color = '#4A5568';
                }}
              >
                <FaArrowLeft />
              </button>

              <label style={{ cursor: 'pointer', display: 'block', position: 'relative' }}>
                <img
                  src={previewImage || DEFAULT_AVATAR}
                  style={{ width: '144px', height: '144px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #0052CC' }}
                  alt="Profile"
                />
                
                {/* Camera overlay */}
                <div style={{ position: 'absolute', bottom: '2px', right: '4px', background: '#2B3D5E', color: '#ffffff', padding: '8px', borderRadius: '50%', border: '2px solid #ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FaCamera size={12} />
                </div>
                
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                />
              </label>
              
              <h1 style={{ margin: 0, fontFamily: 'Outfit, sans-serif', fontSize: '32px', color: '#0052CC', fontWeight: 700 }}>
                Edit Profile
              </h1>
            </div>

            {/* Inputs Grid (3 Columns) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px 24px', marginBottom: '40px' }}>
              
              {/* Col 1 */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700', color: '#2D3748', fontFamily: 'Outfit, sans-serif' }}>
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    height: '40px',
                    border: '1px solid #E2E8F0',
                    borderRadius: '6px',
                    background: '#ffffff',
                    padding: '0 12px',
                    boxSizing: 'border-box',
                    fontSize: '13px',
                    color: '#4A5568',
                    outline: 'none',
                    fontFamily: 'Inter, sans-serif'
                  }}
                />
              </div>

              {/* Col 2 */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700', color: '#2D3748', fontFamily: 'Outfit, sans-serif' }}>
                  Track
                </label>
                <input
                  type="text"
                  name="track"
                  value={formData.track}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    height: '40px',
                    border: '1px solid #E2E8F0',
                    borderRadius: '6px',
                    background: '#ffffff',
                    padding: '0 12px',
                    boxSizing: 'border-box',
                    fontSize: '13px',
                    color: '#4A5568',
                    outline: 'none',
                    fontFamily: 'Inter, sans-serif'
                  }}
                />
              </div>

              {/* Col 3 */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700', color: '#2D3748', fontFamily: 'Outfit, sans-serif' }}>
                  Department
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    height: '40px',
                    border: '1px solid #E2E8F0',
                    borderRadius: '6px',
                    background: '#ffffff',
                    padding: '0 12px',
                    boxSizing: 'border-box',
                    fontSize: '13px',
                    color: '#4A5568',
                    outline: 'none',
                    fontFamily: 'Inter, sans-serif',
                    cursor: 'pointer'
                  }}
                >
                  <option value="CS">CS</option>
                  <option value="IT">IT</option>
                  <option value="IS">IS</option>
                  <option value="AI">AI</option>
                </select>
              </div>

              {/* Row 2: Col 1 */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700', color: '#2D3748', fontFamily: 'Outfit, sans-serif' }}>
                  University Email
                </label>
                <input
                  type="email"
                  name="universityEmail"
                  value={formData.universityEmail}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    height: '40px',
                    border: '1px solid #E2E8F0',
                    borderRadius: '6px',
                    background: '#ffffff',
                    padding: '0 12px',
                    boxSizing: 'border-box',
                    fontSize: '13px',
                    color: '#4A5568',
                    outline: 'none',
                    fontFamily: 'Inter, sans-serif'
                  }}
                />
              </div>

              {/* Row 2: Col 2 */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700', color: '#2D3748', fontFamily: 'Outfit, sans-serif' }}>
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    height: '40px',
                    border: '1px solid #E2E8F0',
                    borderRadius: '6px',
                    background: '#ffffff',
                    padding: '0 12px',
                    boxSizing: 'border-box',
                    fontSize: '13px',
                    color: '#4A5568',
                    outline: 'none',
                    fontFamily: 'Inter, sans-serif'
                  }}
                />
              </div>

              {/* Row 2: Col 3 */}
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '700', color: '#2D3748', fontFamily: 'Outfit, sans-serif' }}>
                  Password
                </label>
                <div style={{ position: 'relative', width: '100%' }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      height: '40px',
                      border: '1px solid #E2E8F0',
                      borderRadius: '6px',
                      background: '#ffffff',
                      padding: '0 40px 0 12px',
                      boxSizing: 'border-box',
                      fontSize: '13px',
                      color: '#4A5568',
                      outline: 'none',
                      fontFamily: 'Inter, sans-serif'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#A0AEC0',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                  </button>
                </div>
              </div>

            </div>

            {/* Save Changes Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                background: '#0052CC',
                color: '#ffffff',
                fontWeight: '700',
                fontSize: '13px',
                padding: '12px 36px',
                borderRadius: '6px',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'Outfit, sans-serif',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                transition: 'background 0.2s',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>

          </form>

        </main>
        
      </div>
    </div>
  );
}