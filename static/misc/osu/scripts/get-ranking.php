<?php 

// Fetch the ranking from http://api.osugame.online/fetch/ as JSON
$ranking = file_get_contents('http://api.osugame.online/fetch/');

header('Content-Type: application/json');
echo $ranking;

?>