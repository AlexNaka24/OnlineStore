
import { getProducts } from '../modules/api.js';


// FUNCION para crear card del producto
function createProductCard(product) {
    const fields = product.fields;

    const imageUrl = fields.Image || './img/default-product.jpg';

    return `
        <div class="product-item" data-id="${product.id}">
            <div class="product-image">
                <img src="${imageUrl}" alt="${fields.Name || 'Producto'}">
            </div>
            <div class="product-info">
                <h3>${fields.Name || 'Sin nombre'}</h3>
                <span class="price-new">$${fields.Price?.toLocaleString('es-AR') || '0'}</span>
                ${fields.Description ? `<p class="installments">${fields.Description}</p>` : ''}
                <button class="btn-comprar" data-product-id="${product.id}">
                    Agregar al carrito
                </button>
            </div>
        </div>
    `;
}

// FUNCION para render productos en un contenedor
function renderProductsInContainer(products, container) {
    if (!container) {
        return;
    }

    const productsHTML = products.map(product => createProductCard(product)).join('');
    container.innerHTML = productsHTML;
}

// FUNCION render principal
async function render() {
    const containers = document.querySelectorAll('.products-container');

    containers.forEach(container => {
        container.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Cargando productos...</p>';
    });

    const allProducts = await getProducts();

    const geles = allProducts.filter(p => p.fields.Category === 'Geles');
    const hidratantes = allProducts.filter(p => p.fields.Category === 'Hidratantes');
    const exfoliantes = allProducts.filter(p => p.fields.Category === 'Exfoliantes');
    const otros = allProducts.filter(p => p.fields.Category === 'Otros');

    if (containers[0]) renderProductsInContainer(allProducts, containers[0]);

    if (containers[1]) {
        const cuidadoPiel = [...hidratantes, ...geles];
        renderProductsInContainer(cuidadoPiel.length > 0 ? cuidadoPiel : allProducts, containers[1]);
    }

    if (containers[2]) {
        const exclusivos = [...exfoliantes, ...otros];
        renderProductsInContainer(exclusivos.length > 0 ? exclusivos : allProducts, containers[2]);
    }
}

document.addEventListener('DOMContentLoaded', render);