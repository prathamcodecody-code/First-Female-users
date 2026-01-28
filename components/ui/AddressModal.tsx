"use client";

import AddressForm, { AddressFormData } from "./AddressForm";
import { FiX } from "react-icons/fi";

type Props = {
  open: boolean;
  onClose: () => void;
  initialData?: Partial<AddressFormData>;
  onSave: (data: AddressFormData) => Promise<void>;
};

export default function AddressModal({
  open,
  onClose,
  initialData,
  onSave,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-lg p-8 rounded-sm relative">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black"
        >
          <FiX size={18} />
        </button>

        <h2 className="text-xl font-black uppercase tracking-tight mb-6">
          {initialData ? "Edit Address" : "Add New Address"}
        </h2>

        <AddressForm
          initialData={initialData}
          submitText={initialData ? "Update Address" : "Save Address"}
          onSubmit={async (data) => {
            await onSave(data);
            onClose();
          }}
        />
      </div>
    </div>
  );
}
