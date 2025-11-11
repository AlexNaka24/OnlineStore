

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
                <span class="price-new">$${fields.Price?.toLocaleString('es-AR') || '0'}</span>
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

function getActiveFilters() {
    const categoryCheckboxes = document.querySelectorAll('.filtro-seccion:nth-child(1) input[type="checkbox"]:checked');
    const selectedCategories = [];

    categoryCheckboxes.forEach(cb => {
        const labelText = cb.parentElement.textContent.trim();
        const categoryName = labelText.split('(')[0].trim();

        if (categoryName !== 'Todos') {
            selectedCategories.push(categoryName);
        }
    });

    const minPriceInput = document.querySelector('.input-precio input[placeholder="$0"]');
    const maxPriceInput = document.querySelector('.input-precio input[placeholder="$100.000"]');

    const minPrice = parseFloat(minPriceInput?.value.replace(/\D/g, '') || 0);
    const maxPrice = parseFloat(maxPriceInput?.value.replace(/\D/g, '') || Infinity);

    return {
        categories: selectedCategories,
        minPrice: minPrice,
        maxPrice: maxPrice === 0 ? Infinity : maxPrice
    };
}

function applyFilters() {
    const filters = getActiveFilters();

    filteredProducts = allProducts.filter(product => {
        const fields = product.fields;
        const productPrice = fields.Price || 0;
        const productCategory = fields.Category || '';

        const priceMatch = productPrice >= filters.minPrice && productPrice <= filters.maxPrice;

        let categoryMatch = true;
        if (filters.categories.length > 0) {
            categoryMatch = filters.categories.some(filterCategory => {
                const mappedCategories = CATEGORY_MAP[filterCategory] || [];
                return mappedCategories.includes(productCategory);
            });
        }

        return priceMatch && categoryMatch;
    });

    renderAllSections();
    updateCounters();
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

    const filters = getActiveFilters();
    const hasActiveFilters = filters.categories.length > 0 ||
        filters.minPrice > 0 ||
        filters.maxPrice !== Infinity;

    const navbarSearchInput = document.querySelector('.header #search-input');
    const hasSearchQuery = navbarSearchInput && navbarSearchInput.value.trim() !== '';

    const isFiltering = hasActiveFilters || hasSearchQuery;

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

    if (isFiltering) {
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

function updateCounters() {
    const counts = {
        'Todos': allProducts.length,
        'Cuidado facial': allProducts.filter(p =>
            p.fields.Category === 'Geles' || p.fields.Category === 'Hidratantes'
        ).length,
        'Exfoliantes': allProducts.filter(p =>
            p.fields.Category === 'Exfoliantes'
        ).length,
        'Accesorios': allProducts.filter(p =>
            p.fields.Category === 'Otros'
        ).length
    };

    document.querySelectorAll('.filtro-seccion:nth-child(1) label').forEach(label => {
        const text = label.textContent.trim().split('(')[0].trim();

        if (counts[text] !== undefined) {
            const checkbox = label.querySelector('input');
            label.innerHTML = `<input type="checkbox" ${checkbox.checked ? 'checked' : ''}> ${text} (${counts[text]})`;
        }
    });
}

function setupEventListeners() {
    const categoryCheckboxes = document.querySelectorAll('.filtro-seccion:nth-child(1) input[type="checkbox"]');

    categoryCheckboxes.forEach((checkbox, index) => {
        checkbox.addEventListener('change', (e) => {
            if (index === 0 && e.target.checked) {
                categoryCheckboxes.forEach((cb, i) => {
                    if (i !== 0) cb.checked = false;
                });
            }
            else if (index !== 0 && e.target.checked) {
                categoryCheckboxes[0].checked = false;
            }

            const anyChecked = Array.from(categoryCheckboxes).some(cb => cb.checked);
            if (!anyChecked) {
                categoryCheckboxes[0].checked = true;
            }

            applyFilters();
        });
    });

    const btnFiltro = document.querySelector('.btn-filtro');
    if (btnFiltro) {
        btnFiltro.addEventListener('click', applyFilters);
    }

    const priceInputs = document.querySelectorAll('.input-precio input');
    priceInputs.forEach(input => {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                applyFilters();
            }
        });
    });

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
                applyFilters();
            }
        });
    }

    // EVENTO DE AGREGAR AL CARRITO
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
        updateCounters();
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