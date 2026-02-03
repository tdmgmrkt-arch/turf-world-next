import { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle,
  Package,
  Truck,
  Mail,
  Phone,
  ArrowRight,
  Shield,
  Sparkles,
  Award,
  ClipboardCheck,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Order Confirmed | Turf World",
  description: "Your artificial turf order has been confirmed.",
};

interface OrderConfirmationPageProps {
  searchParams: Promise<{ order?: string }>;
}

export default async function OrderConfirmationPage({
  searchParams,
}: OrderConfirmationPageProps) {
  const { order: orderId } = await searchParams;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Success Hero */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />

        <div className="container relative z-10 py-16 md:py-24">
          <div className="mx-auto max-w-2xl text-center">
            {/* Animated Success Icon */}
            <div className="relative mx-auto mb-8">
              <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                <CheckCircle className="h-12 w-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-white flex items-center justify-center shadow-lg">
                <Sparkles className="h-4 w-4 text-emerald-500" />
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white">
              Order Confirmed!
            </h1>
            <p className="mt-4 text-lg text-white/70 max-w-md mx-auto">
              Thank you for your purchase. We&apos;ve sent a confirmation email with your order details.
            </p>

            {orderId && (
              <div className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
                <span className="text-sm text-white/60">Order number:</span>
                <span className="font-mono font-bold text-white">{orderId}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* What's Next */}
      <div className="container py-16 md:py-20">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-xl font-bold text-slate-900 mb-8">
            What Happens Next
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            <StepCard
              icon={<Mail className="h-5 w-5" />}
              step={1}
              title="Confirmation Email"
              description="You'll receive an order confirmation with your receipt within a few minutes."
            />
            <StepCard
              icon={<Package className="h-5 w-5" />}
              step={2}
              title="Order Processing"
              description="We'll prepare your turf for shipment. This typically takes 1-2 business days."
            />
            <StepCard
              icon={<Truck className="h-5 w-5" />}
              step={3}
              title="Freight Delivery"
              description="The freight carrier will contact you to schedule delivery. Someone must be present to sign."
            />
          </div>
        </div>
      </div>

      {/* Delivery Info Card */}
      <div className="container pb-16">
        <div className="mx-auto max-w-4xl">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <ClipboardCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Important Delivery Information</h2>
                  <p className="text-sm text-white/60">Please review before your delivery arrives</p>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <Truck className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Freight Delivery</h3>
                    <p className="text-sm text-slate-600 mt-1">
                      Turf rolls ship via LTL freight carrier. The carrier will call you 24-48 hours before delivery.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Signature Required</h3>
                    <p className="text-sm text-slate-600 mt-1">
                      Someone 18+ must be present to sign. The driver will deliver to your driveway or curbside.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <ClipboardCheck className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Inspect on Arrival</h3>
                    <p className="text-sm text-slate-600 mt-1">
                      Please inspect turf rolls before signing. Note any visible damage on the delivery receipt.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Installation CTA */}
      <div className="container pb-16">
        <div className="mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-8 md:p-12">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px]" />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Award className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold text-white">Need Installation Help?</h2>
                  <p className="text-emerald-100 mt-1">
                    Find a certified installer in your area for professional installation.
                  </p>
                </div>
              </div>
              <Button
                size="lg"
                className="h-14 px-8 bg-white text-emerald-600 hover:bg-white/90 rounded-xl font-semibold whitespace-nowrap"
                asChild
              >
                <Link href="/installers">
                  Find Installers
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Support Section */}
      <div className="container pb-16">
        <div className="mx-auto max-w-4xl">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-6 h-6 text-slate-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Questions About Your Order?</h2>
              <p className="text-slate-600 mt-1">Our support team is here to help</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="tel:(909) 491-2203"
                className="flex items-center gap-3 px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors w-full sm:w-auto justify-center"
              >
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                  <Phone className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-slate-500">Call Us</p>
                  <p className="font-bold text-slate-900">(909) 491-2203</p>
                </div>
              </a>
              <a
                href="mailto:support@turfworld.com"
                className="flex items-center gap-3 px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors w-full sm:w-auto justify-center"
              >
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                  <Mail className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-slate-500">Email Us</p>
                  <p className="font-bold text-slate-900">support@turfworld.com</p>
                </div>
              </a>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 text-center">
              <Button variant="outline" className="h-12 px-8 rounded-xl" asChild>
                <Link href="/products">
                  Continue Shopping
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepCard({
  icon,
  step,
  title,
  description,
}: {
  icon: React.ReactNode;
  step: number;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
        {icon}
      </div>
      <div className="mb-2 text-xs font-medium text-slate-500 uppercase tracking-wide">
        Step {step}
      </div>
      <h3 className="font-bold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
    </div>
  );
}
