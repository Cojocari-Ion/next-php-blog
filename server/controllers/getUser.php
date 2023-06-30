<?php
require __DIR__ . '/../services/DB.php';

use services\DB;

$db = new DB();
$conn = $db->database();

header("Access-Control-Allow-Origin: *"); // Allow requests from any origin
header("Access-Control-Allow-Methods: GET, OPTIONS"); // Allow the specified HTTP methods
header("Access-Control-Allow-Headers: Content-Type"); // Allow the specified headers

// Get the token from the request body
$requestBody = file_get_contents('php://input');
$data = json_decode($requestBody, true);
$token = $data['token'];

// Validate the token
if (!$token) {
    http_response_code(401);
    echo json_encode(['message' => 'Missing token']);
    exit;
}

// Prepare the SQL statement to fetch the user based on the token
$stmt = $conn->prepare("SELECT * FROM users WHERE token = ?");
$stmt->bind_param('s', $token);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    // Remove sensitive information (e.g., password) before sending the response
    unset($user['userPwd']);

    echo json_encode(['message' => 'User retrieved successfully', 'user' => $user]);
} else {
    http_response_code(401);
    echo json_encode(['message' => 'Invalid token']);
}

$stmt->close();
$conn->close();
