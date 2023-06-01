<?php
// error_reporting(E_ALL);
// ini_set('display_errors', '1');

require "server/services/DB.php";

use services\DB;

// Getting current URL

$current_link = $_SERVER['REQUEST_URI'];

var_export($current_link);

exit;

// Routes

$urls = [
    '/redux-php-blog' => ['PostsController@getPostsFromDatabase']
];
