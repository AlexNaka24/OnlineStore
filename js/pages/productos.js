import { getProducts } from '../modules/api.js';
import { cart } from '../cart/cart-manager.js';

let allProducts = [];
let filteredProducts = [];

const CATEGORY_MAP = {
    'Cuidado facial': ['Geles', 'Hidratantes'],
    'Exfoliantes': ['Exfoliantes'],
    'Accesorios': ['Otros']
};

function createProductCard(product) {
    const fields = product.fields;
    const imageUrl = fields.Image || './img/default-product.jpg';

    return `
        <div class="product-item" data-id="${product.id}">
            <div class="product-image">
                <img src="${imageUrl}" alt="${fields.Name || 'Producto'}" loading="lazy">
            </div>
            <div class="product-info">
                <h3>${fields.Name || 'Sin nombre'}</h3>
                <span class="price-new">$${fields.Price || '0'}</span>
                ${fields.Description ? `<p class="installments">${fields.Description}</p>` : ''}
                <button class="btn-comprar" 
                        data-product-id="${product.id}"
                        data-product-name="${fields.Name}"
                        data-product-price="${fields.Price}"
                        data-product-image="${imageUrl}"
                        data-product-description="${fields.Description || ''}">
                    Agregar al carrito
                </button>
            </div>
        </div>
    `;
}

function renderProductsInContainer(products, container) {
    if (!container) return;

    if (products.length === 0) {
        container.innerHTML = `
            <p style="text-align: center; color: #666; padding: 2rem; width: 100%;">
                No se encontraron productos
            </p>`;
        return;
    }

    container.innerHTML = products.map(p => createProductCard(p)).join('');
}

function searchProducts(query) {
    const searchTerm = query.toLowerCase().trim();

    if (searchTerm === '') {
        filteredProducts = [...allProducts];

    } else {
        filteredProducts = allProducts.filter(product => {
            const name = (product.fields.Name || '').toLowerCase();
            const description = (product.fields.Description || '').toLowerCase();
            const category = (product.fields.Category || '').toLowerCase();

            return name.includes(searchTerm) ||
                description.includes(searchTerm) ||
                category.includes(searchTerm);
        });
    }

    renderAllSections();
}

function renderAllSections() {
    const sections = document.querySelectorAll('.productos-exclusivos');
    const containers = document.querySelectorAll('.products-container');

    const navbarSearchInput = document.querySelector('.header #search-input');
    const hasSearchQuery = navbarSearchInput && navbarSearchInput.value.trim() !== '';

    if (filteredProducts.length === 0) {
        sections.forEach(section => section.style.display = 'none');

        if (containers[0]) {
            containers[0].parentElement.style.display = 'block';
            containers[0].innerHTML = `
                <p style="text-align: center; color: #666; padding: 2rem; width: 100%;">
                    No se encontraron productos
                </p>`;
        }

        return;
    }

    if (hasSearchQuery) {
        sections.forEach((section, index) => {
            if (index === 0) {
                section.style.display = 'block';
                const title = section.querySelector('.title-productos-exclusivos h2');
                if (title) {
                    title.textContent = `Resultados (${filteredProducts.length})`;
                }
            } else {
                section.style.display = 'none';
            }
        });

        if (containers[0]) {
            renderProductsInContainer(filteredProducts, containers[0]);
        }
    } else {
        sections.forEach(section => section.style.display = 'block');

        const titles = ['Productos destacados', 'Lo ultimo en cuidado para tu piel', 'Exclusivos en Wabi Sabi'];
        sections.forEach((section, index) => {
            const title = section.querySelector('.title-productos-exclusivos h2');
            if (title) {
                title.textContent = titles[index];
            }
        });

        if (containers[0]) {
            renderProductsInContainer(filteredProducts, containers[0]);
        }

        if (containers[1]) {
            const cuidadoPiel = filteredProducts.filter(p =>
                p.fields.Category === 'Geles' || p.fields.Category === 'Hidratantes'
            );
            renderProductsInContainer(
                cuidadoPiel.length > 0 ? cuidadoPiel : filteredProducts,
                containers[1]
            );
        }

        if (containers[2]) {
            const exclusivos = filteredProducts.filter(p =>
                p.fields.Category === 'Exfoliantes' || p.fields.Category === 'Otros'
            );
            renderProductsInContainer(
                exclusivos.length > 0 ? exclusivos : filteredProducts,
                containers[2]
            );
        }
    }
}

function setupEventListeners() {
    const navbarSearchInput = document.querySelector('.header #search-input');
    const navbarSearchButton = document.querySelector('.header #search-button');

    if (navbarSearchButton) {
        navbarSearchButton.addEventListener('click', () => {
            if (navbarSearchInput) {
                const query = navbarSearchInput.value.trim();
                if (query) {
                    searchProducts(query);
                    scrollToProducts();
                }
            }
        });
    }

    if (navbarSearchInput) {
        navbarSearchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = e.target.value.trim();
                if (query) {
                    searchProducts(query);
                    scrollToProducts();
                }
            }
        });

        navbarSearchInput.addEventListener('input', (e) => {
            if (e.target.value === '') {
                filteredProducts = [...allProducts];
                renderAllSections();
            }
        });
    }

    // Evento de agregar al carrito
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-comprar')) {
            const button = e.target;
            const productData = {
                id: button.dataset.productId,
                name: button.dataset.productName,
                price: parseFloat(button.dataset.productPrice),
                image: button.dataset.productImage,
                description: button.dataset.productDescription
            };

            cart.addItem(productData);

            console.log('Producto agregado:', productData.name);

            // Feedback visual
            button.textContent = '✓ Agregado';
            button.style.background = '#10b981';

            setTimeout(() => {
                button.textContent = 'Agregar al carrito';
                button.style.background = '';
            }, 1500);
        }
    });
}

function scrollToProducts() {
    const firstSection = document.querySelector('.productos-exclusivos');
    if (firstSection) {
        firstSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

async function init() {
    const containers = document.querySelectorAll('.products-container');

    containers.forEach(container => {
        container.innerHTML = `
            <p style="text-align: center; color: #666; padding: 2rem; width: 100%;">
                Cargando productos...
            </p>`;
    });

    try {
        allProducts = await getProducts();
        filteredProducts = [...allProducts];

        console.log(`${allProducts.length} productos cargados`);

        if (allProducts.length === 0) {
            containers.forEach(container => {
                container.innerHTML = `
                    <p style="text-align: center; color: #666; padding: 2rem; width: 100%;">
                        No hay productos disponibles
                    </p>`;
            });
            return;
        }

        renderAllSections();
        setupEventListeners();
        cart.updateCartBadge();

    } catch (error) {
        console.error('Error al cargar productos:', error);
        containers.forEach(container => {
            container.innerHTML = `
                <p style="text-align: center; color: #e74c3c; padding: 2rem; width: 100%;">
                    Error al cargar productos. Por favor, recarga la página.
                </p>`;
        });
    }
}

document.addEventListener('DOMContentLoaded', init);