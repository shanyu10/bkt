
import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '@/components/ProductCard';

interface WishlistItem {
  id: string;
  imageUrl: string;
  seriesName: string;
  productName: string;
  price: number;
  isOnSale?: boolean;
  originalPrice?: number;
}

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found, please log in.');
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/wishlist`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (res.status === 200) {
          setWishlistItems(res.data.items || []);
        } else {
          setError(res.data.message || 'Failed to fetch wishlist');
        }
      } catch (err: any) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const handleRemoveFromWishlist = async (productId: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found, please log in.');
      return;
    }

    try {
      const res = await axios.delete(`${import.meta.env.VITE_API_URL}/api/wishlist/${productId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        setWishlistItems(prevItems => prevItems.filter(item => item.id !== productId));
      } else {
        setError(res.data.message || 'Failed to remove from wishlist');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
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
