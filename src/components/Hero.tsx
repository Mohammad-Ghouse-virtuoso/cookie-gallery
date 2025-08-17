import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import heroImage from '../assets/Cookie-Hero Card.png'; // IMPORTANT: Ensure this path is correct and image exists

export default function Hero() {
  return (
    <section className="relative w-full bg-gradient-to-b from-blue-50 via-gray-50 to-white pt-16 pb-20 font-inter antialiased">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center md:text-left"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold text-zinc-700 leading-tight tracking-tighter">
            Handcrafted Cookies,
            <span className="block text-rose-600">Baked with Love 🩷</span>
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-md mx-auto md:mx-0">
            Indulge in our exquisite collection of handcrafted cookies, made with love and the finest ingredients.
          </p>
          <div className="mt-8">
            <Link
              to="#gallery" // This can be a link to scroll down or another page
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('cookie-gallery-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-3 bg-white text-teal-600 font-bold text-lg px-8 py-4 rounded-full shadow-lg hover:bg-blue-100 transition-transform hover:scale-105"
            >
              Explore Cookies <FaArrowRight />
            </Link>
          </div>
        </motion.div>

        {/* Image Content with Original (Subtle Rotate & Scale) Hover Style */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex justify-center"
        >
          <img 
            src={heroImage} 
            alt="A delicious platter of assorted cookies" 
            className={`
              w-full max-w-md md:max-w-full rounded-2xl object-cover
              transform origin-center
              shadow-[0_20px_60px_rgba(0,0,0,0.25)] ring-1 ring-white/40 rotate-3 transition-transform duration-500 ease-in-out hover:rotate-0 hover:scale-105
            `}
          />
        </motion.div>
      </div>

      {/* Subtle background shapes for visual appeal */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute w-64 h-64 bg-indigo-200 rounded-full opacity-20 -top-10 -left-10 blur-2xl"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-blue-200 rounded-full opacity-15 bottom-0 -right-20 blur-2xl"></div>
      </div>
    </section>
  );
}