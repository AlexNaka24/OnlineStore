

const API_URL = 'https://dummyjson.com/products';

export async function getProducts() {
    try {
        const res = await fetch(API_URL);
        const { products } = await res.json();
        return products;
    } catch (err) {
        console.error('Error al obtener productos:', err);
        return [];
    }
}

