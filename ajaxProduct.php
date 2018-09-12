<?php
$id = Trim(stripslashes($_POST['idProduct']));

if($id == 7) {
    $name = "Piskocream";
} else if($id == 5) {
    $name = "Deeper";
} else if($id == 8) {
    $name = "Varyforte";
} else if($id == 9) {
    $name = "Psoridex";
}

if (true && $id != 0) {
    echo json_encode([
		'status' => 'ok',
		'id' => $id,
    	'name' => $name,
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