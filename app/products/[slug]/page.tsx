export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

import ProductClient from "./ProductClient";
import { notFound } from "next/navigation";

type PageProps = {
  params: { slug: string };
};

export default async function ProductPage({ params }: PageProps) {
  try {
    // Extract slug from "slug-id" format
    const lastDashIndex = params.slug.lastIndexOf('-');
    
    if (lastDashIndex === -1) {
      notFound();
    }
    
    const actualSlug = params.slug.substring(0, lastDashIndex);
    
    // Use NEXT_PUBLIC_API_URL or fallback to hardcoded URL
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.firstfemale.in';
    const apiUrl = `${apiBaseUrl}/products/${actualSlug}`;
    
    console.log("📦 Fetching:", apiUrl);
    
    const res = await fetch(apiUrl, { 
      cache: "no-store",
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (!res.ok) {
      console.error("❌ API Error:", res.status, await res.text());
      notFound();
    }

    const product = await res.json();
    return <ProductClient product={product} />;
    
  } catch (error) {
    console.error("💥 ProductPage Error:", error);
    notFound();
  }
}
