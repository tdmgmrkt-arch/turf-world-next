"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { AuthGuard } from "@/components/account/auth-guard";
import { medusa } from "@/lib/medusa";
import { ArrowLeft, Package, Loader2 } from "lucide-react";
import Link from "next/link";

const ArrowLeftIcon = ArrowLeft as any;
const PackageIcon = Package as any;
const LoaderIcon = Loader2 as any;
const NextLink = Link as any;
const NextImage = Image as any;

/** Map Medusa fulfillment status to a customer-friendly label + color */
function friendlyStatus(status: string | undefined) {
  switch (status) {
    case "fulfilled":
      return { label: "Shipped", cls: "bg-emerald-500/20 text-emerald-300" };
    case "partially_fulfilled":
      return { label: "Partially Shipped", cls: "bg-amber-500/20 text-amber-300" };
    case "shipped":
      return { label: "Shipped", cls: "bg-emerald-500/20 text-emerald-300" };
    case "delivered":
      return { label: "Delivered", cls: "bg-emerald-500/20 text-emerald-300" };
    case "canceled":
    case "cancelled":
      return { label: "Cancelled", cls: "bg-red-500/20 text-red-300" };
    case "returned":
      return { label: "Returned", cls: "bg-slate-500/20 text-slate-300" };
    case "not_fulfilled":
    default:
      return { label: "Processing", cls: "bg-blue-500/20 text-blue-300" };
  }
}

/** Get display title and quantity label for an order line item */
function getItemDisplay(item: any) {
  const meta = item.metadata || {};
  const title = meta.custom_title || item.title || item.product_title;
  const isTurf = !!meta.cut_square_feet;
  const qtyLabel = isTurf
    ? `${Math.round(meta.cut_square_feet)} sq ft`
    : `Qty: ${item.quantity}`;
  const dimensions = isTurf && meta.cut_width_ft && meta.cut_length_ft
    ? `${meta.cut_width_ft}' × ${meta.cut_length_ft}'`
    : null;
  return { title, qtyLabel, dimensions };
}

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
  const status = friendlyStatus(order.fulfillment_status || order.status);

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
            <span className={`ml-auto px-3 py-1 rounded-full text-xs font-medium ${status.cls}`}>
              {status.label}
            </span>
          </div>
        </div>

        {/* Items */}
        <div className="p-6 space-y-4">
          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">Items</h2>
          <div className="space-y-3">
            {(order.items || []).map((item: any) => {
              const display = getItemDisplay(item);
              return (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <div className="h-14 w-14 flex-shrink-0 rounded-lg bg-white overflow-hidden border border-slate-200">
                    {item.thumbnail ? (
                      <NextImage src={item.thumbnail} alt={display.title} width={56} height={56} className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <PackageIcon className="h-6 w-6 text-slate-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900">{display.title}</p>
                    <p className="text-xs text-slate-500">
                      {display.dimensions && <>{display.dimensions}<span className="mx-1">·</span></>}
                      {display.qtyLabel}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 flex-shrink-0">
                    ${(item.unit_price * item.quantity).toFixed(2)}
                  </p>
                </div>
              );
            })}
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
              <span>${(order.subtotal || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping</span>
              <span>${(order.shipping_total || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Tax</span>
              <span>${(order.tax_total || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold text-slate-900 pt-2 border-t border-slate-200">
              <span>Total</span>
              <span>${(order.total || 0).toFixed(2)}</span>
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
