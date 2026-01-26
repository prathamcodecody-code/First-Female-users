"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCheckout } from "@/app/context/CheckoutContext";
import { FiMapPin, FiChevronRight } from "react-icons/fi"; // Added for UI polish

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
      setError("Please fill all address fields to proceed");
      return;
    }

    setError("");
    setAddress(address);
    router.push("/checkout/payment");
  };

  return (
    <div className="bg-[#FCFAFA] min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-10 md:py-16">
        
        {/* PROGRESS STEPPER - Boutique Style */}
        <header className="mb-16 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
             <span className="w-6 h-6 rounded-full bg-brandPink text-white flex items-center justify-center text-[10px] font-black shadow-lg shadow-brandPink/20">1</span>
             <span className="text-[11px] font-black uppercase tracking-widest text-brandBlack">Shipping</span>
          </div>
          <div className="h-[1px] w-12 bg-gray-200" />
          <div className="flex items-center gap-2 opacity-30">
             <span className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-[10px] font-black">2</span>
             <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">Payment</span>
          </div>
          <div className="h-[1px] w-12 bg-gray-200" />
          <div className="flex items-center gap-2 opacity-30">
             <span className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-[10px] font-black">3</span>
             <span className="text-[11px] font-black uppercase tracking-widest text-gray-400">Review</span>
          </div>
        </header>

        <div className="max-w-3xl mx-auto">
          <header className="mb-10">
            <h1 className="text-3xl font-black uppercase tracking-tighter text-brandBlack italic font-serif">
              Delivery Details
            </h1>
            <p className="text-xs text-gray-400 uppercase tracking-widest mt-2">Where should we send your pieces?</p>
          </header>

          <div className="bg-white border border-gray-100 p-8 md:p-12 rounded-sm shadow-sm transition-all">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12">
              <Field
                label="Full Name"
                value={address.name}
                onChange={(v) => handleChange("name", v)}
                placeholder="Name on the parcel"
              />

              <Field
                label="Mobile Number"
                type="tel"
                value={address.phone}
                onChange={(v) => handleChange("phone", v)}
                placeholder="10-digit number"
              />

              <div className="md:col-span-2">
                <Field
                  label="Street Address"
                  value={address.street}
                  onChange={(v) => handleChange("street", v)}
                  placeholder="House No, Colony, Area"
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
                placeholder="6-digit ZIP"
              />
            </div>

            {/* ERROR */}
            {error && (
              <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-8 bg-red-50 p-3 text-center border border-red-100">
                {error}
              </p>
            )}

            {/* CTA */}
            <button
              onClick={continueToPayment}
              className="mt-12 w-full bg-brandBlack text-white py-5 rounded-sm font-black uppercase tracking-[0.3em] text-[12px] shadow-xl hover:bg-brandPink transition-all active:scale-[0.98]"
            >
              Continue to Payment
            </button>
          </div>
          
          <p className="text-center text-[9px] text-gray-300 uppercase tracking-widest mt-8 font-bold">
            Secure 256-bit SSL Encrypted Connection
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------------- ENHANCED FIELD COMPONENT ---------------- */

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder = ""
}: {
  label: string;
  value: string;
  type?: string;
  placeholder?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-black uppercase tracking-[0.1em] text-gray-400">
        {label}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border-b border-gray-100 py-3 outline-none focus:border-brandPink transition-all text-sm font-bold placeholder:text-gray-200 placeholder:font-normal"
      />
    </div>
  );
}
