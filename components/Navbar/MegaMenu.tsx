"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function MegaMenu({ categoryId }: { categoryId: number }) {
  const [types, setTypes] = useState<any[]>([]);

  useEffect(() => {
    if (!categoryId) return;

    api
      .get(`/product-types?categoryId=${categoryId}`)
      .then((res) => {
        setTypes(Array.isArray(res.data) ? res.data : []);
      })
      .catch(() => setTypes([]));
  }, [categoryId]);

  return (
    <div className="absolute left-0 right-0 bg-white border-t border-gray-100 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-10 py-8">
        <div className="grid grid-cols-5 gap-10">

          {Array.isArray(types) &&
            types.map((t) => (
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
                    t.subtypes.map((s: any) => (
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
      </div>
    </div>
  );
}
