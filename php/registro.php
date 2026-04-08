<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/Exception.php';
require 'PHPMailer/PHPMailer.php';
require 'PHPMailer/SMTP.php';

include('config.php');

header('Content-Type: application/json');

// Recibir datos en formato JSON
$data = json_decode(file_get_contents('php://input'), true);

$dni = $data['dni'] ?? '';
$nombre = $data['nombre'] ?? '';
$email = $data['email'] ?? '';
$telefono = $data['telefono'] ?? '';
$password = $data['password'] ?? '';

// Validación básica
if (!$dni || !$nombre || !$email || !$password) {
    echo json_encode([
        'success' => false,
        'message' => 'Faltan datos obligatorios'
    ]);
    exit;
}

// Verificar si el DNI ya está registrado
$sql = "SELECT 1 FROM usuarios WHERE dni = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param('s', $dni);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    echo json_encode([
        'success' => false,
        'message' => 'El DNI ya está registrado.'
    ]);
    exit;
}

// Encriptar la contraseña
$passwordHash = password_hash($password, PASSWORD_DEFAULT);

// Insertar usuario
$sql = "INSERT INTO usuarios (dni, password, tipo) VALUES (?, ?, 'cliente')";
$stmt = $conn->prepare($sql);
$stmt->bind_param('ss', $dni, $passwordHash);

if (!$stmt->execute()) {
    echo json_encode([
        'success' => false,
        'message' => 'Error al registrar usuario'
    ]);
    exit;
}

// Insertar cliente
$sql = "INSERT INTO clientes (dni, nombre, email, telefono) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param('ssss', $dni, $nombre, $email, $telefono);
$stmt->execute();

// =======================
// ✉️ ENVÍO DE CORREO
// =======================
$mail = new PHPMailer(true);

try {
    // Configuración SMTP DESDE config.php
    $mail->isSMTP();
    $mail->Host = $SMTP_HOST;
    $mail->SMTPAuth = true;
    $mail->Username = $SMTP_USER;
    $mail->Password = $SMTP_PASS;
    $mail->Port = $SMTP_PORT;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;

    // Remitente y destinatario
    $mail->setFrom($SMTP_USER, 'Multicines');
    $mail->addAddress($email, $nombre);

    // Imagen embebida
    $mail->addEmbeddedImage('../img/logoMulticines.png', 'banner');

    // Evitar XSS en el nombre
    $safeNombre = htmlspecialchars($nombre, ENT_QUOTES, 'UTF-8');

    // Contenido
    $mail->isHTML(true);
    $mail->Subject = 'Confirmación de Registro en Multicines';
    $mail->Body = "
        <div style='font-family: Arial, sans-serif; padding: 20px;'>

            <img src='cid:banner' style='width: 150px; margin-bottom: 20px; border-radius: 8px;'>

            <h2 style='color: #2e7d32;'>¡Bienvenido, $safeNombre!</h2>

            <p>Gracias por registrarte en <strong>Multicines</strong>. Tu registro ha sido exitoso.</p>
            
            <p>Ahora podrás comprar entradas, recibir promociones y estar al día con nuestras novedades.</p>
            
            <p style='margin-top: 30px;'>¡Disfruta de la experiencia Multicines! 🎬</p>
            
            <hr style='margin-top: 40px;'>
            <p style='font-size: 0.9em; color: #888;'>Este correo es automático. No respondas.</p>

        </div>
    ";

    $mail->send();

} catch (Exception $e) {
    // No bloquea el registro si falla el email
    error_log("MAIL ERROR: " . $mail->ErrorInfo);
}

// Respuesta final
echo json_encode(['success' => true]);