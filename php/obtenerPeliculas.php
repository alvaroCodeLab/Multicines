<?php
include('config.php');
header('Content-Type: application/json');

$sql = "SELECT id, titulo FROM peliculas";
$result = $conn->query($sql);
$peliculas = [];

while ($row = $result->fetch_assoc()) {
    $peliculas[] = $row;
}

echo json_encode($peliculas);
$conn->close();
?>
