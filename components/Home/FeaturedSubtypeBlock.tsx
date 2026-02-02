"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import FeaturedProductSection from "./ShopByCategory";

export default function FeaturedSubtypeBlock({
  subtypeId,
  name,
}: {
  subtypeId: number;
  name: string;
}) {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    api
      .get("/products", { params: { subtypeId, limit: 4 } })
      .then((res) => setProducts(res.data.products || []));
  }, [subtypeId]);

  if (!products.length) return null;

  return (
    <FeaturedProductSection
      title={`Shop ${name}`}
      products={products}
      exploreLink={`/all-products?subtypeId=${subtypeId}`}
    />
  );
}
