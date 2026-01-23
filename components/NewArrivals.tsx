"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { api } from "@/lib/api";

/* ---------------- SKELETON CARD ---------------- */
function ProductSkeleton() {
  return (
    <div className="bg-white rounded-sm shadow-sm p-3 animate-pulse">
      <div className="aspect-[3/4] bg-gray-200 rounded-sm mb-4" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
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
          sort: "newest", // explicit intent
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
      {/* HEADER */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-light text-brandBlack uppercase tracking-ultra">
            New Arrivals
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Fresh styles just dropped
          </p>
        </div>
      </div>

      {/* GRID */}
      <div
        className="
          grid grid-cols-2 
          sm:grid-cols-3 
          md:grid-cols-4 
          gap-4 md:gap-6
        "
      >
        {loading &&
          Array.from({ length: 8 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}

        {!loading && products.length === 0 && (
          <div className="col-span-full text-center py-16 text-gray-500">
            No new products available right now.
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
