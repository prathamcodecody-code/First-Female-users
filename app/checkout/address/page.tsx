"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useCheckout } from "@/app/context/CheckoutContext";
import { FiMapPin, FiPlusCircle, FiCheckCircle } from "react-icons/fi";
import { motion } from "framer-motion";

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
      if (def) {
        setSelectedAddressId(def.id);
        handleSelectSaved(def);
      }
    });
  }, []);

  const handleChange = (field: string, value: string) => {
    // Logic: If user starts typing a new address, deselect the saved one
    if (selectedAddressId) setSelectedAddressId(null);
    setAddressLocal((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectSaved = (addr: any) => {
    setSelectedAddressId(addr.id);
    setAddress({
      id: addr.id,
      name: addr.name,
      phone: addr.phone,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
    } as any);
  };

  /* ================= CONTINUE ================= */
  const continueToPayment = () => {
    if (selectedAddressId) {
      const selected = savedAddresses.find((a) => a.id === selectedAddressId);
      if (!selected) {
        setError("Invalid address selected");
        return;
      }
      setAddress(selected);
      router.push("/checkout/payment");
      return;
    }

    if (Object.values(address).some((v) => !v.toString().trim())) {
      setError("Please fill all fields or select a saved address");
      return;
    }

    setAddress(address);
    router.push("/checkout/payment");
  };

  return (
    <div className="bg-[#FCFAFA] min-h-screen pb-20">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-10 md:py-16">
        
        {/* PROGRESS STEPPER - FIXED LOGIC */}
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-6xl mx-auto">
          
          {/* LEFT: MANUAL FORM */}
          <div className="lg:col-span-8 order-2 lg:order-1">
            <div className="bg-white border border-gray-100 p-8 md:p-12 rounded-sm shadow-sm transition-all">
              <div className="flex items-center gap-3 mb-10 border-b border-gray-50 pb-6">
                <FiPlusCircle className="text-brandPink" />
                <h2 className="text-sm font-black uppercase tracking-widest text-brandBlack">
                  Add Delivery Address
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12">
                <Field label="Full Name" value={address.name} onChange={(v: string) => handleChange("name", v)} />
                <Field label="Mobile Number" value={address.phone} onChange={(v: string) => handleChange("phone", v)} />
                <div className="md:col-span-2">
                  <Field label="Street Address" value={address.street} onChange={(v: string) => handleChange("street", v)} />
                </div>
                <Field label="City" value={address.city} onChange={(v: string) => handleChange("city", v)} />
                <Field label="State" value={address.state} onChange={(v: string) => handleChange("state", v)} />
                <Field label="Pincode" value={address.pincode} onChange={(v: string) => handleChange("pincode", v)} />
              </div>

              {error && (
                <p className="text-red-500 text-[10px] font-bold uppercase tracking-widest mt-10 bg-red-50 p-3 border border-red-100 text-center">
                  {error}
                </p>
              )}
            </div>

            <button
              onClick={continueToPayment}
              className="mt-8 w-full bg-brandBlack text-white py-6 rounded-sm font-black uppercase tracking-[0.4em] text-[12px] shadow-2xl hover:bg-brandPink transition-all active:scale-95"
            >
              Continue to Payment
            </button>
          </div>

          {/* RIGHT: SAVED ADDRESSES SIDEBAR */}
          <aside className="lg:col-span-4 order-1 lg:order-2 lg:sticky lg:top-24">
            <div className="bg-white border border-brandPink/10 p-8 rounded-sm shadow-sm">
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] border-b border-gray-50 pb-4 mb-6 text-brandBlack flex items-center gap-2">
                <FiMapPin className="text-brandPink" /> Saved Locations
              </h3>

              {savedAddresses.length > 0 ? (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto no-scrollbar">
                  {savedAddresses.map((addr) => (
                    <motion.div
                      whileTap={{ scale: 0.98 }}
                      key={addr.id}
                      onClick={() => handleSelectSaved(addr)}
                      className={`relative border p-5 cursor-pointer rounded-sm transition-all group
                        ${selectedAddressId === addr.id 
                          ? "border-brandPink bg-brandPink/5 shadow-md shadow-brandPink/5" 
                          : "border-gray-50 bg-gray-50/30 hover:border-gray-200"}`}
                    >
                      {selectedAddressId === addr.id && (
                        <div className="absolute top-2 right-2 text-brandPink">
                          <FiCheckCircle size={16} />
                        </div>
                      )}
                      
                      <p className={`font-black text-[10px] uppercase tracking-widest mb-1 ${selectedAddressId === addr.id ? 'text-brandPink' : 'text-brandBlack'}`}>
                        {addr.name}
                      </p>
                      <p className="text-[11px] text-gray-400 font-medium leading-relaxed lowercase">
                        {addr.street}, <br />
                        {addr.city}, {addr.state} – {addr.pincode}
                      </p>
                      <p className="text-[10px] font-bold text-gray-500 mt-3 tracking-tighter">
                        {addr.phone}
                      </p>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest text-center py-10 leading-loose">
                  No addresses saved yet. <br /> Fill the form to start your haul.
                </p>
              )}
            </div>
            
            <div className="mt-6 p-4 bg-emerald-50 border border-emerald-100 rounded-sm">
               <p className="text-[9px] font-black uppercase tracking-widest text-emerald-700 text-center">
                 Complimentary standard delivery active
               </p>
            </div>
          </aside>
          
        </div>
      </div>
    </div>
  );
}

/* ================= FIELD ================= */

function Field({ label, value, onChange }: any) {
  return (
    <div className="flex flex-col gap-2 group">
      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 group-focus-within:text-brandPink transition-colors">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border-b border-gray-100 py-3 outline-none text-sm font-bold text-brandBlack focus:border-brandPink transition-all bg-transparent"
      />
    </div>
  );
}
