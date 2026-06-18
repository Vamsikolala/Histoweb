import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { API_BASE_URL } from '../utils/api';
import { Save, User, Calendar, Phone, MapPin, Activity } from 'lucide-react';

export const EditPatient: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const doctorId = localStorage.getItem('doctor_id');

  const [formData, setFormData] = useState({
    name: '', age: '', gender: 'Male', phone: '', address: '', diagnosis: ''
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/patient_profile.php?patient_id=${id}&doctor_id=${doctorId}`);
        const data = await res.json();
        if (data.status && data.patient) {
          setFormData({
            name: data.patient.name || '',
            age: data.patient.age || '',
            gender: data.patient.gender || 'Male',
            phone: data.patient.phone || '',
            address: data.patient.address || '',
            diagnosis: data.patient.diagnosis || '',
          });
        } else {
          setError(data.message || 'Failed to load patient data');
        }
      } catch {
        setError('Network error loading patient profile');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPatientData();
  }, [id, doctorId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/update_patient.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ doctor_id: doctorId || '', patient_id: id || '', ...formData }).toString(),
      });
      const data = await res.json();
      if (data.status) navigate(`/patient/${id}`);
      else setError(data.message || 'Failed to update patient');
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <Layout title="Edit Patient"><div className="loading-overlay"><div className="spinner" /><span>Loading...</span></div></Layout>;
  }

  return (
    <Layout title="Edit Patient" subtitle={`Updating record for patient #${id}`}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <form onSubmit={handleSubmit} className="animate-fade-in">
          <div className="card" style={{ padding: 'var(--sp-6)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', marginBottom: 'var(--sp-6)' }}>
              <User size={16} color="var(--primary)" />
              <h3 style={{ margin: 0, fontSize: 'var(--text-base)', fontWeight: 700 }}>Patient Information</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="ep-name">Full Name <span style={{ color: 'var(--error)' }}>*</span></label>
                <div className="input-with-icon">
                  <User size={14} className="input-icon" />
                  <input id="ep-name" name="name" className="input-field" type="text" value={formData.name} onChange={handleChange} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="ep-age">Age <span style={{ color: 'var(--error)' }}>*</span></label>
                  <div className="input-with-icon">
                    <Calendar size={14} className="input-icon" />
                    <input id="ep-age" name="age" className="input-field" type="number" value={formData.age} onChange={handleChange} required min="0" max="150" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="ep-gender">Gender <span style={{ color: 'var(--error)' }}>*</span></label>
                  <select id="ep-gender" name="gender" className="input-field" value={formData.gender} onChange={handleChange} required>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="ep-phone">Phone Number</label>
                <div className="input-with-icon">
                  <Phone size={14} className="input-icon" />
                  <input id="ep-phone" name="phone" className="input-field" type="tel" value={formData.phone} onChange={handleChange} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="ep-address">Address</label>
                <div className="input-with-icon">
                  <MapPin size={14} className="input-icon" />
                  <input id="ep-address" name="address" className="input-field" type="text" value={formData.address} onChange={handleChange} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="ep-diagnosis">Initial Diagnosis</label>
                <div className="input-with-icon">
                  <Activity size={14} className="input-icon" />
                  <input id="ep-diagnosis" name="diagnosis" className="input-field" type="text" value={formData.diagnosis} onChange={handleChange} />
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="alert alert-error animate-fade-in" style={{ marginTop: 'var(--sp-4)' }}>{error}</div>
          )}

          <div style={{ display: 'flex', gap: 'var(--sp-3)', marginTop: 'var(--sp-5)', justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-ghost btn-lg" onClick={() => navigate(`/patient/${id}`)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-lg" disabled={isSaving} id="edit-patient-save">
              {isSaving
                ? <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Updating...</>
                : <><Save size={18} /> Update Patient</>}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};
