
import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { fetchWishlist, removeProductFromWishlist } from '@/lib/api';
import { useWishlistStore } from '@/lib/store';

const WishlistPage = () => {
  const { wishlistItems, setWishlistItems, removeItem } = useWishlistStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAndSetWishlist = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found, please log in.');
        setLoading(false);
        return;
      }

      try {
        const res = await fetchWishlist(token);

        if (res) {
          setWishlistItems(res.items || []);
        } else {
          setError(res.message || 'Failed to fetch wishlist');
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAndSetWishlist();
  }, []);

  const handleRemoveFromWishlist = async (productId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found, please log in.');
      return;
    }

    try {
      const res = await removeProductFromWishlist(token, productId);

      if (res) {
        removeItem(productId);
      } else {
        setError(res.message || 'Failed to remove from wishlist');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div className="container mx-auto mt-10 text-center">Loading wishlist...</div>;
  if (error) return <div className="container mx-auto mt-10 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-4xl font-bold text-center mb-8">My Wishlist</h1>
      {wishlistItems.length === 0 ? (
        <p className="text-center text-gray-500">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
            <div key={item.id} className="border rounded-lg overflow-hidden shadow-lg">
              <img src={item.imageUrl} alt={item.productName} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{item.productName}</h2>
                <p className="text-gray-700">${item.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
