"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import ProductCard from "@/components/ProductCard";

type Product = {
  id: number;
  title: string;
  price: number | string;
  img1?: string | null;
  slug?: string;
  discountType?: "PERCENT" | "FLAT" | null;
  discountValue?: number | null;
};

export default function DiscountSection() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/products/home/discounts?limit=8")
      .then((res) => {
        const data = res.data;
        setItems(Array.isArray(data) ? data : []);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="mt-20">
        <h2 className="text-2xl font-bold mb-6">Best Deals</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-72 bg-gray-100 animate-pulse rounded-xl"
            />
          ))}
        </div>
      </section>
    );
  }

  if (items.length === 0) return null;

  return (
    <section className="mt-20">
      <h2 className="text-2xl font-bold mb-6">Best Deals 🔥</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
