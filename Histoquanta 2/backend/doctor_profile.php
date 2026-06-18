<?php
error_reporting(0);
header('Content-Type: application/json');
include 'db.php';
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $doctor_id = intval($_POST['doctor_id'] ?? 0);
    $license_no = trim($_POST['license_no'] ?? '');
    
    if ($doctor_id > 0) {
        $stmt = $conn->prepare("SELECT * FROM doctor WHERE doctor_id = ?");
        $stmt->bind_param("i", $doctor_id);
    } else {
        $stmt = $conn->prepare("SELECT * FROM doctor WHERE license_no = ?");
        $stmt->bind_param("s", $license_no);
    }
    
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows == 1) {
        $doctor = $result->fetch_assoc();
            $_SESSION['doctor_id'] = $doctor['doctor_id'];
            echo json_encode([
                "status" => true, 
                "name" => $doctor['name'], 
                "doctor_id" => $doctor['doctor_id'], 
                "license_no" => $doctor['license_no'],
                "specialization" => $doctor['specialization'] ?? "",
                "hospital_name" => $doctor['hospital_name'] ?? "",
                "email" => $doctor['email'] ?? "",
                "phone_number" => $doctor['phone_number'] ?? "",
                "profile_pic" => $doctor['profile_pic'] ?? ""
            ]);
      
    } else {
        echo json_encode(["status" => false, "message" => "doctor not found"]);
    }
}
?>      