
import { Link } from 'react-router-dom';
import { FaCookieBite } from 'react-icons/fa';

export default function NavBar() {
  return (
    <nav className="bg-white shadow-md py-4 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-50 font-inter antialiased">
      {/* Logo and Site Title */}
      <div className="flex items-center space-x-2">
        <FaCookieBite className="text-teal-600 text-3xl" /> {/* Icon for cookie */}
        <Link to="/" className="text-2xl font-extrabold text-gray-800 hover:text-teal-700 transition-colors">
        Cookie Gallery 🍪
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center space-x-2 sm:space-x-4"> {/* Adjusted spacing for smaller screens */}
        <Link
          to="/"
          className="px-5 py-2 sm:px-4 sm:py-2 rounded-full text-gray-700 hover:bg-orange-200 hover:text-teal-800 font-medium transition-all duration-200 text-base sm:text-lg"
        >
          Home
        </Link>
        <Link
          to="/checkout"
          className="px-3 py-2 sm:px-4 sm:py-2 rounded-full text-gray-700 hover:bg-orange-200 hover:text-teal-800 font-medium transition-all duration-200 text-base sm:text-lg"
        >
          Checkout
        </Link>
          <div className="flex items-center space-x-2">
          <Link
            to="/signed-out"
            className="px-5 py-2 sm:px-4 sm:py-2 rounded-full text-gray-700 hover:bg-orange-200 hover:text-teal-800 font-medium transition-all duration-200 text-base sm:text-lg"
          >
            SignOut
          </Link>
        </div>
      </div>
    </nav>
  );
}