import { Suspense } from "react";
import SearchClient from "./SearchClient";

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
          <p className="text-gray-500 animate-pulse">
            Loading search results…
          </p>
        </div>
      }
    >
      <SearchClient />
    </Suspense>
  );
}
