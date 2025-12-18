"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

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

  if (loading) {
    return (
      <p className="text-center py-16 text-gray-500">
        Loading your orders…
      </p>
    );
  }

function getStatusClass(status?: string) {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-700";
    case "CONFIRMED":
      return "bg-blue-100 text-blue-700";
    case "SHIPPED":
      return "bg-teal-100 text-teal-700";
    case "DELIVERED":
      return "bg-green-100 text-green-700";
    case "CANCELLED":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}


  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {orders.length === 0 && (
        <p className="text-gray-500">You haven’t placed any orders yet.</p>
      )}

      {/* ORDERS LIST */}
      <div className="space-y-5">
        

{orders.map((o) => {
  const statusClass = getStatusClass(o.status);

  return (
    <div
      key={o.id}
      onClick={() => router.push(`/orders/${o.id}`)}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition cursor-pointer p-5"
    >
      <div className="flex justify-between items-center">
        <p className="font-semibold text-gray-900">
          Order ID: <span className="text-brandPink">{o.id}</span>
        </p>

        <span
          className={`text-xs px-3 py-1 rounded-full font-semibold ${statusClass}`}
        >
          {o.status}
        </span>
      </div>

      <div className="mt-3 flex justify-between items-end">
        <p className="text-gray-700 font-medium">
          Total: ₹{o.totalAmount}
        </p>

        <p className="text-xs text-gray-400">
          {new Date(o.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
})}

      </div>

      {/* PAGINATION */}
      {pages > 1 && (
        <div className="flex justify-center items-center gap-6 mt-10">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-4 py-2 rounded-lg bg-brandPink text-white disabled:bg-gray-300"
          >
            Prev
          </button>

          <span className="font-semibold text-gray-700">
            Page {page} of {pages}
          </span>

          <button
            disabled={page === pages}
            onClick={() => setPage(page + 1)}
            className="px-4 py-2 rounded-lg bg-brandPink text-white disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
