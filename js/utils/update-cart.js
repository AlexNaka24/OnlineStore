

function updateCartBadge() {
    try {

        const cartData = localStorage.getItem('wabi_sabi_cart');
        const cartItems = cartData ? JSON.parse(cartData) : [];


        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);


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
    } catch (error) {
        console.error('Error al actualizar badge:', error);
    }
}


document.addEventListener('DOMContentLoaded', updateCartBadge);


window.addEventListener('storage', (e) => {
    if (e.key === 'wabi_sabi_cart') {
        updateCartBadge();
    }
});


window.addEventListener('cartUpdated', updateCartBadge);