<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/Exception.php';
require 'PHPMailer/PHPMailer.php';
require 'PHPMailer/SMTP.php';

include('config.php');

header('Content-Type: application/json');

session_start();

// Verificar autenticación
if (!isset($_SESSION['user']) || !isset($_SESSION['user']['dni'])) {
    echo json_encode(['success' => false, 'message' => 'Usuario no autenticado']);
    exit;
}

$dni = $_SESSION['user']['dni'];

// Leer JSON
$data = json_decode(file_get_contents('php://input'), true);

$paseId = (int) ($data['paseId'] ?? 0);
$numEntradas = (int) ($data['numEntradas'] ?? 0);

if (!$paseId || !$numEntradas) {
    echo json_encode(['success' => false, 'message' => 'Datos inválidos']);
    exit;
}

// Obtener pase (MEJOR con prepared)
$sqlPase = "
    SELECT p.*, s.aforo, c.nombre AS nombreCine, c.ubicacion
    FROM pases p
    JOIN salas s ON p.numeroSala = s.id
    JOIN cines c ON s.cine = c.id
    WHERE p.id = ?
";

$stmt = $conn->prepare($sqlPase);
$stmt->bind_param('i', $paseId);
$stmt->execute();
$resultPase = $stmt->get_result();
$pase = $resultPase->fetch_assoc();

if (!$pase) {
    echo json_encode(['success' => false, 'message' => 'Pase no encontrado']);
    exit;
}

// Calcular disponibilidad
$entradasDisponibles = $pase['aforo'] - $pase['butacasOcupadas'];

if ($numEntradas > $entradasDisponibles) {
    echo json_encode(['success' => false, 'message' => 'No hay suficientes entradas disponibles']);
    exit;
}

// Actualizar butacas
$sqlUpdate = "UPDATE pases SET butacasOcupadas = butacasOcupadas + ? WHERE id = ?";
$stmt = $conn->prepare($sqlUpdate);
$stmt->bind_param('ii', $numEntradas, $paseId);

if (!$stmt->execute()) {
    echo json_encode(['success' => false, 'message' => 'Error al actualizar el pase']);
    exit;
}

// Insertar compra
$precio = 10.00;

$sqlCompra = "INSERT INTO entradas (precio, numEntradas, dni, pase) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sqlCompra);
$stmt->bind_param('disi', $precio, $numEntradas, $dni, $paseId);

if (!$stmt->execute()) {
    echo json_encode(['success' => false, 'message' => 'Error al registrar la compra']);
    exit;
}

// Obtener cliente
$sqlCliente = "SELECT nombre, email FROM clientes WHERE dni = ?";
$stmt = $conn->prepare($sqlCliente);
$stmt->bind_param('s', $dni);
$stmt->execute();
$resultCliente = $stmt->get_result();
$cliente = $resultCliente->fetch_assoc();

if (!$cliente) {
    echo json_encode(['success' => false, 'message' => 'Cliente no encontrado']);
    exit;
}

$email = $cliente['email'];
$nombreCliente = $cliente['nombre'];

// =======================
// ✉️ EMAIL
// =======================
$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host = $SMTP_HOST;
    $mail->SMTPAuth = true;
    $mail->Username = $SMTP_USER;
    $mail->Password = $SMTP_PASS;
    $mail->Port = $SMTP_PORT;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;

    $mail->setFrom($SMTP_USER, 'Multicines');
    $mail->addAddress($email, $nombreCliente);

    $mail->addEmbeddedImage('../img/logoMulticines.png', 'banner');

    $safeNombre = htmlspecialchars($nombreCliente, ENT_QUOTES, 'UTF-8');

    $mail->isHTML(true);
    $mail->Subject = 'Compra de entradas confirmada';
    $mail->Body = "
        <div style='font-family: Arial, sans-serif; padding: 20px;'>
            
            <img src='cid:banner' style='width: 150px; margin-bottom: 20px; border-radius: 8px;'>
            
            <h2 style='color: #2e7d32;'>¡Gracias por tu compra, $safeNombre!</h2>

            <p>Has adquirido <strong>$numEntradas</strong> entradas.</p>
            <p><strong>Cine:</strong> {$pase['nombreCine']}</p>
            <p><strong>Dirección:</strong> {$pase['ubicacion']}</p>
            <p><strong>Hora:</strong> {$pase['horaInicio']}</p>

            <p style='margin-top: 30px;'>¡Disfruta de la película! 🎬</p>

            <hr style='margin-top: 40px;'>
            <p style='font-size: 0.9em; color: #888;'>Correo automático.</p>

        </div>
    ";

    $mail->send();

} catch (Exception $e) {
    // No romper la compra si falla el correo
    error_log("MAIL ERROR: " . $mail->ErrorInfo);
}

// Respuesta final
echo json_encode([
    'success' => true,
    'message' => 'Compra realizada correctamente'
]);

$conn->close();