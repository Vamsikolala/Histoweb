<?php
// Just a quick script to test the DB
include 'db.php';

$res = $conn->query("SELECT disease_id FROM disease LIMIT 1");
if ($res) {
    print_r($res->fetch_assoc());
} else {
    echo "disease query failed";
}

$res2 = $conn->query("SELECT id FROM patient_analysis_reports LIMIT 1");
if ($res2) {
    print_r($res2->fetch_assoc());
} else {
    echo "patient_analysis_reports query failed";
}
?>
