<?php
error_reporting(0); // Suppress warnings that break JSON
header('Content-Type: application/json');

include 'db.php';
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (!$conn) {
        echo json_encode(["status" => false, "message" => "Database connection failed"]);
        exit;
    }
    $name = trim($_POST['name']);
    $license_no = trim($_POST['license_no']);
    $email = trim($_POST['email']);
    $password = password_hash($_POST['password'], PASSWORD_BCRYPT);
    $check = $conn->prepare("SELECT * FROM doctor WHERE license_no = ? OR email = ?");
    $check->bind_param("ss", $license_no, $email);
    $check->execute();
    $result = $check->get_result();
    if ($result->num_rows > 0) {
        echo json_encode(["status" => false, "message" => "Doctor with this license or email already exists"]);
    } else {
        $stmt = $conn->prepare("INSERT INTO doctor (name, license_no, email, password) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssss", $name, $license_no, $email, $password);
        if ($stmt->execute()) {
            echo json_encode(["status" => true, "message" => "Signup trueful"]);
        } else {
            echo json_encode(["status" => false, "message" => "Database error"]);
        }
    }
}
?>