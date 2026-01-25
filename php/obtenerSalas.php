<?php
include('config.php');
header('Content-Type: application/json');

$cineId = $_GET['cine'];
$sql = "SELECT id, numero, aforo FROM salas WHERE cine = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $cineId);
$stmt->execute();
$result = $stmt->get_result();

$salas = [];
while ($row = $result->fetch_assoc()) {
    $salas[] = $row;
}

echo json_encode($salas);
$stmt->close();
$conn->close();
?>
