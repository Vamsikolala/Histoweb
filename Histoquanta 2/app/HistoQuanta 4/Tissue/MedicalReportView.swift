import SwiftUI

struct MedicalReportView: View {
    let patient: HQPatient
    let report: [String: Any]
    
    // Doctor Info from AppStorage
    @AppStorage("doctor_name") private var doctorName = ""
    @AppStorage("specialization") private var specialization = ""
    @AppStorage("licenseNumber") private var licenseNumber = ""
    @AppStorage("hospitalName") private var hospitalName = ""
    @AppStorage("email") private var email = ""
    @AppStorage("phoneNumber") private var phoneNumber = ""
    
    // A4 dimensions in points
    static let pageWidth: CGFloat = 595
    static let pageHeight: CGFloat = 842
    private let horizontalPadding: CGFloat = 40
    
    var body: some View {
        VStack(spacing: 0) {
            // --- HEADER / LETTERHEAD ---
            headerSection
            
            // --- PATIENT INFO BLOCK ---
            patientInfoSection
            
            // --- ANALYSIS RESULTS ---
            analysisSection
            
            Spacer(minLength: 30)
            
            // --- FOOTER ---
            footerSection
        }
        .frame(width: MedicalReportView.pageWidth)
        .frame(minHeight: MedicalReportView.pageHeight)
        .background(Color.white)
    }
    
    // MARK: - Header Section
    private var headerSection: some View {
        VStack(spacing: 12) {
            HStack(alignment: .top) {
                VStack(alignment: .leading, spacing: 4) {
                    Text(hospitalName.isEmpty ? "HISTOQUANTA MEDICAL CENTER" : hospitalName.uppercased())
                        .font(.system(size: 22, weight: .black))
                        .foregroundColor(.black)
                        .lineLimit(2)
                        .minimumScaleFactor(0.7)
                    
                    Text(specialization.isEmpty ? "Department of Pathology" : specialization)
                        .font(.system(size: 14, weight: .bold))
                        .foregroundColor(.black.opacity(0.7))
                }
                
                Spacer()
                
                // Placeholder for Logo
                Color.clear.frame(width: 40, height: 40)
            }
            
            Divider()
                .frame(height: 2)
                .background(Color(red: 0.1, green: 0.2, blue: 0.4))
            
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Label(doctorName.isEmpty ? "Dr. Medical Professional" : "Dr. \(doctorName)", systemImage: "person.fill")
                    Label(licenseNumber.isEmpty ? "Lic: 000000" : "Lic: \(licenseNumber)", systemImage: "doc.text.fill")
                }
                Spacer()
                VStack(alignment: .trailing, spacing: 4) {
                    Text(email)
                    Text(phoneNumber)
                }
            }
            .font(.system(size: 11, weight: .bold))
            .foregroundColor(.black)
        }
        .padding(.horizontal, horizontalPadding)
        .padding(.top, 25)
        .padding(.bottom, 12)
    }
    
    // MARK: - Patient Info Section
    private var patientInfoSection: some View {
        VStack(spacing: 0) {
            Rectangle()
                .fill(Color.gray.opacity(0.1))
                .frame(height: 36)
                .overlay(
                    Text("PATIENT DEMOGRAPHICS")
                        .font(.system(size: 13, weight: .heavy))
                        .foregroundColor(.black)
                )
            
            Grid(alignment: .leading, horizontalSpacing: 20, verticalSpacing: 10) {
                GridRow {
                    infoBlock(label: "PATIENT NAME", value: patient.name)
                    infoBlock(label: "PATIENT ID", value: patient.patient_id)
                }
                GridRow {
                    infoBlock(label: "AGE / GENDER", value: "\(patient.age) / \(patient.gender)")
                    infoBlock(label: "REPORT DATE", value: formatDate(report["created_at"] as? String))
                }
            }
            .padding(16)
        }
        .border(Color.gray.opacity(0.2))
        .padding(.horizontal, horizontalPadding)
    }
    
    // MARK: - Analysis Section
    private var analysisSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("CLINICAL ANALYSIS FINDINGS")
                .font(.system(size: 15, weight: .bold))
                .foregroundColor(Color(red: 0.1, green: 0.2, blue: 0.4))
            
            VStack(alignment: .leading, spacing: 10) {
                // patient_profile.php maps: tissue_type -> diagnosis, marker -> report_type, total_score -> notes
                resultRow(label: "Tissue Type:", value: report["diagnosis"] as? String ?? "N/A")
                resultRow(label: "Marker Analyzed:", value: report["report_type"] as? String ?? "N/A")
                resultRow(label: "Quantitative Result:", value: report["notes"] as? String ?? "N/A", highlight: true)
            }
            .padding(.vertical, 10)
            .padding(.horizontal, 12)
            .background(Color.blue.opacity(0.05))
            .cornerRadius(8)
            
            Text("Inference & Pathological Assessment:")
                .font(.system(size: 14, weight: .black))
                .padding(.top, 8)
            
            // "report" key contains the full clinical inference text
            Text(report["report"] as? String ?? "No detailed analysis available.")
                .font(.system(size: 13, weight: .medium))
                .lineSpacing(4)
                .foregroundColor(.black)
                .fixedSize(horizontal: false, vertical: true)
        }
        .padding(.horizontal, horizontalPadding)
        .padding(.top, 16)
    }
    
    // MARK: - Footer Section
    private var footerSection: some View {
        VStack(spacing: 16) {
            HStack {
                Spacer()
                VStack(spacing: 4) {
                    Rectangle()
                        .fill(Color.black)
                        .frame(width: 160, height: 1.5)
                    Text("Authorized Digital Signature")
                        .font(.system(size: 11, weight: .bold))
                    Text(doctorName)
                        .font(.system(size: 13, weight: .heavy))
                }
            }
            
            Divider()
            
            Text("This is an electronically generated report from HistoQuanta Analysis Suite. No physical signature required.")
                .font(.system(size: 9))
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
        }
        .padding(.horizontal, horizontalPadding)
        .padding(.bottom, 20)
    }
    
    @ViewBuilder
    func infoBlock(label: String, value: String) -> some View {
        VStack(alignment: .leading, spacing: 3) {
            Text(label)
                .font(.system(size: 10, weight: .heavy))
                .foregroundColor(.black.opacity(0.6))
            Text(value)
                .font(.system(size: 14, weight: .black))
                .foregroundColor(.black)
        }
    }
    
    @ViewBuilder
    func resultRow(label: String, value: String, highlight: Bool = false) -> some View {
        HStack {
            Text(label)
                .font(.system(size: 14, weight: .heavy))
                .foregroundColor(.black.opacity(0.7))
                .frame(width: 160, alignment: .leading)
            
            Text(value)
                .font(.system(size: 14, weight: .black))
                .foregroundColor(highlight ? Color(red: 0, green: 0.3, blue: 0.8) : .black)
            
            Spacer()
        }
    }
    
    func formatDate(_ dateStr: String?) -> String {
        guard let dateStr = dateStr else { return Date().formatted(date: .abbreviated, time: .omitted) }
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd HH:mm:ss"
        if let date = formatter.date(from: dateStr) {
            formatter.dateFormat = "MMMM dd, yyyy"
            return formatter.string(from: date)
        }
        return dateStr
    }
}

#Preview {
    MedicalReportView(
        patient: HQPatient(patient_id: "PT-7821", name: "Sarah Jenkins", age: "42", gender: "Female", phone: "555-0102", address: "California, USA", doctorName: "Dr. Smith", reportType: "Analysis", diagnosis: "Breast", notes: "Allred Score 7/8", fullReport: "Positive for ER expression...", reportImages: [], reportDocuments: []),
        report: [
            "report_type": "ER Analysis",
            "diagnosis": "Breast",
            "notes": "Allred Score 7/8",
            "report": "CLINICAL ANALYSIS REPORT: BREAST ER\n-------------------------------------------\nInference: Positive (Allred 7)\nIntensity: 3 (Strong)\nProportion: 4 (1/3 to 2/3 cells)",
            "created_at": "2024-04-20 10:30:00"
        ]
    )
}

import PDFKit

// MARK: - Report Exporter (Consolidated)

@MainActor
class ReportExporter {
    static let shared = ReportExporter()
    
    private let pageWidth: CGFloat = MedicalReportView.pageWidth
    private let pageHeight: CGFloat = MedicalReportView.pageHeight
    
    /// Generates a PDF and returns the local URL where it's stored.
    /// Uses ImageRenderer's native PDF rendering — no manual coordinate flipping needed,
    /// as ImageRenderer's context callback handles the coordinate system automatically.
    func generatePDF(patient: HQPatient, report: [String: Any]) -> URL? {
        let reportView = MedicalReportView(patient: patient, report: report)
        let renderer = ImageRenderer(content: reportView)
        
        // Tell the renderer to propose A4 width so the layout is correct
        renderer.proposedSize = ProposedViewSize(width: pageWidth, height: nil)
        
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyyMMdd_HHmmss"
        let timestamp = formatter.string(from: Date())
        
        let safeName = patient.name.replacingOccurrences(of: " ", with: "_")
        let fileName = "Report_\(safeName)_\(timestamp).pdf"
        
        let documentsURL = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
        let fileURL = documentsURL.appendingPathComponent(fileName)
        
        print("Saving PDF to: \(fileURL.path)")
        
        // Render using the native approach — ImageRenderer handles coordinate transforms
        renderer.render { size, context in
            // Use the actual rendered height (which includes minHeight: 842 from the view)
            let pdfHeight = max(size.height, pageHeight)
            
            var mediaBox = CGRect(origin: .zero, size: CGSize(width: pageWidth, height: pdfHeight))
            guard let pdfContext = CGContext(fileURL as CFURL, mediaBox: &mediaBox, nil) else { return }
            
            pdfContext.beginPDFPage(nil)
            
            // ImageRenderer's context renders top-to-bottom naturally.
            // No flipping needed — just render directly.
            context(pdfContext)
            
            pdfContext.endPDFPage()
            pdfContext.closePDF()
        }
        
        // Verify file was created
        if FileManager.default.fileExists(atPath: fileURL.path) {
            return fileURL
        }
        return nil
    }
    
    func exportReportAsPDF(patient: HQPatient, report: [String: Any]) {
        if let url = generatePDF(patient: patient, report: report) {
            presentShareSheet(with: url)
        }
    }
    
    private func presentShareSheet(with fileURL: URL) {
        let activityVC = UIActivityViewController(activityItems: [fileURL], applicationActivities: nil)
        if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
           let rootVC = windowScene.windows.first?.rootViewController {
            if let popover = activityVC.popoverPresentationController {
                popover.sourceView = rootVC.view
                popover.sourceRect = CGRect(x: rootVC.view.bounds.midX, y: rootVC.view.bounds.midY, width: 0, height: 0)
                popover.permittedArrowDirections = []
            }
            rootVC.present(activityVC, animated: true)
        }
    }
}

/// A simple PDF viewer wrapper for SwiftUI
struct PDFKitView: UIViewRepresentable {
    let url: URL
    
    func makeUIView(context: Context) -> PDFView {
        let pdfView = PDFView()
        pdfView.document = PDFDocument(url: url)
        pdfView.autoScales = true
        return pdfView
    }
    
    func updateUIView(_ uiView: PDFView, context: Context) {
        // Only update if the document is nil or the URL has changed
        if uiView.document == nil {
            uiView.document = PDFDocument(url: url)
        }
    }
}
