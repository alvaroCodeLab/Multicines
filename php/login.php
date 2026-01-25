<?php
include('config.php');
session_start(); // Inicia la sesión

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$dni = $data['dni'];
$password = $data['password'];

// Buscar usuario por DNI
$sql = "SELECT * FROM usuarios WHERE dni = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('s', $dni);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

// Verificar si el usuario existe y si la contraseña proporcionada coincide con la almacenada en la base de datos (utilizando hashing)
if ($user && password_verify($password, $user['password'])) {
    // Guardar los datos del usuario en la sesión
    $_SESSION['user'] = [
        'dni' => $user['dni'],
        'tipo' => $user['tipo']
    ];

    // Devuelve además el tipo de usuario
    echo json_encode([
        'success' => true,
        'tipo' => $user['tipo']
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'DNI o contraseña incorrectos.'
    ]);
}
?>

