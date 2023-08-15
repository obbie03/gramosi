<?php
include('connector.php');

if(isset($_POST['formType'])){

    if($f->checkTableValue($_POST['email'], 'users', 'email')){
        echo json_encode(array('status'=>400, 'msg'=>'Email already exists'));
        return;
    }
    $userData = array(
        'email'=>$_POST['email'],
        'user_type'=>$_POST['usertype'],
        'password'=>password_hash('123abc', PASSWORD_DEFAULT),
        'mode'=>0,
        'cid'=>$_POST['cid']
    );
   $check = $f->insertData($userData, 'authentication');
   if($check){
    $uid = $f->selectData('authentication','', "where email='".$_POST['email']."' limit 1")->fetchObject()->uid;

    if($_POST['userType'] != 1){
        $bioData = array(
            'uid' => $uid,
            'firstname' => $_POST['firstname'],
            'lastname' => $_POST['lastname'],
            'phonenumber' => $_POST['phonenumber'],
            'dob' => $_POST['dob'],
            'sex' => $_POST['sex'],
            'nrc' => $_POST['nrc'],
            'middlename' => ''
        );
        $insert = $f->insertData($bioData, 'bio_data');

        if($insert){
            $customerDetails = array(
                'uid' => $uid,
                'account_no' => $_POST['account_no'],
                'code' => $_POST['code']
            );
            $f->insertData($customerDetails, 'customers');
        }
    }
   }

   echo json_encode(array('status'=>200, 'msg'=>'successful registration'));
}

