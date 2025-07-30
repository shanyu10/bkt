import { ShoppingCart, Heart } from 'lucide-react';
import { useCartStore, useWishlistStore } from '@/lib/store';
import { addProductToWishlist, removeProductFromWishlist } from '@/lib/api';

interface ProductCardProps {
  id: string;
  imageUrl: string;
  seriesName: string;
  productName: string;
  price: number;
  isOnSale?: boolean;
  originalPrice?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, imageUrl, seriesName, productName, price, isOnSale, originalPrice }) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const cartItems = useCartStore((state) => state.cartItems);
  const addItemToWishlistStore = useWishlistStore((state) => state.addItem);
  const removeItemFromWishlistStore = useWishlistStore((state) => state.removeItem);
  const wishlistItems = useWishlistStore((state) => state.wishlistItems);

  const isWishlisted = wishlistItems.some(item => item.id === id);
  const isInCart = cartItems.some(item => item.id === id);

  const handleAddToCart = () => {
    console.log('Add to cart button clicked for product:', id);
    addToCart({ id, name: productName, price, quantity: 1, image_url: imageUrl });
    console.log('addToCart function called.');
  };

  const handleToggleWishlist = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    try {
      if (isWishlisted) {
        await removeProductFromWishlist(token, id);
        removeItemFromWishlistStore(id);
      } else {
        await addProductToWishlist(token, id);
        addItemToWishlistStore({ id, imageUrl, seriesName, productName, price, isOnSale, originalPrice });
      }
    } catch (error: any) {
      console.error('Error toggling wishlist:', error);
    }
  };

  return (
    <div className="group relative w-full max-w-sm overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-shadow duration-300 ease-in-out hover:shadow-xl">
      <div className="relative h-64 w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={productName || ''}
          className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 transition-all duration-300 ease-in-out group-hover:bg-opacity-20"></div>
        <div className="absolute right-4 top-4 flex space-x-2">
          <button 
            onClick={handleToggleWishlist}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white bg-opacity-80 text-gray-700 opacity-0 transition-all duration-300 ease-in-out group-hover:opacity-100 hover:bg-opacity-100 transform transition-transform duration-200 hover:scale-110 active:scale-90"
          >
            <Heart size={20} fill={isWishlisted ? 'red' : 'none'} stroke={isWishlisted ? 'red' : 'currentColor'} />
          </button>
          <button 
            onClick={handleAddToCart}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white bg-opacity-80 text-gray-700 opacity-0 transition-all duration-300 ease-in-out group-hover:opacity-100 hover:bg-opacity-100 hover:text-black"
          >
            <ShoppingCart size={20} fill={isInCart ? 'currentColor' : 'none'} stroke={isInCart ? 'currentColor' : 'currentColor'} />
          </button>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bebas-neue text-lg uppercase tracking-wider text-gray-500">{seriesName}</h3>
        <h2 className="truncate text-xl font-semibold text-gray-800">{productName}</h2>
        <div className="mt-2 flex items-baseline">
          <span className={`text-2xl font-bold ${isOnSale ? 'text-red-500' : 'text-gray-900'}`}>${price.toFixed(2)}</span>
          {isOnSale && typeof originalPrice === 'number' && (
            <span className="ml-2 text-sm text-gray-500 line-through">${originalPrice.toFixed(2)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;