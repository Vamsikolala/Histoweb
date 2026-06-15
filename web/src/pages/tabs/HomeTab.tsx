import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePatientSession } from '../../context/PatientSessionContext';
import { CheckCircle2, X, AlertCircle, Microscope } from 'lucide-react';

const tissues = [
  { id: 1, title: 'Breast Cancer',      desc: 'Quantitative ER, PR, HER2 & Ki67 IHC profiling',     image: '/images/Breast.jpeg',        route: 'breast',      color: '#FFE4E8', border: '#FECDD3', icon: '🩺' },
  { id: 2, title: 'Thyroid nodules',    desc: 'Bravman & Bethesda cellular classification',          image: '/images/Thyroid.jpeg',       route: 'thyroid',     color: '#FEF3C7', border: '#FDE68A', icon: '🦋' },
  { id: 3, title: 'Gastrointestinal',   desc: 'GIST risk stratification & mitotic assessments',       image: '/images/GIT.jpeg',           route: 'git',         color: '#D1FAE5', border: '#6EE7B7', icon: '🔬' },
  { id: 4, title: 'Soft Tissue',        desc: 'Sarcoma tumor grading & tissue differentiation',      image: '/images/soft tissue.jpeg',   route: 'softtissue',  color: '#E0E7FF', border: '#A5B4FC', icon: '🧬' },
  { id: 5, title: 'Head & Neck',        desc: 'Squamous cell carcinoma staging & grading',           image: '/images/Head Neck.jpeg',     route: 'headneck',    color: '#FCE7F3', border: '#F9A8D4', icon: '💊' },
  { id: 6, title: 'Lungs Adeno',        desc: 'Leapidic growth subtypes & invasive margin scoring',  image: '/images/Lungs.jpeg',         route: 'lungs',       color: '#E0F2FE', border: '#7DD3FC', icon: '💨' },
];

interface HomeTabProps {
  onNavigateToSearch?: () => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({ onNavigateToSearch }) => {
  const doctorName = localStorage.getItem('doctor_name') || 'Doctor';
  const specialization = localStorage.getItem('specialization') || 'Pathologist';
  const { currentPatient, clearSession } = usePatientSession();
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const h = new Date().getHours();
    if (h >= 5 && h < 12) setGreeting('Good morning');
    else if (h >= 12 && h < 17) setGreeting('Good afternoon');
    else if (h >= 17 && h < 21) setGreeting('Good evening');
    else setGreeting('Good night');
  }, []);

  const displayName = doctorName.toLowerCase().startsWith('dr.') ? doctorName : `Dr. ${doctorName}`;
  const initials = doctorName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'DR';

  const handleTissueClick = (t: typeof tissues[0]) => {
    if (!currentPatient) {
      if (onNavigateToSearch) onNavigateToSearch();
      else alert('Please select a patient from the Search Patients tab first.');
      return;
    }
    navigate(`/patient/${currentPatient.patient_id}/modules/${t.route}`);
  };

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh', paddingBottom: 'var(--sp-12)' }}>
      {/* Welcome Header with modern subtle gradient & curved borders */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, var(--primary) 70%, #2563eb 100%)',
          padding: 'var(--sp-12) var(--sp-6) var(--sp-16)',
          position: 'relative',
          overflow: 'hidden',
          borderBottomLeftRadius: '24px',
          borderBottomRightRadius: '24px',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        {/* Background pattern */}
        <div
          style={{
            position: 'absolute', inset: 0,
            background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.03\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'4\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            pointerEvents: 'none',
          }}
        />

        <div style={{ maxWidth: '1080px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'var(--text-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>
                {greeting},
              </p>
              <h1 style={{ color: 'white', fontSize: 'var(--text-3xl)', fontWeight: 900, margin: '8px 0 4px', letterSpacing: '-0.5px' }}>
                {displayName}
              </h1>
              {specialization && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--sp-2)', background: 'rgba(255,255,255,0.12)', padding: '4px 12px', borderRadius: '99px', marginTop: 'var(--sp-1)' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#60a5fa' }} />
                  <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: 'var(--text-xs)', fontWeight: 600, margin: 0 }}>
                    {specialization}
                  </p>
                </div>
              )}
            </div>

            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.18)',
                border: '2px solid rgba(255,255,255,0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 900,
                fontSize: 'var(--text-lg)',
                flexShrink: 0,
                boxShadow: 'var(--shadow)',
              }}
            >
              {initials}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div
        style={{
          maxWidth: '1080px',
          margin: '0 auto',
          padding: '0 var(--sp-6)',
          marginTop: '-45px', // Fixed the incorrect -var() syntax to overlay beautifully
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* Active Patient Session Banner */}
        {currentPatient ? (
          <div className="session-banner animate-fade-in-up" style={{ marginBottom: 'var(--sp-6)', boxShadow: 'var(--shadow)', border: '1px solid #86efac' }}>
            <CheckCircle2 size={22} color="var(--success)" style={{ flexShrink: 0 }} />
            <div className="session-info">
              <div className="session-name" style={{ fontSize: 'var(--text-base)', fontWeight: 800 }}>{currentPatient.name}</div>
              <div className="session-id" style={{ fontSize: 'var(--text-xs)', fontWeight: 500 }}>ID: {currentPatient.patient_id} · Active screening session</div>
            </div>
            <button
              onClick={clearSession}
              className="btn btn-danger btn-sm"
              id="home-clear-session"
              style={{ borderRadius: '8px', padding: '6px 12px' }}
            >
              <X size={14} /> Finish Session
            </button>
          </div>
        ) : (
          <div
            className="animate-fade-in-up"
            style={{
              background: 'linear-gradient(to right, var(--primary-bg), #dbeafe)',
              border: '1.5px dashed var(--primary-border)',
              borderRadius: '16px',
              padding: 'var(--sp-5) var(--sp-6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 'var(--sp-4)',
              marginBottom: 'var(--sp-6)',
              cursor: onNavigateToSearch ? 'pointer' : 'default',
              boxShadow: 'var(--shadow-sm)',
              transition: 'var(--transition)',
            }}
            onMouseOver={(e) => {
              if (onNavigateToSearch) e.currentTarget.style.borderColor = 'var(--primary)';
            }}
            onMouseOut={(e) => {
              if (onNavigateToSearch) e.currentTarget.style.borderColor = 'var(--primary-border)';
            }}
            onClick={() => onNavigateToSearch && onNavigateToSearch()}
            id="home-select-patient-banner"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-4)' }}>
              <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-xs)' }}>
                <AlertCircle size={22} color="var(--primary)" />
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-base)', fontWeight: 700, color: 'var(--primary)' }}>
                  No Patient Selected
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: '2px', fontWeight: 500 }}>
                  Select a patient to enable tissue-specific clinical analysis scoring.
                </div>
              </div>
            </div>
            {onNavigateToSearch && (
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Search patients &rarr;
              </span>
            )}
          </div>
        )}

        {/* Section Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', marginBottom: 'var(--sp-6)', paddingLeft: '4px' }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: '12px',
              background: 'var(--primary-bg)',
              border: '1.5px solid var(--primary-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-xs)',
            }}
          >
            <Microscope size={20} color="var(--primary)" />
          </div>
          <div>
            <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.3px' }}>
              Clinical Analysis Modules
            </h2>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', margin: '2px 0 0', fontWeight: 500 }}>
              Select a clinical module to perform tumor grading and IHC scoring
            </p>
          </div>
        </div>

        {/* Tissue Grid - upgraded grid layout */}
        <div 
          className="tissue-grid animate-fade-in-up" 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
            gap: 'var(--sp-5)' 
          }}
        >
          {tissues.map((tissue) => (
            <div
              key={tissue.id}
              onClick={() => handleTissueClick(tissue)}
              id={`tissue-${tissue.route}`}
              style={{
                background: 'white',
                border: '1px solid var(--border)',
                borderRadius: '20px',
                padding: 'var(--sp-5)',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--sp-4)',
                cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: 'var(--shadow-sm)',
                opacity: currentPatient ? 1 : 0.82,
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                e.currentTarget.style.borderColor = 'var(--primary-border)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                e.currentTarget.style.borderColor = 'var(--border)';
              }}
            >
              {/* Colored tag line */}
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: tissue.border }} />

              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '16px',
                  background: tissue.color,
                  border: `2px solid ${tissue.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  flexShrink: 0,
                  boxShadow: 'var(--shadow-xs)',
                }}
              >
                <img
                  src={tissue.image}
                  alt={tissue.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                    (e.currentTarget.parentElement as HTMLDivElement).innerHTML = `<span style="font-size:26px">${tissue.icon}</span>`;
                  }}
                />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {tissue.title}
                  {!currentPatient && (
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', background: 'var(--gray-100)', padding: '2px 6px', borderRadius: '4px', fontWeight: 500 }}>Locked</span>
                  )}
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: '4px', lineHeight: 1.4, fontWeight: 500 }}>
                  {tissue.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
