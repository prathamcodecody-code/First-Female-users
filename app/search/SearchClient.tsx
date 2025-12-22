"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import ProductCard from "@/components/ProductCard";

export default function SearchClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const query = searchParams.get("query") || "";
  const sortParam = searchParams.get("sort") || "relevance";
  const categoryId = searchParams.get("categoryId");
  const typeId = searchParams.get("typeId");
  const subtypeId = searchParams.get("subtypeId");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const stock = searchParams.get("stock");

  const [products, setProducts] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState(sortParam);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadProducts = useCallback(async () => {
    if (!query.trim()) {
      setProducts([]);
      setTotal(0);
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Build query parameters
      const params = new URLSearchParams();
      params.append("search", query);
      
      if (sort && sort !== "relevance") {
        // Map frontend sort to backend sort
        if (sort === "newest") params.append("sort", "newest");
        if (sort === "low_to_high") params.append("sort", "low_to_high");
        if (sort === "high_to_low") params.append("sort", "high_to_low");
      }
      
      if (categoryId) params.append("categoryId", categoryId);
      if (typeId) params.append("typeId", typeId);
      if (subtypeId) params.append("subtypeId", subtypeId);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);
      if (stock) params.append("stock", stock);

      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL || 'https://api.firstfemale.in'}products?${params.toString()}`;
      
      console.log("🔍 Searching:", apiUrl);

      const res = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`API returned ${res.status}`);
      }

      const data = await res.json();
      
      console.log("📦 Search results:", data);

      // Handle the response structure from your backend
      // Your backend returns: { products: [...], total: number, page: number, pages: number }
      const productsList = data.products || [];
      const totalCount = data.total || 0;

      setProducts(productsList);
      setTotal(totalCount);
    } catch (err: any) {
      console.error("❌ Search error:", err);
      setError(err?.message || "Failed to load products");
      setProducts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [query, sort, categoryId, typeId, subtypeId, minPrice, maxPrice, stock]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", value);
    router.push(`/search?${params.toString()}`);
    setSort(value);
  };

  if (!query) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h2 className="text-2xl font-semibold text-gray-700">
          Start typing to search products
        </h2>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">
          Results for "{query}"
        </h1>

        <select
          className="border rounded px-3 py-2 bg-white"
          value={sort}
          onChange={(e) => handleSortChange(e.target.value)}
          disabled={loading}
        >
          <option value="relevance">Relevance</option>
          <option value="newest">Newest First</option>
          <option value="low_to_high">Price: Low to High</option>
          <option value="high_to_low">Price: High to Low</option>
        </select>
      </div>

      <main>
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="text-gray-500 mt-4">Searching...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            <p className="text-gray-600 mb-4">
              {total} {total === 1 ? 'Product' : 'Products'} Found
            </p>

            {products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No products found for "{query}"
                </p>
                <p className="text-gray-400 text-sm mt-2">
                  Try different keywords or filters
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

