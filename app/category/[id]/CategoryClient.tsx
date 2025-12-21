"use client";

import FiltersSidebar from "@/components/Filters/FiltersSidebar";

type Product = {
  id: number;
  slug: string;
  title: string;
  price: number;
  img1?: string;
  category?: {
    name: string;
  };
};

export default function CategoryClient({
  products,
  categoryId,
}: {
  products: any[];
  categoryId: string;
}) {
    console.log("CategoryClient categoryId:", categoryId);
  const categoryName =
    products.length > 0 ? products[0]?.category?.name : "Category";

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-8">{categoryName}</h1>

      <div className="grid grid-cols-12 gap-8">
        <aside className="col-span-3">
          {categoryId && <FiltersSidebar categoryId={categoryId} />}
        </aside>

        <main className="col-span-9">
          {products.length === 0 && <p>No products found.</p>}
        </main>
      </div>
    </div>
  );
}
