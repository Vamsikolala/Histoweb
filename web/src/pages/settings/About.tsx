import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/Layout';
import { ArrowLeft, Info } from 'lucide-react';

export const About: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout title="About">
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
        maxWidth: '800px', 
        margin: '0 auto', 
        background: '#fff',
        borderRadius: '20px',
        padding: '30px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        minHeight: '60vh',
        textAlign: 'center'
      }}>
        <div style={{ display: 'inline-flex', width: '64px', height: '64px', borderRadius: '32px', backgroundColor: 'rgba(50, 173, 230, 0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
          <Info size={32} color="#32ade6" />
        </div>
        
        <h2 style={{ margin: '0 0 10px 0', fontSize: '28px', color: '#000' }}>HistoQuanta</h2>
        <p style={{ fontSize: '18px', color: '#8e8e93', margin: '0 0 30px 0' }}>Version 1.1.0</p>
        
        <div style={{ fontSize: '16px', lineHeight: '1.6', color: '#4b5563', maxWidth: '600px', margin: '0 auto', textAlign: 'left' }}>
          <p>
            HistoQuanta is a cutting-edge clinical assistive tool designed specifically for pathologists and medical professionals.
          </p>
          <p>
            By integrating advanced clinical reporting modules for Breast, GIT, Head & Neck, Lungs, Thyroid, and Soft Tissue pathology, HistoQuanta streamlines the diagnostic workflow.
          </p>
          <p>
            <strong>Key Features:</strong>
          </p>
          <ul style={{ paddingLeft: '20px', marginBottom: '20px' }}>
            <li>Comprehensive Patient Management</li>
            <li>In-depth Clinical Analysis Forms (ER, PR, Ki-67, HER2)</li>
            <li>Automatic H-Score and Interpretation Generation</li>
            <li>Secure Cloud-based Report Storage</li>
            <li>Cross-platform availability (iOS & Web)</li>
          </ul>
          
          <p style={{ textAlign: 'center', marginTop: '40px', fontSize: '14px', color: '#8e8e93' }}>
            &copy; {new Date().getFullYear()} HistoQuanta. All rights reserved.
          </p>
        </div>
      </div>
    </Layout>
  );
};
