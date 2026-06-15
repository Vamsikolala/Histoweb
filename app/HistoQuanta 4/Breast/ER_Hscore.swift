import SwiftUI

struct ER_Hscore: View {
    @StateObject private var navManager = AppNavigation.shared
    @StateObject private var patientSession = PatientSessionManager.shared
    
    // Incoming Allred results
    var initialIntensity: Int = 0
    var initialProportion: Int = 0
    
    // Inputs
    @State private var weakPercent: String = ""
    @State private var moderatePercent: String = ""
    @State private var strongPercent: String = ""
    
    @State private var showSaveAlert = false
    @State private var alertMessage = ""
    @State private var isSaving = false

    let column1Width: CGFloat = 130
    let column2Width: CGFloat = 150
    let column3Width: CGFloat = 90

    // Calculations
    var weakVal: Int { Int(weakPercent) ?? 0 }
    var moderateVal: Int { Int(moderatePercent) ?? 0 }
    var strongVal: Int { Int(strongPercent) ?? 0 }
    
    var totalHScore: Int {
        (1 * weakVal) + (2 * moderateVal) + (3 * strongVal)
    }
    
    var hScoreInference: String {
        if totalHScore < 10 { return "Negative" }
        else if totalHScore <= 100 { return "Weakly Positive" }
        else { return "Positive" }
    }
    
    var inferenceColor: Color {
        if totalHScore < 10 { return .red }
        else if totalHScore <= 100 { return .orange }
        else { return .green }
    }

    var body: some View {
        VStack(spacing: 0) {
            StandardHeader(title: "ER H-Score")

            ScrollView(showsIndicators: false) {
                VStack(spacing: 20) {
                    allredReferenceCard
                    
                    formulaCard
                    
                    scoringTable
                    
                    totalScoreCard
                    
                    inferenceCard
                    
                    if let patient = patientSession.currentPatient {
                        Button(action: { saveReport(for: patient) }) {
                            HStack {
                                if isSaving {
                                    ProgressView()
                                        .tint(.white)
                                } else {
                                    Image(systemName: "square.and.arrow.down")
                                }
                                Text("Save to \(patient.name)'s Report")
                                    .fontWeight(.bold)
                            }
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity, minHeight: 54)
                            .background(Color.green)
                            .cornerRadius(16)
                            .shadow(color: Color.green.opacity(0.3), radius: 8)
                        }
                        .disabled(isSaving)
                        .padding(.top, 10)
                    }
                }
                .padding(.horizontal, 18)
                .padding(.top, 18)
                .padding(.bottom, 24)
            }
        }
        .ignoresSafeArea(edges: .top)
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
        .alert("Report Status", isPresented: $showSaveAlert) {
            Button("OK", role: .cancel) { }
        } message: {
            Text(alertMessage)
        }
        .navigationBarBackButtonHidden(true)
        .toolbar(.hidden, for: .navigationBar)
        .onAppear {
            // Pre-initialize based on Allred intensity if applicable
            initializeFromAllred()
        }
    }

    private func initializeFromAllred() {
        // Logic: If Allred intensity was 1, 2, or 3, we could pre-populate that row
        // But usually H-score requires manual entry of all percentages.
        // We'll leave them empty for now so the user can be precise.
    }



    var allredReferenceCard: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                Text("Allred Reference")
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(.blue)
                
                HStack(spacing: 15) {
                    Label("Intensity: \(initialIntensity)", systemImage: "bolt.fill")
                    Label("Proportion: \(initialProportion)", systemImage: "chart.pie.fill")
                }
                .font(.system(size: 13))
                .foregroundColor(.black.opacity(0.7))
            }
            Spacer()
        }
        .padding(16)
        .background(Color.blue.opacity(0.08))
        .cornerRadius(18)
        .overlay(
            RoundedRectangle(cornerRadius: 18)
                .stroke(Color.blue.opacity(0.1), lineWidth: 1)
        )
    }

    var formulaCard: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Formula")
                .font(.system(size: 18, weight: .bold))
                .foregroundColor(.black)

            Text("% of positive cells × strength of immunoreactivity")
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(.black)

            VStack(alignment: .leading, spacing: 6) {
                HStack { Text("1 × [% Weak]"); Space() ; Text("\(1 * weakVal)") }.foregroundColor(.gray)
                HStack { Text("2 × [% Moderate]"); Space() ; Text("\(2 * moderateVal)") }.foregroundColor(.gray)
                HStack { Text("3 × [% Strong]"); Space() ; Text("\(3 * strongVal)") }.foregroundColor(.gray)
            }
            .font(.system(size: 15))
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(18)
        .background(Color.white)
        .cornerRadius(18)
        .shadow(color: Color.black.opacity(0.05), radius: 8, x: 0, y: 3)
    }

    var scoringTable: some View {
        VStack(spacing: 0) {
            HStack(spacing: 0) {
                tableHeader("Intensity", width: column1Width)
                tableHeader("% cells (0-100)", width: column2Width)
                tableHeader("Score", width: column3Width)
            }

            scoringRow(label: "Weak (1)", text: $weakPercent, score: 1 * weakVal)
            scoringRow(label: "Moderate (2)", text: $moderatePercent, score: 2 * moderateVal, isHighlighted: initialIntensity == 2)
            scoringRow(label: "Strong (3)", text: $strongPercent, score: 3 * strongVal, isHighlighted: initialIntensity == 3)
        }
        .background(Color.white)
        .cornerRadius(18)
        .overlay(
            RoundedRectangle(cornerRadius: 18)
                .stroke(Color.gray.opacity(0.18), lineWidth: 1)
        )
    }

    @ViewBuilder
    func scoringRow(label: String, text: Binding<String>, score: Int, isHighlighted: Bool = false) -> some View {
        HStack(spacing: 0) {
            tableBody(label, width: column1Width, isBold: isHighlighted)
            
            ZStack {
                TextField("Enter %", text: text)
                    .keyboardType(.numberPad)
                    .multilineTextAlignment(.center)
                    .font(.system(size: 15, weight: .medium))
                    .frame(width: column2Width, height: 48)
                    .background(isHighlighted ? Color.yellow.opacity(0.1) : Color.clear)
            }
            .border(Color.gray.opacity(0.2), width: 0.8)
            
            tableBody("\(score)", width: column3Width, color: .blue)
        }
    }

    var totalScoreCard: some View {
        HStack {
            VStack(alignment: .leading, spacing: 6) {
                Text("Total H-Score")
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(.black)

                Text("Sum of all intensity scores")
                    .font(.system(size: 14))
                    .foregroundColor(.gray)
            }

            Spacer()

            Text("\(totalHScore)")
                .font(.system(size: 32, weight: .bold))
                .foregroundColor(.blue)
                .padding(.horizontal, 10)
        }
        .padding(18)
        .background(Color.white)
        .cornerRadius(18)
        .shadow(color: Color.black.opacity(0.05), radius: 8, x: 0, y: 3)
    }

    var inferenceCard: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack {
                Text("Inference:")
                    .font(.system(size: 18, weight: .bold))
                Text(hScoreInference)
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(inferenceColor)
            }

            VStack(alignment: .leading, spacing: 6) {
                inferenceRuleRow(text: "< 10 : Negative", color: .red, active: totalHScore < 10)
                inferenceRuleRow(text: "10 – 100 : Weakly Positive", color: .orange, active: totalHScore >= 10 && totalHScore <= 100)
                inferenceRuleRow(text: "> 100 : Positive", color: .green, active: totalHScore > 100)
            }
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(18)
        .background(Color.white)
        .cornerRadius(18)
        .shadow(color: Color.black.opacity(0.05), radius: 8, x: 0, y: 3)
    }

    @ViewBuilder
    func tableHeader(_ text: String, width: CGFloat) -> some View {
        Text(text)
            .font(.system(size: 14, weight: .bold))
            .foregroundColor(.black)
            .multilineTextAlignment(.center)
            .frame(width: width, height: 50)
            .background(Color.blue.opacity(0.1))
            .border(Color.gray.opacity(0.2), width: 0.8)
    }

    @ViewBuilder
    func tableBody(_ text: String, width: CGFloat, color: Color = .black, isBold: Bool = false) -> some View {
        Text(text)
            .font(.system(size: 15, weight: isBold ? .bold : .regular))
            .foregroundColor(color)
            .multilineTextAlignment(.center)
            .frame(width: width, height: 48)
            .border(Color.gray.opacity(0.2), width: 0.8)
    }

    @ViewBuilder
    func inferenceRuleRow(text: String, color: Color, active: Bool) -> some View {
        HStack(spacing: 10) {
            Circle()
                .fill(color)
                .frame(width: 8, height: 8)
            
            Text(text)
                .font(.system(size: 14, weight: active ? .bold : .regular))
                .foregroundColor(active ? .black : .gray)
        }
    }

    @AppStorage("doctor_id") private var doctorID: Int = 0

    func saveReport(for patient: HQPatient) {
        guard doctorID > 0 else { return }
        isSaving = true
        
        // Format as a "Small Report Document"
        let reportType = "Breast - ER H-Score"
        let diagnosisText = "H-Score \(hScoreInference)"
        let notesText = "Total H-Score: \(totalHScore)"
        let fullReport = """
        CLINICAL ANALYSIS REPORT: BREAST ER (H-SCORE)
        -------------------------------------------
        Patient Name: \(patient.name)
        Patient ID: \(patient.patient_id)
        
        STAINING COMPONENTS:
        - Weak (1+): \(weakPercent.isEmpty ? "0" : weakPercent)%
        - Moderate (2+): \(moderatePercent.isEmpty ? "0" : moderatePercent)%
        - Strong (3+): \(strongPercent.isEmpty ? "0" : strongPercent)%
        
        TOTAL H-SCORE: \(totalHScore)
        INFERENCE: \(hScoreInference)
        
        Interpretation: \(totalHScore >= 10 ? "The sample shows ER reactivity. Higher H-scores (especially >100) are strongly associated with hormone therapy response." : "The sample is considered negative by H-score criteria.")
        """
        
        let url = NetworkManager.shared.getURL(for: "add_analysis_report.php")
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")
        
        let bodyParameters = [
            "doctor_id": "\(doctorID)",
            "patient_id": patient.patient_id,
            "tissue_type": "Breast",
            "marker": "ER H-Score",
            "total_score": "H-Score: \(totalHScore)",
            "inference": fullReport
        ]
        
        let bodyString = bodyParameters.map { "\($0.key)=\($0.value.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? "")" }.joined(separator: "&")
        request.httpBody = bodyString.data(using: .utf8)
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            DispatchQueue.main.async {
                isSaving = false
                if let error = error {
                    alertMessage = "Network error: \(error.localizedDescription)"
                } else if let data = data, let result = try? JSONSerialization.jsonObject(with: data) as? [String: Any] {
                    if result["status"] as? Bool == true {
                        alertMessage = "H-Score report saved successfully to patient history!"
                    } else {
                        alertMessage = "Error: \(result["message"] ?? "Unknown error")"
                    }
                } else {
                    alertMessage = "Invalid response from server"
                }
                showSaveAlert = true
            }
        }.resume()
    }
}

private func Space() -> some View {
    Spacer()
}

#Preview {
    NavigationStack {
        ER_Hscore(initialIntensity: 2, initialProportion: 3)
    }
}
