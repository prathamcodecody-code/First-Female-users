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
console.log("📦 Full params.slug:", params.slug);

// Extract the actual slug by removing the ID suffix
const slugParts = params.slug.split('-');
console.log("📦 Split parts:", slugParts);

const actualSlug = slugParts.slice(0, -1).join('-');
console.log("📦 Actual slug:", actualSlug);

const apiUrl = `${process.env.API_URL}/products/${actualSlug}`;
console.log("📦 Fetching from:", apiUrl);

const res = await fetch(apiUrl, {
cache: "no-store",
headers: {
'Content-Type': 'application/json',
}
});

console.log("📦 Response status:", res.status);

if (!res.ok) {
console.error("❌ Fetch failed:", res.status, res.statusText);
notFound();
}

const product = await res.json();
console.log("✅ Product fetched:", product.title);

return <ProductClient product={product} />;
} catch (error) {
console.error("💥 Error in ProductPage:", error);
throw error; // Re-throw to trigger Next.js error page
}
}
