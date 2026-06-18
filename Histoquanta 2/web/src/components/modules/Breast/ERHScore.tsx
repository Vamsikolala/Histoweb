import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../../utils/api';
import { Save } from 'lucide-react';

export const ERHScore: React.FC<{ patientId: string }> = ({ patientId }) => {
  const navigate = useNavigate();
  const doctorId = localStorage.getItem('doctor_id');

  const [weakPercent, setWeakPercent] = useState('');
  const [moderatePercent, setModeratePercent] = useState('');
  const [strongPercent, setStrongPercent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const weakVal = parseInt(weakPercent) || 0;
  const moderateVal = parseInt(moderatePercent) || 0;
  const strongVal = parseInt(strongPercent) || 0;
  
  const totalHScore = (1 * weakVal) + (2 * moderateVal) + (3 * strongVal);

  const getInference = () => {
    if (totalHScore < 10) return { text: 'Negative', color: 'red' };
    if (totalHScore <= 100) return { text: 'Weakly Positive', color: 'orange' };
    return { text: 'Positive', color: 'green' };
  };

  const inference = getInference();

  const handleSave = async () => {
    setIsLoading(true);
    setError('');

    const fullReport = `CLINICAL ANALYSIS REPORT: BREAST ER (H-SCORE)
-------------------------------------------
Patient Name: ${localStorage.getItem('patient_name') || ''}
Patient ID: ${patientId}

STAINING COMPONENTS:
- Weak (1+): ${weakPercent || '0'}%
- Moderate (2+): ${moderatePercent || '0'}%
- Strong (3+): ${strongPercent || '0'}%

TOTAL H-SCORE: ${totalHScore}
INFERENCE: ${inference.text}

Interpretation: ${totalHScore >= 10 ? 'The sample shows ER reactivity. Higher H-scores (especially >100) are strongly associated with hormone therapy response.' : 'The sample is considered negative by H-score criteria.'}`;

    try {
      const response = await fetch(`${API_BASE_URL}/add_analysis_report.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          doctor_id: doctorId || '',
          patient_id: patientId,
          tissue_type: 'Breast',
          marker: 'ER H-Score',
          total_score: `H-Score: ${totalHScore}`,
          inference: fullReport
        }).toString()
      });
      
      const data = await response.json();
      
      if (data.status) {
        alert('H-Score report saved successfully to patient history!');
        navigate(`/patient/${patientId}`);
      } else {
        setError(data.message || 'Failed to save report');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const cardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '18px',
    padding: '18px',
    boxShadow: '0 3px 8px rgba(0,0,0,0.05)',
    marginBottom: '20px'
  };

  const tableHeaderStyle = {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    fontWeight: 700,
    fontSize: '14px',
    padding: '12px',
    textAlign: 'center' as const,
    border: '1px solid rgba(128,128,128,0.2)'
  };

  const tableCellLabelStyle = {
    padding: '12px',
    textAlign: 'center' as const,
    border: '1px solid rgba(128,128,128,0.2)',
    fontSize: '15px'
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {error && <div className="auth-error" style={{ marginBottom: '1.5rem' }}>{error}</div>}

      {/* Formula Card */}
      <div style={cardStyle}>
        <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 12px 0', color: '#000' }}>Formula</h3>
        <p style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 12px 0', color: '#000' }}>% of positive cells × strength of immunoreactivity</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '15px', color: '#888' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>1 × [% Weak]</span>
            <span>{1 * weakVal}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>2 × [% Moderate]</span>
            <span>{2 * moderateVal}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>3 × [% Strong]</span>
            <span>{3 * strongVal}</span>
          </div>
        </div>
      </div>

      {/* Scoring Table */}
      <div style={{ ...cardStyle, padding: 0, overflow: 'hidden', border: '1px solid rgba(128,128,128,0.18)' }}>
        <div style={{ display: 'flex' }}>
          <div style={{ ...tableHeaderStyle, flex: '1.5' }}>Intensity</div>
          <div style={{ ...tableHeaderStyle, flex: '2' }}>% cells (0-100)</div>
          <div style={{ ...tableHeaderStyle, flex: '1' }}>Score</div>
        </div>
        
        <div style={{ display: 'flex' }}>
          <div style={{ ...tableCellLabelStyle, flex: '1.5' }}>Weak (1)</div>
          <div style={{ flex: '2', border: '1px solid rgba(128,128,128,0.2)' }}>
            <input type="number" min="0" max="100" style={{ width: '100%', height: '100%', border: 'none', textAlign: 'center', fontSize: '15px', outline: 'none' }} placeholder="Enter %" value={weakPercent} onChange={(e) => setWeakPercent(e.target.value)} />
          </div>
          <div style={{ ...tableCellLabelStyle, flex: '1', color: '#007AFF' }}>{1 * weakVal}</div>
        </div>

        <div style={{ display: 'flex' }}>
          <div style={{ ...tableCellLabelStyle, flex: '1.5' }}>Moderate (2)</div>
          <div style={{ flex: '2', border: '1px solid rgba(128,128,128,0.2)' }}>
            <input type="number" min="0" max="100" style={{ width: '100%', height: '100%', border: 'none', textAlign: 'center', fontSize: '15px', outline: 'none' }} placeholder="Enter %" value={moderatePercent} onChange={(e) => setModeratePercent(e.target.value)} />
          </div>
          <div style={{ ...tableCellLabelStyle, flex: '1', color: '#007AFF' }}>{2 * moderateVal}</div>
        </div>

        <div style={{ display: 'flex' }}>
          <div style={{ ...tableCellLabelStyle, flex: '1.5' }}>Strong (3)</div>
          <div style={{ flex: '2', border: '1px solid rgba(128,128,128,0.2)' }}>
            <input type="number" min="0" max="100" style={{ width: '100%', height: '100%', border: 'none', textAlign: 'center', fontSize: '15px', outline: 'none' }} placeholder="Enter %" value={strongPercent} onChange={(e) => setStrongPercent(e.target.value)} />
          </div>
          <div style={{ ...tableCellLabelStyle, flex: '1', color: '#007AFF' }}>{3 * strongVal}</div>
        </div>
      </div>

      {/* Total Score Card */}
      <div style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 6px 0', color: '#000' }}>Total H-Score</h3>
          <p style={{ fontSize: '14px', margin: 0, color: '#888' }}>Sum of all intensity scores</p>
        </div>
        <div style={{ fontSize: '32px', fontWeight: 700, color: '#007AFF', padding: '0 10px' }}>
          {totalHScore}
        </div>
      </div>

      {/* Inference Card */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '10px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Inference:</h3>
          <span style={{ fontSize: '18px', fontWeight: 700, color: inference.color }}>{inference.text}</span>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'red' }} />
            <span style={{ fontSize: '14px', fontWeight: totalHScore < 10 ? 700 : 400, color: totalHScore < 10 ? '#000' : '#888' }}>&lt; 10 : Negative</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'orange' }} />
            <span style={{ fontSize: '14px', fontWeight: totalHScore >= 10 && totalHScore <= 100 ? 700 : 400, color: totalHScore >= 10 && totalHScore <= 100 ? '#000' : '#888' }}>10 – 100 : Weakly Positive</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'green' }} />
            <span style={{ fontSize: '14px', fontWeight: totalHScore > 100 ? 700 : 400, color: totalHScore > 100 ? '#000' : '#888' }}>&gt; 100 : Positive</span>
          </div>
        </div>
      </div>

      <button 
        onClick={handleSave} 
        disabled={isLoading} 
        style={{ 
          width: '100%', 
          minHeight: '54px', 
          backgroundColor: '#34C759', 
          color: 'white', 
          border: 'none', 
          borderRadius: '16px', 
          fontSize: '16px', 
          fontWeight: 700, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '8px',
          boxShadow: '0 8px 16px rgba(52, 199, 89, 0.3)',
          cursor: 'pointer'
        }}
      >
        {isLoading ? 'Saving...' : <><Save size={20} /> Save to Report</>}
      </button>
    </div>
  );
};
