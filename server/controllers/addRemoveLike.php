<?php
require __DIR__ . '/../services/DB.php';

use services\DB;

$db = new DB();
$conn = $db->database();

header("Access-Control-Allow-Origin: *"); // Allow requests from any origin
header("Access-Control-Allow-Methods: *"); // Allow the specified HTTP methods
header("Access-Control-Allow-Headers: *"); // Allow the specified headers

$requestHeaders = getallheaders();
$authorizationHeader = $requestHeaders['Authorization'] ?? '';
$token = str_replace('Bearer ', '', $authorizationHeader);

$requestBody = file_get_contents('php://input');
$postData = json_decode($requestBody, true);

$stmt = $conn->prepare("SELECT * FROM users WHERE token = ?");
$stmt->bind_param('s', $token);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if (!$user) {
    echo json_encode(['message' => 'User not found']);
    exit;
}

// echo json_encode(['user' => $user]);

$stmt = $conn->prepare("SELECT * FROM posts WHERE id = ?");
$stmt->bind_param('s', $postData['postId']);
$stmt->execute();
$result = $stmt->get_result();
$post = $result->fetch_assoc();

// echo json_encode(['post' => $post]);


if ($post) {
} else {
    echo json_encode(['message' => 'Post not found']);
    exit;
}

$likes = json_decode($post['likes'], true) ?? [];

$preetyPost = [
    'user' => $post['user_id'],
    'title' => $post['title'],
    'content' => $post['content'],
    'image' => $post['image'],
    'likes' => $post['likes']
];

if (in_array($postData['userId'], $likes)) {
    // Remove user ID from likes array
    $likes = array_diff($likes, [$postData['userId']]);
    $likesStringified = json_encode($likes);

    $stmt = $conn->prepare("UPDATE posts SET likes = ? WHERE id = ?");
    $stmt->bind_param('ss', $likesStringified, $postData['postId']);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        $post['likes'] = $likes;
        echo json_encode(['message' => 'Like removed successfully', 'post' => $post]);
    } else {
        echo json_encode(['message' => 'Failed to remove like']);
    }

    exit;
} else {
    array_push($likes, $postData['userId']);
    $likesStringified = json_encode($likes);

    $stmt = $conn->prepare("UPDATE posts SET likes = ? WHERE id = ?");
    $stmt->bind_param('ss', $likesStringified, $postData['postId']);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        $post['likes'] = $likes;
        echo json_encode(['message' => 'Like added successfully', 'post' => $post]);
    } else {
        echo json_encode(['message' => 'Failed to add like']);
    }

    exit;
}
