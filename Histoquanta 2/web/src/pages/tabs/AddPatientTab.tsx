import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../../utils/api';
import {
  UserPlus, Hash, User, Calendar, Phone, MapPin,
  Stethoscope, FileText, Activity, CheckCircle2, AlertTriangle, Image as ImageIcon, Paperclip
} from 'lucide-react';
import { usePatientSession } from '../../context/PatientSessionContext';

interface FieldConfig {
  key: string;
  label: string;
  icon: React.ReactNode;
  placeholder: string;
  type?: string;
  disabled?: boolean;
}

export const AddPatientTab: React.FC = () => {
  const [patientID, setPatientID] = useState('Loading...');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [reportType, setReportType] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');

  const [saveMessage, setSaveMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const { selectPatient } = usePatientSession();
  const doctorId = localStorage.getItem('doctor_id');
  const storedDoctorName = localStorage.getItem('doctor_name');

  useEffect(() => {
    if (storedDoctorName) setDoctorName(storedDoctorName);
    fetchNextPatientID();
  }, []);

  const fetchNextPatientID = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/get_next_patient_id.php?doctor_id=${doctorId}`);
      const data = await res.json();
      if (data.status && data.next_id) setPatientID(data.next_id);
    } catch { /* ignore */ }
  };

  const savePatient = async () => {
    if (!name.trim() || !age.trim() || !gender.trim()) {
      setSaveMessage('Please fill in all required fields (Name, Age, Gender).');
      setShowSuccess(false);
      return;
    }

    // Validate Name (letters and spaces only)
    if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
      setSaveMessage('Patient name must contain only letters.');
      setShowSuccess(false);
      return;
    }

    // Validate Phone (exactly 10 digits and only numbers if provided)
    if (phone.trim()) {
      const cleanPhone = phone.replace(/[\s\-()+\b]/g, '');
      if (!/^[0-9]{10}$/.test(cleanPhone)) {
        setSaveMessage('Phone number must be exactly 10 digits and contain no characters.');
        setShowSuccess(false);
        return;
      }
    }

    setIsSaving(true);
    setSaveMessage('');

    try {
      const patRes = await fetch(`${API_BASE_URL}/add_patient.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ patient_id: patientID, name, age, gender, phone, address, doctor_id: doctorId || '' }).toString(),
      });
      const patData = await patRes.json();

      if (!patData.status) {
        setSaveMessage(patData.message || 'Failed to add patient');
        setShowSuccess(false);
        return;
      }

      const returnedId = patData.patient_id?.toString() || patientID;
      const fullReport = `Diagnosis: ${diagnosis}\nNotes: ${notes}\nReport Type: ${reportType}`;

      await fetch(`${API_BASE_URL}/add_disease.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ doctor_id: doctorId || '', patient_id: returnedId, report_type: reportType, diagnosis, notes, report: fullReport }).toString(),
      });

      setSaveMessage('Patient registered and report saved successfully!');
      setShowSuccess(true);

      selectPatient({ patient_id: returnedId, name, age, gender, phone, address, reportType, diagnosis, notes, fullReport });

      setName(''); setAge(''); setGender(''); setPhone(''); setAddress('');
      setReportType(''); setDiagnosis(''); setNotes('');
      fetchNextPatientID();
    } catch {
      setSaveMessage('Error saving patient. Please try again.');
      setShowSuccess(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>
      {/* Header */}
      <div
        style={{
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border)',
          padding: 'var(--sp-6)',
        }}
      >
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 'var(--radius-md)',
                background: 'var(--primary-bg)',
                border: '1px solid var(--primary-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <UserPlus size={20} color="var(--primary)" />
            </div>
            <div>
              <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Patient Registry
              </h1>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', margin: 0 }}>
                Register a new patient and create initial report
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: 'var(--sp-6)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-6)' }} className="animate-fade-in">

          {/* Left Column: Patient Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
            <div className="card" style={{ padding: 'var(--sp-5)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', marginBottom: 'var(--sp-5)' }}>
                <User size={16} color="var(--primary)" />
                <h3 style={{ margin: 0, fontSize: 'var(--text-base)', fontWeight: 700 }}>Patient Information</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
                {/* Patient ID (read-only) */}
                <div className="form-group">
                  <label className="form-label">Patient ID</label>
                  <div className="input-with-icon">
                    <Hash size={14} className="input-icon" />
                    <input className="input-field" value={patientID} disabled style={{ fontWeight: 700, color: 'var(--primary)' }} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="ap-name">Full Name <span style={{ color: 'var(--error)' }}>*</span></label>
                  <div className="input-with-icon">
                    <User size={14} className="input-icon" />
                    <input id="ap-name" className="input-field" type="text" placeholder="Patient's full name" value={name} onChange={(e) => setName(e.target.value.replace(/[^a-zA-Z\s]/g, ''))} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-3)' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="ap-age">Age <span style={{ color: 'var(--error)' }}>*</span></label>
                    <div className="input-with-icon">
                      <Calendar size={14} className="input-icon" />
                      <input id="ap-age" className="input-field" type="number" placeholder="e.g. 45" value={age} onChange={(e) => setAge(e.target.value)} min="0" max="150" />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="ap-gender">Gender <span style={{ color: 'var(--error)' }}>*</span></label>
                    <select id="ap-gender" className="input-field" value={gender} onChange={(e) => setGender(e.target.value)}>
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="ap-phone">Phone Number</label>
                  <div className="input-with-icon">
                    <Phone size={14} className="input-icon" />
                    <input id="ap-phone" className="input-field" type="tel" placeholder="+91 XXXXX XXXXX" value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="ap-address">Address</label>
                  <div className="input-with-icon">
                    <MapPin size={14} className="input-icon" />
                    <input id="ap-address" className="input-field" type="text" placeholder="City, State" value={address} onChange={(e) => setAddress(e.target.value)} />
                  </div>
                </div>
              </div>
            </div>

            {/* Attachments Card */}
            <div className="card" style={{ padding: 'var(--sp-5)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', marginBottom: 'var(--sp-4)' }}>
                <Paperclip size={16} color="var(--primary)" />
                <h3 style={{ margin: 0, fontSize: 'var(--text-base)', fontWeight: 700 }}>Attachments</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-3)' }}>
                <button className="btn btn-secondary btn-full" style={{ flexDirection: 'column', gap: 'var(--sp-1)', padding: 'var(--sp-4)' }}>
                  <ImageIcon size={18} />
                  <span>Add Scan</span>
                </button>
                <button className="btn btn-ghost btn-full" style={{ flexDirection: 'column', gap: 'var(--sp-1)', padding: 'var(--sp-4)' }}>
                  <FileText size={18} />
                  <span>Add Document</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Report Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
            <div className="card" style={{ padding: 'var(--sp-5)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', marginBottom: 'var(--sp-5)' }}>
                <FileText size={16} color="var(--primary)" />
                <h3 style={{ margin: 0, fontSize: 'var(--text-base)', fontWeight: 700 }}>Initial Report</h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="ap-doctor">Referring Doctor</label>
                  <div className="input-with-icon">
                    <Stethoscope size={14} className="input-icon" />
                    <input id="ap-doctor" className="input-field" type="text" value={doctorName} onChange={(e) => setDoctorName(e.target.value)} placeholder="Doctor name" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="ap-report-type">Report Type</label>
                  <div className="input-with-icon">
                    <FileText size={14} className="input-icon" />
                    <input id="ap-report-type" className="input-field" type="text" placeholder="e.g. Biopsy, Histopathology" value={reportType} onChange={(e) => setReportType(e.target.value)} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="ap-diagnosis">Diagnosis</label>
                  <div className="input-with-icon">
                    <Activity size={14} className="input-icon" />
                    <input id="ap-diagnosis" className="input-field" type="text" placeholder="Initial clinical diagnosis" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="ap-notes">Report Notes</label>
                  <textarea
                    id="ap-notes"
                    className="input-field"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Additional clinical notes, observations..."
                    style={{ minHeight: 120 }}
                  />
                </div>
              </div>
            </div>

            {/* Message */}
            {saveMessage && (
              <div className={`alert ${showSuccess ? 'alert-success' : 'alert-error'} animate-fade-in`}>
                {showSuccess ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
                <span>{saveMessage}</span>
              </div>
            )}

            {/* Save Button */}
            <button
              id="save-patient-btn"
              onClick={savePatient}
              disabled={isSaving}
              className="btn btn-primary btn-lg btn-full"
            >
              {isSaving ? (
                <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Saving...</>
              ) : (
                <><CheckCircle2 size={18} /> Save Patient & Report</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
