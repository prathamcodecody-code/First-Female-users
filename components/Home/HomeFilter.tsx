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

  useEffect(() => {
    onFilter?.(filter);
  }, [filter, onFilter]);

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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-10">
      
      {/* HEADER */}
      <div className="mb-5">
        <h2 className="text-lg font-bold text-brandPink">
          Filter Products
        </h2>
        <p className="text-sm text-gray-500">
          Narrow down products to find what you love
        </p>
      </div>

      {/* FILTER CONTROLS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

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

        {/* RESET */}
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
            mt-6 sm:mt-0
            h-[42px]
            rounded-lg
            border border-gray-200
            text-sm font-semibold
            text-gray-600
            hover:bg-gray-100
            transition
          "
        >
          Reset
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
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-500">
        {label}
      </label>
      <select
        {...props}
        className="
          h-[42px]
          rounded-lg
          border border-gray-200
          bg-white
          px-3
          text-sm
          focus:outline-none
          focus:ring-2 focus:ring-brandPink/30
          focus:border-brandPink
          hover:border-brandPink
          transition
        "
      >
        {children}
      </select>
    </div>
  );
}
