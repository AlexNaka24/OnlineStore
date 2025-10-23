


const API_URL = 'https://dummyjson.com/products';

export async function getProducts() {
    try {
        const response = await fetch(API_URL);
        const { products } = await response.json();

        return products;
    } catch (error) {
        console.error('Error al obtener productos:', error);
        return [];
    }
}

