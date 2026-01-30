"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import AuthModal from "../auth/AuthModal";
import { FiUser, FiPackage, FiLogOut, FiEdit2, FiMapPin, FiTag, FiCopy, FiCheck } from "react-icons/fi";
import AddressesTab from "@/components/ui/AddressesTab";

export default function ProfilePage() {
  const { user, logout, setUser } = useAuth();
  const router = useRouter();
  const [showAuth, setShowAuth] = useState(false);
  const [activeTab, setActiveTab] = useState<"account" | "addresses" | "orders" | "coupons">("account");

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <h2 className="text-3xl font-serif italic text-brandBlack mb-2">Join the Club.</h2>
        <p className="text-gray-500 uppercase tracking-widest text-[10px] mb-8">Please login to view your profile</p>
        <button
          onClick={() => setShowAuth(true)}
          className="bg-brandBlack text-white px-12 py-4 rounded-sm font-bold uppercase tracking-widest text-xs hover:bg-brandPink transition-all"
        >
          Sign In
        </button>
        <AuthModal show={showAuth} onClose={() => setShowAuth(false)} />
      </div>
    );
  }

  return (
    <div className="bg-[#FCFAFA] min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-12">
        <header className="mb-12">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-brandBlack italic font-serif">My Studio</h1>
          <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Manage your account & track orders</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* SIDEBAR */}
          <aside className="lg:col-span-3 space-y-2 h-fit lg:sticky lg:top-24">
            <SidebarBtn active={activeTab === "account"} onClick={() => setActiveTab("account")} icon={<FiUser />}>
              Account Details
            </SidebarBtn>
            <SidebarBtn active={activeTab === "addresses"} onClick={() => setActiveTab("addresses")} icon={<FiMapPin />}>
              Saved Addresses
            </SidebarBtn>
            <SidebarBtn active={activeTab === "orders"} onClick={() => setActiveTab("orders")} icon={<FiPackage />}>
              My Orders
            </SidebarBtn>
            <SidebarBtn active={activeTab === "coupons"} onClick={() => setActiveTab("coupons")} icon={<FiTag />}>
              My Rewards
            </SidebarBtn>

            <button
              onClick={() => {
                logout();
                router.push("/");
              }}
              className="w-full flex items-center gap-3 px-6 py-4 text-xs font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all mt-8"
            >
              <FiLogOut /> Logout
            </button>
          </aside>

          {/* CONTENT */}
          <main className="lg:col-span-9">
            {activeTab === "account" && <AccountDetails user={user} setUser={setUser} />}
            {activeTab === "addresses" && <AddressesTab />}
            {activeTab === "orders" && <OrdersShortcut />}
            {activeTab === "coupons" && <CouponsTab />}
          </main>
        </div>
      </div>
    </div>
  );
}

/* ---------------- ACCOUNT DETAILS COMPONENT ---------------- */

function AccountDetails({ user, setUser }: any) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user.name || "",
    email: user.email || "",
  });
  const [loading, setLoading] = useState(false);

  const saveProfile = async () => {
    try {
      setLoading(true);
      const res = await api.patch("/users/profile", form);
      setUser(res.data.user);
      setEditing(false);
    } catch (err) {
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-100 p-8 md:p-10 rounded-sm shadow-sm">
      <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-50">
        <h2 className="text-xl font-bold uppercase tracking-tight">Account Information</h2>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brandPink hover:text-brandBlack transition-colors"
          >
            <FiEdit2 /> Edit Profile
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <ProfileField
          label="Full Name"
          value={form.name}
          editing={editing}
          onChange={(v: string) => setForm({ ...form, name: v })}
          placeholder="Your display name"
        />
        <ProfileField
          label="Email Address"
          value={form.email}
          editing={editing}
          onChange={(v: string) => setForm({ ...form, email: v })}
          placeholder="your@email.com"
        />
        <StaticField label="Phone Number" value={user.phone} />
      </div>

      {editing && (
        <div className="mt-12 flex gap-4 pt-8 border-t border-gray-50">
          <button
            onClick={saveProfile}
            disabled={loading}
            className="bg-brandBlack text-white px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-brandPink transition-all disabled:bg-gray-200"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <button
            onClick={() => {
                setEditing(false);
                setForm({ name: user.name, email: user.email });
            }}
            className="px-8 py-3 text-[10px] font-bold uppercase tracking-widest border border-gray-200 hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------------- REWARDS / COUPONS TAB ---------------- */

function CouponsTab() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    api.get("/coupons/available")
      .then(res => setCoupons(res.data || []))
      .finally(() => setLoading(false));
  }, []);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  if (loading) return <div className="animate-pulse bg-white p-10 h-64 rounded-sm border border-gray-100" />;

  return (
    <div className="bg-white border border-gray-100 p-8 md:p-10 rounded-sm shadow-sm">
      <h2 className="text-xl font-bold uppercase tracking-tight mb-8">Available Rewards</h2>
      {coupons.length === 0 ? (
        <p className="text-gray-400 text-sm italic">No exclusive offers available at the moment. Keep slaying!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {coupons.map((c) => (
            <div key={c.code} className="border-2 border-dashed border-brandPink/30 p-6 rounded-sm relative overflow-hidden group hover:border-brandPink transition-all">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-2xl font-black text-brandBlack uppercase leading-none">
                    {c.type === "PERCENT" ? `${c.value}%` : `₹${c.value}`}
                  </p>
                  <p className="text-[10px] font-bold text-brandPink uppercase tracking-widest mt-1">OFF YOUR HAUL</p>
                </div>
                <FiTag className="text-brandPink/10 text-5xl absolute -right-2 -top-2 rotate-12" />
              </div>
              <div className="space-y-4">
                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                  {c.minOrderValue ? `Valid on orders above ₹${c.minOrderValue}.` : 'No minimum spend required.'}
                </p>
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-sm">
                  <span className="font-mono font-bold text-brandBlack tracking-tighter uppercase text-sm">{c.code}</span>
                  <button
                    onClick={() => copyToClipboard(c.code)}
                    className="flex items-center gap-2 text-[10px] font-black uppercase text-brandPink hover:text-brandBlack transition-colors"
                  >
                    {copiedCode === c.code ? <><FiCheck /> Copied</> : <><FiCopy /> Copy</>}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- HELPERS ---------------- */

function ProfileField({ label, value, editing, onChange, placeholder }: any) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
      {editing ? (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full border-b border-gray-100 py-2 outline-none focus:border-brandPink transition-all text-sm font-semibold placeholder:text-gray-200"
        />
      ) : (
        <p className="text-sm font-bold text-brandBlack uppercase tracking-tight">
          {value || <span className="text-gray-300 italic font-normal">Not provided</span>}
        </p>
      )}
    </div>
  );
}

function StaticField({ label, value }: any) {
  return (
    <div className="space-y-2 opacity-60">
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
      <p className="text-sm font-bold text-brandBlack uppercase tracking-tight">{value || "-"}</p>
    </div>
  );
}

function SidebarBtn({ active, icon, children, ...props }: any) {
  return (
    <button
      {...props}
      className={`w-full flex items-center gap-3 px-6 py-4 text-xs font-bold uppercase tracking-widest transition-all ${
        active
          ? "bg-white border-l-4 border-brandPink text-brandBlack shadow-sm"
          : "text-gray-400 hover:text-brandBlack hover:bg-white/50"
      }`}
    >
      <span className={active ? "text-brandPink" : ""}>{icon}</span>
      {children}
    </button>
  );
}

function OrdersShortcut() {
  const router = useRouter();
  return (
    <div className="bg-white border border-gray-100 p-8 md:p-10 rounded-sm shadow-sm">
      <h2 className="text-xl font-bold uppercase tracking-tight mb-4">My Orders</h2>
      <p className="text-sm text-gray-500 font-medium leading-relaxed mb-8 max-w-md">
        Track your latest drops, manage returns, and view your complete First Female order history in one place.
      </p>
      <button
        onClick={() => router.push("/orders")}
        className="bg-brandBlack text-white px-10 py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-brandPink shadow-lg transition-all active:scale-95"
      >
        View Orders
      </button>
    </div>
  );
}
