<?php
include('config.php');
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);
$salaId = $data['salaId'];
$peliculaId = $data['peliculaId'];

$sql = "UPDATE salas SET pelicula = ? WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $peliculaId, $salaId);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Película asignada correctamente.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al asignar la película.']);
}

$stmt->close();
$conn->close();
?>
