import SwiftUI

struct NETguidelines: View {
    @StateObject private var navManager = AppNavigation.shared
    
    var body: some View {
        VStack(spacing: 0) {
            StandardHeader(title: "NET Reference")
            
            ScrollView(.vertical, showsIndicators: false) {
                VStack(alignment: .leading, spacing: 10) {
                    Text("Table 2. Types of Well-Differentiated Gastric Neuroendocrine Tumors")
                        .font(.system(size: 16, weight: .bold))
                        .foregroundColor(.black)
                        .padding(.horizontal, 16)
                        .padding(.top, 20)
                    
                    ScrollView(.horizontal, showsIndicators: true) {
                        VStack(spacing: 0) {
                            // Table Header Row
                            HStack(spacing: 0) {
                                headerCell("", width: 110)
                                headerCell("Type 1", width: 150)
                                headerCell("Type 2", width: 150)
                                headerCell("Type 3", width: 170)
                                headerCell("PPI-associated", width: 150)
                            }
                            .background(Color.blue.opacity(0.1))
                            
                            // Table Content Rows
                            VStack(spacing: 0) {
                                tableRow(label: "Frequency", t1: "66% of cases", t2: "2%", t3: "13% of cases", t4: "20%")
                                tableRow(label: "Multiplicity", t1: "Multifocal", t2: "Multifocal", t3: "Solitary", t4: "Single or multifocal")
                                tableRow(label: "Size", t1: "0.5-1.0 cm", t2: "~1.5 cm or less", t3: "Variable; one-third are larger than 2 cm", t4: "Generally small in size")
                                tableRow(label: "Location", t1: "Corpus", t2: "Corpus", t3: "Anywhere in stomach", t4: "Corpus")
                                tableRow(label: "Hypergastrinemia", t1: "Present", t2: "Present", t3: "Absent", t4: "Present")
                                tableRow(label: "Acid secretion", t1: "Low or absent", t2: "High", t3: "Normal", t4: "Unknown")
                                tableRow(label: "Association", t1: "Chronic atrophic gastritis", t2: "Multiple endocrine type 1 (MEN-1)", t3: "Sporadic", t4: "Long-term PPI use")
                                tableRow(label: "Background gastric mucosa", 
                                         t1: "Enterochromaffin-like (ECL) cell hyperplasia, partial or complete loss of parietal cells, intestinal metaplasia", 
                                         t2: "Parietal cell hyperplasia; ECL cell hyperplasia", 
                                         t3: "Usually normal", 
                                         t4: "Parietal cell hyperplasia; ECL cell hyperplasia; antral G cell hyperplasia")
                                tableRow(label: "Clinical Behavior", 
                                         t1: "Usually indolent: ~100% 5-year survival", 
                                         t2: "10-30% metastasize", 
                                         t3: "71% of tumors >2 cm with muscularis propria and vascular invasion have lymph node metastases", 
                                         t4: "Rarely metastasize; ~100% 5-year survival")
                                tableRow(label: "Demographic Profile", 
                                         t1: "70-80% are females in their 50s and 60s", 
                                         t2: "Equally in males and females, mean age 50 y", 
                                         t3: "More common in males, mean age 55 y", 
                                         t4: "Equally in males and females, in their 50s and 60s")
                            }
                        }
                        .overlay(
                            Rectangle()
                                .stroke(Color.black.opacity(0.15), lineWidth: 1)
                        )
                        .padding(.horizontal, 16)
                    }
                    .padding(.bottom, 40)
                }
            }
        }
        .ignoresSafeArea(edges: .top)
        .background(Color.white.ignoresSafeArea())
        .navigationBarBackButtonHidden(true)
        .toolbar(.hidden, for: .navigationBar)
    }
    

    
    func headerCell(_ text: String, width: CGFloat) -> some View {
        Text(text)
            .font(.system(size: 13, weight: .bold))
            .foregroundColor(.black)
            .padding(10)
            .frame(width: width, height: 50, alignment: .center)
            .border(Color.black.opacity(0.1), width: 0.5)
    }
    
    func tableRow(label: String, t1: String, t2: String, t3: String, t4: String) -> some View {
        HStack(spacing: 0) {
            // Label Header Column
            Text(label)
                .font(.system(size: 12, weight: .bold))
                .foregroundColor(.black)
                .padding(8)
                .frame(width: 110, alignment: .topLeading)
                .frame(minHeight: 70)
                .background(Color.blue.opacity(0.04))
                .border(Color.black.opacity(0.1), width: 0.5)
            
            // Value Columns
            contentCell(t1, width: 150)
            contentCell(t2, width: 150)
            contentCell(t3, width: 170)
            contentCell(t4, width: 150)
        }
    }
    
    func contentCell(_ text: String, width: CGFloat) -> some View {
        Text(text)
            .font(.system(size: 11))
            .foregroundColor(.black.opacity(0.8))
            .padding(8)
            .frame(width: width, alignment: .topLeading)
            .frame(minHeight: 70)
            .border(Color.black.opacity(0.1), width: 0.5)
            .fixedSize(horizontal: false, vertical: true)
    }
}

struct NETguidelines_Previews: PreviewProvider {
    static var previews: some View {
        NETguidelines()
    }
}
