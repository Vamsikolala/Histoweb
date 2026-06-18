<?php
include 'db.php';
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["status" => false, "message" => "Invalid request method"]);
    exit;
}

$doctor_id      = intval($_POST['doctor_id'] ?? 0);

// DEBUG LOGGING
$log = "[" . date('Y-m-d H:i:s') . "] Request: " . json_encode($_POST) . " Files: " . json_encode($_FILES) . "\n";
file_put_contents('debug_log.txt', $log, FILE_APPEND);
$name           = trim($_POST['name'] ?? '');
$specialization = trim($_POST['specialization'] ?? '');
$hospital_name  = trim($_POST['hospital_name'] ?? '');
$email          = trim($_POST['email'] ?? '');
$phone_number   = trim($_POST['phone_number'] ?? '');

if ($doctor_id <= 0) {
    echo json_encode(["status" => false, "message" => "Invalid Doctor ID"]);
    exit;
}

// Handle Image Uploads
$profile_pic = null;
if (isset($_FILES['profile_pic']) && $_FILES['profile_pic']['error'] === 0) {
    $profile_pic = handleUpload($_FILES['profile_pic'], 'profile', $doctor_id);
}

$cover_pic = null;
if (isset($_FILES['cover_pic']) && $_FILES['cover_pic']['error'] === 0) {
    $cover_pic = handleUpload($_FILES['cover_pic'], 'cover', $doctor_id);
}

function handleUpload($file, $prefix, $doctor_id) {
    $upload_dir = dirname(__FILE__) . '/uploads/profiles/';
    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0777, true);
        chmod($upload_dir, 0777);
    }
    
    $ext = pathinfo($file['name'], PATHINFO_EXTENSION);
    if (empty($ext)) $ext = 'jpg';
    $filename = $prefix . "_" . $doctor_id . "_" . time() . "." . $ext;
    $target_file = $upload_dir . $filename;
    
    if (move_uploaded_file($file['tmp_name'], $target_file)) {
        chmod($target_file, 0644);
        return $filename;
    }
    return null;
}

// Update Database
$sql = "UPDATE doctor SET name = ?, specialization = ?, hospital_name = ?, email = ?, phone_number = ? ";
$params = [$name, $specialization, $hospital_name, $email, $phone_number];
$types = "sssss";

if ($profile_pic) {
    $sql .= ", profile_pic = ? ";
    $params[] = $profile_pic;
    $types .= "s";
}
if ($cover_pic) {
    $sql .= ", cover_pic = ? ";
    $params[] = $cover_pic;
    $types .= "s";
}

$sql .= " WHERE doctor_id = ?";
$params[] = $doctor_id;
$types .= "i";

$stmt = $conn->prepare($sql);
$stmt->bind_param($types, ...$params);

if ($stmt->execute()) {
    // Fetch current state
    $res = $conn->query("SELECT profile_pic, cover_pic FROM doctor WHERE doctor_id = $doctor_id");
    if ($res && $row = $res->fetch_assoc()) {
        $profile_pic = $row['profile_pic'] ?? '';
        $cover_pic = $row['cover_pic'] ?? '';
    }
    echo json_encode([
        "status"      => true,
        "message"     => "Profile updated successfully",
        "profile_pic" => $profile_pic,
        "cover_pic"   => $cover_pic
    ]);
} else {
    echo json_encode(["status" => false, "message" => "Database error: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>
