import ProductClient from "./ProductClient";
import { Metadata } from "next";

type PageProps = {
  params: Promise<{ slug: string }>;
};

/* ---------------- SEO METADATA ---------------- */
export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const { slug } = await params;

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
      url: `https://firstfemale.com/products/${product.slug}-${product.id}`,
      images: [product.img1],
    },
  };
}

/* ---------------- PAGE ---------------- */
export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products/${slug}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return (
      <div className="p-10 text-center text-gray-500">
        Product not found.
      </div>
    );
  }

  const product = await res.json();
  return <ProductClient product={product} />;
}
