import SwiftUI

struct DoctorSignupView: View {
    @State private var name = ""
    @State private var licenseNo = ""
    @State private var email = ""
    @State private var password = ""
    @State private var errorMessage = ""
    @State private var isSuccess = false
    @State private var isLoading = false
    @StateObject private var navManager = AppNavigation.shared
    
    var body: some View {
        ZStack {
            // Unify with Login Background
            LinearGradient(
                colors: [Color(red: 240/255, green: 248/255, blue: 255/255), Color(red: 213/255, green: 236/255, blue: 247/255)],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .ignoresSafeArea()
            
            ScrollView(showsIndicators: false) {
                    VStack(spacing: 0) {
                        Spacer().frame(height: 60)
                        
                        // App Header
                        VStack(spacing: 6) {
                            Text("Create Account")
                                .font(.system(size: 34, weight: .heavy, design: .rounded))
                                .foregroundColor(Color(red: 30/255, green: 60/255, blue: 90/255))
                            
                            Text("Join the HistoQuanta network")
                                .font(.system(size: 16, weight: .medium))
                                .foregroundColor(.gray)
                        }
                        .padding(.bottom, 55)
                        
                        // Main Signup Card with Overlapping Logo
                        ZStack(alignment: .top) {
                            VStack(spacing: 20) {
                                VStack(spacing: 16) {
                                    customTextField(icon: "person.fill", placeholder: "Full Name", text: $name)
                                        .accessibilityIdentifier("signup-name-field")
                                    customTextField(icon: "doc.text.fill", placeholder: "License Number", text: $licenseNo)
                                        .accessibilityIdentifier("signup-license-field")
                                    customTextField(icon: "envelope.fill", placeholder: "Email Address", text: $email)
                                        .accessibilityIdentifier("signup-email-field")
                                        .keyboardType(.emailAddress)
                                    customSecureField(icon: "lock.fill", placeholder: "Password", text: $password)
                                        .accessibilityIdentifier("signup-password-field")
                                }
                                
                                if !errorMessage.isEmpty {
                                    Text(errorMessage)
                                        .foregroundColor(.red)
                                        .font(.system(size: 14, weight: .medium))
                                        .frame(maxWidth: .infinity, alignment: .leading)
                                        .accessibilityIdentifier("signup-error-text")
                                }
                                
                                if isSuccess {
                                    Text("Account created successfully!")
                                        .foregroundColor(.green)
                                        .font(.system(size: 14, weight: .bold))
                                        }
                                
                                Button(action: signup) {
                                    HStack {
                                        if isLoading {
                                            ProgressView().tint(.white)
                                        } else {
                                            Text("Sign Up")
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
                                .disabled(isLoading || isSuccess)
                                .accessibilityIdentifier("signup-submit-btn")
                                .padding(.top, 10)
                                
                                HStack {
                                    Text("Already have an account?")
                                        .font(.system(size: 14))
                                        .foregroundColor(.gray)
                                    Button(action: { navManager.navigateBack() }) {
                                        Text("Log In")
                                            .font(.system(size: 14, weight: .bold))
                                            .foregroundColor(.blue)
                                    }
                                    .accessibilityIdentifier("signup-login-link")
                                }
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
                            ZStack {
                                Circle()
                                    .fill(Color.white)
                                    .frame(width: 86, height: 86)
                                    .shadow(color: Color.black.opacity(0.06), radius: 6, x: 0, y: 4)
                                
                                Circle()
                                    .fill(
                                        LinearGradient(colors: [Color.blue, Color.cyan], startPoint: .topLeading, endPoint: .bottomTrailing)
                                    )
                                    .frame(width: 74, height: 74)
                                
                                Image(systemName: "person.badge.plus")
                                    .font(.system(size: 30))
                                    .foregroundColor(.white)
                                    .offset(x: -2) // visually centering badge
                            }
                            .offset(y: -43)
                        }}
            }
        }
        .navigationBarBackButtonHidden(true) // We have custom inner buttons
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
            SecureField(placeholder, text: text)
        }
                                .padding(.vertical, 12)
                                .background(Color(red: 248/255, green: 250/255, blue: 252/255))
                                .cornerRadius(12)
        .overlay(
            RoundedRectangle(cornerRadius: 12)
                .stroke(Color.gray.opacity(0.2), lineWidth: 1)
        )
    }
    
    // MARK: - Logic
    func signup() {
        if name.isEmpty || licenseNo.isEmpty || email.isEmpty || password.isEmpty {
            errorMessage = "Please fill all fields"
            return
        }
        
        if !name.isValidName() {
            errorMessage = "Name must be 2-50 characters and only contain letters"
            return
        }
        
        if !licenseNo.isValidLicense() {
            errorMessage = "License Number must be 3-20 alphanumeric characters"
            return
        }
        
        if !email.isValidEmail() {
            errorMessage = "Please enter a valid email address"
            return
        }
        
        if !password.isStrongPassword() {
            errorMessage = "Password must be at least 8 chars, 1 uppercase, 1 lowercase, 1 number, and 1 special character"
            return
        }
        
        isLoading = true
        errorMessage = ""
        
        let url = NetworkManager.shared.getURL(for: "doctor_signup.php")
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        
        let allowedCharacterSet = CharacterSet(charactersIn: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~")
        let encodedName = name.addingPercentEncoding(withAllowedCharacters: allowedCharacterSet) ?? ""
        let encodedLicense = licenseNo.addingPercentEncoding(withAllowedCharacters: allowedCharacterSet) ?? ""
        let encodedEmail = email.addingPercentEncoding(withAllowedCharacters: allowedCharacterSet) ?? ""
        let encodedPassword = password.addingPercentEncoding(withAllowedCharacters: allowedCharacterSet) ?? ""
        
        let body = "name=\(encodedName)&license_no=\(encodedLicense)&email=\(encodedEmail)&password=\(encodedPassword)"
        request.httpBody = body.data(using: .utf8)
        request.setValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            DispatchQueue.main.async {
                isLoading = false
                if let error = error {
                    errorMessage = "Error: \(error.localizedDescription)"
                    isSuccess = false
                    return
                }
                
                guard let data = data else {
                    errorMessage = "No response from server"
                    isSuccess = false
                    return
                }
                
                do {
                    if let json = try JSONSerialization.jsonObject(with: data) as? [String: Any] {
                        let status = json["status"] as? Bool ?? false
                        let message = json["message"] as? String ?? "Unknown error"
                        
                        if status {
                            isSuccess = true
                            errorMessage = ""
                             DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
                                 navManager.navigateBack()
                             }
                        } else {
                            errorMessage = message
                            isSuccess = false
                        }
                    }
                } catch {
                    errorMessage = "Failed to communicate with server safely."
                    isSuccess = false
                }
            }
        }.resume()
    }
}


#Preview {
    DoctorSignupView()
}
