import SwiftUI

struct Tissue: Identifiable, Hashable {
    let id = UUID()
    let imageName: String
    let title: String
}

struct Tissuetypes: View {
    let tissues: [Tissue] = [
        Tissue(imageName: "Breast", title: "Breast"),
        Tissue(imageName: "Thyroid", title: "Thyroid"),
        Tissue(imageName: "GIT", title: "GIT"),
        Tissue(imageName: "Soft tissue", title: "Soft Tissue"),
        Tissue(imageName: "Head Neck", title: "Head & Neck"),
        Tissue(imageName: "Lungs", title: "Lungs")
    ]

    @AppStorage("doctor_id") private var doctorID = 0
    @State private var selectedTab = 0
    @StateObject private var patientSession = PatientSessionManager.shared
    @StateObject private var navManager = AppNavigation.shared
    @AppStorage("doctor_name") private var doctorName = ""

    private var timeBasedGreeting: String {
        let hour = Calendar.current.component(.hour, from: Date())
        switch hour {
        case 5..<12: return "Good Morning"
        case 12..<17: return "Good Afternoon"
        case 17..<21: return "Good Evening"
        default: return "Good Night"
        }
    }

    private let columns = [
        GridItem(.flexible(), spacing: 16),
        GridItem(.flexible(), spacing: 16)
    ]

    var body: some View {
        NavigationStack(path: $navManager.path) {
            ZStack(alignment: .bottom) {
                TabView(selection: $selectedTab) {
                    homeContent
                        .tag(0)

                    SearchPatientView()
                        .tag(1)

                    AddPatientView()
                        .tag(2)

                    DoctorProfileView()
                        .tag(3)
                }
                .ignoresSafeArea()
                
                if navManager.path.isEmpty {
                    bottomBar
                        .transition(.move(edge: .bottom).combined(with: .opacity))
                        .zIndex(100)
                }
            }
            .ignoresSafeArea()
            .toolbar(.hidden, for: .navigationBar)
            .navigationDestination(for: AppDestination.self) { destination in
                viewForDestination(destination)
            }
        }
        .ignoresSafeArea()
        .onChange(of: patientSession.selectionNonce) { _ in
            if patientSession.currentPatient != nil {
                selectedTab = 0
            }
        }
    }



    private var homeContent: some View {
        ZStack(alignment: .top) {
            Color(red: 240/255, green: 248/255, blue: 255/255)
                .ignoresSafeArea()
            
            VStack(spacing: 0) {
                // Standardized Dashboard Header (Edge-to-Edge)
                ZStack {
                    LinearGradient(
                        colors: [Color.blue, Color(red: 40/255, green: 140/255, blue: 240/255)],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                    .ignoresSafeArea(edges: .top)

                    VStack(spacing: 6) {
                        HStack {
                            VStack(alignment: .leading, spacing: 4) {
                                Text("Welcome")
                                    .font(.system(size: 16, weight: .medium))
                                    .foregroundColor(.white.opacity(0.9))
                                
                                Text(doctorName.lowercased().hasPrefix("dr.") ? doctorName : "Dr. \(doctorName.isEmpty ? "Surgeon" : doctorName)")
                                    .font(.system(size: 26, weight: .heavy, design: .rounded))
                                    .foregroundColor(.white)
                                    .lineLimit(1)
                                
                                Text("\(timeBasedGreeting)!")
                                    .font(.system(size: 15, weight: .medium))
                                    .foregroundColor(.white.opacity(0.8))
                            }
                            
                            Spacer()
                            
                            ZStack {
                                Circle()
                                    .fill(Color.white.opacity(0.2))
                                    .frame(width: 50, height: 50)
                                Image(systemName: "cross.case.fill")
                                    .font(.system(size: 24))
                                    .foregroundColor(.white)
                            }
                        }
                        .padding(.horizontal, 24)
                    }
                    .padding(.top, 55)
                    .padding(.bottom, 20)
                }
                .frame(height: 215)
                .clipShape(RoundedCorner(radius: 28, corners: [.bottomLeft, .bottomRight]))
                .shadow(color: Color.blue.opacity(0.15), radius: 10, y: 5)

                ScrollView(showsIndicators: false) {
                    VStack(alignment: .leading, spacing: 20) {
                        Spacer().frame(height: 10)
                    
                    Text("Analysis Modules")
                        .font(.system(size: 20, weight: .bold))
                        .foregroundColor(Color(red: 30/255, green: 60/255, blue: 90/255))
                        .padding(.horizontal, 24)
                        .padding(.top, 5)
                        


                    // Active Patient Session Pill
                    if let patient = patientSession.currentPatient {
                        HStack {
                            Image(systemName: "person.crop.circle.badge.checkmark")
                                .font(.system(size: 24))
                                .foregroundColor(.green)

                            VStack(alignment: .leading, spacing: 2) {
                                Text("Active Patient: \(patient.name)")
                                    .font(.system(size: 15, weight: .bold))
                                    .foregroundColor(.black)
                                Text("ID: \(patient.patient_id)")
                                    .font(.system(size: 13))
                                    .foregroundColor(.gray)
                            }

                            Spacer()

                            Button(action: { patientSession.clearSession() }) {
                                Text("Clear")
                                    .font(.system(size: 14, weight: .bold))
                                    .padding(.horizontal, 12)
                                    .padding(.vertical, 6)
                                    .background(Color.red.opacity(0.1))
                                    .foregroundColor(.red)
                                    .cornerRadius(12)
                            }
                        }
                        .padding(14)
                        .background(Color.white)
                        .cornerRadius(16)
                        .shadow(color: Color.black.opacity(0.05), radius: 6, x: 0, y: 2)
                        .padding(.horizontal, 20)
                    }

                    LazyVGrid(columns: columns, spacing: 16) {
                        ForEach(tissues) { tissue in
                            NavigationLink(value: destinationForTissue(tissue)) {
                                tissueTile(for: tissue)
                            }
                            .buttonStyle(.plain)
                        }
                    }
                    .padding(.horizontal, 20)
                    .padding(.bottom, 110)
                }
            }
        }
        .ignoresSafeArea(edges: .top)
    }
}

    func tissueTile(for tissue: Tissue) -> some View {
        VStack(spacing: 14) {
            // Premium Floating Icon Container
            ZStack {
                Circle()
                    .fill(
                        LinearGradient(colors: [Color.blue.opacity(0.15), Color.cyan.opacity(0.05)], startPoint: .topLeading, endPoint: .bottomTrailing)
                    )
                    .frame(width: 74, height: 74)

                Image(tissue.imageName)
                    .resizable()
                    .scaledToFill()
                    .frame(width: 60, height: 60)
                    .clipShape(Circle())
                    .shadow(color: .black.opacity(0.1), radius: 4, x: 0, y: 2)
            }
            .padding(.top, 20)

            Text(tissue.title)
                .font(.system(size: 15, weight: .bold, design: .rounded))
                .foregroundColor(Color(red: 40/255, green: 60/255, blue: 90/255))
                .multilineTextAlignment(.center)
                .padding(.horizontal, 8)
                .padding(.bottom, 20)
        }
        .frame(maxWidth: .infinity)
        .background(
            LinearGradient(
                colors: [Color.white, Color(red: 248/255, green: 252/255, blue: 255/255)], 
                startPoint: .topLeading, 
                endPoint: .bottomTrailing
            )
        )
        .cornerRadius(24)
        .overlay(
            RoundedRectangle(cornerRadius: 24)
                .stroke(
                    LinearGradient(colors: [Color.blue.opacity(0.2), Color.clear], startPoint: .topLeading, endPoint: .bottomTrailing), 
                    lineWidth: 1.5
                )
        )
        .shadow(color: Color.blue.opacity(0.12), radius: 12, x: 0, y: 8)
    }

    private var bottomBar: some View {
        HStack(spacing: 0) {
            tabItem(icon: "house.fill", title: "Home", index: 0)
            tabItem(icon: "magnifyingglass", title: "Search", index: 1)
            tabItem(icon: "plus.circle.fill", title: "Add", index: 2)
            tabItem(icon: "person.crop.circle", title: "Profile", index: 3)
        }
        .padding(.horizontal, 10)
        .padding(.vertical, 8)
        .background(
            Capsule()
                .fill(Color.white)
                .shadow(color: Color.black.opacity(0.08), radius: 15, x: 0, y: 5)
        )
        .overlay(
            Capsule()
                .stroke(Color.gray.opacity(0.1), lineWidth: 1)
        )
        .padding(.horizontal, 24)
        .padding(.bottom, 20)
    }

    func tabItem(icon: String, title: String, index: Int) -> some View {
        Button {
            withAnimation(.spring(response: 0.3, dampingFraction: 0.7)) {
                selectedTab = index
            }
        } label: {
            VStack(spacing: 4) {
                Image(systemName: icon)
                    .font(.system(size: 20, weight: .bold))
                
                Text(title)
                    .font(.system(size: 10, weight: .bold))
            }
            .foregroundColor(selectedTab == index ? .blue : Color.gray.opacity(0.8))
            .frame(maxWidth: .infinity)
            .padding(.vertical, 10)
            .background(
                ZStack {
                    if selectedTab == index {
                        Capsule()
                            .fill(Color.blue.opacity(0.12))
                            .matchedGeometryEffect(id: "tab", in: tabAnimation)
                    }
                }
            )
        }
    }
    @Namespace private var tabAnimation

    func destinationForTissue(_ tissue: Tissue) -> AppDestination {
        switch tissue.title {
        case "Breast": return .breastTypes
        case "Thyroid": return .thyroidKi67
        case "GIT": return .gitScreen
        case "Soft Tissue": return .softTissue
        case "Head & Neck": return .headNeckScreen
        case "Lungs": return .lungsHER2
        default: return .breastTypes
        }
    }

    @ViewBuilder
    func viewForDestination(_ destination: AppDestination) -> some View {
        switch destination {
        case .tissueTypes:
            Tissuetypes()
        case .breastTypes:
            Breasttypes()
        case .er:
            ER()
        case .pr:
            PR()
        case .breastHER2:
            BreastHER2()
        case .ki67:
            Ki67()
        case .erHScore(let i, let p):
            ER_Hscore(initialIntensity: i, initialProportion: p)
        case .prHScore(let i, let p):
            PR_HScore(initialIntensity: i, initialProportion: p)
        case .breastGuidelines:
            Guidelines()
        case .her2Guidelines:
            HER2Guidelines()
        case .thyroidKi67:
            ThyroidKi67()
        case .gitScreen:
            GITScreen()
        case .gitAdenocarcinoma:
            Adenocarcinoma()
        case .gitAdenocarcinomaSurgical:
            AdenocarcinomaHER2()
        case .gitAdenocarcinomaBiopsy:
            GITBiopsySpecimen()
        case .gitGuidelinesHER2:
            GITguidelinesher2()
        case .gitGuidelines:
            GITGuidelines()
        case .gitNET:
            GIT_NETScreen()
        case .gitNETGuidelines:
            NETguidelines()
        case .gitNETStomach:
            NETStomachScreen()
        case .gitNETGrading:
            NETGradingView()
        case .gitGIST:
            GISTSelectorScreen()
        case .gitGISTKi67:
            GIST_KI67Screen()
        case .gitGISTKit:
            GIST_KITScreen()
        case .softTissue:
            SoftTissue()
        case .headNeckScreen:
            HeadNeckScreen()
        case .p16:
            P16()
        case .p16Guidelines:
            GuidelinesP16()
        case .headNeckHER2:
            HeadneckHER2()
        case .lungsHER2:
            LungsHer2()
        case .doctorProfile:
            DoctorProfileView()
        case .addPatient:
            AddPatientView()
        case .editPatient(let patient):
            EditPatientView(patient: patient, onUpdate: { _ in })
        case .searchPatient:
            SearchPatientView()
        case .patientProfile(let patient):
            PatientProfileView(patient: patient)
        case .addDisease(let patient, let reportID):
            AddDiseaseView(patient: patient, reportID: reportID)
        case .privacyPolicy:
            PrivacyPolicyView()
        case .termsAndConditions:
            TermsAndConditionsView()
        case .about:
            AboutView()
        case .forgotPassword:
            ForgotPasswordView()
        case .doctorSignup:
            DoctorSignupView()
        case .myDownloads(let patientName):
            DownloadsView(filterPatientName: patientName)
        }
    }
}

#Preview {
    Tissuetypes()
}

// MARK: - Global Architecture (Consolidated)

class PatientSessionManager: ObservableObject {
    static let shared = PatientSessionManager()
    @Published var currentPatient: HQPatient?
    @Published var selectionNonce = UUID()
    private init() {}
    func selectPatient(_ patient: HQPatient) {
        currentPatient = patient
        selectionNonce = UUID()
    }
    func clearSession() { currentPatient = nil }
    var isPatientSelected: Bool { currentPatient != nil }
}

