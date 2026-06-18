import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../../../components/Layout';
import { ArrowLeft, ChevronDown, Check, BookOpen } from 'lucide-react';

const ranges = [
  "0–5%", "6–10%", "11–15%", "16–20%", 
  "21–30%", "31–40%", "41–50%", "51–60%", 
  "61–70%", "71–80%", "81–90%", "91–100%"
];

export const Ki67: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [selectedRange, setSelectedRange] = useState<string>("Select range");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  let inferenceResult = "";
  if (selectedRange !== "Select range") {
    if (selectedRange === "0–5%" || selectedRange === "6–10%") {
      inferenceResult = "low";
    } else if (selectedRange === "11–15%" || selectedRange === "16–20%" || selectedRange === "21–30%") {
      inferenceResult = "intermediate";
    } else {
      inferenceResult = "high";
    }
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const doctorId = localStorage.getItem('doctor_id') || '';
      const patientId = id || '';
      if (!patientId) {
        alert("Patient ID missing from URL");
        return;
      }
      
      const fullReport = `CLINICAL ANALYSIS REPORT: BREAST Ki67
-------------------------------------------
Patient ID: ${patientId}

CELL PROLIFERATION INDEX (Ki67): ${selectedRange}

INFERENCE: ${inferenceResult.toUpperCase()}

Interpretation: Ki-67 index is ${inferenceResult}. ${inferenceResult === 'high' ? 'High proliferation index is associated with more aggressive tumor biology and may indicate benefit from chemotherapy.' : (inferenceResult === 'intermediate' ? 'Intermediate proliferation index. Clinical correlation is recommended.' : 'Low proliferation index indicates slower tumor growth.')}`;

      const response = await fetch('/add_analysis_report.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          doctor_id: doctorId,
          patient_id: patientId,
          tissue_type: "Breast",
          marker: "Ki-67",
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
    <Layout 
      title="Breast - KI67"
      actions={
        <button 
          onClick={() => navigate(`/patient/${id}/modules/breast/guidelines`)}
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
        background: '#F5F8FC',
        minHeight: 'calc(100vh - 120px)',
        paddingBottom: '2rem'
      }}>
        
        {/* Dropdown */}
        <div style={{ position: 'relative', zIndex: isExpanded ? 10 : 1, padding: '20px' }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#000', marginBottom: '12px', paddingLeft: '4px' }}>
            Select Range below:
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
              <span style={{ fontSize: '17px', color: selectedRange === "Select range" ? '#9ca3af' : '#000' }}>
                {selectedRange}
              </span>
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
                {ranges.map((range, i) => (
                  <React.Fragment key={range}>
                    <div 
                      onClick={() => {
                        setSelectedRange(range);
                        setIsExpanded(false);
                      }}
                      style={{
                        display: 'flex', justifyContent: 'space-between', padding: '14px 16px',
                        backgroundColor: selectedRange === range ? 'rgba(59, 130, 246, 0.05)' : '#fff',
                        cursor: 'pointer'
                      }}
                    >
                      <span style={{ fontSize: '16px', color: selectedRange === range ? '#3b82f6' : 'rgba(0,0,0,0.8)' }}>
                        {range}
                      </span>
                      {selectedRange === range && <Check size={14} color="#3b82f6" />}
                    </div>
                    {i < ranges.length - 1 && <hr style={{ margin: '0 16px', borderTop: '1px solid #eee' }} />}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Inference Legend Card */}
        <div style={{ margin: '0 20px 20px', padding: '20px', backgroundColor: '#fff', borderRadius: '18px', boxShadow: '0 3px 8px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#000', marginBottom: '15px' }}>INFERENCE:</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '4px', backgroundColor: 'rgba(59, 130, 246, 0.6)' }}></div>
              <span style={{ fontSize: '16px', fontWeight: 500, color: 'rgba(0,0,0,0.8)' }}>&lt; 10%  →  low</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '4px', backgroundColor: 'rgba(59, 130, 246, 0.6)' }}></div>
              <span style={{ fontSize: '16px', fontWeight: 500, color: 'rgba(0,0,0,0.8)' }}>10–30% →  intermediate</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '4px', backgroundColor: 'rgba(59, 130, 246, 0.6)' }}></div>
              <span style={{ fontSize: '16px', fontWeight: 500, color: 'rgba(0,0,0,0.8)' }}>&gt; 30%  →  high</span>
            </div>
          </div>
          
          {selectedRange !== "Select range" && (
            <>
              <hr style={{ margin: '15px 0', borderTop: '1px solid #eee' }} />
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#3b82f6' }}>RESULT:</span>
                <span style={{ fontSize: '16px', fontWeight: 900, color: '#000' }}>{inferenceResult.toUpperCase()}</span>
              </div>
            </>
          )}
        </div>

        {/* Action Button */}
        <div style={{ margin: '0 20px 30px' }}>
          <button 
            onClick={handleSave}
            disabled={isSaving || selectedRange === "Select range"}
            style={{
              width: '100%', minHeight: '54px', background: 'linear-gradient(90deg, #3b82f6, #06b6d4)',
              color: '#fff', fontSize: '16px', fontWeight: 'bold',
              borderRadius: '16px', border: 'none', cursor: selectedRange === "Select range" ? 'not-allowed' : 'pointer',
              display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px',
              boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3)',
              opacity: selectedRange === "Select range" ? 0.6 : 1
            }}
          >
            {isSaving ? 'Saving...' : <><Check size={20} /> Save to Patient's Report</>}
          </button>
        </div>

      </div>
    </Layout>
  );
};
