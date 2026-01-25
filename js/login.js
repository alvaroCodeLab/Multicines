document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const dni = document.getElementById('dni').value;
            const password = document.getElementById('password').value;
            const errorMessage = document.getElementById('errorMessage');

            var datosUsuario = {
                dni: dni,
                password: password
            };

            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datosUsuario)
            };

            try {
                const response = await fetch('../php/login.php', requestOptions);
                const data = await response.json();

                if (data.success) {
                    // Guardar usuario en el localStorage
                    localStorage.setItem('usuario', JSON.stringify({
                        dni: data.dni, 
                        tipo: data.tipo
                    }));

                    // Redirigir según el tipo de usuario
                    if (data.tipo === 'admin') {
                        window.location.href = '../html/panelAdministracion.html';
                    } else if (data.tipo === 'cliente') {
                        window.location.href = '../html/index.html';
                    }
                }
                else {
                    errorMessage.textContent = data.message;
                    errorMessage.style.display = 'block';
                }
            } catch (error) {
                console.log('Ha ocurrido un error: ', error);
                errorMessage.textContent = 'Ocurrió un error al procesar el login, intentalo de nuevo más tarde.';
                errorMessage.style.display = 'block';
            }
        });
    }
});

