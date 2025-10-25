import { CONFIG } from "../config/config.js";

const API_TOKEN = CONFIG.AIRTABLE_TOKEN;
const BASE_ID = CONFIG.AIRTABLE_BASE_ID;
const TABLE_NAME = 'Products';
const API_URL = `https://api.airtable.com/v0/${BASE_ID}/${TABLE_NAME}`;

export async function getProducts() {
    try {
        const response = await fetch(API_URL, {
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        console.log('Products from Airtable:', data);

        return data.records;

    } catch (err) {
        console.error('Error fetching products from Airtable:', err);
        return [];
    }
};