<?php
require 'Core/Functions.php';
use Core\Functions;

$f = new Functions('localhost', 3306, 'gramosic', 'root', '377529');

function getcid($uid)
{
    global $f;
    $cid = $f->selectData('authentication', '', "where id='$uid' limit 1")->fetchObject()->c_id;
    return $cid;
}