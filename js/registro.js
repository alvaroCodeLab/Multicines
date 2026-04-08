// Espera a que todo el contenido del DOM esté completamente cargado antes de ejecutar el script
document.addEventListener('DOMContentLoaded', function () {
    
    // Obtener el formulario de registro por su ID
    const registerForm = document.getElementById('registerForm');

    // Verifica que el formulario exista antes de agregar el listener
    if (registerForm) {

        // Escucha el evento "submit" del formulario
        registerForm.addEventListener('submit', async function (e) {
            // Previene el comportamiento por defecto del formulario (recargar la página)
            e.preventDefault();

            // Obtener los valores ingresados por el usuario en cada campo del formulario
            const dni = document.getElementById('dni').value;
            const nombre = document.getElementById('nombre').value;
            const email = document.getElementById('email').value;
            const telefono = document.getElementById('telefono').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm_password').value;

            // Referencia al contenedor donde se mostrarán los mensajes de error
            const errorMessage = document.getElementById('errorMessage');

            // Valida que las contraseñas coincidan
            if (password != confirmPassword) {
                errorMessage.textContent = 'Las contraseñas no coinciden.';
                errorMessage.style.display = 'block';
                return; // Detiene el envío si las contraseñas no coinciden
            }

            // Crea un objeto con los datos del usuario a enviar al servidor
            var datosUsuario = {
                dni: dni,
                nombre: nombre,
                email: email,
                telefono: telefono,
                password: password
            };

            // Configura las opciones para la solicitud fetch
            const requestOptions = {
                method: 'POST', // Método HTTP
                headers: {
                    'Content-Type': 'application/json' // Indica que se envía JSON
                },
                body: JSON.stringify(datosUsuario) // Convierte el objeto a cadena JSON
            };

            try {
              // Envíar los datos al servidor usando fetch y espera la respuesta
              const response = await fetch(
                "../php/registro.php",
                requestOptions,
              );

              // Convierte la respuesta del servidor en un objeto JSON
              const data = await response.json();

              // Si el registro fue exitoso, redirige al usuario al index
              if (data.success) {
                const successMessage =
                  document.getElementById("successMessage");

                // Oculta errores si había
                errorMessage.style.display = "none";

                // Muestra mensaje de éxito
                successMessage.textContent =
                  "Registro completado correctamente. Redirigiendo al login...";
                successMessage.style.display = "block";

                // Espera 2 segundos antes de redirigir
                setTimeout(() => {
                  window.location.href = "../html/login.html";
                }, 2000);
              } else {
                // Si hubo un error, muestra el mensaje del servidor
                errorMessage.textContent = data.message;
                errorMessage.style.display = "block";
              }
            } catch (error) {
                // Captura errores de red u otros problemas inesperados
                console.log('Ha ocurrido un error: ', error);
                errorMessage.textContent = 'Ocurrió un error al procesar el registro, intentalo de nuevo más tarde.';
                errorMessage.style.display = 'block';
            }

        });
    }

});
