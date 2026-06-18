<?php
ob_start(); 
header('Content-Type: application/json');

// 1. Global Fatal Error Handler
register_shutdown_function(function() {
    $error = error_get_last();
    if ($error !== NULL && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR])) {
        ob_clean();
        echo json_encode([
            "status" => false, 
            "message" => "PHP Fatal Error: [" . $error['type'] . "] " . $error['message'] . " in " . basename($error['file']) . " on line " . $error['line']
        ]);
    }
});

// 2. Suppress warnings from echoing (captured by ob_start instead)
error_reporting(E_ALL); 
ini_set('display_errors', '0');

include 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = trim($_POST['email'] ?? '');
    $otp = trim($_POST['otp'] ?? '');
    $new_password = trim($_POST['new_password'] ?? '');
    
    // Check if $conn is valid
    if (!$conn) {
        ob_clean();
        echo json_encode(["status" => false, "message" => "Database connection failed"]);
        exit;
    }

    if (empty($email) || empty($otp) || empty($new_password)) {
        ob_clean();
        echo json_encode(["status" => false, "message" => "Email, OTP, and new password are required"]);
        exit;
    }

    // Check if OTP is valid and not expired
    $stmt = $conn->prepare("SELECT doctor_id FROM doctor WHERE email = ? AND reset_otp = ? AND otp_expiry > NOW()");
    if (!$stmt) {
        ob_clean();
        echo json_encode(["status" => false, "message" => "DB Prepare Error: " . $conn->error]);
        exit;
    }
    
    $stmt->bind_param("ss", $email, $otp);
    $stmt->execute();
    $stmt->store_result();
    $num_rows = $stmt->num_rows;
    $stmt->close();
    
    if ($num_rows == 1) {
        $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);
        
        // Update password and clear the OTP fields
        $update_stmt = $conn->prepare("UPDATE doctor SET password = ?, reset_otp = NULL, otp_expiry = NULL WHERE email = ?");
        if (!$update_stmt) {
            ob_clean();
            echo json_encode(["status" => false, "message" => "DB Prepare Error: " . $conn->error]);
            exit;
        }
        $update_stmt->bind_param("ss", $hashed_password, $email);
        
        if ($update_stmt->execute()) {
            ob_clean();
            echo json_encode(["status" => true, "message" => "Password updated successfully"]);
        } else {
            ob_clean();
            echo json_encode(["status" => false, "message" => "Failed to update password: " . $update_stmt->error]);
        }
        $update_stmt->close();
    } else {
        ob_clean();
        echo json_encode(["status" => false, "message" => "Invalid or expired OTP"]);
    }
} else {
    ob_clean();
    echo json_encode(["status" => false, "message" => "Invalid request method"]);
}
exit;
