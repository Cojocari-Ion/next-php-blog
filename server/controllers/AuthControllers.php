<?php


namespace Server\Controllers;

use mysqli;
use services\DB;


class AuthControllers
{
    public $conn = null;

    public function __construct()
    {
        // create connection

        $this->conn = (new DB())->database();
    }

    public function auth()
    {
        try {
            // Set CORS headers
            header("Access-Control-Allow-Origin: *");

            header("Access-Control-Allow-Headers: *");


            echo json_encode(['message' => "Hello"]);
        } catch (\Exception $e) {
            var_dump($e->getMessage());
        }
    }

    public function getSearchResult()
    {
        try {

            header("Access-Control-Allow-Origin: *");

            header("Access-Control-Allow-Headers: *");

            $postsArray = [];
            $keyword = $_GET['keyword'] ?? null;

            if ($keyword) {
                $sql = "SELECT id,title FROM posts WHERE title LIKE '% $keyword%' LIMIT 5";
                $response = mysqli_query($this->conn, $sql);

                if ($response) {
                    while ($row = mysqli_fetch_assoc($response)) {
                        $postsArray['posts'][] = $row;
                    }
                }
            }

            echo json_encode($postsArray, JSON_PRETTY_PRINT);
        } catch (\Exception $e) {
            var_dump($e->getMessage());
            exit;
        }
    }
}
