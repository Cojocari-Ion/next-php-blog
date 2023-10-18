<?php
require __DIR__ . '/../services/DB.php';

use services\DB;

$db = new DB();
$conn = $db->database();

$popular = 1;

header("Access-Control-Allow-Origin: *");
// header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, Accept");


$stmt = $conn->prepare("SELECT * FROM users WHERE popular = ?");
$stmt->bind_param('i', $popular);
$stmt->execute();
$result = $stmt->get_result();

if ($result) {
    $users = [];

    while ($row = $result->fetch_assoc()) {
        unset($row['userPwd']);
        unset($row['token']);
        $users[] = $row;
    }

    $response = [
        'users' => $users,
    ];

    $jsonOutput = json_encode($response, JSON_PRETTY_PRINT);
    echo $jsonOutput;
} else {
    echo json_encode(['message' => 'Failed to fetch users']);
}

$stmt->close();
$conn->close();
