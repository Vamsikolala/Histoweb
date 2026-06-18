import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../../../components/Layout';
import { ArrowLeft, ClipboardList, ChevronDown, Check, BookOpen } from 'lucide-react';

const intensityOptions = [
  { label: 'None (0)', value: 0 },
  { label: 'Weak (1)', value: 1 },
  { label: 'Moderate (2)', value: 2 },
  { label: 'Strong (3)', value: 3 }
];

const proportionOptions = [
  { label: 'None (0)', value: 0 },
  { label: '0-1% (Score 1)', value: 1 },
  { label: '1-10% (Score 2)', value: 2 },
  { label: '11-35% (Score 3)', value: 3 },
  { label: '36-60% (Score 4)', value: 4 },
  { label: '61-100% (Score 5)', value: 5 }
];

export const ERForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [selectedIntensity, setSelectedIntensity] = useState<number>(0);
  const [selectedProportion, setSelectedProportion] = useState<number>(0);
  const [isIntensityExpanded, setIsIntensityExpanded] = useState(false);
  const [isProportionExpanded, setIsProportionExpanded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const totalScore = selectedIntensity > 0 || selectedProportion > 0 ? selectedIntensity + selectedProportion : 0;
  const inference = totalScore <= 2 ? "Negative" : "Positive";
  const inferenceColor = totalScore <= 2 ? "#9ca3af" : "#22c55e"; // gray or green

  const handleSaveAndHScore = async () => {
    setIsSaving(true);
    try {
      const doctorId = localStorage.getItem('doctor_id') || '';
      const patientId = window.location.pathname.split('/')[2] || '';
      const patientName = localStorage.getItem('doctor_name') || 'Patient';
      if (!patientId) {
        alert("Patient ID missing from URL");
        return;
      }

      const intensityLabel = intensityOptions.find(o => o.value === selectedIntensity)?.label || 'None';
      const proportionLabel = proportionOptions.find(o => o.value === selectedProportion)?.label || 'None';
      const fullReport = `CLINICAL ANALYSIS REPORT: BREAST ER (ALLRED SCORE)
-------------------------------------------
Patient ID: ${patientId}

ALLRED SCORE:
- Intensity Score: ${selectedIntensity} (${intensityLabel})
- Proportion Score: ${selectedProportion} (${proportionLabel})
- Total Allred Score: ${totalScore}

INFERENCE: ${inference}

Interpretation: ${totalScore <= 2 ? 'The sample is ER Negative. Hormone therapy is unlikely to be beneficial.' : 'The sample is ER Positive. The patient may benefit from hormone-based therapy.'}`;

      const response = await fetch('/add_analysis_report.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          doctor_id: doctorId,
          patient_id: patientId,
          tissue_type: 'Breast',
          marker: 'ER (Allred Score)',
          total_score: `Allred Score: ${totalScore}`,
          inference: fullReport
        }).toString()
      });

      const data = await response.json();
      if (data.status) {
        alert("Assessment saved successfully!");
        // Navigate to H-Score page passing the Allred values
        navigate(`/patient/${patientId}/modules/breast/er-hscore`, {
          state: { initialIntensity: selectedIntensity, initialProportion: selectedProportion }
        });
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
      title="Breast Pathology - Estrogen Receptor (ER)"
      actions={
        <button 
          onClick={() => navigate(`/patient/${id}/modules/breast/guidelines`)}
          className="btn btn-primary btn-sm animate-scale-in"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '13px',
            boxShadow: 'var(--shadow-xs)'
          }}
        >
          <BookOpen size={14} /> Guidelines
        </button>
      }
    >
      {/* Back navigation button */}
      <div style={{ marginBottom: '1.5rem', padding: '0 var(--sp-6)' }}>
        <button 
          className="btn btn-secondary animate-fade-in" 
          onClick={() => navigate(`/patient/${id}/modules/breast`)} 
          style={{ 
            padding: '8px 16px', 
            fontSize: 'var(--text-sm)', 
            borderRadius: '12px', 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px',
            fontWeight: 600
          }}
        >
          <ArrowLeft size={16} /> Back to Modules
        </button>
      </div>

      <div style={{ 
        maxWidth: '720px', 
        margin: '0 auto', 
        padding: '0 var(--sp-6) var(--sp-12)',
      }}>
        
        {/* Modern Medical Title Card */}
        <div style={{ 
          background: 'linear-gradient(135deg, var(--primary-bg), #dbeafe)',
          border: '1px solid var(--primary-border)',
          borderRadius: '20px',
          padding: 'var(--sp-5) var(--sp-6)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--sp-4)',
          marginBottom: 'var(--sp-6)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ 
            width: 44, height: 44, borderRadius: '12px', background: 'white', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', 
            boxShadow: 'var(--shadow-xs)', flexShrink: 0
          }}>
            <ClipboardList color="var(--primary)" size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Allred Scoring System
            </h2>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', margin: '2px 0 0', fontWeight: 500 }}>
              Standardized semi-quantitative scoring for Estrogen Receptor (ER) expression
            </p>
          </div>
        </div>

        {/* Dynamic Interactive Card Container */}
        <div className="card animate-fade-in-up" style={{ padding: 'var(--sp-6)', borderRadius: '24px', boxShadow: 'var(--shadow)', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
          
          {/* Formula banner */}
          <div style={{ 
            textAlign: 'center', 
            background: 'var(--gray-50)',
            borderRadius: '12px',
            padding: '12px',
            fontSize: 'var(--text-xs)', 
            fontWeight: 700, 
            color: 'var(--text-secondary)',
            letterSpacing: '0.3px',
            border: '1px solid var(--gray-200)'
          }}>
            <span style={{ color: 'var(--primary)' }}>Proportion Score (0–5)</span> + <span style={{ color: 'var(--accent-dark)' }}>Intensity Score (0–3)</span> = <span style={{ color: 'var(--success)' }}>Total Allred Score (0–8)</span>
          </div>

          {/* Interactive Dropdowns Selection */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
            
            {/* Intensity Selection Dropdown */}
            <div style={{ position: 'relative', zIndex: isIntensityExpanded ? 20 : 5 }}>
              <label className="form-label" style={{ display: 'block', marginBottom: '8px', fontSize: 'var(--text-sm)', fontWeight: 700, paddingLeft: '4px' }}>
                Nuclear Staining Intensity:
              </label>
              <div 
                onClick={() => {
                  setIsIntensityExpanded(!isIntensityExpanded);
                  if (!isIntensityExpanded) setIsProportionExpanded(false);
                }}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '14px 16px', backgroundColor: '#fff',
                  borderRadius: '14px',
                  boxShadow: 'var(--shadow-xs)', cursor: 'pointer',
                  border: isIntensityExpanded ? '1.5px solid var(--primary)' : '1.5px solid var(--border)',
                  transition: 'var(--transition)'
                }}
              >
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {intensityOptions.find(o => o.value === selectedIntensity)?.label || 'Select intensity...'}
                </span>
                <ChevronDown size={16} color="var(--primary)" style={{ transform: isIntensityExpanded ? 'rotate(180deg)' : 'none', transition: 'var(--transition)' }} />
              </div>
              
              {isIntensityExpanded && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
                  backgroundColor: '#fff', borderRadius: '14px',
                  boxShadow: 'var(--shadow-md)',
                  border: '1px solid var(--border)', overflow: 'hidden',
                  animation: '0.2s cubic-bezier(0.16,1,.3,1) scaleIn'
                }}>
                  {intensityOptions.map((opt, i) => (
                    <div 
                      key={opt.value}
                      onClick={() => {
                        setSelectedIntensity(opt.value);
                        setIsIntensityExpanded(false);
                      }}
                      style={{
                        display: 'flex', justifyContent: 'space-between', padding: '14px 16px',
                        backgroundColor: selectedIntensity === opt.value ? 'var(--primary-bg)' : '#fff',
                        cursor: 'pointer',
                        transition: 'var(--transition-fast)',
                        borderBottom: i < intensityOptions.length - 1 ? '1px solid var(--gray-100)' : 'none'
                      }}
                      onMouseOver={(e) => {
                        if (selectedIntensity !== opt.value) e.currentTarget.style.backgroundColor = 'var(--gray-50)';
                      }}
                      onMouseOut={(e) => {
                        if (selectedIntensity !== opt.value) e.currentTarget.style.backgroundColor = '#fff';
                      }}
                    >
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: selectedIntensity === opt.value ? 'var(--primary)' : 'var(--text-primary)' }}>
                        {opt.label}
                      </span>
                      {selectedIntensity === opt.value && <Check size={16} color="var(--primary)" />}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Proportion Selection Dropdown */}
            <div style={{ position: 'relative', zIndex: isProportionExpanded ? 19 : 4 }}>
              <label className="form-label" style={{ display: 'block', marginBottom: '8px', fontSize: 'var(--text-sm)', fontWeight: 700, paddingLeft: '4px' }}>
                Proportion of Positive Tumor Cells:
              </label>
              <div 
                onClick={() => {
                  setIsProportionExpanded(!isProportionExpanded);
                  if (!isProportionExpanded) setIsIntensityExpanded(false);
                }}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '14px 16px', backgroundColor: '#fff',
                  borderRadius: '14px',
                  boxShadow: 'var(--shadow-xs)', cursor: 'pointer',
                  border: isProportionExpanded ? '1.5px solid var(--primary)' : '1.5px solid var(--border)',
                  transition: 'var(--transition)'
                }}
              >
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {proportionOptions.find(o => o.value === selectedProportion)?.label || 'Select proportion...'}
                </span>
                <ChevronDown size={16} color="var(--primary)" style={{ transform: isProportionExpanded ? 'rotate(180deg)' : 'none', transition: 'var(--transition)' }} />
              </div>
              
              {isProportionExpanded && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
                  backgroundColor: '#fff', borderRadius: '14px',
                  boxShadow: 'var(--shadow-md)',
                  border: '1px solid var(--border)', overflow: 'hidden',
                  animation: '0.2s cubic-bezier(0.16,1,.3,1) scaleIn'
                }}>
                  {proportionOptions.map((opt, i) => (
                    <div 
                      key={opt.value}
                      onClick={() => {
                        setSelectedProportion(opt.value);
                        setIsProportionExpanded(false);
                      }}
                      style={{
                        display: 'flex', justifyContent: 'space-between', padding: '14px 16px',
                        backgroundColor: selectedProportion === opt.value ? 'var(--primary-bg)' : '#fff',
                        cursor: 'pointer',
                        transition: 'var(--transition-fast)',
                        borderBottom: i < proportionOptions.length - 1 ? '1px solid var(--gray-100)' : 'none'
                      }}
                      onMouseOver={(e) => {
                        if (selectedProportion !== opt.value) e.currentTarget.style.backgroundColor = 'var(--gray-50)';
                      }}
                      onMouseOut={(e) => {
                        if (selectedProportion !== opt.value) e.currentTarget.style.backgroundColor = '#fff';
                      }}
                    >
                      <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: selectedProportion === opt.value ? 'var(--primary)' : 'var(--text-primary)' }}>
                        {opt.label}
                      </span>
                      {selectedProportion === opt.value && <Check size={16} color="var(--primary)" />}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Upgraded Diagnostic Result Panel */}
          <div style={{
            padding: '20px',
            backgroundColor: totalScore <= 2 ? 'var(--gray-50)' : '#f0fdf4',
            borderRadius: '18px',
            border: `1.5px solid ${inferenceColor}33`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            boxShadow: 'var(--shadow-xs)',
            transition: 'all 0.3s ease'
          }}>
            <div style={{ fontSize: 'var(--text-xs)', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Allred Interpretation & Verdict
            </div>
            <div style={{ fontSize: '24px', fontWeight: 900, color: inferenceColor, display: 'flex', alignItems: 'center', gap: '10px' }}>
              {inference} 
              <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', background: 'white', padding: '4px 10px', borderRadius: '8px', border: '1px solid var(--border)', fontWeight: 700 }}>
                Score: {totalScore} / 8
              </span>
            </div>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', margin: '4px 0 0', maxWidth: '440px', lineHeight: 1.4, fontWeight: 500 }}>
              {totalScore <= 2 
                ? 'The specimen demonstrates negative Estrogen Receptor expression (Allred Score ≤ 2). Endocrine/Hormonal therapy is unlikely to yield clinical benefit.' 
                : 'The specimen demonstrates positive Estrogen Receptor expression (Allred Score 3–8). Endocrine/Hormonal therapy (e.g. Tamoxifen/Aromatase inhibitors) is highly recommended.'}
            </p>
          </div>

          {/* Beautiful Medical Reference Table */}
          <div style={{ marginTop: 'var(--sp-2)' }}>
            <h3 style={{ fontSize: 'var(--text-sm)', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px', paddingLeft: '2px' }}>
              Allred Scoring System Reference
            </h3>
            <div style={{ border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden', boxShadow: 'var(--shadow-xs)' }}>
              <div style={{ display: 'flex', backgroundColor: 'var(--gray-100)', borderBottom: '1.5px solid var(--border)' }}>
                <div style={{ flex: '1', padding: '10px 14px', fontSize: 'var(--text-xs)', fontWeight: 800, color: 'var(--text-secondary)' }}>Intensity (Score 0-3)</div>
                <div style={{ flex: '1.2', padding: '10px 14px', fontSize: 'var(--text-xs)', fontWeight: 800, color: 'var(--text-secondary)' }}>Proportion / Cell % (Score 0-5)</div>
                <div style={{ flex: '0.8', padding: '10px 14px', fontSize: 'var(--text-xs)', fontWeight: 800, color: 'var(--text-secondary)', textAlign: 'right' }}>Interpretation</div>
              </div>
              {[
                { intensity: 'None (0)', proportion: 'None (0)', interpretation: '0–2: Negative' },
                { intensity: 'Weak (1)', proportion: '< 1/100 (1)', interpretation: '3–8: Positive' },
                { intensity: 'Moderate (2)', proportion: '1/100 to 1/10 (2)', interpretation: '' },
                { intensity: 'Strong (3)', proportion: '1/10 to 1/3 (3)', interpretation: '' },
                { intensity: '', proportion: '1/3 to 2/3 (4)', interpretation: '' },
                { intensity: '', proportion: '> 2/3 (5)', interpretation: '' }
              ].map((row, i) => (
                <div key={i} style={{ display: 'flex', borderBottom: i < 5 ? '1px solid var(--gray-100)' : 'none', backgroundColor: 'white' }}>
                  <div style={{ flex: '1', padding: '10px 14px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>{row.intensity}</div>
                  <div style={{ flex: '1.2', padding: '10px 14px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>{row.proportion}</div>
                  <div style={{ flex: '0.8', padding: '10px 14px', fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', textAlign: 'right' }}>{row.interpretation}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Premium Save Action Button */}
          <div style={{ marginTop: 'var(--sp-3)' }}>
            <button 
              onClick={handleSaveAndHScore}
              disabled={isSaving}
              className="btn btn-primary btn-lg btn-full"
              style={{
                borderRadius: '16px',
                fontWeight: 800,
                boxShadow: 'var(--shadow-blue-lg)',
                padding: '16px 20px',
                fontSize: 'var(--text-base)',
                letterSpacing: '0.2px'
              }}
            >
              {isSaving ? (
                <>
                  <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2, marginRight: 8 }} />
                  Saving assessment...
                </>
              ) : (
                'Save Assessment & Proceed to H-Score →'
              )}
            </button>
          </div>

        </div>
      </div>
    </Layout>
  );
};
