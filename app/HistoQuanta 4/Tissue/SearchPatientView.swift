import SwiftUI

struct SearchPatientView: View {
    @StateObject private var navManager = AppNavigation.shared
    @State private var searchText = ""
    @State private var patients: [HQPatient] = []
    @State private var selectedPatient: HQPatient?
    @State private var errorMessage = ""
    @StateObject private var patientSession = PatientSessionManager.shared


    var filteredPatients: [HQPatient] {
        if searchText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
            return patients
        } else {
            return patients.filter {
                $0.patient_id.localizedCaseInsensitiveContains(searchText) ||
                $0.name.localizedCaseInsensitiveContains(searchText) ||
                $0.reportType.localizedCaseInsensitiveContains(searchText) ||
                $0.diagnosis.localizedCaseInsensitiveContains(searchText)
            }
        }
    }

    var body: some View {
        ZStack {
            Color(red: 245/255, green: 248/255, blue: 252/255)
                .ignoresSafeArea()

            VStack(spacing: 0) {
                StandardHeader(
                    title: "Patient Search",
                    subtitle: "Search by patient name, ID, or diagnosis",
                    iconName: "magnifyingglass",
                    showBackButton: false
                )

                HStack(spacing: 10) {
                    Image(systemName: "magnifyingglass")
                        .foregroundColor(.gray)

                    TextField("Search by name, report type, diagnosis", text: $searchText)
                        .foregroundColor(.black)
                        .accessibilityIdentifier("search-input")
                }
                                .padding(.vertical, 12)
                                .background(Color.white)
                                .cornerRadius(14)
                .overlay(
                    RoundedRectangle(cornerRadius: 14)
                        .stroke(Color.gray.opacity(0.12), lineWidth: 1)
                )
                .padding(.horizontal)
                .padding(.top, 20) 

                if !errorMessage.isEmpty {
                    Text(errorMessage)
                        .foregroundColor(.red)
                        .font(.subheadline)
                        .padding()
                        .background(Color.red.opacity(0.1))
                        .cornerRadius(10)
                        .padding(.horizontal)
                }

                if patients.isEmpty && errorMessage.isEmpty {
                    Spacer()
                    VStack(spacing: 10) {
                        Image(systemName: "person.3.sequence")
                            .font(.system(size: 42))
                            .foregroundColor(.gray.opacity(0.7))

                        Text("No patients added yet")
                            .font(.headline)
                            .foregroundColor(.black)
                    }
                    Spacer()
                } else if filteredPatients.isEmpty {
                    Spacer()
                    Text("No matching patients found")
                        .font(.headline)
                        .foregroundColor(.black)
                    Spacer()
                } else {
                    ScrollView(showsIndicators: false) {
                        VStack(spacing: 14) {
                            ForEach(filteredPatients) { patient in
                                Button(action: {
                                    navManager.navigate(to: .patientProfile(patient: patient))
                                }) {
                                    patientCard(patient)
                                }
                                .buttonStyle(PlainButtonStyle())
                                .accessibilityIdentifier("search-patient-card-\(patient.patient_id)")
                            }
                        }
                        .padding(.horizontal)
                        .padding(.bottom, 20)
                    }
                }
            }
            .ignoresSafeArea(edges: .top)
        }
        .navigationBarBackButtonHidden(true)
        .onAppear {
            migrateLocalPatients()   // Upload old local patients to server first
            loadPatients()
        }
        .sheet(item: $selectedPatient) { patient in
            EditPatientView(patient: patient) { updatedPatient in
                HQPatientStorage.updatePatient(updatedPatient)
                loadPatients()
            }
        }
    }



    @ViewBuilder
    func patientCard(_ patient: HQPatient) -> some View {
        VStack(alignment: .leading, spacing: 14) {
            HStack(alignment: .top) {
                VStack(alignment: .leading, spacing: 4) {
                    Text(patient.name)
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(.black)

                    Text("ID: \(patient.patient_id)")
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(.blue)
                }

                Spacer()

                HStack(spacing: 8) {
                    Button(action: {
                        patientSession.selectPatient(patient)
                    }) {
                        HStack(spacing: 4) {
                            Image(systemName: "checkmark.circle.fill")
                            Text("Select")
                                .font(.system(size: 13, weight: .bold))
                        }
                        .foregroundColor(.white)
                        .padding(.horizontal, 12)
                        .padding(.vertical, 6)
                        .background(Color.green)
                        .cornerRadius(20)
                    }

                    Button(action: {
                        deletePatient(patient.id)
                    }) {
                        Image(systemName: "trash")
                            .foregroundColor(.red)
                            .padding(8)
                            .background(Color.red.opacity(0.1))
                            .clipShape(Circle())
                    }
                }
            }
            
            Divider()

            HStack(alignment: .top) {
                VStack(alignment: .leading, spacing: 2) {
                    Text("Report Type")
                        .font(.system(size: 11, weight: .bold))
                        .foregroundColor(.gray)
                    Text(patient.reportType)
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(.black)
                }
                
                Spacer()
                
                VStack(alignment: .trailing, spacing: 2) {
                    Text("Diagnosis")
                        .font(.system(size: 11, weight: .bold))
                        .foregroundColor(.gray)
                    Text(patient.diagnosis)
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(.black)
                }
            }
        }
        .padding(16)
        .background(Color.white)
        .cornerRadius(18)
        .shadow(color: Color.black.opacity(0.05), radius: 8, x: 0, y: 3)
        .swipeActions(edge: .trailing) {
            Button(role: .destructive) {
                deletePatient(patient.id)
            } label: {
                Label("Delete", systemImage: "trash")
            }
        }
    }

    @ViewBuilder
    func fileRow(path: String) -> some View {
        let url = URL(fileURLWithPath: path)

        HStack {
            Image(systemName: "doc")
                .foregroundColor(.black)

            Text(fileName(from: path))
                .font(.system(size: 13))
                .foregroundColor(.black)
                .lineLimit(1)

            Spacer()

            ShareLink(item: url) {
                HStack(spacing: 4) {
                    Image(systemName: "arrow.down.circle")
                    Text("Download")
                }
                .font(.system(size: 12, weight: .medium))
                .foregroundColor(.blue)
            }
        }
        .padding(.vertical, 4)
    }

    @ViewBuilder
    func infoRow(_ title: String, _ value: String) -> some View {
        VStack(alignment: .leading, spacing: 3) {
            Text(title)
                .font(.system(size: 12, weight: .semibold))
                .foregroundColor(.black)

            Text(value.isEmpty ? "-" : value)
                .font(.system(size: 14))
                .foregroundColor(.black)
        }
    }

    @AppStorage("doctor_id") private var doctorID: Int = 0

    // ── One-time migration: upload locally-saved patients to the server ──
    func migrateLocalPatients() {
        let localPatients = HQPatientStorage.loadPatients()
        guard !localPatients.isEmpty else { return }

        let queue = DispatchQueue(label: "migration.counter")
        var successCount = 0
        var doneCount    = 0
        let total        = localPatients.count
        var migrationStarted = false

        for patient in localPatients {
            // Ensure we have a valid doctor_id before migrating
            guard doctorID > 0 else {
                print("⚠️ Cannot migrate: doctorID is 0")
                return
            }
            
            if !migrationStarted {
                print("🔄 Migrating \(localPatients.count) local patient(s) to server...")
                migrationStarted = true
            }

            let addURL = NetworkManager.shared.getURL(for: "add_patient.php")

            var req = URLRequest(url: addURL)
            req.httpMethod = "POST"

            let enc: (String) -> String = {
                $0.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? ""
            }

            // Send WITHOUT patient_id so server auto-generates a fresh unique one
            let body = "name=\(enc(patient.name))&age=\(enc(patient.age))&gender=\(enc(patient.gender))&phone=\(enc(patient.phone))&address=\(enc(patient.address))&doctor_id=\(doctorID)"
            req.httpBody = body.data(using: .utf8)
            req.setValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")

            URLSession.shared.dataTask(with: req) { data, _, error in
                var patientUploadedID: String? = nil

                if let data = data,
                   let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
                   let status = json["status"] as? Bool, status,
                   let newID = json["patient_id"] as? String {
                    patientUploadedID = newID

                    // Upload disease report if present
                    if !patient.reportType.isEmpty || !patient.diagnosis.isEmpty || !patient.notes.isEmpty {
                        let diseaseURL = NetworkManager.shared.getURL(for: "add_disease.php")
                        var dreq = URLRequest(url: diseaseURL)
                        dreq.httpMethod = "POST"
                        let dbody = "doctor_id=\(self.doctorID)&patient_id=\(enc(newID))&report_type=\(enc(patient.reportType))&diagnosis=\(enc(patient.diagnosis))&notes=\(enc(patient.notes))&report=\(enc(patient.fullReport))"
                        dreq.httpBody = dbody.data(using: .utf8)
                        dreq.setValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")
                        URLSession.shared.dataTask(with: dreq) { _, _, _ in }.resume()
                    }
                } else {
                    print("⚠️ Failed to upload: \(patient.name) — \(String(data: data ?? Data(), encoding: .utf8) ?? "no data")")
                }

                // Thread-safe counter
                queue.sync {
                    if patientUploadedID != nil { 
                        successCount += 1 
                        
                        // Remove successfully uploaded patient from local storage immediately to prevent duplicates
                        DispatchQueue.main.async {
                            var currentLocals = HQPatientStorage.loadPatients()
                            currentLocals.removeAll(where: { $0.id == patient.id })
                            HQPatientStorage.savePatients(currentLocals)
                        }
                    }
                    doneCount += 1

                    if doneCount == total {
                        print("🏁 Migration processed: \(successCount)/\(total) successfully uploaded")
                        
                        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
                            self.loadPatients()
                        }
                    }
                }
            }.resume()
        }
    }

    func loadPatients() {
        guard doctorID > 0 else { return }
        
        let url = NetworkManager.shared.getURL(for: "get_patients.php?doctor_id=\(doctorID)")
        
        URLSession.shared.dataTask(with: url) { data, response, error in
            DispatchQueue.main.async {
                if let error = error {
                    self.errorMessage = "Connection Error: \(error.localizedDescription)"
                    print("Fetch error: \(error.localizedDescription)")
                    return
                }
                
                guard let data = data else {
                    self.errorMessage = "Empty response from server"
                    return
                }
                
                do {
                    if let json = try JSONSerialization.jsonObject(with: data) as? [String: Any],
                       let status = json["status"] as? Bool {
                        
                        if status, let patientListData = json["data"] as? [[String: Any]] {
                            self.errorMessage = "" // Clear error on success
                            
                            let serverPatients = patientListData.compactMap { row -> HQPatient? in
                                return HQPatient(
                                    patient_id: row["id"] as? String ?? "",
                                    name: row["name"] as? String ?? "",
                                    age: row["age"] as? String ?? "",
                                    gender: row["gender"] as? String ?? "",
                                    phone: row["phone"] as? String ?? "",
                                    address: row["address"] as? String ?? "",
                                    doctorName: row["doctorName"] as? String ?? "",
                                    reportType: row["reportType"] as? String ?? "",
                                    diagnosis: row["diagnosis"] as? String ?? "",
                                    notes: row["notes"] as? String ?? "",
                                    fullReport: row["fullReport"] as? String ?? "",
                                    reportImages: row["reportImages"] as? [String] ?? [],
                                    reportDocuments: row["reportDocuments"] as? [String] ?? []
                                )
                            }
                            
                            // Also load any local patients that haven't been successfully synced yet
                            let localPatients = HQPatientStorage.loadPatients()
                            
                            self.patients = serverPatients + localPatients
                        } else {
                            self.errorMessage = json["message"] as? String ?? "Failed to load"
                        }
                    }
                } catch {
                    self.errorMessage = "Data parsing error"
                    print("Parsing error: \(error)")
                }
            }
        }.resume()

    }

    func deletePatient(_ id: String) {
        guard doctorID > 0 else {
            print("Delete failed: Doctor not logged in")
            return
        }
        
        let url = NetworkManager.shared.getURL(for: "delete_patient.php")
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        
        let body = "patient_id=\(id)&doctor_id=\(doctorID)"
        request.httpBody = body.data(using: .utf8)
        request.setValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")
        
        print("🗑 Deleting patient ID: \(id) from server...")
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            DispatchQueue.main.async {
                if let error = error {
                    print("Delete error: \(error.localizedDescription)")
                    return
                }
                
                if let data = data,
                   let json = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
                   let status = json["status"] as? Bool, status {
                    print("✅ Patient \(id) deleted from server.")
                    // Remove from local list to reflect UI
                    self.patients.removeAll { $0.id == id }
                } else {
                    let msg = (data != nil) ? String(data: data!, encoding: .utf8) : "No data"
                    print("❌ Failed to delete patient: \(msg ?? "Unknown error")")
                }
            }
        }.resume()
    }

    func fileName(from path: String) -> String {
        URL(fileURLWithPath: path).lastPathComponent
    }
}

#Preview {
    NavigationStack {
        SearchPatientView()
    }
}
