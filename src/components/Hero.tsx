// src/components/Hero.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom'; // Or a scroll-to link
import { FaArrowRight } from 'react-icons/fa';
import heroImage from '../assets/Hero-cookie-platter.jpg'; // IMPORTANT: Ensure this path is correct and image exists

export default function Hero() {
  return (
    <section className="w-full bg-gradient-to-b from-blue-50 via-gray-50 to-white pt-16 pb-20 font-inter antialiased">
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
          <p className="mt-6 font-semibold align text-lg text-gray-600 max-w-md mx-auto md:mx-0">
            Indulge in our exquisite collection of handcrafted cookies, made with love and the finest locally-sourced ingredients for a truly unforgettable treat.
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

        {/* Image Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex justify-center"
        >
          <img 
            src={heroImage} 
            alt="A delicious platter of assorted cookies" 
            className="w-full max-w-md md:max-w-full rounded-2xl shadow-2xl object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}