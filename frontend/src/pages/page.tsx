import { useEffect, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { Link } from 'react-router-dom';
import { Product } from '@/lib/store'; // Import Product interface
import { getProducts } from '@/lib/api'; // Import the new API function
import Skeleton from '@/components/Skeleton'; // Import Skeleton component

interface Series {
  name: string;
  slug: string;
  imageUrl: string;
}

const HomePage = () => {
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const heroImageUrl = "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true); // Set loading to true before fetch
        const productsData = await getProducts(); // Use the new API function
        console.log("Products Data:", productsData);
        setNewArrivals(productsData.slice(0, 4)); // Take first 4 for new arrivals
        // For series, we'll extract unique series names and create slugs
        const uniqueSeries = Array.from(new Set(productsData.map((p: Product) => p.seriesName)))
          .map(name => ({
            name,
            slug: (name as string).toLowerCase().replace(/ /g, '-'),
            imageUrl: productsData.find((p: Product) => p.seriesName === name)?.imageUrl || '' // Use an image from a product in that series
          }));
        setSeries(uniqueSeries);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false); // Set loading to false after fetch (or error)
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="bg-white">
      <main>
        {/* Hero Section */}
        <section className="relative h-[60vh] w-full">
          <img
            src={heroImageUrl}
            alt="Hero Background"
            className="brightness-50 object-cover w-full h-full"
          />
          <div className="absolute inset-0 z-10 flex h-full flex-col items-center justify-center text-center text-white">
            <h1 className="font-bebas-neue text-7xl md:text-9xl">YOUR COLLECTION AWAITS</h1>
            <Link to="/new">
              <button className="mt-8 rounded-full bg-[#BF40BF] px-10 py-4 text-lg font-bold text-white transition-transform duration-300 hover:scale-105">
                Shop New Arrivals
              </button>
            </Link>
          </div>
        </section>

        {/* New Arrivals Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="mb-12 text-center font-bebas-neue text-4xl sm:text-5xl tracking-wider text-gray-900">Shin-Chaku! (New Arrivals)</h2>
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-80 w-full" />
                ))
              ) : (
                newArrivals.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))
              )}
            </div>
          </div>
        </section>

        {/* Shop by Series Section */}
        <section className="bg-gray-50 py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="mb-12 text-center font-bebas-neue text-4xl sm:text-5xl tracking-wider text-gray-900">Explore the Universes</h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-80 w-full" />
                ))
              ) : (
                series.map((s) => (
                  <Link to={`/category/${s.slug}`} key={s.slug}>
                    <div className="group relative h-80 w-full overflow-hidden rounded-lg shadow-lg">
                      <img
                        src={s.imageUrl}
                        alt={s.name}
                        className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 transition-all duration-300 ease-in-out group-hover:bg-opacity-50"></div>
                      <div className="relative z-10 flex h-full items-center justify-center">
                        <h3 className="font-bebas-neue text-3xl sm:text-4xl font-bold text-white">{s.name}</h3>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;