<?php
// error_reporting(E_ALL);
// ini_set('display_errors', '1');

require "services/DB.php";
require('Api.php');
require('controllers/PostsControllers.php');

use services\DB;
use Api\Api;


// Getting current URL

$current_link = $_SERVER['REQUEST_URI'];

if (str_contains($current_link, '?')) {
    $current_link = explode('?', $current_link);
}

// Routes

$urls = [
    '/next-php-blog/server/posts' => ['PostsControllers@getPostsFromDatabase'],
    '/next-php-blog/server/searchResult' => ['PostsControllers@getSearchResult']
];

// CHeck route availability

$availableRoutes = array_keys($urls);

if (!in_array($current_link[0], $availableRoutes)) {
    header('HTTP/1.0 404 NOT FOUND');
    exit;
}

Api::routing($current_link[0], $urls);
