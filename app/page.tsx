"use client";

import { useState } from "react";
import HeroCarousel from "@/components/HeroCarousel";
import TrendingNow from "@/components/TrendingSection";
import NewArrivals from "@/components/NewArrivals";
import CategoryGrid from "@/components/CategoryGrid";
import HomeFilter from "@/components/Home/HomeFilter";
import { api } from "@/lib/api";
import ProductCard from "@/components/ProductCard";
import DiscountSection from "@/components/DiscountDeals";

type Product = {
  id: number;
  title: string;
  price: number | string;
  img1?: string;
  slug?: string;
};

type FilterState = {
  categoryId?: string;
  price?: string;
  sort?: string;
};

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);

  const applyFilters = async (filter: FilterState) => {
    const params: any = {};

    if (filter.categoryId) params.categoryId = filter.categoryId;

    if (filter.price) {
      const [min, max] = filter.price.split("-");
      params.minPrice = min;
      params.maxPrice = max;
    }

    if (filter.sort) params.sort = filter.sort;

    const res = await api.get("/products", { params });
    const data = res.data;

    setProducts(Array.isArray(data) ? data : data.products || []);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      <HeroCarousel />

      {/* 👇 SHOW FILTER ALWAYS */}
      <HomeFilter onFilter={applyFilters} />

      {/* Filter results */}
      {products.length > 0 && (
        <div>
         

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((p: Product) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Default Sections */}
      {products.length === 0 && (
        <>
          <CategoryGrid />
          <NewArrivals />
          <DiscountSection />
          <TrendingNow />
        </>
      )}
<CategoryGrid />
          <NewArrivals />
          <DiscountSection />
          <TrendingNow />
    </div>
  );
}
