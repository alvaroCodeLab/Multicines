// Cierre de sesión
document.getElementById('cerrarSesion').addEventListener('click', async (e) => {
    e.preventDefault();
    try {
        const response = await fetch('../php/cerrarSesion.php', {
            method: 'POST',
            credentials: 'include'
        });

        if (response.ok) {
            window.location.href = 'login.html';
        } else {
            alert('Error al cerrar sesión');
        }
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        alert('Error de red');
    }
});


