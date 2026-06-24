import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Key, ShieldCheck, ArrowLeft, Eye, EyeOff, CheckCircle2, ArrowRight } from 'lucide-react';
import { API_BASE_URL } from '../utils/api';

type Step = 'email' | 'otp' | 'newPassword';

const STEP_META: Record<Step, { title: string; subtitle: string; step: number }> = {
  email:       { title: 'Forgot password',    subtitle: 'Enter your registered email and we\'ll send you an OTP', step: 1 },
  otp:         { title: 'Verify OTP',         subtitle: 'Enter the 6-digit code sent to your email',              step: 2 },
  newPassword: { title: 'Reset password',     subtitle: 'Create a strong new password for your account',          step: 3 },
};

export const ForgotPassword: React.FC = () => {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleBack = () => {
    setError('');
    setSuccess('');
    if (step === 'email') navigate('/login');
    else if (step === 'otp') setStep('email');
    else if (step === 'newPassword') setStep('otp');
  };

  const sendOTP = async () => {
    setError('');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/send_otp.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ email }).toString(),
      });
      const data = await res.json();
      if (data.status) {
        setSuccess(data.message || 'OTP sent successfully.');
        setStep('otp');
      } else {
        setError(data.message || 'Failed to send OTP.');
      }
    } catch (err: any) {
      setError('Network error: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async () => {
    setError('');
    if (!otp.trim()) { setError('Please enter the OTP.'); return; }
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/verify_otp.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ email, otp }).toString(),
      });
      const data = await res.json();
      if (data.status) {
        setSuccess('');
        setStep('newPassword');
      } else {
        setError(data.message || 'Invalid OTP.');
      }
    } catch (err: any) {
      setError('Network error: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async () => {
    setError('');
    if (!newPassword || !confirmPassword) { setError('Please enter both password fields.'); return; }
    if (newPassword !== confirmPassword) { setError('Passwords do not match.'); return; }
    const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
    if (!strongRegex.test(newPassword)) {
      setError('Password must be 8+ chars with uppercase, lowercase, number & special character.');
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/reset_password_otp.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ email, new_password: newPassword }).toString(),
      });
      const data = await res.json();
      if (data.status) {
        setSuccess(data.message || 'Password reset successfully!');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(data.message || 'Reset failed.');
      }
    } catch (err: any) {
      setError('Network error: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 'email') sendOTP();
    else if (step === 'otp') verifyOTP();
    else resetPassword();
  };

  const meta = STEP_META[step];

  const stepIcons: Record<Step, React.ReactNode> = {
    email:       <Mail size={22} color="var(--primary)" />,
    otp:         <Key size={22} color="var(--primary)" />,
    newPassword: <ShieldCheck size={22} color="var(--primary)" />,
  };

  const btnLabel = step === 'email' ? 'Send OTP' : step === 'otp' ? 'Verify OTP' : 'Reset Password';

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-page)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--sp-6)',
      }}
    >
      <div style={{ width: '100%', maxWidth: 460 }} className="animate-fade-in-up">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="btn btn-ghost btn-sm"
          style={{ marginBottom: 'var(--sp-6)' }}
          id="forgot-password-back"
        >
          <ArrowLeft size={16} /> Back
        </button>

        {/* Progress Steps */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--sp-2)',
            marginBottom: 'var(--sp-8)',
          }}
        >
          {(['email', 'otp', 'newPassword'] as Step[]).map((s, i) => {
            const done = meta.step > i + 1;
            const active = meta.step === i + 1;
            return (
              <React.Fragment key={s}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: done ? 'var(--success)' : active ? 'var(--primary)' : 'var(--gray-200)',
                    color: done || active ? 'white' : 'var(--text-muted)',
                    fontSize: '13px',
                    fontWeight: 700,
                    flexShrink: 0,
                    transition: 'var(--transition)',
                  }}
                >
                  {done ? <CheckCircle2 size={16} /> : i + 1}
                </div>
                {i < 2 && (
                  <div
                    style={{
                      flex: 1,
                      height: 2,
                      background: done ? 'var(--success)' : 'var(--border)',
                      borderRadius: 1,
                      transition: 'var(--transition)',
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Card */}
        <div className="card" style={{ padding: 'var(--sp-8)' }}>
          {/* Icon + Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-4)', marginBottom: 'var(--sp-6)' }}>
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: 'var(--radius-md)',
                background: 'var(--primary-bg)',
                border: '1px solid var(--primary-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {stepIcons[step]}
            </div>
            <div>
              <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                {meta.title}
              </h2>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 4 }}>
                {meta.subtitle}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }} noValidate>
            {step === 'email' && (
              <div className="form-group">
                <label className="form-label" htmlFor="fp-email">Email Address</label>
                <div className="input-with-icon">
                  <Mail size={16} className="input-icon" />
                  <input
                    id="fp-email"
                    className="input-field"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
              </div>
            )}

            {step === 'otp' && (
              <div className="form-group">
                <label className="form-label" htmlFor="fp-otp">
                  OTP Code
                  <span style={{ color: 'var(--text-muted)', fontWeight: 400, marginLeft: 'var(--sp-2)' }}>
                    Sent to {email}
                  </span>
                </label>
                <div className="input-with-icon">
                  <Key size={16} className="input-icon" />
                  <input
                    id="fp-otp"
                    className="input-field"
                    type="text"
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={10}
                    style={{ letterSpacing: '4px', fontWeight: 700 }}
                  />
                </div>
              </div>
            )}

            {step === 'newPassword' && (
              <>
                <div className="form-group">
                  <label className="form-label" htmlFor="fp-new-pw">New Password</label>
                  <div className="input-with-icon">
                    <ShieldCheck size={16} className="input-icon" />
                    <input
                      id="fp-new-pw"
                      className="input-field"
                      type={showNew ? 'text' : 'password'}
                      placeholder="Min 8 chars with uppercase, number..."
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <button type="button" className="input-action" onClick={() => setShowNew(!showNew)}>
                      {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="fp-confirm-pw">Confirm Password</label>
                  <div className="input-with-icon">
                    <ShieldCheck size={16} className="input-icon" />
                    <input
                      id="fp-confirm-pw"
                      className="input-field"
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Repeat your new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      style={{ borderColor: confirmPassword && confirmPassword !== newPassword ? 'var(--error)' : undefined }}
                    />
                    <button type="button" className="input-action" onClick={() => setShowConfirm(!showConfirm)}>
                      {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {confirmPassword && confirmPassword !== newPassword && (
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--error)' }}>Passwords do not match</span>
                  )}
                </div>
              </>
            )}

            {error && <div className="alert alert-error animate-fade-in">{error}</div>}
            {success && (
              <div className="alert alert-success animate-fade-in">
                <CheckCircle2 size={16} /> {success}
              </div>
            )}

            <button
              id="fp-submit"
              type="submit"
              disabled={isLoading}
              className="btn btn-primary btn-lg btn-full"
              style={{ marginTop: 'var(--sp-2)' }}
            >
              {isLoading ? (
                <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Processing...</>
              ) : (
                <>{btnLabel} <ArrowRight size={16} /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
