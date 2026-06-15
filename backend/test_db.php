<?php
$conn = new mysqli("localhost", "root", "", "histoquanta");
$res = $conn->query("DESCRIBE patient_analysis_reports");
while($r = $res->fetch_assoc()) echo $r['Field'] . "\n";
?>
