import SwiftUI
import Foundation
import PhotosUI
import UniformTypeIdentifiers

struct HQPatient: Identifiable, Codable {
    var id: String { patient_id } // Map patient_id to id for Identifiable
    var patient_id: String
    var name: String
    var age: String
    var gender: String
    var phone: String
    var address: String
    var doctorName: String
    var reportType: String
    var diagnosis: String
    var notes: String
    var fullReport: String
    var reportImages: [String]
    var reportDocuments: [String]
}

final class HQPatientStorage {
    static let key = "savedHQPatients"

    static func savePatients(_ patients: [HQPatient]) {
        do {
            let data = try JSONEncoder().encode(patients)
            UserDefaults.standard.set(data, forKey: key)
        } catch {
            print("Save error: \(error)")
        }
    }

    static func loadPatients() -> [HQPatient] {
        guard let data = UserDefaults.standard.data(forKey: key) else {
            return []
        }

        do {
            return try JSONDecoder().decode([HQPatient].self, from: data)
        } catch {
            print("Load error: \(error)")
            return []
        }
    }

    static func addPatient(_ patient: HQPatient) {
        var patients = loadPatients()
        patients.append(patient)
        savePatients(patients)
    }

    static func updatePatient(_ updatedPatient: HQPatient) {
        var patients = loadPatients()
        if let index = patients.firstIndex(where: { $0.id == updatedPatient.id }) {
            patients[index] = updatedPatient
            savePatients(patients)
        }
    }

    static func deletePatient(id: String) {
        var patients = loadPatients()
        patients.removeAll { $0.id == id }
        savePatients(patients)
    }
}

struct AddPatientView: View {
    @StateObject private var navManager = AppNavigation.shared
    @AppStorage("doctor_id") private var doctorID = 0
    @AppStorage("doctor_name") private var doctorNameStored = ""

    @State private var patientID = "Loading..."
    @State private var patientName = ""
    @State private var age = ""
    @State private var gender = ""
    @State private var phone = ""
    @State private var address = ""
    @State private var doctorName = ""
    @State private var reportType = ""
    @State private var diagnosis = ""
    @State private var notes = ""
    @State private var saveMessage = ""
    @State private var showSuccess = false
    @StateObject private var patientSession = PatientSessionManager.shared

    @State private var selectedPhotos: [PhotosPickerItem] = []
    @State private var reportImagePaths: [String] = []
    @State private var reportDocumentPaths: [String] = []
    @State private var showDocumentPicker = false

    let genderOptions = ["Male", "Female", "Other"]

    var body: some View {
        ZStack(alignment: .top) {
            Color(red: 243/255, green: 245/255, blue: 250/255)
                .ignoresSafeArea()
            
            VStack(spacing: 0) {
                // Fixed Header Area
                StandardHeader(
                    title: "Patient Registry",
                    subtitle: "Register a new patient and assign diagnostic reports",
                    iconName: "person.badge.plus",
                    showBackButton: false
                )
                
                // Scrollable content area
                ScrollView(showsIndicators: false) {
                    VStack(spacing: 22) {
                        // ── Single Form Card ──
                        VStack(alignment: .leading, spacing: 18) {
                        
                        formField("Patient ID", text: $patientID, icon: "number", iconColor: .blue)
                        formField("Full Name", text: $patientName, icon: "person.fill", iconColor: .blue)
                        formField("Age", text: $age, icon: "calendar", iconColor: .orange)
                        genderView
                        
                        Divider().padding(.vertical, 2)
                        
                        formField("Phone Number", text: $phone, icon: "phone.fill", iconColor: .green)
                        formField("Address", text: $address, icon: "location.fill", iconColor: .purple)
                        
                        Divider().padding(.vertical, 2)
                        
                        formField("Doctor Name", text: $doctorName, icon: "stethoscope", iconColor: .cyan)
                        formField("Report Type", text: $reportType, icon: "doc.text.fill", iconColor: .orange)
                        formField("Diagnosis", text: $diagnosis, icon: "heart.text.square.fill", iconColor: .pink)
                        
                        VStack(alignment: .leading, spacing: 6) {
                            Text("Report Details")
                                .font(.system(size: 13, weight: .semibold))
                                .foregroundColor(.gray)
                            TextEditor(text: $notes)
                                .frame(height: 100)
                                .padding(10)
                                .background(Color(red: 248/255, green: 249/255, blue: 253/255))
                                .cornerRadius(14)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 14)
                                        .stroke(Color.gray.opacity(0.1), lineWidth: 1)
                                )
                        }
                        
                        Divider().padding(.vertical, 2)
                        
                        // Attachments
                        Text("Attachments")
                            .font(.system(size: 13, weight: .semibold))
                            .foregroundColor(.gray)
                        
                        HStack(spacing: 12) {
                            PhotosPicker(selection: $selectedPhotos, maxSelectionCount: 5, matching: .images) {
                                HStack(spacing: 6) {
                                    Image(systemName: "photo.on.rectangle.angled")
                                        .font(.system(size: 14, weight: .semibold))
                                    Text("Add Scan")
                                        .font(.system(size: 14, weight: .bold))
                                }
                                .foregroundColor(.white)
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 13)
                                .background(
                                    LinearGradient(colors: [Color.blue, Color(red: 60/255, green: 130/255, blue: 255/255)], startPoint: .leading, endPoint: .trailing)
                                )
                                .cornerRadius(14)
                            }

                            Button {
                                showDocumentPicker = true
                            } label: {
                                HStack(spacing: 6) {
                                    Image(systemName: "doc.badge.plus")
                                        .font(.system(size: 14, weight: .semibold))
                                    Text("Add Doc")
                                        .font(.system(size: 14, weight: .bold))
                                }
                                .foregroundColor(.white)
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 13)
                                .background(
                                    LinearGradient(colors: [Color.green, Color(red: 40/255, green: 180/255, blue: 100/255)], startPoint: .leading, endPoint: .trailing)
                                )
                                .cornerRadius(14)
                            }
                        }

                        if !reportImagePaths.isEmpty {
                            VStack(alignment: .leading, spacing: 6) {
                                Text("Scans (\(reportImagePaths.count))")
                                    .font(.system(size: 13, weight: .semibold))
                                    .foregroundColor(.secondary)
                                ForEach(reportImagePaths, id: \.self) { path in
                                    attachmentRow(title: fileName(from: path)) {
                                        reportImagePaths.removeAll { $0 == path }
                                    }
                                }
                            }
                        }

                        if !reportDocumentPaths.isEmpty {
                            VStack(alignment: .leading, spacing: 6) {
                                Text("Documents (\(reportDocumentPaths.count))")
                                    .font(.system(size: 13, weight: .semibold))
                                    .foregroundColor(.secondary)
                                ForEach(reportDocumentPaths, id: \.self) { path in
                                    attachmentRow(title: fileName(from: path)) {
                                        reportDocumentPaths.removeAll { $0 == path }
                                    }
                                }
                        }
                    }
                }
                    .padding(20)
                    .background(Color.white)
                    .cornerRadius(24)
                    .shadow(color: Color(red: 60/255, green: 100/255, blue: 200/255).opacity(0.07), radius: 14, x: 0, y: 6)
                    .padding(.horizontal, 16)
                    
                    // ── Status Message ──
                    if !saveMessage.isEmpty {
                        HStack(spacing: 8) {
                            Image(systemName: showSuccess ? "checkmark.circle.fill" : "exclamationmark.triangle.fill")
                                .foregroundColor(showSuccess ? .green : .red)
                            Text(saveMessage)
                                .font(.system(size: 14, weight: .medium))
                                .foregroundColor(showSuccess ? .green : .red)
                        }
                        .padding(12)
                        .frame(maxWidth: .infinity)
                        .background((showSuccess ? Color.green : Color.red).opacity(0.08))
                        .cornerRadius(12)
                        .padding(.horizontal, 20)
                    }
                    
                    // ── Save Button ──
                    Button(action: savePatient) {
                        HStack(spacing: 8) {
                            Image(systemName: "checkmark.circle.fill")
                                .font(.system(size: 18))
                            Text("Save Patient")
                                .font(.system(size: 17, weight: .bold))
                        }
                        .foregroundColor(.white)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 16)
                        .background(
                            LinearGradient(
                                colors: [Color(red: 55/255, green: 100/255, blue: 220/255), Color(red: 90/255, green: 160/255, blue: 255/255)],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .cornerRadius(18)
                        .shadow(color: Color.blue.opacity(0.2), radius: 8, x: 0, y: 4)
                    }
                    .padding(.horizontal, 20)

                }
                .padding(.bottom, 20)
            }
        }
        .ignoresSafeArea(edges: .top)
        .navigationBarBackButtonHidden(true)
        .toolbar(.hidden, for: .navigationBar)
        .onChange(of: selectedPhotos) { newItems in
            Task {
                await handleSelectedPhotos(newItems)
            }
        }
        .onChange(of: patientName) { newValue in
            let filtered = newValue.filter { "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ ".contains($0) }
            if filtered != newValue {
                self.patientName = filtered
            }
        }
        .onChange(of: phone) { newValue in
            let filtered = newValue.filter { "0123456789".contains($0) }
            let limited = String(filtered.prefix(10))
            if limited != newValue {
                self.phone = limited
            }
        }
        .fileImporter(
            isPresented: $showDocumentPicker,
            allowedContentTypes: [.pdf, .image, .plainText],
            allowsMultipleSelection: true
        ) { result in
            switch result {
            case .success(let urls):
                for url in urls {
                    if let savedPath = copyFileToDocuments(from: url) {
                        reportDocumentPaths.append(savedPath)
                    }
                }
            case .failure(let error):
                saveMessage = "Document import failed: \(error.localizedDescription)"
                showSuccess = false
            }
        }
        .onAppear {
            if doctorName.isEmpty { doctorName = doctorNameStored }
            fetchNextPatientID()
        }
    }
}


    
    // MARK: - Section Card
    
    @ViewBuilder
    func sectionCard<Content: View>(title: String, icon: String, iconColor: Color, @ViewBuilder content: () -> Content) -> some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack(spacing: 8) {
                Image(systemName: icon)
                    .font(.system(size: 12, weight: .bold))
                    .foregroundColor(iconColor)
                Text(title)
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(Color(red: 50/255, green: 60/255, blue: 90/255))
            }
            
            content()
        }
        .padding(18)
        .background(Color.white)
        .cornerRadius(22)
        .shadow(color: Color(red: 60/255, green: 100/255, blue: 200/255).opacity(0.06), radius: 12, x: 0, y: 5)
        .padding(.horizontal, 16)
    }

    var genderView: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text("Gender")
                .font(.system(size: 13, weight: .semibold))
                .foregroundColor(.gray)

            Picker("Gender", selection: $gender) {
                Text("Select Gender").tag("")
                ForEach(genderOptions, id: \.self) { option in
                    Text(option).tag(option)
                }
            }
            .pickerStyle(.menu)
            .tint(Color(red: 40/255, green: 50/255, blue: 80/255))
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(.vertical, 12)
            .padding(.horizontal, 14)
            .background(Color(red: 248/255, green: 249/255, blue: 253/255))
            .cornerRadius(14)
            .overlay(
                RoundedRectangle(cornerRadius: 14)
                    .stroke(Color.gray.opacity(0.1), lineWidth: 1)
            )
        }
    }

    @ViewBuilder
    func formField(_ title: String, text: Binding<String>, icon: String, iconColor: Color = .blue) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(title)
                .font(.system(size: 13, weight: .semibold))
                .foregroundColor(.gray)

            HStack(spacing: 12) {
                ZStack {
                    Circle()
                        .fill(iconColor.opacity(0.1))
                        .frame(width: 36, height: 36)
                    Image(systemName: icon)
                        .font(.system(size: 14))
                        .foregroundColor(iconColor)
                }
                
                TextField("Enter \(title.lowercased())", text: text)
                    .font(.system(size: 15, weight: .medium))
                    .foregroundColor(Color(red: 30/255, green: 40/255, blue: 70/255))
            }
            .padding(.vertical, 10)
            .padding(.horizontal, 12)
            .background(Color(red: 248/255, green: 249/255, blue: 253/255))
            .cornerRadius(14)
            .overlay(
                RoundedRectangle(cornerRadius: 14)
                    .stroke(Color.gray.opacity(0.1), lineWidth: 1)
            )
        }
    }

    @ViewBuilder
    func attachmentRow(title: String, onDelete: @escaping () -> Void) -> some View {
        HStack {
            Image(systemName: "paperclip")
                .foregroundColor(.black)

            Text(title)
                .lineLimit(1)
                .font(.system(size: 14))
                .foregroundColor(.black)

            Spacer()

            Button(action: onDelete) {
                Image(systemName: "xmark.circle.fill")
                    .foregroundColor(.red)
            }
        }
        .padding(.vertical, 6)
    }


    func fetchNextPatientID() {
        let url = NetworkManager.shared.getURL(for: "get_next_patient_id.php?doctor_id=\(doctorID)")

        URLSession.shared.dataTask(with: url) { data, response, error in
            if let error = error {
                print("Network error fetching ID: \(error.localizedDescription)")
                return
            }

            if let data = data {
                if let rawJSON = String(data: data, encoding: .utf8) {
                    print("Received ID response: \(rawJSON)")
                }

                if let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
                   let status = json["status"] as? Bool, status,
                   let nextID = json["next_id"] as? String {
                    DispatchQueue.main.async {
                        self.patientID = nextID
                        print("Updated patientID to: \(nextID)")
                    }
                } else {
                    print("Could not parse next_id from JSON")
                }
            }
        }.resume()
    }

    func savePatient() {
        let trimmedName = patientName.trimmingCharacters(in: .whitespacesAndNewlines)
        let trimmedAge = age.trimmingCharacters(in: .whitespacesAndNewlines)
        let trimmedGender = gender.trimmingCharacters(in: .whitespacesAndNewlines)
        
        if trimmedName.isEmpty || trimmedAge.isEmpty || trimmedGender.isEmpty {
            saveMessage = "Please fill required fields"
            showSuccess = false
            return
        }

        // Validate Name (letters and spaces only)
        let nameRegex = "^[a-zA-Z\\s]+$"
        let namePredicate = NSPredicate(format: "SELF MATCHES %@", nameRegex)
        if !namePredicate.evaluate(with: trimmedName) {
            saveMessage = "Patient name must contain only letters"
            showSuccess = false
            return
        }

        // Validate Phone (exactly 10 digits and only numbers if provided)
        let trimmedPhone = phone.trimmingCharacters(in: .whitespacesAndNewlines)
        if !trimmedPhone.isEmpty {
            let cleanPhone = trimmedPhone.components(separatedBy: CharacterSet.decimalDigits.inverted).joined()
            if cleanPhone.count != 10 || cleanPhone.count != trimmedPhone.count {
                saveMessage = "Phone must be exactly 10 digits with no characters"
                showSuccess = false
                return
            }
        }

        guard doctorID > 0 else {
            saveMessage = "Error: Doctor not logged in"
            showSuccess = false
            return
        }

        // 1. Add Patient
        let addPatientURL = NetworkManager.shared.getURL(for: "add_patient.php")
        var patientRequest = URLRequest(url: addPatientURL)
        patientRequest.httpMethod = "POST"
        
        // URL Encode all string parameters
        let encodedID = patientID.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? ""
        let encodedName = patientName.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? ""
        let encodedAge = age.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? ""
        let encodedGender = gender.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? ""
        let encodedPhone = phone.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? ""
        let encodedAddress = address.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? ""
        
        let patientBody = "patient_id=\(encodedID)&name=\(encodedName)&age=\(encodedAge)&gender=\(encodedGender)&phone=\(encodedPhone)&address=\(encodedAddress)&doctor_id=\(doctorID)"
        patientRequest.httpBody = patientBody.data(using: .utf8)
        patientRequest.setValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")

        URLSession.shared.dataTask(with: patientRequest) { data, response, error in
            DispatchQueue.main.async {
                if let error = error {
                    saveMessage = "Error: \(error.localizedDescription)"
                    showSuccess = false
                    return
                }
                
                guard let data = data,
                      let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
                      let status = json["status"] as? Bool else {
                    saveMessage = "Unexpected server response"
                    showSuccess = false
                    return
                }

                if !status {
                    saveMessage = json["message"] as? String ?? "Failed to add patient"
                    showSuccess = false
                    return
                }

                let patientID_returned: String
                if let idString = json["patient_id"] as? String {
                    patientID_returned = idString
                } else if let idInt = json["patient_id"] as? Int {
                    patientID_returned = String(idInt)
                } else {
                    saveMessage = "Server did not return patient ID"
                    showSuccess = false
                    return
                }

                // 2. Add Disease Report
                self.saveDiseaseReport(savedPatientID: patientID_returned)
            }
        }.resume()
    }

    func saveDiseaseReport(savedPatientID: String) {
        let addDiseaseURL = NetworkManager.shared.getURL(for: "add_disease.php")
        var diseaseRequest = URLRequest(url: addDiseaseURL)
        diseaseRequest.httpMethod = "POST"
        
        let boundary = "Boundary-\(UUID().uuidString)"
        diseaseRequest.setValue("multipart/form-data; boundary=\(boundary)", forHTTPHeaderField: "Content-Type")
        
        // Construct detailed report content
        let fullReport = "Diagnosis: \(diagnosis)\nNotes: \(notes)\nReport Type: \(reportType)"
        
        // Prepare parameters
        let params: [String: String] = [
            "doctor_id": "\(doctorID)",
            "patient_id": savedPatientID,
            "report_type": reportType,
            "diagnosis": diagnosis,
            "notes": notes,
            "report": fullReport
        ]
        
        // Collect Image Data
        var imageDataList: [Data] = []
        for path in reportImagePaths {
            let url = URL(fileURLWithPath: path)
            if let data = try? Data(contentsOf: url) {
                imageDataList.append(data)
            }
        }
        
        // Create the multipart body
        diseaseRequest.httpBody = createMultipartBody(parameters: params, images: imageDataList, boundary: boundary)

        print("📤 Uploading disease report with \(imageDataList.count) images...")

        URLSession.shared.dataTask(with: diseaseRequest) { data, response, error in
            DispatchQueue.main.async {
                if let error = error {
                    saveMessage = "Patient added, but report failed: \(error.localizedDescription)"
                    print("Disease save error: \(error)")
                    showSuccess = false
                    return
                }
                
                // Debug log
                if let data = data, let str = String(data: data, encoding: .utf8) {
                    print("Server response (Disease): \(str)")
                }
                
                saveMessage = "Patient and report saved successfully"
                showSuccess = true
                
                // Select the patient for analysis
                let newPatient = HQPatient(
                    patient_id: savedPatientID,
                    name: patientName,
                    age: age,
                    gender: gender,
                    phone: phone,
                    address: address,
                    doctorName: doctorName,
                    reportType: reportType,
                    diagnosis: diagnosis,
                    notes: notes,
                    fullReport: fullReport,
                    reportImages: reportImagePaths,
                    reportDocuments: reportDocumentPaths
                )
                patientSession.selectPatient(newPatient)
                
                // Clear fields
                self.patientName = ""
                self.age = ""
                self.gender = ""
                self.phone = ""
                self.address = ""
                self.doctorName = ""
                self.reportType = ""
                self.diagnosis = ""
                self.notes = ""
                self.reportImagePaths = []
                self.reportDocumentPaths = []
                self.selectedPhotos = []
                
                // Fetch next ID for next entry
                fetchNextPatientID()
            }
        }.resume()
    }

    func createMultipartBody(parameters: [String: String], images: [Data], boundary: String) -> Data {
        var body = Data()
        let lineBreak = "\r\n"
        
        // Add text parameters
        for (key, value) in parameters {
            body.appendString("--\(boundary)\(lineBreak)")
            body.appendString("Content-Disposition: form-data; name=\"\(key)\"\(lineBreak)\(lineBreak)")
            body.appendString("\(value)\(lineBreak)")
        }
        
        // Add images
        for (index, imageData) in images.enumerated() {
            let filename = "image\(index).jpg"
            body.appendString("--\(boundary)\(lineBreak)")
            body.appendString("Content-Disposition: form-data; name=\"images[]\"; filename=\"\(filename)\"\(lineBreak)")
            body.appendString("Content-Type: image/jpeg\(lineBreak)\(lineBreak)")
            body.append(imageData)
            body.appendString(lineBreak)
        }
        
        body.appendString("--\(boundary)--\(lineBreak)")
        return body
    }

    func handleSelectedPhotos(_ items: [PhotosPickerItem]) async {
        for item in items {
            do {
                if let data = try await item.loadTransferable(type: Data.self),
                   let savedPath = saveDataToDocuments(data: data, fileExtension: "jpg") {
                    if !reportImagePaths.contains(savedPath) {
                        reportImagePaths.append(savedPath)
                    }
                }
            } catch {
                saveMessage = "Image load failed"
                showSuccess = false
            }
        }
    }

    func saveDataToDocuments(data: Data, fileExtension: String) -> String? {
        let fileName = UUID().uuidString + "." + fileExtension
        let url = documentsDirectory().appendingPathComponent(fileName)

        do {
            try data.write(to: url)
            return url.path
        } catch {
            print("File save error: \(error)")
            return nil
        }
    }

    func copyFileToDocuments(from sourceURL: URL) -> String? {
        let fileName = UUID().uuidString + "_" + sourceURL.lastPathComponent
        let destinationURL = documentsDirectory().appendingPathComponent(fileName)

        do {
            let access = sourceURL.startAccessingSecurityScopedResource()
            defer {
                if access { sourceURL.stopAccessingSecurityScopedResource() }
            }

            if FileManager.default.fileExists(atPath: destinationURL.path) {
                try FileManager.default.removeItem(at: destinationURL)
            }

            try FileManager.default.copyItem(at: sourceURL, to: destinationURL)
            return destinationURL.path
        } catch {
            print("Copy file error: \(error)")
            return nil
        }
    }

    func documentsDirectory() -> URL {
        FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
    }

    func fileName(from path: String) -> String {
        URL(fileURLWithPath: path).lastPathComponent
    }
}

#Preview {
    NavigationStack {
        AddPatientView()
    }
}

extension Data {
    mutating func appendString(_ string: String) {
        if let data = string.data(using: .utf8) {
            self.append(data)
        }
    }
}

