<?php


namespace Server\Controllers;

use mysqli;
use services\DB;

class PostsControllers
{
    public $conn = null;

    public function __construct()
    {
        // create connection

        $this->conn = (new DB())->database();
    }

    // Get posts from third party api

    public function getPosts()
    {

        try {

            // Getting data
            $url = "https://jsonplaceholder.typicode.com/posts";
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_AUTOREFERER, TRUE);
            curl_setopt($ch, CURLOPT_HEADER, 0);
            curl_setopt($ch, CURLOPT_ENCODING, 0);
            curl_setopt($ch, CURLOPT_MAXREDIRS, 10);
            curl_setopt($ch, CURLOPT_TIMEOUT, 30);
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_FOLLOWLOCATION, TRUE);
            curl_setopt($ch, CURLOPT_FOLLOWLOCATION, array('Content-Type: application/json'));

            // Get images

            $url = "https://jsonplaceholder.typicode.com/photos";

            $chImg = curl_init();

            curl_setopt($chImg, CURLOPT_AUTOREFERER, TRUE);
            curl_setopt($chImg, CURLOPT_HEADER, 0);
            curl_setopt($chImg, CURLOPT_ENCODING, 0);
            curl_setopt($chImg, CURLOPT_MAXREDIRS, 10);
            curl_setopt($chImg, CURLOPT_TIMEOUT, 30);
            curl_setopt($chImg, CURLOPT_CUSTOMREQUEST, "GET");
            curl_setopt($chImg, CURLOPT_RETURNTRANSFER, TRUE);
            curl_setopt($chImg, CURLOPT_URL, $url);
            curl_setopt($chImg, CURLOPT_FOLLOWLOCATION, TRUE);
            curl_setopt($chImg, CURLOPT_FOLLOWLOCATION, array('Content-Type: application/json'));

            $responseData = json_decode(curl_exec($ch), true);
            $responseImages = json_decode(curl_exec($chImg), true);
            $newArray = [];


            // COmbining data

            foreach ($responseData as $resData) {
                if (isset($responseImages[$resData['id']])) {
                    $resData['image'] = $responseImages[$resData['id']]["url"];
                }

                $newArray[] = $resData;
            }

            $this->savePostsToDatabase($newArray);
        } catch (\Exception $e) {
            var_dump($e->getMessage());
            exit;
        }
    }

    // Save posts to DB from api
    public function savePostsToDatabase($posts = null)
    {

        foreach ($posts as $post) {
            $sql = "INSERT INTO posts(`user_id`, `title`, `content`, `image`)
                VALUES (
                    '" . $post['userId'] . "',
                    '" . $post['title'] . "',
                    '" . $post['body'] . "',
                    '" . $post['image'] . "')";

            if (mysqli_query($this->conn, $sql)) {
                echo "Record created";
            } else {
                echo "Error: " . $sql . "<br/>" . mysqli_error($this->conn);
            }
        }

        mysqli_close($this->conn);
    }

    public function getPostsFromDatabase()
    {
        try {

            header("Access-Control-Allow-Origin: *");

            header("Access-Control-Allow-Headers: *");

            // Rest of your PHP code...


            $perPage = $_GET['limit'] ?? 5;
            $pageNumber = $_GET['offset'] ?? 0;
            $postsArray = [];

            $sql = "SELECT  * FROM posts";
            $totalPosts = mysqli_num_rows(mysqli_query($this->conn, $sql));


            $sql = "SELECT * FROM posts ORDER BY id LIMIT $perPage OFFSET $pageNumber";
            $response = mysqli_query($this->conn, $sql);

            if ($response) {
                while ($row = mysqli_fetch_assoc($response)) {
                    $postsArray['posts'][] = $row;
                }
            } else {
                echo "Error" . mysqli_error($this->conn);
            }

            $postsArray['count'] = $totalPosts;
            mysqli_close($this->conn);

            echo json_encode($postsArray, JSON_PRETTY_PRINT);
            // return json_encode($postsArray, JSON_PRETTY_PRINT);
            exit;
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
