"use client";

import { useRouter } from "next/navigation";
import { useCheckout } from "@/app/context/CheckoutContext";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import { FiMapPin, FiCreditCard, FiPackage, FiArrowLeft, FiShield } from "react-icons/fi";
import { motion } from "framer-motion";

export default function CheckoutReviewPage() {
  const router = useRouter();
  const { address, paymentMethod } = useCheckout();

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [preview, setPreview] = useState<any>(null);

  const [itemsTotal, setItemsTotal] = useState(0);
  const [shippingCharge, setShippingCharge] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);
  const [previewLoading, setPreviewLoading] = useState(true);

  const [couponDiscount, setCouponDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");

  useEffect(() => {
    if (!address) {
      router.replace("/checkout/address");
    }
  }, [address]);

  useEffect(() => {
    if (!paymentMethod) {
      router.replace("/checkout/payment");
    }
  }, [paymentMethod]);

  useEffect(() => {
    api.get("/cart").then((res) => {
      setCartItems(res.data.items || []);
    });
  }, []);

  useEffect(() => {
  if (!address || !paymentMethod) return;

  const loadPreview = async () => {
    try {
      setPreviewLoading(true);

      const res = await api.post("/orders/preview", {
        address,
        paymentMethod,
      });

      const p = res.data.pricing;

      setItemsTotal(p.itemsSubtotal);
      setShippingCharge(p.shipping);
      setCouponDiscount(p.couponDiscount || 0);
      setFinalAmount(p.payable);
      setAppliedCoupon(res.data.appliedCoupon || null);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Unable to calculate total");
    } finally {
      setPreviewLoading(false);
    }
  };

  loadPreview();
}, [address, paymentMethod]);


  const applyCoupon = async () => {
  if (!couponCode) return;

  setCouponLoading(true);
  setCouponError("");

  try {
    const res = await api.post("/orders/preview", {
      address,
      paymentMethod,
      couponCode,
    });

    const p = res.data.pricing;

    setItemsTotal(p.itemsSubtotal);
    setShippingCharge(p.shipping);
    setCouponDiscount(p.couponDiscount || 0);
    setFinalAmount(p.payable);
    setAppliedCoupon(res.data.appliedCoupon || null);
  } catch (err: any) {
    setCouponError(err.response?.data?.message || "Invalid coupon");
    setCouponDiscount(0);
    setAppliedCoupon(null);
  } finally {
    setCouponLoading(false);
  }
};


  const loadRazorpay = () =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const placeOrder = async () => {
    try {
      setLoading(true);
      setError("");

      // ================= COD =================
      if (paymentMethod === "COD") {
        const res = await api.post("/orders", {
          address,
          paymentMethod: "COD",
          couponCode: appliedCoupon || undefined, // ✅ FIXED: Use appliedCoupon, not couponCode
        });

        router.push(
          `/checkout/success?orderId=${res.data.orderId}&type=COD`
        );
        return;
      }

      // ================= ONLINE (RAZORPAY) =================
      const loaded = await loadRazorpay();
      if (!loaded) {
        setError("Failed to load Razorpay");
        return;
      }

      // ✅ Create Razorpay order using FINAL AMOUNT
      const rpRes = await api.post("/payments/razorpay/create-order", {
        amount: finalAmount,
      });

      const options = {
        key: rpRes.data.key,
        amount: rpRes.data.amount, // ✅ already in paise
        currency: "INR",
        name: "FirstFemale",
        order_id: rpRes.data.razorpayOrderId,

        handler: async (response: any) => {
          await api.post("/payments/razorpay/verify", {
            ...response,
            address,
            couponCode: appliedCoupon || undefined, // ✅ FIXED: Use appliedCoupon
          });

          router.push(`/checkout/success?type=RAZORPAY`);
        },

        modal: {
          ondismiss: () => {
            setError("Payment cancelled. No order was placed.");
          },
        },

        theme: { color: "#ec4899" },
      };

      new (window as any).Razorpay(options).open();
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Failed to place order"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!address || !paymentMethod) return null;

  return (
    <div className="bg-[#FCFAFA] min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-10 md:py-16">
        
        {/* PROGRESS STEPPER */}
        <header className="mb-16 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
             <span className="w-6 h-6 rounded-full border border-brandPink text-brandPink flex items-center justify-center text-[10px] font-black">1</span>
             <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">Shipping</span>
          </div>
          <div className="h-[1px] w-12 bg-brandPink" />
          <div className="flex items-center gap-2">
             <span className="w-6 h-6 rounded-full border border-brandPink text-brandPink flex items-center justify-center text-[10px] font-black">2</span>
             <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">Payment</span>
          </div>
          <div className="h-[1px] w-12 bg-brandPink" />
          <div className="flex items-center gap-2">
             <span className="w-6 h-6 rounded-full bg-brandPink text-white flex items-center justify-center text-[10px] font-black shadow-lg shadow-brandPink/20">3</span>
             <span className="text-[11px] font-black uppercase tracking-widest text-brandBlack">Review</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* LEFT: REVIEW DETAILS */}
          <div className="lg:col-span-8 space-y-8">
            <header className="mb-4">
              <h1 className="text-3xl font-black uppercase tracking-tighter text-brandBlack italic font-serif">
                Review Order
              </h1>
              <p className="text-xs text-gray-400 uppercase tracking-widest mt-2">One last look before it&apos;s yours</p>
            </header>

            {/* ADDRESS & PAYMENT SUMMARY */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-8 border border-gray-100 rounded-sm">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-[11px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                    <FiMapPin className="text-brandPink" /> Shipping to
                  </h2>
                  <button onClick={() => router.push("/checkout/address")} className="text-[9px] font-bold uppercase underline">Change</button>
                </div>
                <div className="text-sm font-bold uppercase tracking-tight space-y-1">
                  <p>{address.name}</p>
                  <p className="text-gray-500 font-medium lowercase tracking-normal">{address.street}</p>
                  <p className="text-gray-500 font-medium lowercase tracking-normal">{address.city}, {address.state} - {address.pincode}</p>
                  <p className="pt-2 text-[10px]">{address.phone}</p>
                </div>
              </div>

              <div className="bg-white p-8 border border-gray-100 rounded-sm">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-[11px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                    <FiCreditCard className="text-brandPink" /> Payment Method
                  </h2>
                  <button onClick={() => router.push("/checkout/payment")} className="text-[9px] font-bold uppercase underline">Change</button>
                </div>
                <p className="text-sm font-bold uppercase tracking-tight">
                  {paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment"}
                </p>
                <p className="text-[10px] text-gray-400 uppercase mt-2 font-medium tracking-widest">Secure transaction</p>
              </div>
            </div>

            {/* ITEM LIST */}
            <div className="bg-white border border-gray-100 p-8 rounded-sm">
              <h2 className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-8 flex items-center gap-2">
                <FiPackage className="text-brandPink" /> Your Items
              </h2>
              <div className="divide-y divide-gray-50">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between py-6 first:pt-0 last:pb-0">
                    <div className="flex gap-4">
                      <div className="w-16 h-20 bg-gray-50 rounded-sm overflow-hidden flex-shrink-0">
                         <img 
                           src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/products/${item.product.img1}`} 
                           className="w-full h-full object-cover" 
                           alt={item.product.title} 
                         />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-black uppercase tracking-tight">{item.product.title}</p>
                        <div className="flex gap-3 text-[10px] font-bold uppercase text-gray-400 tracking-widest">
                          {item.size && <span>Size: {item.size.size}</span>}
                          <span>Qty: {item.quantity}</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm font-black text-brandBlack">₹{(Number(item.price) * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: PRICE SUMMARY STICKY */}
          <aside className="lg:col-span-4 h-fit lg:sticky lg:top-24">
            <div className="bg-white border border-brandPink/10 p-8 rounded-sm shadow-sm">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] border-b border-gray-50 pb-4 mb-8">Price Summary</h3>

              {previewLoading ? (
                <div className="py-10 flex flex-col items-center gap-4 animate-pulse">
                   <div className="h-2 w-full bg-gray-50" />
                   <div className="h-2 w-full bg-gray-50" />
                   <p className="text-[10px] font-bold uppercase text-gray-300">Calculating your vibe...</p>
                </div>
              ) : (
                <div className="space-y-4 mb-10">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-tight">
                    <span className="text-gray-400">Subtotal</span>
                    <span>₹{(itemsTotal || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold uppercase tracking-tight">
                    <span className="text-gray-400">Shipping</span>
                    <span className={shippingCharge === 0 ? "text-green-600 font-black text-[10px]" : ""}>
                      {shippingCharge === 0 ? "FREE" : `₹${shippingCharge}`}
                    </span>
                  </div>
                  
                  <div className="border-t pt-6 space-y-3">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                      Apply Coupon
                    </p>

                    <div className="flex gap-2">
                      <input
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Enter coupon code"
                        className="flex-1 border px-3 py-2 rounded text-sm"
                        disabled={!!appliedCoupon}
                      />

                      <button
                        onClick={applyCoupon}
                        disabled={couponLoading || !!appliedCoupon}
                        className="px-4 bg-black text-white rounded text-sm disabled:bg-gray-300"
                      >
                        {couponLoading ? "..." : appliedCoupon ? "Applied" : "Apply"}
                      </button>
                    </div>

                    {couponError && (
                      <p className="text-xs text-red-500">{couponError}</p>
                    )}
                    
                    {appliedCoupon && (
                      <div className="flex items-center justify-between text-xs text-green-600 font-bold">
                        <span>✓ Coupon Applied: {appliedCoupon}</span>
                        <button 
                          onClick={() => {
                            setAppliedCoupon(null);
                            setCouponDiscount(0);
                            setCouponCode("");
                            // Reload preview without coupon
                            api.post("/orders/preview", { address, paymentMethod }).then(res => {
                              setItemsTotal(res.data.itemsTotal);
                              setShippingCharge(res.data.shippingCharge);
                              setFinalAmount(res.data.finalAmount);
                            });
                          }}
                          className="text-red-500 underline text-[10px]"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                  </div>

                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-xs font-bold uppercase tracking-tight text-green-600">
                      <span>Coupon Discount</span>
                      <span>- ₹{couponDiscount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-xl pt-8 border-t border-gray-50">
                    <span className="font-black uppercase tracking-tighter">Total Payable</span>
                    <span className="font-black text-brandPink">₹{finalAmount.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {error && <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mb-6 p-3 bg-red-50 border border-red-100 text-center">{error}</p>}

              <button
                onClick={placeOrder}
                disabled={loading || previewLoading}
                className="w-full bg-brandPink text-white py-5 rounded-sm font-black uppercase tracking-[0.3em] text-[12px] shadow-xl hover:bg-brandBlack transition-all active:scale-95 disabled:bg-gray-200"
              >
                {loading ? "Processing Order..." : "Confirm & Place Order"}
              </button>

              <div className="mt-8 flex items-center justify-center gap-2 text-[9px] font-black uppercase tracking-widest text-gray-300">
                 <FiShield size={12} /> Secure Checkout Guaranteed
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
