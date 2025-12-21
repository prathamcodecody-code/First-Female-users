import ProductClient from "./ProductClient";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type PageProps = {
  params: { slug: string };
};

/* ---------------- SEO METADATA ---------------- */
export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const slug = params.slug;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products/${slug}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return {
      title: "Product Not Found | FirstFemale",
      description: "This product does not exist",
    };
  }

  const product = await res.json();

  return {
    title:
      product.metaTitle ||
      `${product.title} | Buy Online at Best Price`,
    description:
      product.metaDescription ||
      `Buy ${product.title} online at best price from FirstFemale.`,
    keywords:
      product.metaKeywords ||
      `${product.title}, women fashion, online shopping`,
    openGraph: {
      title: product.metaTitle || product.title,
      description: product.metaDescription,
      url: `https://first-female-users.vercel.app/products/${product.slug}-${product.id}`,
      images: product.img1
        ? [
            {
              url: `${process.env.NEXT_PUBLIC_API_URL}/uploads/products/${product.img1}`,
            },
          ]
        : [],
    },
  };
}

/* ---------------- PAGE ---------------- */
export default async function ProductPage({ params }: PageProps) {
  const slug = params.slug;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products/${slug}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return notFound();
  }

  const product = await res.json();

  if (!product?.id) {
    return notFound();
  }

  return <ProductClient product={product} />;
}
