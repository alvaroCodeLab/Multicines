document.addEventListener('DOMContentLoaded', function () {
    const peliculasList = document.getElementById('peliculasList');
    const detallePelicula = document.getElementById('detallePelicula');

    // Cargar las películas al inicio
    async function cargarPeliculas() {
        try {
            const response = await fetch('../php/visualizarPeliculas.php');
            const peliculas = await response.json();

            if (peliculas.success) {
                peliculasList.innerHTML = '<option value="">Selecciona una película</option>';
                peliculas.data.forEach(pelicula => {
                    const option = document.createElement('option');
                    option.value = pelicula.id;
                    option.textContent = pelicula.titulo;
                    peliculasList.appendChild(option);
                });
            } else {
                alert(peliculas.message);
            }
        } catch (error) {
            console.error('Error al cargar las películas: ', error);
            alert('Hubo un error al cargar las películas.');
        }
    }

    // Mostrar detalles de la película seleccionada
    async function mostrarDetalles(idPelicula) {
        try {
            const response = await fetch(`../php/visualizarPeliculas.php?id=${idPelicula}`);
            const pelicula = await response.json();

            if (pelicula.success) {
                const data = pelicula.data;
                document.getElementById('titulo').textContent = data.titulo;
                document.getElementById('genero').textContent = data.genero;
                document.getElementById('director').textContent = data.director;
                document.getElementById('actores').textContent = data.actores;
                document.getElementById('fechaEstreno').textContent = data.fechaEstreno;
                document.getElementById('duracion').textContent = data.duracion;
                const imagen = document.getElementById('imagen');
                imagen.src = 'data:image/jpeg;base64,' + data.imagen;

                const detallePelicula = document.getElementById('detallePelicula');

                // Reiniciar la animación
                detallePelicula.style.display = 'block';
                detallePelicula.style.animation = 'none';
                detallePelicula.offsetHeight; // Trigger reflow
                detallePelicula.style.animation = null;

            } else {
                alert(pelicula.message);
            }
        } catch (error) {
            console.error('Error al obtener los detalles de la película: ', error);
            alert('Hubo un error al obtener los detalles.');
        }
    }


    // Evento cuando se selecciona una película
    peliculasList.addEventListener('change', function () {
        const idPelicula = peliculasList.value;
        if (idPelicula) {
            mostrarDetalles(idPelicula);
        } else {
            detallePelicula.style.display = 'none';
        }
    });

    cargarPeliculas();
});

