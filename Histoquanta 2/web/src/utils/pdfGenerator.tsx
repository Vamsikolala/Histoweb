import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { createRoot } from 'react-dom/client';
import React from 'react';

export interface DoctorInfo {
  name: string;
  email: string;
  license_no: string;
  phone: string;
  hospital: string;
  specialization?: string;
}

const ReportTemplate = ({ patient, report, doctor }: { patient: any, report: any, doctor: DoctorInfo }) => {
  const hospitalName = doctor.hospital ? doctor.hospital.toUpperCase() : "HISTOQUANTA MEDICAL CENTER";
  const specialization = doctor.specialization ? doctor.specialization : "Department of Pathology";
  const rawName = doctor.name || '';
  const doctorName = rawName.toLowerCase().startsWith('dr.') ? rawName : (rawName ? `Dr. ${rawName}` : "Dr. Medical Professional");
  const licenseNumber = doctor.license_no ? `Lic: ${doctor.license_no}` : "Lic: 000000";
  
  const formatDate = (dateStr: string) => {
    if (!dateStr) return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const quantResult = report.notes || "N/A";
  const tissueType = report.diagnosis || "N/A";
  const markerAnalyzed = report.report_type || "N/A";
  
  return (
    <div style={{
      width: '794px', // A4 width at 96 DPI
      minHeight: '1123px', // A4 height at 96 DPI
      backgroundColor: 'white',
      padding: '40px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* HEADER Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingTop: '33px', paddingBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <h1 style={{ margin: 0, fontSize: '29px', fontWeight: 900, color: 'black', lineHeight: 1.1, textTransform: 'uppercase' }}>
              {hospitalName}
            </h1>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: 'rgba(0,0,0,0.7)' }}>
              {specialization}
            </h2>
          </div>
        </div>

        <div style={{ height: '2.6px', backgroundColor: 'rgb(25, 51, 102)', width: '100%' }}></div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14.6px', fontWeight: 700, color: 'black' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5.3px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>👤</span>
              <span>{doctorName}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>📄</span>
              <span>{licenseNumber}</span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5.3px', textAlign: 'right' }}>
            <div>{doctor.email || ''}</div>
            <div>{doctor.phone || ''}</div>
          </div>
        </div>
      </div>

      {/* PATIENT INFO Section */}
      <div style={{ border: '1px solid rgba(128,128,128,0.2)', display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
        <div style={{ backgroundColor: 'rgba(128,128,128,0.1)', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '17.3px', fontWeight: 900, color: 'black' }}>PATIENT DEMOGRAPHICS</span>
        </div>
        
        <div style={{ padding: '21.3px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '13.3px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '13.3px', fontWeight: 900, color: 'rgba(0,0,0,0.6)' }}>PATIENT NAME</span>
            <span style={{ fontSize: '18.6px', fontWeight: 900, color: 'black' }}>{patient.name}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '13.3px', fontWeight: 900, color: 'rgba(0,0,0,0.6)' }}>PATIENT ID</span>
            <span style={{ fontSize: '18.6px', fontWeight: 900, color: 'black' }}>{patient.patient_id}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '13.3px', fontWeight: 900, color: 'rgba(0,0,0,0.6)' }}>AGE / GENDER</span>
            <span style={{ fontSize: '18.6px', fontWeight: 900, color: 'black' }}>{patient.age} / {patient.gender}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '13.3px', fontWeight: 900, color: 'rgba(0,0,0,0.6)' }}>REPORT DATE</span>
            <span style={{ fontSize: '18.6px', fontWeight: 900, color: 'black' }}>{formatDate(report.created_at)}</span>
          </div>
        </div>
      </div>

      {/* ANALYSIS Section */}
      <div style={{ marginTop: '21.3px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ fontSize: '20px', fontWeight: 700, color: 'rgb(25, 51, 102)' }}>
          CLINICAL ANALYSIS FINDINGS
        </div>

        <div style={{ backgroundColor: 'rgba(0, 122, 255, 0.05)', borderRadius: '10.6px', padding: '13.3px 16px', display: 'flex', flexDirection: 'column', gap: '13.3px' }}>
          <div style={{ display: 'flex' }}>
            <span style={{ width: '213px', fontSize: '18.6px', fontWeight: 900, color: 'rgba(0,0,0,0.7)' }}>Tissue Type:</span>
            <span style={{ fontSize: '18.6px', fontWeight: 900, color: 'black' }}>{tissueType}</span>
          </div>
          <div style={{ display: 'flex' }}>
            <span style={{ width: '213px', fontSize: '18.6px', fontWeight: 900, color: 'rgba(0,0,0,0.7)' }}>Marker Analyzed:</span>
            <span style={{ fontSize: '18.6px', fontWeight: 900, color: 'black' }}>{markerAnalyzed}</span>
          </div>
          <div style={{ display: 'flex' }}>
            <span style={{ width: '213px', fontSize: '18.6px', fontWeight: 900, color: 'rgba(0,0,0,0.7)' }}>Quantitative Result:</span>
            <span style={{ fontSize: '18.6px', fontWeight: 900, color: 'rgb(0, 76, 204)' }}>{quantResult}</span>
          </div>
        </div>

        <div style={{ fontSize: '18.6px', fontWeight: 900, marginTop: '10.6px' }}>
          Inference & Pathological Assessment:
        </div>

        <div style={{ fontSize: '17.3px', fontWeight: 500, lineHeight: 1.5, color: 'black', whiteSpace: 'pre-wrap' }}>
          {report.report || "No detailed analysis available."}
        </div>
      </div>

      <div style={{ flex: 1, minHeight: '40px' }}></div>

      {/* FOOTER Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '21.3px', paddingBottom: '26.6px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5.3px' }}>
            <div style={{ width: '213px', height: '2px', backgroundColor: 'black' }}></div>
            <div style={{ fontSize: '14.6px', fontWeight: 700 }}>Authorized Digital Signature</div>
            <div style={{ fontSize: '17.3px', fontWeight: 900 }}>{doctorName}</div>
          </div>
        </div>

        <div style={{ height: '1px', backgroundColor: 'rgba(0,0,0,0.2)' }}></div>

        <div style={{ fontSize: '12px', color: 'rgba(0,0,0,0.5)', textAlign: 'center' }}>
          This is an electronically generated report from HistoQuanta Analysis Suite. No physical signature required.
        </div>
      </div>
    </div>
  );
};

export const generateReportPDF = async (patient: any, report: any, doctor: DoctorInfo, mode: 'download' | 'print' = 'download') => {
  // Create a hidden container
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.top = '-9999px';
  container.style.left = '-9999px';
  document.body.appendChild(container);

  // Render the React component into the container
  const root = createRoot(container);
  
  await new Promise<void>((resolve) => {
    root.render(<ReportTemplate patient={patient} report={report} doctor={doctor} />);
    // Allow React to mount and render the DOM
    setTimeout(resolve, 100);
  });

  try {
    // Generate canvas from HTML
    const canvas = await html2canvas(container.firstChild as HTMLElement, {
      scale: 2, // higher scale for better quality PDF
      useCORS: true,
      logging: false
    });

    const imgData = canvas.toDataURL('image/png');
    
    // Calculate PDF dimensions (A4 size)
    const pdf = new jsPDF('p', 'pt', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    
    const safeName = patient.name.replace(/\s+/g, '_');
    const dateStr = new Date().toISOString().replace(/[:\-T]/g, '').slice(0, 14);
    
    if (mode === 'print') {
      pdf.autoPrint();
      window.open(pdf.output('bloburl'), '_blank');
    } else {
      // ONLY save/download the PDF to device. DO NOT call window.open!
      pdf.save(`Report_${safeName}_${dateStr}.pdf`);
    }
  } catch (error) {
    console.error("Error generating PDF", error);
  } finally {
    // Cleanup
    root.unmount();
    document.body.removeChild(container);
  }
};
