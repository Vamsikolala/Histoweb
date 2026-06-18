import SwiftUI

struct GITGuidelines: View {
    @StateObject private var navManager = AppNavigation.shared

    var body: some View {
        VStack(spacing: 0) {
            StandardHeader(title: "HER2 Reference")

            ScrollView(.vertical, showsIndicators: true) {
                VStack(spacing: 16) {
                    Text("HER2 Interpretation Guidelines (Surgical Specimen)")
                        .font(.system(size: 18, weight: .semibold))
                        .foregroundColor(.blue)
                        .padding(.top, 20)
                        .frame(maxWidth: .infinity, alignment: .leading)

                    VStack(spacing: 0) {
                        // Header Row
                        HStack(spacing: 0) {
                            tableHeaderCell("Result Category", width: 140)
                            tableHeaderCell("Criteria", width: nil)
                        }
                        .fixedSize(horizontal: false, vertical: true)
                        
                        // Rows
                        tableRow(category: "Negative (Score 0 or 0+)#", description: "No staining observed (0/absent membrane staining)\n\nor\n\nMembrane staining that is incomplete and is faint/barely perceptible and within ≤10% of tumor cells (0+/with membrane staining)")
                        tableRow(category: "Negative (Score 1+)#", description: "Incomplete membrane staining that is faint/barely perceptible and within >10% of tumor cells")
                        tableRow(category: "Equivocal (Score 2+)#†", description: "Weak to moderate complete membrane staining in >10% of tumor cells\n\nor\n\nComplete membrane staining that is intense but within ≤10% of tumor cells*")
                        tableRow(category: "Positive (Score 3+)", description: "Complete membrane staining that is intense and >10% of tumor cells*")
                    }
                    .background(Color.white)
                    .cornerRadius(12)
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(Color.gray.opacity(0.4), lineWidth: 1.5)
                    )
                    
                    Text("*Readily appreciated using a low-power objective and observed within a homogeneous and contiguous...")
                        .font(.system(size: 11, weight: .medium))
                        .foregroundColor(.gray)
                        .padding(.top, 4)
                        .frame(maxWidth: .infinity, alignment: .leading)
                }
                .padding(.horizontal, 18)
                .padding(.bottom, 30)
            }
        }
        .ignoresSafeArea(edges: .top)
        .background(Color.white.ignoresSafeArea())
        .navigationBarBackButtonHidden(true)
        .toolbar(.hidden, for: .navigationBar)
    }

    @ViewBuilder
    func tableHeaderCell(_ text: String, width: CGFloat?) -> some View {
        Text(text)
            .font(.system(size: 14, weight: .bold))
            .foregroundColor(.black)
            .frame(maxWidth: width == nil ? .infinity : nil)
            .frame(width: width)
            .padding(.vertical, 12)
            .padding(.horizontal, 8)
            .frame(maxHeight: .infinity)
            .background(Color.blue.opacity(0.1))
            .border(Color.gray.opacity(0.4), width: 1.0)
    }

    @ViewBuilder
    func tableRow(category: String, description: String) -> some View {
        HStack(spacing: 0) {
            Text(category)
                .font(.system(size: 13, weight: .bold))
                .foregroundColor(.black)
                .frame(width: 140)
                .padding(.vertical, 12)
                .frame(maxHeight: .infinity)
                .border(Color.gray.opacity(0.4), width: 1.0)
            
            Text(description)
                .font(.system(size: 13))
                .foregroundColor(.black.opacity(0.8))
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding(12)
                .frame(maxHeight: .infinity)
                .border(Color.gray.opacity(0.4), width: 1.0)
        }
        .fixedSize(horizontal: false, vertical: true)
    }


}

struct GITGuidelines_Previews: PreviewProvider {
    static var previews: some View {
        NavigationStack {
            GITGuidelines()
        }
    }
}
