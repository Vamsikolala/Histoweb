<?php
include 'db.php';
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["status" => false, "message" => "Invalid request method"]);
    exit;
}

// Retrieve and sanitize input
$patient_id = $_POST['patient_id'] ?? '';
$doctor_id  = intval($_POST['doctor_id'] ?? 0);
$name       = trim($_POST['name'] ?? '');
$age        = trim($_POST['age'] ?? '');
$gender     = trim($_POST['gender'] ?? '');
$phone      = trim($_POST['phone'] ?? '');
$address    = trim($_POST['address'] ?? '');

// Validate required fields
if (empty($patient_id) || empty($name) || $doctor_id <= 0) {
    echo json_encode(["status" => false, "message" => "Missing required fields"]);
    exit;
}

// Prepare SQL statement
// Note: patient_id is usually a unique string for a doctor, so we use it with doctor_id in the WHERE clause
$stmt = $conn->prepare("UPDATE patient SET name = ?, age = ?, gender = ?, phone = ?, address = ? WHERE patient_id = ? AND doctor_id = ?");

// age is handled as a string in add_patient.php but let's check binding. 
// In add_patient.php: $stmt->bind_param("ssisssi", $patient_id, $patient_name, $age, $gender, $phone, $address, $doctor_id);
// Wait, in add_patient.php it says: $stmt->bind_param("ssisssi", $patient_id, $patient_name, $age, $gender, $phone, $address, $doctor_id);
// patient_id(s), name(s), age(i), gender(s), phone(s), address(s), doctor_id(i)
// So age is an integer in the bind_param but incoming as trim($_POST['age'] ?? '');

$age_int = intval($age);

$stmt->bind_param("sissssi", $name, $age_int, $gender, $phone, $address, $patient_id, $doctor_id);

if ($stmt->execute()) {
    if ($stmt->affected_rows >= 0) { // affected_rows might be 0 if nothing changed
        echo json_encode(["status" => true, "message" => "Patient updated successfully"]);
    } else {
        echo json_encode(["status" => false, "message" => "No changes made or patient not found"]);
    }
} else {
    echo json_encode(["status" => false, "message" => "Update failed: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
