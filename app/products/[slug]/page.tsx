export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

import ProductClient from "./ProductClient";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductPage({ params }: PageProps) {
  try {
    const { slug } = await params;
    
    console.log("📦 Full slug:", slug);
    
    // Send the FULL slug (test1-1) to backend as-is
    const apiUrl = `https://api.firstfemale.in/products/${slug}`;
    console.log("📦 Fetching from:", apiUrl);
    
    const res = await fetch(apiUrl, { 
      cache: "no-store",
      headers: {
        'Content-Type': 'application/json',
      }
    });

    console.log("📦 Response status:", res.status);

    if (!res.ok) {
      console.error("❌ API Error:", res.status);
      notFound();
    }

    const product = await res.json();
    console.log("✅ Product loaded:", product.title);
    
    return <ProductClient product={product} />;
    
  } catch (error) {
    console.error("💥 Error in ProductPage:", error);
    notFound();
  }
}
