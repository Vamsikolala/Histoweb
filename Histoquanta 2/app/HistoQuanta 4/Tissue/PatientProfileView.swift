import SwiftUI

struct PatientProfileView: View {
    let patient: HQPatient
    @StateObject private var navManager = AppNavigation.shared
    @AppStorage("doctor_id") private var doctorID = 0
    @State private var currentPatient: HQPatient
    @State private var reports: [[String: Any]] = []
    @State private var isLoading = true
    @State private var errorMessage = ""
    @State private var selectedFullScreenImage: String? = nil
    @State private var reportToDelete: [String: Any]? = nil
    @State private var showDeleteConfirm = false
    @State private var selectedReportPDFURL: URL? = nil
    @State private var showDownloadToast = false
    
    private var avatarColor: Color {
        let colors: [Color] = [.blue, .purple, .teal, .indigo, .cyan]
        let index = abs(currentPatient.name.hashValue) % colors.count
        return colors[index]
    }

    init(patient: HQPatient) {
        self.patient = patient
        self._currentPatient = State(initialValue: patient)
    }

    var body: some View {
        ZStack {
            Color(red: 245/255, green: 248/255, blue: 252/255)
                .ignoresSafeArea()

            VStack(spacing: 0) {
                StandardHeader(title: "Patient Profile")
                
                ScrollView(showsIndicators: false) {
                    VStack(spacing: 20) {
                        // Patient Info Card
                        patientInfoCard
                        
                        // New Downloads Access
                        Button {
                            navManager.navigate(to: .myDownloads(patientName: currentPatient.name))
                        } label: {
                            HStack {
                                Image(systemName: "folder.fill.badge.plus")
                                    .font(.title3)
                                    .foregroundColor(.blue)
                                Text("My Downloaded Reports")
                                    .font(.system(size: 16, weight: .bold))
                                    .foregroundColor(.black)
                                Spacer()
                                Image(systemName: "chevron.right")
                                    .font(.caption)
                                    .foregroundColor(.gray)
                            }
                            .padding(16)
                            .background(Color.white)
                            .cornerRadius(18)
                            .shadow(color: Color.black.opacity(0.04), radius: 8, y: 4)
                        }
                        
                        // Action Buttons
                        actionButtons
                        
                        // Reports Section
                        reportsSection
                    }
                    .padding(.horizontal, 16)
                    .padding(.vertical, 12)
                }
            }
            .ignoresSafeArea(edges: .top)
            
            if isLoading {
                ProgressView("Loading reports...")
                    .padding()
                    .background(Color.white)
                    .cornerRadius(10)
                    .shadow(radius: 10)
            }
            
            if let imageUrl = selectedFullScreenImage {
                ZStack {
                    Color.black.opacity(0.9).ignoresSafeArea()
                    
                    VStack {
                        HStack {
                            Spacer()
                            Button {
                                selectedFullScreenImage = nil
                            } label: {
                                Image(systemName: "xmark.circle.fill")
                                    .font(.title)
                                    .foregroundColor(.white)
                            }
                                .padding(.vertical, 12)
                        }
                        
                        Spacer()
                        
                        AsyncImage(url: NetworkManager.shared.getURL(for: "uploads/" + imageUrl)) { image in
                            image
                                .resizable()
                                .scaledToFit()
                        } placeholder: {
                            ProgressView()
                        }
                                .padding(.vertical, 12)
                        
                        Spacer()
                    }
                }
                .transition(.opacity)
                .zIndex(10)
            }
            if showDownloadToast {
                VStack {
                    Spacer()
                    HStack(spacing: 12) {
                        Image(systemName: "checkmark.circle.fill")
                            .foregroundColor(.white)
                        Text("Report saved to My Downloads")
                            .font(.system(size: 15, weight: .bold))
                            .foregroundColor(.white)
                    }
                    .padding(.vertical, 12)
                    .padding(.horizontal, 24)
                    .background(Color.green)
                    .cornerRadius(25)
                    .shadow(radius: 10)
                    .padding(.bottom, 50)
                }
                .transition(.move(edge: .bottom).combined(with: .opacity))
                .zIndex(20)
            }
        }
        .navigationBarBackButtonHidden(true)
        .onAppear {
            fetchPatientReports()
    }
        .alert(isPresented: $showDeleteConfirm) {
            Alert(
                title: Text("Delete Report"),
                message: Text("Are you sure you want to delete this report? This action cannot be undone."),
                primaryButton: .destructive(Text("Delete")) {
                    if let report = reportToDelete {
                        deleteReport(report)
                    }
                },
                secondaryButton: .cancel()
            )
        }
        .sheet(item: Binding(
            get: { selectedReportPDFURL.map { IdentifiableURL(url: $0) } },
            set: { selectedReportPDFURL = $0?.url }
        )) { idURL in
            NavigationStack {
                PDFKitView(url: idURL.url)
                    .navigationTitle("Report Preview")
                    .navigationBarTitleDisplayMode(.inline)
                    .toolbar {
                        ToolbarItem(placement: .navigationBarTrailing) {
                            Button("Done") { selectedReportPDFURL = nil }
                        }
                        ToolbarItem(placement: .navigationBarLeading) {
                            Button {
                                let activityVC = UIActivityViewController(activityItems: [idURL.url], applicationActivities: nil)
                                if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
                                   let rootVC = windowScene.windows.first?.rootViewController {
                                    rootVC.present(activityVC, animated: true)
                                }
                            } label: {
                                Image(systemName: "square.and.arrow.up")
                            }
                        }
                    }
            }
        }
    }

    struct IdentifiableURL: Identifiable {
        var id: String { url.absoluteString }
        let url: URL
    }



    var patientInfoCard: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack(spacing: 20) {
                ZStack {
                    Circle()
                        .fill(Color.gray.opacity(0.15))
                    Image(systemName: "person.fill")
                        .font(.system(size: 35))
                        .foregroundColor(.gray.opacity(0.8))
                }
                .frame(width: 80, height: 80)
                .overlay(Circle().stroke(Color.gray.opacity(0.1), lineWidth: 1))
                
                VStack(alignment: .leading, spacing: 4) {
                    Text(currentPatient.name)
                        .font(.system(size: 22, weight: .bold))
                    Text("\(currentPatient.gender), \(currentPatient.age) years")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                }
                
                Spacer()
                
                Button {
                    navManager.navigate(to: .editPatient(patient: currentPatient))
                } label: {
                    Image(systemName: "pencil.circle.fill")
                        .font(.system(size: 28))
                        .foregroundColor(.blue)
                }
            }
            
            Divider()
            
            VStack(spacing: 12) {
                infoRow(icon: "number", label: "Patient ID", value: currentPatient.patient_id)
                infoRow(icon: "phone.fill", label: "Phone", value: currentPatient.phone)
                infoRow(icon: "location.fill", label: "Address", value: currentPatient.address)
                infoRow(icon: "doc.text.fill", label: "Initial Diagnosis", value: currentPatient.diagnosis)
            }
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(20)
        .shadow(color: Color.black.opacity(0.05), radius: 10, x: 0, y: 5)
    }

    var actionButtons: some View {
        HStack(spacing: 15) {
            Button {
                navManager.navigate(to: .addDisease(patient: currentPatient))
            } label: {
                actionButton(title: "Add Report", icon: "plus.circle.fill", color: .blue)
            }
        }
    }

    var reportsSection: some View {
        VStack(alignment: .leading, spacing: 15) {
            Text("Disease History")
                .font(.headline)
                .padding(.leading, 5)
            
            if !errorMessage.isEmpty {
                Text(errorMessage)
                    .foregroundColor(.red)
                    .padding()
            } else if reports.isEmpty && !isLoading {
                VStack {
                    Image(systemName: "doc.text.fill")
                        .font(.system(size: 40))
                        .foregroundColor(.gray.opacity(0.3))
                        .padding(.bottom, 8)
                    Text("No disease reports found.")
                        .foregroundColor(.secondary)
                }
                .frame(maxWidth: .infinity)
                .padding(.vertical, 40)
            } else {
                ForEach(0..<reports.count, id: \.self) { index in
                    reportCard(reports[index])
                }
            }
        }
    }

    @ViewBuilder
    func reportCard(_ report: [String: Any]) -> some View {
        let source = report["source"] as? String ?? "medical"
        
        VStack(alignment: .leading, spacing: 10) {
            HStack {
                Image(systemName: source == "analysis" ? "chart.bar.doc.horizontal.fill" : "doc.text.fill")
                    .foregroundColor(source == "analysis" ? .orange : .blue)
                
                Text(report["report_type"] as? String ?? (source == "analysis" ? "Analysis Report" : "General Report"))
                    .font(.system(size: 16, weight: .bold))
                
                Spacer()
                
                Button {
                    ReportExporter.shared.exportReportAsPDF(patient: currentPatient, report: report)
                } label: {
                    Image(systemName: "printer.fill.and.paper.fill")
                        .font(.system(size: 14))
                        .foregroundColor(.blue)
                        .padding(8)
                        .background(Color.blue.opacity(0.1))
                        .clipShape(Circle())
                }
                
                Button {
                    if let url = ReportExporter.shared.generatePDF(patient: currentPatient, report: report) {
                        selectedReportPDFURL = url
                        withAnimation {
                            showDownloadToast = true
                        }
                        DispatchQueue.main.asyncAfter(deadline: .now() + 2.0) {
                            withAnimation {
                                showDownloadToast = false
                            }
                        }
                    }
                } label: {
                    Image(systemName: "square.and.arrow.down.fill")
                        .font(.system(size: 14))
                        .foregroundColor(.green)
                        .padding(8)
                        .background(Color.green.opacity(0.1))
                        .clipShape(Circle())
                }
                .padding(.trailing, 4)
                
                // Edit Button for Medical Reports (Non-analysis ones are easier to edit here)
                if source != "analysis" {
                    Button {
                        if let rid = report["id"] as? Int {
                            navManager.navigate(to: .addDisease(patient: currentPatient, reportID: rid))
                        }
                    } label: {
                        Image(systemName: "pencil")
                            .font(.system(size: 14))
                            .foregroundColor(.orange)
                            .padding(8)
                            .background(Color.orange.opacity(0.1))
                            .clipShape(Circle())
                    }
                    .padding(.trailing, 8)
                }
                
                // Delete Button
                Button {
                    reportToDelete = report
                    showDeleteConfirm = true
                } label: {
                    Image(systemName: "trash.fill")
                        .font(.system(size: 14))
                        .foregroundColor(.red)
                        .padding(8)
                        .background(Color.red.opacity(0.1))
                        .clipShape(Circle())
                }
                .padding(.trailing, 8)
                
                Text(formatDate(report["created_at"] as? String))
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            
            if source == "analysis" {
                let fullReport = report["report"] as? String ?? ""
                let reportLines = fullReport.components(separatedBy: "\n").map { $0.trimmingCharacters(in: .whitespaces) }.filter { !$0.isEmpty }
                
                // Extract patient name and ID from report text
                let patientNameLine = reportLines.first(where: { $0.lowercased().hasPrefix("patient name:") })
                let patientIDLine = reportLines.first(where: { $0.lowercased().hasPrefix("patient id:") })
                
                // Remaining lines (everything except patient name/ID and the header line)
                let detailLines = reportLines.filter { line in
                    let lower = line.lowercased()
                    return !lower.hasPrefix("patient name:") &&
                           !lower.hasPrefix("patient id:") &&
                           !lower.hasPrefix("clinical analysis report")
                }
                
                VStack(alignment: .leading, spacing: 8) {
                    // 1. Patient Name & ID
                    if let nameLine = patientNameLine {
                        HStack(spacing: 6) {
                            Image(systemName: "person.fill")
                                .font(.system(size: 12))
                                .foregroundColor(.blue)
                            Text(nameLine)
                                .font(.system(size: 14, weight: .semibold))
                        }
                    }
                    if let idLine = patientIDLine {
                        HStack(spacing: 6) {
                            Image(systemName: "number")
                                .font(.system(size: 12))
                                .foregroundColor(.blue)
                            Text(idLine)
                                .font(.system(size: 14, weight: .medium))
                                .foregroundColor(.secondary)
                        }
                    }
                    
                    Divider()
                    
                    // 2. Tissue & Total Score
                    HStack(spacing: 6) {
                        Image(systemName: "lungs.fill")
                            .font(.system(size: 12))
                            .foregroundColor(.purple)
                        Text("Tissue:")
                            .font(.system(size: 14, weight: .semibold))
                        Text(report["diagnosis"] as? String ?? "N/A")
                            .font(.system(size: 14))
                    }
                    
                    HStack(spacing: 6) {
                        Image(systemName: "chart.bar.fill")
                            .font(.system(size: 12))
                            .foregroundColor(.orange)
                        Text("Total Score:")
                            .font(.system(size: 14, weight: .semibold))
                        Text(report["notes"] as? String ?? "N/A")
                            .font(.system(size: 14, weight: .medium))
                            .foregroundColor(.blue)
                    }
                    
                    // 3. Remaining Details
                    if !detailLines.isEmpty {
                        Divider()
                        
                        VStack(alignment: .leading, spacing: 4) {
                            Text("Details:")
                                .font(.system(size: 13, weight: .bold))
                                .foregroundColor(.secondary)
                            Text(detailLines.joined(separator: "\n"))
                                .font(.system(size: 13))
                                .foregroundColor(.black.opacity(0.75))
                                .fixedSize(horizontal: false, vertical: true)
                        }
                    }
                }
            } else {
                Text(report["diagnosis"] as? String ?? "No diagnosis available")
                    .font(.subheadline)
                    .foregroundColor(.black.opacity(0.8))
                
                if let reportText = report["report"] as? String, !reportText.isEmpty {
                    Text(reportText)
                        .font(.caption)
                        .foregroundColor(.gray)
                        .lineLimit(3)
                }
                
                if let imagesStr = report["images"] as? String, !imagesStr.isEmpty {
                    let images = imagesStr.components(separatedBy: ",").filter { !$0.isEmpty }
                    if !images.isEmpty {
                        ScrollView(.horizontal, showsIndicators: false) {
                            HStack(spacing: 10) {
                                ForEach(images, id: \.self) { imgName in
                                    AsyncImage(url: NetworkManager.shared.getURL(for: "uploads/" + imgName)) { image in
                                        image
                                            .resizable()
                                            .scaledToFill()
                                            .frame(width: 60, height: 60)
                                            .cornerRadius(8)
                                            .onTapGesture {
                                                selectedFullScreenImage = imgName
                                            }
                                    } placeholder: {
                                        Color.gray.opacity(0.1)
                                            .frame(width: 60, height: 60)
                                            .cornerRadius(8)
                                            .overlay(ProgressView().scaleEffect(0.5))
                                    }
                                }
                            }
                            .padding(.top, 5)
                        }
                    }
                }
            }
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(16)
        .shadow(color: Color.black.opacity(0.04), radius: 6, x: 0, y: 3)
    }

    func formatDate(_ dateStr: String?) -> String {
        guard let dateStr = dateStr else { return "" }
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd HH:mm:ss"
        if let date = formatter.date(from: dateStr) {
            formatter.dateFormat = "MMM dd, yyyy"
            return formatter.string(from: date)
        }
        return dateStr
    }

    @ViewBuilder
    func infoRow(icon: String, label: String, value: String) -> some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .foregroundColor(.blue)
                .frame(width: 20)
            
            Text(label + ":")
                .font(.system(size: 14, weight: .semibold))
            
            Text(value.isEmpty ? "N/A" : value)
                .font(.system(size: 14))
                .foregroundColor(.secondary)
            
            Spacer()
        }
    }

    @ViewBuilder
    func actionButton(title: String, icon: String, color: Color) -> some View {
        VStack(spacing: 8) {
            Image(systemName: icon)
                .font(.title2)
            Text(title)
                .font(.system(size: 14, weight: .bold))
        }
        .foregroundColor(.white)
        .frame(maxWidth: .infinity)
        .padding(.vertical, 16)
        .background(color)
        .cornerRadius(15)
        .shadow(color: color.opacity(0.3), radius: 5, x: 0, y: 3)
    }

    func fetchPatientReports() {
        isLoading = true
        errorMessage = ""
        
        let url = NetworkManager.shared.getURL(for: "patient_profile.php?patient_id=\(currentPatient.patient_id)&doctor_id=\(doctorID)")
        
        URLSession.shared.dataTask(with: url) { data, response, error in
            DispatchQueue.main.async {
                isLoading = false
                if let error = error {
                    errorMessage = "Network error: \(error.localizedDescription)"
                    return
                }
                
                guard let data = data else {
                    errorMessage = "No data received from server"
                    return
                }
                
                do {
                    if let json = try JSONSerialization.jsonObject(with: data) as? [String: Any],
                       let status = json["status"] as? Bool {
                        if status {
                            self.reports = json["reports"] as? [[String: Any]] ?? []
                            
                            // Update current patient info if available
                            if let patientData = json["patient"] as? [String: Any],
                               let jsonData = try? JSONSerialization.data(withJSONObject: patientData),
                               let updatedPatient = try? JSONDecoder().decode(HQPatient.self, from: jsonData) {
                                self.currentPatient = updatedPatient
                            }
                        } else {
                            errorMessage = json["message"] as? String ?? "Failed to load reports"
                        }
                    }
                } catch {
                    errorMessage = "Failed to parse server response"
                }
            }
        }.resume()
    }
    
    private func deleteReport(_ report: [String: Any]) {
        guard let reportId = report["id"] as? Int else { return }
        let tableName = report["table_name"] as? String ?? "disease"
        
        isLoading = true
        let url = NetworkManager.shared.getURL(for: "delete_report.php")
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")
        
        let bodyString = "report_id=\(reportId)&table_name=\(tableName)"
        request.httpBody = bodyString.data(using: .utf8)
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            DispatchQueue.main.async {
                if let data = data,
                   let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any] {
                    if let status = json["status"] as? Bool, status == true {
                        // Refresh the reports list on success
                        fetchPatientReports()
                    } else {
                        isLoading = false
                        errorMessage = json["message"] as? String ?? "Failed to delete report."
                    }
                } else {
                    isLoading = false
                    errorMessage = "Server error or unreachable."
                }
            }
        }.resume()
    }
}


#Preview {
    NavigationStack {
        PatientProfileView(patient: HQPatient(patient_id: "ID-123456", name: "John Doe", age: "45", gender: "Male", phone: "1234567890", address: "123 Street", doctorName: "Dr. Smith", reportType: "Biopsy", diagnosis: "None", notes: "No notes", fullReport: "Full Report", reportImages: [], reportDocuments: []))
    }
}
