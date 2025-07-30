import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Skeleton from '@/components/Skeleton';

interface Product {
  id: string;
  imageUrl: string;
  seriesName: string;
  productName: string;
  price: number;
  description: string;
}

const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
          if (res.status === 200) {
            setProduct(res.data);
          } else {
            setError(res.data.message || 'Failed to fetch product');
          }
        } catch (err: any) {
          setError(err.response?.data?.message || err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id]);

  if (error) return <div className="container mx-auto mt-10 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto mt-10">
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <Skeleton className="w-full h-96" />
          </div>
          <div>
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-8 w-1/2 mb-4" />
            <Skeleton className="h-24 w-full mb-8" />
            <Skeleton className="h-12 w-40" />
          </div>
        </div>
      ) : product ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <img src={product.imageUrl} alt={product.productName} className="w-full h-auto object-cover rounded-lg shadow-lg" />
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-4">{product.productName}</h1>
            <p className="text-2xl font-semibold text-gray-800 mb-4">${product.price.toFixed(2)}</p>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
            <button className="mt-8 bg-indigo-600 text-white py-3 px-8 rounded-md hover:bg-indigo-700">
              Add to Cart
            </button>
          </div>
        </div>
      ) : (
        <div className="container mx-auto mt-10 text-center">Product not found.</div>
      )}
    </div>
  );
};

export default ProductPage;