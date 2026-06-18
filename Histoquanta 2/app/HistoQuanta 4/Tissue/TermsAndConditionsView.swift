import SwiftUI

struct TermsAndConditionsView: View {
    @StateObject private var navManager = AppNavigation.shared

    var body: some View {
        VStack(spacing: 0) {
            StandardHeader(title: "Terms & Conditions")

            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    Text("Terms & Conditions")
                        .font(.system(size: 28, weight: .bold))
                        .foregroundColor(.blue)
                        .padding(.top, 20)
                    
                    Text("Effective Date: 10 November 2025")
                        .font(.subheadline)
                        .foregroundColor(.gray)

                    VStack(alignment: .leading, spacing: 24) {
                        conditionSection(title: "1. Acceptance", content: "By using Histoquanta, you (a licensed medical practitioner in India) agree to these terms.")
                        
                        conditionSection(title: "2. Purpose", content: "Histoquanta is a decision-support tool only. It does NOT replace clinical judgment. Final diagnosis rests with the physician.")
                        
                        conditionSection(title: "3. Medical Responsibility", content: "• You confirm all inputs are from verified histopathology slides.\n• You are solely responsible for patient diagnosis and treatment.\n• Histoquanta Labs is not liable for clinical outcomes.")
                        
                        conditionSection(title: "4. Intellectual Property", content: "All algorithms, reports, and UI are © Histoquanta Labs. Reverse engineering is prohibited.")
                        
                        conditionSection(title: "5. Data Usage", content: "Anonymized aggregate data may be used for:\n• Research publications (IRB-approved)\n• Public health dashboards (Tamil Nadu Cancer Registry collaboration)")
                        
                        conditionSection(title: "6. Termination", content: "We may suspend access for misuse (e.g., fake inputs, unauthorized sharing).")
                        
                        conditionSection(title: "7. Governing Law", content: "These terms are governed by the laws of India. Disputes subject to Chennai jurisdiction.")
                        
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Contact: legal@histoquanta.in")
                                .font(.system(size: 16, weight: .semibold))
                                .foregroundColor(.blue)
                        }
                        .padding(.top, 10)
                    }
                    .font(.body)
                    .lineSpacing(6)
                    
                    Spacer()
                }
                .padding(.horizontal, 24)
            }
        }
        .ignoresSafeArea(edges: .top)
        .background(Color(red: 245/255, green: 248/255, blue: 252/255).ignoresSafeArea())
        .navigationBarBackButtonHidden(true)
        .toolbar(.hidden, for: .navigationBar)
    }

    @ViewBuilder
    func conditionSection(title: String, content: String) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(title)
                .font(.system(size: 18, weight: .bold))
                .foregroundColor(.black)
            Text(content)
                .font(.system(size: 15))
                .foregroundColor(.gray.opacity(0.9))
        }
    }
}

#Preview {
    NavigationStack {
        TermsAndConditionsView()
    }
}
