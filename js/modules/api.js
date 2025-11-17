

import { API_TOKEN, BASE_ID, TABLE_NAME } from '../config/config.js';

const API_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

// Obtener productos (GET)
export async function getProducts() {
    try {
        const response = await fetch(API_URL, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error HTTP! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Products from Airtable:', data);
        return data.records || [];

    } catch (err) {
        console.error('Error fetching products:', err);
        return [];
    }
}

// Crear producto (POST)
export async function createProduct(productData) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fields: {
                    Name: productData.name,
                    Price: productData.price,
                    Description: productData.description,
                    Category: productData.category,
                    Image: productData.image
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Error HTTP! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Product created:', data);
        return data;

    } catch (err) {
        console.error('Error creating product:', err);
        throw err;
    }
}

// Actualizar producto (PATCH)
export async function updateProduct(productId, productData) {
    try {
        const response = await fetch(`${API_URL}/${productId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fields: {
                    Name: productData.name,
                    Price: productData.price,
                    Description: productData.description,
                    Category: productData.category,
                    Image: productData.image
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Error HTTP! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Product updated:', data);
        return data;

    } catch (err) {
        console.error('Error updating product:', err);
        throw err;
    }
}

// Eliminar producto (DELETE)
export async function deleteProduct(productId) {
    try {
        const response = await fetch(`${API_URL}/${productId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error HTTP! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Product deleted:', data);
        return data;

    } catch (err) {
        console.error('Error deleting product:', err);
        throw err;
    }
}