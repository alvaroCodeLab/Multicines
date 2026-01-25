document.addEventListener('DOMContentLoaded', function () {
    const btnCrear = document.getElementById('btnCrear');
    const btnMostrar = document.getElementById('btnMostrar');

    btnCrear.addEventListener('click', function (e) {
        e.preventDefault();
        window.location.href = '../html/crearPase.html';
    });

    btnMostrar.addEventListener('click', function (e) {
        e.preventDefault();
        window.location.href = '../html/visualizarPase.html';
    });
});