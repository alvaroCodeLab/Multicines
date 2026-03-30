<?php include "config.php"; ?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>CineMax</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link href="../public/website_icon3.png" rel="website icon" type="png">
    <link rel="stylesheet" href="../estilos/styles.css">

    <!-- GSAP -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <!-- ScrollTrigger -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
</head>

<body>

<!-- LOADER -->
<div id="loader">CineMax</div>

<!-- CURSOR -->
<div class="cursor"></div>

<!-- HERO -->
<section class="hero">
    <div class="hero-bg"></div>

    <!-- NAV -->
    <nav class="nav">
        <h2 class="logo">CineMax</h2>
        <div class="nav-buttons">
            <a href="../html/login.html" class="btn secondary">Iniciar sesión</a>
            <a href="../html/registro.html" class="btn primary">Registrarse</a>
        </div>
    </nav>

    <div class="hero-content">
        <h1 class="title">Siente cada escena</h1>
        <p class="subtitle">La experiencia cinematográfica definitiva</p>

        <div class="buttons">
            <a href="../html/login.html" class="btn primary">Entrar</a>
            <a href="../html/registro.html" class="btn secondary">Registrarse</a>
        </div>
    </div>
</section>

<!-- 🎬 PELÍCULAS -->
<section class="movies">
    <h2 class="section-title">🎬 En cartelera</h2>

    <div class="carousel-wrapper">
        <div class="carousel" id="carousel">
            <?php
            $sql = "SELECT * FROM peliculas ORDER BY fechaEstreno DESC";
            $result = $conn->query($sql);

            while($row = $result->fetch_assoc()):
            ?>
                <div class="movie">
                    <img src="data:image/jpeg;base64,<?php echo base64_encode($row['imagen']); ?>" />

                    <div class="info">
                        <h3><?php echo $row['titulo']; ?></h3>
                        <p><?php echo $row['genero']; ?></p>
                        <span><?php echo $row['duracion']; ?> min</span>
                    </div>
                </div>
            <?php endwhile; ?>
        </div>
    </div>
</section>

<!-- EXPERIENCIA -->
<section class="cinema">
    <div class="lights"></div>
    <h2 class="fade-up">Apaga las luces... empieza la magia</h2>
</section>

<!-- CTA -->
<section class="cta">
    <h2 class="fade-up">Tu próxima historia comienza aquí</h2>
    <a href="../html/registro.html" class="btn primary big">Crear cuenta</a>
</section>

<script src="../js/main.js"></script>
</body>
</html>