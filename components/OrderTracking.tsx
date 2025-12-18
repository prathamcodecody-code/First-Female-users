export default function OrderTracking({ status }: { status: string }) {
  const steps = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"];

  return (
    <div className="flex gap-4 mt-4">
      {steps.map((s, i) => (
        <div key={i} className="flex flex-col items-center">
          <div
            className={`w-6 h-6 rounded-full ${
              steps.indexOf(status) >= i ? "bg-green-500" : "bg-gray-300"
            }`}
          ></div>
          <p className="text-xs mt-1">{s}</p>
        </div>
      ))}
    </div>
  );
}
