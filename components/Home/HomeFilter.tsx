"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";

export default function HomeFilter({
  onFilter,
}: {
  onFilter?: (f: any) => void;
}) {
  const [categories, setCategories] = useState<any[]>([]);
  const [filter, setFilter] = useState({
    categoryId: "",
    minPrice: "",
    maxPrice: "",
    sort: "",
  });

  useEffect(() => {
    api
      .get("/categories")
      .then((res) => setCategories(Array.isArray(res.data) ? res.data : []))
      .catch(() => setCategories([]));
  }, []);

  const handlePrice = (value: string) => {
    if (!value) {
      setFilter({ ...filter, minPrice: "", maxPrice: "" });
      return;
    }

    const [min, max] = value.split("-");
    setFilter({
      ...filter,
      minPrice: min || "",
      maxPrice: max || "",
    });
  };

  return (
    <div className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm w-full max-w-[280px]">
      
      {/* HEADER */}
      <div className="mb-8 border-b border-gray-50 pb-4">
        <h2 className="text-xl font-bold text-gray-800 tracking-tight">
          Filter
        </h2>
        <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">
          Refine your search
        </p>
      </div>

      {/* FILTER CONTROLS - Changed from grid-cols-4 to flex-col */}
      <div className="flex flex-col gap-8">

        {/* CATEGORY */}
        <FilterSelect
          label="Category"
          value={filter.categoryId}
          onChange={(e) =>
            setFilter({ ...filter, categoryId: e.target.value })
          }
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </FilterSelect>

        {/* PRICE */}
        <FilterSelect label="Price Range" onChange={(e) => handlePrice(e.target.value)}>
          <option value="">Any Price</option>
          <option value="0-500">Under ₹500</option>
          <option value="500-1000">₹500 – ₹1000</option>
          <option value="1000-2000">₹1000 – ₹2000</option>
          <option value="2000-5000">₹2000 – ₹5000</option>
        </FilterSelect>

        {/* SORT */}
        <FilterSelect
          label="Sort By"
          value={filter.sort}
          onChange={(e) =>
            setFilter({ ...filter, sort: e.target.value })
          }
        >
          <option value="">Recommended</option>
          <option value="newest">Newest</option>
          <option value="low_to_high">Price: Low to High</option>
          <option value="high_to_low">Price: High to Low</option>
        </FilterSelect>

          <button
  onClick={() => onFilter?.(filter)}
  className="mt-6 w-full bg-brandPink text-white py-2 rounded-md font-semibold"
>
  Apply Filters
</button>

        {/* RESET BUTTON */}
        <button
          onClick={() =>
            setFilter({
              categoryId: "",
              minPrice: "",
              maxPrice: "",
              sort: "",
            })
          }
          className="
            mt-4
            w-full
            h-[45px]
            rounded-lg
            bg-gray-50
            text-xs font-bold uppercase tracking-widest
            text-gray-500
            hover:bg-brandPink
            hover:text-white
            transition-all duration-300
          "
        >
          Reset All
        </button>
      </div>
    </div>
  );
}

/* ---------------- UI HELPER ---------------- */

function FilterSelect({
  label,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
        {label}
      </label>
      <div className="relative">
        <select
          {...props}
          className="
            w-full
            h-[45px]
            appearance-none
            rounded-lg
            border border-gray-100
            bg-gray-50/50
            px-4
            text-sm font-medium
            text-gray-700
            focus:outline-none
            focus:ring-2 focus:ring-brandPink/10
            focus:border-brandPink
            hover:border-gray-300
            transition-all
            cursor-pointer
          "
        >
          {children}
        </select>
        {/* Custom Arrow Icon */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
