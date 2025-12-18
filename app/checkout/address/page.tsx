"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCheckout } from "@/app/context/CheckoutContext";

export default function CheckoutAddressPage() {
  const router = useRouter();
  const { setAddress } = useCheckout();

  const [address, setAddressLocal] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [error, setError] = useState("");

  const handleChange = (field: string, value: string) => {
    setAddressLocal((prev) => ({ ...prev, [field]: value }));
  };

  const continueToPayment = () => {
    if (Object.values(address).some((v) => !v.trim())) {
      setError("Please fill all address fields");
      return;
    }

    setError("");
    setAddress(address);
    router.push("/checkout/payment");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">

      {/* CHECKOUT STEPS */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <span className="font-semibold text-brandPink">Address</span>
        <span>›</span>
        <span>Payment</span>
        <span>›</span>
        <span>Review</span>
      </div>

      <h1 className="text-2xl font-bold mb-6">Delivery Address</h1>

      <div className="bg-white p-6 rounded-xl shadow">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <Field
            label="Full Name"
            value={address.name}
            onChange={(v) => handleChange("name", v)}
          />

          <Field
            label="Mobile Number"
            type="tel"
            value={address.phone}
            onChange={(v) => handleChange("phone", v)}
          />

          <div className="md:col-span-2">
            <Field
              label="Street Address"
              value={address.street}
              onChange={(v) => handleChange("street", v)}
            />
          </div>

          <Field
            label="City"
            value={address.city}
            onChange={(v) => handleChange("city", v)}
          />

          <Field
            label="State"
            value={address.state}
            onChange={(v) => handleChange("state", v)}
          />

          <Field
            label="Pincode"
            type="number"
            value={address.pincode}
            onChange={(v) => handleChange("pincode", v)}
          />
        </div>

        {/* ERROR */}
        {error && (
          <p className="text-red-600 text-sm mt-4">{error}</p>
        )}

        {/* CTA */}
        <button
          onClick={continueToPayment}
          className="mt-6 w-full bg-brandPink text-white py-3 rounded-lg font-semibold hover:bg-brandPinkLight transition"
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
}

/* ---------------- FIELD COMPONENT ---------------- */

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  type?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-brandPink outline-none"
      />
    </div>
  );
}
