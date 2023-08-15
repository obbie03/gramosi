<?php
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Headers: Content-Type');
header("Cache-Control: no-cache, no-store, must-revalidate");
header("Pragma: no-cache");
header("Expires: 0");
ini_set('max_execution_time', 9999);

include('connector.php');

$r = include('bills.php');

if (isset($_GET['dashboard-content'])) {
    echo "hello brice!";
}