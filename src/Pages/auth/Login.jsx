import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../../assets/logo2.png";
import Auth from "../../Services/Auth.model";

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!id || !password) {
      toast.error("Please enter both ID and Password");
      return;
    }
    setLoading(true);
    try {
      const loginResponse = await Auth.Login({
        national_id: id,
        password: password,
      });
      if (loginResponse?.token) {
        localStorage.setItem("token", loginResponse.token);
        localStorage.setItem("user", JSON.stringify(loginResponse.user));
        toast.success("Welcome back! 👋");
        
        const role = (loginResponse.user?.role || loginResponse.user?.role_code || "").toLowerCase();
        if (role === "admin") {
          navigate("/management");
        } else if (role === "doctor" || role === "supervisor" || role === "doctor/supervisor" || role === "doctor_supervisor") {
          navigate("/doctor/dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#ffffff',
      fontFamily: 'Inter, sans-serif',
      boxSizing: 'border-box'
    }}>
      {/* Container */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 24px',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '80px',
        flexWrap: 'wrap'
      }}>
        
        {/* Left Column: Logo */}
        <div style={{
          flex: '1 1 320px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <img 
            src={logo} 
            alt="Logo" 
            style={{ 
              width: '100%', 
              maxWidth: '300px', 
              height: 'auto',
              objectFit: 'contain'
            }} 
          />
        </div>

        {/* Right Column: Form */}
        <div style={{
          flex: '1 1 380px',
          maxWidth: '440px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          
          <form onSubmit={handleLogin} style={{ width: '100%' }}>
            
            {/* ID Field */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ 
                display: 'block', 
                color: '#0052CC', 
                fontWeight: '700', 
                fontSize: '18px', 
                fontFamily: 'Outfit, sans-serif',
                marginBottom: '8px' 
              }}>
                ID
              </label>
              <input
                type="text"
                placeholder="098..."
                value={id}
                onChange={(e) => setId(e.target.value)}
                style={{
                  width: '100%',
                  height: '42px',
                  border: '1px solid #CBD5E0',
                  borderRadius: '6px',
                  padding: '0 12px',
                  boxSizing: 'border-box',
                  fontSize: '14px',
                  color: '#2D3748',
                  outline: 'none',
                  background: '#ffffff',
                  textAlign: 'left'
                }}
              />
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ 
                display: 'block', 
                color: '#0052CC', 
                fontWeight: '700', 
                fontSize: '18px', 
                fontFamily: 'Outfit, sans-serif',
                marginBottom: '8px' 
              }}>
                Password
              </label>
              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    height: '42px',
                    border: '1px solid #CBD5E0',
                    borderRadius: '6px',
                    padding: '0 40px 0 12px',
                    boxSizing: 'border-box',
                    fontSize: '14px',
                    color: '#2D3748',
                    outline: 'none',
                    background: '#ffffff'
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
                    color: '#718096',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            {/* Forget Password link */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '32px' }}>
              <span
                onClick={() => navigate("/forget-password")}
                style={{
                  color: 'red',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textDecoration: 'none'
                }}
              >
                Forget Password ?
              </span>
            </div>

            {/* Login button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                height: '42px',
                background: '#0052CC',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '15px',
                fontWeight: '700',
                fontFamily: 'Outfit, sans-serif',
                cursor: 'pointer',
                marginBottom: '20px',
                transition: 'background 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {/* Guest link */}
            <div style={{ textAlign: 'center' }}>
              <span
                onClick={() => navigate("/guestHomePage")}
                style={{
                  color: '#0052CC',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Don't have an account? Continue as a Guest
              </span>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
}