export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

import ProductClient from "./ProductClient";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type PageProps = {
  params: { slug: string };
};

/* ---------------- METADATA ---------------- */
export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  try {
    const apiUrl = `https://api.firstfemale.in/products/${params.slug}`;

    const res = await fetch(apiUrl, { cache: "no-store" });

    if (!res.ok) {
      return {
        title: "Product Not Found | FirstFemale",
        robots: "noindex",
      };
    }

    const product = await res.json();

    const image = product.img1
      ? `https://api.firstfemale.in/uploads/products/${product.img1}`
      : undefined;

    return {
      title: `${product.title} | FirstFemale`,
      description:
        product.description ||
        `Buy ${product.title} online at best price from FirstFemale.`,
      openGraph: {
        title: product.title,
        description: product.description,
        images: image ? [image] : [],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: product.title,
        description: product.description,
        images: image ? [image] : [],
      },
    };
  } catch {
    return {
      title: "Product | FirstFemale",
    };
  }
}

/* ---------------- PAGE ---------------- */
export default async function ProductPage({ params }: PageProps) {
  const apiUrl = `https://api.firstfemale.in/products/${params.slug}`;

  const res = await fetch(apiUrl, { cache: "no-store" });

  if (!res.ok) {
    notFound();
  }

  const product = await res.json();

  return <ProductClient product={product} />;
}
