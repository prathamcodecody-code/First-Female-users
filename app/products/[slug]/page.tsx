export const dynamic = "force-dynamic";

import ProductClient from "./ProductClient";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type PageProps = {
  params: { slug: string };
};

export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products/${params.slug}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return { title: "Product Not Found | FirstFemale" };
  }

  const product = await res.json();

  return {
    title: `${product.title} | FirstFemale`,
    description: product.description ?? "",
  };
}

export default async function ProductPage({ params }: PageProps) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products/${params.slug}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    notFound();
  }

  const product = await res.json();
  return <ProductClient product={product} />;
}
