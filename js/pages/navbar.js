



document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.header');
    const menuToggle = document.getElementById('menu-toggle');
    const navbar = document.getElementById('navbar');

    if (menuToggle && navbar) {
        menuToggle.addEventListener('click', () => {
            navbar.classList.toggle('active');
        });

        navbar.querySelectorAll('a').forEach(link => {
            link.addEventListener('cl|ick', () => {
                navbar.classList.remove('active');
            });
        });

        document.addEventListener('click', (e) => {
            if (!header.contains(e.target)) {
                navbar.classList.remove('active');
            }
        });
    }
});