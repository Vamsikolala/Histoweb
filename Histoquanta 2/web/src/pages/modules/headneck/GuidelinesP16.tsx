import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const GuidelinesP16: React.FC = () => {
  const navigate = useNavigate();

  const Th = ({ children, width }: { children: React.ReactNode, width?: string }) => (
    <th style={{
      width,
      padding: '0 8px',
      height: '60px',
      backgroundColor: 'rgba(0, 122, 255, 0.08)',
      border: '1px solid rgba(128, 128, 128, 0.2)',
      fontSize: '15px',
      fontWeight: 'bold',
      color: '#000',
      textAlign: 'center',
      verticalAlign: 'middle'
    }}>
      {children}
    </th>
  );

  const Td = ({ children, width, isBold = false }: { children: React.ReactNode, width?: string, isBold?: boolean }) => (
    <td style={{
      width,
      padding: '12px',
      border: '1px solid rgba(128, 128, 128, 0.15)',
      fontSize: '13px',
      fontWeight: isBold ? 'bold' : 'normal',
      color: '#000',
      verticalAlign: 'top',
      lineHeight: '1.4'
    }}>
      {children}
    </td>
  );

  return (
    <div style={{
      background: 'linear-gradient(to bottom, #f2f7ff, #ffffff)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '20px',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        backgroundColor: '#f2f7ff'
      }}>
        <button 
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <ArrowLeft size={24} color="#007aff" />
        </button>
        <h1 style={{ flex: 1, textAlign: 'center', margin: 0, fontSize: '20px', fontWeight: 'bold' }}>Guidelines</h1>
        <div style={{ width: '24px' }} />
      </div>

      <div style={{ padding: '20px', overflowX: 'auto' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#007aff', marginBottom: '16px', marginTop: 10 }}>
          p16 as a Surrogate for Transcriptionally Active High-Risk HPV
        </h2>

        <table style={{
          width: '100%',
          minWidth: '400px',
          borderCollapse: 'collapse',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 0 0 1px rgba(128, 128, 128, 0.18)',
          backgroundColor: '#fff'
        }}>
          <thead>
            <tr>
              <Th width="100px">Result</Th>
              <Th>Interpretation Criteria</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td width="100px" isBold>Negative</Td>
              <Td>less than 50% diffuse and moderate-to-strong nuclear and cytoplasmic staining</Td>
            </tr>
            <tr>
              <Td width="100px" isBold>Equivocal</Td>
              <Td>less than 70% but greater than or equal to 50% diffuse and moderate-to-strong nuclear and cytoplasmic staining</Td>
            </tr>
            <tr>
              <Td width="100px" isBold>Positive</Td>
              <Td>greater than or equal to 70% diffuse and moderate-to-strong nuclear and cytoplasmic staining</Td>
            </tr>
            <tr>
              <Td width="100px" isBold>Other</Td>
              <Td>Including cytology specimens, specify as needed.</Td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
