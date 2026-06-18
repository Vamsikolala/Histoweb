<?php
include 'db.php';
header('Content-Type: application/json');

// Accept doctor_id from GET param (iOS apps don't maintain PHP sessions)
$doctor_id = intval($_GET['doctor_id'] ?? 0);
$patient_id = trim($_GET['patient_id'] ?? '');

if (empty($patient_id)) {
    echo json_encode(["status" => false, "message" => "Missing patient_id"]);
    exit;
}

// Fetch patient info - if doctor_id provided, validate ownership; otherwise just return patient
if ($doctor_id > 0) {
    $check = $conn->prepare("SELECT * FROM patient WHERE patient_id = ? AND doctor_id = ?");
    $check->bind_param("si", $patient_id, $doctor_id);
} else {
    $check = $conn->prepare("SELECT * FROM patient WHERE patient_id = ?");
    $check->bind_param("s", $patient_id);
}
$check->execute();
$patientResult = $check->get_result();

if ($patientResult->num_rows === 0) {
    echo json_encode(["status" => false, "message" => "Patient not found"]);
    exit;
}
$patient = $patientResult->fetch_assoc();

// Fetch ALL reports — auto-detect if it's a clinical analysis by checking report_type
$stmt = $conn->prepare("SELECT disease_id as id, report_type, diagnosis, notes, report, images, created_at,
    CASE WHEN report_type LIKE '%Analysis%' OR report_type LIKE '%Grading%' THEN 'analysis' ELSE 'medical' END as source,
    'disease' as table_name
    FROM disease WHERE patient_id = ? ORDER BY created_at DESC");
$stmt->bind_param("s", $patient_id);
$stmt->execute();
$diseaseResult = $stmt->get_result();
$reports = [];
while ($row = $diseaseResult->fetch_assoc()) {
    $reports[] = $row;
}

// Also check patient_analysis_reports table if it exists
$tableCheck = $conn->query("SHOW TABLES LIKE 'patient_analysis_reports'");
if ($tableCheck->num_rows > 0) {
    $stmt2 = $conn->prepare("SELECT id, marker as report_type, tissue_type as diagnosis, total_score as notes, inference as report, '' as images, created_at, 'analysis' as source, 'patient_analysis_reports' as table_name FROM patient_analysis_reports WHERE patient_id = ? ORDER BY created_at DESC");
    $stmt2->bind_param("s", $patient_id);
    $stmt2->execute();
    $analysisResult = $stmt2->get_result();
    while ($row = $analysisResult->fetch_assoc()) {
        $reports[] = $row;
    }
}

// Sort all reports by date descending (newest first)
usort($reports, function($a, $b) {
    return strcmp($b['created_at'], $a['created_at']);
});

echo json_encode([
    "status"  => true,
    "patient" => [
        "patient_id" => $patient['patient_id'],
        "name" => $patient['name'],
        "age" => $patient['age'] ?? "",
        "gender" => $patient['gender'] ?? "",
        "phone" => $patient['phone'] ?? "",
        "address" => $patient['address'] ?? "",
        "doctorName" => $patient['doctor_name'] ?? "",
        "reportType" => $patient['report_type'] ?? "",
        "diagnosis" => $patient['diagnosis'] ?? "",
        "notes" => $patient['notes'] ?? "",
        "fullReport" => $patient['report'] ?? "",
        "reportImages" => [],
        "reportDocuments" => []
    ],
    "reports" => $reports
]);
?>