import SwiftUI

struct NETGradingView: View {
    @StateObject private var navManager = AppNavigation.shared
    @StateObject private var patientSession = PatientSessionManager.shared
    @AppStorage("doctor_id") private var doctorID: Int = 0
    
    @State private var selectedRange = "3-20%"
    @State private var isExpanded = false
    @State private var isSaving = false
    @State private var showSaveAlert = false
    @State private var showSavedToast = false
    @State private var alertMessage = ""

    let rangeOptions = ["<3%", "3-20%", ">20%"]

    var grading: String {
        switch selectedRange {
        case "<3%": return "Grade 1"
        case "3-20%": return "Grade 2"
        case ">20%": return "Grade 3"
        default: return ""
        }
    }
    
    var inferenceText: String {
        "Well differentiated neuroendocrine tumour - \(grading)"
    }
    
    var inferenceColor: Color {
        switch selectedRange {
        case "<3%": return .green
        case "3-20%": return .orange
        case ">20%": return .red
        default: return .gray
        }
    }

    var body: some View {
        ZStack {
            VStack(spacing: 0) {
                StandardHeader(title: "GIT Tissue")

                ScrollView(showsIndicators: false) {
                    VStack(spacing: 24) {
                        
                        // Custom Full-Width Dropdown
                        VStack(alignment: .leading, spacing: 0) {
                            Text("Ki-67 Index Range:")
                                .font(.system(size: 16, weight: .semibold))
                                .foregroundColor(.black)
                                .padding(.horizontal, 4)
                                .padding(.bottom, 12)

                            VStack(spacing: 0) {
                                // Trigger Box
                                Button(action: { 
                                    withAnimation(.spring(response: 0.35, dampingFraction: 0.7)) {
                                        isExpanded.toggle() 
                                    }
                                }) {
                                    HStack {
                                        Text(selectedRange)
                                            .font(.system(size: 18, weight: .medium))
                                            .foregroundColor(.black)
                                        Spacer()
                                        Image(systemName: "chevron.down")
                                            .font(.system(size: 16, weight: .bold))
                                            .foregroundColor(.blue)
                                            .rotationEffect(.degrees(isExpanded ? 180 : 0))
                                    }
                                    .padding(.vertical, 14)
                                    .padding(.horizontal, 16)
                                    .background(Color.white)
                                }
                                .clipShape(RoundedCorner(radius: 16, corners: isExpanded ? [.topLeft, .topRight] : .allCorners))
                                .shadow(color: Color.black.opacity(0.06), radius: 10, x: 0, y: 4)
                                
                                // Expanded Options
                                if isExpanded {
                                    VStack(spacing: 0) {
                                        ForEach(rangeOptions, id: \.self) { option in
                                            Button(action: {
                                                selectedRange = option
                                                withAnimation { isExpanded = false }
                                            }) {
                                                HStack {
                                                    Text(option)
                                                        .font(.system(size: 17))
                                                        .foregroundColor(selectedRange == option ? .blue : .black.opacity(0.8))
                                                    Spacer()
                                                    if selectedRange == option {
                                                        Image(systemName: "checkmark")
                                                            .font(.system(size: 14, weight: .bold))
                                                            .foregroundColor(.blue)
                                                    }
                                                }
                                                .padding(.vertical, 14)
                                                .padding(.horizontal, 16)
                                                .background(selectedRange == option ? Color.blue.opacity(0.05) : Color.white)
                                            }
                                            
                                            if option != rangeOptions.last {
                                                Divider().padding(.horizontal, 16)
                                            }
                                        }
                                    }
                                    .background(Color.white)
                                    .clipShape(RoundedCorner(radius: 16, corners: [.bottomLeft, .bottomRight]))
                                    .shadow(color: Color.black.opacity(0.06), radius: 10, x: 0, y: 8)
                                    .transition(.move(edge: .top).combined(with: .opacity))
                                }
                            }
                        }
                        .padding(.top, 18)
                        .zIndex(10) // Ensure dropdown is above other content when expanded
                        
                        // Result Box
                        VStack(spacing: 8) {
                            Text("Interpretation: \(grading)")
                                .font(.system(size: 22, weight: .bold))
                                .foregroundColor(inferenceColor)
                            
                            Text(inferenceText)
                                .font(.system(size: 15))
                                .foregroundColor(.gray)
                                .multilineTextAlignment(.center)
                        }
                        .frame(maxWidth: .infinity)
                        .padding(24)
                        .background(Color.white)
                        .cornerRadius(18)
                        .overlay(
                            RoundedRectangle(cornerRadius: 18)
                                .stroke(inferenceColor.opacity(0.2), lineWidth: 2)
                        )
                        .shadow(color: Color.black.opacity(0.05), radius: 8, x: 0, y: 3)

                        if let patient = patientSession.currentPatient {
                            Button(action: saveAnalysis) {
                                HStack {
                                    if isSaving {
                                        ProgressView().tint(.white).padding(.trailing, 8)
                                    } else {
                                        Image(systemName: "checkmark.circle.fill")
                                    }
                                    Text("Save to \(patient.name)'s Report")
                                        .fontWeight(.bold)
                                }
                                .foregroundColor(.white)
                                .frame(maxWidth: .infinity, minHeight: 54)
                                .background(LinearGradient(colors: [Color.blue, Color.cyan], startPoint: .leading, endPoint: .trailing))
                                .cornerRadius(16)
                                .shadow(color: Color.blue.opacity(0.3), radius: 8)
                            }
                            .disabled(isSaving)
                            .padding(.top, 10)
                        }

                        inferenceCard

                        Spacer()
                    }
                    .padding(.horizontal, 18)
                    .padding(.top, 18)
                }
            }
            .ignoresSafeArea(edges: .top)
            
            // Toast Overlay
            if showSavedToast {
                VStack {
                    Spacer()
                    HStack {
                        Image(systemName: "checkmark.circle.fill")
                        Text("Report Saved")
                    }
                    .font(.system(size: 16, weight: .bold))
                    .foregroundColor(.white)
                    .padding(.vertical, 12)
                    .padding(.horizontal, 24)
                    .background(Color.green)
                    .cornerRadius(25)
                    .padding(.bottom, 50)
                }
                .transition(.move(edge: .bottom).combined(with: .opacity))
                .zIndex(100)
            }
        }
        .background(
            LinearGradient(
                colors: [
                    Color(red: 0.95, green: 0.97, blue: 1.0),
                    Color.white
                ],
                startPoint: .top,
                endPoint: .bottom
            )
            .ignoresSafeArea()
        )
        .alert("Status", isPresented: $showSaveAlert) {
            Button("OK", role: .cancel) { }
        } message: {
            Text(alertMessage)
        }
        .navigationBarBackButtonHidden(true)
        .toolbar(.hidden, for: .navigationBar)
    }


    
    var inferenceCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("INFERENCE")
                .font(.system(size: 16, weight: .bold))
                .foregroundColor(.black)

            VStack(alignment: .leading, spacing: 10) {
                inferenceRow(text: "< 3% → Grade 1 (G1)", color: .green)
                inferenceRow(text: "3-20% → Grade 2 (G2)", color: .orange)
                inferenceRow(text: "> 20% → Grade 3 (G3)", color: .red)
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(18)
        .background(Color.white)
        .cornerRadius(18)
        .shadow(color: Color.black.opacity(0.05), radius: 8, x: 0, y: 3)
    }

    @ViewBuilder
    func inferenceRow(text: String, color: Color) -> some View {
        HStack(spacing: 10) {
            Circle()
                .fill(color)
                .frame(width: 8, height: 8)
            Text(text)
                .font(.system(size: 15, weight: .medium))
                .foregroundColor(.black.opacity(0.85))
        }
    }
    
    func saveAnalysis() {
        guard doctorID > 0 else { alertMessage = "Login Error: Doctor ID not found. Please log out and log in again."; showSaveAlert = true; return }
        guard let patient = patientSession.currentPatient else { alertMessage = "No Patient Selected: Please search for and select a patient before saving."; showSaveAlert = true; return }
        isSaving = true
        
        let reportType = "GIT - NET Grading Analysis"
        let diagnosisText = "NET: \(grading)"
        let notesText = "Ki-67 Index: \(selectedRange)"
        let fullReport = """
        CLINICAL ANALYSIS REPORT: GIT NET GRADING
        -------------------------------------------
        Patient Name: \(patient.name)
        Patient ID: \(patient.patient_id)
        
        Ki-67 INDEX RANGE: \(selectedRange)
        WHO GRADE: \(grading)
        CLASS: \(inferenceText)
        
        Interpretation: \(selectedRange == ">20%" ? "Grade 3 (G3) neuroendocrine carcinoma indicated by high Ki-67 index. Highly aggressive biology." : (selectedRange == "<3%" ? "Grade 1 (G1) well-differentiated tumors. Generally associated with better prognosis." : "Grade 2 (G2) well-differentiated tumors."))
        """
        
        
        let url = NetworkManager.shared.getURL(for: "add_analysis_report.php")
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")
        
        let bodyParameters = [
            "doctor_id": "\(doctorID)",
            "patient_id": patient.patient_id,
            "tissue_type": "GIT",
            "marker": "NET Grading",
            "total_score": selectedRange,
            "inference": fullReport
        ]
        
        let bodyString = bodyParameters.map { "\($0.key)=\($0.value.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? "")" }.joined(separator: "&")
        request.httpBody = bodyString.data(using: .utf8)
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            DispatchQueue.main.async {
                isSaving = false
                if let error = error {
                    alertMessage = "Network error: \(error.localizedDescription)"
                    showSaveAlert = true
                } else if let data = data, let result = try? JSONSerialization.jsonObject(with: data) as? [String: Any] {
                    if result["status"] as? Bool == true {
                        withAnimation {
                            showSavedToast = true
                        }
                        DispatchQueue.main.asyncAfter(deadline: .now() + 1.2) {
                            withAnimation {
                                showSavedToast = false
                            }
                        }
                    } else {
                        alertMessage = "Error: \(result["message"] ?? "Unknown error")"
                        showSaveAlert = true
                    }
                } else {
                    alertMessage = "Invalid response from server"
                    showSaveAlert = true
                }
            }
        }.resume()
    }
}

struct NETGradingView_Previews: PreviewProvider {
    static var previews: some View {
        NavigationStack {
            NETGradingView()
        }
    }
}
