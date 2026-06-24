import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../../../components/Layout';
import { ArrowLeft, ChevronDown, Check } from 'lucide-react';

const intensityOptions = [
  "0 — No staining",
  "1+ — Incomplete/faint membrane staining",
  "2+ — Weak/moderate complete membrane staining",
  "3+ — Strong complete membrane staining"
];

export const AdenocarcinomaBiopsy: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [selectedIntensity, setSelectedIntensity] = useState<string>("0 — No staining");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  let scoreCategory = "Negative";
  if (selectedIntensity.includes("3+")) scoreCategory = "Positive";
  if (selectedIntensity.includes("2+")) scoreCategory = "Equivocal";

  let resultText = "HER2 negative — Not eligible for anti-HER2 therapy.";
  if (scoreCategory === "Positive") {
    resultText = "HER2 Positive (Score 3+) — Eligible for anti-HER2 therapy (e.g., trastuzumab).";
  } else if (scoreCategory === "Equivocal") {
    resultText = "HER2 Equivocal (Score 2+) — ISH (FISH/SISH) testing required for amplification status.";
  } else {
    if (selectedIntensity.includes("1+")) {
      resultText = "HER2 Negative (Score 1+) — Not eligible for anti-HER2 therapy.";
    } else {
      resultText = "HER2 Negative (Score 0) — Not eligible for anti-HER2 therapy.";
    }
  }

  let interpretationCriteria = "";
  if (selectedIntensity.includes("3+")) {
    interpretationCriteria = "Complete membrane staining that is intense and >10% of tumor cells*";
  } else if (selectedIntensity.includes("2+")) {
    interpretationCriteria = "Weak to moderate complete membrane staining in >10% of tumor cells\n\nor\n\nComplete membrane staining that is intense but within ≤10% of tumor cells*";
  } else if (selectedIntensity.includes("1+")) {
    interpretationCriteria = "Incomplete membrane staining that is faint/barely perceptible and within >10% of tumor cells";
  } else {
    interpretationCriteria = "No staining observed (0/absent membrane staining)\n\nor\n\nMembrane staining that is incomplete and is faint/barely perceptible and within ≤10% of tumor cells (0+/with membrane staining)";
  }

  let inferenceColor = "#9ca3af"; // gray
  if (scoreCategory === "Positive") inferenceColor = "#22c55e"; // green
  if (scoreCategory === "Equivocal") inferenceColor = "#f97316"; // orange
  if (scoreCategory === "Negative") inferenceColor = "#ef4444"; // red

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const doctorId = localStorage.getItem('doctor_id') || '';
      const patientId = id || '';
      if (!patientId) {
        alert("Patient ID missing from URL");
        return;
      }
      
      const fullReport = `CLINICAL ANALYSIS REPORT: ADENOCARCINOMA HER2 (BIOPSY)
-------------------------------------------
Patient ID: ${patientId}

INTENSITY OF STAINING: ${selectedIntensity}

ASSESSMENT: ${scoreCategory.toUpperCase()}
Criteria: ${interpretationCriteria}
Conclusion: ${resultText}`;
      
      const response = await fetch('/add_analysis_report.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          doctor_id: doctorId,
          patient_id: patientId,
          tissue_type: "GIT",
          marker: "Adenocarcinoma Biopsy",
          total_score: selectedIntensity,
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
    <Layout title="GIT Analysis">
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
        
        {/* Subtitle Card */}
        <div style={{ padding: '10px 18px 24px', textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#000', marginBottom: '4px' }}>Adenocarcinoma</div>
          <div style={{ fontSize: '16px', color: '#6b7280' }}>HER2 - Biopsy Specimen</div>
        </div>

        {/* Dropdown Card */}
        <div style={{ position: 'relative', zIndex: isExpanded ? 20 : 1, margin: '0 18px 24px' }}>
          <div style={{ fontSize: '16px', fontWeight: 600, color: '#000', paddingLeft: '4px', paddingBottom: '12px' }}>
            Select Intensity of Staining:
          </div>
          <div style={{ position: 'relative' }}>
            <div 
              onClick={() => setIsExpanded(!isExpanded)}
              style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '14px 16px', backgroundColor: '#fff',
                borderRadius: isExpanded ? '16px 16px 0 0' : '16px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.06)', cursor: 'pointer',
                border: '1px solid rgba(156, 163, 175, 0.12)'
              }}
            >
              <span style={{ fontSize: '15px', color: '#000' }}>{selectedIntensity}</span>
              <ChevronDown size={14} color="#3b82f6" style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
            </div>
            
            {isExpanded && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, right: 0,
                backgroundColor: '#fff', borderRadius: '0 0 16px 16px',
                boxShadow: '0 8px 10px rgba(0,0,0,0.06)',
                border: '1px solid rgba(156, 163, 175, 0.12)', borderTop: 'none'
              }}>
                {intensityOptions.map((opt, i) => (
                  <React.Fragment key={opt}>
                    <div 
                      onClick={() => {
                        setSelectedIntensity(opt);
                        setIsExpanded(false);
                      }}
                      style={{
                        display: 'flex', justifyContent: 'space-between', padding: '14px 16px',
                        backgroundColor: selectedIntensity === opt ? 'rgba(59, 130, 246, 0.05)' : '#fff',
                        cursor: 'pointer'
                      }}
                    >
                      <span style={{ fontSize: '14px', color: selectedIntensity === opt ? '#3b82f6' : 'rgba(0,0,0,0.8)' }}>
                        {opt}
                      </span>
                      {selectedIntensity === opt && <Check size={14} color="#3b82f6" />}
                    </div>
                    {i < intensityOptions.length - 1 && <hr style={{ margin: '0 16px', borderTop: '1px solid #eee' }} />}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Interpretation Section */}
        <div style={{ margin: '0 18px 24px', padding: '20px', backgroundColor: '#fff', borderRadius: '18px', boxShadow: '0 3px 8px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#000' }}>INTERPRETATION CRITERIA:</div>
            <button 
              onClick={() => navigate(`/patient/${id}/modules/git/git-guidelines-biopsy`)}
              style={{
                padding: '6px 12px',
                backgroundColor: '#fff',
                border: '1px solid #007aff',
                borderRadius: '8px',
                color: '#007aff',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              View Full Table
            </button>
          </div>
          <div style={{ fontSize: '15px', color: 'rgba(0,0,0,0.8)', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
            {interpretationCriteria}
          </div>
        </div>

        {/* Result Card */}
        <div style={{ margin: '0 18px 24px', padding: '24px', backgroundColor: '#fff', borderRadius: '18px', boxShadow: '0 3px 8px rgba(0,0,0,0.05)', border: `2px solid ${inferenceColor}33` }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '12px' }}>RESULT</div>
          <div style={{ fontSize: '16px', fontWeight: 500, color: inferenceColor, lineHeight: '1.4' }}>
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
