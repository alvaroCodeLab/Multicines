<?php
include('config.php');
header('Content-Type: application/json');

// Si se recibe un parámetro de película, se muestran los detalles de esa película
if (isset($_GET['id'])) {
    $idPelicula = $_GET['id'];

    // Consulta para obtener los detalles de la película
    $sql = "SELECT * FROM peliculas WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $idPelicula);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $pelicula = $result->fetch_assoc();

        // Convertir la imagen BLOB a base64
        $pelicula['imagen'] = base64_encode($pelicula['imagen']);

        echo json_encode(['success' => true, 'data' => $pelicula]);
    } else {
        echo json_encode(['success' => false, 'message' => 'No se encontró la película.']);
    }
} else {
    // Si no se recibe un ID, se muestran todas las películas
    $sql = "SELECT id, titulo FROM peliculas";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $peliculas = [];
        while ($row = $result->fetch_assoc()) {
            $peliculas[] = $row;
        }
        echo json_encode(['success' => true, 'data' => $peliculas]);
    } else {
        echo json_encode(['success' => false, 'message' => 'No se encontraron películas.']);
    }
}

$conn->close();
?>

