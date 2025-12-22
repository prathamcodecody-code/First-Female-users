import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  let categories: any[] = [];

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}categories`,
      { cache: "no-store" }
    );

    if (res.ok) {
      const json = await res.json();
      categories = Array.isArray(json) ? json : json.data ?? [];
    }
  } catch (e) {
    console.error("Failed to load categories", e);
  }

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <NavbarClient categories={categories} />
      </div>
    </nav>
  );
}

