import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../../../components/Layout';
import { ArrowLeft, ChevronDown, Check, Cross, BookOpen } from 'lucide-react';

const intensityOptions = ["0", "1+", "2+", "3+"];
const percentageOptions = ["> 10%", "≤ 10%"];

export const BreastHER2: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [selectedIntensity, setSelectedIntensity] = useState<string>("0");
  const [selectedPercentage, setSelectedPercentage] = useState<string>("> 10%");
  
  const [isIntensityExpanded, setIsIntensityExpanded] = useState(false);
  const [isPercentageExpanded, setIsPercentageExpanded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  let inference = "Negative (0)";
  if (selectedIntensity === "3+") {
    inference = selectedPercentage === "> 10%" ? "Positive" : "Equivocal";
  } else if (selectedIntensity === "2+") {
    inference = "Equivocal";
  } else if (selectedIntensity === "1+") {
    inference = selectedPercentage === "> 10%" ? "Negative (1+)" : "Negative (0)";
  }

  let inferenceColor = "#9ca3af"; // gray
  if (inference.includes("Positive")) inferenceColor = "#22c55e"; // green
  if (inference.includes("Equivocal")) inferenceColor = "#f97316"; // orange
  if (inference.includes("Negative")) inferenceColor = "#ef4444"; // red

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const doctorId = localStorage.getItem('doctor_id') || '';
      const patientId = id || '';
      if (!patientId) {
        alert("Patient ID missing from URL");
        return;
      }
      
      const fullReport = `CLINICAL ANALYSIS REPORT: BREAST HER2
-------------------------------------------
Patient ID: ${patientId}

STAINING INTENSITY: ${selectedIntensity}
PERCENTAGE OF TUMOR CELLS: ${selectedPercentage}

INFERENCE: ${inference}

Interpretation: ${selectedIntensity === "2+" ? "The result is Equivocal. Reflex testing using FISH is strongly recommended for final classification." : (inference === "Positive" ? "HER2 overexpression is detected. The patient may be a candidate for anti-HER2 targeted therapy." : "HER2 negative. No clinical indication for targeted therapy.")}`;
      
      const response = await fetch('/add_analysis_report.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          doctor_id: doctorId,
          patient_id: patientId,
          tissue_type: "Breast",
          marker: "HER2",
          total_score: `Score ${selectedIntensity}`,
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
    <Layout 
      title="Breast - HER2"
      actions={
        <button 
          onClick={() => navigate(`/patient/${id}/modules/breast/her2-guidelines`)}
          className="btn btn-secondary btn-sm"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '8px',
            fontWeight: 'bold',
            fontSize: '13px'
          }}
        >
          <BookOpen size={14} /> Guidelines
        </button>
      }
    >
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
        
        {/* Title Card */}
        <div style={{ margin: '0 18px 20px', padding: '16px', backgroundColor: '#fff', borderRadius: '18px', boxShadow: '0 3px 8px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center' }}>
          <Cross color="#3b82f6" size={22} style={{ marginRight: '10px' }} />
          <span style={{ fontSize: '20px', fontWeight: 'bold', color: '#000' }}>HER2</span>
        </div>

        {/* Dropdowns Card */}
        <div style={{ margin: '0 18px 20px', padding: '18px', backgroundColor: '#fff', borderRadius: '18px', boxShadow: '0 3px 8px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Intensity Dropdown */}
          <div style={{ position: 'relative', zIndex: isIntensityExpanded ? 20 : 1 }}>
            <div style={{ fontSize: '16px', fontWeight: 600, color: '#000', marginBottom: '12px' }}>
              Select Intensity of Staining:
            </div>
            <div style={{ position: 'relative' }}>
              <div 
                onClick={() => {
                  setIsIntensityExpanded(!isIntensityExpanded);
                  if (!isIntensityExpanded) setIsPercentageExpanded(false);
                }}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '14px 16px', backgroundColor: '#fff',
                  borderRadius: isIntensityExpanded ? '16px 16px 0 0' : '16px',
                  boxShadow: '0 3px 6px rgba(0,0,0,0.06)', cursor: 'pointer',
                  border: '1.2px solid rgba(156, 163, 175, 0.15)'
                }}
              >
                <span style={{ fontSize: '17px', color: '#000' }}>{selectedIntensity}</span>
                <ChevronDown size={14} color="#3b82f6" style={{ transform: isIntensityExpanded ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
              </div>
              
              {isIntensityExpanded && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, right: 0,
                  backgroundColor: '#fff', borderRadius: '0 0 16px 16px',
                  boxShadow: '0 8px 10px rgba(0,0,0,0.06)',
                  border: '1.2px solid rgba(156, 163, 175, 0.15)', borderTop: 'none'
                }}>
                  {intensityOptions.map((opt, i) => (
                    <React.Fragment key={opt}>
                      <div 
                        onClick={() => {
                          setSelectedIntensity(opt);
                          setIsIntensityExpanded(false);
                        }}
                        style={{
                          display: 'flex', justifyContent: 'space-between', padding: '14px 16px',
                          backgroundColor: selectedIntensity === opt ? 'rgba(59, 130, 246, 0.05)' : '#fff',
                          cursor: 'pointer'
                        }}
                      >
                        <span style={{ fontSize: '16px', color: selectedIntensity === opt ? '#3b82f6' : 'rgba(0,0,0,0.8)' }}>
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

          {/* Percentage Dropdown */}
          <div style={{ position: 'relative', zIndex: isPercentageExpanded ? 19 : 1 }}>
            <div style={{ fontSize: '16px', fontWeight: 600, color: '#000', marginBottom: '12px' }}>
              Percentage of Tumor Cells:
            </div>
            <div style={{ position: 'relative' }}>
              <div 
                onClick={() => {
                  setIsPercentageExpanded(!isPercentageExpanded);
                  if (!isPercentageExpanded) setIsIntensityExpanded(false);
                }}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '14px 16px', backgroundColor: '#fff',
                  borderRadius: isPercentageExpanded ? '16px 16px 0 0' : '16px',
                  boxShadow: '0 3px 6px rgba(0,0,0,0.06)', cursor: 'pointer',
                  border: '1.2px solid rgba(156, 163, 175, 0.15)'
                }}
              >
                <span style={{ fontSize: '17px', color: '#000' }}>{selectedPercentage}</span>
                <ChevronDown size={14} color="#3b82f6" style={{ transform: isPercentageExpanded ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
              </div>
              
              {isPercentageExpanded && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, right: 0,
                  backgroundColor: '#fff', borderRadius: '0 0 16px 16px',
                  boxShadow: '0 8px 10px rgba(0,0,0,0.06)',
                  border: '1.2px solid rgba(156, 163, 175, 0.15)', borderTop: 'none'
                }}>
                  {percentageOptions.map((opt, i) => (
                    <React.Fragment key={opt}>
                      <div 
                        onClick={() => {
                          setSelectedPercentage(opt);
                          setIsPercentageExpanded(false);
                        }}
                        style={{
                          display: 'flex', justifyContent: 'space-between', padding: '14px 16px',
                          backgroundColor: selectedPercentage === opt ? 'rgba(59, 130, 246, 0.05)' : '#fff',
                          cursor: 'pointer'
                        }}
                      >
                        <span style={{ fontSize: '16px', color: selectedPercentage === opt ? '#3b82f6' : 'rgba(0,0,0,0.8)' }}>
                          {opt}
                        </span>
                        {selectedPercentage === opt && <Check size={14} color="#3b82f6" />}
                      </div>
                      {i < percentageOptions.length - 1 && <hr style={{ margin: '0 16px', borderTop: '1px solid #eee' }} />}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Result Card */}
        <div style={{
          margin: '0 18px 20px', padding: '20px', textAlign: 'center',
          backgroundColor: '#fff', borderRadius: '18px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
          border: `2px solid ${inferenceColor}33` // 20% opacity
        }}>
          <div style={{ fontSize: '20px', fontWeight: 'bold', color: inferenceColor, marginBottom: '8px' }}>
            Interpretation: {inference}
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>
            {selectedIntensity === "2+" ? "Further FISH testing recommended" : (inference === "Positive" ? "HER2 gene amplification present" : "No HER2 gene amplification")}
          </div>
        </div>

        {/* Scoring Criteria Card */}
        <div style={{ margin: '0 18px 20px', padding: '18px', backgroundColor: '#fff', borderRadius: '18px', boxShadow: '0 3px 8px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#000', marginBottom: '18px' }}>Scoring Criteria</div>
          
          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ width: '100px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#000' }}>% of Tumor Cells</div>
              <div style={{ backgroundColor: '#3b82f6', color: '#fff', padding: '8px 0', textAlign: 'center', borderRadius: '10px', fontSize: '15px', fontWeight: 600 }}>&gt; 10%</div>
              <div style={{ backgroundColor: '#3b82f6', color: '#fff', padding: '8px 0', textAlign: 'center', borderRadius: '10px', fontSize: '15px', fontWeight: 600 }}>&le; 10%</div>
            </div>
            
            <div style={{ width: '1px', backgroundColor: 'rgba(156, 163, 175, 0.2)' }}></div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#000' }}>Intensity of Staining</div>
              <div style={{ fontSize: '15px', fontWeight: 500, color: '#000' }}>Complete = 3+ Positive</div>
              <div style={{ fontSize: '15px', fontWeight: 500, color: '#000' }}>Moderate = 2+ Equivocal</div>
              <div style={{ fontSize: '15px', fontWeight: 500, color: '#000' }}>Incomplete = 1+ Negative</div>
              <div style={{ fontSize: '15px', fontWeight: 500, color: '#000' }}>No staining = 0 Negative</div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div style={{ margin: '0 18px 20px' }}>
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

        {/* Quick Interpretation Card */}
        <div style={{ margin: '0 18px 24px', padding: '18px', backgroundColor: '#fff', borderRadius: '18px', boxShadow: '0 3px 8px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#000', marginBottom: '12px' }}>Quick Interpretation</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '5px', backgroundColor: '#22c55e' }}></div>
              <span style={{ fontSize: '15px', fontWeight: 500, color: '#000' }}>3+ → Positive</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '5px', backgroundColor: '#f97316' }}></div>
              <span style={{ fontSize: '15px', fontWeight: 500, color: '#000' }}>2+ → Equivocal</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '5px', backgroundColor: '#ef4444' }}></div>
              <span style={{ fontSize: '15px', fontWeight: 500, color: '#000' }}>1+ / 0 → Negative</span>
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
};
