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
import InfluencerSection from "@/components/Home/InfluencerCard";
import EditorialCarousel from "@/components/Home/NewInEditorialCarousel";

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
  influencerItems?: any[];
  position: number;
  isActive: boolean;
};

// 🔥 Define your subtypes here - these are the categories you want to show on homepage
const HOMEPAGE_SUBTYPES = [
  { id: 11, name: "Dresses" },
  { id: 15, name: "Jumpsuits" },
  { id: 67, name: "Co-ords" },
];

export default function HomePage() {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [hasAppliedFilter, setHasAppliedFilter] = useState(false);
  const [homepageSections, setHomepageSections] = useState<HomepageSection[]>([]);
  
  // 🔥 FIXED: Corrected state variable name
  const [sections, setSections] = useState<{id: number; name: string; products: Product[]}[]>([]);
  const [isLoadingSections, setIsLoadingSections] = useState(true);

  // 🔥 Fetch homepage sections (Hero, Category Strip, etc.)
  useEffect(() => {
    api.get("/homepage")
      .then((res) => {
        console.log("HOMEPAGE API RESPONSE →", res.data);
        setHomepageSections(res.data || []);
      })
      .catch((error) => {
        console.error("Failed to load homepage sections:", error);
      });
  }, []);

  // 🔥 Fetch products for each subtype (Dresses, Jumpsuits, Co-ords)
  useEffect(() => {
    async function loadSubtypeProducts() {
      try {
        setIsLoadingSections(true);

        // Fetch products for each subtype in parallel
        const responses = await Promise.all(
          HOMEPAGE_SUBTYPES.map((subtype) =>
            api.get("/products", {
              params: { 
                subtypeId: subtype.id, 
                limit: 4  // Get 4 products per subtype
              },
            })
          )
        );

        // Map the responses to include subtype info
        const populatedSections = responses
          .map((res, index) => ({
            id: HOMEPAGE_SUBTYPES[index].id,
            name: HOMEPAGE_SUBTYPES[index].name,
            products: res.data.products || [],
          }))
          .filter((section) => section.products.length > 0); // Only show sections with products

        setSections(populatedSections);
        console.log("Loaded subtype sections:", populatedSections);
      } catch (error) {
        console.error("Failed to load subtype products:", error);
      } finally {
        setIsLoadingSections(false);
      }
    }

    loadSubtypeProducts();
  }, []);

  // Filters
  const applyFilters = async (filter: any) => {
  setHasAppliedFilter(true);

  // 1. Construct the params object
  const params: any = {};
  
  if (filter.typeId) params.typeId = filter.typeId;
  if (filter.minPrice !== undefined) params.minPrice = filter.minPrice;
  if (filter.maxPrice !== undefined) params.maxPrice = filter.maxPrice;
  if (filter.sort) params.sort = filter.sort;

  // 2. Handle Arrays (Colors and Occasions)
  // Most APIs expect: colors=1,2,3 or colors[]=1&colors[]=2
  if (filter.colors && filter.colors.length > 0) {
    params.colors = filter.colors.join(","); 
  }
  
  if (filter.occasions && filter.occasions.length > 0) {
    params.occasions = filter.occasions.join(",");
  }

  try {
    console.log("📡 Fetching products with params:", params); // Debugging
    
    const res = await api.get("/products", { params });
    
    // 3. Handle data structure mismatch
    // Ensure you are targeting the correct field (res.data vs res.data.products)
    const products = res.data.products || res.data || [];
    setFilteredProducts(products);
    
  } catch (error) {
    console.error("❌ Failed to apply filters:", error);
    setFilteredProducts([]);
  }
};

  // 🔥 Render dynamic homepage sections (Hero, Category Strip, etc.)
 const renderSection = (section: HomepageSection) => {
  console.log("Rendering section:", section.type, section); // Debug log
  
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

    case "INFLUENCER":
      return (
        <InfluencerSection
          key={section.id}
          title={section.title}
          items={section.influencerItems || []} // ✅ Use influencerItems from DB
        />
      );

    case "EDITORIAL":
      console.log("Editorial section config:", section.config);
  return (
    <EditorialCarousel
      key={section.id}
      title={section.title}
      items={section.config?.items || []}
    />
  );

    default:
      return null;
  }
};
const editorialSections = homepageSections.filter(
  (s) => s.isActive && s.type === "EDITORIAL"
);

const nonEditorialSections = homepageSections.filter(
  (s) => s.isActive && s.type !== "EDITORIAL" && s.type !== "INFLUENCER"
);

const influencerSections = homepageSections.filter(
  (s) => s.isActive && s.type === "INFLUENCER"
);
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* 🔥 DYNAMIC HOMEPAGE SECTIONS (Hero, Category Strips, etc.) */}
  
     {nonEditorialSections
  .sort((a, b) => a.position - b.position)
  .map(renderSection)}
  
        {/* 🔥 SUBTYPE PRODUCT SECTIONS (Dresses, Jumpsuits, Co-ords) */}
      {isLoadingSections ? (
        <div className="py-20 text-center">
          <p className="text-gray-500">Loading products...</p>
        </div>
      ) : (
        sections.map((section) => (
          <FeaturedProductSection
            key={section.id}
            title={`Shop ${section.name}`}
            exploreLink={`/all-products?subtypeId=${section.id}`}
            products={section.products}
          />
        ))
      )}

      {/* OTHER HOMEPAGE SECTIONS */}
      <MainCharacterSection />
      {/* 🔥 EDITORIAL — RIGHT ABOVE NEW ARRIVALS */}
{editorialSections
  .sort((a, b) => a.position - b.position)
  .map((section) => (
    <EditorialCarousel
      key={section.id}
      title={section.title}
      items={section.config?.items || []}
    />
  ))}
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
      {/* INFLUENCER — ALWAYS LAST */}
{homepageSections
  .filter((s) => s.isActive && s.type === "INFLUENCER")
  .map((section) => (
    <InfluencerSection
      key={section.id}
      title={section.title}
      items={section.influencerItems || []}
    />
  ))}
    </div>
  );
}
