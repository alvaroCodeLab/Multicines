<?php
include('config.php');
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$fechaInicio = $data['fechaInicio'];
$fechaFin = $data['fechaFin'];

if ($fechaInicio && $fechaFin) {
    $sql = "
        SELECT 
            e.fecha, 
            s.numero AS numeroSala, 
            p.titulo AS pelicula, 
            pa.horaInicio AS horaPase, 
            SUM(e.numEntradas) AS entradasVendidas,
            SUM(e.numEntradas * e.precio) AS totalRecaudado
        FROM entradas e
        JOIN pases pa ON e.pase = pa.id
        JOIN salas s ON pa.numeroSala = s.id
        JOIN peliculas p ON pa.pelicula = p.id
        WHERE e.fecha BETWEEN ? AND ?
        GROUP BY e.fecha, s.numero, p.titulo, pa.horaInicio
        ORDER BY e.fecha, s.numero, pa.horaInicio;
    ";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $fechaInicio, $fechaFin);
    $stmt->execute();
    $result = $stmt->get_result();

    $entradas = [];
    $totalEntradas = 0;
    $totalRecaudado = 0.0;

    while ($row = $result->fetch_assoc()) {
        $entradas[] = [
            'fecha' => $row['fecha'],
            'numeroSala' => $row['numeroSala'],
            'pelicula' => $row['pelicula'],
            'horaPase' => $row['horaPase'],
            'entradasVendidas' => $row['entradasVendidas']
        ];
        $totalEntradas += $row['entradasVendidas'];
        $totalRecaudado += $row['totalRecaudado'];
    }

    if (count($entradas) > 0) {
        $response = [
            'success' => true,
            'entradas' => $entradas,
            'totalEntradas' => $totalEntradas,
            'totalRecaudado' => number_format($totalRecaudado, 2)
        ];
    } else {
        $response = ['success' => false, 'message' => 'No se encontraron entradas en el rango de fechas especificado.'];
    }

    $stmt->close();
} else {
    $response = ['success' => false, 'message' => 'Por favor, ingrese ambas fechas.'];
}

echo json_encode($response);
$conn->close();
?>

