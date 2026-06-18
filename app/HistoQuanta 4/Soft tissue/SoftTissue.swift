import SwiftUI

struct SoftTissue: View {
    @StateObject private var navManager = AppNavigation.shared
    @StateObject private var patientSession = PatientSessionManager.shared
    @AppStorage("doctor_id") private var doctorID: Int = 0
    
    @State private var selectedRange = "0 to 9%"
    @State private var isExpanded = false
    @State private var isSaving = false
    @State private var showSaveAlert = false
    @State private var showSavedToast = false
    @State private var alertMessage = ""

    let rangeOptions = [
        "0 to 9%",
        "10–29%",
        ">30%"
    ]

    var grading: String {
        switch selectedRange {
        case "0 to 9%": return "Grade 1"
        case "10–29%": return "Grade 2"
        case ">30%": return "Grade 3"
        default: return "Grade 1"
        }
    }
    
    var resultDescription: String {
        switch grading {
        case "Grade 1":
            return "Low proliferative activity.\nFavorable prognosis — wide excision often curative."
        case "Grade 2":
            return "Moderate proliferation.\nIntermediate risk — consider adjuvant RT in high-risk cases."
        case "Grade 3":
            return "High proliferative index.\nAggressive behavior — urgent multidisciplinary review; neoadjuvant therapy often indicated."
        default:
            return ""
        }
    }
    
    var inferenceColor: Color {
        switch grading {
        case "Grade 1": return .green
        case "Grade 2": return .orange
        case "Grade 3": return .red
        default: return .gray
        }
    }

    var body: some View {
        ZStack {
            VStack(spacing: 0) {
                StandardHeader(title: "Soft Tissue")

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
                        .padding(.top, 10)
                        
                        // Inferences Legend
                        VStack(alignment: .leading, spacing: 12) {
                            Text("INFERENCES:")
                                .font(.system(size: 16, weight: .bold))
                                .foregroundColor(.black)
                            
                            VStack(alignment: .leading, spacing: 8) {
                                Text("0 to 9% → Grade 1")
                                Text("10–29% → Grade 2")
                                Text(">30% → Grade 3")
                            }
                            .font(.system(size: 15, weight: .medium))
                            .foregroundColor(.black.opacity(0.8))
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(.horizontal, 20)

                        // Result Box
                        VStack(alignment: .leading, spacing: 12) {
                            Text("RESULT")
                                .font(.system(size: 16, weight: .bold))
                                .foregroundColor(.purple)
                            
                            VStack(alignment: .leading, spacing: 6) {
                                Text(grading)
                                    .font(.system(size: 18, weight: .bold))
                                
                                Text(resultDescription)
                                    .font(.system(size: 16))
                                    .lineSpacing(4)
                            }
                            .foregroundColor(.black.opacity(0.8))
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


    
    @ViewBuilder
    func guidelineTableRow(label: String, text: String, color: Color) -> some View {
        HStack(spacing: 0) {
            Text(label)
                .font(.system(size: 13, weight: .bold))
                .foregroundColor(color)
                .frame(width: 80, alignment: .leading)
                .padding(.leading, 12)
                .padding(.vertical, 12)
                .border(Color.gray.opacity(0.1), width: 0.5)
            
            Text(text)
                .font(.system(size: 13))
                .foregroundColor(.black.opacity(0.7))
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
        
        let reportType = "Soft Tissue - Ki-67 Analysis"
        let diagnosisText = "Ki-67: \(grading)"
        let fullReport = """
        CLINICAL ANALYSIS REPORT: SOFT TISSUE KI-67
        -------------------------------------------
        Patient Name: \(patient.name)
        Patient ID: \(patient.patient_id)
        
        SELECTED RANGE: \(selectedRange)
        WHO GRADE equivalent: \(grading)
        
        Interpretation: \(resultDescription.replacingOccurrences(of: "\n", with: " "))
        """
        
        
        let url = NetworkManager.shared.getURL(for: "add_analysis_report.php")
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")
        
        let bodyParameters = [
            "doctor_id": "\(doctorID)",
            "patient_id": patient.patient_id,
            "tissue_type": "Soft Tissue",
            "marker": "Ki-67",
            "total_score": "\(selectedRange)",
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

struct SoftTissueKi67_Previews: PreviewProvider {
    static var previews: some View {
        NavigationStack {
            SoftTissue()
        }
    }
}
