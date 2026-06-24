import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../../../components/Layout';
import { ArrowLeft, Droplet, Hexagon, ChevronRight, Dna, Activity, BookOpen } from 'lucide-react';

export const BreastTypes: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const options = [
    {
      title: 'ER Assessment',
      subtitle: 'Estrogen Receptor Expression',
      desc: 'Predictive biomarker for endocrine/hormonal therapy response',
      icon: <Droplet size={22} color="var(--primary)" />,
      color: 'var(--primary-bg)',
      border: 'var(--primary-border)',
      badge: 'Allred & H-Score',
      badgeBg: 'var(--primary-bg)',
      badgeColor: 'var(--primary)',
      path: `/patient/${id}/modules/breast/er`
    },
    {
      title: 'PR Assessment',
      subtitle: 'Progesterone Receptor Expression',
      desc: 'Quantifies hormone receptor staining percentages and intensity',
      icon: <Hexagon size={22} color="#8b5cf6" />,
      color: '#f5f3ff',
      border: '#ddd6fe',
      badge: 'Allred & H-Score',
      badgeBg: '#f5f3ff',
      badgeColor: '#8b5cf6',
      path: `/patient/${id}/modules/breast/pr`
    },
    {
      title: 'HER2 Protocol',
      subtitle: 'Human Epidermal Growth Factor Receptor 2',
      desc: 'Membraneous staining scoring (0 to 3+) for Targeted Therapy',
      icon: <Dna size={22} color="var(--accent-dark)" />,
      color: 'var(--accent-light)',
      border: '#a7f3d0',
      badge: 'ASCO/CAP Staging',
      badgeBg: 'var(--accent-light)',
      badgeColor: 'var(--accent-dark)',
      path: `/patient/${id}/modules/breast/her2`
    },
    {
      title: 'Ki67 Proliferation',
      subtitle: 'Cell Proliferation Nuclear Marker',
      desc: 'Measures mitotic growth fraction to grade tumor aggressiveness',
      icon: <Activity size={22} color="var(--warning)" />,
      color: 'var(--warning-light)',
      border: '#fde68a',
      badge: 'Prognostic Fraction %',
      badgeBg: 'var(--warning-light)',
      badgeColor: 'var(--warning)',
      path: `/patient/${id}/modules/breast/ki67`
    }
  ];

  return (
    <Layout 
      title="Breast Oncology Pathology"
      actions={
        <button 
          onClick={() => navigate(`/patient/${id}/modules/breast/guidelines`)}
          className="btn btn-secondary btn-sm animate-scale-in"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '13px'
          }}
        >
          <BookOpen size={14} /> Guidelines
        </button>
      }
    >
      {/* Back button */}
      <div style={{ marginBottom: '1.5rem', padding: '0 var(--sp-6)' }}>
        <button 
          className="btn btn-secondary animate-fade-in" 
          onClick={() => navigate(`/patient/${id}/modules`)} 
          style={{ 
            padding: '8px 16px', 
            fontSize: 'var(--text-sm)', 
            borderRadius: '12px', 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px',
            fontWeight: 600
          }}
        >
          <ArrowLeft size={16} /> Back to Modules
        </button>
      </div>

      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '0 var(--sp-6) var(--sp-12)',
      }}>
        
        {/* Curved Header Banner for Breast Pathology */}
        <div style={{ 
          background: 'linear-gradient(135deg, #e11d48 0%, #be123c 60%, #9f1239 100%)',
          borderRadius: '24px',
          padding: 'var(--sp-6) var(--sp-8)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--sp-4)',
          marginBottom: 'var(--sp-6)',
          boxShadow: 'var(--shadow-md)',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ 
            position: 'absolute', inset: 0,
            background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.04\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'4\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            pointerEvents: 'none'
          }} />
          <div style={{ 
            width: 52, height: 52, borderRadius: '16px', background: 'rgba(255,255,255,0.18)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            border: '1.5px solid rgba(255,255,255,0.25)', flexShrink: 0
          }}>
            <Droplet color="white" size={26} />
          </div>
          <div>
            <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 950, margin: 0, color: 'white', letterSpacing: '-0.3px' }}>
              Breast Pathology Markers
            </h2>
            <p style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.85)', margin: '3px 0 0', fontWeight: 600 }}>
              Select a clinical biomarker assay protocol below to perform quantitative evaluations
            </p>
          </div>
        </div>

        {/* Upgraded Biomarkers List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
          {options.map((option, index) => (
            <div 
              key={index}
              onClick={() => navigate(option.path)}
              className="card animate-fade-in-up"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--sp-4)',
                padding: 'var(--sp-5) var(--sp-6)',
                backgroundColor: '#ffffff',
                borderRadius: '22px',
                boxShadow: 'var(--shadow-sm)',
                cursor: 'pointer',
                transition: 'all 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
                border: '1.5px solid var(--border)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                e.currentTarget.style.borderColor = 'var(--primary-border)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                e.currentTarget.style.borderColor = 'var(--border)';
              }}
            >
              {/* Colored ribbon indicator */}
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: option.border }} />

              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                backgroundColor: option.color,
                border: `2px solid ${option.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {option.icon}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
                  <span style={{ fontSize: 'var(--text-base)', fontWeight: 850, color: 'var(--text-primary)' }}>
                    {option.title}
                  </span>
                  <span style={{ 
                    fontSize: '10px', 
                    fontWeight: 750, 
                    color: option.badgeColor, 
                    background: option.badgeBg, 
                    padding: '2px 8px', 
                    borderRadius: '6px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.2px'
                  }}>
                    {option.badge}
                  </span>
                </div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  {option.subtitle}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px', fontWeight: 500 }}>
                  {option.desc}
                </span>
              </div>

              <ChevronRight size={20} color="var(--primary)" />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};
