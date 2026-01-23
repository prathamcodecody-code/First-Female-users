"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
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

  const [sort, setSort] = useState(
    searchParams.get("sort") || "relevance"
  );

  const categoryId = searchParams.get("categoryId") || "";

  const loadProducts = async () => {
    try {
      setLoading(true);

      const params: any = {};
      searchParams.forEach((value, key) => {
        params[key] = value;
      });

      if (sort !== "relevance") params.sort = sort;

      const res = await api.get("/products", { params });
      const data = res.data;

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.products)
        ? data.products
        : [];

      setProducts(list);
      setTotal(data?.total ?? list.length);
    } catch {
      setProducts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [searchParams, sort]);

  const categoryName =
    products[0]?.category?.name ||
    (categoryId ? "Filtered Products" : "All Products");

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">{categoryName}</h1>
          {!loading && (
            <p className="text-sm text-gray-500">
              {total} Products Found
            </p>
          )}
        </div>

        <select
          className="border rounded px-4 py-2"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="relevance">Relevance</option>
          <option value="newest">Newest</option>
          <option value="low_to_high">Low → High</option>
          <option value="high_to_low">High → Low</option>
        </select>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="hidden md:block md:col-span-3">
          {categoryId && <FiltersSidebar categoryId={categoryId} />}
        </div>

        <div className="col-span-12 md:col-span-9">
          {!loading && products.length === 0 && (
            <p className="text-center text-gray-500">
              No products found
            </p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 overflow-hidden">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
