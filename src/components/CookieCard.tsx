// src/components/CookieCard.tsx

import React from 'react';
import { formatPrice } from '../utils/formatPrice';
import type { CookieData } from '../data/cookies';

interface CookieCardProps {
  cookie: CookieData;
  quantity: number;
  onChange: (newQty: number) => void;
  onShowDetails: () => void;
}

const CookieCard: React.FC<CookieCardProps> = ({ cookie, quantity, onChange, onShowDetails }) => {
  const maxQuantity = 10;
  const isMaxQuantity = quantity >= maxQuantity;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl hover:scale-105 border border-gray-100">
      {/* Cookie Image */}
      <img
        src={cookie.src} // Uses the src from the cookie data
        alt={cookie.name}
        className="w-40 h-40 sm:w-48 sm:h-48 object-cover rounded-xl mb-4 shadow-md bg-gray-50 p-2"
        onError={(e) => { (e.target as HTMLImageElement).onerror = null; (e.target as HTMLImageElement).src = 'https://placehold.co/192x192/E0E0E0/616161?text=No+Image'; }} // Fallback
      />

      {/* Cookie Name and Price */}
      <h3 className="text-xl font-bold text-gray-800 mb-1">{cookie.name}</h3>
      <p className="text-lg font-semibold text-teal-700 mb-3">{formatPrice(cookie.price)}</p>

      {/* Quantity Controls */}
      <div className="flex items-center justify-center space-x-2 mb-2"> {/* Fix: Changed mb-4 to mb-2 to make space for the new message */}
        <button
          onClick={() => onChange(quantity - 1)}
          className={`bg-ocean-200 text-white-100 rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold transition-colors
            ${quantity > 0 ? 'hover:bg-orange-200' : 'cursor-not-allowed opacity-50'}`}
          aria-label="Decrease quantity"
          disabled={quantity <= 0}
        >
          -
        </button>
        <span className="text-xl font-bold text-gray-800 w-8 text-center">{quantity}</span>
        <button
          onClick={() => onChange(quantity + 1)}
          className={`text-white rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold transition-colors
            ${isMaxQuantity ? 'bg-gray-400 cursor-not-allowed opacity-50' : 'bg-teal-600 hover:bg-teal-700'}`}
          aria-label="Increase quantity"
          disabled={isMaxQuantity}
        >
          +
        </button>
      </div>
      
      {/* Optional message when max quantity is reached */}
      {isMaxQuantity && (
        <p className="text-sm text-rose-500 font-medium animate-pulse">Max quantity reached!</p>
      )}

      {/* Details Button */}
      <button
        onClick={onShowDetails}
        className="text-sm text-stone-300 hover:underline transition-colors mt-2 font-semibold"
      >
        View Details
      </button>
    </div>
  );
};

export default CookieCard;