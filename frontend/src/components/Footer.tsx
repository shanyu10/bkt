import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 font-inter">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Column 1: Logo & Socials */}
          <div className="md:col-span-1">
            <Link to="/" className="font-bebas-neue text-3xl font-bold tracking-wider text-gray-900">
              BAK GUTEH
            </Link>
            <p className="mt-4 max-w-xs text-sm text-gray-600">
              Your one-stop marketplace for exclusive apparel and collectibles.
            </p>
            <div className="mt-6 flex space-x-4">
              <Link to="#" className="text-gray-500 hover:text-gray-800">
                <Facebook size={22} />
              </Link>
              <Link to="#" className="text-gray-500 hover:text-gray-800">
                <Instagram size={22} />
              </Link>
              <Link to="#" className="text-gray-500 hover:text-gray-800">
                <Twitter size={22} />
              </Link>
              <Link to="#" className="text-gray-500 hover:text-gray-800">
                <Youtube size={22} />
              </Link>
            </div>
          </div>

          {/* Column 2: Shop */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-800">Shop</h3>
            <ul className="mt-4 space-y-3">
              <li><Link to="/new" className="text-sm text-gray-600 hover:text-gray-900">New</Link></li>
              <li><Link to="/apparel" className="text-sm text-gray-600 hover:text-gray-900">Apparel</Link></li>
              <li><Link to="/collectibles" className="text-sm text-gray-600 hover:text-gray-900">Collectibles</Link></li>
              <li><Link to="/products" className="text-sm text-gray-600 hover:text-gray-900">All Products</Link></li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-800">Company</h3>
            <ul className="mt-4 space-y-3">
              <li><Link to="/about" className="text-sm text-gray-600 hover:text-gray-900">About Us</Link></li>
              <li><Link to="/careers" className="text-sm text-gray-600 hover:text-gray-900">Careers</Link></li>
              <li><Link to="/press" className="text-sm text-gray-600 hover:text-gray-900">Press</Link></li>
            </ul>
          </div>

          {/* Column 4: Support */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-800">Support</h3>
            <ul className="mt-4 space-y-3">
              <li><Link to="/contact" className="text-sm text-gray-600 hover:text-gray-900">Contact Us</Link></li>
              <li><Link to="/faq" className="text-sm text-gray-600 hover:text-gray-900">FAQ</Link></li>
              <li><Link to="/shipping" className="text-sm text-gray-600 hover:text-gray-900">Shipping & Returns</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="flex flex-col items-center justify-between sm:flex-row">
            <p className="text-xs text-gray-500">
              &copy; {new Date().getFullYear()} BAK GUTEH MARKET. All Rights Reserved.
            </p>
            <div className="mt-4 flex space-x-6 sm:mt-0">
              <Link to="/terms" className="text-xs text-gray-500 hover:text-gray-800">Terms of Service</Link>
              <Link to="/privacy" className="text-xs text-gray-500 hover:text-gray-800">Privacy Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
