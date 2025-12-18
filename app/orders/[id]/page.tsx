"use client";

import { api } from "@/lib/api";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import OrderTracking from "@/components/OrderTracking";
import ReviewModal from "@/components/reviews/reviews";

/* ---------- STATUS HELPER ---------- */
function getOrderStatusClass(status?: string) {
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
    return <div className="text-center py-20 text-gray-500">Loading…</div>;
  }

  if (!order) {
    return <div className="text-center py-20 text-red-500">Order not found</div>;
  }

  const totalAmount = order.items.reduce(
    (sum: number, i: any) => sum + Number(i.price) * i.quantity,
    0
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">
            Order <span className="text-brandPink">#{order.id}</span>
          </h1>
          <p className="text-sm text-gray-500">
            {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>
        <span
          className={`px-4 py-2 rounded-full text-sm font-semibold ${getOrderStatusClass(
            order.status
          )}`}
        >
          {order.status}
        </span>
      </div>

      {/* TRACKING */}
      <OrderTracking status={order.status} />

      {/* PAYMENT + ADDRESS */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-4">
        <div className="text-sm text-gray-700 space-y-1">
          <p>
            <span className="font-medium">Payment Method:</span>{" "}
            {order.paymentMethod === "COD"
              ? "Cash on Delivery"
              : "Online Payment"}
          </p>
          <p>
            <span className="font-medium">Payment Status:</span>{" "}
            {["CONFIRMED", "SHIPPED", "DELIVERED"].includes(order.status)
              ? "Paid"
              : "Pending"}
          </p>
        </div>

        <div className="pt-3 border-t text-sm text-gray-700">
          <p className="font-medium mb-1">Delivery Address</p>
          <p>{order.address?.name}</p>
          <p>{order.address?.street}</p>
          <p>
            {order.address?.city}, {order.address?.state} -{" "}
            {order.address?.pincode}
          </p>
          <p>Phone: {order.address?.phone}</p>
        </div>
      </div>

      {/* ITEMS */}
      <div className="bg-white rounded-2xl shadow p-6">
  <h2 className="text-xl font-semibold mb-4">Items</h2>

  {order.items.map((item: any) => (
    <div
      key={item.id}
      className="border-b py-4 flex gap-4 items-start"
    >
      {/* IMAGE */}
      <img
        src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/products/${item.product.img1}`}
        alt={item.product.title}
        className="w-20 h-24 rounded object-cover bg-gray-100"
      />

      {/* DETAILS */}
      <div className="flex-1 space-y-1">
        <p className="font-semibold">
          {item.product.title}
        </p>

        {item.size && (
          <p className="text-sm text-gray-500">
            Size: <span className="font-medium">{item.size.size}</span>
          </p>
        )}

        <p className="text-sm text-gray-500">
          Qty {item.quantity} × ₹{item.price}
        </p>

        {/* PRICE INFO */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-brandPink">
            ₹{item.quantity * item.price}
          </span>

          {item.originalPrice &&
            item.originalPrice > item.price && (
              <span className="text-sm line-through text-gray-400">
                ₹{item.originalPrice * item.quantity}
              </span>
            )}
        </div>

        {/* REVIEW */}
        {order.status === "DELIVERED" && (
          <button
            onClick={() =>
              setReviewProduct({
                product: item.product,
                orderId: order.id,
              })
            }
            className="text-sm text-brandPink font-semibold"
          >
            Write a Review
          </button>
        )}
      </div>
    </div>
  ))}


      </div>

      {/* ACTIONS */}
      <div className="flex gap-4">
        {order.status === "PENDING" && (
          <button
            onClick={async () => {
              if (!confirm("Cancel this order?")) return;
              await api.put(`/orders/${order.id}/cancel`);
              fetchOrder();
            }}
            className="px-4 py-2 bg-red-500 text-white rounded-lg"
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
            className="px-4 py-2 bg-brandPink text-white rounded-lg"
          >
            Re-Order
          </button>
        )}
      </div>

      {/* TOTAL */}
      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex justify-between text-lg font-bold">
          <span>Total Paid</span>
          <span className="text-brandPink">₹{totalAmount}</span>
        </div>
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
