import SwiftUI

struct PR: View {
    @StateObject private var navManager = AppNavigation.shared
    @StateObject private var patientSession = PatientSessionManager.shared
    @AppStorage("doctor_id") private var doctorID: Int = 0
    
    @State private var selectedIntensity = 0
    @State private var selectedProportion = 0
    @State private var isIntensityExpanded = false
    @State private var isProportionExpanded = false
    
    @State private var isSaving = false
    @State private var showSaveAlert = false
    @State private var showSavedToast = false
    @State private var alertMessage = ""

    let intensityOptions = [
        ("None (0)", 0),
        ("Weak (1)", 1),
        ("Moderate (2)", 2),
        ("Strong (3)", 3)
    ]
    
    let proportionOptions = [
        ("None (0)", 0),
        ("0-1% (Score 1)", 1),
        ("1-10% (Score 2)", 2),
        ("11-35% (Score 3)", 3),
        ("36-60% (Score 4)", 4),
        ("61-100% (Score 5)", 5)
    ]

    var totalScore: Int {
        selectedIntensity > 0 || selectedProportion > 0 ? selectedIntensity + selectedProportion : 0
    }
    
    var inference: String {
        if totalScore <= 2 {
            return "Negative"
        } else {
            return "Positive"
        }
    }
    
    var inferenceColor: Color {
        totalScore <= 2 ? .gray : .pink
    }

    let columnWidth: CGFloat = 115
    let rowHeight: CGFloat = 125

    var body: some View {
        ZStack {
            VStack(spacing: 0) {
                StandardHeader(title: "Breast - PR")

                ScrollView(showsIndicators: false) {
                    VStack(spacing: 20) {
                        scoreTitleCard

                        formulaCard

                        VStack(alignment: .leading, spacing: 20) {
                            intensityDropdown
                            proportionDropdown
                        }

                        // Result Box
                        VStack(spacing: 8) {
                            Text("\(inference) (Total: \(totalScore))")
                                .font(.system(size: 22, weight: .bold))
                                .foregroundColor(inferenceColor)
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 24)
                        .background(
                            RoundedRectangle(cornerRadius: 18)
                                .fill(Color.white)
                                .shadow(color: Color.black.opacity(0.05), radius: 8, x: 0, y: 4)
                        )
                        .overlay(
                            RoundedRectangle(cornerRadius: 18)
                                .stroke(inferenceColor.opacity(0.3), lineWidth: 2)
                        )
                        .padding(.horizontal, 18)

                        inferenceCard

                        Button(action: { 
                            if patientSession.currentPatient != nil {
                                saveAnalysis()
                            } else {
                                navManager.navigate(to: .prHScore(intensity: selectedIntensity, proportion: selectedProportion))
                            }
                        }) {
                            HStack {
                                if isSaving {
                                    ProgressView()
                                        .tint(.blue)
                                        .padding(.trailing, 8)
                                }
                                Text(patientSession.currentPatient != nil ? "save & H-score" : "Open H-Score")
                                    .fontWeight(.bold)
                            }
                            .foregroundColor(Color(red: 0.1, green: 0.4, blue: 0.7))
                            .frame(maxWidth: .infinity, minHeight: 54)
                            .background(Color(red: 0.8, green: 0.92, blue: 1.0))
                            .cornerRadius(16)
                        }
                        .padding(.horizontal, 18)
                        .padding(.bottom, 24)
                    }
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
                        Text("Analysis Saved")
                    }
                    .font(.system(size: 16, weight: .bold))
                    .foregroundColor(.white)
                    .padding(.vertical, 12)
                    .padding(.horizontal, 24)
                    .background(Color.green)
                    .cornerRadius(25)
                    .shadow(radius: 5)
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



    @ViewBuilder
    var intensityDropdown: some View {
        VStack(alignment: .leading, spacing: 0) {
            Text("Select Staining Intensity:")
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(.black)
                .padding(.horizontal, 22)
                .padding(.bottom, 10)
            
            VStack(spacing: 0) {
                Button(action: { 
                    withAnimation(.easeInOut(duration: 0.2)) {
                        isIntensityExpanded.toggle()
                        if isIntensityExpanded { isProportionExpanded = false }
                    }
                }) {
                    HStack {
                        Text(intensityOptions.first(where: { $0.1 == selectedIntensity })?.0 ?? "Select")
                            .font(.system(size: 17))
                            .foregroundColor(.black)
                        Spacer()
                        Image(systemName: "chevron.down")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(.blue)
                            .rotationEffect(.degrees(isIntensityExpanded ? 180 : 0))
                    }
                    .padding(.vertical, 14)
                    .padding(.horizontal, 16)
                    .background(Color.white)
                }
                .clipShape(RoundedCorner(radius: 16, corners: isIntensityExpanded ? [.topLeft, .topRight] : .allCorners))
                .shadow(color: Color.black.opacity(0.06), radius: 6, x: 0, y: 3)
                .overlay(
                    RoundedCorner(radius: 16, corners: isIntensityExpanded ? [.topLeft, .topRight] : .allCorners)
                        .stroke(Color.gray.opacity(0.15), lineWidth: 1.2)
                )
                
                if isIntensityExpanded {
                    VStack(spacing: 0) {
                        ForEach(intensityOptions, id: \.1) { option in
                            Button(action: {
                                selectedIntensity = option.1
                                withAnimation { isIntensityExpanded = false }
                            }) {
                                HStack {
                                    Text(option.0)
                                        .font(.system(size: 16))
                                        .foregroundColor(selectedIntensity == option.1 ? .blue : .black.opacity(0.8))
                                    Spacer()
                                    if selectedIntensity == option.1 {
                                        Image(systemName: "checkmark")
                                            .font(.system(size: 14, weight: .bold))
                                            .foregroundColor(.blue)
                                    }
                                }
                                .padding(.vertical, 14)
                                .padding(.horizontal, 16)
                                .background(selectedIntensity == option.1 ? Color.blue.opacity(0.05) : Color.white)
                            }
                            if option.1 != intensityOptions.last?.1 {
                                Divider().padding(.horizontal, 16)
                            }
                        }
                    }
                    .background(Color.white)
                    .clipShape(RoundedCorner(radius: 16, corners: [.bottomLeft, .bottomRight]))
                    .shadow(color: Color.black.opacity(0.06), radius: 10, x: 0, y: 8)
                    .transition(.opacity)
                    .overlay(
                        RoundedCorner(radius: 16, corners: [.bottomLeft, .bottomRight])
                            .stroke(Color.gray.opacity(0.15), lineWidth: 1.2)
                    )
                }
            }
            .padding(.horizontal, 18)
        }
        .zIndex(isIntensityExpanded ? 20 : 1)
    }

    @ViewBuilder
    var proportionDropdown: some View {
        VStack(alignment: .leading, spacing: 0) {
            Text("Select Proportion (% of positive tumor cells):")
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(.black)
                .padding(.horizontal, 22)
                .padding(.bottom, 10)
            
            VStack(spacing: 0) {
                Button(action: { 
                    withAnimation(.easeInOut(duration: 0.2)) {
                        isProportionExpanded.toggle()
                        if isProportionExpanded { isIntensityExpanded = false }
                    }
                }) {
                    HStack {
                        Text(proportionOptions.first(where: { $0.1 == selectedProportion })?.0 ?? "Select")
                            .font(.system(size: 17))
                            .foregroundColor(.black)
                        Spacer()
                        Image(systemName: "chevron.down")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(.blue)
                            .rotationEffect(.degrees(isProportionExpanded ? 180 : 0))
                    }
                    .padding(.vertical, 14)
                    .padding(.horizontal, 16)
                    .background(Color.white)
                }
                .clipShape(RoundedCorner(radius: 16, corners: isProportionExpanded ? [.topLeft, .topRight] : .allCorners))
                .shadow(color: Color.black.opacity(0.06), radius: 6, x: 0, y: 3)
                .overlay(
                    RoundedCorner(radius: 16, corners: isProportionExpanded ? [.topLeft, .topRight] : .allCorners)
                        .stroke(Color.gray.opacity(0.15), lineWidth: 1.2)
                )
                
                if isProportionExpanded {
                    VStack(spacing: 0) {
                        ForEach(proportionOptions, id: \.1) { option in
                            Button(action: {
                                selectedProportion = option.1
                                withAnimation { isProportionExpanded = false }
                            }) {
                                HStack {
                                    Text(option.0)
                                        .font(.system(size: 16))
                                        .foregroundColor(selectedProportion == option.1 ? .blue : .black.opacity(0.8))
                                    Spacer()
                                    if selectedProportion == option.1 {
                                        Image(systemName: "checkmark")
                                            .font(.system(size: 14, weight: .bold))
                                            .foregroundColor(.blue)
                                    }
                                }
                                .padding(.vertical, 14)
                                .padding(.horizontal, 16)
                                .background(selectedProportion == option.1 ? Color.blue.opacity(0.05) : Color.white)
                            }
                            if option.1 != proportionOptions.last?.1 {
                                Divider().padding(.horizontal, 16)
                            }
                        }
                    }
                    .background(Color.white)
                    .clipShape(RoundedCorner(radius: 16, corners: [.bottomLeft, .bottomRight]))
                    .shadow(color: Color.black.opacity(0.06), radius: 10, x: 0, y: 8)
                    .transition(.opacity)
                    .overlay(
                        RoundedCorner(radius: 16, corners: [.bottomLeft, .bottomRight])
                            .stroke(Color.gray.opacity(0.15), lineWidth: 1.2)
                    )
                }
            }
            .padding(.horizontal, 18)
        }
        .zIndex(isProportionExpanded ? 19 : 1)
    }

    var scoreTitleCard: some View {
        HStack {
            Image(systemName: "list.clipboard.fill")
                .foregroundColor(.blue)
                .font(.system(size: 22))

            Text("Allred Score")
                .font(.system(size: 20, weight: .bold))
                .foregroundColor(.black)

            Spacer()
        }
                                                                .padding(16)
        .background(Color(red: 0.85, green: 0.93, blue: 1.0))
        .cornerRadius(0)
        .padding(.horizontal, 18)
    }

    var formulaCard: some View {
        Text("Proportion Score + Intensity Score = Total Score")
            .font(.system(size: 16, weight: .medium))
            .multilineTextAlignment(.center)
            .foregroundColor(.black.opacity(0.8))
            .padding(18)
            .frame(maxWidth: .infinity)
            .padding(.horizontal, 18)
    }



    var inferenceCard: some View {
        VStack(alignment: .leading, spacing: 10) {
            Text("INFERENCE:")
                .font(.system(size: 16, weight: .bold))
                .foregroundColor(.black)

            inferenceRow(text: "0–2 → NEGATIVE", color: .red)
            inferenceRow(text: "3–8 → POSITIVE", color: .green)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(18)
        .padding(.horizontal, 18)
    }



    @ViewBuilder
    func inferenceRow(text: String, color: Color) -> some View {
        Text(text)
            .font(.system(size: 15, weight: .medium))
            .foregroundColor(.black.opacity(0.8))
    }
    
    func saveAnalysis() {
        guard doctorID > 0 else { alertMessage = "Login Error: Doctor ID not found. Please log out and log in again."; showSaveAlert = true; return }
        guard let patient = patientSession.currentPatient else { alertMessage = "No Patient Selected: Please search for and select a patient before saving."; showSaveAlert = true; return }
        isSaving = true
        
        let intensityLabel = intensityOptions.first(where: { $0.1 == selectedIntensity })?.0 ?? "None"
        let proportionLabel = proportionOptions.first(where: { $0.1 == selectedProportion })?.0 ?? "None"
        
        // Format as a "Small Report Document"
        let reportType = "Breast - PR Analysis"
        let diagnosisText = "PR \(inference)"
        let notesText = "Allred Score: \(totalScore)"
        let fullReport = """
        CLINICAL ANALYSIS REPORT: BREAST PR (ALLRED)
        -------------------------------------------
        Patient Name: \(patient.name)
        Patient ID: \(patient.patient_id)
        
        STAINING INTENSITY: \(intensityLabel)
        PROPORTION SCORE: \(proportionLabel)
        
        TOTAL ALLRED SCORE: \(totalScore)
        INFERENCE: \(inference)
        
        Interpretation: \(totalScore > 2 ? "The sample shows significant PR positivity, indicating likely response to hormonal therapy." : "The sample is PR negative.")
        """
        
        
        let url = NetworkManager.shared.getURL(for: "add_analysis_report.php")
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")
        
        let bodyParameters = [
            "doctor_id": "\(doctorID)",
            "patient_id": patient.patient_id,
            "tissue_type": "Breast",
            "marker": "PR",
            "total_score": "Allred \(totalScore)/8",
            "inference": fullReport
        ]
        
        let bodyString = bodyParameters.map { "\($0.key)=\($0.value.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? "")" }.joined(separator: "&")
        request.httpBody = bodyString.data(using: .utf8)
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            DispatchQueue.main.async {
                isSaving = false
                
                if let httpResponse = response as? HTTPURLResponse {
                    if httpResponse.statusCode == 404 {
                        alertMessage = "Server Error (404): Could not find the reports system."
                        showSaveAlert = true
                        return
                    }
                }

                if let error = error {
                    alertMessage = "Network error: \(error.localizedDescription)"
                    showSaveAlert = true
                } else if let data = data {
                    if let result = try? JSONSerialization.jsonObject(with: data) as? [String: Any] {
                        if result["status"] as? Bool == true {
                            withAnimation {
                                showSavedToast = true
                            }
                            DispatchQueue.main.asyncAfter(deadline: .now() + 1.2) {
                                withAnimation {
                                    showSavedToast = false
                                }
                                navManager.navigate(to: .prHScore(intensity: selectedIntensity, proportion: selectedProportion))
                            }
                        } else {
                            alertMessage = "Error: \(result["message"] ?? "Unknown error")"
                            showSaveAlert = true
                        }
                    } else if let rawResponse = String(data: data, encoding: .utf8) {
                        alertMessage = "Invalid response: \(rawResponse)"
                        showSaveAlert = true
                    } else {
                        alertMessage = "Error: Decoding failed"
                        showSaveAlert = true
                    }
                } else {
                    alertMessage = "Error: No response"
                    showSaveAlert = true
                }
            }
        }.resume()
    }
}

struct PR_Previews: PreviewProvider {
    static var previews: some View {
        NavigationStack {
            PR()
        }
    }
}
