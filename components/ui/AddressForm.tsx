"use client";

import { useState } from "react";

type Props = {
  initialData?: Partial<AddressFormData>;
  onSubmit: (data: AddressFormData) => Promise<void> | void;
  submitText?: string;
};

export type AddressFormData = {
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
};

export default function AddressForm({
  initialData = {},
  onSubmit,
  submitText = "Save Address",
}: Props) {
  const [form, setForm] = useState<AddressFormData>({
    name: initialData.name || "",
    phone: initialData.phone || "",
    street: initialData.street || "",
    city: initialData.city || "",
    state: initialData.state || "",
    pincode: initialData.pincode || "",
    isDefault: initialData.isDefault || false,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (key: keyof AddressFormData, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (
      !form.name ||
      !form.phone ||
      !form.street ||
      !form.city ||
      !form.state ||
      !/^\d{6}$/.test(form.pincode)
    ) {
      setError("Please fill all fields correctly");
      return;
    }

    setError("");
    setLoading(true);
    await onSubmit(form);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <Field label="Full Name" value={form.name} onChange={v => handleChange("name", v)} />
      <Field label="Phone Number" value={form.phone} onChange={v => handleChange("phone", v)} />
      <Field label="Street Address" value={form.street} onChange={v => handleChange("street", v)} />
      
      <div className="grid grid-cols-2 gap-6">
        <Field label="City" value={form.city} onChange={v => handleChange("city", v)} />
        <Field label="State" value={form.state} onChange={v => handleChange("state", v)} />
      </div>

      <Field
        label="Pincode"
        value={form.pincode}
        onChange={v => handleChange("pincode", v)}
        type="number"
      />

      <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500">
        <input
          type="checkbox"
          checked={form.isDefault}
          onChange={e => handleChange("isDefault", e.target.checked)}
        />
        Set as default address
      </label>

      {error && (
        <p className="text-red-500 text-[10px] uppercase tracking-widest">{error}</p>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-brandBlack text-white py-4 text-[10px] font-black uppercase tracking-widest hover:bg-brandPink transition-all disabled:opacity-50"
      >
        {loading ? "Saving..." : submitText}
      </button>
    </div>
  );
}

/* ---------------- FIELD ---------------- */

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="border-b border-gray-100 py-2 outline-none focus:border-brandPink font-bold text-sm"
      />
    </div>
  );
}
