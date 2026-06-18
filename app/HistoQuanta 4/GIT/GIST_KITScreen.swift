import SwiftUI

struct GIST_KITScreen: View {
    @StateObject private var navManager = AppNavigation.shared
    @StateObject private var patientSession = PatientSessionManager.shared
    @AppStorage("doctor_id") private var doctorID: Int = 0
    
    @State private var selectedPattern = "Diffuse strong positivity"
    @State private var isExpanded = false
    @State private var isSaving = false
    @State private var showSaveAlert = false
    @State private var showSavedToast = false
    @State private var alertMessage = ""

    let patterns = [
        "Diffuse strong positivity",
        "Focal weak pattern",
        "Dot like peri-nuclear staining",
        "Membranous pattern"
    ]

    var body: some View {
        ZStack {
            VStack(spacing: 0) {
                StandardHeader(title: "GIST - KIT")

                ScrollView(showsIndicators: false) {
                    VStack(spacing: 24) {
                        
                        // Custom Full-Width Dropdown
                        VStack(alignment: .leading, spacing: 0) {
                            Text("Select KIT (CD117) Pattern:")
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
                                        Text(selectedPattern)
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
                                        ForEach(patterns, id: \.self) { pattern in
                                            Button(action: {
                                                selectedPattern = pattern
                                                withAnimation { isExpanded = false }
                                            }) {
                                                HStack {
                                                    Text(pattern)
                                                        .font(.system(size: 16))
                                                        .foregroundColor(selectedPattern == pattern ? .blue : .black.opacity(0.8))
                                                    Spacer()
                                                    if selectedPattern == pattern {
                                                        Image(systemName: "checkmark")
                                                            .font(.system(size: 14, weight: .bold))
                                                            .foregroundColor(.blue)
                                                    }
                                                }
                                                .padding(.vertical, 14)
                                                .padding(.horizontal, 16)
                                                .background(selectedPattern == pattern ? Color.blue.opacity(0.05) : Color.white)
                                            }
                                            
                                            if pattern != patterns.last {
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
                        .padding(.top, 20)
                        .padding(.horizontal, 18)

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

                        // Clinical Note Card
                        VStack(alignment: .leading, spacing: 12) {
                            HStack {
                                Image(systemName: "info.circle.fill")
                                    .foregroundColor(.blue)
                                Text("Clinical Significance")
                                    .font(.system(size: 16, weight: .bold))
                            }
                            
                            Text("KIT expression is observed in ~95% of GISTs. Diffuse strong positivity is the most common pattern. Diagnostic refinement is required if staining is weak or focal.")
                                .font(.system(size: 14))
                                .foregroundColor(.black.opacity(0.7))
                        }
                        .padding(20)
                        .background(Color.white)
                        .cornerRadius(18)
                        .shadow(color: Color.black.opacity(0.05), radius: 8, x: 0, y: 3)

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
        
        let reportType = "GIST - KIT (CD117) Analysis"
        let diagnosisText = "KIT: \(selectedPattern)"
        let notesText = "Pattern: \(selectedPattern)"
        let fullReport = """
        CLINICAL ANALYSIS REPORT: GIST KIT (CD117)
        -------------------------------------------
        Patient Name: \(patient.name)
        Patient ID: \(patient.patient_id)
        
        KIT STAINING PATTERN: \(selectedPattern)
        
        Clinical Interpretation: 
        \(selectedPattern == "Diffuse strong positivity" ? "Classic GIST immunoprofile. Strong diffuse KIT expression is highly specific for GIST in this clinical context." : "Atypical or focal expression pattern. Consider correlation with DOG1 and molecular testing for mutation analysis.")
        """
        
        
        let url = NetworkManager.shared.getURL(for: "add_analysis_report.php")
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")
        
        let bodyParameters = [
            "doctor_id": "\(doctorID)",
            "patient_id": patient.patient_id,
            "tissue_type": "GIT",
            "marker": "GIST KIT",
            "total_score": selectedPattern,
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

struct GIST_KITScreen_Previews: PreviewProvider {
    static var previews: some View {
        NavigationStack {
            GIST_KITScreen()
        }
    }
}
