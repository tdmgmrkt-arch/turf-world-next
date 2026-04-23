import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import {
  ArrowRight as LucideArrowRight,
  CheckCircle as LucideCheckCircle,
  ShieldCheck as LucideShieldCheck,
  Zap as LucideZap,
  DollarSign as LucideDollarSign,
  CalendarClock as LucideCalendarClock,
  CreditCard as LucideCreditCard,
  Lock as LucideLock,
} from "lucide-react";
import { Button as ShadcnButton } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";

const Button = ShadcnButton as any;
const ArrowRight = LucideArrowRight as any;
const CheckCircle = LucideCheckCircle as any;
const ShieldCheck = LucideShieldCheck as any;
const Zap = LucideZap as any;
const DollarSign = LucideDollarSign as any;
const CalendarClock = LucideCalendarClock as any;
const CreditCard = LucideCreditCard as any;
const Lock = LucideLock as any;

const MOMNT_MERCHANT_ID = "947ba4fd-b186-4e43-8d6f-77b227e2d065";

export const metadata: Metadata = {
  title: "Financing | Turf World",
  description:
    "Pay over time with flexible financing from Momnt. Qualified borrowers can access up to $75,000 for their artificial turf project with no impact on credit score to pre-qualify.",
  keywords: [
    "turf financing",
    "artificial grass financing",
    "home improvement financing",
    "pay over time",
    "Momnt financing",
  ],
};

const benefits = [
  {
    icon: ShieldCheck,
    title: "No impact to your credit",
    description:
      "See if you pre-qualify without affecting your credit score. Only a soft credit check is used to show your offers.",
  },
  {
    icon: DollarSign,
    title: "Up to $75,000",
    description:
      "Qualified borrowers can access financing up to $75,000 — enough for large residential or commercial turf projects.",
  },
  {
    icon: CalendarClock,
    title: "Convenient monthly payments",
    description:
      "Spread the cost across manageable monthly payments so you can start your project now and pay over time.",
  },
  {
    icon: Zap,
    title: "No early payment penalties",
    description:
      "Pay off your loan early whenever you want. There are never any prepayment fees or hidden charges.",
  },
];

const steps = [
  {
    number: 1,
    title: "Answer a few questions",
    description:
      "Click Get Financing Today and fill out a short form. Takes about two minutes — no documents required.",
  },
  {
    number: 2,
    title: "See your offers instantly",
    description:
      "Review personalized financing offers with no impact to your credit score. Choose the terms that work best.",
  },
  {
    number: 3,
    title: "Shop and pay over time",
    description:
      "Once approved, use your financing toward any Turf World order and spread the cost across monthly payments.",
  },
];

export default function FinancingPage() {
  return (
    <div className="min-h-screen">
      {/* Momnt widget script — loads once on this page */}
      <Script
        src="https://momnt-prod.s3.amazonaws.com/widgets/mega_widget.min.js"
        strategy="afterInteractive"
      />

      <Breadcrumb items={[{ label: "Financing" }]} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 sm:py-16 md:py-24">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#34CE95]/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#34CE95]/5 rounded-full blur-[100px]" />

        <div className="container px-4 sm:px-6 relative z-10">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-xs sm:text-sm text-white/80 mb-4 sm:mb-6">
              <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#34CE95]" />
              <span>Easy Financing with Momnt</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
              Start your project now.{" "}
              <span className="text-[#34CE95]">Pay over time.</span>
            </h1>

            <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              Simple, fast financing up to $75,000 for your artificial turf project. See if you pre-qualify in minutes with no impact to your credit score.
            </p>

            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-6 sm:mt-8">
              <div className="flex items-center gap-2 text-white/60">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#34CE95]/20 flex items-center justify-center">
                  <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#34CE95]" />
                </div>
                <span className="text-xs sm:text-sm">Soft credit check</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#34CE95]/20 flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#34CE95]" />
                </div>
                <span className="text-xs sm:text-sm">Instant pre-qualification</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#34CE95]/20 flex items-center justify-center">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#34CE95]" />
                </div>
                <span className="text-xs sm:text-sm">No early payoff fees</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Copy + Widget */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4 sm:px-6">
          <div className="grid gap-10 lg:gap-16 lg:grid-cols-2 items-start max-w-6xl mx-auto">
            {/* Left: copy (Momnt-approved) */}
            <div>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#34CE95] uppercase tracking-wider mb-4">
                Easy Financing Options
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Financing that works for your project
              </h2>
              <div className="space-y-6">
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  We work with Momnt<sup>*</sup> to bring our customers simple, fast, and affordable financing options. Convenient monthly payments allow you to pay over time for home improvement projects.
                </p>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  Simply answer a few questions to see if you're pre-qualified. Once pre-qualified, you're able to view promotional financing offers with <strong className="text-foreground">no impact on your credit score</strong>.
                </p>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  Qualified borrowers can access up to <strong className="text-foreground">$75,000</strong>, and there are <strong className="text-foreground">no early payment penalties</strong>.
                </p>
                <p className="text-base text-muted-foreground pt-2">
                  See if you pre-qualify today with no impact on your credit score by clicking{" "}
                  <strong className="text-foreground">Get Financing Today</strong>.
                </p>
              </div>

              {/* Key benefits — grounded block to visually balance the right column */}
              <div className="mt-10 grid grid-cols-3 gap-4 p-6 sm:p-7 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#34CE95]/10 flex items-center justify-center mb-3">
                    <Zap className="w-5 h-5 text-[#34CE95]" />
                  </div>
                  <div className="text-xl md:text-2xl font-bold text-slate-900">2 min</div>
                  <div className="text-xs text-slate-500 leading-snug mt-1">to pre-qualify</div>
                </div>
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#34CE95]/10 flex items-center justify-center mb-3">
                    <DollarSign className="w-5 h-5 text-[#34CE95]" />
                  </div>
                  <div className="text-xl md:text-2xl font-bold text-slate-900">$75K</div>
                  <div className="text-xs text-slate-500 leading-snug mt-1">max loan amount</div>
                </div>
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#34CE95]/10 flex items-center justify-center mb-3">
                    <CheckCircle className="w-5 h-5 text-[#34CE95]" />
                  </div>
                  <div className="text-xl md:text-2xl font-bold text-slate-900">$0</div>
                  <div className="text-xs text-slate-500 leading-snug mt-1">early payoff fees</div>
                </div>
              </div>
            </div>

            {/* Right: image + Momnt widget */}
            <div id="financing-widget" className="flex flex-col items-center lg:items-end gap-6 scroll-mt-24">
              {/* Lifestyle image */}
              <div className="relative w-full max-w-md aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border border-slate-200">
                <Image
                  src="/financing.png"
                  alt="Homeowners reviewing financing options together"
                  fill
                  className="object-cover"
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  priority
                />
              </div>

              {/* Momnt widget card — subtle bg only, no border/shadow so Momnt's own card pops */}
              <div className="w-full max-w-md rounded-3xl bg-slate-50 p-6 md:p-8">
                <div className="text-center mb-5">
                  <p className="text-xs font-semibold text-[#34CE95] uppercase tracking-wider mb-2">
                    Apply Now
                  </p>
                  <h3 className="text-2xl font-bold text-slate-900">
                    Ready to get started?
                  </h3>
                  <p className="text-sm text-slate-600 mt-2">
                    Click the button below — pre-qualify in about 2 minutes.
                  </p>
                </div>

                {/* Momnt widget mount point (renders "Get Financing Today" button + branding) */}
                <div
                  id="momnt-widget"
                  data-merchant-id={MOMNT_MERCHANT_ID}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container px-4 sm:px-6">
          <div className="text-center mb-12 md:mb-16">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#34CE95] uppercase tracking-wider mb-4">
              How It Works
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              Three steps to your new turf
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {steps.map((step) => (
              <div
                key={step.number}
                className="relative p-8 rounded-3xl bg-white border border-border/50 shadow-lg"
              >
                <div className="absolute -top-5 left-8">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#34CE95] to-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {step.number}
                  </div>
                </div>
                <div className="pt-4">
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container px-4 sm:px-6">
          <div className="text-center mb-12 md:mb-16 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#34CE95] uppercase tracking-wider mb-4">
              Why Momnt Financing
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              Built for home improvement projects
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#34CE95] to-emerald-600 flex items-center justify-center text-white shadow-lg">
                    <benefit.icon className="w-7 h-7" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#34CE95]/10 rounded-full blur-[150px]" />

        <div className="container px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
              See what you qualify for today
            </h2>
            <p className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed mb-10">
              Pre-qualification takes about two minutes and won't affect your credit score. Review your offers, choose the terms you like, and start your project.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="h-14 px-8 bg-[#34CE95] hover:bg-emerald-500 text-white text-base font-semibold" asChild>
                <Link href="#financing-widget">
                  Get Financing Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button variant="outline" size="lg" className="h-14 px-6 bg-white/10 border-white/20 text-white hover:bg-white/20" asChild>
                <Link href="/products">
                  Browse Turf Products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Legal / Disclosure — compliance required, visually subdued */}
      <section className="py-5 bg-slate-50">
        <div className="container px-4 sm:px-6 flex gap-3 sm:gap-4 items-center">
          {/* Equal Housing Lender logo — required by Momnt for home improvement merchants advertising financing */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/Equal-Housing-Lender-Landscape-Logo.webp"
            alt="Equal Housing Lender"
            width={80}
            height={24}
            className="h-5 sm:h-6 w-auto object-contain opacity-60 flex-shrink-0"
          />

          <p className="text-[11px] sm:text-xs text-slate-500 leading-snug">
            <sup>*</sup>Momnt Technologies, Inc. arranges consumer loans used to purchase goods and services from its participating merchant businesses. All loans are originated by participating{" "}
            <a
              href="https://momnt.com/financial-institutions"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-slate-700"
            >
              financial institutions
            </a>
            . Financing subject to credit approval. Rates and terms vary based on creditworthiness.
          </p>
        </div>
      </section>
    </div>
  );
}
