<?php
// Iniciar la sesión
session_start();

// Verificar si la sesión está activa y si el usuario está logueado
if (isset($_SESSION['user']) && isset($_SESSION['user']['dni'])) {
    // El usuario está autenticado
    echo json_encode(['success' => true, 'message' => 'Usuario autenticado']);
} else {
    // El usuario no está autenticado
    echo json_encode(['success' => false, 'message' => 'Usuario no autenticado']);
}
?>
