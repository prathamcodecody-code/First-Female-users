"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white max-w-md w-full rounded-2xl shadow-lg p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800">
          Something went wrong
        </h1>

        <p className="mt-3 text-gray-500">
          Our servers are currently unavailable or still starting up.
        </p>

        <div className="mt-6 flex gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="px-5 py-2 bg-brandPink text-white rounded-lg font-semibold"
          >
            Retry
          </button>

          <a
            href="/"
            className="px-5 py-2 border rounded-lg font-semibold"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}
