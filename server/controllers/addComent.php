<?php
require __DIR__ . '/../services/DB.php';

use services\DB;

$db = new DB();
$conn = $db->database();

header("Access-Control-Allow-Origin: *"); // Allow requests from any origin
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Allow the specified HTTP methods
header("Access-Control-Allow-Headers: *"); // Allow the specified headers

$requestHeaders = getallheaders();
$authorizationHeader = $requestHeaders['Authorization'] ?? '';
$token = str_replace('Bearer ', '', $authorizationHeader);

$requestBody = file_get_contents('php://input');
$comentData = json_decode($requestBody, true);

$stmt = $conn->prepare("SELECT * FROM users WHERE token = ?");
$stmt->bind_param('s', $token);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['message' => 'User not found']);
    exit;
}

if (empty($comentData['userId']) || empty($comentData['content']) || empty($comentData['postId'])) {
    echo json_encode(['message' => 'Missing required fields']);
    exit;
}

$stmt = $conn->prepare("SELECT * FROM posts WHERE id = ?");
$stmt->bind_param('s', $comentData['postId']);
$stmt->execute();
$result = $stmt->get_result();
$post = $result->fetch_assoc();

if ($post) {
} else {
    echo json_encode(['message' => 'Post not found']);
    exit;
}

$coments = json_decode($post['comments'], true) ?? [];
$likes = json_decode($post['likes'], true) ?? [];

$preetyPost = [
    'user' => $post['user_id'],
    'title' => $post['title'],
    'content' => $post['content'],
    'image' => $post['image'],
    'likes' => $post['likes']
];

$newComment = new stdClass();

$newComment->userId = $comentData['userId'];
$newComment->postId = $comentData['postId'];
$newComment->content = $comentData['content'];
$newComment->ts = $comentData['timeStamp'];

array_push($coments, $newComment);

$comentsStringified = json_encode($coments);

$stmt = $conn->prepare("UPDATE posts SET comments = ? WHERE id = ?");
$stmt->bind_param('ss', $comentsStringified, $comentData['postId']);
$stmt->execute();

if ($stmt->affected_rows > 0) {
    $post['comments'] = $coments;
    $post['likes'] = $likes;
    // Create the response array and encode it once.
    $response = [
        'message' => 'comment added successfully',
        'post' => $post
    ];
    echo json_encode($response);
} else {
    echo json_encode(['message' => 'Failed to add comment']);
}
