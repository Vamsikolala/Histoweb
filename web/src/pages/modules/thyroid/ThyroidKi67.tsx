import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout } from '../../../components/Layout';
import { ArrowLeft, ChevronDown, Check, AlertTriangle } from 'lucide-react';

const ranges = ["<3%", "≥3% to <5%", "≥5%"];

export const ThyroidKi67: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [selectedRange, setSelectedRange] = useState<string>("<3%");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  let resultTitle = "";
  if (selectedRange === "<3%") resultTitle = "Low proliferative activity.";
  else if (selectedRange === "≥3% to <5%") resultTitle = "Mild-moderate proliferation.";
  else if (selectedRange === "≥5%") resultTitle = "High proliferative index.";

  let resultDescription = "";
  if (selectedRange === "<3%") resultDescription = "Benign or indolent behavior likely (e.g., classic PTC, NIFTP).";
  else if (selectedRange === "≥3% to <5%") resultDescription = "Correlate with histomorphology (e.g., follicular variant PTC).";
  else if (selectedRange === "≥5%") resultDescription = "Suggestive of:\n• Hobnail/micropapillary variant PTC\n• Follicular Thyroid carcinoma";

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const doctorId = localStorage.getItem('doctor_id') || '';
      const patientId = id || '';
      if (!patientId) {
        alert("Patient ID missing from URL");
        return;
      }
      
      const fullReport = `CLINICAL ANALYSIS REPORT: THYROID Ki-67
-------------------------------------------
Patient ID: ${patientId}

KI-67 RANGE: ${selectedRange}

ASSESSMENT: ${resultTitle}
${resultDescription}`;
      
      const response = await fetch('/add_analysis_report.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          doctor_id: doctorId,
          patient_id: patientId,
          tissue_type: "Thyroid",
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
    <Layout title="Thyroid Analysis">
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
        background: 'linear-gradient(180deg, #F5F8FC 0%, #FFFFFF 100%)',
        minHeight: 'calc(100vh - 120px)',
        paddingBottom: '2rem'
      }}>
        
        {/* Dropdown Card */}
        <div style={{ position: 'relative', zIndex: isExpanded ? 20 : 1, margin: '0 18px 24px' }}>
          <div style={{ fontSize: '16px', fontWeight: 600, color: '#000', paddingLeft: '4px', paddingBottom: '12px' }}>
            Select Range
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
                      <span style={{ fontSize: '15px', color: selectedRange === range ? '#3b82f6' : 'rgba(0,0,0,0.8)' }}>
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

        {/* Inferences Section */}
        <div style={{ margin: '0 18px 24px', padding: '20px', backgroundColor: '#fff', borderRadius: '18px', boxShadow: '0 3px 8px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#000', marginBottom: '16px' }}>INFERENCES:</div>
          
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3b82f6' }}></div>
              <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#000' }}>&gt;5%</span>
            </div>
            <div style={{ paddingLeft: '16px', fontSize: '14px', color: 'rgba(0,0,0,0.7)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span>1. Hobnail variant of papillary Thyroid carcinoma.</span>
              <span>2. Follicular Thyroid carcinoma</span>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#3b82f6' }}></div>
              <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#000' }}>&gt;10%</span>
            </div>
            <div style={{ paddingLeft: '16px', fontSize: '14px', color: 'rgba(0,0,0,0.7)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span>1. Poorly differentiated Thyroid carcinoma</span>
              <span>2. Anaplastic carcinoma</span>
            </div>
          </div>
        </div>

        {/* Result Card */}
        <div style={{ margin: '0 18px 24px', padding: '20px', backgroundColor: '#fff', borderRadius: '18px', border: '1px solid rgba(59, 130, 246, 0.1)', boxShadow: '0 3px 8px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '12px' }}>RESULT</div>
          <div style={{ fontSize: '16px', fontWeight: 600, color: '#000', marginBottom: '4px' }}>{resultTitle}</div>
          <div style={{ fontSize: '15px', color: 'rgba(0,0,0,0.7)', whiteSpace: 'pre-wrap' }}>{resultDescription}</div>

          {selectedRange === "≥5%" && (
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px', alignItems: 'flex-start' }}>
              <AlertTriangle size={18} color="#f97316" style={{ marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '15px', fontWeight: 600, color: '#000' }}>If &gt;10%, strongly consider:</div>
                <div style={{ fontSize: '14px', color: 'rgba(0,0,0,0.7)', whiteSpace: 'pre-wrap' }}>
                  • Poorly differentiated Thyroid carcinoma<br/>
                  • Anaplastic Thyroid carcinoma
                </div>
              </div>
            </div>
          )}
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
            {isSaving ? 'Saving...' : <><Check size={20} /> Save Report</>}
          </button>
        </div>

      </div>
    </Layout>
  );
};
