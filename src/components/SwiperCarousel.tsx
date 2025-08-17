import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, A11y } from 'swiper/modules';

export type CarouselItem = { id: string; image: string; title?: string; subtitle?: string; caption?: string };

export default function SwiperCarousel({ items }: { items: CarouselItem[] }) {
  return (
    <Swiper
      modules={[Navigation, Pagination, A11y]}
      navigation
      pagination={{ clickable: true }}
      spaceBetween={16}
      slidesPerView={1}
      breakpoints={{ 640: { slidesPerView: 1 }, 768: { slidesPerView: 1 }, 1024: { slidesPerView: 1 } }}
      style={{ '--swiper-navigation-color': '#0f766e', '--swiper-pagination-color': '#0f766e' } as any}
      className="rounded-2xl shadow-xl overflow-hidden"
    >
      {items.map((it) => (
        <SwiperSlide key={it.id}>
          <div className="relative w-full aspect-[16/9] sm:aspect-[16/9] md:aspect-[16/7] bg-black">
            <img src={it.image} alt={it.title || 'slide'} className="absolute inset-0 w-full h-full object-cover [image-rendering:auto]" />
            {(it.title || it.subtitle || it.caption) && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 text-white">
                <div className="text-lg font-bold">{it.title}</div>
                <div className="text-sm opacity-90">{it.subtitle}</div>
                <div className="text-xs opacity-80 mt-1">{it.caption}</div>
              </div>
            )}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

