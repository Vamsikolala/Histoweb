import React, { useState } from 'react';
import { HomeTab } from './tabs/HomeTab';
import { SearchTab } from './tabs/SearchTab';
import { AddPatientTab } from './tabs/AddPatientTab';
import { DoctorProfileTab } from './tabs/DoctorProfileTab';
import { Home, Search, UserPlus, UserCircle2 } from 'lucide-react';
import { Sidebar } from '../components/Sidebar';

export const MainTabBar: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const tabs = [
    { icon: <Home size={20} />, label: 'Home' },
    { icon: <Search size={20} />, label: 'Search' },
    { icon: <UserPlus size={20} />, label: 'Add' },
    { icon: <UserCircle2 size={20} />, label: 'Profile' },
  ];

  return (
    <div className="app-layout">
      {/* Desktop Sidebar */}
      <div className="sidebar-area">
        <Sidebar selectedTab={selectedTab} onTabChange={setSelectedTab} />
      </div>

      {/* Content Area */}
      <div className="content-area">
        {selectedTab === 0 && <HomeTab onNavigateToSearch={() => setSelectedTab(1)} />}
        {selectedTab === 1 && <SearchTab onPatientSelect={() => setSelectedTab(0)} />}
        {selectedTab === 2 && <AddPatientTab />}
        {selectedTab === 3 && <DoctorProfileTab />}
      </div>

      {/* Mobile Bottom Tab Bar */}
      <div className="bottom-tab-bar">
        <div className="bottom-tab-bar-inner">
          {tabs.map((tab, index) => (
            <button
              key={index}
              id={`mobile-tab-${index}`}
              className={`tab-item ${selectedTab === index ? 'active' : ''}`}
              onClick={() => setSelectedTab(index)}
            >
              <div className="tab-icon">{tab.icon}</div>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
