<?php
require __DIR__ . '/../services/DB.php';

use services\DB;

$db = new DB();
$conn = $db->database();

header("Access-Control-Allow-Origin: *"); // Allow requests from any origin
header("Access-Control-Allow-Methods: GET"); // Allow the specified HTTP methods
header("Access-Control-Allow-Headers: *"); // Allow the specified headers

$sql = "SELECT * FROM post_topics";
$result = $conn->query($sql);

if ($result) {
    $topics = [];

    while ($row = $result->fetch_assoc()) {
        $topics[] = $row;
    }

    $jsonOutput = json_encode(['topics' => $topics], JSON_PRETTY_PRINT);
    echo $jsonOutput;
} else {
    echo json_encode(['message' => 'Failed to fetch topics']);
}
