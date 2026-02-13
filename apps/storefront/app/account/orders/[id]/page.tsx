"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AuthGuard } from "@/components/account/auth-guard";
import { medusa } from "@/lib/medusa";
import { ArrowLeft, Package, Loader2 } from "lucide-react";
import Link from "next/link";

const ArrowLeftIcon = ArrowLeft as any;
const PackageIcon = Package as any;
const LoaderIcon = Loader2 as any;
const NextLink = Link as any;

function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const { order: data } = await medusa.store.order.retrieve(id as string) as any;
        setOrder(data);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <LoaderIcon className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-24">
        <p className="text-slate-500">Order not found.</p>
        <NextLink href="/account" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium mt-2 inline-block">
          Back to Account
        </NextLink>
      </div>
    );
  }

  const shippingAddr = order.shipping_address;

  return (
    <div className="space-y-6">
      {/* Back link */}
      <NextLink
        href="/account"
        className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Back to Account
      </NextLink>

      {/* Order Header */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <PackageIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">
                Order #{order.display_id || order.id.slice(-8)}
              </h1>
              <p className="text-sm text-white/60">
                Placed {new Date(order.created_at).toLocaleDateString("en-US", {
                  year: "numeric", month: "long", day: "numeric",
                })}
              </p>
            </div>
            <span className="ml-auto px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300">
              {order.fulfillment_status || order.status || "processing"}
            </span>
          </div>
        </div>

        {/* Items */}
        <div className="p-6 space-y-4">
          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Items</h2>
          <div className="space-y-3">
            {(order.items || []).map((item: any) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-slate-900">{item.title || item.product_title}</p>
                  <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-semibold text-slate-900">
                  ${((item.unit_price * item.quantity) / 100).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          {/* Shipping Address */}
          {shippingAddr && (
            <>
              <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider pt-4">
                Shipping Address
              </h2>
              <div className="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl">
                <p>{shippingAddr.first_name} {shippingAddr.last_name}</p>
                <p>{shippingAddr.address_1}{shippingAddr.address_2 ? `, ${shippingAddr.address_2}` : ""}</p>
                <p>{shippingAddr.city}, {shippingAddr.province} {shippingAddr.postal_code}</p>
              </div>
            </>
          )}

          {/* Payment Summary */}
          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider pt-4">
            Payment Summary
          </h2>
          <div className="bg-slate-50 p-4 rounded-xl space-y-2 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>${((order.subtotal || 0) / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping</span>
              <span>${((order.shipping_total || 0) / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Tax</span>
              <span>${((order.tax_total || 0) / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-slate-900 pt-2 border-t border-slate-200">
              <span>Total</span>
              <span>${((order.total || 0) / 100).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  return (
    <AuthGuard>
      <OrderDetail />
    </AuthGuard>
  );
}
