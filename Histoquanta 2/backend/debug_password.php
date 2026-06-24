<?php
// TEMPORARY DEBUG SCRIPT - DELETE AFTER TESTING
header('Content-Type: application/json');
include 'db.php';

$email = trim($_GET['email'] ?? '');
if (empty($email)) {
    echo json_encode(["error" => "Pass ?email=youremail@example.com"]);
    exit;
}

$stmt = $conn->prepare("SELECT doctor_id, email, password, reset_otp, otp_expiry FROM doctor WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(["error" => "Email not found in DB"]);
    exit;
}

$row = $result->fetch_assoc();

// Test if old password matches (for comparison)
$testPasswords = ["test", "Test@123", "Histo@2026"];
$matches = [];
foreach ($testPasswords as $p) {
    if (password_verify($p, $row['password'])) {
        $matches[] = $p;
    }
}

echo json_encode([
    "doctor_id"    => $row['doctor_id'],
    "email"        => $row['email'],
    "password_hash_preview" => substr($row['password'], 0, 20) . "...",
    "reset_otp"    => $row['reset_otp'],
    "otp_expiry"   => $row['otp_expiry'],
    "test_matches" => $matches,
    "last_updated" => date('Y-m-d H:i:s')
]);
?>
