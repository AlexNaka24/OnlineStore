
import { getProducts } from '../modules/api.js';

document.addEventListener('DOMContentLoaded', async () => {

    const containers = document.querySelectorAll('.products-container');

    containers.forEach(container => {
        container.innerHTML = '<p class="loading">Cargando productos...</p>';
    });

    try {
        const products = await getProducts();

        if (products.length === 0) {
            containers.forEach(container => {
                container.innerHTML = '<p>No hay productos disponibles</p>';
            });
            return;
        }

        const destacados = products.slice(0, 4);
        const cuidadoPiel = products.slice(4, 8);
        const exclusivos = products.slice(8, 12);

        const productosArray = [destacados, cuidadoPiel, exclusivos];

        containers.forEach((container, index) => {
            const productosSeccion = productosArray[index] || [];

            if (productosSeccion.length === 0) {
                container.innerHTML = '<p>No hay productos en esta sección</p>';
                return;
            }

            container.innerHTML = productosSeccion.map(product => `
                <div class="product-item">
                    <div class="product-image">
                        <img src="${product.thumbnail}" alt="${product.title}">
                    </div>
                    <div class="product-info">
                        <h3>${product.title}</h3>
                        <p>${product.description}</p>
                        <div class="price-new">$${product.price}</div>
                        <button class="btn-comprar">Agregar al carrito</button>
                    </div>
                </div>
            `).join('');
        });

    } catch (error) {
        console.error('Error:', error);
        containers.forEach(container => {
            container.innerHTML = '<p>Error al cargar productos</p>';
        });
    }
});