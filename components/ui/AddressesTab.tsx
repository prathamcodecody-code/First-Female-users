"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { FiPlus, FiEdit2, FiTrash2, FiCheck } from "react-icons/fi";
import AddressModal from "./AddressModal";

type Address = {
  id: number;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
};

export default function AddressesTab() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editAddress, setEditAddress] = useState<Address | null>(null);

  const fetchAddresses = async () => {
    const res = await api.get("/addresses");
    setAddresses(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const deleteAddress = async (id: number) => {
    if (!confirm("Delete this address?")) return;
    await api.delete(`/addresses/${id}`);
    fetchAddresses();
  };

  const setDefault = async (id: number) => {
    await api.put(`/addresses/${id}/default`);
    fetchAddresses();
  };

  return (
    <div className="bg-white border border-gray-100 p-8 md:p-10 rounded-sm">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-xl font-bold uppercase tracking-tight">
          Saved Addresses
        </h2>
        <button
          onClick={() => {
            setEditAddress(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brandPink"
        >
          <FiPlus /> Add Address
        </button>
      </div>

      {/* LIST */}
      {loading ? (
        <p className="text-gray-400 text-sm">Loading addresses...</p>
      ) : addresses.length === 0 ? (
        <p className="text-gray-400 text-sm">No saved addresses</p>
      ) : (
        <div className="space-y-6">
          {addresses.map((a) => (
            <div
              key={a.id}
              className={`border p-6 rounded-sm ${
                a.isDefault
                  ? "border-brandPink bg-brandPink/5"
                  : "border-gray-100"
              }`}
            >
              <div className="flex justify-between gap-6">
                <div>
                  <p className="font-black uppercase tracking-tight">
                    {a.name}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {a.street}, {a.city}, {a.state} – {a.pincode}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Phone: {a.phone}
                  </p>

                  {a.isDefault && (
                    <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-black uppercase text-emerald-600">
                      <FiCheck /> Default
                    </span>
                  )}
                </div>

                <div className="flex flex-col gap-3 text-right">
                  {!a.isDefault && (
                    <button
                      onClick={() => setDefault(a.id)}
                      className="text-[10px] uppercase font-bold text-brandPink"
                    >
                      Set Default
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setEditAddress(a);
                      setShowModal(true);
                    }}
                    className="flex items-center gap-1 text-[10px] uppercase font-bold"
                  >
                    <FiEdit2 /> Edit
                  </button>
                  <button
                    onClick={() => deleteAddress(a.id)}
                    className="flex items-center gap-1 text-[10px] uppercase font-bold text-red-500"
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      <AddressModal
        open={showModal}
        initialData={editAddress || undefined}
        onClose={() => setShowModal(false)}
        onSave={async (data) => {
          if (editAddress) {
            await api.put(`/addresses/${editAddress.id}`, data);
          } else {
            await api.post("/addresses", data);
          }
          fetchAddresses();
        }}
      />
    </div>
  );
}
