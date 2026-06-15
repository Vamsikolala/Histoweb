import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../../../components/Layout';
import { ArrowLeft, ChevronDown, Check } from 'lucide-react';

const rangeOptions = ["0-2%", "3-20%", "21-55%", ">55%"];

export const NETStomachScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [selectedRange, setSelectedRange] = useState<string>("0-2%");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);


  let resultText = "";
  if (selectedRange === "0-2%") resultText = "Well-differentiated neuroendocrine tumor — Grade 1 (G1)";
  else if (selectedRange === "3-20%") resultText = "Well-differentiated neuroendocrine tumor — Grade 2 (G2)";
  else if (selectedRange === "21-55%") resultText = "Well-differentiated neuroendocrine tumor — Grade 3 (G3)";
  else if (selectedRange === ">55%") resultText = "Poorly-differentiated neuroendocrine carcinoma (NEC) — High grade";

  let resultColor = "#9ca3af";
  if (selectedRange === "0-2%") resultColor = "#22c55e"; // green
  else if (selectedRange === "3-20%") resultColor = "#f97316"; // orange
  else if (selectedRange === "21-55%") resultColor = "#ef4444"; // red
  else if (selectedRange === ">55%") resultColor = "#8b5cf6"; // purple-ish blue

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const doctorId = localStorage.getItem('doctor_id') || '';
      const patientId = id || '';
      if (!patientId) {
        alert("Patient ID missing from URL");
        return;
      }
      
      const fullReport = `CLINICAL ANALYSIS REPORT: NET STOMACH
-------------------------------------------
Patient ID: ${patientId}

KI-67 RANGE: ${selectedRange}

DIAGNOSIS: ${resultText}`;
      
      const response = await fetch('/add_analysis_report.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          doctor_id: doctorId,
          patient_id: patientId,
          tissue_type: "GIT",
          marker: "NET Stomach",
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
    <Layout title="NET Stomach">
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
            Ki-67 Index Range:
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
              <span style={{ fontSize: '16px', fontWeight: 500, color: '#000' }}>{selectedRange}</span>
              <ChevronDown size={14} color="#3b82f6" style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
            </div>
            
            {isExpanded && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, right: 0,
                backgroundColor: '#fff', borderRadius: '0 0 16px 16px',
                boxShadow: '0 8px 10px rgba(0,0,0,0.06)',
                border: '1px solid rgba(156, 163, 175, 0.12)', borderTop: 'none'
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

        {/* Interpretation Guidelines Box */}
        <div style={{ margin: '0 18px 24px', padding: '20px', backgroundColor: 'rgba(255, 255, 255, 0.6)', borderRadius: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#6b7280' }}>INTERPRETATION GUIDELINES:</div>
            <button 
              onClick={() => navigate(`/patient/${id}/modules/git/net-guidelines`)}
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ fontSize: '15px', fontWeight: 500, color: 'rgba(0,0,0,0.8)' }}>&lt;3%</span>
              <span style={{ fontSize: '15px', color: '#9ca3af' }}>→</span>
              <span style={{ fontSize: '15px', color: 'rgba(0,0,0,0.8)' }}>Well differentiated neuroendocrine tumor - grade 1</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ fontSize: '15px', fontWeight: 500, color: 'rgba(0,0,0,0.8)' }}>3-20%</span>
              <span style={{ fontSize: '15px', color: '#9ca3af' }}>→</span>
              <span style={{ fontSize: '15px', color: 'rgba(0,0,0,0.8)' }}>Well differentiated neuroendocrine tumor - grade 2</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ fontSize: '15px', fontWeight: 500, color: 'rgba(0,0,0,0.8)' }}>&gt;20%</span>
              <span style={{ fontSize: '15px', color: '#9ca3af' }}>→</span>
              <span style={{ fontSize: '15px', color: 'rgba(0,0,0,0.8)' }}>Well differentiated neuroendocrine tumor - grade 3</span>
            </div>
          </div>
        </div>

        {/* Result Card */}
        <div style={{ margin: '0 18px 24px', padding: '24px', backgroundColor: '#fff', borderRadius: '22px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', border: `2px solid ${resultColor}33` }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '12px' }}>RESULT</div>
          <div style={{ fontSize: '18px', fontWeight: 500, color: resultColor, lineHeight: '1.4' }}>
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
