<?php
// Disable error reporting to prevent non-JSON output
error_reporting(0);
ini_set('display_errors', 0);

include 'db.php';
header('Content-Type: application/json');

register_shutdown_function(function() {
    $error = error_get_last();
    if ($error !== NULL && ($error['type'] === E_ERROR || $error['type'] === E_PARSE)) {
        echo json_encode(["status" => false, "message" => "Internal Server Error", "details" => $error['message']]);
    }
});

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["status" => false, "message" => "Invalid request method"]);
    exit;
}

$report_id = intval($_POST['report_id'] ?? 0);
$table_name = trim($_POST['table_name'] ?? '');

if ($report_id <= 0 || empty($table_name)) {
    echo json_encode(["status" => false, "message" => "Missing report_id or table_name"]);
    exit;
}

if ($table_name === 'patient_analysis_reports') {
    $stmt = $conn->prepare("DELETE FROM patient_analysis_reports WHERE id = ?");
} else {
    $stmt = $conn->prepare("DELETE FROM disease WHERE disease_id = ?");
}

if (!$stmt) {
    echo json_encode(["status" => false, "message" => "Prepare failed: " . $conn->error]);
    exit;
}

$stmt->bind_param("i", $report_id);

if ($stmt->execute()) {
    if ($stmt->affected_rows > 0) {
        echo json_encode(["status" => true, "message" => "Report deleted successfully"]);
    } else {
        echo json_encode(["status" => false, "message" => "Report not found or already deleted"]);
    }
} else {
    echo json_encode(["status" => false, "message" => "Execute failed: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
