// src/components/CookieCard.tsx

import React from 'react';
import { formatPrice } from '../utils/formatPrice';
import type { CookieData } from '../data/cookies'; // Assuming CookieData type is defined in data/cookies.ts

interface CookieCardProps {
  cookie: CookieData;
  quantity: number;
  onChange: (newQty: number) => void;
  onShowDetails: () => void;
}

const CookieCard: React.FC<CookieCardProps> = ({ cookie, quantity, onChange, onShowDetails }) => {
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
      <div className="flex items-center justify-center space-x-2 mb-4">
        <button
          onClick={() => onChange(quantity - 1)}
          className="bg-gray-200 text-white-600 rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold hover:bg-pink-200 transition-colors"
          aria-label="Decrease quantity"
        >
          -
        </button>
        <span className="text-xl font-bold text-gray-800 w-8 text-center">{quantity}</span>
        <button
          onClick={() => onChange(quantity + 1)}
          className="bg-teal-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold hover:bg-teal-700 transition-colors"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      {/* Details Button */}
      <button
        onClick={onShowDetails}
        className="text-sm text-stone-300 hover:underline transition-colors font-semibold"
      >
        View Details
      </button>
    </div>
  );
};

export default CookieCard;