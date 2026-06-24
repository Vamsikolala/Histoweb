<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');

include 'db.php';

echo "<h2>Histoquanta Database Diagnostic & Recovery Tool</h2>";

// Helper function to add column safely
function addColumnSafe($conn, $table, $column, $type) {
    $check = $conn->query("SHOW COLUMNS FROM `$table` LIKE '$column'");
    if ($check->num_rows == 0) {
        $conn->query("ALTER TABLE `$table` ADD `$column` $type");
        return true;
    }
    return false;
}

try {
    // 1. Ensure columns exist safely in 'doctor' table
    addColumnSafe($conn, 'doctor', 'reset_otp', 'VARCHAR(10)');
    addColumnSafe($conn, 'doctor', 'otp_expiry', 'DATETIME');
    addColumnSafe($conn, 'doctor', 'specialization', 'VARCHAR(255) DEFAULT ""');
    addColumnSafe($conn, 'doctor', 'hospital_name', 'VARCHAR(255) DEFAULT ""');
    addColumnSafe($conn, 'doctor', 'phone_number', 'VARCHAR(20) DEFAULT ""');
    addColumnSafe($conn, 'doctor', 'profile_pic', 'VARCHAR(255) DEFAULT ""');
    addColumnSafe($conn, 'doctor', 'cover_pic', 'VARCHAR(255) DEFAULT ""');
    echo "<p style='color:green'>Checked doctor table columns: reset_otp, otp_expiry, specialization, hospital_name, phone_number, profile_pic, cover_pic</p>";
    
    // 2. Ensure patient_analysis_reports table exists
    $table_sql = "CREATE TABLE IF NOT EXISTS patient_analysis_reports (
        id INT AUTO_INCREMENT PRIMARY KEY,
        doctor_id INT NOT NULL,
        patient_id VARCHAR(50) NOT NULL,
        tissue_type VARCHAR(255) NOT NULL,
        marker VARCHAR(255) NOT NULL,
        total_score VARCHAR(255) NOT NULL,
        inference TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    $conn->query($table_sql);
    echo "<p style='color:green'>Checked table: patient_analysis_reports</p>";

    
    // 2. Insert test doctor if missing
    $res = $conn->query("SELECT doctor_id, email FROM doctor WHERE email = 'test@example.com'");
    if ($res->num_rows == 0) {
        $p = password_hash('test', PASSWORD_BCRYPT);
        $conn->query("INSERT INTO doctor (name, license_no, email, password) VALUES ('Test Doc', 'T123', 'test@example.com', '$p')");
        $target_doctor_id = $conn->insert_id;
        echo "<p style='color:blue'>Inserted new test doctor (ID: $target_doctor_id)</p>";
    } else {
        $row = $res->fetch_assoc();
        $target_doctor_id = $row['doctor_id'];
        echo "<p style='color:green'>Found existing test doctor (ID: $target_doctor_id)</p>";
    }

    // 3. Optional: Reassign all orphaned patients to the test doctor
    if (isset($_GET['reassign'])) {
        $conn->query("UPDATE patient SET doctor_id = $target_doctor_id WHERE doctor_id NOT IN (SELECT doctor_id FROM doctor)");
        echo "<p style='color:orange'>Reassigned orphaned patients to doctor ID $target_doctor_id</p>";
        $conn->query("UPDATE patient_analysis_reports SET doctor_id = $target_doctor_id WHERE doctor_id NOT IN (SELECT doctor_id FROM doctor)");
        $conn->query("UPDATE disease SET doctor_id = $target_doctor_id WHERE doctor_id NOT IN (SELECT doctor_id FROM doctor)");
    }

    // 4. List Summary
    echo "<h3>System Summary</h3>";
    $doctors_count = $conn->query("SELECT COUNT(*) as count FROM doctor")->fetch_assoc()['count'];
    $patients_count = $conn->query("SELECT COUNT(*) as count FROM patient")->fetch_assoc()['count'];
    $reports_count = $conn->query("SELECT COUNT(*) as count FROM disease")->fetch_assoc()['count'];
    
    echo "<ul>
            <li>Total Doctors in DB: $doctors_count</li>
            <li>Total Patients in DB: $patients_count</li>
            <li>Total Medical Reports in DB: $reports_count</li>
          </ul>";

    // 5. List Doctor IDs
    echo "<h3>Registered Doctors</h3>";
    echo "<table border='1' cellpadding='5' style='border-collapse: collapse; width:100%;'>
            <tr style='background:#eee;'><th>Doctor ID</th><th>Name</th><th>License</th><th>Email</th></tr>";
    $doc_res = $conn->query("SELECT doctor_id, name, license_no, email FROM doctor");
    while($d = $doc_res->fetch_assoc()) {
        echo "<tr><td>{$d['doctor_id']}</td><td>{$d['name']}</td><td>{$d['license_no']}</td><td>{$d['email']}</td></tr>";
    }
    echo "</table>";

    // 6. Reassignment Tool
    echo "<h3>Claim Patients (Fix Missing Patients)</h3>";
    if (isset($_POST['new_doc_id'])) {
        $target = intval($_POST['new_doc_id']);
        if ($target > 0) {
            $conn->query("UPDATE patient SET doctor_id = $target");
            $conn->query("UPDATE disease SET doctor_id = $target");
            $conn->query("UPDATE patient_analysis_reports SET doctor_id = $target");
            echo "<p style='color:blue; font-weight:bold;'>SUCCESS: All patients and reports have been reassigned to Doctor ID: $target</p>";
        }
    }
    echo "<form method='POST' style='background:#f0f8ff; padding:15px; border-radius:8px;'>
            <label>Enter <b>YOUR Doctor ID</b> from the table above: </label>
            <input type='number' name='new_doc_id' required>
            <button type='submit' style='background:blue; color:white; padding:5px 15px; border:none; border-radius:4px; cursor:pointer;'>Reassign ALL Patients to Me</button>
            <p><small>This will link every patient in the database to your account so they show up in your 'Search' screen.</small></p>
          </form>";

    // 7. List Patients and their Doctors
    echo "<h3>Patient Audit (Current Status)</h3>";
    echo "<table border='1' cellpadding='5' style='border-collapse: collapse; width:100%'>
            <tr style='background:#eee;'><th>Patient ID</th><th>Name</th><th>Current Owner (Doctor ID)</th><th>Doctor Exists?</th></tr>";
    
    $res = $conn->query("SELECT p.patient_id, p.name, p.doctor_id, d.name as doc_name 
                         FROM patient p 
                         LEFT JOIN doctor d ON p.doctor_id = d.doctor_id");
    
    while ($row = $res->fetch_assoc()) {
        $exists = !empty($row['doc_name']) ? "<span style='color:green'>Yes ({$row['doc_name']})</span>" : "<span style='color:red'>NO (Orphaned)</span>";
        echo "<tr>
                <td>{$row['patient_id']}</td>
                <td>{$row['name']}</td>
                <td>{$row['doctor_id']}</td>
                <td>$exists</td>
              </tr>";
    }
    echo "</table>";

} catch (Exception $e) {
    echo "<p style='color:red'>Error: " . $e->getMessage() . "</p>";
}
?>

