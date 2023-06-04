<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');

require "server/services/DB.php";
require "server/controllers/PostsControllers.php";


use Server\Controllers\PostsControllers;
use services\DB;

// var_dump(new DB());
(new PostsControllers)->getPosts();ASD
