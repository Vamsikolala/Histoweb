<?php
ob_start(); 
header('Content-Type: application/json');

// Pull in PHPMailer files
require_once __DIR__ . '/src/Exception.php';
require_once __DIR__ . '/src/PHPMailer.php';
require_once __DIR__ . '/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

error_reporting(E_ALL); 
ini_set('display_errors', '0');

include 'db.php';
$email_config = include 'email_config.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = trim($_POST['email'] ?? '');
    
    if (empty($email)) {
        ob_clean();
        echo json_encode(["status" => false, "message" => "Email address cannot be empty"]);
        exit;
    }

    try {
        if (!$conn) {
            throw new Exception("Database connection failed");
        }

        $stmt = $conn->prepare("SELECT doctor_id FROM doctor WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $stmt->store_result();
        $num_rows = $stmt->num_rows;
        $stmt->close();
        
        if ($num_rows == 1) {
            $otp = sprintf("%06d", mt_rand(1, 999999));
            $expiry = date("Y-m-d H:i:s", strtotime('+15 minutes'));
            
            $update_stmt = $conn->prepare("UPDATE doctor SET reset_otp = ?, otp_expiry = ? WHERE email = ?");
            if (!$update_stmt) {
                throw new \Exception("Database Schema Error: " . $conn->error . ". You probably need to add reset_otp and otp_expiry columns.");
            }
            $update_stmt->bind_param("sss", $otp, $expiry, $email);
            $update_stmt->execute();
            $update_stmt->close();
            
            // --- PHPMAILER SMTP LOGIC ---
            $mail = new PHPMailer(true);
            try {
                $mail->isSMTP();
                $mail->Host       = $email_config['smtp_host'];
                $mail->SMTPAuth   = true;
                $mail->Username   = $email_config['smtp_user'];
                $mail->Password   = $email_config['smtp_pass'];
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
                $mail->Port       = $email_config['smtp_port'];

                $mail->setFrom($email_config['smtp_user'], 'Histoquanta Password Reset');
                $mail->addAddress($email);

                $mail->isHTML(false);
                $mail->Subject = 'Your Histoquanta Password Reset OTP';
                $mail->Body    = "Your OTP for password reset is: " . $otp . "\n\nIt is valid for 15 minutes.\nIf you did not request a password reset, please ignore this email.";

                $mail->send();
                
                ob_clean();
                echo json_encode(["status" => true, "message" => "OTP sent to your email", "debug_otp" => $otp]);
            } catch (Exception $e) {
                ob_clean();
                echo json_encode(["status" => false, "message" => "Message could not be sent. Mailer Error: {$mail->ErrorInfo}"]);
            }
            // --------------------------------
            
        } else {
            ob_clean();
            echo json_encode(["status" => false, "message" => "Email address not registered"]);
        }
    } catch (\mysqli_sql_exception $e) {
        ob_clean();
        if (strpos($e->getMessage(), "Unknown column") !== false) {
            echo json_encode(["status" => false, "message" => "Database Schema Error: Please ensure you run setup_database.sql to add 'reset_otp' and 'otp_expiry' to your 'doctor' table."]);
        } else {
            echo json_encode(["status" => false, "message" => "Database Error: " . $e->getMessage()]);
        }
    } catch (\Throwable $e) {
        ob_clean();
        echo json_encode(["status" => false, "message" => "System Error: " . $e->getMessage() . " at " . basename($e->getFile()) . ":" . $e->getLine()]);
    }
} else {
    ob_clean();
    echo json_encode(["status" => false, "message" => "Invalid request method"]);
}
exit;
