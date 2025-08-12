// src/pages/Signout.tsx

import { Link } from "react-router-dom";
import { FaCookieBite, FaRegSmileBeam } from "react-icons/fa";

export default function SignedOut() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-yellow-50 via-pink-50 to-white p-6">
      {/* Cookie emoji or SVG */}
      <div className="mb-6">
        <FaCookieBite size={72} className="text-yellow-500 drop-shadow-md" />
      </div>

      {/* Dynamic Title */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-800 text-center mb-4 drop-shadow">
        Leaving So Soon?
      </h1>
      
      <p className="text-lg text-pink-700 text-center mb-8 font-bold">
        We hope you enjoyed your visit!<br />
        <span className="inline-flex items-center gap-1">
          Come back whenever you crave! <FaRegSmileBeam className="inline text-pink-400" size={22} />
        </span>
      </p>
      
      {/* Action Button */}
      <div className="flex flex-col sm:flex-row gap-4 mt-4">
        <Link
          to="/signin"
          className="bg-stone-200 hover:bg-pink-200 text-white font-bold px-6 py-3 rounded-full shadow-lg text-lg transition-all duration-200"
        >
          Sign In Again
        </Link>
      </div>

      <div className="mt-12 text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} Cookie Gallery &ndash; Made with <span className="text-pink-400">♥</span> in Hyderabad
      </div>
    </main>
  );
}
