<?php
include('config.php');
header('Content-Type: application/json');

$salaId = $_GET['salaId'];
$horaInicio = $_GET['horaInicio'];
$horaFin = $_GET['horaFin'];

$sql = "SELECT * FROM pases WHERE numeroSala = ? AND ((horaInicio <= ? AND horaFin > ?) OR (horaInicio < ? AND horaFin >= ?))";
$stmt = $conn->prepare($sql);
$stmt->bind_param("issss", $salaId, $horaInicio, $horaInicio, $horaFin, $horaFin);
$stmt->execute();
$result = $stmt->get_result();

echo json_encode(['valid' => $result->num_rows == 0]);

$stmt->close();
$conn->close();
?>
