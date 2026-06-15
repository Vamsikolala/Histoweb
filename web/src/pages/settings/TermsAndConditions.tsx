import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/Layout';
import { ArrowLeft, FileText } from 'lucide-react';

export const TermsAndConditions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Layout title="Terms & Conditions">
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
          <div style={{ width: '48px', height: '48px', borderRadius: '24px', backgroundColor: 'rgba(175, 82, 222, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={24} color="#af52de" />
          </div>
          <h2 style={{ margin: 0, fontSize: '24px', color: '#000' }}>Terms & Conditions</h2>
        </div>

        <div style={{ fontSize: '15px', lineHeight: '1.6', color: '#4b5563' }}>
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h3 style={{ color: '#1f2937', marginTop: '20px' }}>1. Agreement to Terms</h3>
          <p>By accessing or using HistoQuanta, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you disagree with any part of the terms, you may not access the service.</p>
          
          <h3 style={{ color: '#1f2937', marginTop: '20px' }}>2. Use of Service</h3>
          <p>HistoQuanta is designed as an assistive tool for pathologists and medical professionals. The clinical analysis and inferences provided by the application do not substitute professional medical judgment. All diagnoses must be verified by a qualified medical professional.</p>
          
          <h3 style={{ color: '#1f2937', marginTop: '20px' }}>3. User Accounts</h3>
          <p>You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password. You agree not to disclose your password to any third party.</p>
          
          <h3 style={{ color: '#1f2937', marginTop: '20px' }}>4. Disclaimer of Warranties</h3>
          <p>The Service is provided on an "AS IS" and "AS AVAILABLE" basis. HistoQuanta makes no representations or warranties of any kind, express or implied, as to the operation of their services, or the information, content or materials included therein.</p>
          
          <h3 style={{ color: '#1f2937', marginTop: '20px' }}>5. Limitation of Liability</h3>
          <p>In no event shall HistoQuanta, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.</p>
        </div>
      </div>
    </Layout>
  );
};
