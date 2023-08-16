<?php
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Headers: Content-Type');
header("Cache-Control: no-cache, no-store, must-revalidate");
header("Pragma: no-cache");
header("Expires: 0");

include('connector.php');
ini_set('max_execution_time', 9999);

if (isset($_POST['billID'])) {
    $year = date('Y');
    $c = $f->selectJoins("select * from receipts where YEAR(date) = '$year'")->rowCount();
    $c++;
    $recNum = 'R' . $c . '/' . substr(date('Y'), 2, 4);
    $combinedArray = array_combine(
        array('receipt_no', 'b_id', 'issuer', 'amount', 'description'),
        array($recNum, $_POST['billID'], $_POST['recUser'], $_POST['recAmount'], $_POST['recDesc'])
    );
    $check = $f->insertData($combinedArray, 'receipts');
    if ($check) {
        echo json_encode(array('status' => 'done', 'data' => $recNum));
    } else {
        echo json_encode(array('status' => 'Didnt post'));
    }

}

if (isset($_GET['receipts'])) {
    $r = $f->load("SELECT * FROM receipts ORDER BY date DESC");
    echo $r;
}

if (isset($_GET['get_receipt'])) {
    $rid = $_GET['get_receipt'];
    $r = $f->selectJoins("SELECT * FROM receipts WHERE id = '$rid'")->fetchAll(PDO::FETCH_ASSOC);
    $bid = $r[0]['b_id'];
    $b = $f->selectJoins("SELECT * FROM bills WHERE id = '$bid'")->fetchAll(PDO::FETCH_ASSOC)[0];
    $items = $f->selectJoins("SELECT * FROM billsitems WHERE b_id = '$bid'")->fetchAll(PDO::FETCH_ASSOC);
    $total = 0;
    foreach ($items as $item) {
        $total += floatval($item['amount']);
    }
    $cid = $b['customer'];
    $c = $f->selectJoins("SELECT * FROM customers WHERE id = '$cid'")->fetchAll(PDO::FETCH_ASSOC)[0];
    echo json_encode(array("receipt" => $r[0], "bill" => $b, "customer" => $c, "total_amount" => $total));
}