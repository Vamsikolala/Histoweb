import SwiftUI

struct GISTSelectorScreen: View {
    @StateObject private var navManager = AppNavigation.shared
    
    var body: some View {
        VStack(spacing: 0) {
            StandardHeader(title: "GIT - GIST")

            ScrollView(showsIndicators: false) {
                VStack(spacing: 16) {
                    SelectionOptionButton(
                        title: "KI67",
                        subtitle: "Cell Proliferation Marker",
                        icon: "waveform.path.ecg"
                    ) {
                        navManager.navigate(to: .gitGISTKi67)
                    }

                    SelectionOptionButton(
                        title: "KIT",
                        subtitle: "CD117 Marker Analysis",
                        icon: "magnifyingglass.circle.fill"
                    ) {
                        navManager.navigate(to: .gitGISTKit)
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

struct GISTSelectorScreen_Previews: PreviewProvider {
    static var previews: some View {
        NavigationStack {
            GISTSelectorScreen()
        }
    }
}
