<?php
error_reporting(0); // Suppress warnings that break JSON
header('Content-Type: application/json');

include 'db.php';
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (!$conn) {
        echo json_encode(["status" => false, "message" => "Database connection failed"]);
        exit;
    }
    $license_no = trim($_POST['license_no']);
    $password = trim($_POST['password']);
    $stmt = $conn->prepare("SELECT * FROM doctor WHERE license_no = ?");
    $stmt->bind_param("s", $license_no);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows == 1) {
        $doctor = $result->fetch_assoc();
        if (password_verify($password, $doctor['password'])) {
            session_start();
            $_SESSION['doctor_id'] = $doctor['doctor_id'];
            $_SESSION['doctor_name'] = $doctor['name'];
            echo json_encode([
                "status" => true, 
                "message" => "Login trueful",
                "doctor_id"      => $doctor['doctor_id'],
                "doctor_name"    => $doctor['name'],
                "email"          => $doctor['email']          ?? "",
                "specialization" => $doctor['specialization'] ?? "",
                "hospital_name"  => $doctor['hospital_name']  ?? "",
                "phone_number"   => $doctor['phone_number']   ?? "",
                "profile_pic"    => $doctor['profile_pic']    ?? ""
            ]);
        } else {
            echo json_encode(["status" => false, "message" => "Invalid password"]);
        }
    } else {
        echo json_encode(["status" => false, "message" => "Doctor not found"]);
    }
}
?>