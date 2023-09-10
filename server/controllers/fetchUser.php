<?php
require __DIR__ . '/../services/DB.php';

use services\DB;

$db = new DB();
$conn = $db->database();

header("Access-Control-Allow-Origin: *"); // Allow requests from any origin
header("Access-Control-Allow-Methods: *"); // Allow the specified HTTP methods
header("Access-Control-Allow-Headers: *"); // Allow the specified headers


$requestBody = file_get_contents('php://input');
$reqData = json_decode($requestBody, true);

// Prepare the SQL statement to fetch the user based on the token
$stmt = $conn->prepare("SELECT * FROM users WHERE userId = ?");
$stmt->bind_param('s', $reqData['id']);
$stmt->execute();
$result = $stmt->get_result();

// echo json_encode(['data' => $reqData]);

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    // Remove sensitive information (e.g., password) before sending the response
    unset($user['userPwd']);

    $newUser = new stdClass();

    $newUser->userId = $user['userId'];
    $newUser->userName = $user['userName'];
    $newUser->photo = $user['photo'];

    echo json_encode(['message' => 'User retrieved successfully', 'user' => $newUser]);
} else {
    http_response_code(401);
    echo json_encode(['message' => 'User not found']);
}

$stmt->close();
$conn->close();
