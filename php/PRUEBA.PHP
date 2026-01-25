<?php
include('config.php');
header('Content-Type: application/json');

// recoger el id de la solucitud fetch:
$cineId = $_GET['cine'];

// Lanzar consulta sql:
$sql = "SELECT * FROM salas WHERE cine = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('i', $cineId);
$stmt->execute();
$result->get_result();

$salas = [];

while ($row = $result->fetch_assoc()) {
    $salas[] = $row;
}

echo json_encode($salas);
$stmt->close();
$conn->close();

?>