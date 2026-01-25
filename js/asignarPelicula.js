document.addEventListener('DOMContentLoaded', async () => {
    const cineSelect = document.getElementById('cine');
    const salaSelect = document.getElementById('sala');
    const peliculaSelect = document.getElementById('pelicula');
    const form = document.getElementById('formAsignar');
    const mensajeDiv = document.getElementById('mensaje');
    const loadingSpinner = document.getElementById('loadingSpinner');

    // Función para cargar los cines disponibles
    async function cargarCines() {
        try {
            loadingSpinner.classList.remove('d-none'); // Mostrar spinner
            const res = await fetch('../php/obtenerCines.php');
            const data = await res.json();
            cineSelect.innerHTML = '<option value="">Selecciona un Cine</option>';
            data.forEach(cine => {
                cineSelect.innerHTML += `<option value="${cine.id}">${cine.nombre}</option>`;
            });
            //Seleccionar automáticamente el primer cine:
            /*if (data.length > 0) {
                cineSelect.value = data[0].id; // Selecciona el primer cine
                cineSelect.dispatchEvent(new Event('change'));
            }*/
           // fuerza el disparo del evento change (cine por defecto seleccionado).
            cineSelect.dispatchEvent(new Event('change'));
        } catch (error) {
            console.error("Error al cargar los cines", error);
        } finally {
            loadingSpinner.classList.add('d-none'); // Ocultar spinner
        }
    }

    // Función para cargar las salas disponibles según el cine seleccionado
    async function cargarSalas(cineId) {
        salaSelect.innerHTML = '';
        try {
            const res = await fetch(`../php/obtenerSalas.php?cine=${cineId}`);
            const data = await res.json();
            salaSelect.innerHTML = '<option value="">Selecciona una Sala</option>';
            data.forEach(sala => {
                salaSelect.innerHTML += `<option value="${sala.id}">Sala ${sala.numero} (Aforo: ${sala.aforo})</option>`;
            });
        } catch (error) {
            console.error("Error al cargar las salas", error);
        }
    }

    // Función para cargar las películas disponibles
    async function cargarPeliculas() {
        try {
            const res = await fetch('../php/obtenerPeliculas.php');
            const data = await res.json();
            peliculaSelect.innerHTML = '<option value="">Selecciona una Película</option>';
            data.forEach(p => {
                peliculaSelect.innerHTML += `<option value="${p.id}">${p.titulo}</option>`;
            });
        } catch (error) {
            console.error("Error al cargar las películas", error);
        }
    }

    cineSelect.addEventListener('change', () => {
        const cineId = cineSelect.value;
        if (cineId) {
            cargarSalas(cineId);
        } else {
            salaSelect.innerHTML = '';
            peliculaSelect.innerHTML = '';
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const datos = {
            salaId: salaSelect.value,
            peliculaId: peliculaSelect.value
        };

        try {
            loadingSpinner.classList.remove('d-none'); // Mostrar spinner mientras procesamos
            const res = await fetch('../php/asignarPelicula.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(datos)
            });
            const result = await res.json();
            mensajeDiv.innerHTML = `<div class="alert alert-${result.success ? 'success' : 'danger'}">${result.message}</div>`;
        } catch (error) {
            console.error("Error al asignar película", error);
            mensajeDiv.innerHTML = `<div class="alert alert-danger">Error al asignar la película. Por favor, intente nuevamente.</div>`;
        } finally {
            loadingSpinner.classList.add('d-none'); // Ocultar spinner
        }
    });

    await cargarCines();
    await cargarPeliculas();
});
