import SwiftUI

struct DoctorLoginView: View {
    @State private var licenseNumber: String = ""
    @State private var password: String = ""
    @State private var errorMessage: String = ""
    @State private var isLoggedIn = false
    @State private var isLoading = false
    @State private var isPasswordVisible = false

    @AppStorage("savedLicenseNumber") private var savedLicenseNumber = ""
    @AppStorage("savedPassword") private var savedPassword = ""
    
    @AppStorage("doctor_id") private var doctorID: Int = 0
    @AppStorage("doctor_name") private var doctorName: String = ""
    @AppStorage("licenseNumber") private var appStorageLicenseNumber = ""
    @AppStorage("email") private var appStorageEmail = ""
    @AppStorage("specialization") private var appStorageSpecialization = ""
    @AppStorage("hospitalName") private var appStorageHospitalName = ""
    @AppStorage("phoneNumber") private var appStoragePhoneNumber = ""
    @AppStorage("profile_pic") private var appStorageProfilePic = ""
    
    @StateObject private var navManager = AppNavigation.shared
    @ObservedObject private var networkManager = NetworkManager.shared
    

    var body: some View {
        if doctorID != 0 {
            Tissuetypes()
        } else {
            NavigationStack(path: $navManager.path) {
                ZStack {
                    // Soft, premium professional background gradient
                    LinearGradient(
                        colors: [Color(red: 240/255, green: 248/255, blue: 255/255), Color(red: 213/255, green: 236/255, blue: 247/255)],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                    .ignoresSafeArea()

                    // Optional subtle branding element behind the card
                    Circle()
                        .fill(Color.blue.opacity(0.04))
                        .frame(width: 400, height: 400)
                        .offset(x: -100, y: -250)

                    VStack(spacing: 0) {
                        Spacer().frame(height: 60)

                        // App Header
                        VStack(spacing: 6) {
                            Text("HistoQuanta")
                                .font(.system(size: 36, weight: .heavy, design: .rounded))
                                .foregroundColor(Color(red: 30/255, green: 60/255, blue: 90/255))
                        }
                        .padding(.bottom, 55)

                        // Main Login Card with Overlapping Logo
                        ZStack(alignment: .top) {
                            VStack(spacing: 24) {
                                Text("Welcome Back")
                                    .font(.system(size: 22, weight: .bold))
                                    .foregroundColor(.black.opacity(0.8))
                                    
                                VStack(spacing: 16) {
                                    customTextField(icon: "doc.text.fill", placeholder: "License Number", text: $licenseNumber)
                                        .accessibilityIdentifier("login-license-field")
                                    customSecureField(icon: "lock.fill", placeholder: "Password", text: $password)
                                        .accessibilityIdentifier("login-password-field")
                                }
                                
                                // Error Message
                                if !errorMessage.isEmpty {
                                    Text(errorMessage)
                                        .foregroundColor(.red)
                                        .font(.system(size: 14, weight: .medium))
                                        .frame(maxWidth: .infinity, alignment: .leading)
                                        .accessibilityIdentifier("login-error-text")
                                }

                                Button(action: { navManager.navigate(to: .forgotPassword) }) {
                                    Text("Forgot Password?")
                                        .font(.system(size: 14, weight: .semibold))
                                        .foregroundColor(.blue)
                                        .frame(maxWidth: .infinity, alignment: .trailing)
                                }
                                .accessibilityIdentifier("login-forgot-password-link")

                                // Login Button
                                Button(action: loginDoctor) {
                                    HStack {
                                        if isLoading {
                                            ProgressView().tint(.white)
                                        } else {
                                            Text("Log In")
                                        }
                                    }
                                    .frame(maxWidth: .infinity, minHeight: 50)
                                    .background(
                                        LinearGradient(colors: [Color.blue, Color(red: 40/255, green: 140/255, blue: 240/255)], startPoint: .leading, endPoint: .trailing)
                                    )
                                    .foregroundColor(.white)
                                    .font(.system(size: 18, weight: .bold))
                                    .cornerRadius(12)
                                    .shadow(color: Color.blue.opacity(0.3), radius: 8, x: 0, y: 4)
                                }
                                .disabled(isLoading)
                                .accessibilityIdentifier("login-submit-btn")

                                HStack {
                                    Text("Don't have an account?")
                                        .font(.system(size: 14))
                                        .foregroundColor(.gray)
                                    Button(action: { navManager.navigate(to: .doctorSignup) }) {
                                        Text("Sign Up")
                                            .font(.system(size: 14, weight: .bold))
                                            .foregroundColor(.blue)
                                    }
                                    .accessibilityIdentifier("login-signup-link")
                                }
                                .padding(.top, 10)
                            }
                            .padding(.top, 55)
                            .padding(.horizontal, 30)
                            .padding(.bottom, 30)
                            .background(Color.white)
                            .cornerRadius(24)
                            .overlay(
                                RoundedRectangle(cornerRadius: 24)
                                    .stroke(Color.black.opacity(0.1), lineWidth: 1)
                            )
                            .shadow(color: Color.black.opacity(0.08), radius: 15, x: 0, y: 8)
                            .padding(.horizontal, 24)
                            
                            // Projected Logo App Icon
                            Image("AppLogo")
                                .resizable()
                                .scaledToFit()
                                .frame(width: 86, height: 86)
                                .clipShape(RoundedRectangle(cornerRadius: 18))
                                .shadow(color: Color.black.opacity(0.1), radius: 8, x: 0, y: 4)
                                .offset(y: -43)
                        }

                        Spacer()
                        
                        // Elegant Footer text
                        Text("About Our platform provides standardized,quantitative assessment of key biomarkers used in cancer diagnosis and treatment planning.Each analysis module is designed to deliver accurate ,reproducible results for clinical decision_making.\n@vamsi")
                            .font(.system(size: 12))
                            .foregroundColor(.gray)
                            .multilineTextAlignment(.center)
                            .padding(.horizontal, 20)
                            .padding(.bottom, 20)
                    }
                }
                .navigationDestination(for: AppDestination.self) { destination in
                    viewForDestination(destination)
                }
                .onAppear {

                    
                    // Pre-fill saved credentials
                    if licenseNumber.isEmpty && !savedLicenseNumber.isEmpty {
                        licenseNumber = savedLicenseNumber
                    }
                    if password.isEmpty && !savedPassword.isEmpty {
                        password = savedPassword
                    }
                }
            }
        }
    }
    
    @ViewBuilder
    func viewForDestination(_ destination: AppDestination) -> some View {
        switch destination {
        case .forgotPassword: ForgotPasswordView()
        case .doctorSignup: DoctorSignupView()
        default: EmptyView()
        }
    }
    
    // MARK: - View Helpers
    
    @ViewBuilder
    private func customTextField(icon: String, placeholder: String, text: Binding<String>) -> some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .foregroundColor(.gray)
                .frame(width: 20)
            TextField(placeholder, text: text)
                .autocapitalization(.none)
                .disableAutocorrection(true)
        }
                                .padding(.vertical, 12)
                                .background(Color(red: 248/255, green: 250/255, blue: 252/255))
                                .cornerRadius(12)
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(Color.gray.opacity(0.2), lineWidth: 1)
        )
    }
    
    @ViewBuilder
    private func customSecureField(icon: String, placeholder: String, text: Binding<String>) -> some View {
        HStack(spacing: 12) {
            Image(systemName: icon)
                .foregroundColor(.gray)
                .frame(width: 20)
            
            if isPasswordVisible {
                TextField(placeholder, text: text)
                    .autocapitalization(.none)
                    .disableAutocorrection(true)
            } else {
                SecureField(placeholder, text: text)
            }
            
            Button(action: {
                withAnimation(.easeInOut(duration: 0.2)) {
                    isPasswordVisible.toggle()
                }
            }) {
                Image(systemName: isPasswordVisible ? "eye.slash.fill" : "eye.fill")
                    .foregroundColor(.blue.opacity(0.6))
                    .font(.system(size: 15, weight: .medium))
            }
        }
        .padding(.horizontal, 14)
        .padding(.vertical, 12)
        .background(Color(red: 248/255, green: 250/255, blue: 252/255))
        .cornerRadius(12)
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(Color.gray.opacity(0.2), lineWidth: 1)
        )
    }

    // MARK: - Logic
    func loginDoctor() {
        if licenseNumber.isEmpty || password.isEmpty {
            errorMessage = "Please enter license number and password"
            return
        }

        isLoading = true
        errorMessage = ""
        
        let url = networkManager.getURL(for: "doctor_login.php")
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        
        let allowedCharacterSet = CharacterSet(charactersIn: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~")
        let encodedLicense = licenseNumber.addingPercentEncoding(withAllowedCharacters: allowedCharacterSet) ?? ""
        let encodedPassword = password.addingPercentEncoding(withAllowedCharacters: allowedCharacterSet) ?? ""
        
        let body = "license_no=\(encodedLicense)&password=\(encodedPassword)"
        request.httpBody = body.data(using: .utf8)
        request.setValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")

        networkManager.session.dataTask(with: request) { data, response, error in
            DispatchQueue.main.async {
                isLoading = false
                if let error = error {
                    errorMessage = "Connection Error: \(error.localizedDescription)\nTarget: \(url.absoluteString)"
                    return
                }
                
                guard let data = data else {
                    errorMessage = "No response from server"
                    return
                }
                
                do {
                    if let json = try JSONSerialization.jsonObject(with: data) as? [String: Any] {
                        let status = json["status"] as? Bool ?? false
                        let message = json["message"] as? String ?? "Unknown error"
                        
                        if status {
                            if let id = json["doctor_id"] as? Int {
                                self.doctorID = id
                            } else if let idString = json["doctor_id"] as? String, let id = Int(idString) {
                                self.doctorID = id
                            }
                            
                            if let name = json["doctor_name"] as? String { self.doctorName = name }
                            if let mail = json["email"] as? String { self.appStorageEmail = mail }
                            if let spec = json["specialization"] as? String { self.appStorageSpecialization = spec }
                            if let hosp = json["hospital_name"] as? String { self.appStorageHospitalName = hosp }
                            if let phone = json["phone_number"] as? String { self.appStoragePhoneNumber = phone }
                            if let pic = json["profile_pic"] as? String { self.appStorageProfilePic = pic }
                            
                            self.appStorageLicenseNumber = self.licenseNumber
                            self.savedLicenseNumber = self.licenseNumber
                            self.savedPassword = self.password
                            
                            self.errorMessage = ""
                            withAnimation {
                                // Transition is now handled by doctorID changing
                            }
                        } else {
                            self.errorMessage = message
                        }
                    }
                } catch {
                    self.errorMessage = "Failed to communicate securely with server."
                }
            }
        }.resume()
    }
}

#Preview {
    DoctorLoginView()
}
