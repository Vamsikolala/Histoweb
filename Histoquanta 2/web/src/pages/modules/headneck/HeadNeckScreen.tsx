import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../../../components/Layout';
import { ArrowLeft, ChevronRight, Activity, Beaker } from 'lucide-react';

export const HeadNeckScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <Layout title="Head & Neck">
      <div style={{ marginBottom: '1.5rem', padding: '0 18px' }}>
        <button 
          className="btn btn-secondary" 
          onClick={() => navigate(-1)} 
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
        paddingBottom: '2rem'
      }}>
        <div style={{ padding: '18px 18px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <button 
            onClick={() => navigate(`/patient/${id}/modules/headneck/p16`)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '20px', backgroundColor: '#fff', borderRadius: '24px',
              border: 'none', cursor: 'pointer', textAlign: 'left',
              boxShadow: '0 8px 20px rgba(0,0,0,0.06)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ 
                width: '56px', height: '56px', borderRadius: '18px', 
                backgroundColor: 'rgba(59, 130, 246, 0.1)', 
                display: 'flex', justifyContent: 'center', alignItems: 'center' 
              }}>
                <Activity size={24} color="#3b82f6" />
              </div>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#000', marginBottom: '4px' }}>P16</div>
                <div style={{ fontSize: '14px', color: 'rgba(0,0,0,0.5)' }}>Surrogate for Transcriptionally Active High-Risk HPV</div>
              </div>
            </div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.04)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <ChevronRight size={16} color="rgba(0,0,0,0.4)" />
            </div>
          </button>

          <button 
            onClick={() => navigate(`/patient/${id}/modules/headneck/her2`)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '20px', backgroundColor: '#fff', borderRadius: '24px',
              border: 'none', cursor: 'pointer', textAlign: 'left',
              boxShadow: '0 8px 20px rgba(0,0,0,0.06)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ 
                width: '56px', height: '56px', borderRadius: '18px', 
                backgroundColor: 'rgba(59, 130, 246, 0.1)', 
                display: 'flex', justifyContent: 'center', alignItems: 'center' 
              }}>
                <Beaker size={24} color="#3b82f6" />
              </div>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#000', marginBottom: '4px' }}>HER-2</div>
                <div style={{ fontSize: '14px', color: 'rgba(0,0,0,0.5)' }}>Human Epidermal Growth Factor Receptor 2</div>
              </div>
            </div>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.04)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <ChevronRight size={16} color="rgba(0,0,0,0.4)" />
            </div>
          </button>

        </div>
      </div>
    </Layout>
  );
};
