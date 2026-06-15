import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../../../components/Layout';
import { ArrowLeft, ChevronDown, Check } from 'lucide-react';

const rangeOptions = [
  "0-5%", "6-10%", "11-15%", "16-20%", "21-30%",
  "31-40%", "41-50%", "51-60%", "61-70%", "71-80%",
  "81-90%", "91-100%"
];

export const GISTKi67Screen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [selectedRange, setSelectedRange] = useState<string>("0-5%");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  let riskCategory = "High proliferative index";
  if (selectedRange === "0-5%") riskCategory = "Low proliferative index";
  else if (["6-10%", "11-15%", "16-20%"].includes(selectedRange)) riskCategory = "Intermediate proliferative index";

  let inferenceColor = "#ef4444"; // red
  if (selectedRange === "0-5%") inferenceColor = "#22c55e"; // green
  else if (["6-10%", "11-15%", "16-20%"].includes(selectedRange)) inferenceColor = "#f97316"; // orange

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const doctorId = localStorage.getItem('doctor_id') || '';
      const patientId = id || '';
      if (!patientId) {
        alert("Patient ID missing from URL");
        return;
      }
      
      const fullReport = `CLINICAL ANALYSIS REPORT: GIST Ki-67
-------------------------------------------
Patient ID: ${patientId}

KI-67 RANGE: ${selectedRange}

ASSESSMENT: ${riskCategory.toUpperCase()}`;
      
      const response = await fetch('/add_analysis_report.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          doctor_id: doctorId,
          patient_id: patientId,
          tissue_type: "GIT",
          marker: "GIST Ki-67",
          total_score: selectedRange,
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
    <Layout title="GIST Ki-67">
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
            Select Range:
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
              <span style={{ fontSize: '16px', color: '#000' }}>{selectedRange}</span>
              <ChevronDown size={14} color="#3b82f6" style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
            </div>
            
            {isExpanded && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, right: 0,
                backgroundColor: '#fff', borderRadius: '0 0 16px 16px',
                boxShadow: '0 8px 10px rgba(0,0,0,0.06)',
                border: '1.2px solid rgba(156, 163, 175, 0.15)', borderTop: 'none',
                maxHeight: '300px', overflowY: 'auto'
              }}>
                {rangeOptions.map((opt, i) => (
                  <React.Fragment key={opt}>
                    <div 
                      onClick={() => {
                        setSelectedRange(opt);
                        setIsExpanded(false);
                      }}
                      style={{
                        display: 'flex', justifyContent: 'space-between', padding: '14px 16px',
                        backgroundColor: selectedRange === opt ? 'rgba(59, 130, 246, 0.05)' : '#fff',
                        cursor: 'pointer'
                      }}
                    >
                      <span style={{ fontSize: '15px', color: selectedRange === opt ? '#3b82f6' : 'rgba(0,0,0,0.8)' }}>
                        {opt}
                      </span>
                      {selectedRange === opt && <Check size={14} color="#3b82f6" />}
                    </div>
                    {i < rangeOptions.length - 1 && <hr style={{ margin: '0 16px', borderTop: '1px solid #eee' }} />}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Interpretation Box */}
        <div style={{ margin: '0 18px 24px', padding: '0', backgroundColor: '#fff', borderRadius: '18px', boxShadow: '0 3px 8px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#000', padding: '16px 24px 8px' }}>INTERPRETATION:</div>
          
          <div style={{ margin: '0 24px 24px', border: '1px solid rgba(156, 163, 175, 0.15)', borderRadius: '8px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', backgroundColor: 'rgba(59, 130, 246, 0.1)' }}>
              <div style={{ width: '100px', padding: '10px', fontSize: '13px', fontWeight: 'bold', borderRight: '1px solid rgba(156, 163, 175, 0.15)' }}>Index</div>
              <div style={{ flex: 1, padding: '10px', fontSize: '13px', fontWeight: 'bold' }}>Risk Classification</div>
            </div>
            
            <div style={{ display: 'flex', borderTop: '1px solid rgba(156, 163, 175, 0.15)' }}>
              <div style={{ width: '100px', padding: '12px', fontSize: '13px', fontWeight: 'bold', color: 'rgba(0,0,0,0.8)', borderRight: '1px solid rgba(156, 163, 175, 0.15)' }}>&lt; 5%</div>
              <div style={{ flex: 1, padding: '12px', fontSize: '13px', fontWeight: 500, color: '#22c55e' }}>Low Risk</div>
            </div>
            
            <div style={{ display: 'flex', borderTop: '1px solid rgba(156, 163, 175, 0.15)' }}>
              <div style={{ width: '100px', padding: '12px', fontSize: '13px', fontWeight: 'bold', color: 'rgba(0,0,0,0.8)', borderRight: '1px solid rgba(156, 163, 175, 0.15)' }}>5-9%</div>
              <div style={{ flex: 1, padding: '12px', fontSize: '13px', fontWeight: 500, color: '#f97316' }}>Intermediate Risk</div>
            </div>
            
            <div style={{ display: 'flex', borderTop: '1px solid rgba(156, 163, 175, 0.15)' }}>
              <div style={{ width: '100px', padding: '12px', fontSize: '13px', fontWeight: 'bold', color: 'rgba(0,0,0,0.8)', borderRight: '1px solid rgba(156, 163, 175, 0.15)' }}>&ge; 10%</div>
              <div style={{ flex: 1, padding: '12px', fontSize: '13px', fontWeight: 500, color: '#ef4444' }}>High Risk</div>
            </div>
          </div>
        </div>

        {/* Result Card */}
        <div style={{ margin: '0 18px 24px', padding: '24px', backgroundColor: '#fff', borderRadius: '18px', boxShadow: '0 3px 8px rgba(0,0,0,0.05)', border: `2px solid ${inferenceColor}33` }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '12px' }}>RESULT</div>
          <div style={{ fontSize: '18px', fontWeight: 500, color: inferenceColor, lineHeight: '1.4' }}>
            {riskCategory}
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
              borderRadius: '27px', border: 'none', cursor: 'pointer',
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
