import SwiftUI

struct GITScreen: View {
    @StateObject private var navManager = AppNavigation.shared
    
    var body: some View {
        VStack(spacing: 0) {
            StandardHeader(title: "GIT")

            ScrollView(showsIndicators: false) {
                VStack(spacing: 16) {
                    SelectionOptionButton(
                        title: "Adenocarcinoma",
                        subtitle: "Glandular Tissue Cancer",
                        icon: "drop.fill"
                    ) {
                        navManager.navigate(to: .gitAdenocarcinoma)
                    }

                    SelectionOptionButton(
                        title: "NET",
                        subtitle: "Neuroendocrine Tumour",
                        icon: "brain.head.profile"
                    ) {
                        navManager.navigate(to: .gitNET)
                    }

                    SelectionOptionButton(
                        title: "GIST",
                        subtitle: "Gastrointestinal Stromal Tumour",
                        icon: "cross.case.fill"
                    ) {
                        navManager.navigate(to: .gitGIST)
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

struct SelectionOptionButton: View {
    let title: String
    let subtitle: String
    let icon: String
    var action: () -> Void

    var body: some View {
        Button(action: action) {
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
                        .multilineTextAlignment(.leading)

                    if !subtitle.isEmpty {
                        Text(subtitle)
                            .font(.system(size: 13))
                            .foregroundColor(.gray)
                            .multilineTextAlignment(.leading)
                    }
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
}

struct GITScreen_Previews: PreviewProvider {
    static var previews: some View {
        NavigationStack {
            GITScreen()
        }
    }
}
