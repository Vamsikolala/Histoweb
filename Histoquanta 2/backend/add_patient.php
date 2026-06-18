<?php
include 'db.php';
session_start();
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["status" => false, "message" => "Invalid request method"]);
    exit;
}

// Retrieve and sanitize input
$manual_patient_id = trim($_POST['patient_id'] ?? '');
$patient_name = trim($_POST['name'] ?? '');
$age          = trim($_POST['age'] ?? '');
$gender       = trim($_POST['gender'] ?? '');
$phone        = trim($_POST['phone'] ?? '');
$address      = trim($_POST['address'] ?? '');
$doctor_id    = intval($_POST['doctor_id'] ?? 0);

// Determine Patient ID
if (!empty($manual_patient_id)) {
    // Check if manually provided ID already exists for this doctor
    $check_stmt = $conn->prepare("SELECT patient_id FROM patient WHERE patient_id = ? AND doctor_id = ?");
    $check_stmt->bind_param("si", $manual_patient_id, $doctor_id);
    $check_stmt->execute();
    if ($check_stmt->get_result()->num_rows > 0) {
        echo json_encode(["status" => false, "message" => "Patient ID already exists for your account"]);
        $check_stmt->close();
        exit;
    }
    $check_stmt->close();
    $patient_id = $manual_patient_id;
} else {
    // AUTOMATED PATIENT ID GENERATION (1, 2, 3...) scoped per doctor
    $query = "SELECT patient_id FROM patient WHERE doctor_id = ? AND patient_id REGEXP '^[0-9]+$' ORDER BY CAST(patient_id AS UNSIGNED) DESC LIMIT 1";
    $max_stmt = $conn->prepare($query);
    $max_stmt->bind_param("i", $doctor_id);
    $max_stmt->execute();
    $result = $max_stmt->get_result();
    $next_id = "1"; // Default start

    if ($row = $result->fetch_assoc()) {
        $last_id = $row['patient_id'];
        $num = intval($last_id) + 1;
        $next_id = (string)$num;
    }
    $max_stmt->close();
    $patient_id = $next_id;
}


// Validate required fields
if (empty($patient_name) || empty($age) || empty($gender) || $doctor_id <= 0) {
    echo json_encode(["status" => false, "message" => "Missing required fields"]);
    exit;
}

// Validate patient name (only letters and spaces)
if (!preg_match("/^[a-zA-Z\s]+$/", $patient_name)) {
    echo json_encode(["status" => false, "message" => "Patient name must contain only letters"]);
    exit;
}

// Validate phone number (must be exactly 10 digits and only numbers if provided)
if (!empty($phone)) {
    // Strip any whitespaces or dashes just in case
    $phone = str_replace([' ', '-', '(', ')', '+'], '', $phone);
    if (!preg_match("/^[0-9]{10}$/", $phone)) {
        echo json_encode(["status" => false, "message" => "Phone number must be exactly 10 digits with no characters"]);
        exit;
    }
}

// Prepare SQL statement
$stmt = $conn->prepare("INSERT INTO patient (patient_id, name, age, gender, phone, address, doctor_id) VALUES (?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssisssi", $patient_id, $patient_name, $age, $gender, $phone, $address, $doctor_id);

if ($stmt->execute()) {
    echo json_encode([
        "status" => true, 
        "message" => "Patient added successfully", 
        "patient_id" => (string)$patient_id
    ]);
} else {
    echo json_encode(["status" => false, "message" => "Failed to add patient: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>