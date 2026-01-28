"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useCheckout } from "@/app/context/CheckoutContext";
import { FiMapPin } from "react-icons/fi";

export default function CheckoutAddressPage() {
  const router = useRouter();
  const { setAddress } = useCheckout();

  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);

  const [address, setAddressLocal] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [error, setError] = useState("");

  /* ================= FETCH SAVED ADDRESSES ================= */
  useEffect(() => {
    api.get("/addresses").then((res) => {
      setSavedAddresses(res.data);
      const def = res.data.find((a: any) => a.isDefault);
      if (def) setSelectedAddressId(def.id);
    });
  }, []);

  const handleChange = (field: string, value: string) => {
    setAddressLocal((prev) => ({ ...prev, [field]: value }));
  };

  /* ================= CONTINUE ================= */
  const continueToPayment = () => {
  // Saved address selected
  if (selectedAddressId) {
    const selected = savedAddresses.find(a => a.id === selectedAddressId);

    if (!selected) {
      setError("Invalid address selected");
      return;
    }

    setAddress({
      id: selected.id,
      name: selected.name,
      phone: selected.phone,
      street: selected.street,
      city: selected.city,
      state: selected.state,
      pincode: selected.pincode,
    });

    router.push("/checkout/payment");
    return;
  }

  // Manual address
  if (Object.values(address).some(v => !v.trim())) {
    setError("Please fill all address fields");
    return;
  }

  setAddress(address);
  router.push("/checkout/payment");
};


  const usingSavedAddress = !!selectedAddressId;

  return (
    <div className="bg-[#FCFAFA] min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-10 md:py-16">

        {/* HEADER */}
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-black uppercase tracking-tighter text-brandBlack italic font-serif mb-2">
            Delivery Details
          </h1>
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-10">
            Where should we send your pieces?
          </p>

          {/* ================= SAVED ADDRESSES ================= */}
          {savedAddresses.length > 0 && (
            <div className="mb-12 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">
                Saved Addresses
              </h3>

              {savedAddresses.map((addr) => (
                <div
                  key={addr.id}
                  onClick={() => {
  setSelectedAddressId(addr.id);

  setAddress({
    id: addr.id,
    name: addr.name,
    phone: addr.phone,
    street: addr.street,
    city: addr.city,
    state: addr.state,
    pincode: addr.pincode,
  });
}}
                  className={`border p-5 cursor-pointer rounded-sm transition-all
                    ${
                      selectedAddressId === addr.id
                        ? "border-brandPink bg-brandPink/5"
                        : "border-gray-100 hover:border-gray-300"
                    }`}
                >
                  <div className="flex gap-3">
                    <FiMapPin className="mt-1 text-gray-400" />
                    <div>
                      <p className="font-bold text-sm">{addr.name}</p>
                      <p className="text-xs text-gray-500">
                        {addr.street}, {addr.city}, {addr.state} – {addr.pincode}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {addr.phone}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ================= MANUAL FORM ================= */}
          <div
            className={`bg-white border p-8 md:p-12 rounded-sm shadow-sm transition-all
              ${usingSavedAddress ? "opacity-40 pointer-events-none" : ""}
            `}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12">
              <Field label="Full Name" value={address.name} onChange={(v : string) => handleChange("name", v)} />
              <Field label="Mobile Number" value={address.phone} onChange={(v:string) => handleChange("phone", v)} />
              <div className="md:col-span-2">
                <Field label="Street Address" value={address.street} onChange={(v:string) => handleChange("street", v)} />
              </div>
              <Field label="City" value={address.city} onChange={(v:string) => handleChange("city", v)} />
              <Field label="State" value={address.state} onChange={(v:string) => handleChange("state", v)} />
              <Field label="Pincode" value={address.pincode} onChange={(v:string) => handleChange("pincode", v)} />
            </div>

            {error && (
              <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-8">
                {error}
              </p>
            )}
          </div>

          {/* CTA */}
          <button
            onClick={continueToPayment}
            className="mt-12 w-full bg-brandBlack text-white py-5 rounded-sm font-black uppercase tracking-[0.3em] text-[12px]"
          >
            Continue to Payment
          </button>
        </div>
      </div>
    </div>
  );
}

/* ================= FIELD ================= */

function Field({ label, value, onChange }: any) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-black uppercase tracking-[0.1em] text-gray-400">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border-b py-3 outline-none text-sm font-bold"
      />
    </div>
  );
}
