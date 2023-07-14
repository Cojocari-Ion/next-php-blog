<?php
require __DIR__ . '/../services/DB.php';

use services\DB;

$db = new DB();
$conn = $db->database();

header("Access-Control-Allow-Origin: *"); // Allow requests from any origin
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Allow the specified HTTP methods
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Allow the specified headers

$requestHeaders = getallheaders();
$authorizationHeader = $requestHeaders['Authorization'] ?? '';
$token = str_replace('Bearer ', '', $authorizationHeader);

$requestBody = file_get_contents('php://input');
$postData = json_decode($requestBody, true);

$stmt = $conn->prepare("SELECT * FROM users WHERE token = ?");
$stmt->bind_param('s', $token);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['message' => 'User not found']);
    exit;
}

if (empty($postData['title']) || empty($postData['content'])) {
    echo json_encode(['message' => 'Missing required fields']);
    exit;
}

$stmt = $conn->prepare("INSERT INTO posts (user_id, title, content, image) VALUES (?, ?, ?, ?)");
$stmt->bind_param('ssss', $postData['userID'], $postData['title'], $postData['content'], $postData['image']);

if ($stmt->execute()) {

    $post = [
        'user' => $postData['userID'],
        'title' => $postData['title'],
        'content' => $postData['content'],
        'image' => $postData['image']
    ];

    echo json_encode(['message' => 'Post created successfully', 'post' => $post]);
} else {
    echo json_encode(['message' => 'Failed to create post']);
}

$stmt->close();
$conn->close();
