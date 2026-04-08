<?php
session_start();
session_destroy();
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Cierre de sesión - MultiCines</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link href="../public/website_icon3.png" rel="icon">

    <!-- CSS -->
    <link rel="stylesheet" href="../estilos/logout.css">

    <!-- GSAP -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
</head>

<body>

<!-- LOADER -->
<div id="loader">Cerrando sesión...</div>

<!-- CURSOR -->
<div class="cursor"></div>

<!-- HERO -->
<section class="hero">
    <div class="hero-bg"></div>

    <div class="hero-content">
        <h1 class="title">Hasta pronto 🍿</h1>
        <p class="subtitle">Tu sesión se ha cerrado correctamente</p>
    </div>
</section>

<!-- MENSAJE -->
<section class="message">
    <h2 class="fade-up">Gracias por visitarnos</h2>
    <p class="fade-up">Esperamos verte pronto de nuevo en MultiCines</p>
</section>

<!-- CTA -->
<section class="cta">
    <h2 class="fade-up">¿Listo para otra película?</h2>
    <a href="../php/index.php" class="btn primary big">Volver al inicio</a>
</section>

<script src="../js/logout.js"></script>
</body>
</html>