'use client';

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCartStore, useAuthStore } from '@/lib/store';
import { User, Heart, ShoppingCart, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const { isLoggedIn, user, logout } = useAuthStore();

  useEffect(() => {
    setCartItemCount(useCartStore.getState().cartItems.length);

    const unsubscribe = useCartStore.subscribe(
      (state) => state.cartItems.length,
      (newLength) => setCartItemCount(newLength)
    );

    return () => unsubscribe();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="text-4xl font-bebas-neue tracking-widest text-gray-900">
          BKT
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center space-x-8 md:flex">
          <Link to="/new" className="font-inter text-sm font-medium text-gray-600 hover:text-gray-900">
            New
          </Link>
          <Link to="/apparel" className="font-inter text-sm font-medium text-gray-600 hover:text-gray-900">
            Apparel
          </Link>
          <Link to="/collectibles" className="font-inter text-sm font-medium text-gray-600 hover:text-gray-900">
            Collectibles
          </Link>
          <Link to="/about" className="font-inter text-sm font-medium text-gray-600 hover:text-gray-900">
            About
          </Link>
        </div>

        {/* Icons & Actions */}
        <div className="hidden items-center space-x-4 md:flex">
          <Link to="/profile" className="text-gray-600 hover:text-gray-900">
            <User size={24} />
          </Link>
          <Link to="/wishlist" className="text-gray-600 hover:text-gray-900">
            <Heart size={24} />
          </Link>
          <Link to="/cart" className="relative text-gray-600 hover:text-gray-900">
            <ShoppingCart size={24} />
            {cartItemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                {cartItemCount}
              </span>
            )}
          </Link>
          <div className="ml-4 flex items-center space-x-2">
            {isLoggedIn ? (
              <>
                <span className="text-sm font-medium text-gray-700">{user?.email}</span>
                <button
                  onClick={logout}
                  className="rounded-md border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="rounded-md border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100">
                  Login
                </Link>
                <Link to="/register" className="rounded-md bg-gray-900 px-3 py-1 text-sm font-medium text-white transition-colors hover:bg-gray-700">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden">
          <button onClick={toggleMenu} className="text-gray-600 hover:text-gray-900">
            <Menu size={28} />
          </button>
        </div>
      </div>

      {/* Mobile Slide-out Menu */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-sm transform bg-white shadow-lg transition-transform duration-300 ease-in-out md:hidden ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="font-inter text-lg font-semibold">Menu</h2>
          <button onClick={toggleMenu} className="text-gray-600 hover:text-gray-900">
            <X size={28} />
          </button>
        </div>
        <div className="flex flex-col space-y-6 p-6">
          <Link to="/new" className="font-inter text-lg text-gray-700 hover:text-gray-900" onClick={toggleMenu}>
            New
          </Link>
          <Link to="/apparel" className="font-inter text-lg text-gray-700 hover:text-gray-900" onClick={toggleMenu}>
            Apparel
          </Link>
          <Link to="/collectibles" className="font-inter text-lg text-gray-700 hover:text-gray-900" onClick={toggleMenu}>
            Collectibles
          </Link>
          <Link to="/about" className="font-inter text-lg text-gray-700 hover:text-gray-900" onClick={toggleMenu}>
            About
          </Link>
          <Link to="/login" className="rounded-md border border-gray-300 px-3 py-1 text-lg font-medium text-gray-700 transition-colors hover:bg-gray-100" onClick={toggleMenu}>
            Login
          </Link>
          <Link to="/register" className="rounded-md bg-gray-900 px-3 py-1 text-lg font-medium text-white transition-colors hover:bg-gray-700" onClick={toggleMenu}>
            Register
          </Link>
          <div className="border-t pt-6">
            <div className="flex items-center justify-around">
              <Link to="/profile" className="text-gray-600 hover:text-gray-900" onClick={toggleMenu}>
                <User size={28} />
              </Link>
              <Link to="/wishlist" className="text-gray-600 hover:text-gray-900" onClick={toggleMenu}>
                <Heart size={28} />
              </Link>
              <Link to="/cart" className="relative text-gray-600 hover:text-gray-900" onClick={toggleMenu}>
                <ShoppingCart size={28} />
                {cartItemCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </div>
      {isMenuOpen && <div className="fixed inset-0 z-40 bg-black bg-opacity-25 md:hidden" onClick={toggleMenu}></div>}
    </nav>
  );
};

export default Navbar;
