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
    // params.slug will be something like "test1-1"
    const fullSlug = params.slug;
    
    // Find the last dash to separate slug from ID
    const lastDashIndex = fullSlug.lastIndexOf('-');
    
    if (lastDashIndex === -1) {
      console.error("No dash found in slug:", fullSlug);
      notFound();
    }
    
    // Extract just the slug part (everything before last dash)
    const productSlug = fullSlug.substring(0, lastDashIndex);
    const productId = fullSlug.substring(lastDashIndex + 1);
    
    console.log("=== DEBUG ===");
    console.log("Full slug from URL:", fullSlug);
    console.log("Extracted slug:", productSlug);
    console.log("Extracted ID:", productId);
    
    // Try fetching by slug first
    const apiUrl = `https://api.firstfemale.in/products/${productSlug}`;
    console.log("Fetching from:", apiUrl);
    
    const res = await fetch(apiUrl, { 
      cache: "no-store",
      headers: {
        'Content-Type': 'application/json',
      }
    });

    console.log("Response status:", res.status);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("API Error Response:", errorText);
      notFound();
    }

    const product = await res.json();
    console.log("Product fetched successfully:", product.title);
    
    return <ProductClient product={product} />;
    
  } catch (error) {
    console.error("Fatal error in ProductPage:", error);
    // Return a more helpful error page
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Error Loading Product</h1>
        <p className="text-red-600">{String(error)}</p>
        <pre className="mt-4 p-4 bg-gray-100 rounded">
          {JSON.stringify({ slug: params.slug }, null, 2)}
        </pre>
      </div>
    );
  }
}
