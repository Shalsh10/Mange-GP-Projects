import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import logo from "../assets/logo2.png";

export default function VerifyOTP() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(45);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `0${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();

    if (otp.some((digit) => digit === "")) {
      toast.error("Please enter the complete OTP code");
      return;
    }

    toast.success("OTP verified successfully!");
    navigate("/reset-password");
  };

  const handleResetCode = () => {
    setTimer(45);
    toast.success("New OTP code sent!");
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
            We have sent a verification code to your email.<br />
            Please Enter the OTP below.
          </p>

          {/* Green Status Box */}
          <div style={{
            background: '#E6F4EA',
            border: '1px solid #C4EAD0',
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}>
            <span style={{ color: '#137333', fontSize: '18px', fontWeight: 'bold', lineHeight: '1' }}>✔</span>
            <div style={{ fontSize: '13px', color: '#2D3748', lineHeight: '1.4' }}>
              We have sent a code to : <br />
              <strong style={{ color: '#137333' }}>ahmedkhaled.bsu@fcis.bsu.edu.eg</strong>
            </div>
          </div>

          <form onSubmit={handleVerify} style={{ width: '100%' }}>
            
            {/* Header row for OTP label + reset action */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <label style={{ 
                color: '#0052CC', 
                fontWeight: '700', 
                fontSize: '15px', 
                fontFamily: 'Outfit, sans-serif'
              }}>
                Enter OTP Code :
              </label>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                <span 
                  onClick={handleResetCode}
                  style={{ color: '#0052CC', fontSize: '12px', fontWeight: '700', cursor: 'pointer', textDecoration: 'none' }}
                >
                  Reset Code
                </span>
                <span style={{ 
                  background: '#EDF2F7', 
                  borderRadius: '4px', 
                  padding: '4px 10px', 
                  fontSize: '12px', 
                  color: '#4A5568',
                  fontWeight: '600'
                }}>
                  {formatTime(timer)}
                </span>
              </div>
            </div>

            {/* OTP Box Inputs */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, i)}
                  style={{
                    width: '56px',
                    height: '56px',
                    textAlign: 'center',
                    fontSize: '20px',
                    fontWeight: '700',
                    border: '1px solid #CBD5E0',
                    borderRadius: '6px',
                    outline: 'none',
                    background: '#ffffff',
                    color: '#2D3748'
                  }}
                />
              ))}
            </div>

            {/* Verify Button */}
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
              Verify
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
