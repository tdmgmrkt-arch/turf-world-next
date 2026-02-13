"use client";

import { useAuth } from "@/hooks/use-auth";
import { useAuthStore } from "@/lib/auth-store";
import { User, LogOut, Package, Settings } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

const UserIcon = User as any;
const LogOutIcon = LogOut as any;
const PackageIcon = Package as any;
const SettingsIcon = Settings as any;
const NextLink = Link as any;

export function AccountButton() {
  const { isAuthenticated, customer } = useAuthStore();
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isAuthenticated) {
    return (
      <NextLink
        href="/account/login"
        className="relative inline-flex items-center justify-center h-9 w-9 rounded-lg hover:bg-slate-100 transition-colors"
        title="Sign In"
      >
        <UserIcon className="h-5 w-5 text-slate-700" />
      </NextLink>
    );
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative inline-flex items-center justify-center h-9 w-9 rounded-lg hover:bg-slate-100 transition-colors"
        title="My Account"
      >
        <div className="h-7 w-7 rounded-full bg-emerald-100 flex items-center justify-center">
          <span className="text-xs font-semibold text-emerald-700">
            {(customer?.first_name?.[0] || customer?.email?.[0] || "U").toUpperCase()}
          </span>
        </div>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-slate-200 shadow-lg py-2 z-50">
          <div className="px-4 py-2 border-b border-slate-100">
            <p className="text-sm font-medium text-slate-900 truncate">
              {customer?.first_name ? `${customer.first_name} ${customer.last_name || ""}`.trim() : customer?.email}
            </p>
            {customer?.first_name && (
              <p className="text-xs text-slate-500 truncate">{customer.email}</p>
            )}
          </div>

          <NextLink
            href="/account"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <SettingsIcon className="h-4 w-4 text-slate-400" />
            My Account
          </NextLink>

          <NextLink
            href="/account"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <PackageIcon className="h-4 w-4 text-slate-400" />
            Order History
          </NextLink>

          <div className="border-t border-slate-100 mt-1 pt-1">
            <button
              onClick={() => { logout(); setOpen(false); }}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOutIcon className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
