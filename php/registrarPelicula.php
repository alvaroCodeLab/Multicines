<?php
include('config.php');
header('Content-Type: application/json');

// Verificar si la solicitud es POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Obtener los datos del formulario
    $titulo = $_POST['titulo'];
    $genero = $_POST['genero'];
    $director = $_POST['director'];
    $actores = $_POST['actores'];
    $fechaEstreno = $_POST['fechaEstreno'];
    $duracion = $_POST['duracion'];

    // Subir la imagen
    if (isset($_FILES['imagen']) && $_FILES['imagen']['error'] === 0) {
        $imagen = $_FILES['imagen'];
        $imagenBin = file_get_contents($imagen['tmp_name']);
    } else {
        $imagenBin = null;
    }

    // Validación de datos
    if ($titulo && $genero && $director && $actores && $fechaEstreno && $duracion) {
        // Verificar si ya existe una película con el mismo título y director
        $sql_check = "SELECT * FROM peliculas WHERE titulo = ? AND director = ?";
        $stmt_check = $conn->prepare($sql_check);
        $stmt_check->bind_param("ss", $titulo, $director);
        $stmt_check->execute();
        $result_check = $stmt_check->get_result();

        if ($result_check->num_rows > 0) {
            $response = ['success' => false, 'message' => 'Ya existe una película con el mismo título y director.'];
            $stmt_check->close();
            echo json_encode($response);
            exit();
        }

        // Insertar la película en la base de datos
        $sql = "INSERT INTO peliculas (titulo, genero, director, actores, fechaEstreno, duracion, imagen) 
                VALUES (?, ?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sssssis", $titulo, $genero, $director, $actores, $fechaEstreno, $duracion, $imagenBin);

        if ($stmt->execute()) {
            $response = ['success' => true, 'message' => 'Película registrada exitosamente.'];
        } else {
            $response = ['success' => false, 'message' => 'Error al registrar la película.'];
        }

        $stmt->close();
    } else {
        $response = ['success' => false, 'message' => 'Por favor, complete todos los campos correctamente.'];
    }

    echo json_encode($response);
}

$conn->close();
?>
