document.addEventListener('DOMContentLoaded', function () {
    const btnListadoDia = document.getElementById('btnListadoDia');
    const btnListadoFecha = document.getElementById('btnListadoFecha');

    btnListadoDia.addEventListener('click', function (e) {
        e.preventDefault();
        window.location.href = '../html/listadoDia.html';
    });

    btnListadoFecha.addEventListener('click', function (e) {
        e.preventDefault();
        window.location.href = '../html/listadoFecha.html';
    });
});
