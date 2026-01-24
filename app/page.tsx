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

  type Subtype = {
  id: number;
  name: string;
  image: string;
};

const SUBTYPE_IMAGES: Record<number, string> = {
  11: "/categories/Dress.png",
  15: "/categories/JumpSuits.png",
  16: "/categories/PlaySuits.png",
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
    
const [validSubtypes, setValidSubtypes] = useState<Subtype[]>([]);

    // 🔥 Fetch featured sections (ONLY populated ones)
    useEffect(() => {
  async function loadHomepageSubtypes() {
    const responses = await Promise.all(
      HOMEPAGE_SUBTYPES.map((sub) =>
        api.get("/products", {
          params: { subtypeId: sub.id, limit: 4 },
        })
      )
    );

    const populated = responses
      .map((res, i) => ({
        ...HOMEPAGE_SUBTYPES[i],
        products: res.data.products || [],
      }))
      .filter((s) => s.products.length > 0);

    // Featured sections
    setSections(populated);

    // Category strip (subtypes)
    setValidSubtypes(
      populated.map((s) => ({
        id: s.id,
        name: s.name,
        image: SUBTYPE_IMAGES[s.id] || "/placeholder.png",
      }))
    );
  }

  loadHomepageSubtypes();
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


    return  (
      <div className="max-w-7xl mx-auto px-6 py-10">
        <CategoryStrip categories={validSubtypes} />
        <HeroCarousel />
        
        {/* FEATURED SECTIONS */}
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

        {/* --- ALWAYS SHOW THE FILTER HERE --- */}
      <section className="mt-24 border-t pt-16 overflow-x-hidden">
    <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-8">

      {/* FILTER */}
      <aside className="sticky top-30 h-fit max-w-full overflow-x-hidden">
        <HomeFilter onFilter={applyFilters} />
      </aside>

      {/* RESULTS */}
      <div className="w-full max-w-full overflow-x-hidden">
        {hasAppliedFilter ? (
          filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-full">
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
