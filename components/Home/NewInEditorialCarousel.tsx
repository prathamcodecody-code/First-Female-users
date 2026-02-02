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
    <section className="mt-20 md:mt-32 px-4 md:px-10 max-w-[1440px] mx-auto">
      {title && (
        <div className="mb-8 md:mb-12">
          <h2 className="text-3xl md:text-6xl font-serif italic text-brandBlack tracking-tight">
            {title}
          </h2>
          <div className="h-1 w-16 md:w-20 bg-brandPink mt-2 md:mt-4" />
        </div>
      )}

      <motion.div
        animate={{ backgroundColor: slide.bgColor || "#F9F9F9" }}
        className="relative h-[400px] md:h-[600px] rounded-2xl overflow-hidden shadow-2xl shadow-black/5 flex flex-row"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="flex flex-row items-center h-full w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* LEFT SIDE: Image Content */}
            <div className="w-1/2 md:w-3/5 h-full relative p-4 md:p-0">
              {imageUrl ? (
                <motion.img
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={imageUrl}
                  alt=""
                  // Changed object-cover to object-contain to prevent cropping
                  className="w-full h-full object-contain md:object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 animate-pulse" />
              )}
              
              {/* Overlay Text - Hidden on very small screens for clarity */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent flex flex-col justify-end p-4 md:p-10 pointer-events-none">
                <p className="text-white/90 uppercase tracking-[0.3em] text-[8px] md:text-[10px] mb-1">Featured</p>
                <h3 className="text-white text-lg md:text-5xl font-black uppercase tracking-tighter leading-none italic font-serif">
                   {slide.title || "The New Season"}
                </h3>
              </div>
            </div>

            {/* RIGHT SIDE: Product Card */}
            <div className="w-1/2 md:w-2/5 flex items-center justify-center p-2 md:p-12 bg-white/10 backdrop-blur-sm">
              {product ? (
                // scale-90 on mobile makes the ProductCard fit better side-by-side
                <div className="w-full max-w-[160px] md:max-w-[320px] scale-[0.85] md:scale-100 transform transition-transform duration-500">
                  <ProductCard product={product} />
                </div>
              ) : (
                <div className="w-[120px] md:w-[280px] aspect-[3/4] bg-white/50 rounded-lg animate-pulse" />
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* NAVIGATION DOTS */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-1 transition-all duration-300 rounded-full ${active === i ? "w-8 bg-brandPink" : "w-4 bg-black/20"}`}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
