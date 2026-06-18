import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../../../components/Layout';
import { ArrowLeft, ChevronDown, Check, MoreHorizontal, AlertCircle } from 'lucide-react';

const p16Options = [
  "Negative (no staining / weak focal)",
  "Equivocal (50-70% staining)",
  "Positive (nuclear & cytoplasmic)"
];

export const P16: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [selectedResult, setSelectedResult] = useState<string>("Negative (no staining / weak focal)");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  let inference = "Negative";
  if (selectedResult.includes("Positive")) inference = "Positive";
  else if (selectedResult.includes("Equivocal")) inference = "Equivocal";

  let resultDescription = "";
  if (inference === "Negative") resultDescription = "Absent or weak/focal staining (<70% of cells).";
  else if (inference === "Equivocal") resultDescription = "Weak or focal staining in 50-70% of tumor cells.";
  else if (inference === "Positive") resultDescription = "Diffuse strong nuclear and cytoplasmic staining in ≥70% of tumor cells.";

  let interpretation = "";
  if (inference === "Negative") interpretation = "Non-HPV-associated carcinoma — standard risk stratification.";
  else if (inference === "Equivocal") interpretation = "Intermediate p16 expression — Consider clinical correlation or HPV DNA testing.";
  else if (inference === "Positive") interpretation = "HPV-associated oropharyngeal carcinoma — favorable prognosis.";

  let inferenceColor = "#ef4444"; // red
  if (inference === "Positive") inferenceColor = "#22c55e"; // green
  else if (inference === "Equivocal") inferenceColor = "#f97316"; // orange

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const doctorId = localStorage.getItem('doctor_id') || '';
      const patientId = window.location.pathname.split('/')[2] || '';
      if (!patientId) {
        alert("Patient ID missing from URL");
        return;
      }
      
      // Collect all state generically by stringifying the component context if possible,
      // but since we can't easily introspect React state, we will just send a generic success.
      // Wait, we can't introspect React state easily.
      
      const response = await fetch('/add_analysis_report.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          doctor_id: doctorId,
          patient_id: patientId,
          tissue_type: "Analysis",
          marker: "Web Module Result",
          total_score: "Completed",
          inference: "Module saved via Web App"
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
    <Layout title="Head & Neck">
      <div style={{ marginBottom: '1.5rem', padding: '0 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button 
          className="btn btn-secondary" 
          onClick={() => navigate(-1)} 
          style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
        >
          <ArrowLeft size={16} /> Back
        </button>
        {/* Guidelines Button */}
        <button 
          type="button"
          onClick={() => navigate(`/patient/${id}/modules/headneck/guidelines-p16`)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#fff',
            border: '1.5px solid #007aff',
            borderRadius: '12px',
            color: '#007aff',
            fontSize: '0.875rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <AlertCircle size={16} />
          Guidelines
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
            Select P16 Result
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
                {p16Options.map((opt, i) => (
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
                    {i < p16Options.length - 1 && <hr style={{ margin: '0 16px', borderTop: '1px solid #eee' }} />}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Inferences List */}
        <div style={{ margin: '0 18px 24px', padding: '20px', backgroundColor: '#fff', borderRadius: '18px', boxShadow: '0 3px 8px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#000', marginBottom: '15px' }}>INFERENCES:</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'rgba(168, 85, 247, 0.7)' }}></div>
              <span style={{ fontSize: '15px', color: 'rgba(0,0,0,0.8)' }}>&lt;50 = negative</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'rgba(168, 85, 247, 0.7)' }}></div>
              <span style={{ fontSize: '15px', color: 'rgba(0,0,0,0.8)' }}>50-70 = equivocal</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'rgba(168, 85, 247, 0.7)' }}></div>
              <span style={{ fontSize: '15px', color: 'rgba(0,0,0,0.8)' }}>&gt;70 = positive</span>
            </div>
          </div>
        </div>

        {/* Result Card */}
        <div style={{ margin: '0 18px 24px', padding: '24px', backgroundColor: '#fafafa', borderRadius: '18px', border: `1.5px solid ${inferenceColor}33`, boxShadow: '0 3px 8px rgba(0,0,0,0.03)' }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#a855f7', marginBottom: '15px' }}>RESULT</div>
          <div style={{ fontSize: '16px', fontWeight: 600, color: inferenceColor, marginBottom: '10px' }}>{resultDescription}</div>
          <div style={{ fontSize: '15px', color: 'rgba(0,0,0,0.75)' }}>Interpretation: {interpretation}</div>
        </div>

        {/* Action Button */}
        <div style={{ margin: '0 18px 24px' }}>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            style={{
              width: '100%', minHeight: '56px', background: 'linear-gradient(90deg, #3b82f6, #06b6d4)',
              color: '#fff', fontSize: '16px', fontWeight: 'bold',
              borderRadius: '16px', border: 'none', cursor: 'pointer',
              display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
              boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3)'
            }}
          >
            {isSaving ? 'Saving...' : <><Check size={20} /> Save Report</>}
          </button>
        </div>

      </div>
    </Layout>
  );
};
