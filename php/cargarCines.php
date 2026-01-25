<?php
include('config.php');
header('Content-Type: application/json');

// Obtener todos los cines
$sql = "SELECT * FROM cines";
$result = $conn->query($sql);

$cines = [];
while ($cine = $result->fetch_assoc()) {
    $cines[] = $cine;
}

echo json_encode([
    'success' => true,
    'cines' => $cines
]);

$conn->close();
?>
