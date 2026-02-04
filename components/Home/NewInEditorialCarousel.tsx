"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { api } from "@/lib/api";

export default function EditorialCarousel({
  title,
  items = [],
}: {
  title?: string;
  items?: any[];
}) {
  const [products, setProducts] = useState<Record<number, any>>({});
  const [mediaMap, setMediaMap] = useState<Record<number, string>>({});
  const [active, setActive] = useState(0);

  if (!Array.isArray(items) || items.length === 0) return null;

  /* ---------------- Data Fetching ---------------- */
  useEffect(() => {
    const productIds = items.map(i => i.productId).filter(Boolean);
    api.get("/products", { params: { ids: productIds.join(",") } }).then(res => {
      const map: any = {};
      res.data.products?.forEach((p: any) => { map[p.id] = p; });
      setProducts(map);
    });
  }, [items]);

  useEffect(() => {
    const mediaIds = items.map(i => i.mediaId).filter(Boolean);
    if (!mediaIds.length) return;
    api.get("/media", { params: { ids: mediaIds.join(",") } }).then(res => {
      const map: Record<number, string> = {};
      res.data.forEach((m: any) => { map[m.id] = m.url; });
      setMediaMap(map);
    });
  }, [items]);

  /* ---------------- Autoplay ---------------- */
  useEffect(() => {
    const timer = setInterval(() => setActive(p => (p + 1) % items.length), 6000);
    return () => clearInterval(timer);
  }, [items.length]);

  const slide = items[active];
  const product = products[slide.productId];
  const imageUrl = slide.mediaId && mediaMap[slide.mediaId]
    ? `${process.env.NEXT_PUBLIC_API_URL}${mediaMap[slide.mediaId]}`
    : null;

  return (
    <section className="mt-12 md:mt-32 px-2 md:px-10 max-w-[1440px] mx-auto">
      {title && (
        <div className="mb-6 md:mb-12 px-2 md:px-0">
          <h2 className="text-2xl md:text-6xl font-serif italic text-brandBlack tracking-tight">
            {title}
          </h2>
          <div className="h-1 w-12 md:w-20 bg-brandPink mt-2 md:mt-4" />
        </div>
      )}

      <motion.div
        animate={{ backgroundColor: slide.bgColor || "#F9F9F9" }}
        /* Force flex-row on mobile to keep items side-by-side */
        className="relative h-[350px] sm:h-[450px] md:h-[650px] rounded-2xl overflow-hidden shadow-2xl shadow-black/5 flex flex-row"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="flex flex-row items-stretch h-full w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* LEFT SIDE: Editorial Image - NO CROPPING */}
            <div className="w-1/2 md:w-3/5 relative bg-white/20">
              {imageUrl ? (
                <motion.img
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={imageUrl}
                  alt=""
                  /* KEY FIX: object-contain prevents cropping. 
                     h-full ensures it scales to the container height */
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 animate-pulse" />
              )}
              
              {/* Responsive Text Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex flex-col justify-end p-3 md:p-14 pointer-events-none">
                <p className="text-white/90 uppercase tracking-[0.2em] text-[7px] md:text-xs mb-1 font-black">
                  Featured
                </p>
                <h3 className="text-white text-sm md:text-6xl font-black uppercase tracking-tighter leading-tight italic font-serif">
                  {slide.title || "The New Season"}
                </h3>
              </div>
            </div>

            {/* RIGHT SIDE: Product Card */}
            <div className="w-1/2 md:w-2/5 flex items-center justify-center p-2 sm:p-4 md:p-16 bg-white/40 backdrop-blur-md border-l border-white/10">
              {product ? (
                /* scale down on mobile to ensure the full card fits side-by-side */
                <div className="w-full max-w-full scale-[0.9] sm:scale-100 transition-transform duration-500 hover:scale-[1.02]">
                  <ProductCard product={product} />
                </div>
              ) : (
                <div className="w-[100px] md:w-[340px] aspect-[3/4] bg-white/80 rounded-xl animate-pulse shadow-sm" />
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* NAVIGATION DOTS - Smaller for mobile */}
        <div className="absolute bottom-3 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 md:gap-3 z-30">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-1 md:h-1.5 transition-all duration-300 rounded-full ${
                active === i 
                  ? "w-6 md:w-10 bg-brandPink" 
                  : "w-3 md:w-5 bg-black/10 hover:bg-black/30"
              }`}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
