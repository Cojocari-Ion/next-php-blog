<?php
require __DIR__ . '/../services/DB.php';

use services\DB;

$db = new DB();
$conn = $db->database();

header("Access-Control-Allow-Origin: *"); // Allow requests from any origin
header("Access-Control-Allow-Methods: POST, OPTIONS"); // Allow the specified HTTP methods
header("Access-Control-Allow-Headers: Content-Type"); // Allow the specified headers

$requestBody = file_get_contents('php://input');
$userData = json_decode($requestBody, true);

$userEmail = $userData['userEmail'];
$userPwd = $userData['userPwd'];

// Validate the required fields
if (empty($userEmail) || empty($userPwd)) {
    echo json_encode(['message' => 'Missing required fields']);
    exit;
}

// Retrieve hashed password from the database based on the user's email
$stmt = $conn->prepare("SELECT userPwd FROM users WHERE userEmail = ?");
$stmt->bind_param('s', $userEmail);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['message' => 'User not found']);
    exit;
}

$row = $result->fetch_assoc();
$hashedPassword = $row['userPwd'];

if (password_verify($userPwd, $hashedPassword)) {
    // Retrieve user data from the database
    $stmt = $conn->prepare("SELECT * FROM users WHERE userEmail = ?");
    $stmt->bind_param('s', $userEmail);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(['message' => 'User not found']);
        exit;
    }

    $user = $result->fetch_assoc();

    // Remove the password field from the response
    unset($user['userPwd']);

    // Add the user data to the response
    $response = ['message' => 'Login successful', 'user' => $user];
    echo json_encode($response);
} else {
    echo json_encode(['message' => 'Invalid credentials']);
}

$stmt->close();
$conn->close();
