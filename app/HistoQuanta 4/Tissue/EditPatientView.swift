import SwiftUI

struct EditPatientView: View {
    @StateObject private var navManager = AppNavigation.shared
    
    let patient: HQPatient
    @AppStorage("doctor_id") private var doctorID: Int = 0
    
    @State private var name: String
    @State private var age: String
    @State private var gender: String
    @State private var phone: String
    @State private var address: String
    
    @State private var isSaving = false
    @State private var message = ""
    @State private var isSuccess = false
    
    let genderOptions = ["Male", "Female", "Other"]
    
    var onUpdate: (HQPatient) -> Void
    
    init(patient: HQPatient, onUpdate: @escaping (HQPatient) -> Void) {
        self.patient = patient
        self.onUpdate = onUpdate
        _name = State(initialValue: patient.name)
        _age = State(initialValue: patient.age)
        _gender = State(initialValue: patient.gender)
        _phone = State(initialValue: patient.phone)
        _address = State(initialValue: patient.address)
    }
    
    var body: some View {
        VStack(spacing: 0) {
            StandardHeader(title: "Edit Profile")
            
            ZStack {
                Color(red: 245/255, green: 248/255, blue: 252/255)
                    .ignoresSafeArea()
                
                ScrollView {
                    VStack(spacing: 20) {
                        // Profile Image Section
                        VStack(spacing: 12) {
                            ZStack {
                                Circle()
                                    .fill(Color.gray.opacity(0.12))
                                Image(systemName: "person.fill")
                                    .font(.system(size: 45))
                                    .foregroundColor(.gray.opacity(0.6))
                            }
                            .frame(width: 90, height: 90)
                            .overlay(Circle().stroke(Color.gray.opacity(0.1), lineWidth: 1))
                            
                            Text("Patient Profile")
                                .font(.system(size: 14, weight: .semibold))
                                .foregroundColor(.gray)
                        }
                        .padding(.top, 10)

                        VStack(alignment: .leading, spacing: 16) {
                            formField("Patient Name", text: $name, icon: "person")
                            formField("Age", text: $age, icon: "calendar")
                            genderView
                            formField("Phone Number", text: $phone, icon: "phone")
                            formField("Address", text: $address, icon: "location")
                        }
                        .padding(20)
                        .background(Color.white)
                        .cornerRadius(22)
                        .shadow(color: Color.black.opacity(0.05), radius: 10, x: 0, y: 4)
                        
                        if !message.isEmpty {
                            Text(message)
                                .font(.subheadline)
                                .foregroundColor(isSuccess ? .green : .red)
                                .multilineTextAlignment(.center)
                                .padding()
                        }
                        
                        Button(action: saveChanges) {
                            HStack {
                                if isSaving {
                                    ProgressView()
                                        .tint(.white)
                                        .padding(.trailing, 8)
                                } else {
                                    Image(systemName: "checkmark.circle.fill")
                                }
                                Text("Save Changes")
                                    .fontWeight(.semibold)
                            }
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(
                                LinearGradient(
                                    colors: [Color.blue, Color.cyan],
                                    startPoint: .leading,
                                    endPoint: .trailing
                                )
                            )
                            .cornerRadius(16)
                            .opacity(isSaving ? 0.7 : 1.0)
                        }
                        .disabled(isSaving)
                        
                        Spacer(minLength: 30)
                    }
                    .padding(.vertical, 12)
                    .padding(.horizontal, 20)
                }
            }
        }
        .ignoresSafeArea(edges: .top)
        .navigationBarBackButtonHidden(true)
        .toolbar(.hidden, for: .navigationBar)
    }


    
    var genderView: some View {
        VStack(alignment: .leading, spacing: 8) {
            Label("Gender", systemImage: "figure.stand")
                .font(.system(size: 15, weight: .semibold))
                .foregroundColor(.black)

            Picker("Gender", selection: $gender) {
                Text("Select Gender").tag("")
                ForEach(genderOptions, id: \.self) { option in
                    Text(option).tag(option)
                }
            }
            .pickerStyle(.menu)
            .tint(.black)
            .foregroundColor(.black)
            .frame(maxWidth: 300, alignment: .leading)
            .padding()
            .background(Color.white)
            .cornerRadius(14)
            .overlay(
                RoundedRectangle(cornerRadius: 14)
                    .stroke(Color.gray.opacity(0.12), lineWidth: 1)
            )
        }
    }

    @ViewBuilder
    func formField(_ title: String, text: Binding<String>, icon: String) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Label(title, systemImage: icon)
                .font(.system(size: 15, weight: .semibold))
                .foregroundColor(.black)

            TextField("Enter \(title)", text: text)
                .foregroundColor(.black)
                .padding()
                .background(Color.white)
                .cornerRadius(14)
                .overlay(
                    RoundedRectangle(cornerRadius: 14)
                        .stroke(Color.gray.opacity(0.12), lineWidth: 1)
                )
        }
    }
    
    func saveChanges() {
        guard !name.trimmingCharacters(in: .whitespaces).isEmpty else {
            message = "Name is required"
            isSuccess = false
            return
        }
        
        isSaving = true
        message = ""
        
        let url = NetworkManager.shared.getURL(for: "update_patient.php")
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        
        let encodedName = name.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? ""
        let encodedAge = age.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? ""
        let encodedGender = gender.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? ""
        let encodedPhone = phone.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? ""
        let encodedAddress = address.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? ""
        let encodedPatientID = patient.patient_id.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? ""
        
        let body = "patient_id=\(encodedPatientID)&doctor_id=\(doctorID)&name=\(encodedName)&age=\(encodedAge)&gender=\(encodedGender)&phone=\(encodedPhone)&address=\(encodedAddress)"
        request.httpBody = body.data(using: .utf8)
        request.setValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            DispatchQueue.main.async {
                isSaving = false
                if let error = error {
                    message = "Error: \(error.localizedDescription)"
                    isSuccess = false
                    return
                }
                
                if let data = data {
                    if let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any] {
                        if let status = json["status"] as? Bool, status {
                            isSuccess = true
                            message = "Profile updated successfully!"
                            
                            var updatedPatient = patient
                            updatedPatient.name = name
                            updatedPatient.age = age
                            updatedPatient.gender = gender
                            updatedPatient.phone = phone
                            updatedPatient.address = address
                            
                            onUpdate(updatedPatient)
                            
                            DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
                                navManager.navigateBack()
                            }
                        } else {
                            message = json["message"] as? String ?? "Failed to update profile"
                            isSuccess = false
                        }
                    } else {
                        // Not valid JSON, show raw response for debugging
                        let rawResponse = String(data: data, encoding: .utf8) ?? "Unknown response"
                        print("Server Error Response: \(rawResponse)")
                        message = "Server Error: \(rawResponse.prefix(100))"
                        isSuccess = false
                    }
                } else {
                    message = "No data received from server"
                    isSuccess = false
                }
            }
        }.resume()
    }
}
