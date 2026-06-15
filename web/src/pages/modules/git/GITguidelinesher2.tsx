import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const GITguidelinesher2: React.FC = () => {
  const navigate = useNavigate();

  const Th = ({ children, width }: { children: React.ReactNode, width?: string }) => (
    <th style={{
      width,
      padding: '12px 8px',
      backgroundColor: 'rgba(0, 122, 255, 0.1)',
      border: '1px solid rgba(128, 128, 128, 0.4)',
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#000',
      textAlign: 'center',
      verticalAlign: 'middle'
    }}>
      {children}
    </th>
  );

  const TdLabel = ({ children }: { children: React.ReactNode }) => (
    <td style={{
      width: '140px',
      padding: '12px 8px',
      border: '1px solid rgba(128, 128, 128, 0.4)',
      fontSize: '13px',
      fontWeight: 'bold',
      color: '#000',
      verticalAlign: 'middle',
      textAlign: 'center'
    }}>
      {children}
    </td>
  );

  const TdContent = ({ children }: { children: React.ReactNode }) => (
    <td style={{
      padding: '12px',
      border: '1px solid rgba(128, 128, 128, 0.4)',
      fontSize: '13px',
      color: 'rgba(0, 0, 0, 0.8)',
      verticalAlign: 'middle',
      lineHeight: '1.5',
      whiteSpace: 'pre-wrap'
    }}>
      {children}
    </td>
  );

  return (
    <div style={{
      background: '#fff',
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
        borderBottom: '1px solid #f0f0f0',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        backgroundColor: '#fff'
      }}>
        <button 
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <ArrowLeft size={24} color="#007aff" />
        </button>
        <h1 style={{ flex: 1, textAlign: 'center', margin: 0, fontSize: '20px', fontWeight: 'bold' }}>HER2 Reference</h1>
        <div style={{ width: '24px' }} />
      </div>

      <div style={{ padding: '20px', overflowX: 'auto' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#007aff', marginBottom: '16px', marginTop: 0 }}>
          HER2 Interpretation Guidelines (Biopsy Specimen)
        </h2>

        <table style={{
          width: '100%',
          minWidth: '500px',
          borderCollapse: 'collapse',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 0 0 1.5px rgba(128, 128, 128, 0.4)'
        }}>
          <thead>
            <tr>
              <Th width="140px">Result Category</Th>
              <Th>Criteria</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <TdLabel>Negative (Score 0 or 0+)#</TdLabel>
              <TdContent>
                No staining observed (0/absent membrane staining)
                {'\n\n'}or{'\n\n'}
                Membrane staining that is incomplete and is faint/barely perceptible and within ≤10% of tumor cells (0+/with membrane staining)
              </TdContent>
            </tr>
            <tr>
              <TdLabel>Negative (Score 1+)#</TdLabel>
              <TdContent>Incomplete membrane staining that is faint/barely perceptible and within &gt;10% of tumor cells</TdContent>
            </tr>
            <tr>
              <TdLabel>Equivocal (Score 2+)#†</TdLabel>
              <TdContent>
                Weak to moderate complete membrane staining in &gt;10% of tumor cells
                {'\n\n'}or{'\n\n'}
                Complete membrane staining that is intense but within ≤10% of tumor cells*
              </TdContent>
            </tr>
            <tr>
              <TdLabel>Positive (Score 3+)</TdLabel>
              <TdContent>Complete membrane staining that is intense and &gt;10% of tumor cells*</TdContent>
            </tr>
          </tbody>
        </table>
        
        <p style={{
          fontSize: '11px',
          fontWeight: '500',
          color: '#8e8e93',
          marginTop: '16px',
          lineHeight: '1.4'
        }}>
          *Readily appreciated using a low-power objective and observed within a homogeneous and contiguous...
        </p>
      </div>
    </div>
  );
};
