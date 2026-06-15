import SwiftUI

struct Breasttypes: View {
    @StateObject private var navManager = AppNavigation.shared
    
    var body: some View {
        VStack(spacing: 0) {
            StandardHeader(title: "Breast")

            ScrollView(showsIndicators: false) {
                VStack(spacing: 16) {
                    Button(action: { navManager.navigate(to: .er) }) {
                        BreastOptionButton(
                            title: "ER",
                            subtitle: "Estrogen Receptor",
                            icon: "drop.fill"
                        )
                    }

                    Button(action: { navManager.navigate(to: .pr) }) {
                        BreastOptionButton(
                            title: "PR",
                            subtitle: "Progesterone Receptor",
                            icon: "circle.hexagongrid.fill"
                        )
                    }

                    Button(action: { navManager.navigate(to: .breastHER2) }) {
                        BreastOptionButton(
                            title: "HER2",
                            subtitle: "Growth Factor Receptor",
                            icon: "cross.case.fill"
                        )
                    }

                    Button(action: { navManager.navigate(to: .ki67) }) {
                        BreastOptionButton(
                            title: "Ki67",
                            subtitle: "Cell Proliferation Marker",
                            icon: "waveform.path.ecg"
                        )
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
        .navigationBarBackButtonHidden(true)
        .toolbar(.hidden, for: .navigationBar)
    }


}

struct BreastOptionButton: View {
    let title: String
    let subtitle: String
    let icon: String

    var body: some View {
        HStack(spacing: 14) {
            ZStack {
                Circle()
                    .fill(Color.blue.opacity(0.12))
                    .frame(width: 50, height: 50)

                Image(systemName: icon)
                    .font(.system(size: 20))
                    .foregroundColor(.blue)
            }

            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(.system(size: 18, weight: .bold))
                    .foregroundColor(.black)

                Text(subtitle)
                    .font(.system(size: 13))
                    .foregroundColor(.gray)
                    .multilineTextAlignment(.leading)
            }

            Spacer()

            Image(systemName: "chevron.right")
                .foregroundColor(.gray)
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(18)
        .shadow(color: Color.black.opacity(0.05), radius: 8, x: 0, y: 3)
    }
}

#Preview {
    NavigationStack {
        Breasttypes()
    }
}
