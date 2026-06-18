import SwiftUI

struct ThyroidKi67: View {
    @StateObject private var navManager = AppNavigation.shared
    @StateObject private var patientSession = PatientSessionManager.shared
    @AppStorage("doctor_id") private var doctorID: Int = 0
    
    @State private var selectedRange: String = "<3%"
    @State private var isExpanded = false
    @State private var isSaving = false
    @State private var showSaveAlert = false
    @State private var showSavedToast = false
    @State private var alertMessage = ""

    let ranges = ["<3%", "≥3% to <5%", "≥5%"]

    var resultTitle: String {
        switch selectedRange {
        case "<3%":
            return "Low proliferative activity."
        case "≥3% to <5%":
            return "Mild-moderate proliferation."
        case "≥5%":
            return "High proliferative index."
        default:
            return ""
        }
    }

    var resultDescription: String {
        switch selectedRange {
        case "<3%":
            return "Benign or indolent behavior likely (e.g., classic PTC, NIFTP)."
        case "≥3% to <5%":
            return "Correlate with histomorphology (e.g., follicular variant PTC)."
        case "≥5%":
            return "Suggestive of:\n• Hobnail/micropapillary variant PTC\n• Follicular Thyroid carcinoma"
        default:
            return ""
        }
    }

    var body: some View {
        ZStack {
            // Original light background
            Color(red: 245/255, green: 248/255, blue: 252/255)
                .ignoresSafeArea()

            VStack(spacing: 0) {
                StandardHeader(title: "Thyroid Analysis")
                
                ScrollView(showsIndicators: false) {
                    VStack(alignment: .leading, spacing: 20) {
                        
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
                        
                        // Inferences Section
                        VStack(alignment: .leading, spacing: 15) {
                            Text("INFERENCES:")
                                .font(.system(size: 18, weight: .bold))
                                .foregroundColor(.black)
                            
                            VStack(alignment: .leading, spacing: 12) {
                                inferenceItem(title: ">5%", items: [
                                    "1. Hobnail variant of papillary Thyroid carcinoma.",
                                    "2. Follicular Thyroid carcinoma"
                                ])
                                
                                inferenceItem(title: ">10%", items: [
                                    "1. Poorly differentiated Thyroid carcinoma",
                                    "2. Anaplastic carcinoma"
                                ])
                            }
                        }
                        .padding(20)
                        .background(Color.white)
                        .cornerRadius(18)
                        .shadow(color: Color.black.opacity(0.05), radius: 8, x: 0, y: 3)
                        
                        // Result Card
                        VStack(alignment: .leading, spacing: 12) {
                            Text("RESULT")
                                .font(.system(size: 16, weight: .bold))
                                .foregroundColor(.blue)
                            
                            Text(resultTitle)
                                .font(.system(size: 16, weight: .semibold))
                                .foregroundColor(.black)
                            
                            Text(resultDescription)
                                .font(.system(size: 15))
                                .foregroundColor(.black.opacity(0.7))
                            
                            if selectedRange == "≥5%" {
                                HStack(alignment: .top, spacing: 8) {
                                    Image(systemName: "exclamationmark.triangle.fill")
                                        .foregroundColor(.orange)
                                    
                                    VStack(alignment: .leading, spacing: 4) {
                                        Text("If >10%, strongly consider:")
                                            .font(.system(size: 15, weight: .semibold))
                                            .foregroundColor(.black)
                                        Text("• Poorly differentiated Thyroid carcinoma\n• Anaplastic Thyroid carcinoma")
                                            .font(.system(size: 14))
                                            .foregroundColor(.black.opacity(0.7))
                                    }
                                }
                                .padding(.top, 8)
                            }
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding(20)
                        .background(Color.white)
                        .cornerRadius(18)
                        .overlay(
                            RoundedRectangle(cornerRadius: 18)
                                .stroke(Color.blue.opacity(0.1), lineWidth: 1)
                        )
                        .shadow(color: Color.black.opacity(0.05), radius: 8, x: 0, y: 3)
                        
                        // Save Button
                        if patientSession.currentPatient != nil {
                            Button(action: saveAnalysis) {
                                HStack {
                                    if isSaving {
                                        ProgressView().tint(.white)
                                    } else {
                                        Image(systemName: "checkmark.circle.fill")
                                        Text("Save Report")
                                            .fontWeight(.bold)
                                    }
                                }
                                .foregroundColor(.white)
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 16)
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
                            .disabled(isSaving)
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
    func inferenceItem(title: String, items: [String]) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Circle()
                    .fill(Color.blue)
                    .frame(width: 8, height: 8)
                Text(title)
                    .font(.system(size: 16, weight: .bold))
                    .foregroundColor(.black)
            }
            
            ForEach(items, id: \.self) { item in
                Text(item)
                    .font(.system(size: 14))
                    .foregroundColor(.black.opacity(0.7))
                    .padding(.leading, 18)
            }
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
        KI67 ANALYSIS REPORT (THYROID)
        Range: \(selectedRange)
        Result: \(resultTitle)
        Description: \(resultDescription)
        """
        
        let url = NetworkManager.shared.getURL(for: "add_analysis_report.php")
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")
        
        let bodyParameters = [
            "doctor_id": "\(doctorID)",
            "patient_id": patient.patient_id,
            "tissue_type": "Thyroid",
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
