import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../utils/api';
import { Search, Users, CheckCircle2, Trash2, ChevronRight, RefreshCw } from 'lucide-react';
import { usePatientSession, type Patient } from '../../context/PatientSessionContext';

interface SearchTabProps {
  onPatientSelect?: () => void;
}

export const SearchTab: React.FC<SearchTabProps> = ({ onPatientSelect }) => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const doctorId = localStorage.getItem('doctor_id');
  const { selectPatient } = usePatientSession();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/get_patients.php?doctor_id=${doctorId}`);
      const data = await res.json();
      if (data.status) {
        setPatients(
          (data.data || []).map((p: any) => ({
            patient_id: p.id || p.patient_id,
            name: p.name,
            age: p.age,
            gender: p.gender,
            diagnosis: p.diagnosis || 'N/A',
            reportType: p.reportType || 'N/A',
            phone: p.phone,
            address: p.address || '',
          }))
        );
        setErrorMsg('');
      } else {
        setErrorMsg(data.message || 'Failed to load patients');
      }
    } catch {
      setErrorMsg('Connection error. Please check your network.');
    } finally {
      setIsLoading(false);
    }
  };

  const deletePatient = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this patient? This cannot be undone.')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/delete_patient.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ patient_id: id, doctor_id: doctorId || '' }).toString(),
      });
      const data = await res.json();
      if (data.status) setPatients(patients.filter((p) => p.patient_id !== id));
      else alert(data.message || 'Failed to delete');
    } catch {
      alert('Delete error');
    }
  };

  const handleSelect = (patient: Patient) => {
    selectPatient(patient);
    if (onPatientSelect) onPatientSelect();
  };

  const filtered = patients.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.patient_id.toLowerCase().includes(q) ||
      (p.diagnosis && p.diagnosis.toLowerCase().includes(q)) ||
      (p.reportType && p.reportType.toLowerCase().includes(q))
    );
  });

  const getInitials = (name: string) =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>
      {/* Header */}
      <div
        style={{
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border)',
          padding: 'var(--sp-6)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--sp-4)' }}>
            <div>
              <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Patient Search
              </h1>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', margin: 0 }}>
                {patients.length} patient{patients.length !== 1 ? 's' : ''} registered
              </p>
            </div>
            <button
              onClick={fetchPatients}
              className="btn btn-ghost btn-icon"
              id="search-refresh-btn"
              title="Refresh"
              style={{ flexShrink: 0 }}
            >
              <RefreshCw size={16} style={{ animation: isLoading ? 'spin 0.8s linear infinite' : 'none' }} />
            </button>
          </div>

          {/* Search Input */}
          <div className="input-with-icon">
            <Search size={16} className="input-icon" />
            <input
              id="patient-search-input"
              className="input-field"
              type="text"
              placeholder="Search by name, ID, diagnosis, or report type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: 'var(--sp-6)' }}>
        {errorMsg && (
          <div className="alert alert-error mb-4">{errorMsg}</div>
        )}

        {isLoading ? (
          <div className="loading-overlay">
            <div className="spinner" />
            <span>Loading patients...</span>
          </div>
        ) : patients.length === 0 && !errorMsg ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Users size={28} color="var(--gray-400)" />
            </div>
            <h3>No patients yet</h3>
            <p>Add your first patient using the "Add Patient" tab</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Search size={28} color="var(--gray-400)" />
            </div>
            <h3>No matching patients</h3>
            <p>Try adjusting your search query</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }} className="animate-fade-in">
            {filtered.map((patient) => (
              <div
                key={patient.patient_id}
                className="card card-hover"
                id={`patient-card-${patient.patient_id}`}
                onClick={() => navigate(`/patient/${patient.patient_id}`)}
              >
                <div style={{ padding: 'var(--sp-4) var(--sp-5)', display: 'flex', alignItems: 'center', gap: 'var(--sp-4)' }}>
                  {/* Avatar */}
                  <div
                    className="avatar avatar-md"
                    style={{ flexShrink: 0, fontSize: 'var(--text-sm)', fontWeight: 700 }}
                  >
                    {getInitials(patient.name)}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {patient.name}
                      </span>
                      <span className="badge badge-gray" style={{ fontSize: '11px' }}>
                        {patient.gender}, {patient.age}y
                      </span>
                    </div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 2 }}>
                      ID: <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{patient.patient_id}</span>
                      {patient.diagnosis && patient.diagnosis !== 'N/A' && (
                        <> · {patient.diagnosis}</>
                      )}
                    </div>
                    {patient.reportType && patient.reportType !== 'N/A' && (
                      <span className="badge badge-blue" style={{ marginTop: 'var(--sp-2)', fontSize: '11px' }}>
                        {patient.reportType}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', flexShrink: 0 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleSelect(patient)}
                      id={`select-patient-${patient.patient_id}`}
                    >
                      <CheckCircle2 size={14} /> Select
                    </button>
                    <button
                      className="btn btn-danger btn-icon btn-sm"
                      onClick={() => deletePatient(patient.patient_id)}
                      id={`delete-patient-${patient.patient_id}`}
                      title="Delete patient"
                    >
                      <Trash2 size={14} />
                    </button>
                    <ChevronRight size={16} color="var(--text-light)" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
