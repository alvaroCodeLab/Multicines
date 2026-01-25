<?php
require_once 'config.php';

header('Content-Type: application/json');

if (!isset($_GET['id'])) {
    echo json_encode(['error' => 'ID de película no especificado.']);
    exit;
}

$peliculaId = (int) $_GET['id'];

// Obtener los detalles de la película
$sqlPelicula = "SELECT id, titulo, genero, director, fechaEstreno, duracion, imagen, actores FROM peliculas WHERE id = $peliculaId";
$resultPelicula = $conn->query($sqlPelicula);

if ($resultPelicula->num_rows > 0) {
    $pelicula = $resultPelicula->fetch_assoc();

    // Convertir imagen a base64
    if ($pelicula['imagen']) {
        $base64Image = base64_encode($pelicula['imagen']);
        $pelicula['imagen'] = 'data:image/jpeg;base64,' . $base64Image;
    }

    // Obtener pases de la película con sala y entradas disponibles
    $sqlPases = "
    SELECT 
        p.horaInicio, 
        p.id AS paseId, 
        p.butacasOcupadas, 
        s.aforo, 
        s.numero AS numeroSala, 
        c.nombre AS nombreCine
    FROM pases p
    JOIN salas s ON p.numeroSala = s.id
    JOIN cines c ON s.cine = c.id
    WHERE p.pelicula = $peliculaId";

    $resultPases = $conn->query($sqlPases);

    $pases = [];
    while ($pase = $resultPases->fetch_assoc()) {
        $entradasDisponibles = $pase['aforo'] - $pase['butacasOcupadas'];
        $pases[] = [
            'horaInicio' => $pase['horaInicio'],
            'numeroSala' => $pase['numeroSala'],
            'nombreCine' => $pase['nombreCine'], 
            'entradasDisponibles' => $entradasDisponibles,
            'fecha' => date('d-m-Y'), // Fecha actual
            'paseId' => $pase['paseId']
        ];
    }

    $pelicula['pases'] = $pases;

    // Formatear fecha de estreno
    $pelicula['fechaEstreno'] = (new DateTime($pelicula['fechaEstreno']))->format('Y-m-d');

    // Obtener actores (convertir la cadena de actores a un array y luego concatenar en una lista separada por comas)
    $actoresArray = explode(",", $pelicula['actores']);
    $pelicula['actores'] = implode(", ", $actoresArray);

    echo json_encode($pelicula);
} else {
    echo json_encode(['error' => 'Película no encontrada.']);
}

$conn->close();
?>

