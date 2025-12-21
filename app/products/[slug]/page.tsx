import ProductClient from "./ProductClient";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type PageProps = {
  params: { slug: string };
};

/* ---------- SEO ---------- */
export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products/${params.slug}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return {
      title: "Product Not Found | FirstFemale",
    };
  }

  const product = await res.json();

  return {
    title: `${product.title} | FirstFemale`,
    description: product.description ?? "",
  };
}

/* ---------- PAGE ---------- */
export default async function ProductPage({ params }: PageProps) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products/${params.slug}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    notFound(); // ❗ DO NOT return JSX here
  }

  const product = await res.json();

  // 🔥 GUARANTEE render
  return (
    <ProductClient product={product} />
  );
}
