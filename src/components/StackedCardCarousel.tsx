import { useState } from 'react';
import { motion } from 'framer-motion';

interface CardItem {
  id: string;
  image: string;
  title?: string;
  subtitle?: string;
  caption?: string;
}

export default function StackedCardCarousel({ items }: { items: CardItem[] }) {
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((i) => (i - 1 + items.length) % items.length);
  const next = () => setIndex((i) => (i + 1) % items.length);

  return (
    <div className="w-full max-w-3xl mx-auto relative select-none">
      <div className="h-64 sm:h-80 md:h-96 relative">
        {items.map((item, i) => {
          const offset = ((i - index + items.length) % items.length);
          const z = offset === 0 ? 30 : offset === 1 ? 20 : 10;
          const scale = offset === 0 ? 1 : offset === 1 ? 0.95 : 0.9;
          const x = offset === 0 ? 0 : offset === 1 ? -30 : -60;
          return (
            <motion.div
              key={item.id}
              className="absolute inset-0 rounded-2xl bg-white shadow-xl overflow-hidden border border-gray-100"
              style={{ zIndex: z }}
              initial={{ opacity: 0.6, scale: 0.9 }}
              animate={{ opacity: 1, scale, x }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            >
              <img src={item.image} alt={item.title || 'story'} className="w-full h-full object-cover" />
              {(item.title || item.subtitle || item.caption) && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-white">
                  <div className="text-lg font-bold">{item.title}</div>
                  <div className="text-sm opacity-90">{item.subtitle}</div>
                  <div className="text-xs opacity-80 mt-1">{item.caption}</div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="flex justify-between mt-4">
        <button onClick={prev} className="rounded-full w-10 h-10 flex items-center justify-center bg-white shadow hover:shadow-md border">‹</button>
        <div className="flex gap-2 items-center">
          {items.map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full ${i===index? 'bg-teal-600':'bg-gray-300'}`} />
          ))}
        </div>
        <button onClick={next} className="rounded-full w-10 h-10 flex items-center justify-center bg-white shadow hover:shadow-md border">›</button>
      </div>
    </div>
  );
}

