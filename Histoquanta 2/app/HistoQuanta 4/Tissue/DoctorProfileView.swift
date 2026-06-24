import SwiftUI
import PhotosUI

struct DoctorProfileView: View {
    @StateObject private var navManager = AppNavigation.shared
    
    @AppStorage("doctor_id") private var doctorID = 0
    @AppStorage("doctor_name") private var doctorName = ""
    @AppStorage("specialization") private var specialization = ""
    @AppStorage("licenseNumber") private var licenseNumber = ""
    @AppStorage("hospitalName") private var hospitalName = ""
    @AppStorage("email") private var email = ""
    @AppStorage("phoneNumber") private var phoneNumber = ""
    @AppStorage("profile_pic") private var profilePicURL = ""
    @AppStorage("cover_pic") private var coverPicURL = ""
    
    // Validation States
    @State private var nameError = ""
    @State private var phoneError = ""
    @State private var emailError = ""
    @State private var licenseError = ""
    @State private var generalError = ""
    
    @State private var isSaving = false
    @State private var saveMessage = ""
    @State private var isSuccess = false
    
    @State private var selectedItem: PhotosPickerItem?
    @State private var profileImage: UIImage?
    
    @State private var selectedCoverItem: PhotosPickerItem?
    @State private var coverImage: UIImage?
    
    @State private var showPhotoOptions = false
    @State private var showPhotoPicker = false
    @State private var showCoverOptions = false
    @State private var showCoverPicker = false
    @State private var showLogoutAlert = false
    
    @State private var isEditing = false
    
    var body: some View {
        ZStack(alignment: .top) {
            // Soft gradient background
            Color(red: 243/255, green: 245/255, blue: 250/255).ignoresSafeArea()
            
            VStack(spacing: 0) {
                // ── Fixed Header ──
                ZStack(alignment: .topTrailing) {
                    // Main Info Container
                    VStack {
                        HStack(spacing: 15) {
                            ZStack(alignment: .bottomTrailing) {
                                Group {
                                    if let image = profileImage {
                                        Image(uiImage: image)
                                            .resizable()
                                            .scaledToFill()
                                    } else if !profilePicURL.isEmpty {
                                        AsyncImage(url: NetworkManager.shared.getURL(for: "uploads/profiles/" + profilePicURL)) { phase in
                                            switch phase {
                                            case .empty: ProgressView()
                                            case .success(let img): img.resizable().scaledToFill()
                                            case .failure: Image(systemName: "person.circle.fill").resizable().foregroundColor(.white.opacity(0.9))
                                            @unknown default: EmptyView()
                                            }
                                        }
                                    } else {
                                        Image(systemName: "person.circle.fill")
                                            .resizable()
                                            .foregroundColor(.white.opacity(0.9))
                                    }
                                }
                                .frame(width: 85, height: 85)
                                .clipShape(Circle())
                                .overlay(Circle().stroke(Color.white, lineWidth: 2))
                                .shadow(radius: 5)
                                .onTapGesture {
                                    if isEditing {
                                        showPhotoOptions = true
                                    }
                                }
                                
                                if isEditing {
                                    Button {
                                        showPhotoOptions = true
                                    } label: {
                                        Image(systemName: "camera.fill")
                                            .font(.system(size: 11, weight: .bold))
                                            .foregroundColor(.blue)
                                            .padding(8)
                                            .background(Color.white)
                                            .clipShape(Circle())
                                            .shadow(radius: 3)
                                    }
                                    .offset(x: 2, y: 2)
                                }
                            }
                            
                            VStack(alignment: .leading, spacing: 4) {
                                Text(doctorName.isEmpty ? "Doctor Name" : doctorName)
                                    .font(.system(size: 24, weight: .bold))
                                    .foregroundColor(.white)
                                Text(specialization.isEmpty ? "Specialization" : specialization)
                                    .font(.subheadline)
                                    .foregroundColor(.white.opacity(0.9))
                                HStack(spacing: 4) {
                                    Image(systemName: "building.2")
                                        .font(.caption)
                                    Text(hospitalName.isEmpty ? "Hospital" : hospitalName)
                                        .font(.caption)
                                }
                                .foregroundColor(.white.opacity(0.8))
                            }
                            Spacer()
                        }
                        .padding(.horizontal, 20)
                        .padding(.top, 65) // Adjusted for safe area
                        
                        Spacer()
                    }
                    
                    // Edit Button
                    Button {
                        withAnimation(.spring()) {
                            if isEditing { isEditing = false }
                            else { isEditing = true; saveMessage = "" }
                        }
                    } label: {
                        Image(systemName: isEditing ? "xmark" : "square.and.pencil")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(.white)
                            .padding(10)
                            .background(Color.white.opacity(0.2))
                            .clipShape(Circle())
                    }
                    .padding(.trailing, 20)
                    .padding(.top, 70) // Adjusted for safe area
                }
                .background(
                    ZStack(alignment: .bottomTrailing) {
                        if let cImage = coverImage {
                            Image(uiImage: cImage)
                                .resizable()
                                .scaledToFill()
                                .frame(height: 215)
                                .clipped()
                        } else if !coverPicURL.isEmpty {
                            AsyncImage(url: NetworkManager.shared.getURL(for: "uploads/covers/" + coverPicURL)) { phase in
                                switch phase {
                                case .empty: ProgressView()
                                case .success(let img): img.resizable().scaledToFill()
                                case .failure: defaultCoverGradient
                                @unknown default: defaultCoverGradient
                                }
                            }
                        } else {
                            defaultCoverGradient
                        }
                        
                        if isEditing {
                            Button {
                                showCoverOptions = true
                            } label: {
                                HStack(spacing: 4) {
                                    Image(systemName: "photo.on.rectangle.angled")
                                    Text("Change Cover")
                                }
                                .font(.system(size: 10, weight: .bold))
                                .foregroundColor(.white)
                                .padding(.vertical, 6)
                                .padding(.horizontal, 10)
                                .background(Color.black.opacity(0.4))
                                .clipShape(Capsule())
                                .padding(12)
                            }
                        }
                    }
                    .frame(height: 215)
                    .clipShape(RoundedCorner(radius: 28, corners: [.bottomLeft, .bottomRight]))
                    .ignoresSafeArea(edges: .top)
                    .shadow(color: Color.blue.opacity(0.2), radius: 10, y: 5)
                )
                .frame(height: 215)

                // ── Scrollable Content ──
                ScrollView(showsIndicators: false) {
                    VStack(spacing: 22) {
                        if !isEditing {
                            viewModeContent
                        } else {
                            editModeContent
                        }
                        
                        logoutSection
                        
                        if isEditing {
                            Text("App Version 1.1.0")
                                .font(.system(size: 11, weight: .medium))
                                .foregroundColor(.gray.opacity(0.35))
                                .padding(.bottom, 12)
                        }
                    }
                    .padding(.top, 10)
                    .padding(.bottom, 20)
                }
            }
            .ignoresSafeArea(edges: .top)
        }
        .navigationBarHidden(true)
        .toolbar(.hidden, for: .navigationBar)
        .onAppear { fetchDoctorProfile() }
        .photosPicker(isPresented: $showPhotoPicker, selection: $selectedItem, matching: .images)
        .photosPicker(isPresented: $showCoverPicker, selection: $selectedCoverItem, matching: .images)
        .onChange(of: selectedItem) { newItem in loadImage(from: newItem) }
        .onChange(of: selectedCoverItem) { newItem in loadCoverImage(from: newItem) }
        .confirmationDialog("Change Profile Photo", isPresented: $showPhotoOptions) {
            Button("Select from Library") { showPhotoPicker = true }
            if profileImage != nil || !profilePicURL.isEmpty {
                Button("Remove Photo", role: .destructive) { removePhoto() }
            }
            Button("Cancel", role: .cancel) { }
        }
        .confirmationDialog("Change Cover Photo", isPresented: $showCoverOptions) {
            Button("Select from Gallery") { showCoverPicker = true }
            if coverImage != nil || !coverPicURL.isEmpty {
                Button("Remove Cover", role: .destructive) { removeCover() }
            }
            Button("Cancel", role: .cancel) { }
        }
        .alert("Logout", isPresented: $showLogoutAlert) {
            Button("Cancel", role: .cancel) { }
            Button("Log Out", role: .destructive) { logout() }
        } message: {
            Text("Are you sure you want to log out of your account?")
        }
    }
    
    // MARK: - Profile Card Section
    
    
    // MARK: - View Mode Content
    
    private var viewModeContent: some View {
        VStack(spacing: 22) {
            // Account & Security
            VStack(alignment: .leading, spacing: 12) {
                HStack(spacing: 6) {
                    Image(systemName: "lock.shield.fill")
                        .font(.system(size: 11, weight: .bold))
                        .foregroundColor(.blue)
                    Text("Account & Security")
                        .font(.system(size: 13, weight: .bold))
                        .foregroundColor(Color(red: 60/255, green: 80/255, blue: 120/255))
                }
                .padding(.leading, 8)
                VStack(spacing: 0) {
                    MenuRow(icon: "shield.fill", iconColor: .blue, title: "Privacy Policy", action: { navManager.navigate(to: .privacyPolicy) })
                    Divider().padding(.leading, 60)
                    MenuRow(icon: "doc.plaintext.fill", iconColor: .purple, title: "Terms & Conditions", action: { navManager.navigate(to: .termsAndConditions) })
                    Divider().padding(.leading, 60)
                    MenuRow(icon: "info.bubble.fill", iconColor: .cyan, title: "About", action: { navManager.navigate(to: .about) })
                }
                .background(Color.white)
                .cornerRadius(20)
                .shadow(color: Color(red: 60/255, green: 100/255, blue: 200/255).opacity(0.06), radius: 10, x: 0, y: 4)
            }
            
            // Contact Information
            VStack(alignment: .leading, spacing: 12) {
                HStack(spacing: 6) {
                    Image(systemName: "person.text.rectangle.fill")
                        .font(.system(size: 11, weight: .bold))
                        .foregroundColor(.purple)
                    Text("Contact Information")
                        .font(.system(size: 13, weight: .bold))
                        .foregroundColor(Color(red: 60/255, green: 80/255, blue: 120/255))
                }
                .padding(.leading, 8)
                VStack(spacing: 0) {
                    InfoRow(icon: "creditcard.fill", iconColor: .orange, title: "License", value: licenseNumber)
                    Divider().padding(.leading, 60)
                    InfoRow(icon: "envelope.fill", iconColor: .cyan, title: "Email", value: email)
                    Divider().padding(.leading, 60)
                    InfoRow(icon: "phone.fill", iconColor: .pink, title: "Phone", value: phoneNumber)
                }
                .background(Color.white)
                .cornerRadius(20)
                .shadow(color: Color(red: 60/255, green: 100/255, blue: 200/255).opacity(0.06), radius: 10, x: 0, y: 4)
            }
        }
        .padding(.horizontal, 20)
    }
    
    // MARK: - Edit Mode Content
    
    private var editModeContent: some View {
        VStack(spacing: 20) {
            VStack(spacing: 18) {
                ValidationEditField(icon: "person.fill", color: .blue, title: "Full Name", text: $doctorName, error: nameError, keyboardType: .default)
                    .onChange(of: doctorName) { nv in
                        let f = nv.filter { $0.isLetter || $0.isWhitespace || $0 == "." }
                        if f != nv { doctorName = f }; validateName()
                    }
                ValidationEditField(icon: "stethoscope", color: .purple, title: "Specialization", text: $specialization, error: "", keyboardType: .default)
                ValidationEditField(icon: "creditcard.fill", color: .orange, title: "License Number", text: $licenseNumber, error: licenseError, keyboardType: .default)
                    .onChange(of: licenseNumber) { nv in
                        let f = nv.filter { $0.isLetter || $0.isNumber }
                        if f != nv { licenseNumber = f }; validateLicense()
                    }
                ValidationEditField(icon: "cross.case.fill", color: .green, title: "Hospital/Clinic", text: $hospitalName, error: "", keyboardType: .default)
                ValidationEditField(icon: "envelope.fill", color: .cyan, title: "Email Address", text: $email, error: emailError, keyboardType: .emailAddress)
                    .onChange(of: email) { _ in validateEmail() }
                ValidationEditField(icon: "phone.fill", color: .pink, title: "Phone Number", text: $phoneNumber, error: phoneError, keyboardType: .numberPad)
                    .onChange(of: phoneNumber) { nv in
                        let d = nv.filter { $0.isNumber }
                        if d != nv { phoneNumber = d }
                        if phoneNumber.count > 10 { phoneNumber = String(phoneNumber.prefix(10)) }
                        validatePhone()
                    }
            }
            
            if !saveMessage.isEmpty {
                Text(saveMessage)
                    .foregroundColor(isSuccess ? .green : .red)
                    .font(.system(size: 14, weight: .bold))
                    .multilineTextAlignment(.center)
            }
            
            VStack(spacing: 10) {
                Button(action: saveProfile) {
                    HStack {
                        if isSaving { ProgressView().tint(.white) }
                        else { Image(systemName: "checkmark.circle.fill"); Text("Save Profile") }
                    }
                    .font(.system(size: 17, weight: .bold))
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity).frame(height: 54)
                    .background(LinearGradient(colors: [Color.blue, Color(red: 0.1, green: 0.4, blue: 0.9)], startPoint: .leading, endPoint: .trailing))
                    .cornerRadius(18)
                    .shadow(color: Color.blue.opacity(0.25), radius: 8, x: 0, y: 4)
                }.disabled(isSaving)
                
            }
        }
        .padding(.horizontal, 20)
    }
    
    // MARK: - Logout Section
    
    private var logoutSection: some View {
        Button(action: { showLogoutAlert = true }) {
            HStack(spacing: 10) {
                Image(systemName: "rectangle.portrait.and.arrow.right")
                    .font(.system(size: 16, weight: .bold))
                Text("Log Out").font(.system(size: 15, weight: .bold))
            }
            .foregroundColor(Color(red: 220/255, green: 60/255, blue: 60/255))
            .frame(maxWidth: .infinity).frame(height: 52)
            .background(
                RoundedRectangle(cornerRadius: 18)
                    .fill(Color(red: 255/255, green: 235/255, blue: 235/255))
                    .shadow(color: Color.red.opacity(0.06), radius: 6, x: 0, y: 3)
            )
            .overlay(RoundedRectangle(cornerRadius: 18).stroke(Color.red.opacity(0.08), lineWidth: 1))
        }
        .padding(.horizontal, 20)
        .padding(.top, 6)
    }
    
    // MARK: - Validation Logic
    
    private func validateName() {
        let nameRegex = "^[A-Za-z.\\s]+$"
        let predicate = NSPredicate(format: "SELF MATCHES %@", nameRegex)
        if doctorName.isEmpty {
            nameError = "Name cannot be empty"
        } else if !predicate.evaluate(with: doctorName) {
            nameError = "Only letters allowed"
        } else {
            nameError = ""
        }
    }
    
    private func validatePhone() {
        let phoneRegex = "^[0-9]{10}$"
        let predicate = NSPredicate(format: "SELF MATCHES %@", phoneRegex)
        if phoneNumber.isEmpty {
            phoneError = "Phone number required"
        } else if !predicate.evaluate(with: phoneNumber) {
            phoneError = "Must be 10 digits"
        } else {
            phoneError = ""
        }
    }
    
    private func validateEmail() {
        let emailRegex = "[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,64}"
        let predicate = NSPredicate(format: "SELF MATCHES %@", emailRegex)
        if email.isEmpty {
            emailError = "Email required"
        } else if !predicate.evaluate(with: email) {
            emailError = "Invalid email format"
        } else {
            emailError = ""
        }
    }
    
    private func validateLicense() {
        let licenseRegex = "^[A-Za-z0-9]+$"
        let predicate = NSPredicate(format: "SELF MATCHES %@", licenseRegex)
        if licenseNumber.isEmpty {
            licenseError = "License number required"
        } else if !predicate.evaluate(with: licenseNumber) {
            licenseError = "Alphanumeric only"
        } else {
            licenseError = ""
        }
    }
    
    private func isFormValid() -> Bool {
        validateName()
        validatePhone()
        validateEmail()
        validateLicense()
        return nameError.isEmpty && phoneError.isEmpty && emailError.isEmpty && licenseError.isEmpty
    }
    
    // MARK: - Helper Functions
    
    func loadImage(from item: PhotosPickerItem?) {
        guard let item = item else { return }
        Task {
            if let data = try? await item.loadTransferable(type: Data.self),
               let uiImage = UIImage(data: data) {
                await MainActor.run { profileImage = uiImage }
            }
        }
    }
    
    func removePhoto() {
        profileImage = nil
        selectedItem = nil
        profilePicURL = ""
    }
    
    func removeCover() {
        coverImage = nil
        selectedCoverItem = nil
        coverPicURL = ""
    }
    
    private var defaultCoverGradient: some View {
        LinearGradient(
            colors: [
                Color(red: 55/255, green: 100/255, blue: 220/255),
                Color(red: 80/255, green: 150/255, blue: 255/255)
            ],
            startPoint: .topLeading, endPoint: .bottomTrailing
        )
    }
    
    func loadCoverImage(from item: PhotosPickerItem?) {
        guard let item = item else { return }
        Task {
            if let data = try? await item.loadTransferable(type: Data.self),
               let uiImage = UIImage(data: data) {
                await MainActor.run { coverImage = uiImage }
            }
        }
    }
    
    func saveProfile() {
        guard isFormValid() else {
            saveMessage = "Please fix errors before saving"
            isSuccess = false
            return
        }
        
        isSaving = true
        saveMessage = ""
        
        let url = NetworkManager.shared.getURL(for: "update_doctor_profile.php")
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        
        let boundary = "Boundary-\(UUID().uuidString)"
        request.setValue("multipart/form-data; boundary=\(boundary)", forHTTPHeaderField: "Content-Type")
        
        var body = Data()
        
        func addFormField(name: String, value: String) {
            body.append("--\(boundary)\r\n".data(using: .utf8)!)
            body.append("Content-Disposition: form-data; name=\"\(name)\"\r\n\r\n".data(using: .utf8)!)
            body.append("\(value)\r\n".data(using: .utf8)!)
        }
        
        addFormField(name: "doctor_id", value: "\(doctorID)")
        addFormField(name: "name", value: doctorName)
        addFormField(name: "specialization", value: specialization)
        addFormField(name: "hospital_name", value: hospitalName)
        addFormField(name: "email", value: email)
        addFormField(name: "phone_number", value: phoneNumber)
        
        if let image = profileImage {
            if let imageData = image.jpegData(compressionQuality: 0.5) {
                body.append("--\(boundary)\r\n".data(using: .utf8)!)
                body.append("Content-Disposition: form-data; name=\"profile_pic\"; filename=\"profile.jpg\"\r\n".data(using: .utf8)!)
                body.append("Content-Type: image/jpeg\r\n\r\n".data(using: .utf8)!)
                body.append(imageData)
                body.append("\r\n".data(using: .utf8)!)
            }
        }
        
        if let cImage = coverImage {
            if let cImageData = cImage.jpegData(compressionQuality: 0.6) {
                body.append("--\(boundary)\r\n".data(using: .utf8)!)
                body.append("Content-Disposition: form-data; name=\"cover_pic\"; filename=\"cover.jpg\"\r\n".data(using: .utf8)!)
                body.append("Content-Type: image/jpeg\r\n\r\n".data(using: .utf8)!)
                body.append(cImageData)
                body.append("\r\n".data(using: .utf8)!)
            }
        }
        
        body.append("--\(boundary)--\r\n".data(using: .utf8)!)
        request.httpBody = body
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            DispatchQueue.main.async {
                isSaving = false
                if let error = error {
                    saveMessage = "Error: \(error.localizedDescription)"
                    isSuccess = false
                    return
                }
                
                guard let data = data,
                      let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
                      let status = json["status"] as? Bool else {
                    saveMessage = "Update failed"
                    isSuccess = false
                    return
                }
                
                if status {
                    saveMessage = "Profile updated successfully"
                    isSuccess = true
                    if let newPicURL = json["profile_pic"] as? String, !newPicURL.isEmpty {
                        self.profilePicURL = newPicURL
                        self.profileImage = nil
                        self.selectedItem = nil
                    }
                    if let newCoverURL = json["cover_pic"] as? String, !newCoverURL.isEmpty {
                        self.coverPicURL = newCoverURL
                        self.coverImage = nil
                        self.selectedCoverItem = nil
                    }
                    DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
                        withAnimation { isEditing = false }
                    }
                } else {
                    saveMessage = json["message"] as? String ?? "Error occurred"
                    isSuccess = false
                }
            }
        }.resume()
    }
    
    func logout() {
        doctorID = 0
        doctorName = ""
        specialization = ""
        licenseNumber = ""
        hospitalName = ""
        email = ""
        phoneNumber = ""
        profilePicURL = ""
        navManager.path.removeLast(navManager.path.count)
    }
    
    func fetchDoctorProfile() {
        guard !licenseNumber.isEmpty else { return }
        let url = NetworkManager.shared.getURL(for: "doctor_profile.php")
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.httpBody = "license_no=\(licenseNumber)&doctor_id=\(doctorID)".data(using: .utf8)
        request.setValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            if let data = data,
               let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
               let status = json["status"] as? Bool, status {
                DispatchQueue.main.async {
                    if let fetchedName = json["name"] as? String { self.doctorName = fetchedName }
                    if let spec = json["specialization"] as? String { self.specialization = spec }
                    if let hosp = json["hospital_name"] as? String { self.hospitalName = hosp }
                    if let mail = json["email"] as? String { self.email = mail }
                    if let phone = json["phone_number"] as? String { self.phoneNumber = phone }
                    if let pic = json["profile_pic"] as? String { self.profilePicURL = pic }
                }
            }
        }.resume()
    }
}

// MARK: - Supporting Views

struct MenuRow: View {
    var icon: String
    var iconColor: Color
    var title: String
    var action: () -> Void
    
    var body: some View {
        Button(action: action) {
            HStack(spacing: 16) {
                ZStack {
                    Circle()
                        .fill(iconColor.opacity(0.12))
                        .frame(width: 44, height: 44)
                    Image(systemName: icon)
                        .foregroundColor(iconColor)
                        .font(.system(size: 18, weight: .semibold))
                }
                
                Text(title)
                    .font(.system(size: 16, weight: .bold))
                    .foregroundColor(.black.opacity(0.8))
                
                Spacer()
                
                Image(systemName: "chevron.right")
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(.gray.opacity(0.4))
            }
            .padding(.vertical, 14)
            .padding(.horizontal, 16)
        }
    }
}

struct InfoRow: View {
    let icon: String
    var iconColor: Color = .blue
    let title: String
    let value: String
    
    var body: some View {
        HStack(spacing: 16) {
            ZStack {
                Circle().fill(iconColor.opacity(0.12))
                Image(systemName: icon).foregroundColor(iconColor).font(.system(size: 16, weight: .semibold))
            }.frame(width: 44, height: 44)
            
            VStack(alignment: .leading, spacing: 2) {
                Text(title).font(.system(size: 12)).foregroundColor(.gray)
                Text(value.isEmpty ? "Not set" : value).font(.system(size: 16, weight: .semibold)).foregroundColor(.black)
            }
            Spacer()
        }
        .padding(.vertical, 12)
        .padding(.horizontal, 16)
    }
}

struct ValidationEditField: View {
    let icon: String
    let color: Color
    let title: String
    @Binding var text: String
    let error: String
    var keyboardType: UIKeyboardType = .default
    var hint: String = ""
    
    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack {
                Text(title.uppercased()).font(.system(size: 11, weight: .bold)).foregroundColor(.gray)
                if !hint.isEmpty && error.isEmpty {
                    Spacer()
                    Text(hint).font(.system(size: 10, weight: .medium)).foregroundColor(.gray.opacity(0.6))
                }
                Spacer()
                if !error.isEmpty {
                    Text(error).font(.system(size: 11, weight: .bold)).foregroundColor(.red)
                }
            }.padding(.leading, 4)
            
            HStack(spacing: 12) {
                ZStack {
                    Circle().fill(color.opacity(0.1))
                    Image(systemName: icon).foregroundColor(color).font(.system(size: 16))
                }.frame(width: 40, height: 40)
                
                TextField("Enter \(title.lowercased())", text: $text)
                    .font(.system(size: 16, weight: .medium))
                    .keyboardType(keyboardType)
                    .autocorrectionDisabled(true)
            }
            .padding(.vertical, 10)
            .padding(.horizontal, 12)
            .background(Color.white)
            .cornerRadius(15)
            .overlay(
                RoundedRectangle(cornerRadius: 15)
                    .stroke(error.isEmpty ? Color.gray.opacity(0.1) : Color.red.opacity(0.3), lineWidth: 1.2)
            )
        }
    }
}

#Preview {
    NavigationStack {
        DoctorProfileView()
    }
}
