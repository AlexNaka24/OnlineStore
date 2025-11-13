




import { getProducts, createProduct, updateProduct, deleteProduct } from '../modules/api.js';

if (!sessionStorage.getItem('admin')) {
    window.location.href = 'login.html';
}

let allProducts = [];
let editingId = null;

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        ${type === 'success' ? 'background: #10b981;' : 'background: #ef4444;'}
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}


async function renderProducts() {
    const container = document.getElementById('products-list');
    container.innerHTML = '<p style="text-align:center;color:#666;">Cargando productos...</p>';

    try {
        allProducts = await getProducts();

        if (allProducts.length === 0) {
            container.innerHTML = '<p style="text-align:center;color:#666;">No hay productos</p>';
            return;
        }

        container.innerHTML = allProducts.map(product => {
            const fields = product.fields;

            return `
                <div class="product-card">
                    <img src="${fields.Image}" alt="${fields.Name}" onerror="this.src='./img/default-product.jpg'">
                    <h3>${fields.Name}</h3>
                    <p class="price">$${fields.Price?.toLocaleString('es-AR')}</p>
                    <span class="category">${fields.Category}</span>
                    <p style="color:#666;font-size:0.9rem;margin:10px 0;">${fields.Description || 'Sin descripción'}</p>
                    <div class="product-actions">
                        <button class="btn-edit" onclick="window.editProductHandler('${product.id}')">
                            <i class="fas fa-edit"></i> Editar
                        </button>
                        <button class="btn-delete" onclick="window.deleteProductHandler('${product.id}')">
                            <i class="fas fa-trash"></i> Eliminar
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    } catch (error) {
        container.innerHTML = '<p style="text-align:center;color:#ef4444;">Error al cargar productos</p>';
        console.error('Error:', error);
    }
}


document.getElementById('btn-add').addEventListener('click', () => {
    editingId = null;
    document.getElementById('modal-title').textContent = 'Agregar Producto';
    document.getElementById('product-form').reset();
    document.getElementById('modal').classList.add('show');
});


document.getElementById('btn-cancel').addEventListener('click', () => {
    document.getElementById('modal').classList.remove('show');
});


document.getElementById('product-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitButton = e.target.querySelector('.btn-save');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Guardando...';
    submitButton.disabled = true;

    const productData = {
        name: document.getElementById('name').value,
        price: parseFloat(document.getElementById('price').value),
        description: document.getElementById('description').value,
        category: document.getElementById('category').value,
        image: document.getElementById('image').value
    };

    try {
        if (editingId) {
            await updateProduct(editingId, productData);
            showNotification('Producto actualizado correctamente!');
        } else {
            await createProduct(productData);
            showNotification('Producto creado correctamente!');
        }

        document.getElementById('modal').classList.remove('show');
        await renderProducts();

    } catch (error) {
        showNotification('Error al guardar el producto', 'error');
        console.error('Error:', error);
    } finally {
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }
});


window.editProductHandler = (productId) => {
    const product = allProducts.find(p => p.id === productId);

    if (product) {
        editingId = productId;
        const fields = product.fields;

        document.getElementById('modal-title').textContent = 'Editar Producto';
        document.getElementById('name').value = fields.Name;
        document.getElementById('price').value = fields.Price;
        document.getElementById('description').value = fields.Description || '';
        document.getElementById('category').value = fields.Category;
        document.getElementById('image').value = fields.Image;

        document.getElementById('modal').classList.add('show');
    }
};


window.deleteProductHandler = async (productId) => {
    const product = allProducts.find(p => p.id === productId);

    if (!confirm(`¿Estás seguro de eliminar "${product.fields.Name}"?`)) {
        return;
    }

    try {
        await deleteProduct(productId);
        showNotification('Producto eliminado correctamente!');
        await renderProducts();
    } catch (error) {
        showNotification('Error al eliminar el producto', 'error');
        console.error('Error:', error);
    }
};


document.getElementById('btn-logout').addEventListener('click', () => {
    if (confirm('¿Cerrar sesion?')) {
        sessionStorage.removeItem('admin');
        window.location.href = 'login.html';
    }
});


renderProducts();