import SwiftUI

struct AboutView: View {
    @StateObject private var navManager = AppNavigation.shared

    var body: some View {
        VStack(spacing: 0) {
            StandardHeader(title: "About")

            ScrollView {
                VStack(alignment: .center, spacing: 20) {
                    Image("histoquanta_full_logo")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 220, height: 220)
                        .padding(.top, 40)
                    
                    Text("AI-Powered Cancer Detection for Pathologists")
                        .font(.headline)
                        .foregroundColor(.gray)
                        .multilineTextAlignment(.center)

                    VStack(alignment: .leading, spacing: 20) {
                        Text("Histoquanta is an innovative medical diagnostic tool designed for doctors and pathologists in India, especially Tamil Nadu. It enables early and accurate cancer detection by analyzing histopathological inputs provided by medical professionals.")
                        
                        Text("Using advanced mathematical algorithms and machine learning, Histoquanta generates comprehensive diagnostic reports — helping save critical time and improve patient outcomes.")
                        
                        Text("Developed with a mission to support accessible, affordable, and precise cancer diagnosis across tier-2 and tier-3 healthcare centers.")
                    }
                    .font(.body)
                    .lineSpacing(6)
                    .padding()
                    .background(Color.white)
                    .cornerRadius(16)
                    .shadow(color: Color.black.opacity(0.05), radius: 10, x: 0, y: 4)
                    
                    Spacer()
                    
                    VStack(spacing: 4) {
                        Text("Developed by")
                            .font(.caption)
                            .foregroundColor(.gray)
                        Text("Histoquanta Labs Pvt. Ltd.")
                            .font(.subheadline)
                            .fontWeight(.bold)
                            .foregroundColor(.blue)
                        Text("Chennai, Tamil Nadu, India")
                            .font(.caption)
                            .foregroundColor(.gray)
                    }
                    .padding(.bottom, 20)
                }
                .padding(24)
            }
        }
        .ignoresSafeArea(edges: .top)
        .background(Color(red: 245/255, green: 248/255, blue: 252/255).ignoresSafeArea())
        .navigationBarBackButtonHidden(true)
        .toolbar(.hidden, for: .navigationBar)
    }
}

#Preview {
    NavigationStack {
        AboutView()
    }
}
