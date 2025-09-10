export function mostrarModalContacto() {

    const modalElegante = document.getElementById('modal-contacto');
    const btnContacto = document.querySelector('.nav-contacto');
    const spanCerrar = modalElegante.querySelector('.close');

    // Abrir modal de contacto
    btnContacto.addEventListener('click', e => {
        e.preventDefault();
        modalElegante.style.display = 'block';
    });

    // Cerrar modal de contacto
    spanCerrar.addEventListener('click', () => {
        modalElegante.style.display = 'none';
    });
}