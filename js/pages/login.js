document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username && password) {

        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('adminUsername', username);

        window.location.href = 'productos.html';
    }
});