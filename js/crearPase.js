document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('formCrearPase');
    const peliculaSelect = document.getElementById('pelicula');
    const salaSelect = document.getElementById('sala');
    const horaInicioInput = document.getElementById('horaInicio');
    const horaFinInput = document.getElementById('horaFin');
    const loadingSpinner = document.getElementById('loadingSpinner');

    // Función para cargar las películas desde la base de datos
    async function cargarPeliculas() {
        try {
            loadingSpinner.classList.remove('d-none');  // Mostrar spinner
            const response = await fetch('../php/obtenerPeliculas.php');
            const peliculas = await response.json();

            peliculas.forEach(pelicula => {
                const option = document.createElement('option');
                option.value = pelicula.id;
                option.textContent = pelicula.titulo;
                peliculaSelect.appendChild(option);
            });

            loadingSpinner.classList.add('d-none');  // Ocultar spinner
        } catch (error) {
            console.error('Error al cargar las películas', error);
            loadingSpinner.classList.add('d-none');  // Ocultar spinner en caso de error
        }
    }

    // Función para cargar las salas disponibles, filtrando por película seleccionada
    async function cargarSalas(peliculaId) {
        try {
            loadingSpinner.classList.remove('d-none');  // Mostrar spinner
            const response = await fetch(`../php/getSalas.php?peliculaId=${peliculaId}`);
            const salas = await response.json();

            // Limpiar las opciones actuales
            salaSelect.innerHTML = '';

            salas.forEach(sala => {
                const option = document.createElement('option');
                option.value = sala.id;
                option.textContent = `Sala ${sala.numero} - Aforo: ${sala.aforo} - Cine: ${sala.nombre_cine}`;
                salaSelect.appendChild(option);
            });


            loadingSpinner.classList.add('d-none');  // Ocultar spinner
        } catch (error) {
            console.error('Error al cargar las salas', error);
            loadingSpinner.classList.add('d-none');  // Ocultar spinner en caso de error
        }
    }

    // Manejo del cambio en la selección de película
    peliculaSelect.addEventListener('change', function () {
        const peliculaId = peliculaSelect.value;
        cargarSalas(peliculaId);
    });

    // Validar que el pase no se solape
    async function validarPase(horaInicio, horaFin, salaId) {
        const response = await fetch(`../php/validarPase.php?salaId=${salaId}&horaInicio=${horaInicio}&horaFin=${horaFin}`);
        const data = await response.json();
        return data.valid;
    }

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const peliculaId = peliculaSelect.value;
        const salaId = salaSelect.value;
        const horaInicio = horaInicioInput.value;
        const horaFin = horaFinInput.value;

        const horaMinPermitida = '15:30';
        const horaMaxPermitida = '23:45';

        // 1. Validación de que horaInicio y horaFin estén dentro del rango permitido
        if (horaInicio < horaMinPermitida || horaInicio > horaMaxPermitida) {
            alert('La hora de inicio debe ser a partir las 15:30h.');
            return;
        }

        if (horaFin < horaMinPermitida || horaFin > horaMaxPermitida) {
            alert('La hora de fin no debe superar las 23:45h.');
            return;
        }

        // 2. Validación de que horaInicio < horaFin
        if (horaInicio >= horaFin) {
            alert('La hora de inicio debe ser anterior a la hora de fin.');
            return;
        }

        // 3. Validar que el pase no se solape
        const isValid = await validarPase(horaInicio, horaFin, salaId);
        if (!isValid) {
            alert('El pase se solapa con otro pase en esta sala.');
            return;
        }

        // 4. Enviar al servidor
        const paseData = {
            pelicula: peliculaId,
            sala: salaId,
            horaInicio: horaInicio,
            horaFin: horaFin
        };

        try {
            const response = await fetch('../php/crearPase.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(paseData)
            });

            const data = await response.json();
            alert(data.message);

            if (data.success) {
                window.location.href = '../html/crearPase.html';
            }

        } catch (error) {
            console.error('Error al crear el pase', error);
        }
    });


    cargarPeliculas();
});

