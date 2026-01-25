<?php
include('config.php');
header('Content-Type: application/json');

$peliculaId = isset($_GET['peliculaId']) ? $_GET['peliculaId'] : null;

if ($peliculaId) {
    $sql = "SELECT salas.id, salas.numero, salas.aforo, cines.nombre AS nombre_cine 
            FROM salas 
            JOIN cines ON salas.cine = cines.id 
            WHERE salas.pelicula = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $peliculaId);
} else {
    $sql = "SELECT salas.id, salas.numero, salas.aforo, cines.nombre AS nombre_cine 
            FROM salas 
            JOIN cines ON salas.cine = cines.id";
    $stmt = $conn->prepare($sql);
}

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
