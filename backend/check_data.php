<?php
include 'db.php';
header('Content-Type: text/plain');

echo "--- DOCTORS ---\n";
$res = $conn->query("SELECT doctor_id, name, email FROM doctor");
while($row = $res->fetch_assoc()) {
    print_r($row);
}

echo "\n--- PATIENTS (First 10) ---\n";
$res = $conn->query("SELECT patient_id, name, doctor_id, created_at FROM patient LIMIT 10");
while($row = $res->fetch_assoc()) {
    print_r($row);
}

echo "\n--- REPORTS IN 'disease' TABLE (First 10) ---\n";
$res = $conn->query("SELECT disease_id, patient_id, doctor_id, created_at FROM disease LIMIT 10");
while($row = $res->fetch_assoc()) {
    print_r($row);
}

echo "\n--- REPORTS IN 'patient_analysis_reports' TABLE (First 10) ---\n";
$tableCheck = $conn->query("SHOW TABLES LIKE 'patient_analysis_reports'");
if ($tableCheck->num_rows > 0) {
    $res = $conn->query("SELECT id, patient_id, doctor_id, created_at FROM patient_analysis_reports LIMIT 10");
    while($row = $res->fetch_assoc()) {
        print_r($row);
    }
} else {
    echo "Table 'patient_analysis_reports' does not exist.\n";
}

$conn->close();
?>
