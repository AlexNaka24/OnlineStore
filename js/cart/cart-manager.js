


class ShoppingCart {
    constructor() {
        this.storageKey = 'wabi_sabi_cart';
        this.items = this.loadCart();
    }


    loadCart() {
        try {
            const cartData = localStorage.getItem(this.storageKey);
            return cartData ? JSON.parse(cartData) : [];
        } catch (error) {
            console.error('Error al cargar el carrito:', error);
            return [];
        }
    }


    saveCart() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.items));
            this.updateCartBadge();
            this.dispatchCartUpdate();
        } catch (error) {
            console.error('Error al guardar el carrito:', error);
        }
    }


    addItem(productData) {
        const existingItem = this.items.find(item => item.id === productData.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                id: productData.id,
                name: productData.name,
                price: productData.price,
                image: productData.image,
                description: productData.description,
                quantity: 1
            });
        }

        this.saveCart();
        return true;
    }


    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);

        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
            }
        }
    }


    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
    }


    clearCart() {
        this.items = [];
        this.saveCart();
    }


    getItems() {
        return this.items;
    }


    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }


    getTotalPrice() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }


    updateCartBadge() {
        const totalItems = this.getTotalItems();
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


    dispatchCartUpdate() {
        const event = new CustomEvent('cartUpdated', {
            detail: {
                items: this.items,
                totalItems: this.getTotalItems(),
                totalPrice: this.getTotalPrice()
            }
        });
        window.dispatchEvent(event);
    }
}


const cart = new ShoppingCart();
export { cart, ShoppingCart };