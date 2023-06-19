<?php
require __DIR__ . '/../services/DB.php';

use services\DB;

$db = new DB();
$conn = $db->database();

header("Access-Control-Allow-Origin: *"); // Allow requests from any origin
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Allow the specified HTTP methods
header("Access-Control-Allow-Headers: Content-Type"); // Allow the specified headers


$limit = $_GET['limit'] ?? 10;
$offset = $_GET['offset'] ?? 0;

$sql = "SELECT * FROM posts LIMIT $limit OFFSET $offset";
$result = $conn->query($sql);

if ($result) {
    $posts = [];
    while ($row = $result->fetch_assoc()) {
        $posts[] = $row;
    }

    $jsonOutput = json_encode(['posts' => $posts], JSON_PRETTY_PRINT);
    echo $jsonOutput;
} else {
    echo json_encode(['message' => 'Failed to fetch posts']);
}
