<?php

header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Headers: Content-Type');
header("Cache-Control: no-cache, no-store, must-revalidate");
header("Pragma: no-cache");
header("Expires: 0");
ini_set('max_execution_time', 9999);

include('connector.php');

if(isset($_GET['gl'])){
    $cid = getCid($_GET['gl']);
    $bills = $f->selectJoins("SELECT b.*,i.*, c.*
    FROM bills AS b
    LEFT JOIN (
        SELECT *
        FROM billsitems
    ) AS i ON b.id = i.b_id left join bio_data c on b.customer = c.u_id where b.cid='$cid'")->fetchAll();
    $bids = array_map(function ($bill) {return $bill['id'];}, $bills);
    $final = implode(',', $bids);
    $recs = $f->selectJoins("select * from receipts r left join bills b on r.b_id = b.id left join bio_data c on b.customer = c.u_id where b_id in ($final)")->fetchAll();
    echo json_encode(array('bills'=>$bills, 'recs'=>$recs));
}
