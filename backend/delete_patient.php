<?php
include 'db.php';
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["status" => false, "message" => "Invalid request method"]);
    exit;
}

$patient_id = trim($_POST['patient_id'] ?? '');
$doctor_id  = intval($_POST['doctor_id'] ?? 0);

if (empty($patient_id) || $doctor_id <= 0) {
    echo json_encode(["status" => false, "message" => "Missing patient_id or doctor_id"]);
    exit;
}

// Check if patient exists and belongs to the doctor
$check = $conn->prepare("SELECT patient_id FROM patient WHERE patient_id = ? AND doctor_id = ?");
$check->bind_param("si", $patient_id, $doctor_id);
$check->execute();
if ($check->get_result()->num_rows === 0) {
    echo json_encode(["status" => false, "message" => "Patient not found or unauthorized"]);
    exit;
}

// Delete patient (Cascade will handle diagnosis/reports if FOREIGN KEYs are set correctly)
$stmt = $conn->prepare("DELETE FROM patient WHERE patient_id = ? AND doctor_id = ?");
$stmt->bind_param("si", $patient_id, $doctor_id);

if ($stmt->execute()) {
    echo json_encode(["status" => true, "message" => "Patient deleted permanently"]);
} else {
    echo json_encode(["status" => false, "message" => "Delete failed: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
