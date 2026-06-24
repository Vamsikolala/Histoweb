<?php
include 'db.php';
session_start();

header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["status" => false, "message" => "Invalid request method"]);
    exit;
}

/* Inputs */
$doctor_id   = intval($_POST['doctor_id'] ?? 0);
$patient_id  = trim($_POST['patient_id'] ?? ''); // Use string for PT-001
$report_type = trim($_POST['report_type'] ?? '');
$diagnosis   = trim($_POST['diagnosis'] ?? '');
$notes       = trim($_POST['notes'] ?? '');
$report      = trim($_POST['report'] ?? '');

// ✅ Check if 'images' column exists (to avoid SQL errors)
$col_check = $conn->query("SHOW COLUMNS FROM disease LIKE 'images'");
if ($col_check->num_rows == 0) {
    echo json_encode([
        "status" => false, 
        "message" => "Database table missing 'images' column. Please run ALTER TABLE disease ADD COLUMN images TEXT;"
    ]);
    exit;
}

/* ✅ File Upload Handling */
$uploaded_files = [];
$upload_dir = 'uploads/';
if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0777, true);
}

if (isset($_FILES['images'])) {
    $files = $_FILES['images'];
    for ($i = 0; $i < count($files['name']); $i++) {
        if ($files['error'][$i] === 0) {
            $ext = pathinfo($files['name'][$i], PATHINFO_EXTENSION);
            $new_name = uniqid('img_') . '.' . $ext;
            if (move_uploaded_file($files['tmp_name'][$i], $upload_dir . $new_name)) {
                $uploaded_files[] = $new_name;
            }
        }
    }
}
$images_str = implode(',', $uploaded_files);

$disease_id  = intval($_POST['disease_id'] ?? 0);

/* Basic validation */
if ($doctor_id <= 0 || empty($patient_id)) {
    echo json_encode([
        "status" => false, 
        "message" => "Missing doctor_id or patient_id",
        "debug" => ["doctor_id" => $doctor_id, "patient_id" => $patient_id]
    ]);
    exit;
}

/* ✅ Check if patient exists */
$check = $conn->prepare("SELECT patient_id FROM patient WHERE patient_id = ?");
$check->bind_param("s", $patient_id);
$check->execute();
$result = $check->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["status" => false, "message" => "Patient ID $patient_id does not exist."]);
    exit;
}

if ($disease_id > 0) {
    // ✅ UPDATE existing record
    $stmt = $conn->prepare(
        "UPDATE disease SET report_type = ?, diagnosis = ?, notes = ?, report = ?, images = IF(? != '', ?, images) 
         WHERE disease_id = ? AND patient_id = ?"
    );
    $stmt->bind_param("ssssssis", $report_type, $diagnosis, $notes, $report, $images_str, $images_str, $disease_id, $patient_id);
    $action = "updated";
} else {
    // ✅ INSERT a new record
    $stmt = $conn->prepare(
        "INSERT INTO disease (patient_id, doctor_id, report_type, diagnosis, notes, report, images) 
         VALUES (?, ?, ?, ?, ?, ?, ?)"
    );
    $stmt->bind_param("sisssss", $patient_id, $doctor_id, $report_type, $diagnosis, $notes, $report, $images_str);
    $action = "created";
}

if ($stmt->execute()) {
    echo json_encode([
        "status"     => true,
        "message"    => "Disease report $action successfully",
        "disease_id" => ($disease_id > 0 ? $disease_id : $stmt->insert_id),
        "action"     => $action
    ]);
}
 else {
    echo json_encode([
        "status"  => false,
        "message" => "Failed to save report",
        "sql_error" => $stmt->error
    ]);
}

$stmt->close();
$check->close();
$conn->close();
?>