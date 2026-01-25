<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/Exception.php';
require 'PHPMailer/PHPMailer.php';
require 'PHPMailer/SMTP.php';
include('config.php');

header('Content-Type: application/json');

// Iniciar sesión y verificar si el usuario está logueado
session_start();

// Verificación adicional: Comprobar si el usuario está autenticado
if (!isset($_SESSION['user']) || !isset($_SESSION['user']['dni'])) {
    echo json_encode(['success' => false, 'message' => 'Usuario no autenticado']);
    exit;
}

$dni = $_SESSION['user']['dni']; // Obtener el dni de la sesión

// Obtener los datos del cuerpo de la solicitud
$data = json_decode(file_get_contents('php://input'), true);

$paseId = (int) $data['paseId'];
$numEntradas = (int) $data['numEntradas'];

// Obtener la información del pase
$sqlPase = "
    SELECT p.*, s.aforo, c.nombre AS nombreCine, c.ubicacion
    FROM pases p
    JOIN salas s ON p.numeroSala = s.id
    JOIN cines c ON s.cine = c.id
    WHERE p.id = $paseId";
$resultPase = $conn->query($sqlPase);
$pase = $resultPase->fetch_assoc();

if (!$pase) {
    echo json_encode(['success' => false, 'message' => 'Pase no encontrado']);
    exit;
}

// Validar si existe el campo 'aforo' y 'nombreCine'
if (isset($pase['aforo'], $pase['nombreCine'])) {
    $entradasDisponibles = $pase['aforo'] - $pase['butacasOcupadas'];
} else {
    echo json_encode(['success' => false, 'message' => 'No se encontró información de aforo o cine']);
    exit;
}

// Comprobar si hay suficientes entradas
if ($numEntradas > $entradasDisponibles) {
    echo json_encode(['success' => false, 'message' => 'No hay suficientes entradas disponibles']);
    exit;
}

// Actualizar el número de entradas ocupadas en la base de datos
$sqlUpdate = "UPDATE pases SET butacasOcupadas = butacasOcupadas + $numEntradas WHERE id = $paseId";
if ($conn->query($sqlUpdate) === TRUE) {
    // Registrar la compra de entradas en la base de datos
    $precio = 10.00; // Definir un precio fijo, o recuperarlo de la base de datos
    $sqlCompra = "INSERT INTO entradas (precio, numEntradas, dni, pase) VALUES ($precio, $numEntradas, '$dni', $paseId)";
    if ($conn->query($sqlCompra) === TRUE) {
        // Enviar correo de confirmación al cliente
        $sqlCliente = "SELECT nombre, email FROM clientes WHERE dni = '$dni'";
        $resultCliente = $conn->query($sqlCliente);
        $cliente = $resultCliente->fetch_assoc();

        if ($cliente) {
            $email = $cliente['email'];
            $nombreCliente = $cliente['nombre'];
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
                $mail->addAddress($email, $nombreCliente);
                $mail->addEmbeddedImage('../img/logoMulticines.png', 'banner');

                // Contenido del correo
                $mail->isHTML(true);
                $mail->Subject = 'Compra de entradas confirmada';
                $mail->Body = "
                    <div style='font-family: Arial, sans-serif; padding: 20px;'>
                        <img src='cid:banner' alt='Cine Banner' style='width: 20%; max-width: 600px; margin-bottom: 20px; border-radius: 10px;'>
                        
                        <h2 style='color: #2e7d32;'>¡Gracias por tu compra!</h2>
                        <p>Has adquirido <strong>$numEntradas</strong> entradas para el cine <strong>{$pase['nombreCine']}</strong>.</p>
                        <p><strong>Dirección:</strong> {$pase['ubicacion']}</p>
                        <p><strong>Hora del pase:</strong> {$pase['horaInicio']}</p>

                        <p style='margin-top: 30px;'>¡Esperamos que disfrutes de la película! 🎬</p>
                        
                        <hr style='margin-top: 40px;'>
                        <p style='font-size: 0.9em; color: #888;'>Este correo ha sido enviado automáticamente. Por favor, no respondas a esta dirección.</p>
                    </div>";
                $mail->send();
                echo json_encode(['success' => true, 'message' => 'Compra procesada y correo enviado']);
            } catch (Exception $e) {
                echo json_encode(['success' => false, 'message' => 'Error al enviar el correo: ' . $mail->ErrorInfo]);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Cliente no encontrado']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Error al registrar la compra']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Error al actualizar el pase']);
}

$conn->close();
?>

