document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const peliculaId = urlParams.get('id');

    if (!peliculaId) {
        alert('No se especificó el ID de la película.');
        return;
    }

    const spinner = document.getElementById('spinner');

    fetch(`../php/pelicula.php?id=${peliculaId}`)
        .then(response => response.json())
        .then(pelicula => {
            const contenedor = document.getElementById('detallePelicula');

            function formatearFecha(fechaStr) {
                const fecha = new Date(fechaStr);
                const dia = String(fecha.getDate()).padStart(2, '0');
                const mes = String(fecha.getMonth() + 1).padStart(2, '0');
                const año = fecha.getFullYear();
                return `${dia}-${mes}-${año}`;
            }

            const fechaEstrenoFormateada = formatearFecha(pelicula.fechaEstreno);

            contenedor.innerHTML = `
            <div class="row">
                <div class="col-md-6 mb-4">
                    <div class="card shadow-lg">
                        <img src="${pelicula.imagen}" alt="${pelicula.titulo}" class="card-img-top img-fluid rounded-top">
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card shadow-lg">
                        <div class="card-body">
                            <h1 class="card-title text-center mb-3">${pelicula.titulo}</h1>
                            <p><strong>Director:</strong> ${pelicula.director}</p>
                            <p><strong>Género:</strong> ${pelicula.genero}</p>
                            <p><strong>Fecha de estreno:</strong> ${fechaEstrenoFormateada}</p>
                            <p><strong>Duración:</strong> ${pelicula.duracion} minutos</p>
                            <p><strong>Reparto:</strong> ${pelicula.actores}</p>
                        </div>
                    </div>

                    <h3 class="mt-4 text-center">Pases disponibles:</h3>
                    <div id="pasesList" class="list-group">
                    </div>
                </div>
            </div>
            `;

            const pasesList = document.getElementById('pasesList');

            if (pelicula.pases && pelicula.pases.length > 0) {
                pelicula.pases.forEach(pase => {
                    const listItem = document.createElement('div');
                    listItem.classList.add(
                        'list-group-item', 'list-group-item-action', 'd-flex',
                        'justify-content-between', 'align-items-center', 'shadow-sm',
                        'mb-3', 'pase'
                    );

                    listItem.innerHTML = `
                        <div>
                            <strong>Hora:</strong> ${pase.horaInicio} <br>
                            <strong>Cine:</strong> ${pase.nombreCine} <br>
                            <strong>Sala:</strong> ${pase.numeroSala} <br>
                            <strong>Fecha:</strong> ${pase.fecha}
                        </div>
                        <div class="d-flex align-items-center">
                            <span class="badge bg-success entradas-disponibles">${pase.entradasDisponibles} entradas</span>
                            <button class="btn btn-primary btn-sm ms-2 comprar-btn" 
                                data-pase-id="${pase.paseId}" 
                                data-entradas-disponibles="${pase.entradasDisponibles}">
                                Comprar entradas
                            </button>
                        </div>
                    `;
                    pasesList.appendChild(listItem);
                });

                // Añadimos eventos a los botones
                document.querySelectorAll('.comprar-btn').forEach((btn) => {
                    btn.addEventListener('click', () => {
                        const paseId = btn.getAttribute('data-pase-id');
                        const entradasDisponibles = parseInt(btn.getAttribute('data-entradas-disponibles'));

                        const modalCompra = new bootstrap.Modal(document.getElementById('modalCompra'));
                        const numEntradasField = document.getElementById('numEntradas');
                        const confirmarCompraBtn = document.getElementById('confirmarCompraBtn');
                        const errorCompra = document.getElementById('errorCompra');

                        numEntradasField.value = 1;
                        confirmarCompraBtn.disabled = false;
                        errorCompra.style.display = 'none';

                        // Validar entrada
                        numEntradasField.removeEventListener('input', null);
                        numEntradasField.addEventListener('input', () => {
                            const entradas = parseInt(numEntradasField.value);
                            if (entradas > 0 && entradas <= entradasDisponibles) {
                                confirmarCompraBtn.disabled = false;
                                errorCompra.style.display = 'none';
                            } else {
                                confirmarCompraBtn.disabled = true;
                                errorCompra.style.display = 'block';
                            }
                        });

                        // Acción al confirmar
                        confirmarCompraBtn.onclick = () => {
                            const numEntradas = parseInt(numEntradasField.value);
                            fetch('../php/comprar_entradas.php', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    paseId: paseId,
                                    numEntradas: numEntradas
                                })
                            })
                                .then(res => res.json())
                                .then(data => {
                                    if (data.success) {
                                        alert('Compra realizada con éxito. Revisa tu email para la confirmación.');

                                        // Después de la compra, obtener las entradas actualizadas
                                        fetch(`../php/obtener_entradas_actualizadas.php?paseId=${paseId}`)
                                            .then(res => res.json())
                                            .then(updateData => {
                                                if (updateData.success) {
                                                    const nuevasEntradas = updateData.entradasDisponibles;
                                                    // Buscar el botón y badge relacionados
                                                    const boton = document.querySelector(`button[data-pase-id="${paseId}"]`);
                                                    const badge = boton.closest('.d-flex').querySelector('.entradas-disponibles');

                                                    if (nuevasEntradas > 0) {
                                                        badge.textContent = `${nuevasEntradas} entradas`;
                                                        // Actualizar atributo data-entradas-disponibles
                                                        boton.setAttribute('data-entradas-disponibles', nuevasEntradas);
                                                        // Si las entradas son 0, deshabilitar botón
                                                        if (nuevasEntradas === 0) {
                                                            boton.disabled = true;
                                                            boton.textContent = 'Agotado';
                                                        }
                                                    } else {
                                                        // Sin entradas, marcar como agotado
                                                        badge.textContent = `0 entradas`;
                                                        boton.disabled = true;
                                                        boton.textContent = 'Agotado';
                                                    }
                                                }
                                            });
                                    } else {
                                        alert('Error: ' + data.message);
                                    }
                                    modalCompra.hide();
                                })
                                .catch(error => {
                                    alert('Error en la compra: ' + error);
                                    modalCompra.hide();
                                });
                        };

                        modalCompra.show();
                    });
                });
            } else {
                // No hay pases
                const proximamenteItem = document.createElement('div');
                proximamenteItem.classList.add('list-group-item', 'proximamente');
                proximamenteItem.textContent = 'Próximamente';
                pasesList.appendChild(proximamenteItem);
            }
        })
        .catch(error => {
            console.error('Error al cargar los detalles de la película:', error);
        })
        .finally(() => {
            spinner.classList.add('d-none');
        });
});
