<?php

namespace Core;
use \PDO;
include('DB.php');

use PHPMailer\PHPMailer\PHPMailer;
include_once "PHPMailer/PHPMailer.php";
include_once "PHPMailer/Exception.php";
include_once "PHPMailer/SMTP.php";

class Functions {
     private $d =  null;
    public function __construct($host, $port, $db, $user,$pass)
    {
        $d = new DB($host, $port, $db, $user,$pass);
        $this->d = $d;
    }
    public function createTable($sql){
        $connect = $this->d->getConnection();
        $connect->query($sql);
    }

public function insertData(array $data, $table){
    $connect = $this->d->getConnection();
    $cleanedData = array_map([$this, 'cleanText'], $data);
    $cols = implode(',', array_keys($data));
    $vals = "'".implode("','", array_values($data))."'";
    $query = "INSERT INTO $table ($cols) VALUES ($vals)";
    return $connect->query($query) || false;
 }

public function getPDF($code, $type){
    include_once 'pdf.php';
    $file_name = md5(rand()) . '.pdf';
    $html_code = $code;
    $pdf = new Pdf();
    $pdf->load_html($html_code);
    if($type != 1){
        $pdf->setPaper('A4', 'landscape');
    }
    $pdf->render();
    $file = $pdf->output();
    file_put_contents($file_name, $file);
    return $file_name;
}

public function sendEmail($to,$subject,$message,$file){
    $mail = new PHPMailer();
    //SMTP Settings
      //if we want to send via SMTP
    $mail->isSMTP();
    $mail->Host = "mail.mentorpreneur.net";
    $mail->SMTPAuth = true;
    $mail->Username = 'system@mentorpreneur.net';
    $mail->Password = 'aMv;Qfo1abrV';
    $mail->SMTPSecure = 'ssl'; 
    $mail->Port = '465'; 

    // $mail->SMTPDebug = 2;  

    //Email Settings
    $mail->isHTML(true);
    $mail->setFrom('system@mentorpreneur.net', 'Mentorpreneur');
    $mail->addAddress($to);
    $mail->Subject = $subject;
    $mail->Body = $message;
    $mail->addAttachment($file);
    if ($mail->send()) {
        $status = "success";
        $response = "Email is sent!";
    } else {
        $status = "failed";
        $response = "Something is wrong: <br><br>" . $mail->ErrorInfo;
    }
    // echo json_encode(array("status" => $status, "response" => $response));
    return $response;

}

public function checkColumns(? string $key,? string $col,? string $table){
    $connect = $this->d->getConnection();
   return ($connect->query("SELECT * FROM $table WHERE LOWER($col) = LOWER('$key')")->rowCount() > 0) || false;
}
public function updateColumn($table,$column,$newVal,$pk,$pkKey) {
    $connect = $this->d->getConnection();
    if(trim($newVal)){
        if($connect->query("UPDATE $table SET $column = '$newVal' WHERE $pk = $pkKey"))
            return true;
        return false;    
    }
    return true;
}
public function deleteData(? string $table, ? string $condition){
    $connect = $this->d->getConnection();
    if(trim($condition))
        if($connect->query("DELETE FROM $table WHERE $condition"))
            return true;
        return false; 
    if($connect->query("DELETE FROM $table"))
        return true;
    return false;        
}
public function selectJoins( ? string $query){
    $connect = $this->d->getConnection();
    $data = $connect->query("$query");
    if($data) return $data;
    else return false;
}
public function load($query){
    $connect = $this->d->getConnection();
    $arr = array();
    $data = $connect->query($query);
    while($row = $data->fetch(PDO::FETCH_ASSOC)){
        $arr[]=$row;
    }
    echo json_encode($arr);
}

public function runQuery($query){
    $connect = $this->d->getConnection();
    return $connect->query($query) || false;
}
public function selectData( ? string $table,? string $columns, ? string $condition){
    $connect = $this->d->getConnection();
    $colList = '';
    !trim($columns) ? $colList = '*' : $colList = implode(', ', explode(', ', $columns));
    $data = $connect->query("SELECT $colList FROM $table $condition");
    if($data) return $data;
    else return false;
}


public function checkTableValue($value, $table, $column){
    $connect = $this->d->getConnection();
    if($connect->query("SELECT * from $table WHERE LOWER($column) = LOWER('$value') AND $column !=''")->rowCount() > 0)
        return true;
    return false;
}
public function cleanText($text){
    $first = preg_replace("^[\\\\\*\?\"\|]^", "", $text);
    return preg_replace("^[']^", "\'", $first);
}
public function moveFile($filename,$path){
    if (isset($_FILES[$filename]) && $_FILES[$filename]['size'] > 1) {
        $ext = pathinfo($_FILES[$filename]['name'], PATHINFO_EXTENSION);
        // $ext = explode("/", $_FILES[$filename]['type'])[1];
        $newname = rand(1000, 100000) . rand(300 * rand(100, 600), 500 * rand(200, 900)) . '.' . $ext;
        $path .= $newname;
        $tmp = $_FILES[$filename]['tmp_name'];
        if (move_uploaded_file($tmp, $path)) {
            return $newname;
        }
        return '';
    }
}
}



