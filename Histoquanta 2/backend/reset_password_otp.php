<?php
error_reporting(E_ALL);
ini_set('display_errors', '0');
header('Content-Type: application/json');

include 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = trim($_POST['email'] ?? '');
    $new_password = trim($_POST['new_password'] ?? '');
    
    if (empty($email) || empty($new_password)) {
        echo json_encode(["status" => false, "message" => "Email and new password are required"]);
        exit;
    }
    
    $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);
    
    // Check if email exists first
    $check_stmt = $conn->prepare("SELECT doctor_id FROM doctor WHERE email = ?");
    $check_stmt->bind_param("s", $email);
    $check_stmt->execute();
    $check_stmt->store_result();
    
    if ($check_stmt->num_rows === 0) {
        echo json_encode(["status" => false, "message" => "Email address not found"]);
        $check_stmt->close();
        exit;
    }
    $check_stmt->close();

    // Explicitly clearing the OTP so it can't be reused
    $update_stmt = $conn->prepare("UPDATE doctor SET password = ?, reset_otp = NULL, otp_expiry = NULL WHERE email = ?");
    $update_stmt->bind_param("ss", $hashed_password, $email);
    
    if ($update_stmt->execute()) {
        // Even if affected_rows is 0 (same password), it's a success
        echo json_encode(["status" => true, "message" => "Password reset successfully"]);
    } else {
        echo json_encode(["status" => false, "message" => "Database error: " . $update_stmt->error]);
    }
    $update_stmt->close();
} else {
    echo json_encode(["status" => false, "message" => "Invalid request method"]);
}
$conn->close();
?>
