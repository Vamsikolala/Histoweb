import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Lock, BriefcaseMedical, Eye, EyeOff, Microscope, Dna, FlaskConical, ArrowRight } from 'lucide-react';
import { API_BASE_URL } from '../utils/api';

export const Login: React.FC = () => {
  const [licenseNo, setLicenseNo] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('doctor_id')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!licenseNo || !password) {
      setError('Please enter your license number and password.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/doctor_login.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ license_no: licenseNo, password }).toString(),
      });

      const data = await response.json();

      if (data.status) {
        localStorage.setItem('doctor_id', data.doctor_id);
        localStorage.setItem('doctor_name', data.doctor_name);
        localStorage.setItem('email', data.email || '');
        localStorage.setItem('specialization', data.specialization || '');
        localStorage.setItem('hospitalName', data.hospital_name || '');
        localStorage.setItem('license_no', licenseNo);
        localStorage.setItem('phoneNumber', data.phone_number || '');
        localStorage.setItem('profile_pic', data.profile_pic || '');
        navigate('/dashboard');
      } else {
        setError(data.message || 'Invalid credentials. Please try again.');
      }
    } catch (err: any) {
      setError('Network error: ' + (err.message || err.toString()));
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    { icon: <Microscope size={18} />, text: 'Quantitative biomarker analysis' },
    { icon: <Dna size={18} />, text: 'ER, PR, HER2 & Ki67 scoring' },
    { icon: <FlaskConical size={18} />, text: 'Multi-tissue clinical modules' },
  ];

  return (
    <div className="auth-wrapper">
      {/* Left Branding Panel */}
      <div className="auth-left">
        {/* Logo */}
        <div
          style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--sp-8)', width: '100%' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--sp-5)' }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 'var(--radius-xl)',
                background: 'rgba(255,255,255,0.15)',
                border: '1.5px solid rgba(255,255,255,0.25)',
                backdropFilter: 'blur(10px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <BriefcaseMedical size={36} color="white" />
            </div>

            <div style={{ textAlign: 'center' }}>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white', letterSpacing: '-1px', margin: 0 }}>
                HistoQuanta
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 'var(--text-sm)', fontWeight: 500, marginTop: 'var(--sp-2)', letterSpacing: '0.5px' }}>
                CANCER SCREENING PORTAL
              </p>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255,255,255,0.10)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--sp-6)',
              width: '100%',
              maxWidth: 340,
            }}
          >
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--sp-4)' }}>
              Precision diagnostics for:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
              {features.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', color: 'rgba(255,255,255,0.85)' }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 'var(--radius)',
                      background: 'rgba(255,255,255,0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {f.icon}
                  </div>
                  <span style={{ fontSize: 'var(--text-sm)' }}>{f.text}</span>
                </div>
              ))}
            </div>
          </div>

          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', textAlign: 'center', maxWidth: 300 }}>
            Standardized, reproducible results for clinical decision-making
          </p>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="auth-right">
        <div className="auth-card animate-fade-in-up">
          {/* Mobile Logo */}
          <div style={{ display: 'none' }} className="auth-mobile-logo">
            <BriefcaseMedical size={28} color="var(--primary)" />
            <span>HistoQuanta</span>
          </div>

          <h2 className="auth-card-title">Welcome back</h2>
          <p className="auth-card-sub">Sign in to your doctor's portal</p>

          <form onSubmit={handleLogin} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
            {/* License Number */}
            <div className="form-group">
              <label className="form-label" htmlFor="login-license">License Number</label>
              <div className="input-with-icon">
                <FileText size={16} className="input-icon" />
                <input
                  id="login-license"
                  className="input-field"
                  type="text"
                  placeholder="e.g. MCI123456"
                  value={licenseNo}
                  onChange={(e) => setLicenseNo(e.target.value)}
                  autoComplete="username"
                />
              </div>
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label" htmlFor="login-password">Password</label>
              <div className="input-with-icon">
                <Lock size={16} className="input-icon" />
                <input
                  id="login-password"
                  className="input-field"
                  type={isPasswordVisible ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="input-action"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
                >
                  {isPasswordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div style={{ textAlign: 'right', marginTop: '-var(--sp-2)' }}>
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0,
                }}
                id="login-forgot-password"
              >
                Forgot password?
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="alert alert-error animate-fade-in">
                <span>{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={isLoading}
              className="btn btn-primary btn-lg btn-full"
              style={{ marginTop: 'var(--sp-2)' }}
            >
              {isLoading ? (
                <>
                  <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 'var(--sp-2)',
              marginTop: 'var(--sp-8)',
              paddingTop: 'var(--sp-6)',
              borderTop: '1px solid var(--border)',
            }}
          >
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
              New to HistoQuanta?
            </span>
            <button
              type="button"
              onClick={() => navigate('/signup')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                fontSize: 'var(--text-sm)',
                fontWeight: 700,
                cursor: 'pointer',
                padding: 0,
              }}
              id="login-goto-signup"
            >
              Create account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
