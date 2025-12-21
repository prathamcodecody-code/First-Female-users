"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

type ProductType = {
  id: number;
  name: string;
  subtypes?: {
    id: number;
    name: string;
  }[];
};

export default function MegaMenu({ categoryId }: { categoryId: number }) {
  const [types, setTypes] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!categoryId) return;

    let isMounted = true;
    setLoading(true);
    setTypes([]); // ✅ reset old data

    api
      .get(`/product-types?categoryId=${categoryId}`)
      .then((res) => {
        if (!isMounted) return;
        setTypes(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("MegaMenu fetch failed:", err);
        if (isMounted) setTypes([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [categoryId]);

  // ❌ Do not render menu if nothing exists
  if (!loading && types.length === 0) return null;

  return (
    <div className="absolute left-0 right-0 top-full bg-white border-t border-gray-100 shadow-xl z-50">
      <div className="max-w-7xl mx-auto px-10 py-8">

        {loading ? (
          <p className="text-sm text-gray-500">Loading categories…</p>
        ) : (
          <div className="grid grid-cols-5 gap-10">
            {types.map((t) => (
              <div key={t.id} className="space-y-3">

                {/* TYPE */}
                <Link
                  href={`/all-products?categoryId=${categoryId}&typeId=${t.id}`}
                  className="block font-semibold text-sm tracking-wide text-brandPink hover:opacity-80"
                >
                  {t.name}
                </Link>

                {/* SUBTYPES */}
                <div className="space-y-1">
                  {Array.isArray(t.subtypes) && t.subtypes.length > 0 ? (
                    t.subtypes.map((s) => (
                      <Link
                        key={s.id}
                        href={`/all-products?categoryId=${categoryId}&subtypeId=${s.id}`}
                        className="block text-sm text-brandPink/80 hover:text-brandPink"
                      >
                        {s.name}
                      </Link>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400">Coming soon</p>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
