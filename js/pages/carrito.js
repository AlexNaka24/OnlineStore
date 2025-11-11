


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


function createCartItemCard(item) {
    return `
        <div class="cart-product-card-component" data-product-id="${item.id}">
            <div class="cart-product-component-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-product-info">
                <div class="cart-product-title-container">
                    <h3 class="cart-product-component-title">${item.name}</h3>
                    <img src="img/bote-de-basura.png" alt="Eliminar" class="delete-icon" data-product-id="${item.id}">
                </div>

                <p class="cart-product-component-description">${item.description || 'Sin descripción'}</p>

                <a href="detalles.html" class="btn-detalle">Ver detalles</a>

                <div class="quantity-button-price-container">
                    <div class="quantity-button-container">
                        <button class="btn-decrease" data-product-id="${item.id}">-</button>
                        <span class="product-quantity">${item.quantity}</span>
                        <button class="btn-increase" data-product-id="${item.id}">+</button>
                    </div>
                    <div class="product-prices-container">
                        <span class="price-text">$${(item.price * item.quantity)}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}


function renderCart() {
    const cartItems = loadCart();
    const container = document.querySelector('.cart-products-container');
    const checkoutButton = document.querySelector('.btn-checkout');

    if (!container) return;


    if (cartItems.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem;">
                <i class="fas fa-shopping-cart" style="font-size: 4rem; color: #ccc; margin-bottom: 1rem;"></i>
                <h2 style="color: #666; margin-bottom: 1rem;">Tu carrito esta vacio</h2>
                <p style="color: #999; margin-bottom: 2rem;">¡Agrega productos para empezar a comprar!</p>
                <a href="productos.html" class="btn-detalle" style="display: inline-block; padding: 12px 24px;">
                    Ver productos
                </a>
            </div>
        `;

        if (checkoutButton) {
            checkoutButton.style.display = 'none';
        }
        return;
    }


    container.innerHTML = cartItems.map(item => createCartItemCard(item)).join('');


    const total = calculateTotal(cartItems);
    if (checkoutButton) {
        checkoutButton.textContent = `Finalizar compra - $${total.toLocaleString('es-AR')}`;
        checkoutButton.style.display = 'block';
    }


    updateCartBadge(cartItems);
}


function calculateTotal(items) {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
}


function increaseQuantity(productId) {
    const cartItems = loadCart();
    const item = cartItems.find(item => item.id === productId);

    if (item) {
        item.quantity += 1;
        saveCart(cartItems);
        renderCart();
    }
}


function decreaseQuantity(productId) {
    const cartItems = loadCart();
    const item = cartItems.find(item => item.id === productId);

    if (item) {
        if (item.quantity > 1) {
            item.quantity -= 1;
            saveCart(cartItems);
            renderCart();
        } else {
            removeItem(productId);
        }
    }
}


function removeItem(productId) {
    let cartItems = loadCart();
    cartItems = cartItems.filter(item => item.id !== productId);
    saveCart(cartItems);
    renderCart();


    showNotification('Producto eliminado del carrito');
}


function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #ec5353;
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
    const container = document.querySelector('.cart-products-container');

    if (container) {

        container.addEventListener('click', (e) => {

            if (e.target.classList.contains('btn-increase')) {
                const productId = e.target.dataset.productId;
                increaseQuantity(productId);
            }


            if (e.target.classList.contains('btn-decrease')) {
                const productId = e.target.dataset.productId;
                decreaseQuantity(productId);
            }


            if (e.target.classList.contains('delete-icon')) {
                const productId = e.target.dataset.productId;
                if (confirm('¿Estas seguro de que queres eliminar este producto?')) {
                    removeItem(productId);
                }
            }
        });
    }


    const checkoutButton = document.querySelector('.btn-checkout');
    if (checkoutButton) {
        checkoutButton.addEventListener('click', () => {

            window.location.href = 'checkout.html';
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
    renderCart();
    setupEventListeners();

    console.log('Carrito cargado:', loadCart());
}


document.addEventListener('DOMContentLoaded', init);