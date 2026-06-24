import SwiftUI

struct ForgotPasswordView: View {
    @StateObject private var navManager = AppNavigation.shared
    
    enum ResetStep {
        case email
        case otp
        case newPassword
    }
    
    @State private var currentStep: ResetStep = .email
    
    // Form Data
    @State private var email: String = ""
    @State private var otp: String = ""
    @State private var newPassword: String = ""
    @State private var confirmPassword: String = ""
    
    // UI State
    @State private var message: String = ""
    @State private var isLoading = false
    @State private var isSuccess = false
    @State private var goToLogin = false
    
    var body: some View {
        ZStack {
            // Unify with Login Background
            LinearGradient(
                colors: [Color(red: 240/255, green: 248/255, blue: 255/255), Color(red: 213/255, green: 236/255, blue: 247/255)],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .ignoresSafeArea()

            VStack(spacing: 0) {
                // Custom Navigation Bar
                HStack {
                    Button(action: handleBackPress) {
                        ZStack {
                            Circle()
                                .fill(Color.white)
                                .frame(width: 40, height: 40)
                                .shadow(color: .black.opacity(0.05), radius: 5)
                            
                            Image(systemName: "chevron.left")
                                .font(.system(size: 18, weight: .bold))
                                .foregroundColor(.blue)
                        }
                    }
                    .accessibilityIdentifier("forgot-back-btn")
                    Spacer()
                }
                .padding(.horizontal, 24)
                .padding(.top, 10)
                
                Spacer().frame(height: 10)
                
                // Header Text
                Text(titleForStep)
                    .font(.system(size: 32, weight: .heavy, design: .rounded))
                    .foregroundColor(Color(red: 30/255, green: 60/255, blue: 90/255))
                    .multilineTextAlignment(.center)
                    .padding(.bottom, 50)

                // Main Card with Overlapping Logo
                ZStack(alignment: .top) {
                    VStack(spacing: 24) {
                        
                        switch currentStep {
                        case .email:
                            emailStepView
                        case .otp:
                            otpStepView
                        case .newPassword:
                            newPasswordStepView
                        }
                        
                        if !message.isEmpty {
                            Text(message)
                                .foregroundColor(isSuccess ? .green : .red)
                                .font(.system(size: 14, weight: .medium))
                                .multilineTextAlignment(.center)
                                .frame(maxWidth: .infinity)
                        }

                        Button(action: handlePrimaryAction) {
                            HStack {
                                if isLoading {
                                    ProgressView().tint(.white)
                                } else {
                                    Text(buttonTitleForStep)
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
                        .disabled(isLoading || (isSuccess && currentStep == .newPassword))
                        .accessibilityIdentifier("forgot-submit-btn")
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
                    
                    // Projected Dynamic Icon
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
                        
                        Image(systemName: iconForStep)
                            .font(.system(size: 30))
                            .foregroundColor(.white)
                    }
                    .offset(y: -43)
                }

                Spacer()
            }
        }
        .navigationBarBackButtonHidden(true)
        .toolbar(.hidden, for: .navigationBar)
        .onChange(of: goToLogin) { newValue in
            if newValue {
                navManager.navigateBack()
            }
        }
    }
    
    // MARK: - Subviews
    
    var emailStepView: some View {
        VStack(spacing: 16) {
            Text("Enter your registered email address. We will send you a 6-digit OTP.")
                .font(.system(size: 14))
                .foregroundColor(.gray)
                .multilineTextAlignment(.center)
                .padding(.bottom, 5)
                
            customTextField(icon: "envelope.fill", placeholder: "Registered Email", text: $email)
                .accessibilityIdentifier("forgot-email-field")
                .keyboardType(.emailAddress)
        }
    }
    
    var otpStepView: some View {
        VStack(spacing: 16) {
            Text("We've sent an email with an OTP code to **\(email)**")
                .font(.system(size: 14))
                .foregroundColor(.gray)
                .multilineTextAlignment(.center)
                .padding(.bottom, 5)
                
            customTextField(icon: "number.circle.fill", placeholder: "Enter 6-digit OTP", text: $otp)
                .accessibilityIdentifier("forgot-otp-field")
                .keyboardType(.numberPad)
        }
    }
    
    var newPasswordStepView: some View {
        VStack(spacing: 16) {
            Text("Create a new, strong password to secure your account.")
                .font(.system(size: 14))
                .foregroundColor(.gray)
                .multilineTextAlignment(.center)
                .padding(.bottom, 5)
                
            customSecureField(icon: "lock.fill", placeholder: "New Password", text: $newPassword)
                .accessibilityIdentifier("forgot-new-password-field")
            customSecureField(icon: "lock.fill", placeholder: "Confirm Password", text: $confirmPassword)
                .accessibilityIdentifier("forgot-confirm-password-field")
        }
    }
    
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
        .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color.gray.opacity(0.2), lineWidth: 1))
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
        .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color.gray.opacity(0.2), lineWidth: 1))
    }
    
    // MARK: - Handlers
    
    var titleForStep: String {
        switch currentStep {
        case .email: return "Forgot Password"
        case .otp: return "Verify OTP"
        case .newPassword: return "Reset Password"
        }
    }
    
    var iconForStep: String {
        switch currentStep {
        case .email: return "lock.rotation"
        case .otp: return "key.horizontal.fill"
        case .newPassword: return "checkmark.shield.fill"
        }
    }
    
    var buttonTitleForStep: String {
        switch currentStep {
        case .email: return "Send OTP"
        case .otp: return "Verify OTP"
        case .newPassword: return "Update Password"
        }
    }
    
    func handleBackPress() {
        switch currentStep {
        case .email:
            navManager.navigateBack()
        case .otp:
            currentStep = .email
            message = ""
        case .newPassword:
            currentStep = .otp
            message = ""
        }
    }
    
    func handlePrimaryAction() {
        switch currentStep {
        case .email: sendOTP()
        case .otp: verifyOTP()
        case .newPassword: resetPassword()
        }
    }

    // MARK: - API Calls (Keeping exact same logic)
    
    func sendOTP() {
        if email.trimmingCharacters(in: .whitespaces).isEmpty {
            message = "Please enter your email"
            isSuccess = false; return
        }
        if !email.isValidEmail() {
            message = "Please enter a valid email address"
            isSuccess = false; return
        }
        
        isLoading = true; message = ""
        let url = NetworkManager.shared.getURL(for: "send_otp.php")
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        let trimmedEmail = email.trimmingCharacters(in: .whitespacesAndNewlines)
        request.httpBody = "email=\(trimmedEmail.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? "")".data(using: .utf8)
        request.setValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")

        NetworkManager.shared.session.dataTask(with: request) { data, _, error in
            DispatchQueue.main.async {
                self.isLoading = false
                if let error = error { 
                    self.message = "Connection Error: \(error.localizedDescription)\nTarget: \(url.absoluteString)"
                    self.isSuccess = false; return 
                }
                guard let data = data, let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any], let status = json["status"] as? Bool else {
                    self.message = "Invalid server response"; self.isSuccess = false; return
                }
                if status {
                    self.isSuccess = true
                    withAnimation { self.currentStep = .otp }
                    self.message = json["message"] as? String ?? "OTP sent successfully. Please check your email."
                } else {
                    self.message = json["message"] as? String ?? "Failed to send OTP"; self.isSuccess = false
                }
            }
        }.resume()
    }
    
    func verifyOTP() {
        if otp.trimmingCharacters(in: .whitespaces).isEmpty {
            message = "Please enter the OTP"
            isSuccess = false; return
        }
        
        isLoading = true; message = ""
        let url = NetworkManager.shared.getURL(for: "verify_otp.php")
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.httpBody = "email=\(email.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? "")&otp=\(otp)".data(using: .utf8)
        request.setValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")

        NetworkManager.shared.session.dataTask(with: request) { data, _, error in
            DispatchQueue.main.async {
                self.isLoading = false
                if let error = error { 
                    self.message = "Connection Error: \(error.localizedDescription)\nTarget: \(url.absoluteString)"
                    self.isSuccess = false; return 
                }
                guard let data = data, let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any], let status = json["status"] as? Bool else {
                    self.message = "Invalid server response"; self.isSuccess = false; return
                }
                if status {
                    self.message = ""; self.isSuccess = false // Reset success state for the next step
                    withAnimation { self.currentStep = .newPassword }
                } else {
                    self.message = json["message"] as? String ?? "Invalid OTP"; self.isSuccess = false
                }
            }
        }.resume()
    }

    func resetPassword() {
        if newPassword.isEmpty || confirmPassword.isEmpty {
            message = "Please enter both passwords"; isSuccess = false; return
        }
        if !newPassword.isStrongPassword() {
            message = "Password must be at least 8 chars, 1 uppercase, 1 lowercase, 1 number, and 1 special character"; isSuccess = false; return
        }
        if newPassword != confirmPassword {
            message = "Passwords do not match"; isSuccess = false; return
        }
        
        isLoading = true; message = ""
        let url = NetworkManager.shared.getURL(for: "reset_password_otp.php")
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        let allowedCharacterSet = CharacterSet(charactersIn: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~")
        let encodedEmail = email.addingPercentEncoding(withAllowedCharacters: allowedCharacterSet) ?? ""
        let encodedPassword = newPassword.addingPercentEncoding(withAllowedCharacters: allowedCharacterSet) ?? ""
        
        request.httpBody = "email=\(encodedEmail)&new_password=\(encodedPassword)".data(using: .utf8)
        request.setValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")

        NetworkManager.shared.session.dataTask(with: request) { data, _, error in
            DispatchQueue.main.async {
                self.isLoading = false
                if let error = error { 
                    self.message = "Connection Error: \(error.localizedDescription)\nTarget: \(url.absoluteString)"
                    self.isSuccess = false; return 
                }
                guard let data = data, let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any], let status = json["status"] as? Bool else {
                    self.message = "Invalid server response"; self.isSuccess = false; return
                }
                if status {
                    self.message = json["message"] as? String ?? "Password reset successfully"
                    self.isSuccess = true
                    DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) { self.goToLogin = true }
                } else {
                    self.message = json["message"] as? String ?? "Reset failed"; self.isSuccess = false
                }
            }
        }.resume()
    }
}

#Preview {
    NavigationStack {
        ForgotPasswordView()
    }
}
