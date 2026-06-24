import SwiftUI

struct HeadNeckScreen: View {
    @StateObject private var navManager = AppNavigation.shared
    
    var body: some View {
        VStack(spacing: 0) {
            StandardHeader(title: "Head & Neck")

            ScrollView(showsIndicators: false) {
                VStack(spacing: 16) {
                    SelectionOptionButton(
                        title: "P16",
                        subtitle: "Surrogate for Transcriptionally Active High-Risk HPV",
                        icon: "bolt.heart.fill"
                    ) {
                        navManager.navigate(to: .p16)
                    }

                    SelectionOptionButton(
                        title: "HER-2",
                        subtitle: "Human Epidermal Growth Factor Receptor 2",
                        icon: "cross.case.fill"
                    ) {
                        navManager.navigate(to: .headNeckHER2)
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

struct HeadNeckScreen_Previews: PreviewProvider {
    static var previews: some View {
        NavigationStack {
            HeadNeckScreen()
        }
    }
}
