import SwiftUI

struct GITBiopsySpecimen: View {
    @StateObject private var navManager = AppNavigation.shared
    @StateObject private var patientSession = PatientSessionManager.shared
    @AppStorage("doctor_id") private var doctorID: Int = 0
    
    @State private var selectedIntensity = "0 — No staining"
    @State private var isExpanded = false
    
    @State private var isSaving = false
    @State private var showSaveAlert = false
    @State private var showSavedToast = false
    @State private var alertMessage = ""

    let intensityOptions = [
        "0 — No staining",
        "1+ — Incomplete/faint membrane staining",
        "2+ — Weak/moderate complete membrane staining",
        "3+ — Strong complete membrane staining"
    ]

    var scoreCategory: String {
        if selectedIntensity.contains("3+") { return "Positive" }
        if selectedIntensity.contains("2+") { return "Equivocal" }
        return "Negative"
    }

    var resultText: String {
        switch scoreCategory {
        case "Positive":
            return "HER2 Positive (Score 3+) — Eligible for anti-HER2 therapy (e.g., trastuzumab)."
        case "Equivocal":
            return "HER2 Equivocal (Score 2+) — ISH (FISH/SISH) testing required for amplification status."
        case "Negative":
            if selectedIntensity.contains("1+") {
                return "HER2 Negative (Score 1+) — Not eligible for anti-HER2 therapy."
            } else {
                return "HER2 Negative (Score 0) — Not eligible for anti-HER2 therapy."
            }
        default:
            return "HER2 negative — Not eligible for anti-HER2 therapy."
        }
    }

    var interpretationCriteria: String {
        if selectedIntensity.contains("3+") {
            return "Complete membrane staining that is intense and >10% of tumor cells*"
        } else if selectedIntensity.contains("2+") {
            return "Weak to moderate complete membrane staining in >10% of tumor cells\n\nor\n\nComplete membrane staining that is intense but within ≤10% of tumor cells*"
        } else if selectedIntensity.contains("1+") {
            return "Incomplete membrane staining that is faint/barely perceptible and within >10% of tumor cells"
        } else {
            return "No staining observed (0/absent membrane staining)\n\nor\n\nMembrane staining that is incomplete and is faint/barely perceptible and within ≤10% of tumor cells (0+/with membrane staining)"
        }
    }
    
    var inferenceColor: Color {
        switch scoreCategory {
        case "Positive": return .green
        case "Equivocal": return .orange
        case "Negative": return .red
        default: return .gray
        }
    }

    var body: some View {
        ZStack {
            VStack(spacing: 0) {
                StandardHeader(title: "GIT - Biopsy") {
                    Button(action: { navManager.navigate(to: .gitGuidelinesHER2) }) {
                        ZStack {
                            Circle()
                                .fill(Color.white.opacity(0.18))
                                .frame(width: 38, height: 38)
                            Image(systemName: "ellipsis")
                                .font(.system(size: 18, weight: .bold))
                                .foregroundColor(.white)
                        }
                    }
                }

                ScrollView(showsIndicators: false) {
                    VStack(spacing: 24) {
                        
                        // Subtitle
                        VStack(spacing: 4) {
                            Text("Adenocarcinoma")
                                .font(.system(size: 20, weight: .bold))
                            Text("HER2 - Biopsy Specimen")
                                .font(.system(size: 16))
                                .foregroundColor(.gray)
                        }
                                                                .padding(.top, 10)
                        
                        // Custom Full-Width Dropdown
                        VStack(alignment: .leading, spacing: 0) {
                            Text("Select Intensity of Staining:")
                                .font(.system(size: 16, weight: .semibold))
                                .foregroundColor(.black)
                                .padding(.horizontal, 4)
                                .padding(.bottom, 12)
                            
                            VStack(spacing: 0) {
                                // Trigger Box
                                Button(action: { 
                                    withAnimation(.easeInOut(duration: 0.2)) {
                                        isExpanded.toggle() 
                                    }
                                }) {
                                    HStack {
                                        Text(selectedIntensity)
                                            .foregroundColor(.black)
                                        Spacer()
                                        Image(systemName: "chevron.down")
                                            .font(.system(size: 14, weight: .bold))
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
                                        ForEach(intensityOptions, id: \.self) { option in
                                            Button(action: {
                                                selectedIntensity = option
                                                withAnimation { isExpanded = false }
                                            }) {
                                                HStack {
                                                    Text(option)
                                                        .font(.system(size: 15))
                                                        .foregroundColor(selectedIntensity == option ? .blue : .black.opacity(0.8))
                                                    Spacer()
                                                    if selectedIntensity == option {
                                                        Image(systemName: "checkmark")
                                                            .font(.system(size: 14, weight: .bold))
                                                            .foregroundColor(.blue)
                                                    }
                                                }
                                                .padding(.vertical, 14)
                                                .padding(.horizontal, 16)
                                                .background(selectedIntensity == option ? Color.blue.opacity(0.05) : Color.white)
                                            }
                                            
                                            if option != intensityOptions.last {
                                                Divider().padding(.horizontal, 16)
                                            }
                                        }
                                    }
                                    .background(Color.white)
                                    .clipShape(RoundedCorner(radius: 16, corners: [.bottomLeft, .bottomRight]))
                                    .shadow(color: Color.black.opacity(0.06), radius: 10, x: 0, y: 8)
                                    .transition(.opacity)
                                }
                            }
                        }
                        .padding(.top, 10)
                        .zIndex(10)

                        // Interpretation Section (New)
                        VStack(alignment: .leading, spacing: 15) {
                            Text("INTERPRETATION CRITERIA:")
                                .font(.system(size: 16, weight: .bold))
                                .foregroundColor(.black)
                            
                            Text(interpretationCriteria)
                                .font(.system(size: 15))
                                .foregroundColor(.black.opacity(0.8))
                                .lineSpacing(4)
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(20)
                        .background(Color.white)
                        .cornerRadius(18)
                        .shadow(color: Color.black.opacity(0.05), radius: 8, x: 0, y: 3)

                        // Result Card
                        VStack(alignment: .leading, spacing: 12) {
                            Text("RESULT")
                                .font(.system(size: 16, weight: .bold))
                                .foregroundColor(.blue)
                            
                            Text(resultText)
                                .font(.system(size: 16, weight: .medium))
                                .foregroundColor(inferenceColor)
                                .multilineTextAlignment(.leading)
                                .lineSpacing(4)
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
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

                        Spacer()
                    }
                    .padding(.horizontal, 18)
                    .padding(.bottom, 24)
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


    
    func saveAnalysis() {
        guard doctorID > 0 else { alertMessage = "Login Error: Doctor ID not found. Please log out and log in again."; showSaveAlert = true; return }
        guard let patient = patientSession.currentPatient else { alertMessage = "No Patient Selected: Please search for and select a patient before saving."; showSaveAlert = true; return }
        isSaving = true
        
        let reportType = "GIT - Biopsy HER2 Analysis"
        let fullReport = """
        CLINICAL ANALYSIS REPORT: GIT BIOPSY HER2
        -------------------------------------------
        Patient Name: \(patient.name)
        Patient ID: \(patient.patient_id)
        
        STAINING INTENSITY (Biopsy): \(selectedIntensity)
        INFERENCE: \(scoreCategory)
        
        Interpretation: \(resultText)
        """
        
        let url = NetworkManager.shared.getURL(for: "add_analysis_report.php")
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")
        
        let bodyParameters = [
            "doctor_id": "\(doctorID)",
            "patient_id": patient.patient_id,
            "tissue_type": "GIT",
            "marker": "Adenocarcinoma HER2 (Biopsy)",
            "total_score": "Score \(selectedIntensity.prefix(2))",
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

struct GITBiopsySpecimen_Previews: PreviewProvider {
    static var previews: some View {
        NavigationStack {
            GITBiopsySpecimen()
        }
    }
}
