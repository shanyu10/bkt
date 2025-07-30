import axios from 'axios';
import { Product } from './store'; // Assuming Product interface is defined here

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getProducts = async (): Promise<Product[]> => {
  try {
    console.log('Fetching products from:', API_BASE_URL);
    const response = await api.get('/api/products');
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error; // Re-throw to allow calling component to handle
  }
};

// You can add more API functions here as needed, e.g.,
// export const loginUser = async (credentials: any) => {
//   const response = await api.post('/api/login', credentials);
//   return response.data;
// };
