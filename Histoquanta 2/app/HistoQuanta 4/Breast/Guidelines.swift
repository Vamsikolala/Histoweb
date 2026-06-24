import SwiftUI

struct Guidelines: View {
    @StateObject private var navManager = AppNavigation.shared

    let categoryWidth: CGFloat = 130
    let criteriaWidth: CGFloat = 170
    let commentsWidth: CGFloat = 360
    let headerHeight: CGFloat = 60

    var body: some View {
        VStack(spacing: 0) {
            StandardHeader(title: "Guidelines")

            ScrollView([.horizontal, .vertical], showsIndicators: false) {
                VStack(spacing: 0) {
                    // Header Row
                    HStack(spacing: 0) {
                        tableHeaderCell("ER Result Category", width: categoryWidth)
                        tableHeaderCell("Criteria", width: criteriaWidth)
                        tableHeaderCell("Comments", width: commentsWidth)
                    }
                    
                    // Table Content
                    guidelineRow(
                        category: "Positive",
                        criteria: "≥ 1% of tumor cell nuclei immunoreactive",
                        comments: "Include in report the overall percent cancer cells staining as a range or specific number. Intensity of staining is reported semi-quantitatively as an average (1+, 2+, or 3+)."
                    )

                    guidelineRow(
                        category: "Low Positive",
                        criteria: "1–10% of tumor cell nuclei are immunoreactive",
                        comments: "The following report comment is recommended and is available to add in standardized form in the ‘Comments on ER Results’ section. The cancer in this sample has a low level (1–10%) of ER expression by IHC. There are limited data on the overall benefit of endocrine therapies for patients with low level (1–10%) ER expression, but they suggest possible benefit, and patients are considered eligible for endocrine treatment. These data suggest behavior may be heterogeneous in both biology and response and can resemble ER-negative cancers. The Low Positive interpretation applies only to invasive carcinoma and is not required for Progesterone receptor or DCIS."
                    )

                    guidelineRow(
                        category: "Negative",
                        criteria: "< 1% of tumor cell nuclei immunoreactive",
                        comments: "Include the status of internal controls in report. If internal controls are absent but external controls stain appropriately, include recommended comment: ‘No interpretable positivity for ER is present, but external controls are appropriately positive. If only negative results are seen, then a specimen containing internal controls may be warranted for confirmation of ER status.’"
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
            
            Spacer()
        }
        .ignoresSafeArea(edges: .top)
        .background(Color.white.ignoresSafeArea())
        .navigationBarBackButtonHidden(true)
        .toolbar(.hidden, for: .navigationBar)
    }



    @ViewBuilder
    func tableHeaderCell(_ text: String, width: CGFloat) -> some View {
        Text(text)
            .font(.system(size: 15, weight: .bold))
            .foregroundColor(.black)
            .multilineTextAlignment(.center)
            .frame(width: width, height: 60)
            .background(Color.blue.opacity(0.12))
            .border(Color.gray.opacity(0.2), width: 0.5)
    }

    @ViewBuilder
    func guidelineRow(category: String, criteria: String, comments: String) -> some View {
        HStack(spacing: 0) {
            tableCell(category, width: categoryWidth, isBold: true)
            tableCell(criteria, width: criteriaWidth, isBold: false)
            tableCell(comments, width: commentsWidth, isBold: false)
        }
    }

    @ViewBuilder
    func tableCell(_ text: String, width: CGFloat, isBold: Bool) -> some View {
        Text(text)
            .font(.system(size: 13, weight: isBold ? .bold : .regular))
            .foregroundColor(.black)
            .multilineTextAlignment(.leading)
            .frame(width: width, alignment: .topLeading)
            .padding(12)
            .border(Color.gray.opacity(0.15), width: 0.5)
            .fixedSize(horizontal: false, vertical: true)
    }
}

struct Guidelines_Previews: PreviewProvider {
    static var previews: some View {
        NavigationStack {
            Guidelines()
        }
    }
}
