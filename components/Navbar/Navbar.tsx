import NavbarClient from "./NavbarClient";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <NavbarClient />
      </div>
    </nav>
  );
}
