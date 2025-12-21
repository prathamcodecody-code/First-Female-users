"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";

type FilterSidebarProps = {
  categoryId?: string | number;
};

export default function FiltersSidebar({ categoryId }: FilterSidebarProps) {
  const [types, setTypes] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  const cid = categoryId ? String(categoryId) : null;

  useEffect(() => {
    if (!cid) {
    setTypes([]);
    return;
  }

    api
      .get(`/product-types?categoryId=${cid}`)
      .then((res) => setTypes(Array.isArray(res.data) ? res.data : []))
      .catch(() => setTypes([]));
  }, [cid]);

  // 🚨 DO NOT RENDER SIDEBAR UNTIL ID EXISTS
  if (!cid) return null;

  return (
    <aside className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 md:sticky md:top-24">
      
      {/* MOBILE HEADER */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden w-full flex items-center justify-between px-6 py-4 font-bold text-brandPink"
      >
        Filters
        {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      {/* CONTENT */}
      <div className={`px-6 pb-6 ${open ? "block" : "hidden"} md:block`}>
        
        {/* PRODUCT TYPES */}
        <div className="mb-8">
          <h3 className="text-xs font-semibold text-gray-500 uppercase mb-4">
            Product Type
          </h3>

          {types.map((t) => (
            <div key={t.id}>
              <Link
                href={
    cid
      ? `/all-products?categoryId=${cid}&typeId=${t.id}`
      : `/all-products?typeId=${t.id}`
  }
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-pink-50"
                onClick={() => setOpen(false)}
              >
                <span className="w-2 h-2 rounded-full bg-brandPink" />
                {t.name}
              </Link>

              {t.subtypes?.length > 0 && (
                <div className="ml-6 mt-2 space-y-2 border-l pl-4">
                  {t.subtypes.map((s: any) => (
                    <Link
                      key={s.id}
                      href={`/all-products?categoryId=${cid}&subtypeId=${s.id}`}
                      className="block text-xs hover:text-brandPink"
                      onClick={() => setOpen(false)}
                    >
                      {s.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <Divider />

        {/* PRICE */}
        <div className="mb-8">
          <h3 className="text-xs font-semibold text-gray-500 uppercase mb-4">
            Price Range
          </h3>

          <PriceLink href={`/all-products?categoryId=${cid}&maxPrice=500`} label="Under ₹500" />
          <PriceLink href={`/all-products?categoryId=${cid}&minPrice=500&maxPrice=1000`} label="₹500 – ₹1000" />
          <PriceLink href={`/all-products?categoryId=${cid}&minPrice=1000`} label="₹1000 & Above" />
        </div>

        <Divider />

        {/* AVAILABILITY */}
        <Link
          href={`/all-products?categoryId=${cid}&stock=in`}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-pink-50"
        >
          <span className="w-2 h-2 rounded-full bg-green-500" />
          In Stock
        </Link>
      </div>
    </aside>
  );
}

/* Helpers */
function Divider() {
  return <div className="border-t my-6" />;
}

function PriceLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="block px-3 py-2 rounded-lg text-sm hover:bg-pink-50">
      {label}
    </Link>
  );
}
