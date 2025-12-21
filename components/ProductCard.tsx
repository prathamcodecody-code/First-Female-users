"use client";

import Link from "next/link";
import AddToCartButton from "@/components/cart/AddToCartButton";
import AddToWishlistButton from "@/components/wishlist/AddToWishlistButton";

type Product = {
  id: number;
  slug?: string;
  title: string;
  brand?: string;
  price: number | string;
  discountType?: "PERCENT" | "FLAT" | null;
  discountValue?: number | null;
  rating?: number;
  reviewCount?: number;
  img1?: string | null;
  stock?: number;
};

export default function ProductCard({ product }: { product?: Product }) {
  if (!product) return null;

  const imageUrl = product.img1
    ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/products/${product.img1}`
    : "/placeholder.png";

  const productUrl =
  product.slug && product.id
    ? `/products/${product.slug}-${product.id}`
    : `/products/${product.id}`;
    
  const price = Number(product.price) || 0;

  // ---------- DISCOUNT LOGIC ----------
  let finalPrice = price;
  let discountText: string | null = null;

  if (product.discountType === "PERCENT" && product.discountValue) {
    finalPrice = Math.round(price - (price * product.discountValue) / 100);
    discountText = `${product.discountValue}% OFF`;
  }

  if (product.discountType === "FLAT" && product.discountValue) {
    finalPrice = Math.max(0, price - product.discountValue);
    discountText = `₹${product.discountValue} OFF`;
  }

  const hasDiscount = finalPrice < price;
  // -----------------------------------

  return (
    <div className="relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">

      {/* ❤️ Wishlist */}
      <AddToWishlistButton productId={product.id} />

      <Link href={productUrl} className="block">

        {/* IMAGE */}
        <div className="relative w-full h-64 bg-gray-100 overflow-hidden">

          {/* AD / BRAND TAG */}
          
          {/* RATING */}
          {product.rating && (
            <div className="absolute bottom-2 left-2 bg-white text-xs px-2 py-1 rounded flex items-center gap-1 shadow">
              <span className="font-semibold">{product.rating}</span>
              <span className="text-green-600">★</span>
              {product.reviewCount && (
                <span className="text-gray-500">| {product.reviewCount}</span>
              )}
            </div>
          )}

          <img
            src={imageUrl}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* INFO */}
        <div className="p-3 space-y-1">

        
          {/* TITLE */}
          <h3 className="text-sm text-gray-700 line-clamp-2">
            {product.title}
          </h3>

          {/* PRICE */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900">
              ₹{finalPrice}
            </span>

            {hasDiscount && (
              <>
                <span className="text-xs text-gray-400 line-through">
                  ₹{price}
                </span>
                <span className="text-xs text-orange-600 font-semibold">
                  ({discountText})
                </span>
              </>
            )}
          </div>

        </div>
      </Link>

      {/* ADD TO CART */}
      <div className="px-3 pb-3">
        <AddToCartButton
          productId={product.id}
          stock={product.stock ?? 0}
        />
      </div>
    </div>
  );
}
