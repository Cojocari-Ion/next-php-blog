<?php

// Get the requested URI
$requestUri = $_SERVER['REQUEST_URI'];

// Remove the base path from the requested URI
$basePath = '/next-php-blog/server/';
$requestPath = str_replace($basePath, '', $requestUri);

// Define the mapping of custom paths to PHP files
$routes = [
    'posts' => 'controllers/getPosts.php',
    // Add more routes as needed
];

// Check if the requested path exists in the routes
if (isset($routes[$requestPath])) {
    // Include the corresponding PHP file
    require $routes[$requestPath];
} else {
    // Handle the case when the requested path is not found
    http_response_code(404);
    echo '404 Not Found';
    exit;
}
