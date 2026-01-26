"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import { api } from "@/lib/api";

type Product = {
  id: number;
  title: string;
  slug: string;
  price: number;
  finalPrice: number;
  img1?: string | null;
};

const EDITORIAL_SLIDES = [
  {
    id: 1,
    productId: 32,
    modelImage: "/editorial/newin-1.png",
    bgColor: "#FDF2F2",
    accent: "NEW IN!"
  },
  {
    id: 2,
    productId: 31,
    modelImage: "/editorial/newin-2.png",
    bgColor: "#F0F4FF",
    accent: "TRENDING"
  },
  {
    id: 3,
    productId: 30,
    modelImage: "/editorial/newin-3.png",
    bgColor: "#F9F6F0",
    accent: "MUST HAVE"
  },
];

export default function NewInEditorialCarousel() {
  const [products, setProducts] = useState<Record<number, Product>>({});
  const [active, setActive] = useState(0);

  // Fetch Products
  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await api.get("/products", {
          params: {
            ids: EDITORIAL_SLIDES.map((s) => s.productId).join(","),
          },
        });
        const map: Record<number, Product> = {};
        res.data.products?.forEach((p: Product) => {
          map[p.id] = p;
        });
        setProducts(map);
      } catch (err) {
        console.error("Failed to load editorial products", err);
      }
    }
    loadProducts();
  }, []);

  // Auto-play Logic (Switches every 5 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % EDITORIAL_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = EDITORIAL_SLIDES[active];
  const product = products[slide.productId];

  return (
<section className="mt-16 md:mt-28 px-2 md:px-10 overflow-hidden">
<div className="text-center mb-8">
<h2 className="text-2xl md:text-4xl font-light uppercase tracking-[0.3em] text-gray-800">
New In
</h2>
<p className="text-[10px] md:text-xs text-gray-400 mt-1 tracking-widest uppercase">Fresh styles just dropped</p>
</div>

<motion.div
animate={{ backgroundColor: slide.bgColor }}
transition={{ duration: 0.8 }}
className="relative max-w-[1300px] mx-auto h-[450px] md:h-[650px] rounded-2xl md:rounded-3xl overflow-hidden shadow-sm"
>
<AnimatePresence mode="wait">
<motion.div
key={active}
initial={{ opacity: 0 }}
animate={{ opacity: 1 }}
exit={{ opacity: 0 }}
transition={{ duration: 0.6 }}
/* 🔥 FIX: Changed grid to flex with no-wrap for mobile side-by-side */
className="flex items-center h-full w-full px-2 md:px-0"
>
{/* LEFT: MODEL IMAGE */}
<div className="relative w-1/2 md:w-1/2 h-full flex items-center justify-center overflow-hidden">
<motion.span
className="absolute text-5xl md:text-[10rem] font-serif italic font-bold text-brandPink opacity-10 whitespace-nowrap z-0"
>
{slide.accent}
</motion.span>

<img
src={slide.modelImage}
alt="New in look"
className="h-[90%] md:h-full w-full object-contain relative z-10 drop-shadow-xl"
/>
</div>

{/* RIGHT: PRODUCT CARD */}
<div className="w-1/2 md:w-1/2 flex items-center justify-center md:justify-start md:pl-20 z-20">
<motion.div
initial={{ x: 20, opacity: 0 }}
animate={{ x: 0, opacity: 1 }}
/* 🔥 FIX: Scale down the card for mobile to ensure it fits side-by-side */
className="w-full max-w-[160px] sm:max-w-[200px] md:max-w-[340px] scale-[0.85] md:scale-100 origin-center md:origin-left p-2 md:p-6 bg-white/30 backdrop-blur-md rounded-xl border border-white/40"
>
{product ? (
<ProductCard product={product} />
) : (
<div className="w-full h-[250px] md:h-[450px] bg-gray-200/50 animate-pulse rounded-xl" />
)}
</motion.div>
</div>
</motion.div>
</AnimatePresence>

{/* NAVIGATION DOTS */}
<div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
{EDITORIAL_SLIDES.map((_, i) => (
<button
key={i}
onClick={() => setActive(i)}
className={`h-1.5 rounded-full transition-all duration-300 ${
active === i ? "bg-brandPink w-6" : "bg-gray-300 w-1.5"
}`}
/>
))}
</div>
</motion.div>
</section>
);

}