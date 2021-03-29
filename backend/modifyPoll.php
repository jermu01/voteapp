<?php
session_start();
// Check if user is logged in
if (!isset($_SESSION['user_id'])){
    $data = array(
        'error' => 'You`re not allowed here!!'
    );

    header("Contest-Type: application/json;charset=utf-8");
    echo json_encode($data);
    die();
}

$json = file_get_contents('php://input');
$pollData = json_decode($json);

$data = array();

include_once 'pdo-connect.php';

// Uptade Poll-table
try {
    $stmt = $conn->prepare("UPDATE poll SET topic = :topic, start = :start, end = :end WHERE id = :id;");
    $stmt->bindParam(":topic", $pollData->topic);
    $stmt->bindParam(":start", $pollData->start);
    $stmt->bindParam(":end", $pollData->end);
    $stmt->bindParam(":id", $pollData->id);

    if($stmt->execute() == false){
        $data['error'] = 'Error modifying poll!!';
    } else {
        $data['success'] = 'Poll edit successfull!!';
}

} catch (PDOException $e){
    $data['error'] = $e->getMessage();
}

// Update options -table
try {

    foreach ($pollData->options as $option){
        if(isset($option->id)){
            $stmt = $conn->prepare("UPDATE option SET name = :name WHERE id = :id;");
            $stmt->bindParam(":name", $option->name);
            $stmt->bindParam(":id", $option->id);
        } else {
            $stmt = $conn->prepare("INSERT INTO option (name, poll_id) VALUES (:name, :pollid)");
            $stmt->bindParam(":name", $option->name);
            $stmt->bindParam(":pollid", $pollData->id);
        }

        if($stmt->execute() == false){
            $data['error'] = 'Error modifying option!!';
        } else {
            $data['success'] = 'Option edit successfull!!';
        }
    }

} catch (PDOException $e){
    $data['error'] = $e->getMessage();
}

// Delete options
try {

    foreach ($pollData->todelete as $option){

        $stmt = $conn->prepare("DELETE FROM option WHERE id = :id;");
        $stmt->bindParam(":id", $option->id);

        if($stmt->execute() == false){
            $data['error'] = 'Error deleting option!!';
        } else {
            $data['success'] = 'Option delete successfull!!';
        }
    }

} catch (PDOException $e){
    $data['error'] = $e->getMessage();
}


header("Contest-Type: application/json;charset=utf-8");
echo json_encode($data);