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
$dni = $data['dni'];
$nombre = $data['nombre'];
$email = $data['email'];
$telefono = $data['telefono'];
$password = $data['password'];

// Verificar si el DNI ya está registrado
$sql = "SELECT * FROM usuarios WHERE dni = ?";
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

// Insertar usuario en la base de datos
$sql = "INSERT INTO usuarios (dni, password, tipo) VALUES (?, ?, 'cliente')";
$stmt = $conn->prepare($sql);
$stmt->bind_param('ss', $dni, $passwordHash);
$stmt->execute();

// Insertar datos del cliente
$sql = "INSERT INTO clientes (dni, nombre, email, telefono) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param('ssss', $dni, $nombre, $email, $telefono);
$stmt->execute();

// Enviar correo de confirmación
$mail = new PHPMailer(true);
try {
    // Configuración del servidor SMTP
    $mail->isSMTP();
    $mail->Host = getenv('SMTP_HOST');
    $mail->SMTPAuth = true;
    $mail->Username = getenv('SMTP_USER');
    $mail->Password = getenv('SMTP_PASS');
    $mail->Port = getenv('SMTP_PORT');
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;

    // Remitente y destinatario
    $mail->setFrom(getenv('SMTP_USER'), 'Multicines');
    $mail->addAddress($email, $nombre);

    // Adjuntar imagen embebida (ajusta la ruta según corresponda)
    $mail->addEmbeddedImage('../img/logoMulticines.png', 'banner');

    // Contenido del correo con estilo
    $mail->isHTML(true);
    $mail->Subject = 'Confirmación de Registro en Multicines';
    $mail->Body = "
        <div style='font-family: Arial, sans-serif; padding: 20px;'>
            <img src='cid:banner' alt='Logo Multicines' style='width: 150px; margin-bottom: 20px; border-radius: 8px;'>

            <h2 style='color: #2e7d32;'>¡Bienvenido, $nombre!</h2>
            <p>Gracias por registrarte en <strong>Multicines</strong>. Tu registro ha sido exitoso.</p>
            
            <p>Ahora formas parte de nuestra comunidad de amantes del cine. Podrás comprar entradas, recibir promociones exclusivas y estar al día con nuestras novedades.</p>
            
            <p style='margin-top: 30px;'>¡Esperamos que disfrutes de la experiencia Multicines! 🎬</p>
            
            <hr style='margin-top: 40px; border-color: #ddd;'>
            <p style='font-size: 0.9em; color: #888;'>Este correo ha sido enviado automáticamente. Por favor, no respondas a esta dirección.</p>
        </div>
    ";

    $mail->send();
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'No se pudo enviar el correo de confirmación. Error: ' . $mail->ErrorInfo
    ]);
}
