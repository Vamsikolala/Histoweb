import React from 'react';
import { Home, Search, UserPlus, UserCircle2, LogOut, BriefcaseMedical, CheckCircle2, X } from 'lucide-react';
import { usePatientSession } from '../context/PatientSessionContext';

interface SidebarProps {
  selectedTab: number;
  onTabChange: (tab: number) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ selectedTab, onTabChange }) => {
  const { currentPatient, clearSession } = usePatientSession();

  const navItems = [
    { icon: <Home size={18} />, label: 'Home', tab: 0 },
    { icon: <Search size={18} />, label: 'Search Patients', tab: 1 },
    { icon: <UserPlus size={18} />, label: 'Add Patient', tab: 2 },
    { icon: <UserCircle2 size={18} />, label: 'My Profile', tab: 3 },
  ];

  const doctorName = localStorage.getItem('doctor_name') || 'Doctor';
  const initials = doctorName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="sidebar animate-fade-in">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <BriefcaseMedical size={20} color="#fff" />
        </div>
        <div>
          <div className="sidebar-logo-text">HistoQuanta</div>
          <div className="sidebar-logo-sub">SCREENING PORTAL</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Navigation</div>
        {navItems.map((item) => (
          <button
            key={item.tab}
            className={`sidebar-item ${selectedTab === item.tab ? 'active' : ''}`}
            onClick={() => onTabChange(item.tab)}
            id={`sidebar-tab-${item.tab}`}
          >
            <span className="item-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}

        {/* Active Patient Session */}
        {currentPatient && (
          <>
            <div className="sidebar-section-label" style={{ marginTop: 'var(--sp-4)' }}>Active Session</div>
            <div className="sidebar-patient-pill">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} color="var(--success)" />
                <span className="pill-label">Patient Selected</span>
              </div>
              <div className="pill-name">{currentPatient.name}</div>
              <div className="pill-id">ID: {currentPatient.patient_id}</div>
              <button className="pill-clear flex items-center gap-1" onClick={clearSession}>
                <X size={10} /> Clear Session
              </button>
            </div>
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="flex items-center gap-3">
          <div
            className="avatar avatar-sm"
            style={{ background: 'var(--primary-bg)', color: 'var(--primary)', fontWeight: 700, fontSize: '11px' }}
          >
            {initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="truncate" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
              {/^(dr\.\s*|dr\s*)/i.test(doctorName) ? doctorName.replace(/^(dr\.\s*|dr\s*)+/i, 'Dr. ') : `Dr. ${doctorName}`}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {localStorage.getItem('specialization') || 'Pathologist'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
