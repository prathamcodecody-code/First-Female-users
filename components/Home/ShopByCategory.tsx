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
  img2?: string | null; // Ensure img2 is in your type
};

interface Props {
  title: string;
  products: Product[];
  exploreLink: string;
}

// 1. Create a sub-component to handle individual product card state
function FeaturedProductCard({ product, index }: { product: Product; index: number }) {
  const [currentImg, setCurrentImg] = useState(1);
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

  const baseImgUrl = `${process.env.NEXT_PUBLIC_API_URL}/uploads/products/`;
  const img1 = product.img1 ? `${baseImgUrl}${product.img1}` : "/placeholder.png";
  const img2 = product.img2 ? `${baseImgUrl}${product.img2}` : null;
  const productUrl = `/products/${product.slug}-${product.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      viewport={{ once: true }}
      className="group"
      onMouseEnter={() => {
        if (img2) {
          stopInterval();
          setCurrentImg(2);
        }
      }}
      onMouseLeave={() => {
        if (img2) {
          setCurrentImg(1);
          startInterval();
        }
      }}
    >
      <Link href={productUrl}>
        {/* IMAGE CONTAINER */}
        <div className="relative aspect-[3/4] bg-brandCream overflow-hidden rounded-sm">
          {/* PRIMARY IMAGE */}
          <img
            src={img1}
            alt={product.title}
            className={`absolute inset-0 w-full h-full object-contain p-2 transition-all duration-1000 ease-in-out 
              ${currentImg === 1 ? "opacity-100 scale-100" : "opacity-0 scale-105"}`}
          />

          {/* SECONDARY IMAGE */}
          {img2 && (
            <img
              src={img2}
              alt={`${product.title} alternate`}
              className={`absolute inset-0 w-full h-full object-contain p-2 transition-all duration-1000 ease-in-out
                ${currentImg === 2 ? "opacity-100 scale-100" : "opacity-0 scale-105"}`}
            />
          )}

          {/* OPTIONAL: DOT INDICATORS */}
          {img2 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className={`h-1 w-3 rounded-full ${currentImg === 1 ? "bg-brandPink" : "bg-gray-300"}`} />
              <div className={`h-1 w-3 rounded-full ${currentImg === 2 ? "bg-brandPink" : "bg-gray-300"}`} />
            </div>
          )}
        </div>

        {/* INFO */}
        <div className="mt-4 space-y-1">
          <p className="text-sm font-medium text-brandBlack line-clamp-2 group-hover:text-brandPink transition-colors">
            {product.title}
          </p>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-brandBlack">
              ₹{product.finalPrice.toLocaleString()}
            </span>
            {product.finalPrice < product.price && (
              <span className="text-xs text-gray-400 line-through">
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
    <section className="py-20 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10">
        {/* SECTION HEADING */}
        <div className="text-center mb-14">
          <h2 className="text-2xl md:text-3xl font-light uppercase tracking-ultra text-brandBlack">
            {title}
          </h2>
          <div className="w-24 h-[1px] bg-brandPink mx-auto mt-4 opacity-50" />
        </div>

        {/* PRODUCTS GRID */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {products.slice(0, 4).map((product, index) => (
            <FeaturedProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* EXPLORE ALL */}
        <div className="mt-16 text-center">
          <Link href={exploreLink}>
            <button className="px-16 py-4 border border-brandBlack text-xs font-bold uppercase tracking-boutique hover:bg-brandBlack hover:text-white transition-all duration-300 rounded-sm">
              Explore All
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
