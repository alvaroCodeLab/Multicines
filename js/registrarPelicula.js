document.addEventListener('DOMContentLoaded', function () {
    const peliculaForm = document.getElementById('peliculaForm');
    const mensajeDiv = document.getElementById('mensaje');
    const imagePreview = document.getElementById('imagePreview');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');

    // Vista previa de la imagen seleccionada por el usuario
    document.getElementById('imagen').addEventListener('change', function (e) {
        const file = e.target.files[0]; // Obtener el primer archivo seleccionado (si existe)

        if (file) {
            const reader = new FileReader(); // Crear una instancia de FileReader para leer el archivo

            // Cuando el archivo se ha leído correctamente
            reader.onload = function () {
                imagePreview.src = reader.result; // Establecer la imagen de vista previa con el contenido leído
                imagePreview.style.display = 'block'; // Mostrar la imagen de vista previa
                imagePreviewContainer.style.display = 'block'; // Muestra el contenedor de la vista previa
            };

            reader.readAsDataURL(file); // Leer el archivo como una URL de datos (base64)
        }
    });

    // Manejo del formulario
    if (peliculaForm) {
        peliculaForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const titulo = document.getElementById('titulo').value;
            const genero = document.getElementById('genero').value;
            const director = document.getElementById('director').value;
            const actores = document.getElementById('actores').value;
            const fechaEstreno = document.getElementById('fechaEstreno').value;
            const duracion = document.getElementById('duracion').value;
            const imagen = document.getElementById('imagen').files[0];

            // Validación de los campos
            if (!titulo || !genero || !director || !actores || !fechaEstreno || !duracion || !imagen) {
                mostrarMensaje("Por favor, complete todos los campos correctamente.", 'error');
                return;
            }

            // Crear FormData para enviar la imagen
            const formData = new FormData();
            formData.append('titulo', titulo);
            formData.append('genero', genero);
            formData.append('director', director);
            formData.append('actores', actores);
            formData.append('fechaEstreno', fechaEstreno);
            formData.append('duracion', duracion);
            formData.append('imagen', imagen);

            try {
                const response = await fetch('../php/registrarPelicula.php', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();
                if (data.success) {
                    mostrarMensaje(data.message, 'success');
                    peliculaForm.reset();  // Limpiar el formulario
                    imagePreview.style.display = 'none';  // Limpiar la vista previa de la imagen
                } else {
                    mostrarMensaje(data.message, 'error');
                }
            } catch (error) {
                console.error('Error al realizar la petición: ', error);
                mostrarMensaje('Hubo un error al procesar la solicitud.', 'error');
            }
        });
    }

    // Función para mostrar mensajes de éxito o error con animación
    function mostrarMensaje(mensaje, tipo) {
        // Limpiar clases anteriores
        mensajeDiv.classList.remove('alert-success', 'alert-danger', 'alert-info');
        mensajeDiv.textContent = mensaje;

        // Añadir la clase adecuada según el tipo
        if (tipo === 'success') {
            mensajeDiv.classList.add('alert-success');
        } else if (tipo === 'error') {
            mensajeDiv.classList.add('alert-danger');
        } else {
            mensajeDiv.classList.add('alert-info');
        }

        // Mostrar el mensaje con animación
        mensajeDiv.style.display = 'block';
        setTimeout(() => {
            mensajeDiv.style.opacity = 1;  // Asegurar que el mensaje se vea
        }, 10);  // Un pequeño delay para aplicar el fade-in

        // Desvanecer el mensaje después de 5 segundos
        setTimeout(() => {
            mensajeDiv.style.opacity = 0;
            setTimeout(() => {
                mensajeDiv.style.display = 'none';  // Ocultar completamente después de desvanecer
            }, 500);  // El tiempo de espera para que desaparezca completamente
        }, 5000);
    }
});
