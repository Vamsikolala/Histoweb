import SwiftUI
import PhotosUI

struct AddDiseaseView: View {
    @StateObject private var navManager = AppNavigation.shared
    let patient: HQPatient
    let reportID: Int?
    
    @State private var reportType = ""
    @State private var diagnosis = ""
    @State private var notes = ""
    @State private var fullReport = ""
    @State private var isSaving = false
    @State private var isLoading = false
    @State private var message = ""
    @State private var isSuccess = false
    
    init(patient: HQPatient, reportID: Int? = nil) {
        self.patient = patient
        self.reportID = reportID
    }
    
    @AppStorage("doctor_id") private var doctorID: Int = 0
    
    @State private var selectedPhotos: [PhotosPickerItem] = []
    @State private var selectedImages: [UIImage] = []
    @State private var showCamera = false
    
    var body: some View {
        ZStack {
            Color(red: 245/255, green: 248/255, blue: 252/255)
                .ignoresSafeArea()
            
            VStack(spacing: 0) {
                StandardHeader(title: "Add Disease Report")
                
                ScrollView {
                    VStack(spacing: 20) {
                        VStack(alignment: .leading, spacing: 15) {
                            formField(label: "Report Type", placeholder: "e.g., Biopsy, Blood Test", text: $reportType)
                            formField(label: "Diagnosis", placeholder: "Enter diagnosis", text: $diagnosis)
                            
                            VStack(alignment: .leading, spacing: 8) {
                                Text("Notes")
                                    .font(.system(size: 15, weight: .bold))
                                TextEditor(text: $notes)
                                    .frame(height: 80)
                                    .padding(8)
                                    .background(Color.white)
                                    .cornerRadius(12)
                                    .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color.gray.opacity(0.1), lineWidth: 1))
                            }
                            
                            VStack(alignment: .leading, spacing: 8) {
                                Text("Full Report Content")
                                    .font(.system(size: 15, weight: .bold))
                                TextEditor(text: $fullReport)
                                    .frame(height: 150)
                                    .padding(8)
                                    .background(Color.white)
                                    .cornerRadius(12)
                                    .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color.gray.opacity(0.1), lineWidth: 1))
                            }
                        }
                        .padding(.horizontal, 16)
                        .padding(.vertical, 16)
                        .background(Color.white)
                        .cornerRadius(20)
                        .shadow(color: Color.black.opacity(0.03), radius: 5)
                        
                        VStack(alignment: .leading, spacing: 12) {
                            Text("Attach Photos")
                                .font(.system(size: 15, weight: .bold))
                            
                            HStack(spacing: 15) {
                                PhotosPicker(selection: $selectedPhotos, maxSelectionCount: 5, matching: .images) {
                                    VStack {
                                        Image(systemName: "photo.on.rectangle")
                                            .font(.title2)
                                        Text("Gallery")
                                            .font(.caption)
                                    }
                                    .frame(maxWidth: .infinity)
                                    .padding()
                                    .background(Color.blue.opacity(0.1))
                                    .cornerRadius(12)
                                }
                                
                                Button {
                                    showCamera = true
                                } label: {
                                    VStack {
                                        Image(systemName: "camera.fill")
                                            .font(.title2)
                                        Text("Camera")
                                            .font(.caption)
                                    }
                                    .frame(maxWidth: .infinity)
                                    .padding()
                                    .background(Color.green.opacity(0.1))
                                    .cornerRadius(12)
                                }
                            }
                            
                            if !selectedImages.isEmpty {
                                ScrollView(.horizontal, showsIndicators: false) {
                                    HStack {
                                        ForEach(0..<selectedImages.count, id: \.self) { index in
                                            ZStack(alignment: .topTrailing) {
                                                Image(uiImage: selectedImages[index])
                                                    .resizable()
                                                    .scaledToFill()
                                                    .frame(width: 80, height: 80)
                                                    .cornerRadius(10)
                                                
                                                Button {
                                                    selectedImages.remove(at: index)
                                                } label: {
                                                    Image(systemName: "xmark.circle.fill")
                                                        .foregroundColor(.red)
                                                        .background(Color.white.clipShape(Circle()))
                                                }
                                                .offset(x: 5, y: -5)
                                            }
                                        }
                                    }
                                    .padding(.top, 5)
                                }
                            }
                        }
                        .padding(.horizontal, 16)
                        .padding(.vertical, 16)
                        .background(Color.white)
                        .cornerRadius(20)
                        .shadow(color: Color.black.opacity(0.03), radius: 5)
                        
                        if !message.isEmpty {
                            Text(message)
                                .foregroundColor(isSuccess ? .green : .red)
                                .font(.subheadline)
                                .multilineTextAlignment(.center)
                                .padding()
                        }
                        
                        Button(action: submitReport) {
                            HStack {
                                if isSaving {
                                    ProgressView().tint(.white)
                                } else {
                                    Image(systemName: "checkmark.circle.fill")
                                    Text("Save Report")
                                }
                            }
                            .font(.headline)
                            .foregroundColor(.white)
                            .frame(maxWidth: .infinity)
                            .padding()
                            .background(reportType.isEmpty || diagnosis.isEmpty || fullReport.isEmpty ? Color.gray : Color.blue)
                            .cornerRadius(15)
                        }
                        .disabled(reportType.isEmpty || diagnosis.isEmpty || fullReport.isEmpty || isSaving)
                    }
                    .padding(.horizontal, 16)
                    .padding(.top, 12)
                    .padding(.bottom, 24)
                }
            }
            .ignoresSafeArea(edges: .top)
        }
        .navigationBarBackButtonHidden(true)
        .toolbar(.hidden, for: .navigationBar)
        .onChange(of: selectedPhotos) { newItems in
            for item in newItems {
                Task {
                    if let data = try? await item.loadTransferable(type: Data.self),
                       let uiImage = UIImage(data: data) {
                        DispatchQueue.main.async {
                            selectedImages.append(uiImage)
                        }
                    }
                }
            }
            selectedPhotos = []
        }
        .sheet(isPresented: $showCamera) {
            ImagePicker(sourceType: .camera) { image in
                selectedImages.append(image)
            }
        }
        .onAppear {
            if let rid = reportID {
                fetchExistingReport(rid)
            } else {
                // Start with empty fields for NEW report to avoid accidental duplicates
                reportType = ""
                diagnosis = ""
                notes = ""
                fullReport = ""
            }
        }
    }
    

    
    func fetchExistingReport(_ rid: Int) {
        isLoading = true
        let url = NetworkManager.shared.getURL(for: "patient_profile.php?patient_id=\(patient.patient_id)&doctor_id=\(doctorID)")
        
        URLSession.shared.dataTask(with: url) { data, response, error in
            DispatchQueue.main.async {
                isLoading = false
                if let data = data,
                   let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
                   let reports = json["reports"] as? [[String: Any]] {
                    
                    if let report = reports.first(where: { ($0["id"] as? Int) == rid }) {
                        self.reportType = report["report_type"] as? String ?? ""
                        self.diagnosis = report["diagnosis"] as? String ?? ""
                        self.notes = report["notes"] as? String ?? ""
                        self.fullReport = report["report"] as? String ?? ""
                    }
                }
            }
        }.resume()
    }
    
    @ViewBuilder
    func formField(label: String, placeholder: String, text: Binding<String>) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(label)
                .font(.system(size: 15, weight: .bold))
            TextField(placeholder, text: text)
                .padding()
                .background(Color(red: 0.98, green: 0.98, blue: 1.0))
                .cornerRadius(12)
                .overlay(RoundedRectangle(cornerRadius: 12).stroke(Color.gray.opacity(0.1), lineWidth: 1))
        }
    }
    
    func submitReport() {
        guard doctorID > 0 else {
            message = "Error: Doctor ID not found. Please log in again."
            isSuccess = false
            return
        }
        
        isSaving = true
        message = ""
        
        let url = NetworkManager.shared.getURL(for: "add_disease.php")
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        
        // Multipart boundary
        let boundary = "Boundary-\(UUID().uuidString)"
        request.setValue("multipart/form-data; boundary=\(boundary)", forHTTPHeaderField: "Content-Type")
        
        var body = Data()
        
        // Helper to add fields
        func addFormField(name: String, value: String) {
            body.append("--\(boundary)\r\n".data(using: .utf8)!)
            body.append("Content-Disposition: form-data; name=\"\(name)\"\r\n\r\n".data(using: .utf8)!)
            body.append("\(value)\r\n".data(using: .utf8)!)
        }
        
        addFormField(name: "doctor_id", value: "\(doctorID)")
        addFormField(name: "patient_id", value: patient.patient_id)
        if let rid = reportID {
            addFormField(name: "disease_id", value: "\(rid)")
        }
        addFormField(name: "report_type", value: reportType)
        addFormField(name: "diagnosis", value: diagnosis)
        addFormField(name: "notes", value: notes)
        addFormField(name: "report", value: fullReport)
        
        // Add images
        for (index, image) in selectedImages.enumerated() {
            if let imageData = image.jpegData(compressionQuality: 0.5) {
                body.append("--\(boundary)\r\n".data(using: .utf8)!)
                body.append("Content-Disposition: form-data; name=\"images[]\"; filename=\"img\(index).jpg\"\r\n".data(using: .utf8)!)
                body.append("Content-Type: image/jpeg\r\n\r\n".data(using: .utf8)!)
                body.append(imageData)
                body.append("\r\n".data(using: .utf8)!)
            }
        }
        
        // Multipart footer
        body.append("\r\n--\(boundary)--\r\n".data(using: .utf8)!)
        request.httpBody = body
        
        print("Sending multipart request to server...")
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            if let httpResponse = response as? HTTPURLResponse {
                print("Server Status Code: \(httpResponse.statusCode)")
            }
            DispatchQueue.main.async {
                isSaving = false
                if let error = error {
                    message = "Error: \(error.localizedDescription)"
                    isSuccess = false
                    return
                }
                
                guard let data = data else {
                    message = "No response from server"
                    isSuccess = false
                    return
                }
                
                do {
                    if let json = try JSONSerialization.jsonObject(with: data) as? [String: Any],
                       let status = json["status"] as? Bool {
                        if status {
                            message = json["message"] as? String ?? "Report saved successfully"
                            isSuccess = true
                            DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
                                navManager.navigateBack()
                            }
                        } else {
                            // 🔥 Show the EXACT error from the server
                            let serverMsg = json["message"] as? String ?? "Failed to save report"
                            let sqlError = json["sql_error"] as? String ?? ""
                            message = sqlError.isEmpty ? serverMsg : "\(serverMsg): \(sqlError)"
                            isSuccess = false
                        }
                    }
                } catch {
                    message = "Failed to parse server response"
                    isSuccess = false
                }
            }
        }.resume()
    }
}

#Preview {
    NavigationStack {
        AddDiseaseView(patient: HQPatient(patient_id: "ID-001", name: "John Doe", age: "45", gender: "Male", phone: "123", address: "123", doctorName: "Dr", reportType: "A", diagnosis: "B", notes: "C", fullReport: "Full Report Content", reportImages: [], reportDocuments: []))
    }
}

// ImagePicker for Camera
struct ImagePicker: UIViewControllerRepresentable {
    var sourceType: UIImagePickerController.SourceType = .photoLibrary
    var onImagePicked: (UIImage) -> Void

    func makeUIViewController(context: Context) -> UIImagePickerController {
        let picker = UIImagePickerController()
        picker.sourceType = sourceType
        picker.delegate = context.coordinator
        return picker
    }

    func updateUIViewController(_ uiViewController: UIImagePickerController, context: Context) {}

    func makeCoordinator() -> Coordinator {
        Coordinator(onImagePicked: onImagePicked)
    }

    class Coordinator: NSObject, UINavigationControllerDelegate, UIImagePickerControllerDelegate {
        var onImagePicked: (UIImage) -> Void

        init(onImagePicked: @escaping (UIImage) -> Void) {
            self.onImagePicked = onImagePicked
        }

        func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey : Any]) {
            if let image = info[.originalImage] as? UIImage {
                onImagePicked(image)
            }
            picker.dismiss(animated: true)
        }

        func imagePickerControllerDidCancel(_ picker: UIImagePickerController) {
            picker.dismiss(animated: true)
        }
    }
}
