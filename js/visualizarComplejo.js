// Espera a que el contenido del DOM esté completamente cargado antes de ejecutar el código
document.addEventListener('DOMContentLoaded', function () {

    // Función para cargar la lista de cines desde el servidor
    async function cargarCines() {
        try {
            // Realiza una petición fetch para obtener los datos de cines
            const response = await fetch('../php/cargarCines.php');
            const data = await response.json();

            // Verifica si la respuesta indica éxito
            if (data.success) {
                const cineSelector = document.getElementById('cineSelector');
                // Limpia las opciones existentes y añade la opción por defecto
                cineSelector.innerHTML = '<option value="">Selecciona un cine</option>';

                // Añade cada cine como una opción en el selector
                data.cines.forEach(cine => {
                    const option = document.createElement('option');
                    option.value = cine.id;
                    option.textContent = cine.nombre;
                    cineSelector.appendChild(option);
                });

                // Añade un evento para detectar cambios en la selección del cine
                cineSelector.addEventListener('change', function () {
                    const cineId = cineSelector.value;
                    if (cineId) {
                        // Carga los detalles del complejo del cine seleccionado
                        cargarComplejo(cineId);
                    }
                });
            } else {
                alert('No se pudieron cargar los cines.');
            }
        } catch (error) {
            console.error('Error al cargar los cines:', error);
        }
    }

    // Función para cargar los detalles del complejo del cine seleccionado
    async function cargarComplejo(idCine) {
        try {
            // Realiza una petición fetch para obtener los datos del complejo
            const response = await fetch(`../php/visualizarComplejo.php?id=${idCine}`);
            const data = await response.json();

            // Verifica si la respuesta indica éxito
            if (data.success) {
                const complejo = data.complejo;
                // Muestra la información básica del cine
                document.getElementById('nombreCine').innerText = `Nombre: ${complejo.nombre}`;
                document.getElementById('ubicacionCine').innerText = `Ubicación: ${complejo.ubicacion}`;
                document.getElementById('numeroSalas').innerText = `Número de Salas: ${complejo.numeroSalas}`;

                const salasList = document.getElementById('salasList');
                // Limpia la lista de salas anterior
                salasList.innerHTML = '';

                // Para cada sala, crea una tarjeta con su información
                complejo.salas.forEach(sala => {
                    const salaDiv = document.createElement('div');
                    salaDiv.classList.add('col-md-6', 'mb-4');

                    // Obtiene las películas y pases de la sala
                    const peliculas = sala.peliculasConPases;
                    const hayPeliculas = Object.keys(peliculas).length > 0;

                    // Construye el contenido HTML de la tarjeta de la sala
                    salaDiv.innerHTML = `
                        <div class="card fade-in">
                            <div class="card-body">
                                <h5 class="card-title">Sala ${sala.numero}</h5>
                                <p class="card-text"><strong>Aforo:</strong> ${sala.aforo}</p>
                                ${hayPeliculas ? '' : '<p class="text-muted">No hay películas ni pases en esta sala.</p>'}
                            </div>
                        </div>
                    `;
                    // Añade la tarjeta a la lista
                    salasList.appendChild(salaDiv);

                    // Si hay películas, muestra sus pases
                    if (hayPeliculas) {
                        mostrarPeliculasConPases(salaDiv, peliculas);
                    }
                });
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error al cargar los datos:', error);
            alert('Hubo un error al cargar la información.');
        }
    }

    // Función para mostrar las películas y sus pases dentro de una sala
    function mostrarPeliculasConPases(salaDiv, peliculasConPases) {
        const salaBody = salaDiv.querySelector('.card-body');

        // Recorre cada película
        for (const tituloPelicula in peliculasConPases) {
            const pases = peliculasConPases[tituloPelicula];

            // Añade el título de la película
            const peliculaHeader = document.createElement('p');
            peliculaHeader.innerHTML = `<strong>Película:</strong> ${tituloPelicula}`;
            salaBody.appendChild(peliculaHeader);

            // Crea un contenedor para los pases
            const pasesContainer = document.createElement('div');
            pasesContainer.classList.add('mb-3');

            // Añade un título para la sección de pases
            const tituloPases = document.createElement('h6');
            tituloPases.textContent = "Pases:";
            pasesContainer.appendChild(tituloPases);

            // Para cada pase, crea un párrafo con la hora
            pases.forEach(pase => {
                const paseDiv = document.createElement('p');
                paseDiv.classList.add('mb-1', 'ms-3');
                paseDiv.innerHTML = `<i class="bi bi-clock"></i> ${pase.horaInicio} - ${pase.horaFin}`;
                pasesContainer.appendChild(paseDiv);
            });

            // Añade la sección de pases a la sala
            salaBody.appendChild(pasesContainer);
        }
    }

    // Ejecuta la carga de cines al inicio
    cargarCines();
});

