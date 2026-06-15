import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../../components/Layout';
import { ArrowLeft, ChevronRight, Activity } from 'lucide-react';

const clinicalData = [
  {
    tissue: 'Breast',
    markers: ['ER_HScore', 'Ki67']
  },
  {
    tissue: 'GIT',
    markers: ['Adenocarcinoma']
  }
];

export const ClinicalModules: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedTissue, setSelectedTissue] = useState<string | null>(null);

  return (
    <Layout title="Clinical Modules Hub">
      <div style={{ marginBottom: '1.5rem' }}>
        <button className="btn btn-secondary" onClick={() => navigate(`/patient/${id}`)} style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
          <ArrowLeft size={16} /> Back to Patient
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '2.5rem', maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '2rem', color: 'var(--color-text)' }}>
          Select Clinical Analysis
        </h2>

        {!selectedTissue ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {clinicalData.map((data) => (
              <div 
                key={data.tissue}
                className="glass-card" 
                onClick={() => setSelectedTissue(data.tissue)}
                style={{ 
                  padding: '1.5rem', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  gap: '1rem'
                }}
              >
                <Activity size={32} color="var(--color-primary)" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{data.tissue}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>{data.markers.length} Markers</p>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <button 
                onClick={() => setSelectedTissue(null)}
                style={{ background: 'none', border: 'none', color: 'var(--color-primary)', cursor: 'pointer', fontWeight: 600 }}
              >
                Tissues
              </button>
              <ChevronRight size={16} color="var(--color-text-muted)" />
              <span style={{ fontWeight: 600, color: 'var(--color-text)' }}>{selectedTissue}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {clinicalData.find(d => d.tissue === selectedTissue)?.markers.map((marker) => (
                <div 
                  key={marker}
                  className="glass-card"
                  onClick={() => {
                    if (selectedTissue === 'Breast') {
                      navigate(`/patient/${id}/modules/breast`);
                    } else if (selectedTissue === 'GIT') {
                      navigate(`/patient/${id}/modules/git`);
                    } else if (selectedTissue === 'Lungs') {
                      navigate(`/patient/${id}/modules/lungs`);
                    } else if (selectedTissue === 'Thyroid') {
                      navigate(`/patient/${id}/modules/thyroid`);
                    } else if (selectedTissue === 'Head & Neck') {
                      navigate(`/patient/${id}/modules/headneck`);
                    } else if (selectedTissue === 'Soft Tissue') {
                      navigate(`/patient/${id}/modules/softtissue`);
                    } else {
                      navigate(`/patient/${id}/analysis/${selectedTissue}/${marker}`);
                    }
                  }}
                  style={{ 
                    padding: '1.25rem 1.5rem', 
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span style={{ fontSize: '1.125rem', fontWeight: 600 }}>{marker.replace('_', ' ')}</span>
                  <ChevronRight size={20} color="var(--color-text-muted)" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
