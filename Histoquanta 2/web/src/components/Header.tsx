import React from 'react';
import { Stethoscope, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
  showProfileInfo?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ title, showProfileInfo = true }) => {
  const navigate = useNavigate();
  const doctorName = localStorage.getItem('doctor_name') || 'Doctor';
  const specialization = localStorage.getItem('specialization') || 'Pathology';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <header className="header glass-panel">
      <div className="header-container">
        <div className="header-title">
          <Stethoscope className="header-icon" size={24} />
          <h1>{title}</h1>
        </div>

        {showProfileInfo && (
          <div className="header-profile">
            <div className="profile-info">
              <span className="doctor-name">
                {/^(dr\.\s*|dr\s*)/i.test(doctorName) ? doctorName.replace(/^(dr\.\s*|dr\s*)+/i, 'Dr. ') : `Dr. ${doctorName}`}
              </span>
              <span className="doctor-spec">{specialization}</span>
            </div>
            <div className="avatar">
              <User size={20} />
            </div>
            <button className="logout-btn" onClick={handleLogout} title="Logout">
              <LogOut size={18} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
