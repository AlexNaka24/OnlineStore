

function getProductIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}


function loadCart() {
    try {
        const cartData = localStorage.getItem('wabi_sabi_cart');
        return cartData ? JSON.parse(cartData) : [];
    } catch (error) {
        console.error('Error al cargar el carrito:', error);
        return [];
    }
}


function saveCart(items) {
    try {
        localStorage.setItem('wabi_sabi_cart', JSON.stringify(items));
        updateCartBadge(items);
    } catch (error) {
        console.error('Error al guardar el carrito:', error);
    }
}


function updateCartBadge(items) {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    let badge = document.querySelector('.cart-badge');
    const cartIcon = document.querySelector('.icon-carrito');

    if (totalItems > 0) {
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'cart-badge';
            cartIcon?.appendChild(badge);
        }
        badge.textContent = totalItems;
        badge.style.display = 'flex';
    } else if (badge) {
        badge.style.display = 'none';
    }
}


function findProductInCart(productId) {
    const cartItems = loadCart();
    return cartItems.find(item => item.id === productId);
}


function renderProductDetails() {
    const productId = getProductIdFromURL();

    if (!productId) {
        window.location.href = 'carrito.html';
        return;
    }

    const product = findProductInCart(productId);

    if (!product) {
        alert('Producto no encontrado en el carrito');
        window.location.href = 'carrito.html';
        return;
    }


    const imgElement = document.querySelector('.detalle-imagen img');
    if (imgElement) {
        imgElement.src = product.image;
        imgElement.alt = product.name;
    }


    const titleElement = document.querySelector('.detalle-info h1');
    if (titleElement) {
        titleElement.textContent = product.name;
    }


    const priceElement = document.querySelector('.price');
    if (priceElement) {
        priceElement.textContent = `$${product.price.toLocaleString('es-AR')}`;
    }


    const descriptionElement = document.querySelector('.description');
    if (descriptionElement) {
        descriptionElement.textContent = product.description || 'Sin descripción disponible.';
    }


    const quantityInput = document.getElementById('cantidad');
    if (quantityInput) {
        quantityInput.value = product.quantity;
    }


    updateCartBadge(loadCart());
}


function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        alert('La cantidad mínima es 1');
        return;
    }

    const cartItems = loadCart();
    const product = cartItems.find(item => item.id === productId);

    if (product) {
        product.quantity = newQuantity;
        saveCart(cartItems);


        const quantityInput = document.getElementById('cantidad');
        if (quantityInput) {
            quantityInput.value = newQuantity;
        }

        showNotification('Cantidad actualizada');
    }
}


function removeProduct(productId) {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto del carrito?')) {
        return;
    }

    let cartItems = loadCart();
    cartItems = cartItems.filter(item => item.id !== productId);
    saveCart(cartItems);

    showNotification('Producto eliminado del carrito', 'success');

    setTimeout(() => {
        window.location.href = 'carrito.html';
    }, 1500);
}


function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;

    const bgColor = type === 'success' ? '#10b981' : '#ec5353';

    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

function setupEventListeners() {
    const productId = getProductIdFromURL();
    if (!productId) return;

    const btnDecrease = document.querySelector('.cantidad-control .btn-cantidad:first-child');
    const btnIncrease = document.querySelector('.cantidad-control .btn-cantidad:last-child');
    const quantityInput = document.getElementById('cantidad');

    if (btnDecrease) {
        btnDecrease.addEventListener('click', () => {
            const currentQuantity = parseInt(quantityInput.value);
            if (currentQuantity > 1) {
                quantityInput.value = currentQuantity - 1;
            }
        });
    }

    if (btnIncrease) {
        btnIncrease.addEventListener('click', () => {
            const currentQuantity = parseInt(quantityInput.value);
            quantityInput.value = currentQuantity + 1;
        });
    }

    if (quantityInput) {
        quantityInput.addEventListener('change', (e) => {
            const value = parseInt(e.target.value);
            if (value < 1 || isNaN(value)) {
                e.target.value = 1;
            }
        });
    }

    const btnActualizar = document.querySelector('.btn-actualizar');
    if (btnActualizar) {
        btnActualizar.addEventListener('click', () => {
            const newQuantity = parseInt(quantityInput.value);
            updateQuantity(productId, newQuantity);
        });
    }

    const btnEliminar = document.querySelector('.btn-eliminar');
    if (btnEliminar) {
        btnEliminar.addEventListener('click', () => {
            removeProduct(productId);
        });
    }
}

function addStyles() {
    if (!document.getElementById('cart-animations')) {
        const style = document.createElement('style');
        style.id = 'cart-animations';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}



function init() {
    addStyles();
    renderProductDetails();
    setupEventListeners();

    console.log('Detalles del producto cargados');
}

document.addEventListener('DOMContentLoaded', init);