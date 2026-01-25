document.addEventListener('DOMContentLoaded', function () {
    const btnRegistrar = document.getElementById('btnRegistrar');
    const btnVisualizar = document.getElementById('btnVisualizar');
    const btnAsignar = document.getElementById('btnAsignar');

    btnRegistrar.addEventListener('click', function (e) {
        e.preventDefault();
        window.location.href = '../html/registrarPelicula.html';
    });

    btnVisualizar.addEventListener('click', function (e) {
        e.preventDefault();
        window.location.href = '../html/visualizarPeliculas.html';
    });

    btnAsignar.addEventListener('click', function (e) {
        e.preventDefault();
        window.location.href = '../html/asignarPelicula.html';
    });
});