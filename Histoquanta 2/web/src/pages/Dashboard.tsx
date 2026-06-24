import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { API_BASE_URL } from '../utils/api';
import { Users, Search, ChevronRight, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Patient {
  patient_id: string;
  name: string;
  age: string;
  gender: string;
  diagnosis: string;
  phone: string;
}

export const Dashboard: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const doctorId = localStorage.getItem('doctor_id');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/get_patients.php?doctor_id=${doctorId}`);
      const data = await response.json();
      if (data.status) {
        // Map backend flat structure to React state interface
        const formattedPatients = (data.data || []).map((p: any) => ({
          patient_id: p.id,
          name: p.name,
          age: p.age,
          gender: p.gender,
          diagnosis: p.diagnosis || p.reportType || 'N/A',
          phone: p.phone
        }));
        setPatients(formattedPatients);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.patient_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout title="Clinical Dashboard">
      <div className="dashboard-header" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-primary-dark)' }}>Patients</h2>
          <p style={{ color: 'var(--color-text-muted)' }}>Manage and view patient records</p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
            <input 
              type="text" 
              className="input-field" 
              placeholder="Search patients..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/patient/add')} style={{ height: '100%', padding: '0.75rem 1.25rem' }}>
            <UserPlus size={18} /> Add Patient
          </button>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        {isLoading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            Loading patients...
          </div>
        ) : filteredPatients.length === 0 ? (
          <div style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <Users size={48} style={{ margin: '0 auto 1rem', color: 'var(--color-text-muted)', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>No patients found</h3>
            <p style={{ color: 'var(--color-text-muted)' }}>There are no patients matching your search criteria.</p>
          </div>
        ) : (
          <ul style={{ listStyle: 'none' }}>
            {filteredPatients.map((patient, index) => (
              <li 
                key={patient.patient_id} 
                onClick={() => navigate(`/patient/${patient.patient_id}`)}
                style={{ 
                  borderBottom: index < filteredPatients.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none',
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(15, 76, 129, 0.02)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', backgroundColor: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '1.25rem' }}>
                    {patient.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 600, fontSize: '1.125rem', color: 'var(--color-text)' }}>{patient.name}</h4>
                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                      <span>ID: {patient.patient_id}</span>
                      <span>{patient.gender}, {patient.age}y</span>
                      <span style={{ color: 'var(--color-secondary-dark)', fontWeight: 500 }}>{patient.diagnosis}</span>
                    </div>
                  </div>
                </div>
                <ChevronRight size={20} color="var(--color-text-muted)" />
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
};
