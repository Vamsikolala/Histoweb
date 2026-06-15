<?php
// Disable error reporting to prevent non-JSON output
error_reporting(0);
ini_set('display_errors', 0);

include 'db.php';
header('Content-Type: application/json');

// Ensure correct JSON even on fatal errors
register_shutdown_function(function() {
    $error = error_get_last();
    if ($error !== NULL && ($error['type'] === E_ERROR || $error['type'] === E_PARSE)) {
        echo json_encode(["status" => false, "message" => "Internal Server Error", "details" => $error['message']]);
    }
});

// 1. Ensure the table and all its columns exist
$table_sql = "CREATE TABLE IF NOT EXISTS patient_analysis_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    doctor_id INT DEFAULT 0,
    patient_id VARCHAR(50) NOT NULL,
    tissue_type VARCHAR(50) NOT NULL,
    marker VARCHAR(50) NOT NULL,
    total_score VARCHAR(255) NOT NULL,
    inference TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";
$conn->query($table_sql);

// Check if 'total_score' needs expansion (e.g. from VARCHAR(50) to VARCHAR(255))
$conn->query("ALTER TABLE patient_analysis_reports MODIFY COLUMN total_score VARCHAR(255) NOT NULL");

// Check if 'inference' column exists
$check_col = $conn->query("SHOW COLUMNS FROM patient_analysis_reports LIKE 'inference'");
if ($check_col->num_rows == 0) {
    $conn->query("ALTER TABLE patient_analysis_reports ADD COLUMN inference TEXT NOT NULL AFTER total_score");
}

// Check if 'doctor_id' column exists
$check_doc = $conn->query("SHOW COLUMNS FROM patient_analysis_reports LIKE 'doctor_id'");
if ($check_doc->num_rows == 0) {
    $conn->query("ALTER TABLE patient_analysis_reports ADD COLUMN doctor_id INT DEFAULT 0 AFTER id");
}

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["status" => false, "message" => "Invalid request method"]);
    exit;
}

// 2. Retrieve data
$doctor_id   = intval($_POST['doctor_id'] ?? 0);
$patient_id  = trim($_POST['patient_id'] ?? '');
$tissue_type = trim($_POST['tissue_type'] ?? '');
$marker      = trim($_POST['marker'] ?? '');
$total_score = trim($_POST['total_score'] ?? '');
$inference   = trim($_POST['inference'] ?? '');

if (empty($patient_id) || empty($tissue_type) || empty($marker)) {
    echo json_encode(["status" => false, "message" => "Missing required fields: patient_id, tissue_type, or marker"]);
    exit;
}

// 3. Delete any existing reports for this patient, tissue, and marker to prevent duplicates
$delete_stmt = $conn->prepare("DELETE FROM patient_analysis_reports WHERE patient_id = ? AND tissue_type = ? AND marker = ?");
$delete_stmt->bind_param("sss", $patient_id, $tissue_type, $marker);
$delete_stmt->execute();
$delete_stmt->close();

// 4. INSERT the fresh record
$stmt = $conn->prepare("INSERT INTO patient_analysis_reports (doctor_id, patient_id, tissue_type, marker, total_score, inference) VALUES (?, ?, ?, ?, ?, ?)");
if (!$stmt) {
    echo json_encode(["status" => false, "message" => "Prepare failed: " . $conn->error]);
    exit;
}
$stmt->bind_param("isssss", $doctor_id, $patient_id, $tissue_type, $marker, $total_score, $inference);

if ($stmt->execute()) {
    echo json_encode(["status" => true, "message" => "Analysis report saved successfully"]);
} else {
    echo json_encode(["status" => false, "message" => "Execute failed: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
