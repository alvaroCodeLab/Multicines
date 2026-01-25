<?php
include('config.php');
header('Content-Type: application/json');

$idCine = $_GET['id'];

// Obtener información del cine
$sql = "SELECT * FROM cines WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $idCine);
$stmt->execute();
$result = $stmt->get_result();
$complejo = $result->fetch_assoc();

if ($complejo) {
    // Obtener salas del cine
    $sqlSalas = "SELECT * FROM salas WHERE cine = ?";
    $stmtSalas = $conn->prepare($sqlSalas);
    $stmtSalas->bind_param("i", $idCine);
    $stmtSalas->execute();
    $resultSalas = $stmtSalas->get_result();

    $salas = [];

    while ($sala = $resultSalas->fetch_assoc()) {
        // Obtener pases en esta sala con títulos de película
        $sqlPases = "SELECT pases.*, peliculas.titulo FROM pases
                     JOIN peliculas ON pases.pelicula = peliculas.id
                     WHERE pases.numeroSala = ?";
        $stmtPases = $conn->prepare($sqlPases);
        $stmtPases->bind_param("i", $sala['id']); // ahora usamos el ID de la sala
        $stmtPases->execute();
        $resultPases = $stmtPases->get_result();

        $pasesPorPelicula = [];

        while ($pase = $resultPases->fetch_assoc()) {
            $titulo = $pase['titulo'];
            unset($pase['titulo']);

            if (!isset($pasesPorPelicula[$titulo])) {
                $pasesPorPelicula[$titulo] = [];
            }
            $pasesPorPelicula[$titulo][] = [
                'horaInicio' => $pase['horaInicio'],
                'horaFin' => $pase['horaFin'],
                'butacasOcupadas' => $pase['butacasOcupadas']
            ];
        }

        $salas[] = [
            'numero' => $sala['numero'],
            'aforo' => $sala['aforo'],
            'peliculasConPases' => $pasesPorPelicula
        ];
    }

    echo json_encode([
        'success' => true,
        'complejo' => [
            'nombre' => $complejo['nombre'],
            'ubicacion' => $complejo['ubicacion'],
            'numeroSalas' => $complejo['numeroSalas'],
            'salas' => $salas
        ]
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Cine no encontrado']);
}
?>
