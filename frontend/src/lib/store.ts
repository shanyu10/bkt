import { create } from 'zustand';

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

export const useCartStore = create<CartState>((set) => ({
  cartItems: [],
  addToCart: (item) => set((state) => {
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
  }),
  removeFromCart: (id) => set((state) => ({
    cartItems: state.cartItems.filter(item => item.id !== id),
  })),
  updateQuantity: (id, quantity) => set((state) => ({
    cartItems: state.cartItems.map(item =>
      item.id === id ? { ...item, quantity } : item
    ),
  })),
}));

interface AuthState {
  isLoggedIn: boolean;
  user: any; // You might want to define a more specific User interface
  token: string | null;
  login: (user: any, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: null,
  token: null,
  login: (user, token) => set({
    isLoggedIn: true,
    user,
    token,
  }),
  logout: () => set({
    isLoggedIn: false,
    user: null,
    token: null,
  }),
}));
