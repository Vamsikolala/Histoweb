//
//  HistoQuantaApp.swift
//  HistoQuanta
//
//  Created by SAIL L1 on 16/10/25.
//

import SwiftUI  // ✅ ADD THIS LINE

@main
struct HistoQuantaApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}

// MARK: - Navigation Architecture (Consolidated)

@MainActor
class AppNavigation: ObservableObject {
    static let shared = AppNavigation()
    @Published var path = NavigationPath()
    private init() {}
    func navigate(to destination: AppDestination) { path.append(destination) }
    func navigateBack() { if !path.isEmpty { path.removeLast() } }
    func navigateToRoot() { path.removeLast(path.count) }
}

enum AppDestination: Hashable {
    case tissueTypes, breastTypes, er, pr, breastHER2, ki67
    case erHScore(intensity: Int, proportion: Int)
    case prHScore(intensity: Int, proportion: Int)
    case breastGuidelines, her2Guidelines, thyroidKi67, gitScreen, gitAdenocarcinoma
    case gitAdenocarcinomaSurgical, gitAdenocarcinomaBiopsy, gitGuidelinesHER2, gitGuidelines
    case gitNET, gitNETGuidelines, gitNETStomach, gitNETGrading, gitGIST, gitGISTKi67, gitGISTKit
    case softTissue, headNeckScreen, p16, p16Guidelines, headNeckHER2, lungsHER2
    case doctorProfile, addPatient, editPatient(patient: HQPatient), searchPatient
    case patientProfile(patient: HQPatient), addDisease(patient: HQPatient, reportID: Int? = nil)
    case privacyPolicy, termsAndConditions, about, forgotPassword, doctorSignup
    case myDownloads(patientName: String? = nil)
    
    func hash(into hasher: inout Hasher) {
        switch self {
        case .tissueTypes: hasher.combine("tissueTypes")
        case .breastTypes: hasher.combine("breastTypes")
        case .er: hasher.combine("er")
        case .pr: hasher.combine("pr")
        case .breastHER2: hasher.combine("breastHER2")
        case .ki67: hasher.combine("ki67")
        case .erHScore(let i, let p): hasher.combine("erHScore"); hasher.combine(i); hasher.combine(p)
        case .prHScore(let i, let p): hasher.combine("prHScore"); hasher.combine(i); hasher.combine(p)
        case .breastGuidelines: hasher.combine("breastGuidelines")
        case .her2Guidelines: hasher.combine("her2Guidelines")
        case .thyroidKi67: hasher.combine("thyroidKi67")
        case .gitScreen: hasher.combine("gitScreen")
        case .gitAdenocarcinoma: hasher.combine("gitAdenocarcinoma")
        case .gitAdenocarcinomaSurgical: hasher.combine("gitAdenocarcinomaSurgical")
        case .gitAdenocarcinomaBiopsy: hasher.combine("gitAdenocarcinomaBiopsy")
        case .gitGuidelinesHER2: hasher.combine("gitGuidelinesHER2")
        case .gitGuidelines: hasher.combine("gitGuidelines")
        case .gitNET: hasher.combine("gitNET")
        case .gitNETGuidelines: hasher.combine("gitNETGuidelines")
        case .gitNETStomach: hasher.combine("gitNETStomach")
        case .gitNETGrading: hasher.combine("gitNETGrading")
        case .gitGIST: hasher.combine("gitGIST")
        case .gitGISTKi67: hasher.combine("gitGISTKi67")
        case .gitGISTKit: hasher.combine("gitGISTKit")
        case .softTissue: hasher.combine("softTissue")
        case .headNeckScreen: hasher.combine("headNeckScreen")
        case .p16: hasher.combine("p16")
        case .p16Guidelines: hasher.combine("p16Guidelines")
        case .headNeckHER2: hasher.combine("headNeckHER2")
        case .lungsHER2: hasher.combine("lungsHER2")
        case .doctorProfile: hasher.combine("doctorProfile")
        case .addPatient: hasher.combine("addPatient")
        case .editPatient(let p): hasher.combine("editPatient"); hasher.combine(p.patient_id)
        case .searchPatient: hasher.combine("searchPatient")
        case .patientProfile(let p): hasher.combine("patientProfile"); hasher.combine(p.patient_id)
        case .addDisease(let p, let rid): hasher.combine("addDisease"); hasher.combine(p.patient_id); hasher.combine(rid ?? 0)
        case .privacyPolicy: hasher.combine("privacyPolicy")
        case .termsAndConditions: hasher.combine("termsAndConditions")
        case .about: hasher.combine("about")
        case .forgotPassword: hasher.combine("forgotPassword")
        case .doctorSignup: hasher.combine("doctorSignup")
        case .myDownloads(let name): hasher.combine("myDownloads"); hasher.combine(name ?? "")
        }
    }
    
    static func == (lhs: AppDestination, rhs: AppDestination) -> Bool {
        switch (lhs, rhs) {
        case (.tissueTypes, .tissueTypes), (.breastTypes, .breastTypes), (.er, .er), (.pr, .pr), (.breastHER2, .breastHER2), (.ki67, .ki67), (.breastGuidelines, .breastGuidelines), (.her2Guidelines, .her2Guidelines), (.thyroidKi67, .thyroidKi67), (.gitScreen, .gitScreen), (.gitAdenocarcinoma, .gitAdenocarcinoma), (.gitAdenocarcinomaSurgical, .gitAdenocarcinomaSurgical), (.gitAdenocarcinomaBiopsy, .gitAdenocarcinomaBiopsy), (.gitGuidelinesHER2, .gitGuidelinesHER2), (.gitGuidelines, .gitGuidelines), (.gitNET, .gitNET), (.gitNETGuidelines, .gitNETGuidelines), (.gitNETStomach, .gitNETStomach), (.gitNETGrading, .gitNETGrading), (.gitGIST, .gitGIST), (.gitGISTKi67, .gitGISTKi67), (.gitGISTKit, .gitGISTKit), (.softTissue, .softTissue), (.headNeckScreen, .headNeckScreen), (.p16, .p16), (.p16Guidelines, .p16Guidelines), (.headNeckHER2, .headNeckHER2), (.lungsHER2, .lungsHER2), (.doctorProfile, .doctorProfile), (.addPatient, .addPatient), (.searchPatient, .searchPatient), (.privacyPolicy, .privacyPolicy), (.termsAndConditions, .termsAndConditions), (.about, .about), (.forgotPassword, .forgotPassword), (.doctorSignup, .doctorSignup): return true
        case (.myDownloads(let l), .myDownloads(let r)): return l == r
        case (.erHScore(let lI, let lP), .erHScore(let rI, let rP)): return lI == rI && lP == rP
        case (.prHScore(let lI, let lP), .prHScore(let rI, let rP)): return lI == rI && lP == rP
        case (.editPatient(let l), .editPatient(let r)): return l.patient_id == r.patient_id
        case (.patientProfile(let l), .patientProfile(let r)): return l.patient_id == r.patient_id
        case (.addDisease(let lP, let lR), .addDisease(let rP, let rR)): return lP.patient_id == rP.patient_id && lR == rR
        default: return false
        }
    }
}

// MARK: - Global Architecture (Consolidated)

/// A custom shape that allows rounding specific corners of a rectangle.
struct RoundedCorner: Shape {
    var radius: CGFloat = .infinity
    var corners: UIRectCorner = .allCorners

    func path(in rect: CGRect) -> Path {
        let path = UIBezierPath(
            roundedRect: rect,
            byRoundingCorners: corners,
            cornerRadii: CGSize(width: radius, height: radius)
        )
        return Path(path.cgPath)
    }
}

// MARK: - Validation Extensions (Consolidated)

extension String {
    func isValidEmail() -> Bool {
        let emailRegex = "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}"
        let predicate = NSPredicate(format: "SELF MATCHES %@", emailRegex)
        return predicate.evaluate(with: self)
    }
    
    func isValidName() -> Bool {
        let nameRegEx = "^[a-zA-Z\\s.]{2,50}$"
        let namePred = NSPredicate(format:"SELF MATCHES %@", nameRegEx)
        return namePred.evaluate(with: self)
    }
    
    func isValidLicense() -> Bool {
        let licenseRegEx = "^[A-Z0-9a-z-/\\\\\\ ]{3,20}$"
        let licensePred = NSPredicate(format:"SELF MATCHES %@", licenseRegEx)
        return licensePred.evaluate(with: self)
    }
    
    func isStrongPassword() -> Bool {
        // At least 8 chars, 1 upper, 1 lower, 1 digit, 1 special
        let passwordRegex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[$@$!%*?&#])[A-Za-z\\d$@$!%*?&#]{8,}$"
        let predicate = NSPredicate(format: "SELF MATCHES %@", passwordRegex)
        return predicate.evaluate(with: self)
    }
}
