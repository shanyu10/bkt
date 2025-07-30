import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductCard from '@/components/ProductCard';
import axios from 'axios';
import Skeleton from '@/components/Skeleton';

interface Product {
  id: string;
  imageUrl: string;
  seriesName: string;
  productName: string;
  price: number;
  isOnSale?: boolean;
  originalPrice?: number;
}

const CategoryPage = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      const fetchProducts = async () => {
        try {
          setLoading(true);
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products?series=${slug}`);
          if (res.status === 200) {
            setProducts(res.data);
          } else {
            setError(res.data.message || 'Failed to fetch products');
          }
        } catch (err: any) {
          setError(err.response?.data?.message || err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchProducts();
    }
  }, [slug]);

  if (error) return <div className="container mx-auto mt-10 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-4xl font-bold text-center mb-8 capitalize">{slug?.toString().replace(/-/g, ' ')}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-80 w-full" />
          ))
        ) : (
          products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))
        )}
      </div>
    </div>
  );
};

export default CategoryPage;