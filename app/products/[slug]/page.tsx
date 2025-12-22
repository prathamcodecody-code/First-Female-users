export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

import ProductClient from "./ProductClient";
import { notFound } from "next/navigation";
import { Metadata } from "next";

type PageProps = {
  params: Promise<{ slug: string }>;
};

// Helper function to fetch product data
async function getProduct(slug: string) {
  const apiUrl = `https://api.firstfemale.in/products/${slug}`;
  
  const res = await fetch(apiUrl, { 
    cache: "no-store",
    headers: {
      'Content-Type': 'application/json',
    }
  });

  if (!res.ok) {
    return null;
  }

  return res.json();
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  // Calculate final price
  const price = Number(product.price) || 0;
  let finalPrice = price;

  if (product.discountType === "PERCENT" && product.discountValue) {
    finalPrice = Math.round(price - (price * product.discountValue) / 100);
  }
  if (product.discountType === "FLAT" && product.discountValue) {
    finalPrice = Math.max(0, price - product.discountValue);
  }

  // Build image URL
  const imageUrl = product.img1
    ? `https://api.firstfemale.in/uploads/products/${product.img1}`
    : "https://first-female-users.vercel.app/placeholder.png";

  // Create description
  const description = product.description 
    ? product.description.substring(0, 160) 
    : `Buy ${product.title} online at FirstFemale. ${product.category?.name || ''} ${product.type?.name || ''} ${product.subtype?.name || ''}. Price: ₹${finalPrice}`;

  return {
    title: `${product.title} | FirstFemale`,
    description: description,
    keywords: [
      product.title,
      product.category?.name,
      product.type?.name,
      product.subtype?.name,
      "women fashion",
      "online shopping",
      "FirstFemale"
    ].filter(Boolean).join(", "),
    
    // Open Graph (Facebook, LinkedIn)
    openGraph: {
      title: product.title,
      description: description,
      type: "website",
      url: `https://first-female-users.vercel.app/products/${slug}`,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: product.title,
        }
      ],
      siteName: "FirstFemale",
    },

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description: description,
      images: [imageUrl],
    },

    // Additional metadata
    robots: {
      index: product.stock > 0,
      follow: true,
    },

    // Product-specific structured data
    other: {
      "product:price:amount": finalPrice.toString(),
      "product:price:currency": "INR",
      "product:availability": product.stock > 0 ? "in stock" : "out of stock",
    },
  };
}

// Generate JSON-LD structured data for rich snippets
function generateProductJsonLd(product: any, slug: string) {
  const price = Number(product.price) || 0;
  let finalPrice = price;

  if (product.discountType === "PERCENT" && product.discountValue) {
    finalPrice = Math.round(price - (price * product.discountValue) / 100);
  }
  if (product.discountType === "FLAT" && product.discountValue) {
    finalPrice = Math.max(0, price - product.discountValue);
  }

  const imageUrl = product.img1
    ? `https://api.firstfemale.in/uploads/products/${product.img1}`
    : "https://first-female-users.vercel.app/placeholder.png";

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: imageUrl,
    description: product.description || product.title,
    sku: product.id.toString(),
    brand: {
      "@type": "Brand",
      name: "FirstFemale"
    },
    offers: {
      "@type": "Offer",
      url: `https://first-female-users.vercel.app/products/${slug}`,
      priceCurrency: "INR",
      price: finalPrice,
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      availability: product.stock > 0 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition"
    },
    category: [
      product.category?.name,
      product.type?.name,
      product.subtype?.name
    ].filter(Boolean).join(" > ")
  };
}

export default async function ProductPage({ params }: PageProps) {
  try {
    const { slug } = await params;
    
    console.log("📦 Full slug:", slug);
    
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
    
    // Generate JSON-LD
    const jsonLd = generateProductJsonLd(product, slug);
    
    return (
      <>
        {/* JSON-LD Structured Data for Google Rich Snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        <ProductClient product={product} />
      </>
    );
    
  } catch (error) {
    console.error("💥 Error in ProductPage:", error);
    notFound();
  }
}
