<?php
include('config.php');
header('Content-Type: application/json');

// Recibir datos JSON
$data = json_decode(file_get_contents('php://input'), true);

$nombre = $data['nombre'];
$ubicacion = $data['ubicacion'];
$numeroSalas = (int)$data['numeroSalas'];

// Validación básica
if ($nombre && $ubicacion && $numeroSalas > 0) {
    // Verificar si ya existe un cine con el mismo nombre y ubicación
    $sqlCheck = "SELECT * FROM cines WHERE nombre = ? AND ubicacion = ?";
    $stmtCheck = $conn->prepare($sqlCheck);
    $stmtCheck->bind_param("ss", $nombre, $ubicacion);
    $stmtCheck->execute();
    $resultCheck = $stmtCheck->get_result();

    if ($resultCheck->num_rows > 0) {
        $response = ['success' => false, 'message' => 'Ya existe un cine registrado con este nombre y ubicación.'];
        $stmtCheck->close();
    } else {
        // Insertar nuevo cine
        $sqlInsert = "INSERT INTO cines (nombre, ubicacion, numeroSalas) VALUES (?, ?, ?)";
        $stmtInsert = $conn->prepare($sqlInsert);
        $stmtInsert->bind_param("ssi", $nombre, $ubicacion, $numeroSalas);
        if ($stmtInsert->execute()) {
            // Obtener ID del nuevo cine
            $idCine = $conn->insert_id;

            // Crear las salas
            for ($i = 1; $i <= $numeroSalas; $i++) {
                $sqlSala = "INSERT INTO salas (aforo, cine, numero) VALUES (?, ?, ?)";
                $stmtSala = $conn->prepare($sqlSala);
                // Definir el aforo por sala
                $aforoSala = rand(50, 300);
                $stmtSala->bind_param("ssi", $aforoSala, $idCine, $i);
                $stmtSala->execute();
                $stmtSala->close();
            }

            $response = ['success' => true, 'message' => 'Complejo y salas creadas exitosamente.'];
        } else {
            $response = ['success' => false, 'message' => 'Error al crear el complejo.'];
        }
        $stmtInsert->close();
    }
} else {
    $response = ['success' => false, 'message' => 'Por favor, complete todos los campos correctamente.'];
}

echo json_encode($response);
$conn->close();
?>
