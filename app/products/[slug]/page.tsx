export const dynamic = "force-dynamic";
export const dynamicParams = true;

import ProductClient from "./ProductClient";
import { notFound } from "next/navigation";

type PageProps = {
  params: { slug: string };
};

export default async function ProductPage({ params }: PageProps) {
  const res = await fetch(
    `${process.env.API_URL}/products/${params.slug}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    notFound();
  }

  const product = await res.json();
  return <ProductClient product={product} />;
}
