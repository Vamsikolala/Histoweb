<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'db.php';

// Check DB Health
$db_status = "Connected";
$db_color = "green";
if ($conn->connect_error) {
    $db_status = "Failed: " . $conn->connect_error;
    $db_color = "red";
}

// Get counts
$patient_count = 0;
$report_count = 0;
if ($db_status == "Connected") {
    $patient_count = $conn->query("SELECT COUNT(*) as count FROM patient")->fetch_assoc()['count'];
    $report_count = $conn->query("SELECT COUNT(*) as count FROM disease")->fetch_assoc()['count'];
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Histoquanta Backend Dashboard</title>
    <style>
        body { font-family: sans-serif; padding: 40px; background: #f4f7f9; }
        .card { background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin-bottom: 20px; }
        h1 { color: #333; }
        .status { font-weight: bold; color: <?php echo $db_color; ?>; }
        .btn { display: inline-block; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 6px; margin-top: 10px; }
        .btn:hover { background: #0056b3; }
    </style>
</head>
<body>
    <h1>Histoquanta Backend</h1>
    
    <div class="card">
        <h3>System Status</h3>
        <p>Database: <span class="status"><?php echo $db_status; ?></span></p>
        <p><strong>IP Address:</strong> 172.25.80.213</p>
        <p>Port: <strong>80</strong></p>
    </div>

    <div class="card">
        <h3>Data Summary</h3>
        <p>Total Patients: <strong><?php echo $patient_count; ?></strong></p>
        <p>Total Reports: <strong><?php echo $report_count; ?></strong></p>
        <a href="fix_db.php" class="btn">Run Database Audit & Recovery</a>
    </div>

    <div class="card">
        <h3>API Files</h3>
        <ul>
            <li><a href="get_patients.php?doctor_id=1">get_patients.php (Test)</a></li>
            <li><a href="doctor_profile.php?doctor_id=1">doctor_profile.php (Test)</a></li>
        </ul>
    </div>
</body>
</html>
