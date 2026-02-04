"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

type Product = {
  id: number;
  title: string;
  slug: string;
  price: number;
  finalPrice: number;
  img1?: string | null;
  img2?: string | null;
};

interface Props {
  title: string;
  products: Product[];
  exploreLink: string;
}

function FeaturedProductCard({ product, index }: { product: Product; index: number }) {
  const [currentImg, setCurrentImg] = useState(1);
  const [rotate, setRotate] = useState({ x: 0, y: 0 }); // 3D Tilt State
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startInterval = () => {
    if (!product.img2) return;
    intervalRef.current = setInterval(() => {
      setCurrentImg((prev) => (prev === 1 ? 2 : 1));
    }, 3000);
  };

  const stopInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  useEffect(() => {
    startInterval();
    return () => stopInterval();
  }, [product.img2]);

  // ---------- TILT HANDLERS ----------
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    const centerX = box.width / 2;
    const centerY = box.height / 2;

    // Calculate rotation (max 8-10 degrees tilt for premium feel)
    const rotateX = (y - centerY) / 12;
    const rotateY = (centerX - x) / 12;

    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => {
    if (product.img2) {
      stopInterval();
      setCurrentImg(2);
    }
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 }); // Reset tilt
    if (product.img2) {
      setCurrentImg(1);
      startInterval();
    }
  };

  const baseImgUrl = `${process.env.NEXT_PUBLIC_API_URL}/uploads/products/`;
  const img1 = product.img1 ? `${baseImgUrl}${product.img1}` : "/placeholder.png";
  const img2 = product.img2 ? `${baseImgUrl}${product.img2}` : null;
  const productUrl = `/products/${product.slug}-${product.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      viewport={{ once: true }}
      className="group perspective-1000" // Required for 3D Perspective
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: "1000px" }}
    >
      <Link href={productUrl}>
        {/* IMAGE CONTAINER */}
        <div 
          className="relative aspect-[3/4] bg-brandCream overflow-hidden rounded-sm transition-transform duration-200 ease-out group-hover:shadow-2xl shadow-sm"
          style={{ 
            transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale(1.02)`,
            transformStyle: "preserve-3d" 
          }}
        >
          {/* PRIMARY IMAGE */}
          <img
            src={img1}
            alt={product.title}
            className={`absolute inset-0 w-full h-full object-contain p-4 transition-all duration-1000 ease-in-out 
              ${currentImg === 1 ? "opacity-100 scale-100" : "opacity-0 scale-105"}`}
          />

          {/* SECONDARY IMAGE */}
          {img2 && (
            <img
              src={img2}
              alt={`${product.title} alternate`}
              className={`absolute inset-0 w-full h-full object-contain p-4 transition-all duration-1000 ease-in-out
                ${currentImg === 2 ? "opacity-100 scale-100" : "opacity-0 scale-105"}`}
            />
          )}

          {/* PROGRESS INDICATORS */}
          {img2 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className={`h-0.5 w-4 rounded-full transition-all ${currentImg === 1 ? "bg-brandPink" : "bg-white/50"}`} />
              <div className={`h-0.5 w-4 rounded-full transition-all ${currentImg === 2 ? "bg-brandPink" : "bg-white/50"}`} />
            </div>
          )}

          {/* DISCOUNT BADGE */}
          {product.finalPrice < product.price && (
            <span className="absolute top-4 left-4 z-10 bg-brandBlack text-white text-[9px] px-2 py-1 font-black uppercase tracking-widest shadow-lg">
              Sale
            </span>
          )}
        </div>

        {/* INFO AREA */}
        <div className="mt-5 space-y-2 px-1 transition-transform duration-300 group-hover:translate-y-[-2px]">
          <h3 className="text-xs font-bold text-brandBlack uppercase tracking-widest line-clamp-1 group-hover:text-brandPink transition-colors">
            {product.title}
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-sm font-black text-brandBlack italic font-serif">
              ₹{product.finalPrice.toLocaleString()}
            </span>
            {product.finalPrice < product.price && (
              <span className="text-[11px] text-gray-400 line-through font-medium tracking-tighter">
                ₹{product.price.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function FeaturedProductSection({
  title,
  products,
  exploreLink,
}: Props) {
  if (!products || products.length === 0) return null;

  return (
    <section className="py-24 bg-[#FCFAFA]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10">
        {/* SECTION HEADING */}
        <div className="mb-16">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-brandPink mb-3 text-center">Curated Picks</p>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-brandBlack italic font-serif text-center">
            {title}
          </h2>
          <div className="w-16 h-1 bg-brandPink mx-auto mt-6" />
        </div>

        {/* PRODUCTS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
          {products.slice(0, 4).map((product, index) => (
            <FeaturedProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* EXPLORE ALL */}
        <div className="mt-20 text-center">
          <Link href={exploreLink}>
            <button className="px-12 py-5 bg-brandBlack text-white text-[11px] font-black uppercase tracking-[0.4em] hover:bg-brandPink transition-all duration-500 rounded-sm shadow-2xl active:scale-95">
              Enter The Gallery
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
