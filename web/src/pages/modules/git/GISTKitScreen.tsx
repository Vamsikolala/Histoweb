import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../../../components/Layout';
import { ArrowLeft, ChevronDown, Check, Info } from 'lucide-react';

const patterns = [
  "Diffuse strong positivity",
  "Focal weak pattern",
  "Dot like peri-nuclear staining",
  "Membranous pattern"
];

export const GISTKitScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [selectedPattern, setSelectedPattern] = useState<string>("Diffuse strong positivity");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const doctorId = localStorage.getItem('doctor_id') || '';
      const patientId = id || '';
      if (!patientId) {
        alert("Patient ID missing from URL");
        return;
      }
      
      const fullReport = `CLINICAL ANALYSIS REPORT: GIST - KIT (CD117)
-------------------------------------------
Patient ID: ${patientId}

KIT (CD117) PATTERN: ${selectedPattern}

Assessment: Positive (consistent with gastrointestinal stromal tumor)`;
      
      const response = await fetch('/add_analysis_report.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          doctor_id: doctorId,
          patient_id: patientId,
          tissue_type: "GIT",
          marker: "GIST KIT (CD117)",
          total_score: selectedPattern,
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
    <Layout title="GIST - KIT">
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
            Select KIT (CD117) Pattern:
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
              <span style={{ fontSize: '16px', color: '#000' }}>{selectedPattern}</span>
              <ChevronDown size={14} color="#3b82f6" style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
            </div>
            
            {isExpanded && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, right: 0,
                backgroundColor: '#fff', borderRadius: '0 0 16px 16px',
                boxShadow: '0 8px 10px rgba(0,0,0,0.06)',
                border: '1.2px solid rgba(156, 163, 175, 0.15)', borderTop: 'none'
              }}>
                {patterns.map((pattern, i) => (
                  <React.Fragment key={pattern}>
                    <div 
                      onClick={() => {
                        setSelectedPattern(pattern);
                        setIsExpanded(false);
                      }}
                      style={{
                        display: 'flex', justifyContent: 'space-between', padding: '14px 16px',
                        backgroundColor: selectedPattern === pattern ? 'rgba(59, 130, 246, 0.05)' : '#fff',
                        cursor: 'pointer'
                      }}
                    >
                      <span style={{ fontSize: '15px', color: selectedPattern === pattern ? '#3b82f6' : 'rgba(0,0,0,0.8)' }}>
                        {pattern}
                      </span>
                      {selectedPattern === pattern && <Check size={14} color="#3b82f6" />}
                    </div>
                    {i < patterns.length - 1 && <hr style={{ margin: '0 16px', borderTop: '1px solid #eee' }} />}
                  </React.Fragment>
                ))}
              </div>
            )}
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

        {/* Clinical Note Card */}
        <div style={{ margin: '0 18px 24px', padding: '20px', backgroundColor: '#fff', borderRadius: '18px', boxShadow: '0 3px 8px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Info size={20} color="#3b82f6" />
            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#000' }}>Clinical Significance</span>
          </div>
          <div style={{ fontSize: '14px', color: 'rgba(0,0,0,0.7)', lineHeight: '1.5' }}>
            KIT expression is observed in ~95% of GISTs. Diffuse strong positivity is the most common pattern. Diagnostic refinement is required if staining is weak or focal.
          </div>
        </div>

      </div>
    </Layout>
  );
};
