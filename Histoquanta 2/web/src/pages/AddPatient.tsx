import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { API_BASE_URL } from '../utils/api';
import { Save, ArrowLeft } from 'lucide-react';

export const AddPatient: React.FC = () => {
  const navigate = useNavigate();
  const doctorId = localStorage.getItem('doctor_id');
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    phone: '',
    address: '',
    diagnosis: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    let value = e.target.value;
    if (e.target.name === 'name') {
      value = value.replace(/[^a-zA-Z\s]/g, '');
    } else if (e.target.name === 'phone') {
      value = value.replace(/[^0-9]/g, '').slice(0, 10);
    }
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate Name (letters and spaces only)
    if (!/^[a-zA-Z\s]+$/.test(formData.name.trim())) {
      setError('Patient name must contain only letters.');
      return;
    }

    // Validate Phone (exactly 10 digits and only numbers if provided)
    if (formData.phone.trim()) {
      const cleanPhone = formData.phone.replace(/[\s\-()+\b]/g, '');
      if (!/^[0-9]{10}$/.test(cleanPhone)) {
        setError('Phone number must be exactly 10 digits and contain no characters.');
        return;
      }
    }

    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/add_patient.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          doctor_id: doctorId || '',
          ...formData
        }).toString()
      });
      
      const data = await response.json();
      
      if (data.status) {
        navigate('/dashboard');
      } else {
        setError(data.message || 'Failed to add patient');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout title="Add New Patient">
      <div style={{ marginBottom: '1.5rem' }}>
        <button className="btn btn-secondary" onClick={() => navigate('/dashboard')} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
          <ArrowLeft size={16} /> Cancel
        </button>
      </div>
      
      <div className="glass-panel" style={{ padding: '2.5rem', maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem', color: 'var(--color-text)' }}>Patient Information</h2>
        
        {error && <div className="auth-error" style={{ marginBottom: '1.5rem' }}>{error}</div>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="form-group">
            <label className="input-label" htmlFor="name">Full Name *</label>
            <input type="text" id="name" name="name" className="input-field" value={formData.name} onChange={handleChange} required />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="input-label" htmlFor="age">Age *</label>
              <input type="number" id="age" name="age" className="input-field" value={formData.age} onChange={handleChange} required min="0" max="150" />
            </div>
            
            <div className="form-group">
              <label className="input-label" htmlFor="gender">Gender *</label>
              <select id="gender" name="gender" className="input-field" value={formData.gender} onChange={handleChange} required>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label className="input-label" htmlFor="phone">Phone Number</label>
            <input type="tel" id="phone" name="phone" className="input-field" value={formData.phone} onChange={handleChange} />
          </div>
          
          <div className="form-group">
            <label className="input-label" htmlFor="address">Address</label>
            <textarea id="address" name="address" className="input-field" value={formData.address} onChange={handleChange} rows={3} style={{ resize: 'vertical' }} />
          </div>
          
          <div className="form-group">
            <label className="input-label" htmlFor="diagnosis">Initial Diagnosis</label>
            <input type="text" id="diagnosis" name="diagnosis" className="input-field" value={formData.diagnosis} onChange={handleChange} placeholder="e.g., Suspected Carcinoma" />
          </div>
          
          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary" disabled={isLoading} style={{ minWidth: '150px' }}>
              {isLoading ? 'Saving...' : <><Save size={18} /> Save Patient</>}
            </button>
          </div>
          
        </form>
      </div>
    </Layout>
  );
};
