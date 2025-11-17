

const USER = 'admin';
const PASS = '1234';

document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === USER && password === PASS) {
        sessionStorage.setItem('admin', 'true');
        alert('¡Bienvenido!');
        window.location.href = 'admin-panel.html';
    } else {
        alert('Usuario o contraseña incorrectos');
    }
});
