"use client";

import { useEffect, useState } from "react";
import ProductImages from "@/components/ProductImages";
import AddToCartButton from "@/components/cart/AddToCartButton";
import TrendingNow from "@/components/TrendingSection";
import NewArrivals from "@/components/NewArrivals";
import { api } from "@/lib/api";
import { FiShield, FiTruck, FiRefreshCw } from "react-icons/fi"; // Added for trust badges

export default function ProductClient({ product }: any) {
  const SIZE_ORDER: Record<string, number> = {
    XS: 1, S: 2, M: 3, L: 4, XL: 5, XXL: 6, "3XL": 7, "Free Size": 8,
  };

  const sizes = Array.isArray(product.sizes)
    ? [...product.sizes].sort((a, b) => (SIZE_ORDER[a.size] ?? 999) - (SIZE_ORDER[b.size] ?? 999))
    : [];

  const [reviews, setReviews] = useState<any[]>([]);
  const [avg, setAvg] = useState<number | null>(null);
  const [selectedSize, setSelectedSize] = useState<any>(null);

  const isOutOfStock = product.stock <= 0;
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
  } else if (discountType === "FLAT" && discountValue > 0) {
    savings = discountValue;
    finalPrice = price - discountValue;
    discountLabel = `₹${discountValue} off`;
  }

  finalPrice = Math.max(0, Math.round(finalPrice));
  savings = Math.round(savings);

  useEffect(() => {
    api.get(`/reviews/product/${product.id}`)
      .then((res) => {
        setReviews(res.data.reviews || []);
        setAvg(res.data.averageRating);
      })
      .catch(() => { setReviews([]); setAvg(null); });
  }, [product.id]);

  return (
    <div className="w-full bg-white pb-24 md:pb-12">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-6 md:py-12">
        
        {/* BREADCRUMB - Subtle Gen-Z detail */}
        <nav className="text-[10px] uppercase tracking-widest text-gray-400 mb-6 hidden md:block">
          Home / {product.category?.name} / <span className="text-black font-bold">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          
          {/* LEFT: IMAGES (Sticky on Desktop) */}
          <div className="lg:col-span-7 h-fit lg:sticky lg:top-24">
            <ProductImages
              images={[product.img1, product.img2, product.img3, product.img4].filter(Boolean)}
            />
          </div>

          {/* RIGHT: PRODUCT INFO */}
          <div className="lg:col-span-5 space-y-8">
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                 <span className="bg-brandPinkLight text-brandPink text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-tighter">
                    Trending Now
                 </span>
                <span className="text-xs font-bold">★ {5}</span>
              </div>
              <h1 className="text-2xl md:text-4xl font-bold text-brandBlack leading-tight tracking-tight uppercase">
                {product.title}
              </h1>
              <p className="text-gray-400 text-xs md:text-sm tracking-widest uppercase font-medium">
                Style ID: FF-{product.id}026
              </p>
            </div>

            {/* PRICE SECTION */}
            <div className="bg-brandCream p-4 md:p-6 rounded-sm border border-brandPink/10">
              <div className="flex items-baseline gap-4">
                <span className="text-3xl md:text-5xl font-black text-brandPink">
                  ₹{finalPrice.toLocaleString()}
                </span>
                {discountLabel && (
                  <span className="text-lg text-gray-400 line-through decoration-brandRed">
                    ₹{price.toLocaleString()}
                  </span>
                )}
              </div>
              {discountLabel && (
                <div className="mt-2 flex items-center gap-2">
                   <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 uppercase rounded-full">
                     {discountLabel}
                   </span>
                   <p className="text-xs text-green-600 font-bold tracking-tight">
                     You&apos;re saving ₹{savings.toLocaleString()}!
                   </p>
                </div>
              )}
            </div>

            {/* SIZE SELECTOR - Enhanced UI */}
            {sizes.length > 0 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-brandBlack">Select Size</h3>
                  <button className="text-[10px] font-bold text-brandPink underline uppercase tracking-tighter">Size Guide</button>
                </div>
                <div className="flex gap-3 flex-wrap">
                  {sizes.map((s: any) => (
                    <button
                      key={s.id}
                      disabled={s.stock <= 0}
                      onClick={() => setSelectedSize(s)}
                      className={`
                        min-w-[50px] h-[50px] flex items-center justify-center border-2 text-xs font-bold transition-all duration-300
                        ${selectedSize?.id === s.id ? "border-brandPink bg-brandPink text-white" : "border-gray-100 text-brandBlack hover:border-brandPink"}
                        ${s.stock <= 0 ? "opacity-30 cursor-not-allowed bg-gray-50" : ""}
                      `}
                    >
                      {s.size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STOCK STATUS */}
            <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full animate-pulse ${isOutOfStock ? 'bg-red-500' : 'bg-green-500'}`} />
                <span className={`text-[10px] font-bold uppercase tracking-widest ${isOutOfStock ? 'text-red-500' : 'text-green-600'}`}>
                    {isOutOfStock ? 'Out of Stock' : `Hurry! Only ${product.stock} pieces left`}
                </span>
            </div>

            {/* DESKTOP ADD TO CART */}
            <div className="hidden md:block">
               <AddToCartButton
                productId={product.id}
                stock={product.stock}
                sizeId={selectedSize?.id}
                disabled={false}
              />
            </div>

            {/* TRUST BADGES - Very Gen-Z/E-com style */}
            <div className="grid grid-cols-3 gap-2 pt-6 border-t border-gray-100">
               <div className="flex flex-col items-center text-center space-y-1">
                  <FiTruck className="text-brandPink" />
                  <span className="text-[9px] font-bold uppercase tracking-tighter text-gray-500">Fast Delivery</span>
               </div>
               <div className="flex flex-col items-center text-center space-y-1 border-x border-gray-100">
                  <FiRefreshCw className="text-brandPink" />
                  <span className="text-[9px] font-bold uppercase tracking-tighter text-gray-500">7-Day Return</span>
               </div>
               <div className="flex flex-col items-center text-center space-y-1">
                  <FiShield className="text-brandPink" />
                  <span className="text-[9px] font-bold uppercase tracking-tighter text-gray-500">100% Original</span>
               </div>
            </div>

            {/* PRODUCT DETAILS */}
            <div className="pt-8 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-brandBlack border-b border-gray-100 pb-2">Description</h3>
              <p className="text-sm text-gray-600 leading-relaxed font-medium">
                {product.description || "Every main character needs the perfect fit. This piece is designed to keep you at the center of attention with premium fabric and a silhouette that slays."}
              </p>
            </div>
          </div>
        </div>

        {/* MOBILE STICKY ACTION BAR */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 z-[90] flex items-center gap-4 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
            <div className="flex-1">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Total Price</p>
                <p className="text-lg font-black text-brandPink">₹{finalPrice.toLocaleString()}</p>
            </div>
            <div className="flex-[2]">
                <AddToCartButton
                    productId={product.id}
                    stock={product.stock}
                    sizeId={selectedSize?.id}
                    disabled={false}
                />
            </div>
        </div>

        {/* REVIEWS SECTION */}
        {reviews.length > 0 && (
          <div className="mt-20 md:mt-32">
            <div className="flex items-center gap-4 mb-10">
                <h2 className="text-xl md:text-3xl font-black uppercase tracking-tighter">Real Reviews</h2>
                <div className="flex-1 h-px bg-gray-100" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((r) => (
                <div key={r.id} className="bg-brandCream/50 p-6 rounded-sm border border-gray-50">
                  <div className="flex justify-between items-start mb-4">
                    <p className="font-black text-xs uppercase tracking-widest">{r.user?.name || "Verified Lady"}</p>
                    <div className="flex text-brandPink text-xs">{"★".repeat(r.rating)}</div>
                  </div>
                  <p className="text-sm text-gray-600 font-medium italic">
                    &quot;{r.comment}&quot;
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RECOMMENDATIONS */}
        <div className="mt-24 md:mt-40 space-y-24">
          <TrendingNow />
          <NewArrivals />
        </div>
      </div>
    </div>
  );
}
