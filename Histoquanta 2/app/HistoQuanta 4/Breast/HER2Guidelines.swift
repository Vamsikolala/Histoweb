import SwiftUI

struct HER2Guidelines: View {
    @StateObject private var navManager = AppNavigation.shared

    let categoryWidth: CGFloat = 160
    let criteriaWidth: CGFloat = 360
    let headerHeight: CGFloat = 60

    var body: some View {
        VStack(spacing: 0) {
            StandardHeader(title: "Guidelines")

            ScrollView([.horizontal, .vertical], showsIndicators: false) {
                VStack(spacing: 0) {
                    // Header Row
                    HStack(spacing: 0) {
                        tableHeaderCell("Result Category", width: categoryWidth, height: headerHeight)
                        tableHeaderCell("Criteria", width: criteriaWidth, height: headerHeight)
                    }

                    // Positive Row
                    guidelineRow(
                        category: "Positive (Score 3+)",
                        criteria: "Complete membrane staining that is intense and in >10% of tumor cells*"
                    )

                    // Equivocal Row
                    guidelineRow(
                        category: "Equivocal (Score 2+)",
                        criteria: """
                        Weak to moderate complete membrane staining in >10% of tumor cells
                        or
                        Complete membrane staining that is intense but within ≤10% of tumor cells*
                        """
                    )

                    // Negative Row 1+
                    guidelineRow(
                        category: "Negative (Score 1+)",
                        criteria: "Incomplete membrane staining that is faint/barely perceptible and within >10% of tumor cells"
                    )

                    // Negative Row 0
                    guidelineRow(
                        category: "Negative (Score 0 or 0+)",
                        criteria: """
                        No staining observed (0/absent membrane staining)
                        or
                        Membrane staining that is incomplete and is faint/barely perceptible and within ≤10% of tumor cells (0+/with membrane staining)
                        """
                    )
                }
                .background(Color.white)
                .cornerRadius(12)
                .overlay(
                    RoundedRectangle(cornerRadius: 12)
                        .stroke(Color.gray.opacity(0.18), lineWidth: 1)
                )
                .padding(.horizontal, 18)
                .padding(.vertical, 18)
            }
            
            VStack(alignment: .leading, spacing: 8) {
                Text("* Readily appreciated using a low-power objective and observed within a homogeneous and contiguous population of invasive tumor cells.")
                    .font(.system(size: 11))
                    .foregroundColor(.gray)
                    .italic()
            }
            .padding(.horizontal, 22)
            .padding(.bottom, 20)
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



    @ViewBuilder
    func tableHeaderCell(_ text: String, width: CGFloat, height: CGFloat) -> some View {
        Text(text)
            .font(.system(size: 15, weight: .bold))
            .foregroundColor(.black)
            .multilineTextAlignment(.center)
            .frame(width: width, height: height)
            .background(Color.blue.opacity(0.08))
            .border(Color.gray.opacity(0.2), width: 0.5)
    }

    @ViewBuilder
    func guidelineRow(category: String, criteria: String) -> some View {
        HStack(spacing: 0) {
            tableRowCell(category, width: categoryWidth, isBold: true)
            tableRowCell(criteria, width: criteriaWidth, isBold: false)
        }
    }

    @ViewBuilder
    func tableRowCell(_ text: String, width: CGFloat, isBold: Bool) -> some View {
        Text(text)
            .font(.system(size: 13, weight: isBold ? .bold : .regular))
            .foregroundColor(.black)
            .multilineTextAlignment(.leading)
            .frame(width: width, alignment: .topLeading)
            .padding(12)
            .border(Color.gray.opacity(0.15), width: 0.5)
    }
}

#Preview {
    NavigationStack {
        HER2Guidelines()
    }
}
