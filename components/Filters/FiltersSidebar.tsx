"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function FiltersSidebar() {
  const [types, setTypes] = useState<any[]>([]);
  const searchParams = useSearchParams();

  const activeTypeId = searchParams.get("typeId");
  const activeSubtypeId = searchParams.get("subtypeId");

  // helper: preserve existing params
  const buildLink = (extra: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(extra).forEach(([key, value]) => {
      if (!value) params.delete(key);
      else params.set(key, value);
    });

    return `/all-products?${params.toString()}`;
  };

  useEffect(() => {
    api
      .get("/product-types?includeSubtypes=true")
      .then((res) => setTypes(Array.isArray(res.data) ? res.data : []))
      .catch(() => setTypes([]));
  }, []);

  return (
    <div className="w-full space-y-10 md:sticky md:top-24">

      {/* PRODUCT TYPES */}
      <section>
        <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">
          Product Type
        </h3>

        <div className="space-y-4">
          {types.map((t) => (
            <div key={t.id} className="space-y-2">
              <Link
                href={buildLink({
                  typeId: String(t.id),
                  subtypeId: null, // reset subtype when type changes
                })}
                className={`text-[13px] font-semibold transition-colors ${
                  activeTypeId === String(t.id)
                    ? "text-brandPink"
                    : "text-gray-800 hover:text-brandPink"
                }`}
              >
                {t.name}
              </Link>

              {t.subtypes?.length > 0 && (
                <div className="ml-4 flex flex-col gap-2 border-l border-gray-100 pl-4 py-1">
                  {t.subtypes.map((s: any) => (
                    <Link
                      key={s.id}
                      href={buildLink({
                        subtypeId: String(s.id),
                        typeId: null, // subtype takes priority
                      })}
                      className={`text-[12px] transition-colors ${
                        activeSubtypeId === String(s.id)
                          ? "text-brandPink font-bold"
                          : "text-gray-500 hover:text-brandPink"
                      }`}
                    >
                      {s.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <div className="h-px bg-gray-100 w-full" />

      {/* PRICE RANGE */}
      <section>
        <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-6">
          Price Range
        </h3>

        <div className="flex flex-col gap-3">
          <PriceLink href={buildLink({ maxPrice: "499", minPrice: null })} label="Under ₹500" />
          <PriceLink href={buildLink({ minPrice: "500", maxPrice: "999" })} label="₹500 – ₹999" />
          <PriceLink href={buildLink({ minPrice: "1000", maxPrice: "1499" })} label="₹1000 – ₹1499" />
          <PriceLink href={buildLink({ minPrice: "1500", maxPrice: "2999" })} label="₹1500 – ₹2999" />
          <PriceLink href={buildLink({ minPrice: "3000", maxPrice: null })} label="₹3000 & Above" />
        </div>
      </section>

      <div className="h-px bg-gray-100 w-full" />

      {/* AVAILABILITY */}
      <Link
        href={buildLink({ stock: "in" })}
        className="flex items-center gap-3 group"
      >
        <div className="w-4 h-4 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-brandPink transition-all">
          <div className="w-2 h-2 rounded-full bg-green-500" />
        </div>
        <span className="text-[13px] font-semibold uppercase tracking-wider">
          In Stock
        </span>
      </Link>

      {/* RESET */}
      <Link
        href="/all-products"
        className="block w-full py-3 text-center border border-gray-800 text-[10px] font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all mt-6"
      >
        Clear Filters
      </Link>
    </div>
  );
}

function PriceLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="text-[13px] text-gray-600 hover:text-brandPink transition-colors"
    >
      {label}
    </Link>
  );
}
