import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/Layout';
import { ArrowLeft, Shield } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout title="Privacy Policy">
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
        padding: '24px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        minHeight: '60vh'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '24px', backgroundColor: 'rgba(0, 122, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Shield size={24} color="#007aff" />
          </div>
          <h2 style={{ margin: 0, fontSize: '24px', color: '#000' }}>Privacy Policy</h2>
        </div>

        <div style={{ fontSize: '15px', lineHeight: '1.6', color: '#4b5563' }}>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h3 style={{ color: '#1f2937', marginTop: '20px' }}>1. Information We Collect</h3>
          <p>We collect information that you provide directly to us when using HistoQuanta. This includes doctor profiles, patient demographics, and clinical analysis data.</p>
          
          <h3 style={{ color: '#1f2937', marginTop: '20px' }}>2. How We Use Your Information</h3>
          <p>The information collected is used solely for the purpose of managing patient clinical records, analysis reports, and providing diagnostic inferences within the application.</p>
          
          <h3 style={{ color: '#1f2937', marginTop: '20px' }}>3. Data Security</h3>
          <p>We implement appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure.</p>
          
          <h3 style={{ color: '#1f2937', marginTop: '20px' }}>4. Patient Data Privacy (HIPAA / GDPR)</h3>
          <p>As a medical application, it is the doctor's responsibility to ensure that patient data entered into the system complies with local healthcare regulations such as HIPAA or GDPR.</p>
          
          <h3 style={{ color: '#1f2937', marginTop: '20px' }}>5. Contact Us</h3>
          <p>If you have questions or comments about this policy, you may email us at support@histoquanta.com.</p>
        </div>
      </div>
    </Layout>
  );
};
