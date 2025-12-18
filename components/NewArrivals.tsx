"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { api } from "@/lib/api";

/* ---------------- SKELETON CARD ---------------- */
function ProductSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-3 animate-pulse">
      <div className="h-48 bg-gray-200 rounded-lg mb-4" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
      <div className="h-8 bg-gray-200 rounded w-full" />
    </div>
  );
}

export default function NewArrivals() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/products?limit=8")
      .then((res) => {
        const data = res.data;

        let list: any[] = [];

        if (Array.isArray(data)) list = data;
        else if (Array.isArray(data?.products)) list = data.products;
        else if (Array.isArray(data?.data)) list = data.data;

        setProducts(list);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="mt-20">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-brandBlack">
          New Arrivals
        </h2>

        <span className="text-sm text-gray-500">
          Fresh styles just dropped
        </span>
      </div>

      {/* GRID */}
      <div className="
        grid grid-cols-2 
        sm:grid-cols-3 
        md:grid-cols-4 
        gap-4 md:gap-6
      ">
        {loading &&
          Array.from({ length: 8 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}

        {!loading && products.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            No new products available right now.
          </div>
        )}

        {!loading &&
          products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
      </div>
    </section>
  );
}
