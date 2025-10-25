
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

// FUNCION para renderizar productos en un contenedor
function renderProductsInContainer(products, container) {
    if (!container) {
        return;
    }

    const productsHTML = products.map(product => createProductCard(product)).join('');
    container.innerHTML = productsHTML;
}