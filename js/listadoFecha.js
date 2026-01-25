document.addEventListener('DOMContentLoaded', function () {
    const consultaForm = document.getElementById('consultaForm');
    const tablaEntradas = document.getElementById('tablaEntradas').getElementsByTagName('tbody')[0];
    const resumenDiv = document.createElement('div');
    resumenDiv.id = 'resumenTotales';
    document.getElementById('resultado').appendChild(resumenDiv);

    consultaForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const fechaInicio = document.getElementById('fechaInicio').value;
        const fechaFin = document.getElementById('fechaFin').value;

        if (!fechaInicio || !fechaFin) {
            alert("Por favor, ingrese ambas fechas.");
            return;
        }

        try {
            const response = await fetch('../php/listadoFecha.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fechaInicio, fechaFin })
            });

            const data = await response.json();

            if (data.success) {
                tablaEntradas.innerHTML = '';

                data.entradas.forEach(entrada => {
                    const row = tablaEntradas.insertRow();
                    row.innerHTML = `
                        <td>${entrada.fecha}</td>
                        <td>${entrada.numeroSala}</td>
                        <td>${entrada.pelicula}</td>
                        <td>${entrada.horaPase}</td>
                        <td>${entrada.entradasVendidas}</td>
                    `;
                });

                // Mostrar resumen
                resumenDiv.innerHTML = `
                    <h5 class="mt-4">Resumen:</h5>
                    <p class="text-muted">Total de entradas vendidas: <strong>${data.totalEntradas}</strong></p>
                    <p class="text-muted">Total recaudado: <strong>${data.totalRecaudado} €</strong></p>
                `;
            } else {
                tablaEntradas.innerHTML = '';
                resumenDiv.innerHTML = '';
                alert(data.message);
            }
        } catch (error) {
            console.error('Error al realizar la consulta:', error);
            alert('Hubo un error al procesar la solicitud.');
        }
    });
});
