import { motion, AnimatePresence } from 'framer-motion';
import type { CookieData } from '../data/cookies';

type Props = { cookie: CookieData | null; onClose: () => void };

export default function CookieDetailsModal({ cookie, onClose }: Props) {
  if (!cookie) return null;
  return (
    <AnimatePresence>
      <motion.div
        key={cookie.id}
        className="fixed z-30 top-0 left-0 w-full h-full bg-black/60 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-lg shadow-2xl p-6 w-80"
          initial={{ scale: 0.9, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0 }}
          onClick={e => e.stopPropagation()}
        >
          <img src={cookie.src} alt={cookie.name} className="w-24 h-24 mx-auto object-contain" />
          <h2 className="text-xl font-bold mt-3 text-yellow-800">{cookie.name}</h2>
          <p className="text-base text-gray-600 mt-2 mb-4">{cookie.description}</p>
          <div className="text-lg font-semibold text-red-600">₹{cookie.price}</div>
          <button
            className="mt-5 w-full bg-yellow-300 text-white-800 font-bold py-2 rounded-lg hover:bg-yellow-400"
            onClick={onClose}
          >Close</button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
