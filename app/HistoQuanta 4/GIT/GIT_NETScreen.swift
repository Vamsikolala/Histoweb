import SwiftUI

struct GIT_NETScreen: View {
    @StateObject private var navManager = AppNavigation.shared
    
    let buttons = [
        ("Stomach", "Gastric Analysis", "stethoscope"),           // Using stethoscope as a reliable medical icon for gastric analysis
        ("Duodenum and ampulla", "Small Intestine Analysis", "pills.fill"),
        ("Jejunum and ileum", "Mid-intestine Analysis", "testtube.2"),
        ("Colon", "Large Intestine", "cross.vial.fill"),
        ("Appendix", "Appendiceal Analysis", "staroflife.fill"),
        ("Pancreas", "Pancreatic Study", "bandage.fill"),
        ("Ki-67", "Cell Proliferation", "waveform.path.ecg")
    ]

    var body: some View {
        VStack(spacing: 0) {
            StandardHeader(title: "GIT - NET")

            ScrollView(showsIndicators: false) {
                VStack(spacing: 16) {
                    ForEach(buttons.indices, id: \.self) { index in
                        SelectionOptionButton(
                            title: buttons[index].0,
                            subtitle: buttons[index].1,
                            icon: buttons[index].2
                        ) {
                            if buttons[index].0 == "Stomach" {
                                navManager.navigate(to: .gitNETStomach)
                            } else {
                                navManager.navigate(to: .gitNETGrading)
                            }
                        }
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

struct GIT_NETScreen_Previews: PreviewProvider {
    static var previews: some View {
        NavigationStack {
            GIT_NETScreen()
        }
    }
}
