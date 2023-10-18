<?php

require __DIR__ . '/../services/DB.php';

use services\DB;

$db = new DB();
$conn = $db->database();

header("Access-Control-Allow-Origin: *"); // Allow requests from any origin
header("Access-Control-Allow-Methods: GET"); // Allow the specified HTTP methods
header("Access-Control-Allow-Headers: *"); // Allow the specified headers

$limit = $_GET['limit'] ?? 10;
$offset = $_GET['offset'] ?? 0;
$topic = $_GET['topic'];
$date = $_GET['date'];

// Use prepared statements to prevent SQL injection
if ($topic === "all") {
    // Retrieve posts from all topics

    $sql = "SELECT * FROM posts WHERE date >= ? LIMIT ? OFFSET ?";
    $stmt = $conn->prepare($sql);

    if ($stmt) {
        $stmt->bind_param("iii", $date, $limit, $offset);
    } else {
        echo json_encode(['message' => 'Failed to prepare the statement']);
        exit;
    }
} else {

    // Retrieve posts for a specific topic
    $sql = "SELECT * FROM posts WHERE topic = ? AND date >= ? LIMIT ? OFFSET ?";
    $stmt = $conn->prepare($sql);

    if ($stmt) {
        $stmt->bind_param("siii", $topic, $date, $limit, $offset);
    } else {
        echo json_encode(['message' => 'Failed to prepare the statement']);
        exit;
    }
}

$stmt->execute();
$result = $stmt->get_result();

$sqlCount = "SELECT COUNT(*) AS post_count FROM posts";
$stmtCount = $conn->prepare($sqlCount);
$stmtCount->execute();
$countResult = $stmtCount->get_result();
$countRow = $countResult->fetch_assoc();
$allPostsCount = $countRow['post_count'];

if ($result) {
    $posts = [];

    while ($row = $result->fetch_assoc()) {
        $row['likes'] = json_decode($row['likes'], true) ?? [];
        $row['comments'] = json_decode($row['comments'], true) ?? [];
        $posts[] = $row;
    }

    $response = [
        'post_count' => $allPostsCount,
        'posts' => $posts,
    ];

    $jsonOutput = json_encode($response, JSON_PRETTY_PRINT);
    echo $jsonOutput;
} else {
    echo json_encode(['message' => 'Failed to fetch posts']);
}

$stmt->close();
$stmtCount->close();
