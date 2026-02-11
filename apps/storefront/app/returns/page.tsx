import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Package as LucidePackage,
  CheckCircle as LucideCheckCircle,
  AlertTriangle as LucideAlertTriangle,
  FileText as LucideFileText,
  Clock as LucideClock,
  Phone as LucidePhone,
  ArrowRight as LucideArrowRight,
  RotateCcw as LucideRotateCcw,
  ShieldCheck as LucideShieldCheck,
  XCircle as LucideXCircle,
} from "lucide-react";
import { Button as ShadcnButton } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";

// Cast to work around React 19 JSX type incompatibility
const Button = ShadcnButton as any;
const Package = LucidePackage as any;
const CheckCircle = LucideCheckCircle as any;
const AlertTriangle = LucideAlertTriangle as any;
const FileText = LucideFileText as any;
const Clock = LucideClock as any;
const Phone = LucidePhone as any;
const ArrowRight = LucideArrowRight as any;
const RotateCcw = LucideRotateCcw as any;
const ShieldCheck = LucideShieldCheck as any;
const XCircle = LucideXCircle as any;

export const metadata: Metadata = {
  title: "Return Policy | Turf World",
  description:
    "Turf World offers a 30-day return policy on most products. Learn about our return process, conditions, and how to initiate a return.",
  keywords: [
    "turf return policy",
    "artificial grass returns",
    "turf refund policy",
    "return artificial turf",
  ],
};

const returnConditions = [
  "Product must be unused, in original packaging, and in resalable condition",
  "Returns must be initiated within 30 days of delivery",
  "Original sales receipt or order number must be provided",
  "Product must not have been installed or cut",
  "All original labels, tags, and accessories must be included",
  "Custom orders and cut-to-size products are non-returnable",
];

const nonReturnableItems = [
  "Custom-ordered or special-ordered products",
  "Products that have been installed or cut",
  "Turf rolls that have been opened or unrolled",
  "Products damaged due to improper handling or storage",
  "Clearance or final sale items (marked as such)",
  "Infill products once opened",
];

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/50 to-background">
      <Breadcrumb items={[{ label: "Return Policy" }]} />

      {/* Hero Section */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <Image
          src="/turf-hero.webp"
          alt="Return Policy"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-slate-900/70" />

        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 mb-6 shadow-lg shadow-primary/30">
              <RotateCcw className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Return Policy
            </h1>
            <p className="text-lg text-white/60 max-w-xl mx-auto">
              We want you to be completely satisfied with your purchase. Review
              our return policy and process below.
            </p>
          </div>
        </div>
      </section>

      {/* Policy Highlights */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="px-4 sm:px-6">
            <div className="grid sm:grid-cols-3 gap-4 mb-10">
              {[
                {
                  label: "Return Window",
                  value: "30 Days",
                  detail: "From delivery date",
                  color: "from-primary to-emerald-600",
                },
                {
                  label: "Condition",
                  value: "Unused",
                  detail: "Original packaging required",
                  color: "from-emerald-500 to-emerald-700",
                },
                {
                  label: "Restocking Fee",
                  value: "20%",
                  detail: "Applied to all returns",
                  color: "from-amber-500 to-orange-600",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="relative overflow-hidden rounded-2xl bg-white border border-border/50 shadow-lg p-6 text-center"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-emerald-500/5 opacity-0 hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {item.label}
                    </span>
                    <p
                      className={`mt-2 text-2xl md:text-3xl font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}
                    >
                      {item.value}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Return Process */}
            <div className="group relative overflow-hidden rounded-2xl bg-white border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative p-6 md:p-8">
                <div className="flex items-start gap-4 md:gap-6">
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
                        <RotateCcw className="w-6 h-6 md:w-7 md:h-7 text-white" />
                      </div>
                      <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                        01
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                      How to Initiate a Return
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      To start a return, contact our customer service team within
                      30 days of receiving your order. Returns must be approved
                      before shipping products back to us.
                    </p>
                    <div className="space-y-2 mb-4">
                      {[
                        "Call us at (909) 491-2203 or email orders@turf-world.com",
                        "Provide your order number and reason for return",
                        "Wait for return authorization (RMA) number",
                        "Pack items securely in original packaging",
                        "Ship to the address provided with your RMA",
                        "Include RMA number clearly visible on package",
                      ].map((step) => (
                        <div
                          key={step}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          {step}
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      <strong>Important:</strong> Returns sent without prior
                      authorization will not be accepted. Customer is responsible
                      for return shipping costs unless the return is due to our
                      error.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Return Conditions */}
            <div className="group relative overflow-hidden rounded-2xl bg-white border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative p-6 md:p-8">
                <div className="flex items-start gap-4 md:gap-6">
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
                        <ShieldCheck className="w-6 h-6 md:w-7 md:h-7 text-white" />
                      </div>
                      <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                        02
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                      Return Requirements
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      To qualify for a return and refund, products must meet the
                      following conditions:
                    </p>

                    <div className="grid sm:grid-cols-2 gap-2">
                      {returnConditions.map((condition) => (
                        <div
                          key={condition}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                          {condition}
                        </div>
                      ))}
                    </div>

                    <p className="mt-4 text-sm text-muted-foreground">
                      Products that do not meet these conditions will be refused
                      or subject to reduced refund amounts at our discretion.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Non-Returnable Items */}
            <div className="group relative overflow-hidden rounded-2xl bg-white border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative p-6 md:p-8">
                <div className="flex items-start gap-4 md:gap-6">
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform duration-300">
                        <XCircle className="w-6 h-6 md:w-7 md:h-7 text-white" />
                      </div>
                      <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                        03
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                      Non-Returnable Items
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      The following items cannot be returned once purchased:
                    </p>

                    <div className="grid sm:grid-cols-2 gap-2">
                      {nonReturnableItems.map((item) => (
                        <div
                          key={item}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                          {item}
                        </div>
                      ))}
                    </div>

                    <p className="mt-4 text-sm text-muted-foreground">
                      Please inspect your order carefully upon delivery. If you
                      receive damaged or defective products, contact us
                      immediately for replacement options.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Refund Process */}
            <div className="group relative overflow-hidden rounded-2xl bg-white border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative p-6 md:p-8">
                <div className="flex items-start gap-4 md:gap-6">
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
                        <Clock className="w-6 h-6 md:w-7 md:h-7 text-white" />
                      </div>
                      <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                        04
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                      Refunds & Processing Time
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Once we receive and inspect your returned product, we will
                      process your refund according to the following terms:
                    </p>
                    <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                      <p>
                        <strong>Restocking Fee:</strong> A 20% restocking fee
                        applies to all approved returns. This fee covers
                        inspection, repackaging, and processing costs.
                      </p>
                      <p>
                        <strong>Shipping Costs:</strong> Original shipping
                        charges are non-refundable. Customer is responsible for
                        return shipping costs unless the return is due to our
                        error or a defective product.
                      </p>
                      <p>
                        <strong>Processing Time:</strong> Refunds are typically
                        processed within 5-7 business days after we receive and
                        inspect the returned items. Refunds will be issued to the
                        original payment method.
                      </p>
                      <p>
                        <strong>Credit Card Refunds:</strong> Please allow an
                        additional 2-10 business days for your financial
                        institution to post the refund to your account.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Exchanges */}
            <div className="group relative overflow-hidden rounded-2xl bg-white border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative p-6 md:p-8">
                <div className="flex items-start gap-4 md:gap-6">
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center shadow-lg shadow-slate-500/20 group-hover:scale-105 transition-transform duration-300">
                        <Package className="w-6 h-6 md:w-7 md:h-7 text-white" />
                      </div>
                      <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                        05
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                      Exchanges
                    </h2>
                    <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                      <p>
                        We currently do not offer direct exchanges. If you need a
                        different product, please initiate a return for the
                        original item and place a new order for the desired
                        product.
                      </p>
                      <p>
                        <strong>Defective or Damaged Products:</strong> If you
                        receive a defective or damaged product, please contact us
                        immediately. We will arrange for a replacement at no
                        additional cost, including shipping, if the damage
                        occurred in transit or is due to a manufacturing defect.
                      </p>
                      <p>
                        For defective items, please provide photos of the damage
                        or defect when contacting us to expedite the replacement
                        process.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 md:p-8 shadow-2xl mb-6">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl" />

              <div className="relative">
                <div className="flex items-start gap-4 md:gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                      <Phone className="w-6 h-6 md:w-7 md:h-7 text-white" />
                    </div>
                  </div>

                  <div className="flex-1">
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
                      Need Help with a Return?
                    </h2>
                    <p className="text-white/70 leading-relaxed mb-4">
                      Our customer service team is ready to assist you with
                      returns, exchanges, or any questions about our policy.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <a
                        href="tel:909-491-2203"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        (909) 491-2203
                      </a>
                      <a
                        href="mailto:orders@turf-world.com"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium transition-colors"
                      >
                        orders@turf-world.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24 border-t">
        <div className="container text-center">
          <h2 className="max-w-3xl mx-auto">
            Shop with Confidence
          </h2>
          <p className="mt-6 text-body-lg text-muted-foreground max-w-xl mx-auto">
            Not sure which turf is right for you? Order free samples to see and
            feel the quality before you buy.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="btn-premium text-lg px-8 h-14"
              asChild
            >
              <Link href="/samples">
                Get Free Samples
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 h-14"
              asChild
            >
              <Link href="/products">Shop All Turf</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
