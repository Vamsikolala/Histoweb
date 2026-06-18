import SwiftUI

struct GuidelinesP16: View {
    @StateObject private var navManager = AppNavigation.shared
    
    let resultWidth: CGFloat = 100
    let headerHeight: CGFloat = 60

    var body: some View {
        ZStack {
            LinearGradient(
                colors: [
                    Color(red: 0.95, green: 0.97, blue: 1.0),
                    Color.white
                ],
                startPoint: .top,
                endPoint: .bottom
            )
            .ignoresSafeArea()

            VStack(spacing: 0) {
                StandardHeader(title: "Guidelines")
                
                ScrollView(showsIndicators: false) {
                    VStack(alignment: .leading, spacing: 0) {
                        Text("p16 as a Surrogate for Transcriptionally Active High-Risk HPV")
                            .font(.system(size: 18, weight: .bold))
                            .foregroundColor(.blue)
                            .padding(.top, 10)

                        // Table
                        VStack(spacing: 0) {
                            // Header
                            HStack(spacing: 0) {
                                tableHeaderCell("Result", width: resultWidth, height: headerHeight)
                                tableHeaderCell("Interpretation Criteria", width: nil, height: headerHeight)
                            }
                            
                            // Rows
                            guidelineRow(result: "Negative", criteria: "less than 50% diffuse and moderate-to-strong nuclear and cytoplasmic staining")
                            guidelineRow(result: "Equivocal", criteria: "less than 70% but greater than or equal to 50% diffuse and moderate-to-strong nuclear and cytoplasmic staining")
                            guidelineRow(result: "Positive", criteria: "greater than or equal to 70% diffuse and moderate-to-strong nuclear and cytoplasmic staining")
                            guidelineRow(result: "Other", criteria: "Including cytology specimens, specify as needed.")
                        }
                        .background(Color.white)
                        .cornerRadius(12)
                        .overlay(
                            RoundedRectangle(cornerRadius: 12)
                                .stroke(Color.gray.opacity(0.18), lineWidth: 1)
                        )
                    }
                    .padding(.horizontal, 18)
                    .padding(.bottom, 20)
                }
            }
        }
        .ignoresSafeArea(edges: .top)
        .navigationBarBackButtonHidden(true)
        .toolbar(.hidden, for: .navigationBar)
    }


    @ViewBuilder
    func tableHeaderCell(_ text: String, width: CGFloat?, height: CGFloat) -> some View {
        Text(text)
            .font(.system(size: 15, weight: .bold))
            .foregroundColor(.black)
            .multilineTextAlignment(.center)
            .padding(.horizontal, 8)
            .frame(maxWidth: width == nil ? .infinity : nil)
            .frame(width: width, height: height)
            .background(Color.blue.opacity(0.08))
            .border(Color.gray.opacity(0.2), width: 0.5)
    }

    @ViewBuilder
    func guidelineRow(result: String, criteria: String) -> some View {
        HStack(spacing: 0) {
            tableRowCell(result, width: resultWidth, isBold: true)
            tableRowCell(criteria, width: nil, isBold: false)
        }
    }

    @ViewBuilder
    func tableRowCell(_ text: String, width: CGFloat?, isBold: Bool) -> some View {
        Text(text)
            .font(.system(size: 13, weight: isBold ? .bold : .regular))
            .foregroundColor(.black)
            .multilineTextAlignment(.leading)
            .frame(maxWidth: width == nil ? .infinity : nil, alignment: .topLeading)
            .frame(width: width, alignment: .topLeading)
            .padding(12)
            .border(Color.gray.opacity(0.15), width: 0.5)
    }
}

struct GuidelinesP16_Previews: PreviewProvider {
    static var previews: some View {
        GuidelinesP16()
    }
}
