import SwiftUI

struct GIST_KI67Screen: View {
    @StateObject private var navManager = AppNavigation.shared
    @StateObject private var patientSession = PatientSessionManager.shared
    @AppStorage("doctor_id") private var doctorID: Int = 0
    
    @State private var selectedRange = "0-5%"
    @State private var isExpanded = false
    @State private var isSaving = false
    @State private var showSaveAlert = false
    @State private var showSavedToast = false
    @State private var alertMessage = ""

    let rangeOptions = [
        "0-5%", "6-10%", "11-15%", "16-20%", "21-30%",
        "31-40%", "41-50%", "51-60%", "61-70%", "71-80%",
        "81-90%", "91-100%"
    ]

    var riskCategory: String {
        switch selectedRange {
        case "0-5%": return "Low proliferative index"
        case "6-10%", "11-15%", "16-20%": return "Intermediate proliferative index"
        default: return "High proliferative index"
        }
    }
    
    var inferenceColor: Color {
        switch selectedRange {
        case "0-5%": return .green
        case "6-10%", "11-15%", "16-20%": return .orange
        default: return .red
        }
    }

    var body: some View {
        ZStack {
            VStack(spacing: 0) {
                StandardHeader(title: "GIST Ki-67")

                ScrollView(showsIndicators: false) {
                    VStack(spacing: 24) {
                        
                        // Custom Full-Width Dropdown
                        VStack(alignment: .leading, spacing: 0) {
                            Text("Select Range")
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
                                        Text(selectedRange)
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
                                        ForEach(rangeOptions, id: \.self) { range in
                                            Button(action: {
                                                selectedRange = range
                                                withAnimation { isExpanded = false }
                                            }) {
                                                HStack {
                                                    Text(range)
                                                        .font(.system(size: 16))
                                                        .foregroundColor(selectedRange == range ? .blue : .black.opacity(0.8))
                                                    Spacer()
                                                    if selectedRange == range {
                                                        Image(systemName: "checkmark")
                                                            .font(.system(size: 14, weight: .bold))
                                                            .foregroundColor(.blue)
                                                    }
                                                }
                                                .padding(.vertical, 14)
                                                .padding(.horizontal, 16)
                                                .background(selectedRange == range ? Color.blue.opacity(0.05) : Color.white)
                                            }
                                            
                                            if range != rangeOptions.last {
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

                        // Interpretation Section
                        VStack(alignment: .leading, spacing: 15) {
                            Text("INTERPRETATION:")
                                .font(.system(size: 16, weight: .bold))
                                .foregroundColor(.black)
                                
                            VStack(spacing: 0) {
                                // Table Header
                                HStack(spacing: 0) {
                                    Text("Index")
                                        .font(.system(size: 13, weight: .bold))
                                        .frame(width: 100)
                                        .padding(.vertical, 10)
                                        .background(Color.blue.opacity(0.1))
                                        .border(Color.gray.opacity(0.1), width: 0.5)
                                    
                                    Text("Risk Classification")
                                        .font(.system(size: 13, weight: .bold))
                                        .frame(maxWidth: .infinity)
                                        .padding(.vertical, 10)
                                        .background(Color.blue.opacity(0.1))
                                        .border(Color.gray.opacity(0.1), width: 0.5)
                                }
                                
                                // Table Rows
                                interpretationTableRow(label: "< 5%", text: "Low Risk", color: .green)
                                interpretationTableRow(label: "5-9%", text: "Intermediate Risk", color: .orange)
                                interpretationTableRow(label: "≥ 10%", text: "High Risk", color: .red)
                            }
                            .cornerRadius(8)
                            .overlay(RoundedRectangle(cornerRadius: 8).stroke(Color.gray.opacity(0.15), lineWidth: 1))
                        }
                                                                .padding(.horizontal, 24)

                        // Result Card
                        VStack(alignment: .leading, spacing: 12) {
                            Text("RESULT")
                                .font(.system(size: 16, weight: .bold))
                                .foregroundColor(.blue)
                            
                            Text(riskCategory)
                                .font(.system(size: 18, weight: .medium))
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
                        .padding(.horizontal, 18)

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
                                .frame(maxWidth: .infinity, minHeight: 54)
                                .background(LinearGradient(colors: [Color.blue, Color.cyan], startPoint: .leading, endPoint: .trailing))
                                .cornerRadius(27)
                                .shadow(color: Color.blue.opacity(0.3), radius: 8)
                            }
                            .disabled(isSaving)
                            .padding(.horizontal, 18)
                            .padding(.top, 10)
                        }

                        Spacer(minLength: 40)
                    }
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


    
    @ViewBuilder
    func interpretationTableRow(label: String, text: String, color: Color) -> some View {
        HStack(spacing: 0) {
            Text(label)
                .font(.system(size: 13, weight: .bold))
                .foregroundColor(.black.opacity(0.8))
                .frame(width: 100, alignment: .leading)
                .padding(.leading, 12)
                .padding(.vertical, 12)
                .border(Color.gray.opacity(0.1), width: 0.5)
            
            Text(text)
                .font(.system(size: 13, weight: .medium))
                .foregroundColor(color)
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(.horizontal, 12)
                .padding(.vertical, 12)
                .border(Color.gray.opacity(0.1), width: 0.5)
        }
    }
    
    func saveAnalysis() {
        guard doctorID > 0 else { alertMessage = "Login Error: Doctor ID not found. Please log out and log in again."; showSaveAlert = true; return }
        guard let patient = patientSession.currentPatient else { alertMessage = "No Patient Selected: Please search for and select a patient before saving."; showSaveAlert = true; return }
        isSaving = true
        
        let fullReport = """
        CLINICAL ANALYSIS REPORT: GIST KI-67
        -------------------------------------------
        Patient Name: \(patient.name)
        Patient ID: \(patient.patient_id)
        
        Ki-67 INDEX RANGE: \(selectedRange)
        CLASSIFICATION: \(riskCategory)
        
        Interpretation (Based on clinical criteria):
        - 0-5%: Low proliferative index
        - 6-20%: Intermediate proliferative index
        - >20%: High proliferative index
        """
        
        let url = NetworkManager.shared.getURL(for: "add_analysis_report.php")
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")
        
        let bodyParameters = [
            "doctor_id": "\(doctorID)",
            "patient_id": patient.patient_id,
            "tissue_type": "GIT",
            "marker": "GIST Ki-67",
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

struct GIST_KI67Screen_Previews: PreviewProvider {
    static var previews: some View {
        NavigationStack {
            GIST_KI67Screen()
        }
    }
}
