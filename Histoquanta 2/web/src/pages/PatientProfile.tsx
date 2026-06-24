import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../utils/api';
import { generateReportPDF } from '../utils/pdfGenerator';
import {
  User, Phone, MapPin, FileText, Pencil, Trash2,
  PlusCircle, Activity, FolderDown, Download, Printer, ChevronRight, CalendarDays
} from 'lucide-react';

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
  images?: string;
  table_name: string;
}

export const PatientProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<PatientData | null>(null);
  const [reports, setReports] = useState<ReportData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const doctorId = localStorage.getItem('doctor_id');

  useEffect(() => { fetchPatientData(); }, [id]);

  const fetchPatientData = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/patient_profile.php?patient_id=${id}&doctor_id=${doctorId}`);
      const data = await res.json();
      if (data.status) {
        setPatient(data.patient);
        setReports(data.reports || []);
      } else {
        setError(data.message || 'Failed to load patient data');
      }
    } catch {
      setError('Network error loading patient profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (reportId: number, tableName: string) => {
    if (!window.confirm('Delete this report? This cannot be undone.')) return;
    try {
      const res = await fetch(`${API_BASE_URL}/delete_report.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ report_id: reportId.toString(), table_name: tableName }).toString(),
      });
      const data = await res.json();
      if (data.status) fetchPatientData();
      else alert(data.message || 'Failed to delete report');
    } catch {
      alert('Network error deleting report');
    }
  };

  const handleDownload = (report: ReportData) => {
    if (!patient) return;
    
    // Save to virtual downloads list in localStorage
    const currentDownloads = JSON.parse(localStorage.getItem('histoquanta_downloads') || '[]');
    const isAlreadyDownloaded = currentDownloads.some(
      (d: any) => d.report_id === report.id && d.patient_id === patient.patient_id
    );
    
    if (!isAlreadyDownloaded) {
      const newDownload = {
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

    generateReportPDF(patient, report, {
      name: localStorage.getItem('doctor_name') || '',
      email: localStorage.getItem('email') || '',
      license_no: localStorage.getItem('license_no') || '',
      phone: localStorage.getItem('phoneNumber') || '',
      hospital: localStorage.getItem('hospitalName') || '',
    }, 'download');

    alert("Report successfully downloaded and added to 'My Downloads'!");
  };

  const handlePrint = (report: ReportData) => {
    if (!patient) return;
    generateReportPDF(patient, report, {
      name: localStorage.getItem('doctor_name') || '',
      email: localStorage.getItem('email') || '',
      license_no: localStorage.getItem('license_no') || '',
      phone: localStorage.getItem('phoneNumber') || '',
      hospital: localStorage.getItem('hospitalName') || '',
    }, 'print');
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const getInitials = (name: string) =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-page)' }}>
        <div className="loading-overlay"><div className="spinner" /><span>Loading patient...</span></div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-page)' }}>
        <div className="loading-overlay">
          <span style={{ color: 'var(--error)' }}>{error || 'Patient not found'}</span>
        </div>
      </div>
    );
  }

  const detailItems = [
    { icon: <FileText size={14} />, label: 'Patient ID', value: patient.patient_id, color: 'var(--primary)' },
    { icon: <Phone size={14} />, label: 'Phone', value: patient.phone || 'Not provided', color: 'var(--success)' },
    { icon: <MapPin size={14} />, label: 'Address', value: patient.address || 'Not provided', color: 'var(--warning)' },
    { icon: <Activity size={14} />, label: 'Initial Diagnosis', value: patient.diagnosis || 'Not provided', color: 'var(--error)' },
  ];

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>
      {/* Sticky Top Bar */}
      <div style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)', padding: 'var(--sp-4) var(--sp-6)', position: 'sticky', top: 0, zIndex: 100, display: 'flex', alignItems: 'center', gap: 'var(--sp-4)' }}>
        <button className="btn btn-ghost btn-icon" onClick={() => navigate(-1)} id="patient-profile-back">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h1 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, margin: 0, flex: 1 }}>Patient Profile</h1>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/patient/${id}/edit`)} id="patient-edit-btn">
          <Pencil size={14} /> Edit
        </button>
      </div>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: 'var(--sp-6)', display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>

        {/* Patient Info Card */}
        <div className="card animate-fade-in-up">
          <div style={{ padding: 'var(--sp-5)', display: 'flex', alignItems: 'center', gap: 'var(--sp-5)', borderBottom: '1px solid var(--border)' }}>
            <div
              className="avatar avatar-xl"
              style={{ flexShrink: 0, background: 'var(--primary-bg)', color: 'var(--primary)', fontWeight: 800 }}
            >
              {getInitials(patient.name)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.3px' }}>
                {patient.name}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', marginTop: 'var(--sp-2)', flexWrap: 'wrap' }}>
                <span className="badge badge-blue">{patient.gender}</span>
                <span className="badge badge-gray">{patient.age} years</span>
              </div>
            </div>
          </div>

          <div style={{ padding: 'var(--sp-5)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-4)' }}>
            {detailItems.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--sp-3)' }}>
                <div style={{ width: 30, height: 30, borderRadius: 'var(--radius-sm)', background: `${item.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color, flexShrink: 0, marginTop: 2 }}>
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', fontWeight: 600 }}>{item.label}</div>
                  <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', marginTop: 1 }}>{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-3)' }} className="animate-fade-in-up">
          <button
            className="btn btn-primary btn-lg"
            onClick={() => navigate(`/patient/${id}/add-report`)}
            id="add-report-btn"
          >
            <PlusCircle size={18} /> Add Report
          </button>
          <button
            className="btn btn-secondary btn-lg"
            onClick={() => navigate(`/downloads?patient_id=${id}`)}
            id="downloads-btn"
          >
            <FolderDown size={18} /> My Downloaded Reports
          </button>
        </div>

        {/* Disease History */}
        <div className="animate-fade-in-up">
          <h2 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--sp-4)' }}>
            Disease History
          </h2>

          {reports.length === 0 ? (
            <div className="empty-state" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', paddingTop: 'var(--sp-10)', paddingBottom: 'var(--sp-10)' }}>
              <div className="empty-icon"><FileText size={26} color="var(--gray-400)" /></div>
              <h3>No reports yet</h3>
              <p>Add a report to start tracking this patient's disease history</p>
              <button className="btn btn-primary btn-sm" onClick={() => navigate(`/patient/${id}/add-report`)} style={{ marginTop: 'var(--sp-3)' }}>
                <PlusCircle size={14} /> Add First Report
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
              {reports.map((report) => {
                const isAnalysis = report.source === 'analysis';
                const fullReport = report.report || '';
                const lines = fullReport.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
                const detailLines = lines.filter((l) =>
                  !l.toLowerCase().startsWith('patient name:') &&
                  !l.toLowerCase().startsWith('patient id:') &&
                  !l.toLowerCase().startsWith('clinical analysis report')
                );

                return (
                  <div key={`${report.table_name}-${report.id}`} className="report-card">
                    {/* Report Header */}
                    <div className="report-card-header">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)' }}>
                        <div
                          style={{
                            width: 36, height: 36, borderRadius: 'var(--radius)',
                            background: isAnalysis ? '#FFF7ED' : 'var(--primary-bg)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}
                        >
                          {isAnalysis
                            ? <Activity size={16} color="var(--warning)" />
                            : <FileText size={16} color="var(--primary)" />}
                        </div>
                        <div>
                          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 700, color: 'var(--text-primary)' }}>
                            {report.report_type || (isAnalysis ? 'Analysis Report' : 'General Report')}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-1)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 1 }}>
                            <CalendarDays size={12} /> {formatDate(report.created_at)}
                          </div>
                        </div>
                        {isAnalysis
                          ? <span className="badge badge-orange">Analysis</span>
                          : <span className="badge badge-blue">Report</span>}
                      </div>

                      <div className="report-actions">
                        <button 
                          className="btn btn-ghost btn-icon btn-sm" 
                          onClick={() => handlePrint(report)}
                          title="Print" 
                          id={`print-report-${report.id}`}
                        >
                          <Printer size={14} />
                        </button>
                        <button
                          className="btn btn-ghost btn-icon btn-sm"
                          onClick={() => handleDownload(report)}
                          title="Download PDF"
                          id={`download-report-${report.id}`}
                          style={{ color: 'var(--success)' }}
                        >
                          <Download size={14} />
                        </button>
                        {!isAnalysis && (
                          <button
                            className="btn btn-ghost btn-icon btn-sm"
                            onClick={() => navigate(`/patient/${id}/add-report?edit=${report.id}`)}
                            title="Edit"
                            id={`edit-report-${report.id}`}
                            style={{ color: 'var(--warning)' }}
                          >
                            <Pencil size={14} />
                          </button>
                        )}
                        <button
                          className="btn btn-ghost btn-icon btn-sm"
                          onClick={() => handleDelete(report.id, report.source === 'analysis' ? 'patient_analysis_reports' : 'disease')}
                          title="Delete"
                          id={`delete-report-${report.id}`}
                          style={{ color: 'var(--error)' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Report Body */}
                    <div className="report-card-body">
                      {isAnalysis ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-3)', flexWrap: 'wrap' }}>
                            <div style={{ fontSize: 'var(--text-sm)' }}>
                              <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Tissue: </span>
                              <span style={{ fontWeight: 700 }}>{report.diagnosis || 'N/A'}</span>
                            </div>
                            {report.notes && (
                              <div style={{ fontSize: 'var(--text-sm)' }}>
                                <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Score: </span>
                                <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{report.notes}</span>
                              </div>
                            )}
                          </div>
                          {detailLines.length > 0 && (
                            <div style={{ background: 'var(--gray-50)', borderRadius: 'var(--radius)', padding: 'var(--sp-3)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', marginTop: 'var(--sp-2)', lineHeight: 1.8 }}>
                              {detailLines.slice(0, 6).join('\n')}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-primary)', fontWeight: 500 }}>
                            {report.diagnosis || 'No diagnosis available'}
                          </div>
                          {report.report && (
                            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 'var(--sp-2)', lineHeight: 1.7 }}>
                              {report.report}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
