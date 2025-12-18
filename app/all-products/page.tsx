import { Suspense } from "react";
import ProductsListClient from "./ProductsListClient";

export default function AllProductsPage() {
  return (
    <Suspense fallback={<ProductsSkeleton />}>
      <ProductsListClient />
    </Suspense>
  );
}

function ProductsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-72 bg-gray-100 animate-pulse rounded-xl"
          />
        ))}
      </div>
    </div>
  );
}
