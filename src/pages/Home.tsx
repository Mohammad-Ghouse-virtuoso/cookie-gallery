// src/pages/Home.tsx

import React, { useState, useEffect } from 'react';
import { cookies as cookieList, type CookieData } from '../data/cookies';
import { useCart } from '../context/CartContext';
import { FaInstagram, FaTwitter, FaFacebook } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom'; // <--- ADDED: useLocation to check for dialog parameter
import { useAuth } from '../context/AuthContext';

import Hero from '../components/Hero';
import CookieCard from '../components/CookieCard';
import CookieDetailsModal from '../components/CookieDetailModal';

export default function Home() {
  const { cart, setCart } = useCart();
  const { user } = useAuth();
  const location = useLocation(); // <--- ADDED: Hook to access URL parameters

  const [selectedCookie, setSelectedCookie] = useState<CookieData | null>(null);
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);

  useEffect(() => {
    // Check if the URL has a 'fromLogin' parameter to trigger the dialog
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('fromLogin') === 'true' && user && !user.isAnonymous) {
      setShowWelcomeDialog(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]); // Re-run effect if user changes

  const handleQuantityChange = (cookieId: string, newQuantity: number) => {
    setCart(currentCart => {
      const updatedCart = { ...currentCart };
      if (newQuantity > 0) {
        updatedCart[cookieId] = newQuantity;
      } else {
        delete updatedCart[cookieId];
      }
      return updatedCart;
    });
  };

  return (
    <div className="font-inter antialiased">
      {/* Welcome Dialog Box - Now triggered by URL param */}
      {showWelcomeDialog && user && !user.isAnonymous && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center p-6 z-50">
          <div className="bg-white p-8 rounded-3xl shadow-xl text-center space-y-4 relative w-full max-w-md">
            <h3 className="text-3xl font-extrabold text-gray-800">Welcome, {user.displayName || user.email || "Cookie Lover"}!</h3>
            <p className="text-lg text-gray-600">We're so happy to have you back.</p>
            <button
              onClick={() => setShowWelcomeDialog(false)}
              className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-6 rounded-xl shadow-lg transition-all duration-200"
            >
              Start Shopping
            </button>
          </div>
        </div>
      )}
      
      <Hero />

      <main id="cookie-gallery-section" className="py-16 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        {/* ... decorative elements ... */}
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-12">Our Signature Collection</h2>
          <div className="flex justify-center my-8">
            {/* The decorative vertical line component goes here */}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 sm:gap-8">
            {cookieList.map(cookie => (
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
      
      <CookieDetailsModal
        cookie={selectedCookie}
        onClose={() => setSelectedCookie(null)}
      />
      {/* ... Footer ... */}
    </div>
  );
}