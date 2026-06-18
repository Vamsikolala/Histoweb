<?php
$conn = new mysqli("localhost", "root", "", "histoquanta");
$res = $conn->query("SELECT COUNT(*) as c FROM patient");
$row = $res->fetch_assoc();
echo "Total patients: " . $row['c'] . "\n";
?>
