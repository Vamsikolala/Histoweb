<?php
$conn = new mysqli("localhost", "root", "", "histoquanta");
$res = $conn->query("SELECT * FROM doctor");
while($r = $res->fetch_assoc()) echo $r['doctor_id'] . " - " . $r['name'] . "\n";
echo "Patients:\n";
$res2 = $conn->query("SELECT patient_id, name, doctor_id FROM patient LIMIT 5");
while($r = $res2->fetch_assoc()) echo $r['patient_id'] . " - " . $r['name'] . " (Doc: " . $r['doctor_id'] . ")\n";
?>
