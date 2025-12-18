import NavbarClient from "./NavbarClient";

export default async function Navbar() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/categories`,
    { cache: "no-store" }
  );

  const categories = await res.json();

  return (
    <nav
      className="
        sticky top-0 z-50
        bg-white
        border-b border-gray-200
      "
    >
      {/* MAIN NAV CONTAINER */}
      <div className="max-w-7xl mx-auto px-6">
        <NavbarClient categories={categories} />
      </div>
    </nav>
  );
}
