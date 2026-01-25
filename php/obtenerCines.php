<?php
include('config.php');
header('Content-Type: application/json');

$sql = "SELECT id, nombre FROM cines";
$result = $conn->query($sql);
$cines = [];

// Recorre cada fila del resultado de la consulta como un array asociativo
while ($row = $result->fetch_assoc()) {
    // Agrega cada fila (representando un cine) al array $cines
    $cines[] = $row;
}

// Convierte el array $cines a formato JSON y lo imprime como respuesta
echo json_encode($cines);

$conn->close();
?>
