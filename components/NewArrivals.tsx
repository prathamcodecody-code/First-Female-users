"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { api } from "@/lib/api";
import NewInEditorialCarousel from "./Home/NewInEditorialCarousel";

/* ---------------- SKELETON CARD ---------------- */
function ProductSkeleton() {
  return (
    <div className="bg-white rounded-sm p-3 animate-pulse">
      <div className="aspect-[3/4] bg-gray-100 rounded-sm mb-4" />
      <div className="h-3 bg-gray-100 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-100 rounded w-1/2" />
    </div>
  );
}

type Product = {
  id: number;
  title: string;
  slug: string;
  price: number;
  finalPrice: number;
  img1?: string | null;
};

export default function NewArrivals() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/products", {
        params: {
          limit: 8,
          sort: "newest",
        },
      })
      .then((res) => {
        setProducts(res.data?.products || []);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="mt-24">
      {/* 1. EDITORIAL CAROUSEL (Top of Section) */}
      <div className="mb-20">
        <NewInEditorialCarousel />
      </div>

      {/* 2. GRID HEADER */}
      <div className="flex flex-col items-center mb-12 text-center">
        <h2 className="text-2xl md:text-3xl font-light text-brandBlack uppercase tracking-[0.3em]">
          The Latest Drop
        </h2>
        <div className="w-12 h-px bg-brandPink mt-4 mb-2 opacity-50" />
        <p className="text-[11px] uppercase tracking-widest text-gray-400">
          Shop the full collection below
        </p>
      </div>

      {/* 3. PRODUCT GRID */}
      <div
        className="
          grid grid-cols-2 
          sm:grid-cols-3 
          md:grid-cols-4 
          gap-4 md:gap-8
        "
      >
        {loading &&
          Array.from({ length: 8 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}

        {!loading && products.length === 0 && (
          <div className="col-span-full text-center py-16 text-gray-500 font-serif italic">
            Fresh styles are on their way.
          </div>
        )}

        {!loading &&
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
      </div>
    </section>
  );
}
