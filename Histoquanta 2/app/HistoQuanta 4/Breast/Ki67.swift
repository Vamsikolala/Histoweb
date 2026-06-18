import SwiftUI

struct Ki67: View {
    @StateObject private var navManager = AppNavigation.shared
    @StateObject private var patientSession = PatientSessionManager.shared
    @AppStorage("doctor_id") private var doctorID: Int = 0
    
    @State private var selectedRange: String = "Select range"
    @State private var isExpanded = false
    @State private var isSaving = false
    @State private var showSaveAlert = false
    @State private var showSavedToast = false
    @State private var alertMessage = ""

    let ranges = [
        "0–5%", "6–10%", "11–15%", "16–20%", 
        "21–30%", "31–40%", "41–50%", "51–60%", 
        "61–70%", "71–80%", "81–90%", "91–100%"
    ]

    var inferenceResult: String {
        guard selectedRange != "Select range" else { return "" }
        if selectedRange == "0–5%" || selectedRange == "6–10%" {
            return "low"
        } else if selectedRange == "11–15%" || selectedRange == "16–20%" || selectedRange == "21–30%" {
            return "intermediate"
        } else {
            return "high"
        }
    }

    var body: some View {
        ZStack {
            // Restore light background
            Color(red: 245/255, green: 248/255, blue: 252/255)
                .ignoresSafeArea()

            VStack(spacing: 0) {
                // Restore Standard Header
                StandardHeader(title: "Breast - KI67")
                
                ScrollView(showsIndicators: false) {
                    VStack(alignment: .leading, spacing: 20) {
                        
                        // Custom Light-Themed Dropdown
                        VStack(alignment: .leading, spacing: 0) {
                            Text("Select Range below:")
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
                                            .foregroundColor(selectedRange == "Select range" ? .gray : .black)
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
                                        ScrollView {
                                            VStack(spacing: 0) {
                                                ForEach(ranges, id: \.self) { range in
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
                                                    
                                                    if range != ranges.last {
                                                        Divider().padding(.horizontal, 16)
                                                    }
                                                }
                                            }
                                        }
                                        .frame(maxHeight: 300)
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
                        .padding(.top, 20)
                        .zIndex(10)
                        
                        // Inference Legend Card (Light Theme)
                        VStack(alignment: .leading, spacing: 15) {
                            Text("INFERENCE:")
                                .font(.system(size: 18, weight: .bold))
                                .foregroundColor(.black)
                            
                            VStack(alignment: .leading, spacing: 12) {
                                inferenceRow(text: "< 10%  →  low")
                                inferenceRow(text: "10–30% →  intermediate")
                                inferenceRow(text: "> 30%  →  high")
                            }
                            
                            if selectedRange != "Select range" {
                                Divider().padding(.vertical, 8)
                                HStack {
                                    Text("RESULT:")
                                        .font(.system(size: 16, weight: .bold))
                                        .foregroundColor(.blue)
                                    Text(inferenceResult.uppercased())
                                        .font(.system(size: 16, weight: .heavy))
                                        .foregroundColor(.black)
                                }
                            }
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(20)
                        .background(Color.white)
                        .cornerRadius(18)
                        .shadow(color: Color.black.opacity(0.05), radius: 8, x: 0, y: 3)
                        
                        // Save Button (Original Style)
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
                                .background(
                                    LinearGradient(
                                        colors: [Color.blue, Color.cyan],
                                        startPoint: .leading,
                                        endPoint: .trailing
                                    )
                                )
                                .cornerRadius(16)
                                .shadow(color: Color.blue.opacity(0.3), radius: 8)
                            }
                            .disabled(isSaving || selectedRange == "Select range")
                            .padding(.top, 10)
                            .padding(.bottom, 30)
                        }
                    }
                    .padding(.horizontal, 20)
                }
            }
            .ignoresSafeArea(edges: .top)
            
            if showSavedToast {
                toastView
            }
        }
        .navigationBarBackButtonHidden(true)
        .toolbar(.hidden, for: .navigationBar)
        .alert("Status", isPresented: $showSaveAlert) {
            Button("OK", role: .cancel) { }
        } message: {
            Text(alertMessage)
        }
    }

    @ViewBuilder
    func inferenceRow(text: String) -> some View {
        HStack(spacing: 12) {
            Circle()
                .fill(Color.blue.opacity(0.6))
                .frame(width: 8, height: 8)
            Text(text)
                .font(.system(size: 16, weight: .medium))
                .foregroundColor(.black.opacity(0.8))
        }
    }

    var toastView: some View {
        VStack {
            Spacer()
            HStack {
                Image(systemName: "checkmark.circle.fill")
                Text("Report Saved Successfully")
            }
            .font(.system(size: 15, weight: .bold))
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

    func saveAnalysis() {
        guard let patient = patientSession.currentPatient, doctorID > 0 else {
            alertMessage = "Please select a patient first"
            showSaveAlert = true
            return
        }
        
        isSaving = true
        
        let reportDetails = """
        BREAST KI67 ANALYSIS REPORT
        -------------------------------------------
        Range: \(selectedRange)
        Inference: \(inferenceResult)
        """
        
        let url = NetworkManager.shared.getURL(for: "add_analysis_report.php")
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")
        
        let bodyParameters = [
            "doctor_id": "\(doctorID)",
            "patient_id": patient.patient_id,
            "tissue_type": "Breast",
            "marker": "Ki-67",
            "total_score": selectedRange,
            "inference": reportDetails
        ]
        
        let bodyString = bodyParameters.map { "\($0.key)=\($0.value.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? "")" }.joined(separator: "&")
        request.httpBody = bodyString.data(using: .utf8)
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            DispatchQueue.main.async {
                isSaving = false
                if let error = error {
                    alertMessage = "Error: \(error.localizedDescription)"
                    showSaveAlert = true
                } else {
                    withAnimation {
                        showSavedToast = true
                    }
                    DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
                        withAnimation {
                            showSavedToast = false
                            navManager.navigateBack()
                        }
                    }
                }
            }
        }.resume()
    }
}

#Preview {
    Ki67()
}
