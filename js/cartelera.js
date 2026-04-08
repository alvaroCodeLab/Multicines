document.addEventListener('DOMContentLoaded', () => {

    // =========================
    // MENÚ HAMBURGUESA
    // =========================
    const toggle = document.getElementById('menuToggle');
    const nav = document.getElementById('navWrapper');

    toggle.addEventListener('click', () => {
        nav.classList.toggle('active');

        if (nav.classList.contains('active')) {
            gsap.from("#navWrapper > *", {
                opacity: 0,
                y: -20,
                stagger: 0.1
            });
        }
    });

    // =========================
    // LOADER
    // =========================
    const loader = document.getElementById('loader');
    loader.classList.remove('loader-hidden');

    // =========================
    // VARIABLES GLOBALES
    // =========================
    let peliculasGlobal = [];

    // =========================
    // FETCH PELÍCULAS
    // =========================
    fetch('../php/cartelera.php')
        .then(response => response.json())
        .then(data => {

            peliculasGlobal = data; // 🔥 guardamos todas

            pintarPeliculas(data); // 🔥 pintamos

        })
        .catch(error => console.error('Error cargando las películas:', error))
        .finally(() => {
            loader.classList.add('loader-hidden');
        });

    // =========================
    // FUNCIÓN PINTAR PELÍCULAS
    // =========================
    function pintarPeliculas(data) {

        const contenedor = document.getElementById('cartelera');
        contenedor.innerHTML = '';

        if (data.length === 0) {
            contenedor.innerHTML = `
                <div class="text-center mt-5">
                    <h4>No se encontraron resultados 😢</h4>
                </div>
            `;
            return;
        }

        data.forEach(pelicula => {

            const col = document.createElement('div');
            col.className = 'col';

            const card = document.createElement('div');
            card.className = 'card h-100 cursor-pointer';

            card.addEventListener('click', () => {
                window.location.href = `../html/pelicula.html?id=${pelicula.id}`;
            });

            const img = document.createElement('img');
            img.src = pelicula.imagen;
            img.className = 'card-img-top';
            img.alt = pelicula.titulo;

            const cardBody = document.createElement('div');
            cardBody.className = 'card-body';

            const titulo = document.createElement('h5');
            titulo.className = 'card-title';

            const director = pelicula.director || 'Desconocido';
            const genero = pelicula.genero || 'Desconocido';
            const año = pelicula.fechaEstreno
                ? new Date(pelicula.fechaEstreno).getFullYear()
                : 'Desconocido';
            const duracion = pelicula.duracion
                ? `${pelicula.duracion} min`
                : 'Desconocido';

            titulo.innerHTML = `
                ${pelicula.titulo}
                <br>
                <small class="text-muted">
                    ${director} | ${duracion} | ${genero} | ${año}
                </small>
            `;

            // Horarios
            const horariosDiv = document.createElement('div');
            horariosDiv.className = 'd-flex flex-wrap gap-2';

            if (pelicula.horarios.length > 0) {
                pelicula.horarios.forEach(hora => {
                    const btn = document.createElement('button');
                    btn.className = 'btn btn-horario btn-sm';
                    btn.textContent = hora.slice(0, 5);
                    horariosDiv.appendChild(btn);
                });
            } else {
                const sinPases = document.createElement('p');
                sinPases.className = 'text-muted fst-italic mb-0';
                sinPases.textContent = 'No hay pases disponibles.';
                horariosDiv.appendChild(sinPases);
            }

            const horariosLabel = document.createElement('h6');
            horariosLabel.className = 'mt-3';
            horariosLabel.textContent = 'Horarios:';

            cardBody.appendChild(titulo);
            cardBody.appendChild(horariosLabel);
            cardBody.appendChild(horariosDiv);

            card.appendChild(img);
            card.appendChild(cardBody);
            col.appendChild(card);

            document.getElementById('cartelera').appendChild(col);
        });
    }

    // =========================
    // BUSCADOR
    // =========================

    const formBuscador = document.getElementById('buscador_form_cine');
    const inputBuscador = document.getElementById('buscador_input');

    // Buscar al enviar
    formBuscador.addEventListener('submit', (e) => {
        e.preventDefault();

        const texto = inputBuscador.value.toLowerCase();

        const filtradas = peliculasGlobal.filter(pelicula =>
            pelicula.titulo.toLowerCase().includes(texto) ||
            pelicula.genero.toLowerCase().includes(texto) ||
            pelicula.director.toLowerCase().includes(texto)
        );

        pintarPeliculas(filtradas);
    });

    // Buscar en tiempo real
    inputBuscador.addEventListener('input', (e) => {

        const texto = e.target.value.toLowerCase();

        const filtradas = peliculasGlobal.filter(pelicula =>
            pelicula.titulo.toLowerCase().includes(texto) ||
            pelicula.genero.toLowerCase().includes(texto) ||
            pelicula.director.toLowerCase().includes(texto)
        );

        pintarPeliculas(filtradas);
    });

    // =========================
    // CERRAR SESIÓN
    // =========================
    document.getElementById('cerrarSesion').addEventListener('click', async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('../php/cerrarSesion.php', {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                window.location.href = '../php/logout.php';
            } else {
                alert('Error al cerrar sesión');
            }

        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            alert('Error de red');
        }
    });

});