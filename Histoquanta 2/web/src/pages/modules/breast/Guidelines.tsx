import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const Guidelines: React.FC = () => {
  const navigate = useNavigate();

  const Th = ({ children, width }: { children: React.ReactNode, width: string }) => (
    <th style={{
      width,
      padding: '16px',
      backgroundColor: 'rgba(0, 122, 255, 0.12)',
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
        backgroundColor: '#fff',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}>
        <button 
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <ArrowLeft size={24} color="#007aff" />
        </button>
        <h1 style={{ flex: 1, textAlign: 'center', margin: 0, fontSize: '20px', fontWeight: 'bold' }}>Guidelines</h1>
        <div style={{ width: '24px' }} /> {/* Spacer to balance back button */}
      </div>

      <div style={{ padding: '20px', overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          minWidth: '660px',
          borderCollapse: 'collapse',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 0 0 1px rgba(128, 128, 128, 0.18)'
        }}>
          <thead>
            <tr>
              <Th width="20%">ER Result Category</Th>
              <Th width="25%">Criteria</Th>
              <Th width="55%">Comments</Th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <Td isBold>Positive</Td>
              <Td>≥ 1% of tumor cell nuclei immunoreactive</Td>
              <Td>Include in report the overall percent cancer cells staining as a range or specific number. Intensity of staining is reported semi-quantitatively as an average (1+, 2+, or 3+).</Td>
            </tr>
            <tr>
              <Td isBold>Low Positive</Td>
              <Td>1–10% of tumor cell nuclei are immunoreactive</Td>
              <Td>The following report comment is recommended and is available to add in standardized form in the ‘Comments on ER Results’ section. The cancer in this sample has a low level (1–10%) of ER expression by IHC. There are limited data on the overall benefit of endocrine therapies for patients with low level (1–10%) ER expression, but they suggest possible benefit, and patients are considered eligible for endocrine treatment. These data suggest behavior may be heterogeneous in both biology and response and can resemble ER-negative cancers. The Low Positive interpretation applies only to invasive carcinoma and is not required for Progesterone receptor or DCIS.</Td>
            </tr>
            <tr>
              <Td isBold>Negative</Td>
              <Td>&lt; 1% of tumor cell nuclei immunoreactive</Td>
              <Td>Include the status of internal controls in report. If internal controls are absent but external controls stain appropriately, include recommended comment: ‘No interpretable positivity for ER is present, but external controls are appropriately positive. If only negative results are seen, then a specimen containing internal controls may be warranted for confirmation of ER status.’</Td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
