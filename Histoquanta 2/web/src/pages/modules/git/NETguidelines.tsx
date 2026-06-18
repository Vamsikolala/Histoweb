import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const NETguidelines: React.FC = () => {
  const navigate = useNavigate();

  const Th = ({ children, width }: { children?: React.ReactNode, width?: string }) => (
    <th style={{
      width,
      padding: '10px',
      backgroundColor: 'rgba(0, 122, 255, 0.1)',
      border: '1px solid rgba(128, 128, 128, 0.2)',
      fontSize: '13px',
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
      width: '110px',
      padding: '8px',
      backgroundColor: 'rgba(0, 122, 255, 0.04)',
      border: '1px solid rgba(128, 128, 128, 0.2)',
      fontSize: '12px',
      fontWeight: 'bold',
      color: '#000',
      verticalAlign: 'top',
      textAlign: 'left'
    }}>
      {children}
    </td>
  );

  const TdContent = ({ children, width }: { children: React.ReactNode, width: string }) => (
    <td style={{
      width,
      padding: '8px',
      border: '1px solid rgba(128, 128, 128, 0.2)',
      fontSize: '11px',
      color: 'rgba(0, 0, 0, 0.8)',
      verticalAlign: 'top',
      lineHeight: '1.4'
    }}>
      {children}
    </td>
  );

  const TableRow = ({ label, t1, t2, t3, t4 }: { label: string, t1: string, t2: string, t3: string, t4: string }) => (
    <tr>
      <TdLabel>{label}</TdLabel>
      <TdContent width="150px">{t1}</TdContent>
      <TdContent width="150px">{t2}</TdContent>
      <TdContent width="170px">{t3}</TdContent>
      <TdContent width="150px">{t4}</TdContent>
    </tr>
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
        <h1 style={{ flex: 1, textAlign: 'center', margin: 0, fontSize: '20px', fontWeight: 'bold' }}>NET Reference</h1>
        <div style={{ width: '24px' }} />
      </div>

      <div style={{ padding: '20px', overflowX: 'auto' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#000', marginBottom: '10px', marginTop: 0 }}>
          Table 2. Types of Well-Differentiated Gastric Neuroendocrine Tumors
        </h2>

        <table style={{
          width: 'max-content',
          borderCollapse: 'collapse',
          boxShadow: '0 0 0 1px rgba(128, 128, 128, 0.15)'
        }}>
          <thead>
            <tr>
              <Th width="110px"></Th>
              <Th width="150px">Type 1</Th>
              <Th width="150px">Type 2</Th>
              <Th width="170px">Type 3</Th>
              <Th width="150px">PPI-associated</Th>
            </tr>
          </thead>
          <tbody>
            <TableRow 
              label="Frequency" 
              t1="66% of cases" 
              t2="2%" 
              t3="13% of cases" 
              t4="20%" 
            />
            <TableRow 
              label="Multiplicity" 
              t1="Multifocal" 
              t2="Multifocal" 
              t3="Solitary" 
              t4="Single or multifocal" 
            />
            <TableRow 
              label="Size" 
              t1="0.5-1.0 cm" 
              t2="~1.5 cm or less" 
              t3="Variable; one-third are larger than 2 cm" 
              t4="Generally small in size" 
            />
            <TableRow 
              label="Location" 
              t1="Corpus" 
              t2="Corpus" 
              t3="Anywhere in stomach" 
              t4="Corpus" 
            />
            <TableRow 
              label="Hypergastrinemia" 
              t1="Present" 
              t2="Present" 
              t3="Absent" 
              t4="Present" 
            />
            <TableRow 
              label="Acid secretion" 
              t1="Low or absent" 
              t2="High" 
              t3="Normal" 
              t4="Unknown" 
            />
            <TableRow 
              label="Association" 
              t1="Chronic atrophic gastritis" 
              t2="Multiple endocrine type 1 (MEN-1)" 
              t3="Sporadic" 
              t4="Long-term PPI use" 
            />
            <TableRow 
              label="Background gastric mucosa" 
              t1="Enterochromaffin-like (ECL) cell hyperplasia, partial or complete loss of parietal cells, intestinal metaplasia" 
              t2="Parietal cell hyperplasia; ECL cell hyperplasia" 
              t3="Usually normal" 
              t4="Parietal cell hyperplasia; ECL cell hyperplasia; antral G cell hyperplasia" 
            />
            <TableRow 
              label="Clinical Behavior" 
              t1="Usually indolent: ~100% 5-year survival" 
              t2="10-30% metastasize" 
              t3="71% of tumors >2 cm with muscularis propria and vascular invasion have lymph node metastases" 
              t4="Rarely metastasize; ~100% 5-year survival" 
            />
            <TableRow 
              label="Demographic Profile" 
              t1="70-80% are females in their 50s and 60s" 
              t2="Equally in males and females, mean age 50 y" 
              t3="More common in males, mean age 55 y" 
              t4="Equally in males and females, in their 50s and 60s" 
            />
          </tbody>
        </table>
      </div>
    </div>
  );
};
