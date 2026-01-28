"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { FiMapPin, FiCheckCircle, FiXCircle } from "react-icons/fi";

export default function CheckPincode() {
  const [pincode, setPincode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const checkPincode = async () => {
    if (pincode.length !== 6) {
      setError("Enter valid 6 digit pincode");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await api.post("/delivery/check-pincode", { pincode });
      setResult(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Service not available");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-4 rounded-sm space-y-3">
      <p className="text-xs font-black uppercase tracking-widest text-gray-400">
        Check Delivery Availability
      </p>

      <div className="flex gap-2">
        <input
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
          maxLength={6}
          placeholder="Enter Pincode"
          className="flex-1 border px-3 py-2 rounded"
        />

        <button
          onClick={checkPincode}
          disabled={loading}
          className="px-4 bg-black text-white text-sm rounded"
        >
          {loading ? "Checking..." : "Check"}
        </button>
      </div>

      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <FiXCircle /> {error}
        </p>
      )}

      {result?.serviceable && (
        <p className="text-xs text-emerald-600 flex items-center gap-1">
          <FiCheckCircle />
          Delivery available in {result.estimatedDays} days
          {result.cod && " • COD available"}
        </p>
      )}

      {result && !result.serviceable && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <FiXCircle /> Delivery not available at this pincode
        </p>
      )}
    </div>
  );
}
