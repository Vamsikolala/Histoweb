import SwiftUI

struct SplashView: View {
    @State private var isActive = false
    @State private var scale: CGFloat = 0.7
    @State private var opacity = 0.5
    @AppStorage("doctor_id") private var doctorID: Int = 0

    var body: some View {
        if isActive {
            DoctorLoginView()
        } else {
            ZStack {
                LinearGradient(
                    colors: [Color.blue, Color.cyan],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
                .ignoresSafeArea()

                VStack(spacing: 24) {
                    

                    Text("HistoQuanta")
                        .font(.system(size: 36, weight: .bold))
                        .foregroundColor(.white)
                        .accessibilityIdentifier("splash-title")

                    Text("Standardized Microscopy Analysis")
                        .font(.system(size: 16))
                        .foregroundColor(.white.opacity(0.85))
                        .accessibilityIdentifier("splash-subtitle")
                }
                .scaleEffect(scale)
                .opacity(opacity)
                .onAppear {
                    // Force logout on every app startup — always require login
                    doctorID = 0
                    withAnimation(.easeIn(duration: 1.2)) {
                        scale = 1.0
                        opacity = 1.0
                    }

                    // Navigate after delay
                    DispatchQueue.main.asyncAfter(deadline: .now() + 2.5) {
                        withAnimation {
                            isActive = true
                        }
                    }
                }
            }
        }
    }
}

#Preview {
    SplashView()
}
