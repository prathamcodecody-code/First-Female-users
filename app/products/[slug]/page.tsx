export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

import ProductClient from "./ProductClient";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ slug: string }>; // In Next.js 15, params is a Promise
};

export default async function ProductPage({ params }: PageProps) {
  try {
    // Await params in Next.js 15
    const { slug } = await params;
    
    console.log("📦 Received slug:", slug);
    
    if (!slug) {
      console.error("❌ Slug is undefined");
      notFound();
    }
    
    // Extract slug from "slug-id" format
    const lastDashIndex = slug.lastIndexOf('-');
    
    if (lastDashIndex === -1) {
      console.error("❌ No dash found in:", slug);
      notFound();
    }
    
    const productSlug = slug.substring(0, lastDashIndex);
    
    console.log("📦 Extracted product slug:", productSlug);
    
    const apiUrl = `https://api.firstfemale.in/products/${productSlug}`;
    console.log("📦 Fetching from:", apiUrl);
    
    const res = await fetch(apiUrl, { 
      cache: "no-store",
      headers: {
        'Content-Type': 'application/json',
      }
    });

    console.log("📦 Response status:", res.status);

    if (!res.ok) {
      console.error("❌ API returned:", res.status);
      notFound();
    }

    const product = await res.json();
    console.log("✅ Product loaded:", product.title);
    
    return <ProductClient product={product} />;
    
  } catch (error) {
    console.error("💥 Error:", error);
    notFound();
  }
}
