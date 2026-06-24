import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../../../components/Layout';
import { ArrowLeft, ChevronDown, Check } from 'lucide-react';

const her2Options = [
  "Positive (3+ by gastric criteria)",
  "Equivocal (2+ by gastric criteria)",
  "Negative (0/1+ by gastric criteria)"
];

export const LungsHer2: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [selectedResult, setSelectedResult] = useState<string>("Negative (0/1+ by gastric criteria)");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  let inference = "Negative";
  if (selectedResult.includes("Positive")) inference = "Positive";
  else if (selectedResult.includes("Equivocal")) inference = "Equivocal";

  let resultText = "No staining or faint/basal staining in <10% of cells.\nInterpretation: HER2 negative — proceed with standard EGFR/ALK/ROS1 testing.";
  if (selectedResult.includes("Positive")) {
    resultText = "Strong basolateral/lateral membrane staining in ≥10% of tumor cells.\nInterpretation: HER2 positive — consider trastuzumab deruxtecan (T-DXd) for metastatic disease.";
  } else if (selectedResult.includes("Equivocal")) {
    resultText = "Weak/moderate basolateral staining in ≥10% of cells.\nInterpretation: Equivocal — NGS or ISH recommended for confirmation.";
  }

  let inferenceColor = "#ef4444"; // red
  if (inference === "Positive") inferenceColor = "#22c55e"; // green
  else if (inference === "Equivocal") inferenceColor = "#f97316"; // orange

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const doctorId = localStorage.getItem('doctor_id') || '';
      const patientId = id || '';
      if (!patientId) {
        alert("Patient ID missing from URL");
        return;
      }
      
      const fullReport = `CLINICAL ANALYSIS REPORT: LUNGS HER2
-------------------------------------------
Patient ID: ${patientId}

RESULT CATEGORY: ${selectedResult}

INFERENCE: ${inference.toUpperCase()}

Assessment & Findings:
${resultText}`;
      
      const response = await fetch('/add_analysis_report.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          doctor_id: doctorId,
          patient_id: patientId,
          tissue_type: "Lungs",
          marker: "HER2",
          total_score: selectedResult,
          inference: fullReport
        }).toString()
      });
      
      const data = await response.json();
      if (data.status) {
        alert("Report saved successfully to patient history!");
      } else {
        alert("Failed to save: " + data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Network error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Layout title="Lungs">
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
        maxWidth: '600px', 
        margin: '0 auto', 
        background: 'linear-gradient(180deg, #F2F7FF 0%, #FFFFFF 100%)',
        minHeight: 'calc(100vh - 120px)',
        paddingBottom: '2rem'
      }}>
        
        {/* Dropdown Card */}
        <div style={{ position: 'relative', zIndex: isExpanded ? 20 : 1, margin: '0 18px 24px' }}>
          <div style={{ fontSize: '16px', fontWeight: 600, color: '#000', paddingLeft: '4px', paddingBottom: '12px' }}>
            Select HER2 Result:
          </div>
          <div style={{ position: 'relative' }}>
            <div 
              onClick={() => setIsExpanded(!isExpanded)}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '14px 16px', backgroundColor: '#fff',
                borderRadius: isExpanded ? '16px 16px 0 0' : '16px',
                boxShadow: '0 3px 6px rgba(0,0,0,0.06)', cursor: 'pointer',
                border: '1.2px solid rgba(156, 163, 175, 0.15)'
              }}
            >
              <span style={{ fontSize: '16px', color: '#000' }}>{selectedResult}</span>
              <ChevronDown size={14} color="#3b82f6" style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
            </div>
            
            {isExpanded && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, right: 0,
                backgroundColor: '#fff', borderRadius: '0 0 16px 16px',
                boxShadow: '0 8px 10px rgba(0,0,0,0.06)',
                border: '1.2px solid rgba(156, 163, 175, 0.15)', borderTop: 'none'
              }}>
                {her2Options.map((opt, i) => (
                  <React.Fragment key={opt}>
                    <div 
                      onClick={() => {
                        setSelectedResult(opt);
                        setIsExpanded(false);
                      }}
                      style={{
                        display: 'flex', justifyContent: 'space-between', padding: '14px 16px',
                        backgroundColor: selectedResult === opt ? 'rgba(59, 130, 246, 0.05)' : '#fff',
                        cursor: 'pointer'
                      }}
                    >
                      <span style={{ fontSize: '15px', color: selectedResult === opt ? '#3b82f6' : 'rgba(0,0,0,0.8)' }}>
                        {opt}
                      </span>
                      {selectedResult === opt && <Check size={14} color="#3b82f6" />}
                    </div>
                    {i < her2Options.length - 1 && <hr style={{ margin: '0 16px', borderTop: '1px solid #eee' }} />}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Interpretation Box */}
        <div style={{ margin: '0 18px 24px', padding: '20px', backgroundColor: '#fff', borderRadius: '18px', boxShadow: '0 3px 8px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#000', marginBottom: '12px' }}>INTERPRETATION:</div>
          <div style={{ fontSize: '15px', color: 'rgba(0,0,0,0.8)', lineHeight: '1.5' }}>
            Intensity of staining:<br/>
            complete=3+ positive<br/>
            moderate=2+ equivocal<br/>
            incomplete=1+ negative<br/>
            no stain=0 negative
          </div>
        </div>

        {/* Result Card */}
        <div style={{ margin: '0 18px 24px', padding: '24px', backgroundColor: '#f5f5f5', borderRadius: '12px', border: `1.5px solid ${inferenceColor}33`, boxShadow: '0 3px 8px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#a855f7', marginBottom: '12px' }}>RESULT</div>
          <div style={{ fontSize: '16px', color: inferenceColor, lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
            {resultText}
          </div>
        </div>

        {/* Action Button */}
        <div style={{ margin: '0 18px 24px' }}>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            style={{
              width: '100%', minHeight: '54px', background: 'linear-gradient(90deg, #3b82f6, #06b6d4)',
              color: '#fff', fontSize: '16px', fontWeight: 'bold',
              borderRadius: '16px', border: 'none', cursor: 'pointer',
              display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
              boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3)'
            }}
          >
            {isSaving ? 'Saving...' : <><Check size={20} /> Save to Patient's Report</>}
          </button>
        </div>

      </div>
    </Layout>
  );
};
