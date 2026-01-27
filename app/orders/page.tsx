"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import { FiPackage, FiChevronRight, FiClock, FiCheckCircle, FiTruck, FiXCircle, FiTag } from "react-icons/fi";

export default function OrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const limit = 5;

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders/my", {
        params: { page, limit },
      });
      setOrders(res.data.orders || []);
      setPages(res.data.pages || 1);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page]);

  function getStatusStyle(status?: string) {
    switch (status) {
      case "PENDING":
        return { 
          bg: "bg-amber-50", 
          text: "text-amber-600", 
          icon: <FiClock />, 
          border: "border-amber-100" 
        };
      case "CONFIRMED":
        return { 
          bg: "bg-blue-50", 
          text: "text-blue-600", 
          icon: <FiCheckCircle />, 
          border: "border-blue-100" 
        };
      case "SHIPPED":
        return { 
          bg: "bg-purple-50", 
          text: "text-purple-600", 
          icon: <FiTruck />, 
          border: "border-purple-100" 
        };
      case "DELIVERED":
        return { 
          bg: "bg-emerald-50", 
          text: "text-emerald-600", 
          icon: <FiCheckCircle />, 
          border: "border-emerald-100" 
        };
      case "CANCELLED":
        return { 
          bg: "bg-rose-50", 
          text: "text-rose-600", 
          icon: <FiXCircle />, 
          border: "border-rose-100" 
        };
      default:
        return { 
          bg: "bg-gray-50", 
          text: "text-gray-600", 
          icon: <FiPackage />, 
          border: "border-gray-100" 
        };
    }
  }

  if (loading) {
    return (
      <div className="max-w-[1440px] mx-auto px-4 py-32 flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 border-2 border-brandPink border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Fetching your drip...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#FCFAFA] min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-12 md:py-20">
        
        <header className="mb-12">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-brandBlack italic font-serif">
            Order History
          </h1>
          <p className="text-xs text-gray-400 uppercase tracking-widest mt-2">Track your latest hauls</p>
        </header>

        {orders.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-200 py-24 text-center rounded-sm">
            <FiPackage className="mx-auto text-gray-200 w-12 h-12 mb-4" />
            <h2 className="text-xl font-bold uppercase tracking-tight mb-2">No Orders Yet</h2>
            <p className="text-gray-400 text-sm mb-8">Ready to start your first main character moment?</p>
            <button 
              onClick={() => router.push('/')}
              className="bg-brandBlack text-white px-10 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-brandPink transition-all"
            >
              Shop New Arrivals
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((o) => {
              const style = getStatusStyle(o.status);
              const subtotal = o.totalAmount + o.shippingCharge; // Items + Shipping
              
              return (
                <div
                  key={o.id}
                  onClick={() => router.push(`/orders/${o.id}`)}
                  className="group bg-white border border-gray-100 p-6 md:p-8 rounded-sm hover:border-brandPink transition-all cursor-pointer shadow-sm"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    
                    <div className="space-y-4 flex-1">
                      <div className="flex items-center gap-4">
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${style.bg} ${style.text} ${style.border} text-[10px] font-black uppercase tracking-widest`}>
                          {style.icon} {o.status}
                        </div>
                        <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">
                          {new Date(o.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-lg font-black uppercase tracking-tighter mb-3">
                          Order <span className="text-brandPink">#{o.id}</span>
                        </h3>
                        
                        {/* Price Breakdown */}
                        <div className="space-y-1.5 text-[11px] font-bold">
                          <div className="flex items-center justify-between md:justify-start md:gap-3">
                            <span className="text-gray-400 uppercase tracking-widest">Items:</span>
                            <span className="text-gray-600">₹{o.totalAmount.toLocaleString()}</span>
                          </div>
                          
                          {o.shippingCharge > 0 && (
                            <div className="flex items-center justify-between md:justify-start md:gap-3">
                              <span className="text-gray-400 uppercase tracking-widest">Shipping:</span>
                              <span className="text-gray-600">₹{o.shippingCharge.toLocaleString()}</span>
                            </div>
                          )}
                          
                          {o.couponDiscount > 0 && (
                            <div className="flex items-center justify-between md:justify-start md:gap-3">
                              <span className="text-green-600 uppercase tracking-widest flex items-center gap-1">
                                <FiTag size={10} /> Coupon:
                              </span>
                              <span className="text-green-600 font-black">-₹{o.couponDiscount.toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-6 md:gap-10 border-t md:border-t-0 pt-4 md:pt-0">
                      <div className="text-right">
                         <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mb-1">Total Paid</p>
                         <p className="text-2xl font-black text-brandBlack">₹{o.finalAmount.toLocaleString()}</p>
                         {o.couponDiscount > 0 && (
                           <p className="text-[9px] text-green-600 font-bold mt-1">
                             Saved ₹{o.couponDiscount.toLocaleString()}
                           </p>
                         )}
                      </div>
                      <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-brandPink group-hover:text-white transition-all flex-shrink-0">
                        <FiChevronRight size={20} />
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* PAGINATION */}
        {pages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-16">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="w-12 h-12 border border-gray-200 flex items-center justify-center rounded-sm hover:bg-brandBlack hover:text-white disabled:opacity-20 transition-all"
            >
              <FiChevronRight className="rotate-180" />
            </button>

            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brandBlack mx-4">
              {page} / {pages}
            </span>

            <button
              disabled={page === pages}
              onClick={() => setPage(page + 1)}
              className="w-12 h-12 border border-gray-200 flex items-center justify-center rounded-sm hover:bg-brandBlack hover:text-white disabled:opacity-20 transition-all"
            >
              <FiChevronRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
