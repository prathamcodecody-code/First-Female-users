"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import ProductCard from "@/components/ProductCard";

type Product = {
  id: number;
  title: string;
  slug?: string;
  price: number | string;
  img1?: string | null;
  discountType?: "PERCENT" | "FLAT" | null;
  discountValue?: number | null;
};

export default function DiscountSection() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/products", {
        params: {
          discounted: "true",
          limit: 8,
        },
      })
      .then((res) => {
        setItems(res.data?.products || []);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="mt-24">
        <div className="flex items-end justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-light uppercase tracking-ultra text-brandBlack">
            Best Deals
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[3/4] bg-gray-100 animate-pulse rounded-sm"
            />
          ))}
        </div>
      </section>
    );
  }

  if (items.length === 0) return null;

  return (
    <section className="mt-24">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-light uppercase tracking-ultra text-brandBlack">
            Best Deals
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Limited-time discounts you’ll love
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
