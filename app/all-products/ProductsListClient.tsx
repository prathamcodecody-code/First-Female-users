"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FiFilter, FiX } from "react-icons/fi"; // Added for mobile UI
import ProductCard from "@/components/ProductCard";
import FiltersSidebar from "@/components/Filters/FiltersSidebar";
import { api } from "@/lib/api";

type Product = {
  id: number;
  title: string;
  price: number | string;
  img1?: string;
  category?: { name: string };
};

export default function ProductsListClient() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false); // Mobile state

  const [sort, setSort] = useState(searchParams.get("sort") || "relevance");
  const categoryId = searchParams.get("categoryId") || "";

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params: any = {};
      searchParams.forEach((value, key) => { params[key] = value; });
      if (sort !== "relevance") params.sort = sort;

      const res = await api.get("/products", { params });
      const data = res.data;
      const list = Array.isArray(data) ? data : (data?.products || []);

      setProducts(list);
      setTotal(data?.total ?? list.length);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
    setIsMobileFilterOpen(false); // Close sidebar on mobile when filter changes
  }, [searchParams, sort]);

  const categoryName = products[0]?.category?.name || (categoryId ? "Filtered Products" : "All Products");

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-6 md:py-10 bg-white">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-xl md:text-3xl font-bold tracking-tight text-gray-900 uppercase">
            {categoryName}
          </h1>
          {!loading && <p className="text-xs md:text-sm text-gray-500 mt-1 uppercase tracking-widest">{total} Products Found</p>}
        </div>

        <div className="flex items-center gap-3">
          {/* MOBILE FILTER TOGGLE */}
          <button 
            onClick={() => setIsMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-full text-sm font-semibold"
          >
            <FiFilter /> Filter
          </button>

          <select
            className="border-none bg-gray-50 rounded-full px-4 py-2 text-sm font-semibold focus:ring-2 focus:ring-brandPink"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="relevance">Sort: Relevance</option>
            <option value="newest">Newest</option>
            <option value="low_to_high">Price: Low to High</option>
            <option value="high_to_low">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        {/* DESKTOP SIDEBAR (Hidden on mobile) */}
        <aside className="hidden md:block w-64 shrink-0">
          <FiltersSidebar  />
        </aside>

        {/* MOBILE SIDEBAR OVERLAY */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm md:hidden">
            <div className="w-[85%] h-full bg-white animate-in slide-in-from-left p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-8">
                <span className="font-bold tracking-widest uppercase">Refine By</span>
                <FiX size={24} onClick={() => setIsMobileFilterOpen(false)} />
              </div>
              <FiltersSidebar  />
            </div>
          </div>
        )}

        {/* PRODUCT GRID */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
               {[...Array(6)].map((_, i) => (
                 <div key={i} className="aspect-[3/4] bg-gray-100 animate-pulse rounded-sm" />
               ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-lg">
              <p className="text-gray-500 font-medium">No products found in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
