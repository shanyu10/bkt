import { create } from 'zustand';
import { fetchCart, addProductToCart, removeProductFromCart, updateCartItemQuantity } from '@/lib/api';

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}

interface CartState {
  cartItems: Product[];
  addToCart: (item: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  cartItems: [],
  initCart: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ cartItems: [] });
      return;
    }
    try {
      const response = await fetchCart(token);
      set({ cartItems: response.items });
    } catch (error) {
      console.error('Error initializing cart:', error);
      set({ cartItems: [] });
    }
  },
  addToCart: async (item) => {
    const token = localStorage.getItem('token');
    if (!token) {
      // If not logged in, revert to local cart behavior for now
      set((state) => {
        const existingItem = state.cartItems.find(cartItem => cartItem.id === item.id);
        if (existingItem) {
          return {
            cartItems: state.cartItems.map(cartItem =>
              cartItem.id === item.id
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
            ),
          };
        } else {
          return { cartItems: [...state.cartItems, { ...item, quantity: 1 }] };
        }
      });
      return;
    }

    try {
      await addProductToCart(token, item.id, 1); // Add 1 quantity
      // After successful API call, update local state by re-fetching or optimistically
      // For simplicity, let's re-fetch the cart after adding
      get().initCart();
    } catch (error) {
      console.error('Error adding to cart via API:', error);
    }
  },
  removeFromCart: async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      set((state) => ({
        cartItems: state.cartItems.filter(item => item.id !== id),
      }));
      return;
    }

    try {
      await removeProductFromCart(token, id);
      get().initCart(); // Re-fetch cart after removal
    } catch (error) {
      console.error('Error removing from cart via API:', error);
    }
  },
  updateQuantity: async (id, quantity) => {
    const token = localStorage.getItem('token');
    if (!token) {
      set((state) => ({
        cartItems: state.cartItems.map(item =>
          item.id === id ? { ...item, quantity } : item
        ),
      }));
      return;
    }

    try {
      await updateCartItemQuantity(token, id, quantity);
      get().initCart(); // Re-fetch cart after quantity update
    } catch (error) {
      console.error('Error updating cart quantity via API:', error);
    }
  },
}));

interface AuthState {
  isLoggedIn: boolean;
  user: any; // You might want to define a more specific User interface
  token: string | null;
  login: (user: any, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: typeof localStorage !== 'undefined' ? !!localStorage.getItem('token') : false,
  user: typeof localStorage !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null,
  token: typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null,
  login: (user, token) => set(() => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    return {
      isLoggedIn: true,
      user,
      token,
    };
  }),
  logout: () => set(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return {
      isLoggedIn: false,
      user: null,
      token: null,
    };
  }),
}));

interface WishlistItem {
  id: string;
  imageUrl: string;
  seriesName: string;
  productName: string;
  price: number;
  isOnSale?: boolean;
  originalPrice?: number;
}

interface WishlistState {
  wishlistItems: WishlistItem[];
  setWishlistItems: (items: WishlistItem[]) => void;
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
}

export const useWishlistStore = create<WishlistState>((set) => ({
  wishlistItems: [],
  setWishlistItems: (items) => set({ wishlistItems: items }),
  addItem: (item) => set((state) => {
    if (!state.wishlistItems.find(wishlistItem => wishlistItem.id === item.id)) {
      return { wishlistItems: [...state.wishlistItems, item] };
    }
    return state; // Item already in wishlist
  }),
  removeItem: (id) => set((state) => ({
    wishlistItems: state.wishlistItems.filter(item => item.id !== id),
  })),
}));