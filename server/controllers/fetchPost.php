<?php
require __DIR__ . '/../services/DB.php';

use services\DB;

$db = new DB();
$conn = $db->database();

header("Access-Control-Allow-Origin: *"); // Allow requests from any origin
header("Access-Control-Allow-Methods: *"); // Allow the specified HTTP methods
header("Access-Control-Allow-Headers: *"); // Allow the specified headers


$requestBody = file_get_contents('php://input');
$postId = json_decode($requestBody, true);


$id = $_GET['postId'];

$stmt = $conn->prepare("SELECT * FROM posts WHERE id = ?");
$stmt->bind_param('s', $id);
$stmt->execute();
$result = $stmt->get_result();
$post = $result->fetch_assoc();
$likes = json_decode($post['likes'], true) ?? [];
$comments = json_decode($post['comments'], true) ?? [];

if ($post) {
    $post['likes'] = $likes;
    $post['comments'] = $comments;
    echo json_encode(['message' => 'Post found', 'post' => $post]);
} else {
    echo json_encode(['message' => 'Post not found']);
    exit;
}
