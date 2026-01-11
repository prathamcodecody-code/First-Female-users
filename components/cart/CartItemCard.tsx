"use client";

type CartItem = {
  id: number;
  price: number; // ✅ SNAPSHOT PRICE FROM CART
  quantity: number;
  product: {
    title: string;
    img1?: string | null;
  };
  size?: {
    id: number;
    size: string;
  } | null;
};

export default function CartItemCard({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: {
  item: CartItem;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}) {
  const unitPrice = Number(item.price);
  const totalPrice = unitPrice * item.quantity;

  return (
    <div className="bg-white rounded-xl p-4 flex gap-4 shadow-sm">
      {/* IMAGE */}
      <div className="w-24 h-32 bg-gray-100 rounded overflow-hidden">
        <img
          src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/products/${item.product.img1}`}
          alt={item.product.title}
          className="w-20 h-24 object-cover rounded"
        />
      </div>

      {/* DETAILS */}
      <div className="flex-1 space-y-2">
        <h3 className="font-medium text-sm">{item.product.title}</h3>

        <p className="text-xs text-gray-500">
          Sold by <span className="font-medium">FirstFemale</span>
        </p>

        {/* SIZE + QTY */}
        <div className="flex items-center gap-4 text-sm">
          {item.size && (
            <span className="border px-2 py-1 rounded">
              Size: {item.size.size}
            </span>
          )}

          <div className="flex items-center border rounded">
            <button onClick={onDecrease} className="px-2 py-1">
              −
            </button>
            <span className="px-3">{item.quantity}</span>
            <button onClick={onIncrease} className="px-2 py-1">
              +
            </button>
          </div>

          <button
            onClick={onRemove}
            className="text-red-500 text-sm"
          >
            Remove
          </button>
        </div>

        {/* PRICE */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-brandPink">
            ₹{totalPrice}
          </span>
        </div>

        {/* RETURN INFO */}
        <p className="text-xs text-gray-500">
          ✔ 14 days return available
        </p>
      </div>
    </div>
  );
}
