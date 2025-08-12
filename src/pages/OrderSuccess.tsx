// src/pages/OrderSuccess.tsx

import { Link } from 'react-router-dom';

export default function OrderSuccess() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-teal-50 text-center p-4 font-inter antialiased">
      <svg
        className="w-24 h-24 text-green-500 mb-6 animate-bounce-slow"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
      <h1 className="text-4xl font-extrabold text-green-800 mb-4">Order Placed Successfully!</h1>
      <p className="text-lg text-gray-600 mb-8 max-w-md">
        Thank you for your purchase. Your delicious cookies are on their way!
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/"
          className="px-6 py-3 bg-silver-300 text-white rounded-full font-bold shadow-lg hover:bg-stone-200 transition-transform hover:scale-105"
        >
          Continue Shopping
        </Link>
        {/* You might add a link to an "Order History" page here later */}
        {/* <Link
          to="/order-history"
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-full font-bold shadow-md hover:bg-gray-300 transition-transform hover:scale-105"
        >
          View Order Details
        </Link> */}
      </div>
    </main>
  );
}