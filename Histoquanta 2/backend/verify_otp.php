<?php
error_reporting(E_ALL);
ini_set('display_errors', '0');
header('Content-Type: application/json');

include 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = trim($_POST['email'] ?? '');
    $otp = trim($_POST['otp'] ?? '');
    
    if (empty($email) || empty($otp)) {
        echo json_encode(["status" => false, "message" => "Email and OTP are required"]);
        exit;
    }
    
    $stmt = $conn->prepare("SELECT reset_otp, otp_expiry FROM doctor WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows == 1) {
        $doctor = $result->fetch_assoc();
        
        if ($doctor['reset_otp'] === $otp) {
            // Check expiry
            $current_time = new DateTime();
            $expiry_time = new DateTime($doctor['otp_expiry']);
            
            if ($current_time <= $expiry_time) {
                echo json_encode(["status" => true, "message" => "OTP verified successfully"]);
            } else {
                echo json_encode(["status" => false, "message" => "OTP has expired"]);
            }
        } else {
            echo json_encode(["status" => false, "message" => "Invalid OTP"]);
        }
    } else {
        echo json_encode(["status" => false, "message" => "Invalid email or OTP"]);
    }
    $stmt->close();
} else {
    echo json_encode(["status" => false, "message" => "Invalid request method"]);
}
$conn->close();
?>
