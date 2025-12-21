"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { api } from "@/lib/api";

// Category images map
const categoryImages: Record<number, string> = {
  1: "/categories/women.jpg",
  2: "/categories/men.jpg",
  3: "/categories/kids.jpg",
};

export default function CategoryGrid() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/categories")
      .then((res) => setCategories(Array.isArray(res.data) ? res.data : []))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="mt-20">
      {/* SECTION HEADER */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-brandPink">
          Shop by Category
        </h2>

        <p className="text-sm text-gray-500 hidden md:block">
          Explore collections curated for you
        </p>
      </div>

      {/* SKELETON LOADER */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-72 rounded-2xl bg-gray-100 animate-pulse"
            />
          ))}
        </div>
      )}

      {/* CATEGORY GRID */}
      {!loading && categories.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/category/${c.id}`}
              className="
                group relative rounded-2xl overflow-hidden
                bg-white border border-gray-200
                shadow-sm hover:shadow-lg
                transition-all duration-300
              "
            >
              {/* IMAGE */}
              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src={categoryImages[c.id] || "/categories/default.jpg"}
                  alt={c.name}
                  fill
                  className="
                    object-cover
                    group-hover:scale-110
                    transition-transform duration-500
                  "
                />

                {/* OVERLAY */}
                <div
                  className="
                    absolute inset-0
                    bg-gradient-to-t from-black/40 via-black/10 to-transparent
                    opacity-0 group-hover:opacity-100
                    transition
                  "
                />

                {/* CTA */}
                <div
                  className="
                    absolute bottom-4 left-1/2 -translate-x-1/2
                    bg-white/90 text-brandPink
                    px-4 py-2 rounded-full text-sm font-semibold
                    opacity-0 group-hover:opacity-100
                    transition
                  "
                >
                  Shop Now
                </div>
              </div>

              {/* TITLE */}
              <div className="p-5 text-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  {c.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Explore latest styles
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && categories.length === 0 && (
        <p className="text-center text-gray-500 py-10">
          No categories available.
        </p>
      )}
    </section>
  );
}
