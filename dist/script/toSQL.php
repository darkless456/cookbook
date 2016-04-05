<?php
/**
 * @Author: anchen
 * @Date:   2016-04-05 15:03:31
 * @Last Modified by:   anchen
 * @Last Modified time: 2016-04-05 16:30:13
 */

if(isset($_GET['showfav'])){
    include_once('./conn.php');
    $result = $link->query('SELECT * FROM favbook');
    $result_arr = $result->fetchAll(PDO::FETCH_ASSOC);
    $output_arr = [];
    foreach($result_arr as $value){
        // print_r($value).'<br>';
        $output_arr[$value['rid']] = $value;
    }
    echo json_encode($output_arr);

}


if(isset($_POST['saverec'])){
    include_once('./script/conn.php');

}

?>
