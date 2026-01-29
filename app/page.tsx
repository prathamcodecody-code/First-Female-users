"use client";

import { useEffect, useState } from "react";
import HeroCarousel from "@/components/HeroCarousel";
import TrendingNow from "@/components/TrendingSection";
import NewArrivals from "@/components/NewArrivals";
import HomeFilter from "@/components/Home/HomeFilter";
import ProductCard from "@/components/ProductCard";
import DiscountSection from "@/components/DiscountDeals";
import MainCharacterSection from "@/components/Home/MainCharacterSection";
import FeaturedProductSection from "@/components/Home/ShopByCategory";
import ResolvedCategoryStrip from "@/components/Home/ResolvedCategoryStrip";
import { api } from "@/lib/api";

type Product = {
  id: number;
  title: string;
  slug: string;
  price: number;
  finalPrice: number;
  img1: string;
};

type HomepageSection = {
  id: number;
  type: "HERO" | "CATEGORY_STRIP" | "EDITORIAL" | "INFLUENCER";
  title?: string;
  config: any;
  position: number;
  isActive: boolean;
};

export default function HomePage() {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [hasAppliedFilter, setHasAppliedFilter] = useState(false);
  const [homepageSections, setHomepageSections] = useState<HomepageSection[]>([]);

  // 🔥 Fetch homepage sections
  useEffect(() => {
    api.get("/homepage").then((res) => {
      console.log("HOMEPAGE API RESPONSE →", res.data);
      setHomepageSections(res.data || []);
    });
  }, []);

  // Filters
  const applyFilters = async (filter: any) => {
    setHasAppliedFilter(true);

    const params: any = {};
    if (filter.typeId) params.typeId = filter.typeId;
    if (filter.minPrice) params.minPrice = filter.minPrice;
    if (filter.maxPrice) params.maxPrice = filter.maxPrice;
    if (filter.sort) params.sort = filter.sort;

    const res = await api.get("/products", { params });
    setFilteredProducts(res.data.products || []);
  };

  // 🔥 Render sections dynamically
  const renderSection = (section: HomepageSection) => {
    switch (section.type) {
      case "HERO":
        return (
          <HeroCarousel
            key={section.id}
            slides={section.config?.slides || []}
          />
        );

      case "CATEGORY_STRIP":
        return (
          <ResolvedCategoryStrip
            key={section.id}
            items={section.config?.items || []}
          />
        );

      case "EDITORIAL":
        return (
          <div key={section.id}>
            Editorial Section (TODO)
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* 🔥 DYNAMIC HOMEPAGE SECTIONS */}
      {homepageSections
        .sort((a, b) => a.position - b.position)
        .map(renderSection)}

      <MainCharacterSection />
      <NewArrivals />
      <DiscountSection />
      <TrendingNow />

      {/* FILTER SECTION */}
      <section className="mt-24 border-t pt-16 overflow-x-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-8">
          <aside className="sticky top-30 h-fit max-w-full overflow-x-hidden">
            <HomeFilter onFilter={applyFilters} />
          </aside>

          <div className="w-full max-w-full overflow-x-hidden">
            {hasAppliedFilter ? (
              filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {filteredProducts.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 py-20 text-center border rounded-sm">
                  No products found matching your filters.
                </p>
              )
            ) : (
              <div className="py-20 text-center border border-dashed rounded-sm text-gray-400">
                Select filters to see products.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
