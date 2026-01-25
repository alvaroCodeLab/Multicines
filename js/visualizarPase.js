document.addEventListener('DOMContentLoaded', () => {
    const selectPelicula = document.getElementById('peliculaSelect');
    const resultadoDiv = document.getElementById('resultado');
    const cargandoDiv = document.getElementById('cargando');

    // Función para cargar las películas
    async function cargarPeliculas() {
        try {
            const response = await fetch('../php/obtenerPeliculas.php');
            const peliculas = await response.json();

            peliculas.forEach(p => {
                const option = document.createElement('option');
                option.value = p.id;
                option.textContent = p.titulo;
                selectPelicula.appendChild(option);
            });
        } catch (err) {
            resultadoDiv.innerHTML = '<p class="error">Error al cargar películas</p>';
            console.error(err);
        }
    }

    // Función para cargar los pases de la película seleccionada
    async function cargarPases(peliculaId) {
        cargandoDiv.style.display = 'block';  // Mostrar mensaje de carga
        resultadoDiv.innerHTML = ''; // Limpiar resultados anteriores

        if (!peliculaId) {
            resultadoDiv.innerHTML = '<p>Por favor, selecciona una película.</p>';
            cargandoDiv.style.display = 'none';  // Ocultar mensaje de carga
            return;
        }

        try {
            const response = await fetch(`../php/visualizarPase.php?peliculaId=${peliculaId}`);
            const pases = await response.json();

            if (pases.length === 0) {
                resultadoDiv.innerHTML = '<p>No hay pases para esta película.</p>';
            } else {
                // Crear las tarjetas de cada pase
                pases.forEach(pase => {
                    const divPase = document.createElement('div');
                    divPase.className = 'col-md-4'; // Usar clases de Bootstrap para el grid

                    divPase.innerHTML = `
                        <div class="card pase">
                            <div class="card-body">
                                <h3 class="card-title">${pase.titulo}</h3>
                                <p><strong>Cine:</strong> ${pase.cineNombre}</p>
                                <p><strong>Sala:</strong> ${pase.numeroSala}</p>
                                <p><strong>Hora Inicio:</strong> ${pase.horaInicio}</p>
                                <p><strong>Hora Fin:</strong> ${pase.horaFin}</p>
                                <p><strong>Asientos ocupados:</strong> ${pase.butacasOcupadas} / ${pase.aforo}</p>
                            </div>
                        </div>
                    `;

                    resultadoDiv.appendChild(divPase);
                });
            }
            cargandoDiv.style.display = 'none';  // Ocultar mensaje de carga
        } catch (err) {
            resultadoDiv.innerHTML = '<p class="error">Error al cargar los pases.</p>';
            console.error(err);
            cargandoDiv.style.display = 'none';  // Ocultar mensaje de carga
        }
    }

    // Evento cuando cambia la película
    selectPelicula.addEventListener('change', () => {
        const idPelicula = selectPelicula.value;
        cargarPases(idPelicula);
    });

    // Cargar películas al cargar la página
    cargarPeliculas();
});

