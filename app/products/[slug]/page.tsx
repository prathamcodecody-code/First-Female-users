export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

import ProductClient from "./ProductClient";
import { notFound } from "next/navigation";

type PageProps = {
  params: { slug: string };
};

export default async function ProductPage({ params }: PageProps) {
  // Extract the actual slug by removing the ID suffix
  // "test1-1" -> "test1"
  const slugParts = params.slug.split('-');
  const id = slugParts[slugParts.length - 1]; // Get last part (ID)
  const actualSlug = slugParts.slice(0, -1).join('-'); // Get everything except last part
  
  const res = await fetch(
    `${process.env.API_URL}/products/${actualSlug}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    notFound();
  }

  const product = await res.json();
  return <ProductClient product={product} />;
}
