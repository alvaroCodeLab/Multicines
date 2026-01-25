document.addEventListener('DOMContentLoaded', function () {
    const formulario = document.getElementById('formListadoDia');

    formulario.addEventListener('submit', async function (e) {
        e.preventDefault();

        const fecha = document.getElementById('fecha').value;

        if (!fecha) {
            alert('Por favor, selecciona una fecha.');
            return;
        }

        const requestData = { fecha: fecha };

        try {
            const response = await fetch('../php/listadoDia.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            const data = await response.json();
            mostrarResultados(data);

        } catch (error) {
            console.error('Error al obtener los datos:', error);
            alert('Hubo un problema al obtener los datos.');
        }
    });

    function mostrarResultados(data) {
        const contenedorResultados = document.getElementById('resultados');
        contenedorResultados.innerHTML = '';

        if (data.success) {
            let html = `<h3>Entradas Vendidas - ${data.fecha}</h3>`;
            html += '<table class="table table-striped">';
            html += '<thead><tr><th>Fecha</th><th>Sala</th><th>Película</th><th>Pase</th><th>Entradas Vendidas</th></tr></thead>';
            html += '<tbody>';

            data.entradas.forEach(entrada => {
                html += `
                <tr>
                    <td>${entrada.fecha}</td>
                    <td>${entrada.sala}</td>
                    <td>${entrada.pelicula}</td>
                    <td>${entrada.hora_inicio} - ${entrada.hora_fin}</td>
                    <td>${entrada.entradas_vendidas}</td>
                </tr>
            `;
            });

            html += '</tbody></table>';

            html += `
                <div class="total-resumen">
                    Total Entradas Vendidas: ${data.total_entradas} <br>
                    Dinero Recaudado: ${data.total_recaudado.toFixed(2)} €
                </div>
            `;

            contenedorResultados.innerHTML = html;
        } else {
            contenedorResultados.innerHTML = '<p>No se encontraron datos para la fecha seleccionada.</p>';
        }
    }


});
