import SwiftUI

struct StandardHeader<TrailingContent: View>: View {
    let title: String
    var subtitle: String? = nil
    var iconName: String? = nil
    var trailingContent: TrailingContent? = nil
    var showBackButton: Bool = true
    @StateObject private var navManager = AppNavigation.shared
    
    // Updated Initializers
    init(title: String, subtitle: String? = nil, iconName: String? = nil, showBackButton: Bool = true) where TrailingContent == EmptyView {
        self.title = title
        self.subtitle = subtitle
        self.iconName = iconName
        self.showBackButton = showBackButton
        self.trailingContent = nil
    }
    
    init(title: String, subtitle: String? = nil, iconName: String? = nil, showBackButton: Bool = true, @ViewBuilder trailingContent: () -> TrailingContent) {
        self.title = title
        self.subtitle = subtitle
        self.iconName = iconName
        self.showBackButton = showBackButton
        self.trailingContent = trailingContent()
    }
    
    var body: some View {
        ZStack {
            // Unified professional background gradient matching Dashboard
            LinearGradient(
                colors: [
                    Color.blue, 
                    Color(red: 40/255, green: 140/255, blue: 240/255)
                ],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
            .ignoresSafeArea(edges: .top)
            
            VStack(spacing: 0) {
                // Top Navigation Row
                HStack {
                    if showBackButton {
                        Button(action: { navManager.navigateBack() }) {
                            ZStack {
                                Circle()
                                    .fill(Color.white.opacity(0.18))
                                    .frame(width: 40, height: 40)
                                Image(systemName: "chevron.left")
                                    .font(.system(size: 18, weight: .bold))
                                    .foregroundColor(.white)
                            }
                        }
                    } else {
                        Color.clear.frame(width: 40, height: 40)
                    }
                    
                    Spacer()
                    
                    if let trailing = trailingContent {
                        trailing.frame(width: 40, height: 40)
                    } else {
                        Color.clear.frame(width: 40, height: 40)
                    }
                }
                .padding(.horizontal, 22)
                .padding(.top, 55)
                
                // Main Header Content
                VStack(spacing: 6) {
                    if let icon = iconName {
                        Image(systemName: icon)
                            .font(.system(size: 32, weight: .bold))
                            .foregroundColor(.white.opacity(0.9))
                            .padding(.bottom, 4)
                    }
                    
                    Text(title)
                        .font(.system(size: 26, weight: .heavy, design: .rounded))
                        .foregroundColor(.white)
                        .multilineTextAlignment(.center)
                    
                    if let sub = subtitle {
                        Text(sub)
                            .font(.system(size: 15, weight: .medium))
                            .foregroundColor(.white.opacity(0.85))
                            .multilineTextAlignment(.center)
                            .padding(.horizontal, 40)
                    }
                }
                .padding(.top, iconName == nil ? 10 : 0)
                
                Spacer()
            }
        }
        .frame(height: 215)
        .clipShape(RoundedCorner(radius: 28, corners: [.bottomLeft, .bottomRight]))
        .shadow(color: Color.blue.opacity(0.15), radius: 10, y: 5)
    }
}

#Preview {
    VStack {
        StandardHeader(title: "Breast Analysis")
        Spacer()
    }
    .background(Color.gray.opacity(0.1))
}
