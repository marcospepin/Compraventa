<?php
header('Content-Type: application/json');
echo json_encode([
    'status' => 'ok',
    'php_version' => phpversion(),
    'mysql_available' => extension_loaded('mysqli')
]);
?>
