document.addEventListener('DOMContentLoaded', () => {
    // Mostrar el loader al iniciar la carga de películas
    const loader = document.getElementById('loader');

    // Mostrar el loader
    loader.classList.remove('loader-hidden');

    fetch('../php/cartelera.php') 
        .then(response => response.json())
        .then(data => {
            const contenedor = document.getElementById('cartelera');
            contenedor.innerHTML = '';

            data.forEach(pelicula => {
                // Crear la estructura de la tarjeta
                const col = document.createElement('div');
                col.className = 'col';

                const card = document.createElement('div');
                card.className = 'card h-100 cursor-pointer'; // Agrego clase para cursor

                // Agregar evento click para redirigir
                card.addEventListener('click', () => {
                    window.location.href = `../html/pelicula.html?id=${pelicula.id}`;
                });

                // Imagen
                const img = document.createElement('img');
                img.src = pelicula.imagen;
                img.className = 'card-img-top';
                img.alt = pelicula.titulo;

                // Cuerpo de la tarjeta
                const cardBody = document.createElement('div');
                cardBody.className = 'card-body';

                // Crear el título con información adicional
                const titulo = document.createElement('h5');
                titulo.className = 'card-title';

                // Formatear los datos adicionales
                const director = pelicula.director || 'Desconocido';
                const genero = pelicula.genero || 'Desconocido';
                const año = pelicula.fechaEstreno ? new Date(pelicula.fechaEstreno).getFullYear() : 'Desconocido';
                const duracion = pelicula.duracion ? `${pelicula.duracion} min` : 'Desconocido';

                // Añadir el título principal y los datos adicionales
                titulo.innerHTML = `
                    ${pelicula.titulo}
                    <br>
                    <small class="text-muted">
                        ${director} | ${duracion} | ${genero} | ${año}
                    </small>
                `;

                // Sección de horarios
                const horariosDiv = document.createElement('div');
                horariosDiv.className = 'd-flex flex-wrap gap-2';

                if (pelicula.horarios.length > 0) {
                    // Crear botones por cada horario
                    pelicula.horarios.forEach(hora => {
                        const btn = document.createElement('button');
                        btn.className = 'btn btn-horario btn-sm';
                        const horaFormateada = hora.slice(0, 5);
                        btn.textContent = horaFormateada;
                        horariosDiv.appendChild(btn);
                    });
                } else {
                    // Mostrar mensaje si no hay pases
                    const sinPases = document.createElement('p');
                    sinPases.className = 'text-muted fst-italic mb-0';
                    sinPases.textContent = 'No hay pases disponibles.';
                    horariosDiv.appendChild(sinPases);
                }

                // Appendear todo
                const horariosLabel = document.createElement('h6');
                horariosLabel.className = 'mt-3';
                horariosLabel.textContent = 'Horarios:';

                cardBody.appendChild(titulo);
                cardBody.appendChild(horariosLabel);
                cardBody.appendChild(horariosDiv);

                card.appendChild(img);
                card.appendChild(cardBody);
                col.appendChild(card);
                contenedor.appendChild(col);
            });
        })
        .catch(error => console.error('Error cargando las películas:', error))
        .finally(() => {
            // Ocultar el loader después de que los datos se hayan cargado
            loader.classList.add('loader-hidden');
        });

    // Cierre de sesión
    document.getElementById('cerrarSesion').addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('../php/cerrarSesion.php', {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                window.location.href = '../html/login.html';
            } else {
                alert('Error al cerrar sesión');
            }
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            alert('Error de red');
        }
    });
});



