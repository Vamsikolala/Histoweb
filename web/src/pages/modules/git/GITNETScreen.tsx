import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../../../components/Layout';
import { ArrowLeft, Stethoscope, Pill, TestTube2, Cross, Star, Activity, ChevronRight } from 'lucide-react';

export const GITNETScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const options = [
    { title: 'Stomach', subtitle: 'Gastric Analysis', icon: <Stethoscope size={20} color="var(--color-primary)" />, path: `/patient/${id}/modules/git/net/stomach` },
    { title: 'Duodenum and ampulla', subtitle: 'Small Intestine Analysis', icon: <Pill size={20} color="var(--color-primary)" />, path: `/patient/${id}/modules/git/net/grading` },
    { title: 'Jejunum and ileum', subtitle: 'Mid-intestine Analysis', icon: <TestTube2 size={20} color="var(--color-primary)" />, path: `/patient/${id}/modules/git/net/grading` },
    { title: 'Colon', subtitle: 'Large Intestine', icon: <Cross size={20} color="var(--color-primary)" />, path: `/patient/${id}/modules/git/net/grading` },
    { title: 'Appendix', subtitle: 'Appendiceal Analysis', icon: <Star size={20} color="var(--color-primary)" />, path: `/patient/${id}/modules/git/net/grading` },
    { title: 'Pancreas', subtitle: 'Pancreatic Study', icon: <Cross size={20} color="var(--color-primary)" />, path: `/patient/${id}/modules/git/net/grading` }, // Used cross as fallback for bandage
    { title: 'Ki-67', subtitle: 'Cell Proliferation', icon: <Activity size={20} color="var(--color-primary)" />, path: `/patient/${id}/modules/git/net/grading` },
  ];

  return (
    <Layout title="GIT - NET">
      <div style={{ marginBottom: '1.5rem', padding: '0 18px' }}>
        <button 
          className="btn btn-secondary" 
          onClick={() => navigate(`/patient/${id}/modules/git`)} 
          style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      <div style={{ 
        maxWidth: '600px', 
        margin: '0 auto', 
        background: 'linear-gradient(180deg, #F2F7FF 0%, #FFFFFF 100%)',
        minHeight: 'calc(100vh - 120px)',
        padding: '1.5rem 1rem',
        borderRadius: '16px'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {options.map((option, index) => (
            <div 
              key={index}
              onClick={() => navigate(option.path)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '16px',
                backgroundColor: '#ffffff',
                borderRadius: '18px',
                boxShadow: '0 3px 8px rgba(0,0,0,0.05)',
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
              }}
            >
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '25px',
                backgroundColor: 'rgba(59, 130, 246, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {option.icon}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1 }}>
                <span style={{ fontSize: '1.125rem', fontWeight: 700, color: '#000' }}>
                  {option.title}
                </span>
                <span style={{ fontSize: '0.8125rem', color: '#6b7280' }}>
                  {option.subtitle}
                </span>
              </div>

              <ChevronRight size={20} color="#9ca3af" />
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};
