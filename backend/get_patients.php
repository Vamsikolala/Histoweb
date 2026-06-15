<?php
include 'db.php';
header('Content-Type: application/json');

$doctor_id = intval($_GET['doctor_id'] ?? 0);

if ($doctor_id <= 0) {
    echo json_encode(["status" => false, "message" => "Doctor ID is required"]);
    exit;
}

// Fetch patients along with their most recent info from either 'disease' or 'patient_analysis_reports'
$query = "SELECT p.*,
                 d.report_type as d_type, d.diagnosis as d_diag, d.notes as d_notes, d.report as d_rep, d.created_at as d_at,
                 a.marker as a_type, a.tissue_type as a_diag, a.total_score as a_notes, a.inference as a_rep, a.created_at as a_at
          FROM patient p
          LEFT JOIN disease d ON d.disease_id = (
              SELECT disease_id FROM disease
              WHERE patient_id = p.patient_id
              ORDER BY created_at DESC
              LIMIT 1
          )
          LEFT JOIN patient_analysis_reports a ON a.id = (
              SELECT id FROM patient_analysis_reports
              WHERE patient_id = p.patient_id
              ORDER BY created_at DESC
              LIMIT 1
          )
          WHERE p.doctor_id = ?
          ORDER BY p.created_at DESC";

$stmt = $conn->prepare($query);
$stmt->bind_param("i", $doctor_id);
$stmt->execute();
$result = $stmt->get_result();

$patients = [];
while ($row = $result->fetch_assoc()) {
    // Determine which report is newer
    $d_time = !empty($row['d_at']) ? strtotime($row['d_at']) : 0;
    $a_time = !empty($row['a_at']) ? strtotime($row['a_at']) : 0;
    
    $useAnalysis = ($a_time > $d_time);
    
    $patients[] = [
        "id"         => strval($row["patient_id"]),
        "name"       => $row["name"],
        "age"        => strval($row["age"]),
        "gender"     => $row["gender"],
        "phone"      => $row["phone"] ?? "",
        "address"    => $row["address"] ?? "",
        "doctorName" => "", 
        "reportType" => $useAnalysis ? ($row['a_type'] ?? "") : ($row['d_type'] ?? ""),
        "diagnosis"  => $useAnalysis ? ($row['a_diag'] ?? "") : ($row['d_diag'] ?? ""),
        "notes"      => $useAnalysis ? ($row['a_notes'] ?? "") : ($row['d_notes'] ?? ""),
        "fullReport" => $useAnalysis ? ($row['a_rep'] ?? "") : ($row['d_rep'] ?? ""),
        "reportImages" => [],
        "reportDocuments" => []
    ];
}

echo json_encode([
    "status" => true,
    "data"   => $patients
]);

$stmt->close();
$conn->close();
?>
