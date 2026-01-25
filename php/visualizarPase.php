<?php
include('config.php');
header('Content-Type: application/json');

$peliculaId = isset($_GET['peliculaId']) ? intval($_GET['peliculaId']) : 0;

if ($peliculaId <= 0) {
    echo json_encode([]);
    exit;
}

// Consulta para obtener los pases de la película, incluyendo detalles de la sala, la película y el cine
$sql = "SELECT p.id as paseId, p.horaInicio, p.horaFin, p.butacasOcupadas, s.numero as numeroSala, s.aforo, 
        pel.titulo, c.nombre as cineNombre
        FROM pases p
        JOIN salas s ON p.numeroSala = s.id
        JOIN peliculas pel ON p.pelicula = pel.id
        JOIN cines c ON s.cine = c.id
        WHERE p.pelicula = ?";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $peliculaId);
$stmt->execute();
$result = $stmt->get_result();

$pases = [];

while ($row = $result->fetch_assoc()) {
    $pases[] = [
        'id' => $row['paseId'],
        'horaInicio' => $row['horaInicio'],
        'horaFin' => $row['horaFin'],
        'butacasOcupadas' => $row['butacasOcupadas'],
        'aforo' => $row['aforo'],
        'numeroSala' => $row['numeroSala'],
        'titulo' => $row['titulo'],
        'cineNombre' => $row['cineNombre']
    ];
}

echo json_encode($pases);

$stmt->close();
$conn->close();
?>

