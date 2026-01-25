<?php
require_once 'config.php';

header('Content-Type: application/json');

// Obtener la fecha actual en el servidor
$fechaActual = date('Y-m-d');

//Consulta para solo traer las películas con fecha de estreno anterior o igual a la fecha actual
$sqlPeliculas = "SELECT id, titulo, genero, director, actores, fechaEstreno, duracion, imagen 
                 FROM peliculas 
                 WHERE fechaEstreno <= '$fechaActual'";

$resultPeliculas = $conn->query($sqlPeliculas);

$peliculas = [];

if ($resultPeliculas->num_rows > 0) {
    while ($pelicula = $resultPeliculas->fetch_assoc()) {
        // Convertir imagen a base64
        if ($pelicula['imagen']) {
            $base64Image = base64_encode($pelicula['imagen']);
            $pelicula['imagen'] = 'data:image/jpeg;base64,' . $base64Image;
        } else {
            $pelicula['imagen'] = '';
        }

        // Obtener pases para esta película
        $idPelicula = $pelicula['id'];
        $sqlPases = "SELECT horaInicio FROM pases WHERE pelicula = $idPelicula ORDER BY horaInicio";
        $resultPases = $conn->query($sqlPases);
        $horarios = [];

        if ($resultPases && $resultPases->num_rows > 0) {
            while ($pase = $resultPases->fetch_assoc()) {
                $horarios[] = $pase['horaInicio'];
            }
        }
        $pelicula['horarios'] = $horarios;
        $peliculas[] = $pelicula;
    }
}

echo json_encode($peliculas);
$conn->close();
