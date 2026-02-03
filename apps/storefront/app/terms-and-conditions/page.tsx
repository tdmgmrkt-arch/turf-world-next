import { Metadata } from "next";
import Link from "next/link";
import {
  FileText as LucideFileText,
  Headphones as LucideHeadphones,
  ShieldCheck as LucideShieldCheck,
  Building2 as LucideBuilding2,
  CreditCard as LucideCreditCard,
  Phone as LucidePhone,
} from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";

// Cast Lucide icons to work around React 19 JSX type incompatibility
const FileText = LucideFileText as any;
const Headphones = LucideHeadphones as any;
const ShieldCheck = LucideShieldCheck as any;
const Building2 = LucideBuilding2 as any;
const CreditCard = LucideCreditCard as any;
const Phone = LucidePhone as any;

export const metadata: Metadata = {
  title: "Terms & Conditions | Turf World",
  description: "Turf World terms and conditions - customer care, privacy, wholesale inquiries, and payment methods.",
};

export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/50 to-background">
      <Breadcrumb items={[{ label: "Terms & Conditions" }]} />

      {/* Hero Section */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl" />

        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 mb-6 shadow-lg shadow-primary/30">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Terms & Conditions
            </h1>
            <p className="text-lg text-white/60">
              Everything you need to know about shopping with Turf World.
            </p>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-6 md:gap-8">

              {/* Customer Care */}
              <div className="group relative overflow-hidden rounded-2xl bg-white border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative p-6 md:p-8">
                  <div className="flex items-start gap-4 md:gap-6">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-lg shadow-primary/20 flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                      <Headphones className="w-6 h-6 md:w-7 md:h-7 text-white" />
                    </div>

                    <div className="flex-1">
                      <h2 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                        Customer Care
                      </h2>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        Need help with an order or have questions about our products? Our dedicated team is here to assist you every step of the way.
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <a
                          href="tel:909-491-2203"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 font-medium transition-colors"
                        >
                          <Phone className="w-4 h-4 text-primary" />
                          909-491-2203
                        </a>
                        <a
                          href="mailto:orders@turf-world.com"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary font-medium transition-colors"
                        >
                          orders@turf-world.com
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Privacy & Safety */}
              <div className="group relative overflow-hidden rounded-2xl bg-white border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative p-6 md:p-8">
                  <div className="flex items-start gap-4 md:gap-6">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                      <ShieldCheck className="w-6 h-6 md:w-7 md:h-7 text-white" />
                    </div>

                    <div className="flex-1">
                      <h2 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                        Privacy & Safety
                      </h2>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        Your privacy is important to us. We are committed to protecting your personal information and ensuring a safe, secure shopping experience.
                      </p>
                      <Link
                        href="/privacy-policy"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 font-medium transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        View Privacy Policy
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Wholesale Inquiries */}
              <div className="group relative overflow-hidden rounded-2xl bg-white border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative p-6 md:p-8">
                  <div className="flex items-start gap-4 md:gap-6">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20 flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                      <Building2 className="w-6 h-6 md:w-7 md:h-7 text-white" />
                    </div>

                    <div className="flex-1">
                      <h2 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                        Wholesale Inquiries
                      </h2>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        Are you a contractor, landscaper, or business looking for wholesale pricing? We offer competitive rates for bulk orders and ongoing partnerships.
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <a
                          href="mailto:orders@turf-world.com"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 font-medium transition-colors"
                        >
                          Request Wholesale Pricing
                        </a>
                        <a
                          href="tel:909-491-2203"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 font-medium transition-colors"
                        >
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          Call Us
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 md:p-8 shadow-2xl">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl" />

                <div className="relative">
                  <div className="flex items-start gap-4 md:gap-6">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                      <CreditCard className="w-6 h-6 md:w-7 md:h-7 text-white" />
                    </div>

                    <div className="flex-1">
                      <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
                        Payment Methods
                      </h2>
                      <p className="text-white/70 leading-relaxed mb-5">
                        We accept multiple secure payment options for your convenience.
                      </p>

                      <div className="grid sm:grid-cols-2 gap-3 mb-5">
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-white font-medium text-sm">Credit & Debit Cards</p>
                            <p className="text-white/50 text-xs">Visa, Mastercard, Amex, Discover</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                          <div className="w-10 h-10 rounded-lg bg-[#0070ba]/20 flex items-center justify-center">
                            <span className="text-[#0070ba] font-bold text-sm">PP</span>
                          </div>
                          <div>
                            <p className="text-white font-medium text-sm">PayPal</p>
                            <p className="text-white/50 text-xs">Fast & secure checkout</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-white/50 text-sm">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>All transactions are encrypted and secure</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
