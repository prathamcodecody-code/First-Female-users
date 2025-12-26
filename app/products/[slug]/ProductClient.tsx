"use client";

import { useEffect, useState } from "react";
import ProductImages from "@/components/ProductImages";
import AddToCartButton from "@/components/cart/AddToCartButton";
import TrendingNow from "@/components/TrendingSection";
import NewArrivals from "@/components/NewArrivals";
import { api } from "@/lib/api";


export default function ProductClient({ product }: any) {

  console.log("Product data:", product);
  console.log("Images:", {
    img1: product.img1,
    img2: product.img2,
    img3: product.img3,
    img4: product.img4
  });

  const sizes = Array.isArray(product.sizes) ? product.sizes : [];

  const [reviews, setReviews] = useState<any[]>([]);
  const [avg, setAvg] = useState<number | null>(null);

  const isOutOfStock = product.stock <= 0;
  const [selectedSize, setSelectedSize] = useState<any>(null);

const price = Number(product.price) || 0;
const discountType = product.discountType;
const discountValue = Number(product.discountValue || 0);

let finalPrice = price;
let discountLabel = null;
let savings = 0;

if (discountType === "PERCENT" && discountValue > 0) {
  savings = (price * discountValue) / 100;
  finalPrice = price - savings;
  discountLabel = `${discountValue}% off`;
}

if (discountType === "FLAT" && discountValue > 0) {
  savings = discountValue;
  finalPrice = price - discountValue;
  discountLabel = `₹${discountValue} off`;
}

finalPrice = Math.max(0, Math.round(finalPrice));
savings = Math.round(savings);


  useEffect(() => {
    api
      .get(`/reviews/product/${product.id}`)
      .then((res) => {
        setReviews(res.data.reviews || []);
        setAvg(res.data.averageRating);
      })
      .catch(() => {
        setReviews([]);
        setAvg(null);
      });
  }, [product.id]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">

      {/* PRODUCT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-14">

        <ProductImages
  images={[
    product.img1,
    product.img2,
    product.img3,
    product.img4,
  ].filter(Boolean)} // This will remove null/undefined values
/>

        <div className="space-y-8">

          <div className="space-y-0.5">
  <h1 className="text-3xl md:text-4xl font-bold leading-tight">
    {product.title}
  </h1>
  <p className="text-sm text-gray-500">
    {product.category?.name}
  </p>
</div>

{/* PRICE WITH GLOBAL 60% DISCOUNT */}
<div className="space-y-0.5 mt-2">
  <div className="flex items-center gap-3">
    {/* FINAL PRICE */}
    <span className="text-4xl font-bold text-brandPink">
      ₹{finalPrice}
    </span>

    {/* ORIGINAL PRICE */}
    {discountLabel && (
      <span className="text-lg text-gray-400 line-through">
        ₹{price}
      </span>
    )}

    {/* DISCOUNT BADGE */}
    {discountLabel && (
      <span className="text-sm font-semibold text-green-600">
        {discountLabel}
      </span>
    )}
  </div>

  <div className="flex items-center gap-2 text-sm">
    {discountLabel && (
      <span className="text-green-600 font-medium">
        You save ₹{savings}
      </span>
    )}
    <span className="text-gray-500">
      Inclusive of all taxes
    </span>
  </div>



</div>


{isOutOfStock ? (
  <span className="text-red-600 font-semibold">
    Out of Stock
  </span>
) : (
  <span className="text-green-600 text-sm">
    In Stock ({product.stock} left)
  </span>
)}


          {sizes.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Select Size</h3>
              <div className="flex gap-3 flex-wrap">
               {sizes.map((s: any) => (
  <button
    key={s.id}
    disabled={s.stock <= 0}
    onClick={() => setSelectedSize(s)}
    className={`
      px-4 py-2 border rounded
      ${selectedSize?.id === s.id ? "border-brandPink" : ""}
      ${s.stock <= 0 ? "opacity-40 cursor-not-allowed" : "hover:border-brandPink"}
    `}
  >
    {s.size}
  </button>
))}
              </div>
            </div>
          )}

<AddToCartButton
  productId={product.id}
  stock={product.stock}
  sizeId={selectedSize?.id}
  disabled={sizes.length > 0 && !selectedSize}
/>


          <div className="pt-4 border-t">
            <h3 className="font-semibold mb-2">Product Details</h3>
            <p className="text-gray-600">
              {product.description || "No description available."}
            </p>
          </div>

        </div>
      </div>

      {/* REVIEWS */}
      {reviews.length > 0 && (
  <div className="mt-16">
    <h2 className="text-xl font-bold mb-4">
      Customer Reviews
      {avg && (
        <span className="ml-2 text-sm text-gray-500">
          ({avg} ★)
        </span>
      )}
    </h2>

    <div className="space-y-4">
      {reviews.map((r) => (
        <div
          key={r.id}
          className="bg-white p-4 rounded-xl shadow-sm"
        >
          <p className="font-semibold">
            {r.user?.name || "User"}
          </p>

          <p className="text-sm text-gray-500">
            {"★".repeat(r.rating)}
          </p>

          {r.comment && (
            <p className="mt-2 text-gray-700">
              {r.comment}
            </p>
          )}
        </div>
      ))}
    </div>
  </div>
)}


      {/* RECOMMENDATIONS */}
      <div className="mt-24">
        <TrendingNow />
      </div>

      <div className="mt-16">
        <NewArrivals />
      </div>

    </div>
  );
}
