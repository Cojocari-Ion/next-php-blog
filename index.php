<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');

require "server/services/DB.php";

use services\DB;

var_dump(new DB());
