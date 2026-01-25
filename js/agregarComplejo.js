document.addEventListener('DOMContentLoaded', function () {
    const complejoForm = document.getElementById('complejoForm');
    const mensajeComplejo = document.getElementById('mensajeComplejo');

    if (complejoForm) {
        complejoForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const nombre = document.getElementById('nombre').value;
            const ubicacion = document.getElementById('ubicacion').value;
            const numeroSalas = document.getElementById('numeroSalas').value;

            // Validación de número de salas
            if (isNaN(numeroSalas) || numeroSalas <= 0) {
                mostrarMensaje("El número de salas debe ser un número positivo.", 'error');
                return;
            }

            var datosCine = {
                nombre: nombre,
                ubicacion: ubicacion,
                numeroSalas: numeroSalas
            };

            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datosCine)
            };

            try {
                const response = await fetch('../php/agregarComplejo.php', requestOptions);
                const data = await response.json();
                if (data.success) {
                    mostrarMensaje(data.message, 'success');
                    complejoForm.reset();
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
        mensajeComplejo.classList.remove('alert-success', 'alert-danger', 'alert-info');
        mensajeComplejo.textContent = mensaje;

        // Añadir la clase adecuada según el tipo
        if (tipo === 'success') {
            mensajeComplejo.classList.add('alert-success');
        } else if (tipo === 'error') {
            mensajeComplejo.classList.add('alert-danger');
        } else {
            mensajeComplejo.classList.add('alert-info');
        }

        // Mostrar el mensaje con animación
        mensajeComplejo.style.display = 'block';
        setTimeout(() => {
            mensajeComplejo.style.opacity = 1;  // Asegurar que el mensaje se vea
        }, 10);  // Un pequeño delay para aplicar el fade-in

        // Desvanecer el mensaje después de 5 segundos
        setTimeout(() => {
            mensajeComplejo.style.opacity = 0;
            setTimeout(() => {
                mensajeComplejo.style.display = 'none';  // Ocultar completamente después de desvanecer
            }, 500);  // El tiempo de espera para que desaparezca completamente
        }, 5000);
    }
});
