import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const HER2Guidelines: React.FC = () => {
  const navigate = useNavigate();

  const Th = ({ children, width }: { children: React.ReactNode, width: string }) => (
    <th style={{
      width,
      padding: '16px',
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

  const Td = ({ children, isBold = false }: { children: React.ReactNode, isBold?: boolean }) => (
    <td style={{
      padding: '16px',
      border: '1px solid rgba(128, 128, 128, 0.15)',
      fontSize: '13px',
      fontWeight: isBold ? 'bold' : 'normal',
      color: '#000',
      verticalAlign: 'top',
      lineHeight: '1.5'
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
        <table style={{
          width: '100%',
          minWidth: '500px',
          borderCollapse: 'collapse',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 0 0 1px rgba(128, 128, 128, 0.18)',
          backgroundColor: '#fff'
        }}>
          <thead>
            <tr>
              <Th width="30%">Result Category</Th>
              <Th width="70%">Criteria</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td isBold>Positive (Score 3+)</Td>
              <Td>Complete membrane staining that is intense and in &gt;10% of tumor cells*</Td>
            </tr>
            <tr>
              <Td isBold>Equivocal (Score 2+)</Td>
              <Td>
                Weak to moderate complete membrane staining in &gt;10% of tumor cells<br/>
                or<br/>
                Complete membrane staining that is intense but within ≤10% of tumor cells*
              </Td>
            </tr>
            <tr>
              <Td isBold>Negative (Score 1+)</Td>
              <Td>Incomplete membrane staining that is faint/barely perceptible and within &gt;10% of tumor cells</Td>
            </tr>
            <tr>
              <Td isBold>Negative (Score 0 or 0+)</Td>
              <Td>
                No staining observed (0/absent membrane staining)<br/>
                or<br/>
                Membrane staining that is incomplete and is faint/barely perceptible and within ≤10% of tumor cells (0+/with membrane staining)
              </Td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ padding: '0 22px 20px', marginTop: 'auto' }}>
        <p style={{
          fontSize: '11px',
          color: '#8e8e93',
          fontStyle: 'italic',
          margin: 0,
          lineHeight: '1.4'
        }}>
          * Readily appreciated using a low-power objective and observed within a homogeneous and contiguous population of invasive tumor cells.
        </p>
      </div>
    </div>
  );
};
