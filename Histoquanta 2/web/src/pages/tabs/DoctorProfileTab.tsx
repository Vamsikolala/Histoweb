import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import {
  Shield, FileText, Info, CreditCard, Mail, Phone,
  Edit2, X, LogOut, CheckCircle2, Building2, Stethoscope, Camera
} from 'lucide-react';

export const DoctorProfileTab: React.FC = () => {
  const navigate = useNavigate();
  const licenseNumber = localStorage.getItem('license_no') || '';
  const doctorId = localStorage.getItem('doctor_id') || '';

  const [doctorName, setDoctorName] = useState(localStorage.getItem('doctor_name') || '');
  const [specialization, setSpecialization] = useState(localStorage.getItem('specialization') || '');
  const [hospitalName, setHospitalName] = useState(localStorage.getItem('hospitalName') || '');
  const [email, setEmail] = useState(localStorage.getItem('email') || '');
  const [phoneNumber, setPhoneNumber] = useState(localStorage.getItem('phoneNumber') || '');
  const [profilePicURL, setProfilePicURL] = useState(localStorage.getItem('profile_pic') || '');

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string>('');

  const [isEditing, setIsEditing] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    if (!licenseNumber && !doctorId) return;
    try {
      const res = await fetch(`${API_BASE_URL}/doctor_profile.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ 
          doctor_id: doctorId,
          license_no: licenseNumber 
        }).toString(),
      });
      const data = await res.json();
      console.log("fetchProfile response:", data);
      if (data.status) {
        setDoctorName(data.name || '');
        setSpecialization(data.specialization || '');
        setHospitalName(data.hospital_name || '');
        setEmail(data.email || '');
        setPhoneNumber(data.phone_number || '');
        setProfilePicURL(data.profile_pic || '');
        
        // Sync to localStorage
        localStorage.setItem('doctor_name', data.name || '');
        localStorage.setItem('specialization', data.specialization || '');
        localStorage.setItem('hospitalName', data.hospital_name || '');
        localStorage.setItem('email', data.email || '');
        localStorage.setItem('phoneNumber', data.phone_number || '');
      }
    } catch (err) {
      console.error("fetchProfile error:", err);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      localStorage.clear();
      navigate('/login');
    }
  };

  const saveProfile = async () => {
    setIsSaving(true);
    setSaveMessage('');
    try {
      const formData = new FormData();
      formData.append('doctor_id', doctorId);
      formData.append('name', doctorName);
      formData.append('specialization', specialization);
      formData.append('hospital_name', hospitalName);
      formData.append('email', email);
      formData.append('phone_number', phoneNumber);
      if (selectedFile) {
        formData.append('profile_pic', selectedFile);
      }

      const res = await fetch(`${API_BASE_URL}/update_doctor_profile.php`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.status) {
        setSaveMessage('Profile updated successfully!');
        localStorage.setItem('doctor_name', doctorName);
        localStorage.setItem('specialization', specialization);
        localStorage.setItem('hospitalName', hospitalName);
        localStorage.setItem('email', email);
        localStorage.setItem('phoneNumber', phoneNumber);
        if (data.profile_pic) {
          setProfilePicURL(data.profile_pic);
          localStorage.setItem('profile_pic', data.profile_pic);
        }
        setSelectedFile(null);
        setPreviewURL('');
        setTimeout(() => { setIsEditing(false); setSaveMessage(''); }, 1200);
      } else {
        setSaveMessage(data.message || 'Update failed');
      }
    } catch {
      setSaveMessage('Error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  const initials = (doctorName || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'DR';

  const infoItems = [
    { icon: <CreditCard size={16} />, label: 'License Number', value: licenseNumber, color: 'var(--warning)' },
    { icon: <Mail size={16} />, label: 'Email', value: email, color: 'var(--primary)' },
    { icon: <Phone size={16} />, label: 'Phone', value: phoneNumber, color: 'var(--success)' },
    { icon: <Building2 size={16} />, label: 'Hospital / Clinic', value: hospitalName, color: 'var(--accent)' },
    { icon: <Stethoscope size={16} />, label: 'Specialization', value: specialization, color: 'var(--info)' },
  ];

  const settingsItems = [
    { icon: <FileText size={16} />, label: 'My Downloads', path: '/downloads', color: 'var(--success)' },
    { icon: <Shield size={16} />, label: 'Privacy Policy', path: '/privacy-policy', color: 'var(--primary)' },
    { icon: <FileText size={16} />, label: 'Terms & Conditions', path: '/terms-and-conditions', color: '#8B5CF6' },
    { icon: <Info size={16} />, label: 'About HistoQuanta', path: '/about', color: 'var(--accent)' },
  ];

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>
      {/* Profile Header */}
      <div className="profile-header" style={{ margin: 'var(--sp-6)', marginBottom: 0 }}>
        <div
          className={`avatar avatar-xl ${isEditing ? 'editable-avatar' : ''}`}
          onClick={() => {
            if (isEditing) {
              document.getElementById('profile-pic-input')?.click();
            }
          }}
          style={{
            border: '3px solid rgba(255,255,255,0.4)',
            background: 'rgba(255,255,255,0.15)',
            color: 'white',
            fontWeight: 800,
            cursor: isEditing ? 'pointer' : 'default',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {previewURL ? (
            <img src={previewURL} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : profilePicURL ? (
            <img src={`${API_BASE_URL}/uploads/profiles/${profilePicURL}`} alt={doctorName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            initials
          )}
          {isEditing && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                transition: 'opacity 0.2s',
              }}
            >
              <Camera size={20} style={{ opacity: 0.9 }} />
            </div>
          )}
        </div>
        <input
          type="file"
          id="profile-pic-input"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />

        <div className="profile-info" style={{ flex: 1 }}>
          <h2 style={{ margin: 0 }}>{doctorName || 'Doctor Name'}</h2>
          <p style={{ margin: '4px 0 0' }}>{specialization || 'Specialization'}</p>
          {hospitalName && (
            <p style={{ margin: '2px 0 0', color: 'rgba(255,255,255,0.65)', fontSize: 'var(--text-xs)' }}>
              🏥 {hospitalName}
            </p>
          )}
        </div>

        <button
          className="btn"
          onClick={() => {
            if (isEditing) {
              setSelectedFile(null);
              setPreviewURL('');
            }
            setIsEditing(!isEditing);
            setSaveMessage('');
          }}
          style={{
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.25)',
            color: 'white',
            borderRadius: 'var(--radius)',
            flexShrink: 0,
          }}
          id="profile-edit-toggle"
        >
          {isEditing ? <><X size={16} /> Cancel</> : <><Edit2 size={16} /> Edit Profile</>}
        </button>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: 'var(--sp-6)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>

        {/* Edit Form */}
        {isEditing ? (
          <div className="card animate-fade-in" style={{ padding: 'var(--sp-6)' }}>
            <h3 style={{ fontSize: 'var(--text-base)', fontWeight: 700, marginBottom: 'var(--sp-5)', display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
              <Edit2 size={16} color="var(--primary)" /> Edit Profile
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="profile-name">Full Name</label>
                <input id="profile-name" className="input-field" value={doctorName} onChange={(e) => setDoctorName(e.target.value)} placeholder="Dr. Full Name" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="profile-spec">Specialization</label>
                <input id="profile-spec" className="input-field" value={specialization} onChange={(e) => setSpecialization(e.target.value)} placeholder="e.g. Pathologist" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="profile-hospital">Hospital / Clinic</label>
                <input id="profile-hospital" className="input-field" value={hospitalName} onChange={(e) => setHospitalName(e.target.value)} placeholder="Hospital name" />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="profile-email">Email</label>
                <input id="profile-email" className="input-field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@hospital.com" />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label" htmlFor="profile-phone">Phone Number</label>
                <input id="profile-phone" className="input-field" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="+91 XXXXX XXXXX" />
              </div>
            </div>

            {saveMessage && (
              <div className={`alert ${saveMessage.includes('success') ? 'alert-success' : 'alert-error'} animate-fade-in mt-4`}>
                {saveMessage.includes('success') && <CheckCircle2 size={16} />} {saveMessage}
              </div>
            )}

            <button
              id="profile-save-btn"
              onClick={saveProfile}
              disabled={isSaving}
              className="btn btn-primary btn-lg btn-full"
              style={{ marginTop: 'var(--sp-5)' }}
            >
              {isSaving ? <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Saving...</> : <><CheckCircle2 size={18} /> Save Changes</>}
            </button>
          </div>
        ) : (
          <>
            {/* Contact Information */}
            <div className="card animate-fade-in">
              <div className="card-header" style={{ padding: 'var(--sp-4) var(--sp-5)', marginBottom: 0 }}>
                <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
                  Contact Information
                </h3>
              </div>
              {infoItems.map((item, i) => (
                <React.Fragment key={i}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-4)', padding: 'var(--sp-4) var(--sp-5)' }}>
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 'var(--radius)',
                        background: `${item.color}18`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: item.color,
                        flexShrink: 0,
                      }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontWeight: 600 }}>{item.label}</div>
                      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {item.value || <span style={{ color: 'var(--text-light)', fontStyle: 'italic' }}>Not set</span>}
                      </div>
                    </div>
                  </div>
                  {i < infoItems.length - 1 && <div className="divider" style={{ margin: 0 }} />}
                </React.Fragment>
              ))}
            </div>

            {/* Settings */}
            <div className="card animate-fade-in">
              <div className="card-header" style={{ padding: 'var(--sp-4) var(--sp-5)', marginBottom: 0 }}>
                <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: 0 }}>
                  Settings & Legal
                </h3>
              </div>
              {settingsItems.map((item, i) => (
                <React.Fragment key={i}>
                  <button
                    onClick={() => navigate(item.path)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 'var(--sp-4)',
                      padding: 'var(--sp-4) var(--sp-5)', width: '100%', background: 'none',
                      border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'var(--transition)',
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.background = 'var(--gray-50)')}
                    onMouseOut={(e) => (e.currentTarget.style.background = 'none')}
                    id={`settings-${item.path.replace('/', '')}`}
                  >
                    <div
                      style={{
                        width: 38, height: 38, borderRadius: 'var(--radius)',
                        background: `${item.color}18`, display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        color: item.color, flexShrink: 0,
                      }}
                    >
                      {item.icon}
                    </div>
                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', flex: 1 }}>
                      {item.label}
                    </span>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-light)' }}>View →</span>
                  </button>
                  {i < settingsItems.length - 1 && <div className="divider" style={{ margin: 0 }} />}
                </React.Fragment>
              ))}
            </div>
          </>
        )}

        {/* Logout Button */}
        <button
          id="profile-logout-btn"
          onClick={handleLogout}
          className="btn btn-danger btn-lg btn-full"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--sp-2)' }}
        >
          <LogOut size={18} /> Log Out
        </button>
      </div>
    </div>
  );
};
