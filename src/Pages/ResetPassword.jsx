import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import logo from "../assets/logo2.png";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newPassword.trim() || !confirmPassword.trim()) {
      toast.error("Both password fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    toast.success("Password reset successfully! Please login with your new password.");
    navigate("/login");
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
            margin: '0 0 24px',
            lineHeight: '1.5'
          }}>
            Please Enter a new password for your account.
          </p>

          {/* Green Status Box */}
          <div style={{
            background: '#E6F4EA',
            border: '1px solid #C4EAD0',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <span style={{ color: '#137333', fontSize: '18px', fontWeight: 'bold', lineHeight: '1' }}>✔</span>
            <div style={{ fontSize: '13px', color: '#2D3748', lineHeight: '1.4' }}>
              The verification code is correct. <br />
              <strong style={{ color: '#137333' }}>You can now reset your password</strong>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            
            {/* New Password */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ 
                display: 'block', 
                color: '#0052CC', 
                fontWeight: '700', 
                fontSize: '15px', 
                fontFamily: 'Outfit, sans-serif',
                marginBottom: '8px' 
              }}>
                New Password :
              </label>
              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  type={showNew ? "text" : "password"}
                  placeholder="********"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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
                  onClick={() => setShowNew(!showNew)}
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
                  {showNew ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: '32px' }}>
              <label style={{ 
                display: 'block', 
                color: '#0052CC', 
                fontWeight: '700', 
                fontSize: '15px', 
                fontFamily: 'Outfit, sans-serif',
                marginBottom: '8px' 
              }}>
                Confirm Password :
              </label>
              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="********"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                  onClick={() => setShowConfirm(!showConfirm)}
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
                  {showConfirm ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            {/* Reset Password Button */}
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
              Reset Password
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
