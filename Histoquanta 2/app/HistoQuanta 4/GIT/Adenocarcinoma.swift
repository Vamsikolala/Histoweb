import SwiftUI

struct Adenocarcinoma: View {
    @StateObject private var navManager = AppNavigation.shared
    
    var body: some View {
        VStack(spacing: 0) {
            StandardHeader(title: "Adenocarcinoma")

            ScrollView(showsIndicators: false) {
                VStack(spacing: 16) {
                    SelectionOptionButton(
                        title: "HER2 - Surgical Specimen",
                        subtitle: "Evaluate Surgical Sample",
                        icon: "cross.case.fill"
                    ) {
                        navManager.navigate(to: .gitAdenocarcinomaSurgical)
                    }

                    SelectionOptionButton(
                        title: "HER2 - Biopsy Specimen",
                        subtitle: "Evaluate Biopsy Sample",
                        icon: "eyedropper.halffull"
                    ) {
                        navManager.navigate(to: .gitAdenocarcinomaBiopsy)
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

struct Adenocarcinoma_Previews: PreviewProvider {
    static var previews: some View {
        NavigationStack {
            Adenocarcinoma()
        }
    }
}
