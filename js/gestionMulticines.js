document.addEventListener('DOMContentLoaded', function() {
    const btnAgregar = document.getElementById('btnAgregar');
    const btnVisualizar = document.getElementById('btnVisualizar');

    btnAgregar.addEventListener('click', function (e) {
        e.preventDefault();
        window.location.href = '../html/agregarComplejo.html';
    });

    btnVisualizar.addEventListener('click', function (e) {
        e.preventDefault();
        window.location.href = '../html/visualizarComplejo.html';
    });
});