import Foundation
import Combine

/// Centralized manager for handling all network requests
class NetworkManager: ObservableObject {
    static let shared = NetworkManager()
    
    // Manage your server details directly here in code
    @Published var ipAddress: String = "10.39.204.100"
    @Published var port: String = "8000"
    @Published var folderName: String = ""
    @Published var customBaseURL: String = ""
    @Published var useCustomURL: Bool = false
    
    /// Computed base URL
    var baseURL: String {
        if useCustomURL && !customBaseURL.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
            let urlStr = customBaseURL.trimmingCharacters(in: .whitespacesAndNewlines)
            if urlStr.lowercased().hasPrefix("http://") || urlStr.lowercased().hasPrefix("https://") {
                return urlStr
            }
            return "https://\(urlStr)"
        }
        
        let cleanIP = ipAddress.trimmingCharacters(in: .whitespacesAndNewlines)
        let portSuffix = (port.isEmpty || port == "80") ? "" : ":\(port)"
        let encodedFolder = folderName.trimmingCharacters(in: .whitespacesAndNewlines).addingPercentEncoding(withAllowedCharacters: .urlPathAllowed) ?? ""
        
        var base = "http://\(cleanIP)\(portSuffix)"
        if !encodedFolder.isEmpty {
            base += "/\(encodedFolder)"
        }
        return base
    }
    
    /// Custom session with increased timeout for hotspot connections
    let session: URLSession = {
        let config = URLSessionConfiguration.default
        config.timeoutIntervalForRequest = 60
        config.timeoutIntervalForResource = 90
        return URLSession(configuration: config)
    }()
    
    private init() {}

    
    /// Helper to construct full URLs safely
    func getURL(for endpoint: String) -> URL {
        let cleanEndpoint = endpoint.hasPrefix("/") ? String(endpoint.dropFirst()) : endpoint
        let fullURLString = "\(baseURL)/\(cleanEndpoint)"
        
        if let url = URL(string: fullURLString) {
            return url
        } else {
            // Safe fallback URL instead of crashing
            return URL(string: "http://localhost:8000/\(cleanEndpoint)") ?? URL(string: "http://localhost:8000")!
        }
    }
    
    /// Helper for standard POST requests with form-urlencoding
    func createPostRequest(url: URL, body: String) -> URLRequest {
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")
        request.httpBody = body.data(using: .utf8)
        return request
    }
}

