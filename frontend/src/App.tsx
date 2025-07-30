import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/page';
import AboutPage from './pages/about/page';
import CartPage from './pages/cart/page';
import CategoryPage from './pages/category/slug/page';
import LoginPage from './pages/(auth)/login/page';
import RegisterPage from './pages/(auth)/register/page';
import ProductPage from './pages/product/id/page';
import ProfilePage from './pages/profile/page';
import WishlistPage from './pages/wishlist/page';
import LayoutWrapper from './components/LayoutWrapper';
import PlaceholderPage from './pages/PlaceholderPage';

const App = () => {
  return (
    <LayoutWrapper>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/new" element={<PlaceholderPage title="New Arrivals" />} />
        <Route path="/apparel" element={<PlaceholderPage title="Apparel" />} />
        <Route path="/collectibles" element={<PlaceholderPage title="Collectibles" />} />
        <Route path="/products" element={<PlaceholderPage title="All Products" />} />
        <Route path="/careers" element={<PlaceholderPage title="Careers" />} />
        <Route path="/press" element={<PlaceholderPage title="Press" />} />
        <Route path="/contact" element={<PlaceholderPage title="Contact Us" />} />
        <Route path="/faq" element={<PlaceholderPage title="FAQ" />} />
        <Route path="/shipping" element={<PlaceholderPage title="Shipping & Returns" />} />
        <Route path="/terms" element={<PlaceholderPage title="Terms of Service" />} />
        <Route path="/privacy" element={<PlaceholderPage title="Privacy Policy" />} />
        <Route path="/forgot-password" element={<PlaceholderPage title="Forgot Password" />} />
      </Routes>
    </LayoutWrapper>
  );
};

export default App;
