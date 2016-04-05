<?php
/*
 * @Author: darkless
 * @Date:   2016-02-26 16:19:25
 * @Last Modified by:   anchen
 * @Last Modified time: 2016-04-05 16:14:12
*/
// SAE MySQL
 // $hostname = SAE_MYSQL_HOST_M. ':'. SAE_MYSQL_PORT;
 // $dbuser = SAE_MYSQL_USER;
 // $dbpass = SAE_MYSQL_PASS;
 // $dbname = SAE_MYSQL_DB;

 // Weixian MySQL
/* $hostname = 'localhost'. ':'. '3306';
 $dbuser = 'iznbbfpp_nav';
 $dbpass = 'qSU23$t3';
 $dbname = 'iznbbfpp_navdata';*/

// Local MySQL
$hostname = '127.0.0.1';
$dbuser = 'root';
$dbpass = '';
$dbname = 'cookdb';

$dsn = 'mysql:hostname='.$hostname.';dbname='.$dbname;
$link = new PDO($dsn, $dbuser, $dbpass);

 // $link = new mysqli($hostname, $dbuser, $dbpass, $dbname);
 // $link = @mysqli_connect($hostname, $dbuser, $dbpass);
 // if(!$link){
 //     die("Connect to database failure!". mysqli_errno());
 // }

 $link->query("set charactor set 'utf8';");
 $link->query("set names 'utf8';");
 date_default_timezone_set('PRC');

 // $link->select_db($dbname);

?>
