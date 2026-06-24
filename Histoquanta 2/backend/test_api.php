<?php
// Quick test: simulate a call to patient_profile.php
$_GET['patient_id'] = 'PT020';
$_GET['doctor_id'] = '10';
$_SERVER['REQUEST_METHOD'] = 'GET';

ob_start();
include 'patient_profile.php';
$output = ob_get_clean();

$data = json_decode($output, true);
echo "Status: " . ($data['status'] ? 'OK' : 'FAIL') . "\n";
echo "Patient: " . ($data['patient']['name'] ?? 'N/A') . "\n";
echo "Reports count: " . count($data['reports'] ?? []) . "\n";

foreach (($data['reports'] ?? []) as $r) {
    echo "  - [" . $r['source'] . "] " . ($r['report_type'] ?? 'N/A') . " | table=" . ($r['table_name'] ?? 'N/A') . "\n";
}
