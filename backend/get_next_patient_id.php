<?php
error_reporting(0);
header('Content-Type: application/json');

include 'db.php';

if (!$conn) {
    echo json_encode(["status" => false, "message" => "Database connection failed"]);
    exit;
}

$doctor_id = intval($_GET['doctor_id'] ?? 0);

// Find the highest ID with PT prefix globally
$query = "SELECT patient_id FROM patient WHERE patient_id LIKE 'PT%' ORDER BY CAST(SUBSTRING(patient_id, 3) AS UNSIGNED) DESC LIMIT 1";
$stmt = $conn->prepare($query);
$stmt->execute();
$result = $stmt->get_result();

$next_num = 1; // Default start

if ($row = $result->fetch_assoc()) {
    $last_id = $row['patient_id'];
    // Extract numeric part after 'PT'
    $num_part = substr($last_id, 2);
    $next_num = intval($num_part) + 1;
}
$stmt->close();

// Format as PT001, PT002, etc.
$next_id = "PT" . str_pad($next_num, 3, "0", STR_PAD_LEFT);

echo json_encode(["status" => true, "next_id" => $next_id]);
?>
