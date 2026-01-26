"use client";

import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import OrderTracking from "@/components/OrderTracking";
import ReviewModal from "@/components/reviews/reviews";
import { FiPackage, FiMapPin, FiCreditCard, FiArrowLeft } from "react-icons/fi";

/* ---------- STATUS HELPER ---------- */
function getOrderStatusClass(status?: string) {
  switch (status) {
    case "PENDING": return "bg-amber-50 text-amber-600 border-amber-100";
    case "CONFIRMED": return "bg-blue-50 text-blue-600 border-blue-100";
    case "SHIPPED": return "bg-purple-50 text-purple-600 border-purple-100";
    case "DELIVERED": return "bg-emerald-50 text-emerald-600 border-emerald-100";
    case "CANCELLED": return "bg-rose-50 text-rose-600 border-rose-100";
    default: return "bg-gray-50 text-gray-600 border-gray-100";
  }
}

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reviewProduct, setReviewProduct] = useState<any>(null);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/my/${id}`);
      setOrder(res.data);
    } catch {
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-32 flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-brandPink border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Loading Order Details...</p>
      </div>
    );
  }

  if (!order) {
    return <div className="text-center py-20 text-red-500 font-bold uppercase tracking-widest">Order not found</div>;
  }

  // Calculate items total subtotal
  const itemsSubtotal = order.items.reduce(
    (sum: number, i: any) => sum + Number(i.price) * i.quantity,
    0
  );

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-12 bg-[#FCFAFA]">
      
      <button 
        onClick={() => router.push('/orders')} 
        className="mb-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-brandBlack transition-colors"
      >
        <FiArrowLeft /> Back to Orders
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT COLUMN: INFO & ITEMS */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* HEADER CARD */}
          <div className="bg-white border border-gray-100 p-8 rounded-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tighter">
                Order <span className="text-brandPink">#{order.id}</span>
              </h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getOrderStatusClass(order.status)}`}>
              {order.status}
            </span>
          </div>

          {/* TRACKING VISUAL */}
          <div className="bg-white border border-gray-100 p-8 rounded-sm">
             <OrderTracking status={order.status} />
          </div>

          {/* SHIPPING & PAYMENT INFO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-100 p-8 rounded-sm">
              <h2 className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                <FiMapPin className="text-brandPink" /> Delivery Address
              </h2>
              <div className="text-sm font-bold uppercase tracking-tight space-y-1">
                <p>{order.address?.name}</p>
                <p className="text-gray-500 font-medium normal-case">{order.address?.street}</p>
                <p className="text-gray-500 font-medium normal-case">{order.address?.city}, {order.address?.state} - {order.address?.pincode}</p>
                <p className="pt-2 text-[10px]">{order.address?.phone}</p>
              </div>
            </div>

            <div className="bg-white border border-gray-100 p-8 rounded-sm">
              <h2 className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                <FiCreditCard className="text-brandPink" /> Payment Details
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Method</p>
                  <p className="text-sm font-bold uppercase tracking-tight">{order.paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment"}</p>
                </div>
                <div>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Status</p>
                  <p className={`text-sm font-bold uppercase tracking-tight ${["CONFIRMED", "SHIPPED", "DELIVERED"].includes(order.status) ? 'text-emerald-600' : 'text-amber-500'}`}>
                    {["CONFIRMED", "SHIPPED", "DELIVERED"].includes(order.status) ? "Paid" : "Payment Pending"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ITEM LIST */}
          <div className="bg-white border border-gray-100 p-8 rounded-sm">
            <h2 className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-8 flex items-center gap-2">
              <FiPackage className="text-brandPink" /> Order Items
            </h2>
            <div className="divide-y divide-gray-50">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex justify-between py-6 first:pt-0 last:pb-0">
                  <div className="flex gap-4">
                    <img
                      src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/products/${item.product.img1}`}
                      alt={item.product.title}
                      className="w-16 h-20 rounded-sm object-cover bg-gray-50"
                    />
                    <div className="space-y-1">
                      <p className="text-xs font-black uppercase tracking-tight">{item.product.title}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] font-bold uppercase text-gray-400 tracking-widest">
                        {item.size && <span>Size: {item.size.size}</span>}
                        <span>Qty: {item.quantity}</span>
                      </div>
                      {order.status === "DELIVERED" && (
                        <button
                          onClick={() => setReviewProduct({ product: item.product, orderId: order.id })}
                          className="text-[10px] text-brandPink font-black uppercase tracking-widest underline mt-2 block"
                        >
                          Write a Review
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-brandBlack">₹{(item.price * item.quantity).toLocaleString()}</p>
                    {item.originalPrice > item.price && (
                      <p className="text-[10px] text-gray-300 line-through font-bold uppercase">₹{(item.originalPrice * item.quantity).toLocaleString()}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: PRICE SUMMARY & ACTIONS */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-brandPink/10 p-8 rounded-sm shadow-sm sticky top-24">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] border-b border-gray-50 pb-4 mb-8">Final Bill</h3>
            
            <div className="space-y-4 mb-10">
              <div className="flex justify-between text-xs font-bold uppercase tracking-tight">
                <span className="text-gray-400">Items Subtotal</span>
                <span>₹{itemsSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs font-bold uppercase tracking-tight">
                <span className="text-gray-400">Shipping Charges</span>
                <span className={order.shippingCharge === 0 ? "text-emerald-600 font-black" : "text-brandBlack"}>
                  {order.shippingCharge === 0 ? "FREE" : `₹${order.shippingCharge.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between text-xl pt-8 border-t border-gray-50">
                <span className="font-black uppercase tracking-tighter">Total Paid</span>
                <span className="font-black text-brandPink">₹{order.finalAmount.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-3">
              {order.status === "PENDING" && (
                <button
                  onClick={async () => {
                    if (!confirm("Are you sure you want to cancel this haul?")) return;
                    await api.put(`/orders/${order.id}/cancel`);
                    fetchOrder();
                  }}
                  className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-rose-500 border border-rose-100 hover:bg-rose-50 transition-all"
                >
                  Cancel Order
                </button>
              )}

              {["DELIVERED", "CANCELLED"].includes(order.status) && (
                <button
                  onClick={async () => {
                    await api.post(`/orders/${order.id}/reorder`);
                    router.push("/cart");
                  }}
                  className="w-full bg-brandBlack text-white py-4 text-[10px] font-black uppercase tracking-widest hover:bg-brandPink transition-all"
                >
                  Re-Order This Look
                </button>
              )}
            </div>
          </div>
        </aside>
      </div>

      {/* REVIEW MODAL */}
      {reviewProduct && (
        <ReviewModal
          product={reviewProduct.product}
          orderId={reviewProduct.orderId}
          onClose={() => setReviewProduct(null)}
          onSuccess={fetchOrder}
        />
      )}
    </div>
  );
}
