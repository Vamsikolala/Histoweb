import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layout } from '../../components/Layout';
import { ArrowLeft } from 'lucide-react';
import { ERHScore } from '../../components/modules/Breast/ERHScore';

export const AnalysisForm: React.FC = () => {
  const { id, tissue, marker } = useParams<{ id: string, tissue: string, marker: string }>();
  const navigate = useNavigate();

  // Dynamically resolve the correct component
  const renderForm = () => {
    if (tissue === 'Breast' && marker === 'ER_HScore') {
      return <ERHScore patientId={id!} />;
    }
    
    // Fallback for not-yet-implemented
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        <h3>{marker?.replace('_', ' ')} ({tissue})</h3>
        <p style={{ marginTop: '1rem' }}>This clinical module is currently under construction for the web platform.</p>
      </div>
    );
  };

  return (
    <Layout title={`Analysis: ${marker?.replace('_', ' ')}`}>
      <div style={{ marginBottom: '1.5rem' }}>
        <button className="btn btn-secondary" onClick={() => navigate(`/patient/${id}/modules`)} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
          <ArrowLeft size={16} /> Back to Modules
        </button>
      </div>
      
      {renderForm()}
    </Layout>
  );
};
