"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/api";

type Category = {
  id: number;
  name: string;
};

const categoryImages: Record<number, string> = {
  1: "/categories/women.jpg",
  2: "/categories/men.jpg",
  3: "/categories/kids.jpg",
};

export default function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/categories")
      .then((res) => {
        const raw = res.data;

        // ✅ normalize response shape
        const list: Category[] = Array.isArray(raw)
          ? raw
          : Array.isArray(raw?.categories)
          ? raw.categories
          : [];

        // ✅ filter invalid ids
        setCategories(
          list.filter(
            (c) => typeof c.id === "number" && !Number.isNaN(c.id)
          )
        );
      })
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-72 bg-gray-100 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <p className="text-center text-gray-500 py-10">
        No categories available.
      </p>
    );
  }

  return (
    <section className="mt-20">
      <h2 className="text-3xl font-bold text-brandPink mb-8">
        Shop by Category
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/category/${c.id}`} // ✅ guaranteed number
            className="group relative rounded-2xl overflow-hidden border shadow-sm hover:shadow-lg transition"
          >
            <div className="relative h-64 w-full">
              <Image
                src={categoryImages[c.id] ?? "/categories/default.jpg"}
                alt={c.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform"
              />
            </div>

            <div className="p-5 text-center">
              <h3 className="text-lg font-semibold">{c.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
