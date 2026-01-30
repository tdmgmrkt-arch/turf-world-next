"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, X, Truck, Shield, Sparkles, ArrowRight, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";

const FREE_SHIPPING_THRESHOLD = 150000; // $1,500 in cents

/**
 * CartDrawer - Premium sliding cart
 *
 * Features:
 * - Shows all cart items with quantity controls
 * - Free shipping progress bar
 * - Smart cross-sell suggestions
 * - Trust badges and branding
 */
export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal } =
    useCartStore();

  const subtotal = getSubtotal();
  const hasTurf = items.some((item) => item.dimensions);
  const freeShippingProgress = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const amountToFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;

  // Smart cross-sell: if turf in cart, suggest infill
  const suggestInfill = hasTurf && !items.some((item) => item.title.toLowerCase().includes("infill"));

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className="flex w-full flex-col p-0 sm:max-w-md">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                <ShoppingBag className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Your Cart</h2>
                <p className="text-sm text-white/60">
                  {items.length} {items.length === 1 ? "item" : "items"}
                </p>
              </div>
            </div>
            <button
              onClick={closeCart}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Free Shipping Progress */}
          {items.length > 0 && (
            <div className="mt-4">
              {subtotal >= FREE_SHIPPING_THRESHOLD ? (
                <div className="flex items-center gap-2 text-emerald-400">
                  <Truck className="h-4 w-4" />
                  <span className="text-sm font-medium">You&apos;ve unlocked FREE shipping!</span>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Add {formatPrice(amountToFreeShipping)} for FREE shipping</span>
                    <span className="text-white/80 font-medium">{Math.round(freeShippingProgress)}%</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${freeShippingProgress}%` }}
                    />
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {items.length === 0 ? (
          /* Empty Cart State */
          <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8 text-center">
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-slate-100 flex items-center justify-center">
                <ShoppingBag className="h-12 w-12 text-slate-300" />
              </div>
              <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-emerald-600" />
              </div>
            </div>
            <div>
              <p className="text-xl font-bold text-slate-900">Your cart is empty</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Discover our premium artificial turf collection
              </p>
            </div>
            <Button asChild onClick={closeCart} size="lg" className="px-8">
              <Link href="/products">
                Browse Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <ul className="space-y-3">
                {items.map((item) => (
                  <li
                    key={item.id}
                    className="group relative flex gap-4 rounded-xl border border-slate-200 bg-white p-3 hover:border-slate-300 hover:shadow-sm transition-all"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                      {item.thumbnail ? (
                        <Image
                          src={item.thumbnail}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <Package className="h-8 w-8 text-slate-300" />
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex flex-1 flex-col min-w-0">
                      <div className="flex justify-between gap-2">
                        <h3 className="text-sm font-semibold text-slate-900 truncate">{item.title}</h3>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          aria-label={`Remove ${item.title} from cart`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Dimensions if turf */}
                      {item.dimensions && (
                        <p className="text-xs text-slate-500 mt-0.5">
                          {item.dimensions.widthFeet}&apos; × {item.dimensions.lengthFeet}&apos;
                          <span className="text-slate-400 mx-1">•</span>
                          {item.dimensions.squareFeet} sq ft
                        </p>
                      )}

                      <div className="mt-auto flex items-center justify-between pt-2">
                        {/* Quantity controls */}
                        <div className="flex items-center gap-0.5 rounded-lg border border-slate-200 bg-slate-50">
                          <button
                            className="h-7 w-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-l-lg transition-colors"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium text-slate-900">
                            {item.quantity}
                          </span>
                          <button
                            className="h-7 w-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 rounded-r-lg transition-colors"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <p className="text-sm font-bold text-slate-900">
                          {formatPrice(item.unitPrice * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Smart Cross-Sell */}
              {suggestInfill && (
                <div className="mt-4 rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 flex-shrink-0">
                      <Sparkles className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">
                        Complete your installation
                      </p>
                      <p className="mt-0.5 text-xs text-slate-600">
                        Add infill for proper drainage, stability, and a natural look.
                      </p>
                      <Link
                        href="/supplies"
                        onClick={closeCart}
                        className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline"
                      >
                        Shop Supplies
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="border-t bg-slate-50 px-6 py-5">
              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-4 mb-4 pb-4 border-b border-slate-200">
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Shield className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Secure Checkout</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Truck className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Fast Shipping</span>
                </div>
              </div>

              {/* Subtotal */}
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-slate-600">Subtotal</span>
                <span className="text-xl font-bold text-slate-900">{formatPrice(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-slate-500">
                Shipping and taxes calculated at checkout
              </p>

              {/* CTA Buttons */}
              <div className="mt-4 space-y-2">
                <Button className="w-full h-12 text-base font-semibold" size="lg" asChild>
                  <Link href="/checkout" onClick={closeCart}>
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <button
                  onClick={closeCart}
                  className="w-full py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
