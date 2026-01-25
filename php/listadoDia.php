<?php
include('config.php');
header('Content-Type: application/json');

// Recibir datos JSON
$data = json_decode(file_get_contents('php://input'), true);
$fecha = $data['fecha'];

// Validar fecha
if (!$fecha) {
    echo json_encode(['success' => false, 'message' => 'Fecha no válida']);
    exit;
}

// Consulta SQL para obtener el listado de entradas
$sql = "
    SELECT 
        e.fecha AS fecha,
        s.numero AS sala,
        p.titulo AS pelicula,
        pa.horaInicio AS hora_inicio,
        pa.horaFin AS hora_fin,
        COALESCE(SUM(e.numEntradas), 0) AS entradas_vendidas,
        COALESCE(SUM(e.precio * e.numEntradas), 0) AS total_recaudado
    FROM entradas e
    INNER JOIN pases pa ON e.pase = pa.id
    INNER JOIN peliculas p ON pa.pelicula = p.id
    INNER JOIN salas s ON pa.numeroSala = s.id
    WHERE DATE(e.fecha) = ?
    GROUP BY e.fecha, s.numero, p.titulo, pa.horaInicio, pa.horaFin
    ORDER BY s.numero, pa.horaInicio;
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $fecha);
$stmt->execute();
$result = $stmt->get_result();

$entradas = [];
$total_entradas = 0;
$total_recaudado = 0;

while ($row = $result->fetch_assoc()) {
    $entradas[] = [
        'fecha' => $row['fecha'],
        'sala' => $row['sala'],
        'pelicula' => $row['pelicula'],
        'hora_inicio' => $row['hora_inicio'],
        'hora_fin' => $row['hora_fin'],
        'entradas_vendidas' => $row['entradas_vendidas']
    ];
    $total_entradas += $row['entradas_vendidas'];
    $total_recaudado += $row['total_recaudado'];
}

if (count($entradas) > 0) {
    echo json_encode([
        'success' => true,
        'fecha' => $fecha,
        'entradas' => $entradas,
        'total_entradas' => $total_entradas,
        'total_recaudado' => $total_recaudado
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'No se encontraron entradas para esta fecha']);
}

$stmt->close();
$conn->close();
?>
