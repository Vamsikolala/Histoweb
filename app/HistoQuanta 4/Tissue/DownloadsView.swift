import SwiftUI
import PDFKit

struct DownloadsView: View {
    @State private var downloadedFiles: [URL] = []
    @State private var selectedFile: URL? = nil
    @StateObject private var navManager = AppNavigation.shared
    let filterPatientName: String?
    
    init(filterPatientName: String? = nil) {
        self.filterPatientName = filterPatientName
    }
    
    var body: some View {
        ZStack {
            Color(red: 245/255, green: 248/255, blue: 252/255)
                .ignoresSafeArea()
            
            VStack(spacing: 0) {
                StandardHeader(title: filterPatientName != nil ? "\(filterPatientName!)'s Reports" : "My Downloads")
                
                if downloadedFiles.isEmpty {
                    VStack(spacing: 20) {
                        Image(systemName: "folder.badge.minus")
                            .font(.system(size: 60))
                            .foregroundColor(.gray.opacity(0.3))
                        Text("No downloaded reports yet.")
                            .font(.headline)
                            .foregroundColor(.secondary)
                        Text("Go to a Patient Profile to download their analysis reports.")
                            .font(.subheadline)
                            .foregroundColor(.gray)
                            .multilineTextAlignment(.center)
                            .padding(.horizontal, 40)
                    }
                    .frame(maxHeight: .infinity)
                } else {
                    List {
                        ForEach(downloadedFiles, id: \.self) { url in
                            HStack(spacing: 15) {
                                // Tap to open file
                                Button {
                                    selectedFile = url
                                } label: {
                                    HStack(spacing: 15) {
                                        Image(systemName: "doc.fill")
                                            .font(.title3)
                                            .foregroundColor(.red)
                                            .frame(width: 40, height: 40)
                                            .background(Color.red.opacity(0.1))
                                            .cornerRadius(8)
                                        
                                        VStack(alignment: .leading, spacing: 4) {
                                            Text(url.lastPathComponent)
                                                .font(.system(size: 16, weight: .bold))
                                                .foregroundColor(.black)
                                            Text(getFileDate(url))
                                                .font(.caption)
                                                .foregroundColor(.secondary)
                                        }
                                    }
                                }
                                .buttonStyle(PlainButtonStyle())
                                
                                Spacer()
                                
                                // Explicit Delete Button
                                Button {
                                    deleteFile(url)
                                } label: {
                                    Image(systemName: "trash.fill")
                                        .font(.system(size: 16))
                                        .foregroundColor(.red)
                                        .frame(width: 36, height: 36)
                                        .background(Color.red.opacity(0.1))
                                        .clipShape(Circle())
                                }
                                .buttonStyle(PlainButtonStyle())
                                
                                Image(systemName: "chevron.right")
                                    .font(.caption)
                                    .foregroundColor(.gray)
                            }
                            .padding(.vertical, 8)
                            .swipeActions(edge: .trailing) {
                                Button(role: .destructive) {
                                    deleteFile(url)
                                } label: {
                                    Label("Delete", systemImage: "trash")
                                }
                            }
                        }
                    }
                    .listStyle(PlainListStyle())
                    .background(Color.clear)
                    .refreshable {
                        loadFiles()
                    }
                }
            }
            .ignoresSafeArea(edges: .top)
        }
        .onAppear(perform: loadFiles)
        .sheet(item: Binding(
            get: { selectedFile.map { IdentifiableURL(url: $0) } },
            set: { selectedFile = $0?.url }
        )) { idURL in
            NavigationStack {
                PDFKitView(url: idURL.url)
                    .navigationTitle("Report View")
                    .navigationBarTitleDisplayMode(.inline)
                    .toolbar {
                        ToolbarItem(placement: .navigationBarTrailing) {
                            Button("Close") { selectedFile = nil }
                        }
                    }
            }
        }
        .navigationBarBackButtonHidden(true)
    }
    
    private func loadFiles() {
        let documentsURL = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)[0]
        do {
            let fileURLs = try FileManager.default.contentsOfDirectory(at: documentsURL, includingPropertiesForKeys: [.contentModificationDateKey], options: .skipsHiddenFiles)
            
            // Filter only PDFs
            var filtered = fileURLs.filter { $0.pathExtension.lowercased() == "pdf" }
            
            if let filterName = filterPatientName {
                let normalized = filterName.replacingOccurrences(of: " ", with: "_").lowercased()
                filtered = filtered.filter { $0.lastPathComponent.lowercased().hasPrefix("report_\(normalized)_") }
            }
            
            // Sort by date
            downloadedFiles = filtered.sorted { url1, url2 in
                let date1 = (try? url1.resourceValues(forKeys: [.contentModificationDateKey]).contentModificationDate) ?? Date.distantPast
                let date2 = (try? url2.resourceValues(forKeys: [.contentModificationDateKey]).contentModificationDate) ?? Date.distantPast
                return date1 > date2
            }
        } catch {
            print("Error loading files: \(error)")
        }
    }
    
    private func deleteFile(_ url: URL) {
        do {
            try FileManager.default.removeItem(at: url)
            loadFiles()
        } catch {
            print("Error deleting file: \(error)")
        }
    }
    
    private func getFileDate(_ url: URL) -> String {
        let date = (try? url.resourceValues(forKeys: [.contentModificationDateKey]).contentModificationDate) ?? Date()
        let formatter = DateFormatter()
        formatter.dateStyle = .medium
        formatter.timeStyle = .short
        return formatter.string(from: date)
    }
    
    struct IdentifiableURL: Identifiable {
        var id: String { url.absoluteString }
        let url: URL
    }
}

#Preview {
    DownloadsView()
}
