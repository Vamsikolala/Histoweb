import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, User, FileText, Lock, Mail, Eye, EyeOff, ArrowRight, BriefcaseMedical, CheckCircle2 } from 'lucide-react';
import { API_BASE_URL } from '../utils/api';

export const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [licenseNo, setLicenseNo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !licenseNo || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (name.length < 2 || !/^[A-Za-z.\s]+$/.test(name)) {
      setError('Name must be 2–50 characters and only contain letters.');
      return;
    }

    if (!/^[A-Za-z0-9]+$/.test(licenseNo)) {
      setError('License number must be alphanumeric.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
    if (!strongRegex.test(password)) {
      setError('Password must be at least 8 characters with uppercase, lowercase, number, and special character.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/doctor_signup.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ name, license_no: licenseNo, email, password }).toString(),
      });

      const data = await response.json();

      if (data.status) {
        setSuccess('Account created! Redirecting to login...');
        setTimeout(() => navigate('/login'), 1800);
      } else {
        setError(data.message || 'Signup failed. Please try again.');
      }
    } catch (err: any) {
      setError('Network error: ' + (err.message || err.toString()));
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = (() => {
    if (!password) return null;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*]/.test(password)) score++;
    if (score <= 1) return { label: 'Weak', color: 'var(--error)' };
    if (score === 2) return { label: 'Fair', color: 'var(--warning)' };
    if (score === 3) return { label: 'Good', color: 'var(--accent)' };
    return { label: 'Strong', color: 'var(--success)' };
  })();

  return (
    <div className="auth-wrapper">
      {/* Left Branding Panel */}
      <div className="auth-left">
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--sp-8)', width: '100%' }}>
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
                JOIN THE SCREENING PORTAL
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
              What you get:
            </p>
            {[
              'Full access to clinical scoring modules',
              'Patient management & report history',
              'PDF report generation & downloads',
              'Secure doctor-only access',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', color: 'rgba(255,255,255,0.85)', marginBottom: i < 3 ? 'var(--sp-3)' : 0 }}>
                <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
                <span style={{ fontSize: 'var(--text-sm)' }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="auth-right">
        <div className="auth-card animate-fade-in-up">
          <h2 className="auth-card-title">Create account</h2>
          <p className="auth-card-sub">Register as a licensed doctor to get started</p>

          <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="signup-name">Full Name</label>
              <div className="input-with-icon">
                <User size={16} className="input-icon" />
                <input
                  id="signup-name"
                  className="input-field"
                  type="text"
                  placeholder="Dr. Jane Smith"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signup-license">License Number</label>
              <div className="input-with-icon">
                <FileText size={16} className="input-icon" />
                <input
                  id="signup-license"
                  className="input-field"
                  type="text"
                  placeholder="e.g. MCI123456"
                  value={licenseNo}
                  onChange={(e) => setLicenseNo(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signup-email">Email Address</label>
              <div className="input-with-icon">
                <Mail size={16} className="input-icon" />
                <input
                  id="signup-email"
                  className="input-field"
                  type="email"
                  placeholder="you@hospital.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signup-password">Password</label>
              <div className="input-with-icon">
                <Lock size={16} className="input-icon" />
                <input
                  id="signup-password"
                  className="input-field"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 8 chars, 1 uppercase, 1 number..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="button" className="input-action" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {passwordStrength && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', marginTop: 'var(--sp-1)' }}>
                  <div style={{ flex: 1, height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      background: passwordStrength.color,
                      borderRadius: 2,
                      width: passwordStrength.label === 'Weak' ? '25%' : passwordStrength.label === 'Fair' ? '50%' : passwordStrength.label === 'Good' ? '75%' : '100%',
                      transition: 'var(--transition)',
                    }} />
                  </div>
                  <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: passwordStrength.color, flexShrink: 0 }}>
                    {passwordStrength.label}
                  </span>
                </div>
              )}
            </div>

            {error && (
              <div className="alert alert-error animate-fade-in">
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="alert alert-success animate-fade-in">
                <CheckCircle2 size={16} />
                <span>{success}</span>
              </div>
            )}

            <button
              id="signup-submit"
              type="submit"
              disabled={isLoading || !!success}
              className="btn btn-primary btn-lg btn-full"
              style={{ marginTop: 'var(--sp-2)' }}
            >
              {isLoading ? (
                <>
                  <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus size={16} /> Create Account <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

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
              Already have an account?
            </span>
            <button
              type="button"
              onClick={() => navigate('/login')}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: 'var(--text-sm)', fontWeight: 700, cursor: 'pointer', padding: 0 }}
              id="signup-goto-login"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
