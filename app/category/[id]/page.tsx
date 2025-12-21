"use client";

import { useEffect, useState } from "react";
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

export default function CategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?categoryId=${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then((data) => {
        setProducts(data?.products || []);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  const categoryName =
    products.length > 0 ? products[0]?.category?.name : "Category";

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <p className="text-gray-500">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold mb-4">Category</h1>
        <p className="text-gray-500">Failed to load products.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">
        {categoryName}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-3">
          <FiltersSidebar categoryId={id} />
        </div>

        <div className="md:col-span-9">
          {products.length === 0 && (
            <p className="text-gray-600">No products found.</p>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <a
                key={p.id}
                href={`/products/${p.slug}-${p.id}`}
                className="border rounded-xl shadow-sm hover:shadow-lg transition bg-white"
              >
                <div className="w-full h-64 overflow-hidden rounded-t-xl">
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/products/${p.img1}`}
                    alt={p.title}
                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                  />
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold line-clamp-2">
                    {p.title}
                  </h3>
                  <p className="text-brandPink font-bold mt-2 text-lg">
                    ₹{p.price}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
