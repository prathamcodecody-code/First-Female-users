"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export default function HomeFilter({
  onFilter,
}: {
  onFilter?: (f: any) => void;
}) {
  const [types, setTypes] = useState<any[]>([]);
const [filter, setFilter] = useState({
  typeId: "",
  minPrice: "",
  maxPrice: "",
  sort: "",
});

  const [openMobile, setOpenMobile] = useState(false);

  useEffect(() => {
  api
    .get("/product-types")
    .then((res) => setTypes(Array.isArray(res.data) ? res.data : []))
    .catch(() => setTypes([]));
}, []);

  const handlePrice = (value: string) => {
    if (!value) {
      setFilter({ ...filter, minPrice: "", maxPrice: "" });
      return;
    }
    const [min, max] = value.split("-");
    setFilter({ ...filter, minPrice: min, maxPrice: max });
  };

  const apply = () => {
    onFilter?.(filter);
    setOpenMobile(false);
  };

  const reset = () => {
    setFilter({ typeId: "", minPrice: "", maxPrice: "", sort: "" });
  };

  /* ================= DESKTOP FILTER ================= */
  const FilterBody = (
    <div className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm w-full max-w-[280px]">
      <div className="mb-6">
        <h2 className="text-lg font-bold">Filter</h2>
        <p className="text-xs text-gray-400 uppercase">Refine search</p>
      </div>

      <div className="flex flex-col gap-6">
        <FilterSelect
  label="Product Type"
  value={filter.typeId}
  onChange={(e) =>
    setFilter({ ...filter, typeId: e.target.value })
  }
>
  <option value="">All Types</option>
  {types.map((t) => (
    <option key={t.id} value={t.id}>{t.name}</option>
  ))}
</FilterSelect>

        <FilterSelect
  label="Price Range"
  value={
    filter.minPrice && filter.maxPrice
      ? `${filter.minPrice}-${filter.maxPrice}`
      : ""
  }
  onChange={(e) => handlePrice(e.target.value)}
>
  <option value="0-499">Under ₹500</option>
<option value="500-999">₹500 – ₹999</option>
<option value="1000-1499">₹1000 – ₹1499</option>
<option value="1500-1999">₹1500 – ₹1999</option>
<option value="2000-2999">₹2000 – ₹2999</option>
<option value="3000-4999">₹3000 – ₹4999</option>
<option value="5000-100000">₹5000+</option>
</FilterSelect>


        <FilterSelect
          label="Sort By"
          value={filter.sort}
          onChange={(e) => setFilter({ ...filter, sort: e.target.value })}
        >
          <option value="">Recommended</option>
          <option value="newest">Newest</option>
          <option value="low_to_high">Low → High</option>
          <option value="high_to_low">High → Low</option>
        </FilterSelect>

        <button
          onClick={apply}
          className="w-full bg-brandPink text-white py-2 rounded-md font-semibold"
        >
          Apply Filters
        </button>

        <button
          onClick={reset}
          className="w-full text-xs uppercase tracking-widest text-gray-500"
        >
          Reset All
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* DESKTOP */}
      <div className="hidden lg:block">{FilterBody}</div>

      {/* MOBILE FILTER BUTTON */}
      <div className="lg:hidden sticky bottom-0 bg-white border-t z-30 px-4 py-3">
        <button
          onClick={() => setOpenMobile(true)}
          className="w-full bg-black text-white py-3 rounded-full font-semibold"
        >
          Filter Products
        </button>
      </div>

      {/* MOBILE BOTTOM SHEET */}
      {openMobile && (
        <div className="fixed inset-0 z-50 bg-black/40">
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between mb-4">
              <h2 className="font-bold">Filter</h2>
              <button onClick={() => setOpenMobile(false)}>✕</button>
            </div>
            {FilterBody}
          </div>
        </div>
      )}
    </>
  );
}

/* ---------- UI Helper ---------- */

function FilterSelect({
  label,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs uppercase font-semibold text-gray-400">
        {label}
      </label>
      <select
        {...props}
        className="h-11 rounded-lg border px-3 text-sm bg-gray-50"
      >
        {children}
      </select>
    </div>
  );
}
