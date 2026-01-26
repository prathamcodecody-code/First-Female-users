"use client";

import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import AuthModal from "../auth/AuthModal";
import { FiUser, FiPackage, FiLogOut, FiEdit2 } from "react-icons/fi";

export default function ProfilePage() {
  const { user, logout, setUser } = useAuth();
  const router = useRouter();
  const [showAuth, setShowAuth] = useState(false);
  const [activeTab, setActiveTab] = useState<"account" | "orders">("account");

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
          <h1 className="text-4xl font-black uppercase tracking-tighter text-brandBlack">My Studio</h1>
          <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">Manage your account & track orders</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* SIDEBAR */}
          <aside className="lg:col-span-3 space-y-2 h-fit lg:sticky lg:top-24">
            <SidebarBtn
              active={activeTab === "account"}
              onClick={() => setActiveTab("account")}
              icon={<FiUser />}
            >
              Account Details
            </SidebarBtn>

            <SidebarBtn
              active={activeTab === "orders"}
              onClick={() => setActiveTab("orders")}
              icon={<FiPackage />}
            >
              My Orders
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
            {activeTab === "account" && (
              <AccountDetails user={user} setUser={setUser} />
            )}
            {activeTab === "orders" && <OrdersShortcut />}
          </main>
        </div>
      </div>
    </div>
  );
}

/* ---------------- ACCOUNT DETAILS (EDITABLE) ---------------- */

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
    <div className="bg-white border border-gray-100 p-8 md:p-10 rounded-sm">
      <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-50">
        <h2 className="text-xl font-bold uppercase tracking-tight">Account Information</h2>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brandPink hover:text-brandBlack transition-colors"
          >
            <FiEdit2 /> Edit
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <ProfileField
          label="Full Name"
          value={form.name}
          editing={editing}
          onChange={(v : string) => setForm({ ...form, name: v })}
          placeholder="Enter your full name"
        />

        <ProfileField
          label="Email Address"
          value={form.email}
          editing={editing}
          onChange={(v : string) => setForm({ ...form, email: v })}
          placeholder="Add your email"
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
            onClick={() => setEditing(false)}
            className="px-8 py-3 text-[10px] font-bold uppercase tracking-widest border border-gray-200 hover:bg-gray-50 transition-all"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------------- REUSABLE FIELDS ---------------- */

function ProfileField({ label, value, editing, onChange, placeholder }: any) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{label}</p>
      {editing ? (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full border-b-2 border-gray-100 py-2 outline-none focus:border-brandPink transition-all text-sm font-semibold"
        />
      ) : (
        <p className="text-sm font-bold text-brandBlack uppercase tracking-tight">
          {value || <span className="text-gray-300 italic">Not provided</span>}
        </p>
      )}
    </div>
  );
}

function StaticField({ label, value }: any) {
  return (
    <div className="space-y-2">
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

/* ---------------- ORDERS SHORTCUT ---------------- */

function OrdersShortcut() {
  const router = useRouter();

  return (
    <div className="bg-white border border-gray-100 p-8 md:p-10 rounded-sm">
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
