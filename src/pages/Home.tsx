// src/pages/Home.tsx
import { useState } from 'react';
import { cookies as cookieList, type CookieData } from '../data/cookies'; // Importing from your data file
import { useCart } from '../context/CartContext';
import { FaInstagram, FaTwitter, FaFacebook } from 'react-icons/fa'; // Ensure react-icons is installed
import { Link } from 'react-router-dom';

// Importing the separate components Use NavBar as per your component name
import Hero from '../components/Hero';
import CookieCard from '../components/CookieCard';
import CookieDetailsModal from '../components/CookieDetailModal';


export default function Home() {
  const { cart, setCart } = useCart();
  const [selectedCookie, setSelectedCookie] = useState<CookieData | null>(null);

  const handleQuantityChange = (cookieId: string, newQuantity: number) => {
    setCart(currentCart => {
      const updatedCart = { ...currentCart };
      if (newQuantity > 0) {
        updatedCart[cookieId] = newQuantity;
      } else {
        delete updatedCart[cookieId]; // Remove from cart if quantity is 0
      }
      return updatedCart;
    });
  };

  return (
    <div className="font-inter antialiased">
    
      {/* Hero component */}
      <Hero />

      {/* Main content for cookie gallery */}
      <main id="cookie-gallery-section" className="py-16 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        {/* Floral/Decorative elements */}
        <div className="absolute top-10 left-10 w-24 h-24 bg-pink-100 rounded-full opacity-50 blur-xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-teal-100 rounded-full opacity-50 blur-xl animate-pulse-slow delay-500"></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 bg-blue-100 rounded-full opacity-50 blur-xl animate-pulse-slow delay-1000"></div>

        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-12">Our Signature Collection</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 sm:gap-8">
            {cookieList.map(cookie => ( // Using imported 'cookieList'
              <CookieCard
                key={cookie.id}
                cookie={cookie}
                quantity={cart[cookie.id] || 0}
                onChange={(newQty) => handleQuantityChange(cookie.id, newQty)}
                onShowDetails={() => setSelectedCookie(cookie)}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Cookie Details Modal */}
      <CookieDetailsModal
        cookie={selectedCookie}
        onClose={() => setSelectedCookie(null)}
      />

      {/* FOOTER SECTION - START */}
      <footer className="w-full bg-gray-800 text-gray-300 py-12 px-4 sm:px-6 lg:px-8 font-inter antialiased">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 text-center md:text-left">
          {/* Section 1: Brand Info */}
          <div>
            <h3 className="font-bold text-2xl text-white mb-4">Cookie Gallery</h3>
            <p className="text-sm leading-relaxed">
              Indulge in handcrafted delights. We bake with passion, using only the finest ingredients to bring you a taste of pure joy.
            </p>
            <p className="text-xs mt-4 opacity-75">FSSAI Lic No. 12345678901234</p>
            <p className="text-xs opacity-75">© {new Date().getFullYear()} Cookie Gallery. All Rights Reserved.</p>
            <p className="text-sm mt-3">Made with <span className="text-red-400">♥</span> in Hyderabad.</p>
          </div>

          {/* Section 2: Quick Links */}
          <div>
            <h3 className="font-bold text-2xl text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-teal-400 transition-colors">Home</Link></li>
              <li><Link to="/checkout" className="hover:text-teal-400 transition-colors">Checkout</Link></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-teal-400 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Section 3: Stay Connected & Socials */}
          <div className="flex flex-col items-center md:items-end">
            <h3 className="font-bold text-2xl text-white mb-4">Stay Connected</h3>
            <form className="flex w-full max-w-sm rounded-lg overflow-hidden border border-gray-600 mb-6 shadow-md">
              <input
                type="email"
                placeholder="Your email for sweet deals"
                className="w-full px-4 py-2 bg-gray-700 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400 flex-grow"
              />
              <button
                type="submit"
                className="bg-teal-600 text-white px-4 py-2 font-semibold hover:bg-teal-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
            <div className="flex items-center gap-5">
              <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-pink-400 transition-colors text-3xl"><FaInstagram /></a>
              <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-blue-400 transition-colors text-3xl"><FaTwitter /></a>
              <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-blue-600 transition-colors text-3xl"><FaFacebook /></a>
            </div>
          </div>
        </div>
        <div className="text-center mt-10 border-t border-gray-700 pt-6">
          <p className="text-sm opacity-60">
            "Life is what you bake it!"
          </p>
        </div>
      </footer>
      {/* FOOTER SECTION - END */}
    </div>
  );
}