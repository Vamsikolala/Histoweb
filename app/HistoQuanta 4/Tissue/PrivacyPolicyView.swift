import SwiftUI

struct PrivacyPolicyView: View {
    @StateObject private var navManager = AppNavigation.shared

    var body: some View {
        VStack(spacing: 0) {
            StandardHeader(title: "Privacy Policy")

            ScrollView {
                VStack(alignment: .leading, spacing: 20) {
                    Text("Histoquanta Privacy Policy")
                        .font(.system(size: 28, weight: .bold))
                        .foregroundColor(.blue)
                        .padding(.top, 20)
                    
                    Text("Last Updated: 10 November 2025")
                        .font(.subheadline)
                        .foregroundColor(.gray)

                    VStack(alignment: .leading, spacing: 24) {
                        policySection(title: "1. Introduction", content: "Histoquanta (we, us) respects your privacy. This policy explains how we collect, use, and protect data when you use our cancer detection application.")
                        
                        policySection(title: "2. Information We Collect", content: "•Medical Inputs: Histopathological image metadata, doctor annotations, slide identifiers (NO patient names or identifiers unless anonymized and consented).\n•Device Info: App version, OS, diagnostic session timestamps (for service improvement).")
                        
                        policySection(title: "3. Purpose of Use", content: "• Perform mathematical analysis for cancer probability scoring.\n• Generate diagnostic reports for the submitting physician.\n• Improve algorithm accuracy (using anonymized, aggregated data only).")
                            
                        policySection(title: "4. Data Security", content: "• All data is encrypted in transit (TLS 1.3+) and at rest.\n• Servers hosted in India (Mumbai AWS Region).\n• No data is shared with third parties without explicit consent.")
                        
                        policySection(title: "5. Compliance", content: "Aligned with:\n• Digital Information Security in Healthcare Act (DISHA) Draft\n• Indian Medical Council (Professional Conduct) Regulations\n• GDPR (for EU collaborators)")
                        
                        policySection(title: "6. Your Rights", content: "You may request data deletion or export via email: privacy@histoquanta.in")
                        
                        VStack(alignment: .leading, spacing: 8) {
                            Text("Contact: Data Protection Officer")
                                .font(.system(size: 16, weight: .semibold))
                            Text("Histoquanta Labs, Chennai - 600001")
                                .font(.system(size: 14))
                                .foregroundColor(.gray)
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
    func policySection(title: String, content: String) -> some View {
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
        PrivacyPolicyView()
    }
}
