<?php
include 'db.php';
header('Content-Type: application/json');

$search = ($_GET['id'] ?? '');
if (empty($search)) {
    echo json_encode(["status" => false, "message" => "Patient ID is required"]);
    exit;
}

$stmt = $conn->prepare("SELECT patient_id, name, age, gender, phone, address FROM patient WHERE patient_id = ?");
$stmt->bind_param("s", $search);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    $data = [
        "patient_id" => $row["patient_id"],
        "name"       => $row["name"],
        "age"        => $row["age"],
        "gender"     => $row["gender"],
        "phone"      => $row["phone"],
        "address"    => $row["address"]
    ];

    echo json_encode([
        "status" => true,
        "data"   => $data
    ]);
} else {
    echo json_encode([
        "status" => false,
        "message" => "Patient not found"
    ]);
}
?>
