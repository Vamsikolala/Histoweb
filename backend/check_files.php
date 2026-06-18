<?php
$dir = 'uploads/profiles/';
if (is_dir($dir)) {
    $files = scandir($dir);
    echo "Files in uploads/profiles/:\n";
    print_r($files);
} else {
    echo "Directory not found: $dir";
}
?>
