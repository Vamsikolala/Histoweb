import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { API_BASE_URL } from '../utils/api';
import { Save, Image as ImageIcon, Camera, X, FileText, Activity, AlignLeft, ArrowLeft } from 'lucide-react';

export const AddReport: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const navigate = useNavigate();
  const doctorId = localStorage.getItem('doctor_id');

  const [reportType, setReportType] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [fullReport, setFullReport] = useState('');

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editId) fetchExistingReport(editId);
  }, [editId]);

  const fetchExistingReport = async (rid: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/patient_profile.php?patient_id=${id}&doctor_id=${doctorId}`);
      const data = await res.json();
      if (data.status && data.reports) {
        const report = data.reports.find((r: any) => r.id.toString() === rid);
        if (report) {
          setReportType(report.report_type || '');
          setDiagnosis(report.diagnosis || '');
          setNotes(report.notes || '');
          setFullReport(report.report || '');
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = [...selectedImages, ...Array.from(e.target.files)].slice(0, 5);
      setSelectedImages(newFiles);
      setImagePreviews(newFiles.map((f) => URL.createObjectURL(f)));
    }
  };

  const removeImage = (i: number) => {
    const nf = [...selectedImages];
    nf.splice(i, 1);
    setSelectedImages(nf);
    setImagePreviews(nf.map((f) => URL.createObjectURL(f)));
  };

  const handleSubmit = async () => {
    if (!doctorId) { setMessage('Error: Doctor ID not found.'); setIsSuccess(false); return; }
    setIsSaving(true);
    setMessage('');
    try {
      const fd = new FormData();
      fd.append('doctor_id', doctorId);
      fd.append('patient_id', id || '');
      if (editId) fd.append('disease_id', editId);
      fd.append('report_type', reportType);
      fd.append('diagnosis', diagnosis);
      fd.append('notes', notes);
      fd.append('report', fullReport);
      selectedImages.forEach((f, i) => fd.append('images[]', f, `img${i}.jpg`));

      const res = await fetch(`${API_BASE_URL}/add_disease.php`, { method: 'POST', body: fd });
      const data = await res.json();

      if (data.status) {
        setMessage(data.message || 'Report saved successfully!');
        setIsSuccess(true);
        setTimeout(() => navigate(-1), 1500);
      } else {
        setMessage(data.sql_error ? `${data.message}: ${data.sql_error}` : (data.message || 'Failed to save report'));
        setIsSuccess(false);
      }
    } catch {
      setMessage('Failed to connect to server');
      setIsSuccess(false);
    } finally {
      setIsSaving(false);
    }
  };

  const isFormValid = reportType.trim() !== '' && diagnosis.trim() !== '' && fullReport.trim() !== '';

  if (isLoading) {
    return <div style={{ minHeight: '100vh', background: 'var(--bg-page)' }}><div className="loading-overlay"><div className="spinner" /><span>Loading...</span></div></div>;
  }

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>
      {/* Top Bar */}
      <div style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)', padding: 'var(--sp-4) var(--sp-6)', position: 'sticky', top: 0, zIndex: 100, display: 'flex', alignItems: 'center', gap: 'var(--sp-4)' }}>
        <button className="btn btn-ghost btn-icon" onClick={() => navigate(-1)} id="add-report-back">
          <ArrowLeft size={18} />
        </button>
        <h1 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, margin: 0, flex: 1 }}>
          {editId ? 'Edit Report' : 'Add Disease Report'}
        </h1>
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={!isFormValid || isSaving}
          id="save-report-btn"
        >
          {isSaving
            ? <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Saving...</>
            : <><Save size={16} /> {editId ? 'Update' : 'Save'}</>}
        </button>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: 'var(--sp-6)', display: 'grid', gridTemplateColumns: '1fr 340px', gap: 'var(--sp-5)' }}>

        {/* Left: Main Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }} className="animate-fade-in">
          <div className="card" style={{ padding: 'var(--sp-5)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', marginBottom: 'var(--sp-5)' }}>
              <FileText size={16} color="var(--primary)" />
              <h3 style={{ margin: 0, fontSize: 'var(--text-base)', fontWeight: 700 }}>Report Details</h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="rt-type">
                  Report Type <span style={{ color: 'var(--error)' }}>*</span>
                </label>
                <div className="input-with-icon">
                  <FileText size={14} className="input-icon" />
                  <input id="rt-type" className="input-field" type="text" placeholder="e.g. Biopsy, Blood Test, Histopathology" value={reportType} onChange={(e) => setReportType(e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="rt-diagnosis">
                  Diagnosis <span style={{ color: 'var(--error)' }}>*</span>
                </label>
                <div className="input-with-icon">
                  <Activity size={14} className="input-icon" />
                  <input id="rt-diagnosis" className="input-field" type="text" placeholder="Clinical diagnosis" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="rt-notes">Notes</label>
                <textarea id="rt-notes" className="input-field" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Additional observations or comments" style={{ minHeight: 80 }} />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="rt-full-report">
                  Full Report Content <span style={{ color: 'var(--error)' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <AlignLeft size={14} style={{ position: 'absolute', left: 'var(--sp-3)', top: 'var(--sp-3)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                  <textarea
                    id="rt-full-report"
                    className="input-field"
                    value={fullReport}
                    onChange={(e) => setFullReport(e.target.value)}
                    placeholder="Detailed report content, pathological findings, interpretation..."
                    style={{ minHeight: 200, paddingLeft: 'var(--sp-10)' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {message && (
            <div className={`alert ${isSuccess ? 'alert-success' : 'alert-error'} animate-fade-in`}>
              {message}
            </div>
          )}
        </div>

        {/* Right: Photos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-4)' }} className="animate-fade-in">
          <div className="card" style={{ padding: 'var(--sp-5)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', marginBottom: 'var(--sp-4)' }}>
              <ImageIcon size={16} color="var(--primary)" />
              <h3 style={{ margin: 0, fontSize: 'var(--text-base)', fontWeight: 700 }}>Photos</h3>
              <span className="badge badge-gray" style={{ marginLeft: 'auto' }}>{selectedImages.length}/5</span>
            </div>

            <input type="file" accept="image/*" multiple ref={fileInputRef} onChange={handleImageChange} style={{ display: 'none' }} />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-3)', marginBottom: 'var(--sp-4)' }}>
              <button
                className="btn btn-secondary"
                onClick={() => fileInputRef.current?.click()}
                style={{ flexDirection: 'column', gap: 'var(--sp-1)', padding: 'var(--sp-4)' }}
                id="add-gallery-btn"
              >
                <ImageIcon size={18} /><span>Gallery</span>
              </button>
              <button
                className="btn btn-ghost"
                onClick={() => fileInputRef.current?.click()}
                style={{ flexDirection: 'column', gap: 'var(--sp-1)', padding: 'var(--sp-4)' }}
                id="add-camera-btn"
              >
                <Camera size={18} /><span>Camera</span>
              </button>
            </div>

            {imagePreviews.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--sp-2)' }}>
                {imagePreviews.map((preview, i) => (
                  <div key={i} style={{ position: 'relative', borderRadius: 'var(--radius)', overflow: 'hidden', aspectRatio: '1' }}>
                    <img src={preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button
                      onClick={() => removeImage(i)}
                      style={{
                        position: 'absolute', top: 4, right: 4,
                        width: 22, height: 22,
                        background: 'rgba(0,0,0,0.6)', border: 'none',
                        borderRadius: '50%', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                      }}
                      id={`remove-img-${i}`}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {imagePreviews.length === 0 && (
              <div
                style={{
                  border: '2px dashed var(--border)', borderRadius: 'var(--radius)',
                  padding: 'var(--sp-8)', textAlign: 'center', color: 'var(--text-light)',
                  fontSize: 'var(--text-sm)',
                }}
              >
                No photos attached
              </div>
            )}
          </div>

          {/* Validation hint */}
          <div className="card" style={{ padding: 'var(--sp-4)', background: 'var(--gray-50)' }}>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', margin: 0, lineHeight: 1.7 }}>
              <strong style={{ color: 'var(--text-secondary)' }}>Required fields:</strong> Report Type, Diagnosis, and Full Report Content must be filled before saving.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
