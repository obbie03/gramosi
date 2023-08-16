<?php

header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Headers: Content-Type');
header("Cache-Control: no-cache, no-store, must-revalidate");
header("Pragma: no-cache");
header("Expires: 0");
ini_set('max_execution_time', 9999);

include('connector.php');

if(isset($_GET['getgen'])){
    $uid = 1;
    $cid = getcid($uid);
    $sof = $f->selectData('source_of_fund', '', "where c_id = '$cid'")->fetchAll();
    $banks = $f->selectData('bank', '', "where c_id = '$cid'")->fetchAll();
    $cc = $f->selectData('collection_center', '', "where c_id = '$cid'")->fetchAll();
    $coa = $f->selectData('chart_of_account', '', "where c_id = '$cid'")->fetchAll();
    echo json_encode(array('sof'=>$sof, 'banks'=>$banks, 'cc'=>$cc, 'coa'=>$coa));
}

if(isset($_GET['uniqueId'])){
    $code = $_GET['uniqueId'];
    $data = $f->selectJoins("SELECT *, p.name as programme FROM chart_of_account c left join programmes p on c.id = p.c_id WHERE account = '$code' ")->fetchAll();
    echo json_encode($data);
}

if(isset($_GET['custName'])){
    // $uid = $_GET['searchUid'];
    $uid = 1;
    $cid = getcid($uid);
    $name = $_GET['custName'];
    $data = $f->selectJoins("SELECT * FROM customers c left join authentication a on c.u_id = a.id left join bio_data b on c.u_id = b.u_id where a.c_id = '$cid' and (b.firstname like '%$name%' or b.lastname like '%$name%')")->fetchAll();
    echo json_encode($data);
}