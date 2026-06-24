<?php
include 'db.php';
header('Content-Type: application/json');
$res = $conn->query("SELECT * FROM doctor");
$doctors = [];
while($row = $res->fetch_assoc()) {
    unset($row['password']); // Safety
    $doctors[] = $row;
}
echo json_encode($doctors);
?>
