<?php

include('connector.php');

$tb1 = "CREATE TABLE property (
    id  INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    c_id int not null,
    type_id int(11) NOT NULL,
    coa_id int(11) NOT NULL,
    street VARCHAR(100) NOT NULL,
    town VARCHAR(100) NOT NULL,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    plot VARCHAR(100) NOT NULL,
    hectares VARCHAR(100) NOT NULL,
    value FLOAT(10,2) NOT NULL,
    improvement FLOAT(10,2) NOT NULL,
    rate_value FLOAT(10,2) NOT NULL,
    rate  FLOAT(10,2) not null,
    payable FLOAT(10,2) not null
  )";

$tb2 = "CREATE TABLE property_type (
    id  INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name varchar(100) not null
    )";

$tb3 = "CREATE TABLE bio_data (
    id  INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    u_id int not null,
    firstname VARCHAR(50) NOT NULL,
    middlename VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    nrc VARCHAR(20) NOT NULL,
    phonenumber VARCHAR(20) NOT NULL,
    sex varchar(10) not null,
    dob date
  )";

$tb4 = "CREATE TABLE authentication (
    id  INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    c_id int not null,
    email VARCHAR(100) NOT NULL,
    user_type int not null,
    password varchar(255) not null,
    mode int not null default 0,
    date  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )";

$tb5 = "CREATE TABLE customers (
    id  INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    u_id int(11) not null,
    account_no VARCHAR(20) NOT NULL,
    code varchar(10) not null
  )";

$tb6 = "CREATE TABLE chart_of_account (
    id  INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    c_id int not null,
    name varchar(50) not null,
    programme int not null,
    account varchar(20) not null,
    department varchar(20) not null,
    amount FLOAT(10,2) NOT NULL,
    class varchar(10) not null
  )";

$tb7 = "CREATE TABLE programmes (
    id  INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    c_id int not null,
    name varchar(100) not null
    )";

$tb8 = "CREATE TABLE bank (
    id  INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    c_id int not null,
    code varchar(10) not null,
    account_no VARCHAR(20) NOT NULL,
    name varchar(50) not null
  )";

$tb9 = "CREATE TABLE user_property (
    id  INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    u_id varchar(10) not null,
    p_id VARCHAR(20) NOT NULL,
    date  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )";

$tb10 = "CREATE TABLE bills (
    id  INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    invoice_no varchar(10) not null,
    sof_id int not null,
    cc_id int not null,
    customer int not null,
    coa_id int(11) NOT NULL,
    issuer int not null,
    amount  float(10,2) not null,
    description text,
    bank varchar(20) not null,
    date  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )";

$tb11 = "CREATE TABLE receipts (
    id  INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    receipt_no varchar(10) not null,
    b_id int not null,
    issuer int not null,
    amount  float(10,2) not null,
    description text,
    date  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )";

$tb12 = "CREATE TABLE company (
    id  INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name varchar(100) not null,
    email varchar(50),
    pnumber varchar(50),
    town varchar(50),
    box varchar(50)
    )";

$tb13 = "CREATE TABLE billsItems (
    id  INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    b_id int not null,
    amount  float(10,2) not null
    )";

$arr = array($tb1, $tb2, $tb3, $tb4, $tb5, $tb6, $tb7, $tb8, $tb9, $tb10, $tb11, $tb12, $tb13);
foreach($arr as $a){
    $f->createTable($a);
}
