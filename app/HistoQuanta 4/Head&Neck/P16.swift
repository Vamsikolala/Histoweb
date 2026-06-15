import SwiftUI

struct P16: View {
    @StateObject private var navManager = AppNavigation.shared
    @StateObject private var patientSession = PatientSessionManager.shared
    @AppStorage("doctor_id") private var doctorID: Int = 0
    
    @State private var selectedResult: String = "Negative (no staining / weak focal)"
    @State private var isExpanded = false
    
    let p16Options = [
        "Negative (no staining / weak focal)",
        "Equivocal (50-70% staining)",
        "Positive (nuclear & cytoplasmic)"
    ]
    
    @State private var isSaving = false
    @State private var showSaveAlert = false
    @State private var showSavedToast = false
    @State private var alertMessage = ""

    var inference: String {
        if selectedResult.contains("Negative") { return "Negative" }
        if selectedResult.contains("Equivocal") { return "Equivocal" }
        if selectedResult.contains("Positive") { return "Positive" }
        return ""
    }
    
    var inferenceColor: Color {
        switch inference {
        case "Positive": return .green
        case "Equivocal": return .orange
        case "Negative": return .red
        default: return .gray
        }
    }

    var resultDescription: String {
        switch selectedResult {
        case "Negative (no staining / weak focal)":
            return "Absent or weak/focal staining (<70% of cells)."
        case "Equivocal (50-70% staining)":
            return "Weak or focal staining in 50-70% of tumor cells."
        case "Positive (nuclear & cytoplasmic)":
            return "Diffuse strong nuclear and cytoplasmic staining in ≥70% of tumor cells."
        default: return ""
        }
    }

    var interpretation: String {
        switch selectedResult {
        case "Negative (no staining / weak focal)":
            return "Non-HPV-associated carcinoma — standard risk stratification."
        case "Equivocal (50-70% staining)":
            return "Intermediate p16 expression — Consider clinical correlation or HPV DNA testing."
        case "Positive (nuclear & cytoplasmic)":
            return "HPV-associated oropharyngeal carcinoma — favorable prognosis."
        default: return ""
        }
    }

    var body: some View {
        ZStack {
            VStack(spacing: 0) {
                StandardHeader(title: "Head & Neck") {
                    Button(action: { navManager.navigate(to: .p16Guidelines) }) {
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
                        
                        // Custom Full-Width Dropdown
                        VStack(alignment: .leading, spacing: 0) {
                            Text("Select P16 Result")
                                .font(.system(size: 16, weight: .bold))
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
                                        Text(selectedResult)
                                            .font(.system(size: 17))
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
                                .shadow(color: Color.black.opacity(0.06), radius: 6, x: 0, y: 3)
                                .overlay(
                                    RoundedCorner(radius: 16, corners: isExpanded ? [.topLeft, .topRight] : .allCorners)
                                        .stroke(Color.gray.opacity(0.15), lineWidth: 1.2)
                                )
                                
                                // Expanded Options
                                if isExpanded {
                                    VStack(spacing: 0) {
                                        ForEach(p16Options, id: \.self) { option in
                                            Button(action: {
                                                selectedResult = option
                                                withAnimation { isExpanded = false }
                                            }) {
                                                HStack {
                                                    Text(option)
                                                        .font(.system(size: 16))
                                                        .foregroundColor(selectedResult == option ? .blue : .black.opacity(0.8))
                                                    Spacer()
                                                    if selectedResult == option {
                                                        Image(systemName: "checkmark")
                                                            .font(.system(size: 14, weight: .bold))
                                                            .foregroundColor(.blue)
                                                    }
                                                }
                                                .padding(.vertical, 14)
                                                .padding(.horizontal, 16)
                                                .background(selectedResult == option ? Color.blue.opacity(0.05) : Color.white)
                                            }
                                            
                                            if option != p16Options.last {
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
                        }
                        .zIndex(10)

                        // Inferences List Section
                        VStack(alignment: .leading, spacing: 15) {
                            Text("INFERENCES:")
                                .font(.system(size: 18, weight: .bold))
                                .foregroundColor(.black)
                            
                            VStack(alignment: .leading, spacing: 10) {
                                inferenceTextLine("<50 = negative")
                                inferenceTextLine("50-70 = equivocal")
                                inferenceTextLine(">70 = positive")
                            }
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(20)
                        .background(Color.white)
                        .cornerRadius(18)
                        .shadow(color: Color.black.opacity(0.05), radius: 8, x: 0, y: 3)
                        
                        // Result Box
                        VStack(alignment: .leading, spacing: 15) {
                            Text("RESULT")
                                .font(.system(size: 16, weight: .bold))
                                .foregroundColor(.purple)
                            
                            VStack(alignment: .leading, spacing: 10) {
                                Text(resultDescription)
                                    .font(.system(size: 16, weight: .semibold))
                                    .foregroundColor(.black)
                                
                                Text("Interpretation: \(interpretation)")
                                    .font(.system(size: 15))
                                    .foregroundColor(.black.opacity(0.75))
                                    .fixedSize(horizontal: false, vertical: true)
                            }
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(24)
                        .background(Color(white: 0.98))
                        .cornerRadius(18)
                        .overlay(
                            RoundedRectangle(cornerRadius: 18)
                                .stroke(Color.purple.opacity(0.2), lineWidth: 1.5)
                        )
                        .shadow(color: Color.black.opacity(0.03), radius: 8, x: 0, y: 3)

                        if let patient = patientSession.currentPatient {
                            Button(action: saveAnalysis) {
                                HStack {
                                    if isSaving {
                                        ProgressView().tint(.white).padding(.trailing, 8)
                                    } else {
                                        Image(systemName: "checkmark.circle.fill")
                                    }
                                    Text("Save Report")
                                        .fontWeight(.bold)
                                }
                                .foregroundColor(.white)
                                .frame(maxWidth: .infinity, minHeight: 56)
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


    
    func saveAnalysis() {
        guard doctorID > 0 else { alertMessage = "Login Error: Doctor ID not found. Please log out and log in again."; showSaveAlert = true; return }
        guard let patient = patientSession.currentPatient else { alertMessage = "No Patient Selected: Please search for and select a patient before saving."; showSaveAlert = true; return }
        isSaving = true
        
        let fullReport = """
        CLINICAL ANALYSIS REPORT: HEAD & NECK P16
        -------------------------------------------
        Patient Name: \(patient.name)
        Patient ID: \(patient.patient_id)
        
        P16 SELECTION: \(selectedResult)
        INFERENCE: \(inference)
        
        Description: \(resultDescription)
        Interpretation: \(interpretation)
        """
        
        let url = NetworkManager.shared.getURL(for: "add_analysis_report.php")
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")
        
        let bodyParameters = [
            "doctor_id": "\(doctorID)",
            "patient_id": patient.patient_id,
            "tissue_type": "Head & Neck",
            "marker": "P16",
            "total_score": selectedResult,
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

    @ViewBuilder
    func inferenceTextLine(_ text: String) -> some View {
        HStack(spacing: 12) {
            Circle()
                .fill(Color.purple.opacity(0.7))
                .frame(width: 6, height: 6)
            Text(text)
                .font(.system(size: 15))
                .foregroundColor(.black.opacity(0.8))
        }
    }
}

struct P16_Previews: PreviewProvider {
    static var previews: some View {
        NavigationStack {
            P16()
        }
    }
}
