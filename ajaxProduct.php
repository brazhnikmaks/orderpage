<?php
$id = Trim(stripslashes($_POST['idProduct']));

if (true && $id != 0) {
    echo json_encode([
		'status' => 'ok',
		'id' => $id,
    	'name' => 'Deeper',
		'category' => 'Adult',
		'price' => 36,
		'old_price' => 39
    ]);
} else {
    header('HTTP/1.1 400 Bad Request');
    echo json_encode([
    	'status' => 'error',
    	'message' => 'Some error message', 
    	'code' => 400
    ]);
}
?>