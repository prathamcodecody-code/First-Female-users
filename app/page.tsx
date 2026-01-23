"use client";

import { useEffect, useState } from "react";
import HeroCarousel from "@/components/HeroCarousel";
import TrendingNow from "@/components/TrendingSection";
import NewArrivals from "@/components/NewArrivals";
import HomeFilter from "@/components/Home/HomeFilter";
import ProductCard from "@/components/ProductCard";
import DiscountSection from "@/components/DiscountDeals";
import CategoryStrip from "@/components/Home/CategoryStrip";
import MainCharacterSection from "@/components/Home/MainCharacterSection";
import FeaturedProductSection from "@/components/Home/ShopByCategory";
import { api } from "@/lib/api";

type Product = {
  id: number;
  title: string;
  slug: string;
  price: number;
  finalPrice: number;
  img1: string;
};

const HOMEPAGE_SUBTYPES = [
  { id: 11, name: "Dresses" },
  { id: 15, name: "Jumpsuits" },
  { id: 16, name: "Playsuits" },
];

export default function HomePage() {
  const [sections, setSections] = useState<
    { id: number; name: string; products: Product[] }[]
  >([]);

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [hasAppliedFilter, setHasAppliedFilter] = useState(false);

  // 🔥 Fetch featured sections (ONLY populated ones)
  useEffect(() => {
    Promise.all(
      HOMEPAGE_SUBTYPES.map((sub) =>
        api.get("/products", {
          params: { subtypeId: sub.id, limit: 4 },
        })
      )
    ).then((responses) => {
      const validSections = responses
        .map((res, i) => ({
          ...HOMEPAGE_SUBTYPES[i],
          products: res.data.products || [],
        }))
        .filter((section) => section.products.length > 0);

      setSections(validSections);
    });
  }, []);

  // Filters
  const applyFilters = async (filter: any) => {
    setHasAppliedFilter(true);

    const params: any = {};
    if (filter.categoryId) params.categoryId = filter.categoryId;
    if (filter.price) {
      const [min, max] = filter.price.split("-");
      params.minPrice = min;
      params.maxPrice = max;
    }
    if (filter.sort) params.sort = filter.sort;

    const res = await api.get("/products", { params });
    setFilteredProducts(res.data.products || []);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <CategoryStrip />
      <HeroCarousel />
      
      {/* 🔥 FEATURED SECTIONS (AUTO-HIDE EMPTY) */}
      {sections.map((section) => (
        <FeaturedProductSection
          key={section.id}
          title={`Shop ${section.name}`}
          exploreLink={`/all-products?subtypeId=${section.id}`}
          products={section.products}
        />
      ))}
      <MainCharacterSection />
      <NewArrivals />
      <DiscountSection />
      <TrendingNow />

      {/* FILTER + RESULTS SECTION */}
{hasAppliedFilter && (
  <section className="mt-24">
    <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">

      {/* LEFT: FILTER (DESKTOP) */}
      <aside className="hidden lg:block sticky top-24 h-fit">
        <HomeFilter onFilter={applyFilters} />
      </aside>

      {/* RIGHT: PRODUCTS */}
      <div>
        <h2 className="text-xl font-semibold mb-8">
          Filter Results
        </h2>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            No products found matching your filters.
          </p>
        )}
      </div>
    </div>

    {/* MOBILE FILTER (TOP) */}
    <div className="block lg:hidden mt-10">
      <HomeFilter onFilter={applyFilters} />
    </div>
  </section>
)}

    </div>
  );
}
