import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { API_BASE_URL } from '../utils/api';
import { generateReportPDF } from '../utils/pdfGenerator';
import { ArrowLeft, Download, FileText, Activity, Trash2, FolderDown } from 'lucide-react';

interface PatientData {
  patient_id: string;
  name: string;
  age: string;
  gender: string;
  phone: string;
  address: string;
  diagnosis: string;
}

interface ReportData {
  id: number;
  report_type: string;
  diagnosis: string;
  created_at: string;
  source: string;
  report?: string;
  notes?: string;
}

interface VirtualDownload {
  download_id: string;
  report_id: number;
  patient_id: string;
  patient_name: string;
  report_type: string;
  diagnosis: string;
  notes: string;
  report: string;
  created_at: string;
  downloaded_at: string;
}

export const Downloads: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get('patient_id');
  
  const [patient, setPatient] = useState<PatientData | null>(null);
  const [reports, setReports] = useState<ReportData[]>([]);
  const [virtualDownloads, setVirtualDownloads] = useState<VirtualDownload[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const doctorId = localStorage.getItem('doctor_id');

  useEffect(() => {
    loadVirtualDownloads();
  }, [patientId]);

  const loadVirtualDownloads = () => {
    const list = JSON.parse(localStorage.getItem('histoquanta_downloads') || '[]');
    if (patientId) {
      const filtered = list.filter((dl: any) => dl.patient_id === patientId);
      setVirtualDownloads(filtered);
    } else {
      setVirtualDownloads(list);
    }
    setIsLoading(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const handleDownload = (report: ReportData) => {
    if (!patient) return;
    
    // Save to virtual downloads list in localStorage
    const currentDownloads = JSON.parse(localStorage.getItem('histoquanta_downloads') || '[]');
    const isAlreadyDownloaded = currentDownloads.some(
      (d: any) => d.report_id === report.id && d.patient_id === patient.patient_id
    );
    
    if (!isAlreadyDownloaded) {
      const newDownload: VirtualDownload = {
        download_id: Date.now().toString(),
        report_id: report.id,
        patient_id: patient.patient_id,
        patient_name: patient.name,
        report_type: report.report_type || 'General Report',
        diagnosis: report.diagnosis || 'N/A',
        notes: report.notes || '',
        report: report.report || '',
        created_at: report.created_at,
        downloaded_at: new Date().toISOString()
      };
      currentDownloads.unshift(newDownload);
      localStorage.setItem('histoquanta_downloads', JSON.stringify(currentDownloads));
    }

    const doctorInfo = {
      name: localStorage.getItem('doctor_name') || '',
      email: localStorage.getItem('email') || '',
      license_no: localStorage.getItem('license_no') || '',
      phone: localStorage.getItem('phoneNumber') || '',
      hospital: localStorage.getItem('hospitalName') || ''
    };
    
    generateReportPDF(patient, report, doctorInfo, 'download');
    
    alert("Report successfully downloaded and added to 'My Downloads'!");
  };

  const handleOpenVirtualDownload = (download: VirtualDownload) => {
    const virtualPatient = {
      patient_id: download.patient_id,
      name: download.patient_name,
      age: '',
      gender: '',
      phone: '',
      address: '',
      diagnosis: download.diagnosis
    };

    const virtualReport = {
      id: download.report_id,
      report_type: download.report_type,
      diagnosis: download.diagnosis,
      notes: download.notes,
      report: download.report,
      created_at: download.created_at,
      source: 'analysis'
    };

    const doctorInfo = {
      name: localStorage.getItem('doctor_name') || '',
      email: localStorage.getItem('email') || '',
      license_no: localStorage.getItem('license_no') || '',
      phone: localStorage.getItem('phoneNumber') || '',
      hospital: localStorage.getItem('hospitalName') || ''
    };

    // Regenerate and open directly in a new tab
    generateReportPDF(virtualPatient, virtualReport, doctorInfo, 'print');
  };

  const handleDeleteVirtualDownload = (downloadId: string) => {
    if (!window.confirm("Are you sure you want to delete this downloaded report from 'My Downloads'?")) return;
    const currentDownloads = JSON.parse(localStorage.getItem('histoquanta_downloads') || '[]');
    const updatedDownloads = currentDownloads.filter((d: any) => d.download_id !== downloadId);
    localStorage.setItem('histoquanta_downloads', JSON.stringify(updatedDownloads));
    if (patientId) {
      setVirtualDownloads(updatedDownloads.filter((d: any) => d.patient_id === patientId));
    } else {
      setVirtualDownloads(updatedDownloads);
    }
  };

  return (
    <div style={{ backgroundColor: '#f5f8fc', minHeight: '100vh', paddingBottom: '30px' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(to bottom right, #007aff, #288cf0)',
        padding: '50px 20px 20px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
      }}>
        <button 
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '5px' }}
        >
          <ArrowLeft size={24} />
        </button>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '22px', fontWeight: 700, color: 'white' }}>
            My Downloads
          </span>
          {patientId && virtualDownloads.length > 0 ? (
            <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>
              Patient: {virtualDownloads[0].patient_name}
            </span>
          ) : (
            <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.9)' }}>Your saved offline reports</span>
          )}
        </div>
      </div>

      <div style={{ padding: '20px 16px' }}>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#8e8e93' }}>Loading reports...</div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#ff3b30' }}>
            <FileText size={40} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
            <div>{error}</div>
            <button 
              onClick={() => navigate('/dashboard')}
              style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#007aff', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer' }}
            >
              Back to Dashboard
            </button>
          </div>
        ) : (
          /* Global "My Downloads" View (Matching iOS Swift app style) */
          virtualDownloads.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#8e8e93', marginTop: '50px' }}>
              <FolderDown size={60} style={{ margin: '0 auto 20px', opacity: 0.2 }} />
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#3a3a3c', marginBottom: '8px' }}>No downloaded reports yet.</div>
              <div style={{ fontSize: '14px', color: '#8e8e93', maxWidth: '300px', margin: '0 auto' }}>
                Go to a Patient Profile to download and save their analysis reports here.
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {virtualDownloads.map((dl) => (
                <div key={dl.download_id} style={{
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  padding: '16px',
                  boxShadow: '0 3px 6px rgba(0,0,0,0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div 
                    onClick={() => handleOpenVirtualDownload(dl)}
                    style={{ display: 'flex', gap: '15px', alignItems: 'center', cursor: 'pointer', flex: 1 }}
                  >
                    <div style={{
                      width: '40px', height: '40px',
                      backgroundColor: 'rgba(255,59,48,0.1)',
                      borderRadius: '8px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <FileText size={20} color="#ff3b30" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <span style={{ fontSize: '15px', fontWeight: 700, color: 'black' }}>
                        Report_{dl.patient_name.replace(/\s+/g, '_')}.pdf
                      </span>
                      <span style={{ fontSize: '12px', color: '#8e8e93' }}>
                        Patient ID: {dl.patient_id} • {dl.report_type}
                      </span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleDeleteVirtualDownload(dl.download_id)}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: '#ff3b30', 
                      cursor: 'pointer',
                      padding: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Delete downloaded report"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};
