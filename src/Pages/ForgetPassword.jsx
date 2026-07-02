import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import logo from "../assets/logo2.png";

export default function ForgetPassword() {
  const navigate = useNavigate();
  const [id, setId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!id.trim()) {
      toast.error("National ID is required");
      return;
    }

    if (!/^\d+$/.test(id)) {
      toast.error("ID must contain numbers only");
      return;
    }

    // Pass ID to VerifyOTP via state or localStorage (we can store it to show in next screen or send code!)
    localStorage.setItem("reset_national_id", id);
    toast.success("Verification code sent to your email!");
    navigate("/verify-otp");
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#ffffff',
      fontFamily: 'Inter, sans-serif',
      boxSizing: 'border-box'
    }}>
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
          maxWidth: '480px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          
          <h2 style={{
            fontSize: '32px',
            color: '#1A202C',
            fontWeight: '700',
            fontFamily: 'Outfit, sans-serif',
            margin: '0 0 8px'
          }}>
            Forget Password
          </h2>

          <p style={{
            color: '#718096',
            fontSize: '14px',
            margin: '0 0 32px',
            lineHeight: '1.5'
          }}>
            Please enter your ID to receive a verification code.
          </p>

          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            
            {/* Input Group */}
            <div style={{ marginBottom: '28px' }}>
              <label style={{ 
                display: 'block', 
                color: '#0052CC', 
                fontWeight: '700', 
                fontSize: '15px', 
                fontFamily: 'Outfit, sans-serif',
                marginBottom: '8px' 
              }}>
                Enter your National ID :
              </label>
              <input
                type="text"
                placeholder="221."
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
                  background: '#ffffff'
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
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
                transition: 'background 0.2s'
              }}
            >
              Submit
            </button>

            {/* Back to Login */}
            <div style={{ textAlign: 'center' }}>
              <span
                onClick={() => navigate("/login")}
                style={{
                  color: '#718096',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textDecoration: 'none'
                }}
              >
                Back to Login
              </span>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
}
