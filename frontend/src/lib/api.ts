import axios from 'axios';
import { Product, useAuthStore } from './store'; // Import useAuthStore

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if the error is an authentication error (401 or 403)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      const errorMessage = error.response.data?.message || error.message;
      // Check for specific messages indicating JWT issues
      if (errorMessage.includes('token is expired') || errorMessage.includes('bad_jwt') || errorMessage.includes('invalid JWT')) {
        console.warn('Authentication token expired or invalid. Logging out...');
        useAuthStore.getState().logout(); // Trigger logout
      }
    }
    return Promise.reject(error);
  }
);

export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await api.get('/api/products');
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error; // Re-throw to allow calling component to handle
  }
};

export const loginUser = async (email: string, password: string) => {
  const response = await api.post('/api/login', { email, password });
  return response.data;
};

export const resendVerificationEmail = async (email: string) => {
  const response = await api.post('/api/resend-verification', { email });
  return response.data;
};

export const registerUser = async (email: string, password: string) => {
  const response = await api.post('/api/register', { email, password });
  return response.data;
};

export const fetchUserProfile = async (token: string) => {
  const response = await api.get('/api/profile', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.data;
};

export const fetchWishlist = async (token: string) => {
  const response = await api.get('/api/wishlist', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.data;
};

export const removeProductFromWishlist = async (token: string, productId: string) => {
  const response = await api.delete(`/api/wishlist/${productId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.data;
};

export const addProductToWishlist = async (token: string, productId: string) => {
  const response = await api.post('/api/wishlist', { productId }, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.data;
};

export const fetchCart = async (token: string) => {
  const response = await api.get('/api/cart', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.data;
};

export const addProductToCart = async (token: string, productId: string, quantity: number = 1) => {
  const response = await api.post('/api/cart', { productId, quantity }, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateCartItemQuantity = async (token: string, productId: string, quantity: number) => {
  const response = await api.put(`/api/cart/${productId}`, { quantity }, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.data;
};

export const removeProductFromCart = async (token: string, productId: string) => {
  const response = await api.delete(`/api/cart/${productId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateUserPassword = async (token: string, newPassword: string) => {
  const response = await api.put('/api/profile/password', { newPassword }, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateUserDisplayName = async (token: string, display_name: string) => {
  const response = await api.put('/api/profile/display-name', { display_name }, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return response.data;
};