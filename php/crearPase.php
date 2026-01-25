<?php
include('config.php');
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

$pelicula = $data['pelicula'];
$sala = $data['sala'];
$horaInicio = $data['horaInicio'];
$horaFin = $data['horaFin'];

$horaMinPermitida = '15:30';
$horaMaxPermitida = '23:45';

// Validación de rango horario
if ($horaInicio < $horaMinPermitida || $horaInicio > $horaMaxPermitida) {
    echo json_encode(['success' => false, 'message' => 'La hora de inicio debe estar entre 15:30 y 23:45.']);
    exit;
}

if ($horaFin < $horaMinPermitida || $horaFin > $horaMaxPermitida) {
    echo json_encode(['success' => false, 'message' => 'La hora de fin debe estar entre 15:30 y 23:45.']);
    exit;
}

// Validar que la hora de inicio sea anterior a la hora de fin
if ($horaInicio >= $horaFin) {
    echo json_encode(['success' => false, 'message' => 'La hora de inicio debe ser anterior a la hora de fin.']);
    exit;
}

// Validar si el pase se solapa
$sql = "SELECT * FROM pases WHERE numeroSala = ? AND ((horaInicio < ? AND horaFin > ?) OR (horaInicio < ? AND horaFin > ?))";
$stmt = $conn->prepare($sql);
$stmt->bind_param("issss", $sala, $horaFin, $horaInicio, $horaInicio, $horaFin);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'El pase se solapa con otro.']);
    exit;
}

// Insertar el pase
$sqlInsert = "INSERT INTO pases (pelicula, numeroSala, horaInicio, horaFin, butacasOcupadas) VALUES (?, ?, ?, ?, 0)";
$stmtInsert = $conn->prepare($sqlInsert);
$stmtInsert->bind_param("iiss", $pelicula, $sala, $horaInicio, $horaFin);

if ($stmtInsert->execute()) {
    echo json_encode(['success' => true, 'message' => 'Pase creado exitosamente.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al crear el pase.']);
}

$stmtInsert->close();
$conn->close();
?>
