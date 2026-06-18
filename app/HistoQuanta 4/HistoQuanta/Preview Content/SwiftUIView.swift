import SwiftUI

struct SwiftUIView: View {
    @State private var doctorName: String = ""
    @State private var idNumber: String = ""

    let descriptionText = """
    Our platform provides standardized, quantitative assessment of key biomarkers used in cancer diagnosis and treatment planning. Each analysis module is designed to deliver accurate, reproducible results for clinical decision-making.
    @Vamsi2024
    """

    var body: some View {
        ZStack {
            Image("Frame-43")
                .resizable()
                .scaledToFill()
                .ignoresSafeArea()
                .opacity(0.13)
                .background(Color(red: 213/255, green: 241/255, blue: 250/255).ignoresSafeArea())

            VStack {
                Spacer().frame(height: 90)

                Text("HistoQuanta")
                    .font(.system(size: 38, weight: .bold))
                    .foregroundColor(.black)
                    .padding(.bottom, 6)



                VStack(spacing: 22) {
                    TextField("Doctor's Name", text: $doctorName)
                        .padding(.leading, 18)
                        .frame(height: 48)
                        .background(Color.white.opacity(0.88))
                        .cornerRadius(8)
                        .overlay(
                            RoundedRectangle(cornerRadius: 8)
                                .stroke(Color.gray.opacity(0.14), lineWidth: 1)
                        )
                        .font(.title3)
                        .frame(maxWidth: 360)

                    TextField("ID Number", text: $idNumber)
                        .padding(.leading, 18)
                        .frame(height: 48)
                        .background(Color.white.opacity(0.88))
                        .cornerRadius(8)
                        .overlay(
                            RoundedRectangle(cornerRadius: 8)
                                .stroke(Color.gray.opacity(0.14), lineWidth: 1)
                        )
                        .font(.title3)
                        .frame(maxWidth: 360)
                }
                .padding(.horizontal, 18)

                Button(action: {
                    // Log In action here
                }) {
                    Text("Log In")
                        .frame(maxWidth: .infinity, minHeight: 48)
                        .background(Color(red: 54/255, green: 164/255, blue: 228/255))
                        .foregroundColor(.white)
                        .font(.system(size: 22, weight: .semibold))
                        .cornerRadius(8)
                        .shadow(color: Color.black.opacity(0.15), radius: 2, x: 0, y: 1)
                }
                .frame(maxWidth: 360)
                .padding(.top, 20)

                Spacer()
            }
            .frame(maxWidth: .infinity)

            // Fixed description box at bottom
            VStack(spacing: 10) {
                Text("About HistoQuanta")
                    .font(.footnote)
                    .bold()
                    .foregroundColor(.black)
                    .multilineTextAlignment(.center)
                Text(descriptionText)
                    .font(.footnote)
                    .foregroundColor(.black)
                    .multilineTextAlignment(.center)
                    .lineSpacing(5)
                    .minimumScaleFactor(0.95)
                    .lineLimit(8)
            }
            .padding(.horizontal, 20)
            .padding(.vertical, 18)
            .background(Color.white.opacity(0.9))
            .cornerRadius(12)
            .shadow(radius: 4)
            .padding()
            .frame(maxWidth: .infinity)
            .frame(height: 150)
            .position(x: UIScreen.main.bounds.width / 2, y: UIScreen.main.bounds.height - 110)
        }
    }
}

#Preview {
    DoctorLoginView()
}
