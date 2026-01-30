"use client";

import { Shield, Lock, Truck } from "lucide-react";
import { CheckoutForm } from "./checkout-form";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Premium Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800">
        <div className="container py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Secure Checkout</h1>
              <p className="text-white/60 mt-1">Complete your order in just a few steps</p>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2 text-white/80">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Lock className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-sm">256-bit SSL</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-sm">Secure Payment</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Truck className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-sm">Free Shipping</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Content */}
      <div className="container py-8 md:py-12">
        <CheckoutForm />
      </div>
    </div>
  );
}
