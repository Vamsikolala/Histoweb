<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');
header('Content-Type: application/json');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

// Include PHPMailer source files manually
require 'src/Exception.php';
require 'src/PHPMailer.php';
require 'src/SMTP.php';

include 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = trim($_POST['email'] ?? '');
    
    if (empty($email)) {
        echo json_encode(["status" => false, "message" => "Email address is required"]);
        exit;
    }
    
    // Check if email exists
    $stmt = $conn->prepare("SELECT doctor_id FROM doctor WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();
    $num_rows = $stmt->num_rows;
    $stmt->close();
    
    if ($num_rows == 1) {
        $otp = sprintf("%06d", mt_rand(1, 999999));
        $expiry = date('Y-m-d H:i:s', strtotime('+15 minutes'));
        
        $update_stmt = $conn->prepare("UPDATE doctor SET reset_otp = ?, otp_expiry = ? WHERE email = ?");
        $update_stmt->bind_param("sss", $otp, $expiry, $email);
        
        if ($update_stmt->execute()) {
            
            // --- PHPMAILER INTEGRATION ---
            $mail = new PHPMailer(true);

            try {
                // Server settings
                $mail->isSMTP();
                $mail->Host       = 'smtp.gmail.com';
                $mail->SMTPAuth   = true;
                $mail->Username   = 'kolalavamsi123@gmail.com';     // SMTP username (sender)
                $mail->Password   = 'alrsfrmkhgoolvzr';             // SMTP app password
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // Enable TLS encryption
                $mail->Port       = 587;                            // TCP port to connect to
                
                // --- ADDED FOR STABILITY ---
                $mail->Timeout    = 20;                             // SMTP timeout
                $mail->SMTPOptions = array(
                    'ssl' => array(
                        'verify_peer' => false,
                        'verify_peer_name' => false,
                        'allow_self_signed' => true
                    )
                );
                // ---------------------------

                // Recipients
                $mail->setFrom('kolalavamsi123@gmail.com', 'Histoquanta Support');
                $mail->addAddress($email);     // Add a recipient (the doctor's email)

                // Content
                $mail->isHTML(true);
                $mail->Subject = 'Histoquanta Password Reset OTP';
                $mail->Body    = "
                    <div style='font-family: Arial, sans-serif; padding: 20px; color: #333;'>
                        <h2>Password Reset Request</h2>
                        <p>We received a request to reset your password for Histoquanta.</p>
                        <p>Your 6-digit OTP code is: <b style='font-size: 24px; color: #007bff;'>{$otp}</b></p>
                        <p>This code will expire in 15 minutes.</p>
                        <p>If you did not request this, please ignore this email.</p>
                        <br>
                        <p>Regards,<br>Histoquanta Team</p>
                    </div>
                ";
                $mail->AltBody = "Your Histoquanta password reset OTP is: {$otp}. It expires in 15 minutes.";

                $mail->send();
                
                // Return success
                echo json_encode([
                    "status" => true, 
                    "message" => "OTP sent successfully to your email."
                ]);
            } catch (Exception $e) {
                // If email fails to send
                echo json_encode([
                    "status" => false, 
                    "message" => "OTP saved, but email could not be sent. Mailer Error: {$mail->ErrorInfo}"
                ]);
            }

        } else {
            echo json_encode(["status" => false, "message" => "Error generating OTP. Try again later."]);
        }
        $update_stmt->close();
    } else {
        // Return a clear error so the user knows they made a typo
        echo json_encode(["status" => false, "message" => "Email not found. Please check for typos and try again."]);
    }
} else {
    echo json_encode(["status" => false, "message" => "Invalid request method"]);
}
$conn->close();
?>
