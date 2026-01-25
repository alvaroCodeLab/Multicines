<?php
require_once 'config.php';

header('Content-Type: application/json');

if (!isset($_GET['paseId'])) {
    echo json_encode(['success' => false, 'message' => 'ID de pase no especificado.']);
    exit;
}

$paseId = (int) $_GET['paseId'];

// Obtener datos del pase
$sqlPase = "SELECT p.id, s.aforo, p.butacasOcupadas FROM pases p
JOIN salas s ON p.numeroSala = s.id
WHERE p.id = $paseId";

$resultPase = $conn->query($sqlPase);

if ($resultPase->num_rows > 0) {
    $pase = $resultPase->fetch_assoc();
    $entradasDisponibles = $pase['aforo'] - $pase['butacasOcupadas'];
    echo json_encode([
        'success' => true,
        'entradasDisponibles' => $entradasDisponibles
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Pase no encontrado.']);
}

$conn->close();
?>
