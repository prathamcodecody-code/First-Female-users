"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { FiMapPin, FiCheckCircle, FiXCircle, FiTruck } from "react-icons/fi";

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      checkPincode();
    }
  };

  return (
    <div className="border border-gray-100 p-6 rounded-sm space-y-4 bg-white">
      <div className="flex items-center gap-2">
        <FiTruck className="text-brandPink" />
        <p className="text-xs font-black uppercase tracking-widest text-gray-400">
          Check Delivery Availability
        </p>
      </div>

      <div className="flex gap-2">
        <input
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
          onKeyPress={handleKeyPress}
          maxLength={6}
          placeholder="Enter 6-digit Pincode"
          className="flex-1 border border-gray-200 px-4 py-3 rounded-sm text-sm focus:outline-none focus:border-brandPink transition-colors"
        />

        <button
          onClick={checkPincode}
          disabled={loading || pincode.length !== 6}
          className="px-6 bg-brandBlack text-white text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-brandPink transition-colors disabled:bg-gray-200 disabled:cursor-not-allowed"
        >
          {loading ? "Checking..." : "Check"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 p-3 rounded-sm">
          <p className="text-xs text-red-600 flex items-center gap-2 font-medium">
            <FiXCircle /> {error}
          </p>
        </div>
      )}

      {result?.serviceable && (
        <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-sm">
          <p className="text-xs text-emerald-700 flex items-center gap-2 font-medium">
            <FiCheckCircle />
            <span>
              Delivery available to <strong>{result.city}, {result.state}</strong>
            </span>
          </p>
          <p className="text-xs text-emerald-600 mt-2 ml-5">
            Estimated delivery: {result.estimatedDays}–{result.estimatedDays + 1} days
            {result.cod && " • COD available"}
          </p>
        </div>
      )}

      {result && !result.serviceable && (
        <div className="bg-red-50 border border-red-100 p-3 rounded-sm">
          <p className="text-xs text-red-600 flex items-center gap-2 font-medium">
            <FiXCircle /> {result.message || "Delivery not available at this pincode"}
          </p>
        </div>
      )}
    </div>
  );
}
