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

// Validate the required fields
if (empty($userData['userName']) || empty($userData['userEmail']) || empty($userData['userPwd'])) {
    echo json_encode(['message' => 'Missing required fields']);
    exit;
}

// Check if there is user with same email
$stmt = $conn->prepare("SELECT * FROM users WHERE userEmail = ?");
$stmt->bind_param('s', $userData['userEmail']);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(['message' => 'User with the same email already exists']);
    exit;
}

$hashedPassword = password_hash($userData['userPwd'], PASSWORD_DEFAULT);

// Generate a token
$token = generateToken();

// Prepare the SQL statement
if (isset($userData['image'])) {
    // With image
    $stmt = $conn->prepare("INSERT INTO users (userName, userEmail, userPwd, token, photo) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param('sssss', $userData['userName'], $userData['userEmail'], $hashedPassword, $token, $userData['image']);
} else {
    // Without image
    $stmt = $conn->prepare("INSERT INTO users (userName, userEmail, userPwd, token) VALUES (?, ?, ?, ?)");
    $stmt->bind_param('ssss', $userData['userName'], $userData['userEmail'], $hashedPassword, $token);
}

// Execute the statement
if ($stmt->execute()) {

    $user = [
        'userName' => $userData['userName'],
        'userEmail' => $userData['userEmail'],
        'token' => $token
    ];

    echo json_encode(['message' => 'User created successfully', 'user' => $user]);
} else {
    echo json_encode(['message' => 'Failed to create user']);
}

$stmt->close();
$conn->close();

function generateToken()
{
    // Generate a random token
    $token = bin2hex(random_bytes(32));
    return $token;
}
