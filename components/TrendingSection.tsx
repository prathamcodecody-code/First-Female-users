"use client";

import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { api } from "@/lib/api";

interface Product {
  id: number;
  title: string;
  img1: string | null;
  price: number;
  slug?: string;
}

export default function TrendingNow() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/products?sort=newest&limit=4")
      .then((res) => {
        const data = res.data;

        const list =
          Array.isArray(data) ? data :
          Array.isArray(data?.products) ? data.products :
          [];

        setItems(list.filter(Boolean));
      })
      .catch(() => setItems([]))
      .finally(() => {
        setLoading(false); // ✅ THIS WAS MISSING
      });
  }, []);

  if (loading) {
    return (
      <section className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-72 bg-gray-100 animate-pulse rounded-xl" />
        ))}
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-20">
        No trending products available.
      </p>
    );
  }

  return (
    <section className="mt-20">
      <h2 className="text-2xl font-bold mb-6">Trending Now</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
