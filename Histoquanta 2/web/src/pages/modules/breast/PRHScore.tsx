import React, { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';

export const PRHScore: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { initialIntensity?: number; initialProportion?: number } | null;
  const initialIntensity = state?.initialIntensity ?? 0;
  const initialProportion = state?.initialProportion ?? 0;

  const [weakPercent, setWeakPercent] = useState<string>('');
  const [moderatePercent, setModeratePercent] = useState<string>('');
  const [strongPercent, setStrongPercent] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);

  const weakVal = parseInt(weakPercent) || 0;
  const moderateVal = parseInt(moderatePercent) || 0;
  const strongVal = parseInt(strongPercent) || 0;

  const totalHScore = (1 * weakVal) + (2 * moderateVal) + (3 * strongVal);

  let hScoreInference = "Negative";
  let inferenceColor = "#ef4444"; // red
  if (totalHScore >= 10 && totalHScore <= 100) {
    hScoreInference = "Weakly Positive";
    inferenceColor = "#f97316"; // orange
  } else if (totalHScore > 100) {
    hScoreInference = "Positive";
    inferenceColor = "#22c55e"; // green
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const doctorId = localStorage.getItem('doctor_id') || '';
      const patientId = id || window.location.pathname.split('/')[2] || '';
      if (!patientId) {
        alert('Patient ID missing from URL');
        return;
      }

      const fullReport = `CLINICAL ANALYSIS REPORT: BREAST PR (H-SCORE)
-------------------------------------------
Patient ID: ${patientId}

ALLRED REFERENCE:
- Intensity: ${initialIntensity}
- Proportion: ${initialProportion}

STAINING COMPONENTS:
- Weak (1+): ${weakPercent || '0'}%   → Score: ${1 * weakVal}
- Moderate (2+): ${moderatePercent || '0'}%  → Score: ${2 * moderateVal}
- Strong (3+): ${strongPercent || '0'}%   → Score: ${3 * strongVal}

TOTAL H-SCORE: ${totalHScore}
INFERENCE: ${hScoreInference}

Interpretation: ${totalHScore >= 10 ? 'The sample shows PR reactivity. Higher H-scores are associated with hormone therapy response.' : 'The sample is considered negative by H-score criteria.'}`;

      const response = await fetch('/add_analysis_report.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          doctor_id: doctorId,
          patient_id: patientId,
          tissue_type: 'Breast',
          marker: 'PR H-Score',
          total_score: `H-Score: ${totalHScore}`,
          inference: fullReport
        }).toString()
      });

      const data = await response.json();
      if (data.status) {
        alert('PR H-Score report saved to patient history!');
        navigate(`/patient/${patientId}`);
      } else {
        alert('Failed to save: ' + data.message);
      }
    } catch (error) {
      console.error(error);
      alert('Network error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#f2f7ff', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(to bottom right, #007aff, #288cf0)',
        padding: '50px 20px 20px 20px',
        display: 'flex', alignItems: 'center', gap: '15px'
      }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '5px' }}>
          <ArrowLeft size={24} />
        </button>
        <span style={{ fontSize: '22px', fontWeight: 700, color: 'white' }}>PR H-Score</span>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', paddingBottom: '2rem' }}>
        
        {/* Allred Reference Card */}
        <div style={{ margin: '20px 18px', padding: '16px', backgroundColor: 'rgba(59, 130, 246, 0.08)', borderRadius: '18px', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '4px' }}>Allred Reference</div>
          <div style={{ fontSize: '13px', color: 'rgba(0,0,0,0.7)', display: 'flex', gap: '15px' }}>
            <span>⚡ Intensity: {initialIntensity}</span>
            <span>🥧 Proportion: {initialProportion}</span>
          </div>
        </div>

        {/* Formula Card */}
        <div style={{ margin: '0 18px 20px', padding: '18px', backgroundColor: '#fff', borderRadius: '18px', boxShadow: '0 3px 8px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#000', marginBottom: '12px' }}>Formula</div>
          <div style={{ fontSize: '16px', fontWeight: 600, color: '#000', marginBottom: '12px' }}>% of positive cells × strength of immunoreactivity</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '15px', color: '#6b7280' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>1 × [% Weak]</span><span>{1 * weakVal}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>2 × [% Moderate]</span><span>{2 * moderateVal}</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>3 × [% Strong]</span><span>{3 * strongVal}</span></div>
          </div>
        </div>

        {/* Scoring Table */}
        <div style={{ margin: '0 18px 20px', backgroundColor: '#fff', borderRadius: '18px', border: '1px solid rgba(156, 163, 175, 0.18)', overflow: 'hidden' }}>
          <div style={{ display: 'flex', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderBottom: '0.8px solid rgba(156, 163, 175, 0.2)' }}>
            <div style={{ width: '130px', padding: '14px 0', textAlign: 'center', fontSize: '14px', fontWeight: 'bold' }}>Intensity</div>
            <div style={{ width: '150px', padding: '14px 0', textAlign: 'center', fontSize: '14px', fontWeight: 'bold', borderLeft: '0.8px solid rgba(156, 163, 175, 0.2)', borderRight: '0.8px solid rgba(156, 163, 175, 0.2)' }}>% cells (0-100)</div>
            <div style={{ flex: 1, padding: '14px 0', textAlign: 'center', fontSize: '14px', fontWeight: 'bold' }}>Score</div>
          </div>

          <div style={{ display: 'flex', borderBottom: '0.8px solid rgba(156, 163, 175, 0.2)' }}>
            <div style={{ width: '130px', padding: '14px 0', textAlign: 'center', fontSize: '15px' }}>Weak (1)</div>
            <div style={{ width: '150px', borderLeft: '0.8px solid rgba(156, 163, 175, 0.2)', borderRight: '0.8px solid rgba(156, 163, 175, 0.2)' }}>
              <input type="number" value={weakPercent} onChange={(e) => setWeakPercent(e.target.value)} placeholder="Enter %" style={{ width: '100%', height: '48px', border: 'none', textAlign: 'center', fontSize: '15px', fontWeight: 500, outline: 'none', background: 'transparent' }} />
            </div>
            <div style={{ flex: 1, padding: '14px 0', textAlign: 'center', fontSize: '15px', color: '#3b82f6' }}>{1 * weakVal}</div>
          </div>

          <div style={{ display: 'flex', borderBottom: '0.8px solid rgba(156, 163, 175, 0.2)' }}>
            <div style={{ width: '130px', padding: '14px 0', textAlign: 'center', fontSize: '15px' }}>Moderate (2)</div>
            <div style={{ width: '150px', borderLeft: '0.8px solid rgba(156, 163, 175, 0.2)', borderRight: '0.8px solid rgba(156, 163, 175, 0.2)' }}>
              <input type="number" value={moderatePercent} onChange={(e) => setModeratePercent(e.target.value)} placeholder="Enter %" style={{ width: '100%', height: '48px', border: 'none', textAlign: 'center', fontSize: '15px', fontWeight: 500, outline: 'none', background: 'transparent' }} />
            </div>
            <div style={{ flex: 1, padding: '14px 0', textAlign: 'center', fontSize: '15px', color: '#3b82f6' }}>{2 * moderateVal}</div>
          </div>

          <div style={{ display: 'flex' }}>
            <div style={{ width: '130px', padding: '14px 0', textAlign: 'center', fontSize: '15px' }}>Strong (3)</div>
            <div style={{ width: '150px', borderLeft: '0.8px solid rgba(156, 163, 175, 0.2)', borderRight: '0.8px solid rgba(156, 163, 175, 0.2)' }}>
              <input type="number" value={strongPercent} onChange={(e) => setStrongPercent(e.target.value)} placeholder="Enter %" style={{ width: '100%', height: '48px', border: 'none', textAlign: 'center', fontSize: '15px', fontWeight: 500, outline: 'none', background: 'transparent' }} />
            </div>
            <div style={{ flex: 1, padding: '14px 0', textAlign: 'center', fontSize: '15px', color: '#3b82f6' }}>{3 * strongVal}</div>
          </div>
        </div>

        {/* Total Score Card */}
        <div style={{ margin: '0 18px 20px', padding: '18px', backgroundColor: '#fff', borderRadius: '18px', boxShadow: '0 3px 8px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#000', marginBottom: '6px' }}>Total H-Score</div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Sum of all intensity scores</div>
          </div>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6', padding: '0 10px' }}>{totalHScore}</div>
        </div>

        {/* Inference Card */}
        <div style={{ margin: '0 18px 20px', padding: '18px', backgroundColor: '#fff', borderRadius: '18px', boxShadow: '0 3px 8px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Inference:</span>
            <span style={{ fontSize: '18px', fontWeight: 'bold', color: inferenceColor }}>{hScoreInference}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '4px', backgroundColor: '#ef4444' }}></div>
              <span style={{ fontSize: '14px', fontWeight: totalHScore < 10 ? 'bold' : 'normal', color: totalHScore < 10 ? '#000' : '#9ca3af' }}>&lt; 10 : Negative</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '4px', backgroundColor: '#f97316' }}></div>
              <span style={{ fontSize: '14px', fontWeight: (totalHScore >= 10 && totalHScore <= 100) ? 'bold' : 'normal', color: (totalHScore >= 10 && totalHScore <= 100) ? '#000' : '#9ca3af' }}>10 – 100 : Weakly Positive</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '4px', backgroundColor: '#22c55e' }}></div>
              <span style={{ fontSize: '14px', fontWeight: totalHScore > 100 ? 'bold' : 'normal', color: totalHScore > 100 ? '#000' : '#9ca3af' }}>&gt; 100 : Positive</span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ margin: '0 18px 24px' }}>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            style={{
              width: '100%', minHeight: '54px', backgroundColor: '#22c55e',
              color: '#fff', fontSize: '16px', fontWeight: 'bold',
              borderRadius: '16px', border: 'none', cursor: 'pointer',
              display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
              boxShadow: '0 8px 16px rgba(34, 197, 94, 0.3)'
            }}
          >
            {isSaving ? 'Saving...' : <><Save size={20} /> Save to Patient's Report</>}
          </button>
        </div>

      </div>
    </div>
  );
};
