"use client";

import { useState, useEffect, useCallback } from "react";
import { AuthGuard } from "@/components/account/auth-guard";
import { useAuth } from "@/hooks/use-auth";
import { medusa } from "@/lib/medusa";
import {
  User, MapPin, Package, Save, Plus, Trash2, Loader2, CheckCircle, AlertCircle,
} from "lucide-react";
import Link from "next/link";

const UserIcon = User as any;
const MapPinIcon = MapPin as any;
const PackageIcon = Package as any;
const SaveIcon = Save as any;
const PlusIcon = Plus as any;
const TrashIcon = Trash2 as any;
const LoaderIcon = Loader2 as any;
const CheckIcon = CheckCircle as any;
const AlertIcon = AlertCircle as any;
const NextLink = Link as any;

type Tab = "profile" | "addresses" | "orders";

function AccountDashboard() {
  const { customer, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Account</h1>
          <p className="text-sm text-slate-500 mt-1">
            {customer?.email}
          </p>
        </div>
        <button
          onClick={logout}
          className="text-sm text-slate-500 hover:text-red-600 transition-colors"
        >
          Sign Out
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl p-1 border border-slate-200">
        {([
          { key: "profile" as Tab, label: "Profile", icon: UserIcon },
          { key: "addresses" as Tab, label: "Addresses", icon: MapPinIcon },
          { key: "orders" as Tab, label: "Orders", icon: PackageIcon },
        ]).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === key
                ? "bg-emerald-50 text-emerald-700 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {activeTab === "profile" && <ProfileTab />}
        {activeTab === "addresses" && <AddressesTab />}
        {activeTab === "orders" && <OrdersTab />}
      </div>
    </div>
  );
}

// ============================================
// PROFILE TAB
// ============================================
function ProfileTab() {
  const { customer } = useAuth();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (customer) {
      setFormData({
        first_name: customer.first_name || "",
        last_name: customer.last_name || "",
        phone: customer.phone || "",
      });
    }
  }, [customer]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      await medusa.store.customer.update(formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="p-6 space-y-4">
      <h2 className="text-lg font-semibold text-slate-900">Profile Information</h2>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-xl border border-red-100">
          <AlertIcon className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {saved && (
        <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 p-3 rounded-xl border border-emerald-100">
          <CheckIcon className="h-4 w-4 flex-shrink-0" />
          Profile updated successfully
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">First Name</label>
          <input
            type="text"
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Last Name</label>
          <input
            type="text"
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Email</label>
        <input
          type="email"
          value={customer?.email || ""}
          disabled
          className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-100 text-sm text-slate-500 cursor-not-allowed"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">Phone</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          placeholder="(555) 123-4567"
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="h-11 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold text-sm transition-all disabled:opacity-50 flex items-center gap-2"
      >
        {saving ? (
          <LoaderIcon className="h-4 w-4 animate-spin" />
        ) : (
          <SaveIcon className="h-4 w-4" />
        )}
        Save Changes
      </button>
    </form>
  );
}

// ============================================
// ADDRESSES TAB
// ============================================
function AddressesTab() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    address_1: "",
    address_2: "",
    city: "",
    province: "",
    postal_code: "",
    country_code: "us",
    phone: "",
  });

  const fetchAddresses = useCallback(async () => {
    try {
      const { addresses: data } = await medusa.store.customer.listAddress() as any;
      setAddresses(data || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await medusa.store.customer.createAddress(formData);
      setShowForm(false);
      setFormData({
        first_name: "", last_name: "", address_1: "", address_2: "",
        city: "", province: "", postal_code: "", country_code: "us", phone: "",
      });
      fetchAddresses();
    } catch {
      // ignore
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await medusa.store.customer.deleteAddress(id);
      fetchAddresses();
    } catch {
      // ignore
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoaderIcon className="h-6 w-6 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Saved Addresses</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
        >
          <PlusIcon className="h-4 w-4" />
          Add Address
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-200">
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text" required placeholder="First name" value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              className="h-10 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="text" required placeholder="Last name" value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              className="h-10 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <input
            type="text" required placeholder="Address" value={formData.address_1}
            onChange={(e) => setFormData({ ...formData, address_1: e.target.value })}
            className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <input
            type="text" placeholder="Apt, suite, etc. (optional)" value={formData.address_2}
            onChange={(e) => setFormData({ ...formData, address_2: e.target.value })}
            className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <div className="grid grid-cols-3 gap-3">
            <input
              type="text" required placeholder="City" value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="h-10 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="text" required placeholder="State" value={formData.province}
              onChange={(e) => setFormData({ ...formData, province: e.target.value })}
              className="h-10 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <input
              type="text" required placeholder="ZIP" value={formData.postal_code}
              onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
              className="h-10 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              className="h-10 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium"
            >
              Save Address
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="h-10 px-4 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {addresses.length === 0 && !showForm ? (
        <p className="text-sm text-slate-500 py-8 text-center">No saved addresses yet.</p>
      ) : (
        <div className="space-y-3">
          {addresses.map((addr: any) => (
            <div key={addr.id} className="flex items-start justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-sm text-slate-700">
                <p className="font-medium">{addr.first_name} {addr.last_name}</p>
                <p>{addr.address_1}{addr.address_2 ? `, ${addr.address_2}` : ""}</p>
                <p>{addr.city}, {addr.province} {addr.postal_code}</p>
              </div>
              <button
                onClick={() => handleDelete(addr.id)}
                className="text-slate-400 hover:text-red-500 transition-colors p-1"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================
// ORDERS TAB
// ============================================
function OrdersTab() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const { orders: data } = await medusa.store.order.list() as any;
        setOrders(data || []);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoaderIcon className="h-6 w-6 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-6 text-center py-12">
        <PackageIcon className="h-12 w-12 text-slate-300 mx-auto mb-3" />
        <p className="text-sm text-slate-500 mb-4">No orders yet</p>
        <NextLink
          href="/products"
          className="inline-block h-10 px-6 leading-10 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-semibold"
        >
          Start Shopping
        </NextLink>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-3">
      <h2 className="text-lg font-semibold text-slate-900">Order History</h2>
      {orders.map((order: any) => (
        <NextLink
          key={order.id}
          href={`/account/orders/${order.id}`}
          className="block p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-emerald-300 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900">
                Order #{order.display_id || order.id.slice(-8)}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {new Date(order.created_at).toLocaleDateString("en-US", {
                  year: "numeric", month: "long", day: "numeric",
                })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-900">
                ${((order.total || 0) / 100).toFixed(2)}
              </p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                {order.fulfillment_status || order.status || "processing"}
              </span>
            </div>
          </div>
        </NextLink>
      ))}
    </div>
  );
}

// ============================================
// MAIN EXPORT
// ============================================
export default function AccountPage() {
  return (
    <AuthGuard>
      <AccountDashboard />
    </AuthGuard>
  );
}
