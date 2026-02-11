import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Shield as LucideShield,
  CheckCircle as LucideCheckCircle,
  AlertTriangle as LucideAlertTriangle,
  FileText as LucideFileText,
  Clock as LucideClock,
  Sparkles as LucideSparkles,
  Phone as LucidePhone,
  ArrowRight as LucideArrowRight,
  Droplets as LucideDroplets,
  Brush as LucideBrush,
  ShieldAlert as LucideShieldAlert,
  Megaphone as LucideMegaphone,
} from "lucide-react";
import { Button as ShadcnButton } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";

// Cast to work around React 19 JSX type incompatibility
const Button = ShadcnButton as any;
const Shield = LucideShield as any;
const CheckCircle = LucideCheckCircle as any;
const AlertTriangle = LucideAlertTriangle as any;
const FileText = LucideFileText as any;
const Clock = LucideClock as any;
const Sparkles = LucideSparkles as any;
const Phone = LucidePhone as any;
const ArrowRight = LucideArrowRight as any;
const Droplets = LucideDroplets as any;
const Brush = LucideBrush as any;
const ShieldAlert = LucideShieldAlert as any;
const Megaphone = LucideMegaphone as any;

export const metadata: Metadata = {
  title: "16-Year Warranty | Turf World",
  description:
    "Turf World offers an industry-leading 16-year warranty on all artificial grass — 8 years manufacturer + 8 years extended coverage.",
  keywords: [
    "artificial grass warranty",
    "turf warranty",
    "synthetic turf guarantee",
    "16 year turf warranty",
  ],
};

const warrantyExclusions = [
  "Burn, cut, accident, vandalism, abuse, negligence or neglect",
  "Wear or abrasion caused by an inadequate sub-base",
  "Use of inappropriate footwear or sports equipment",
  "Playing surface used for purposes other than originally designed",
  "Use of cleaning chemicals, herbicides or pesticides",
  "Use of improper cleaning methods",
  "Infill products of an incorrect grade",
  "Harmful chemical reactions caused by infill materials",
  "Post fibrillation during installation for non-installation purposes",
  "Failure to properly maintain, protect or repair the products",
  "Air/rain pH below 7.0 (acidic) or above 9.0 (alkaline)",
  "Acts of God or conditions beyond reasonable control",
];

const prorationSchedule = [
  {
    years: "Years 9–11",
    coverage: "100%",
    description:
      "Full coverage of remaining manufacturer warranty value at expiration",
  },
  {
    years: "Years 12–14",
    coverage: "50%",
    description:
      "Half coverage of remaining manufacturer warranty value at expiration",
  },
  {
    years: "Years 15–16",
    coverage: "25%",
    description:
      "Quarter coverage of remaining manufacturer warranty value at expiration",
  },
];

const careSteps = [
  {
    icon: Droplets,
    title: "Keep It Clean",
    points: [
      "Rainfall is the best natural cleanser — in dry areas, flush periodically with water",
      "Lightly soiled areas: sponge mop with 5% low-sudsing detergent in hot water, then rinse",
      "Heavily soiled areas: follow light cleaning with 3% ammonia solution, then rinse thoroughly",
      "Clean spills promptly — fresh spills are always easier than dried ones",
      "Never use chlorine bleach, caustic cleaners (pH above 9), or highly acidic cleaners (pH below 5)",
    ],
  },
  {
    icon: Brush,
    title: "Periodic Brushing",
    points: [
      'Cross-brush against the grain to keep fibers upright and restore appearance',
      "Focus on high-traffic areas where matting may occur",
      "Use a brush with synthetic bristles only — never metal or wire bristles",
      "Recommended quarterly for best results",
    ],
  },
  {
    icon: ShieldAlert,
    title: "Prevent Damage",
    points: [
      "Keep cigarettes, fireworks, and open flames away from turf",
      "Avoid placing furniture with sharp or jagged edges directly on turf",
      "Use plywood layers to distribute weight when using heavy equipment",
      "Never leave a vehicle idling on the turf",
      "Cap off or remove nearby sprinkler heads to prevent mineral deposits",
      "Ensure turf is not exposed to reflected sunlight from windows",
    ],
  },
  {
    icon: Megaphone,
    title: "Report Problems Early",
    points: [
      "Minor problems can become major issues quickly if not corrected",
      "Report any concerns promptly to Turf World",
      "Proper care extends the life, usefulness, and aesthetics of your turf",
    ],
  },
];

export default function WarrantyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/50 to-background">
      <Breadcrumb items={[{ label: "Warranty" }]} />

      {/* Hero Section */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <Image
          src="/turf-hero.webp"
          alt="Warranty"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-slate-900/70" />

        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 mb-6 shadow-lg shadow-primary/30">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              16-Year Warranty
            </h1>
            <p className="text-lg text-white/60 max-w-xl mx-auto">
              Industry-leading protection on every roll of Turf World artificial
              grass — 8 years manufacturer + 8 years extended.
            </p>
          </div>
        </div>
      </section>

      {/* Warranty Highlights */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="px-4 sm:px-6">
            <div className="grid sm:grid-cols-3 gap-4 mb-10">
              {[
                {
                  label: "Manufacturer",
                  years: "Years 1–8",
                  detail: "Full replacement for manufacturing defects",
                  color: "from-primary to-emerald-600",
                },
                {
                  label: "Extended",
                  years: "Years 9–16",
                  detail: "Prorated coverage by Turf World",
                  color: "from-emerald-500 to-emerald-700",
                },
                {
                  label: "Coverage",
                  years: "UV + Strength",
                  detail: "Guaranteed UV stability & fiber strength",
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
                      {item.years}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Manufacturer Warranty */}
            <div className="group relative overflow-hidden rounded-2xl bg-white border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative p-6 md:p-8">
                <div className="flex items-start gap-4 md:gap-6">
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
                        <Shield className="w-6 h-6 md:w-7 md:h-7 text-white" />
                      </div>
                      <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                        01
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                      Manufacturer Warranty — Years 1–8
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Under normal conditions during the 8-year manufacturer
                      warranty period, Turf World products are warranted to
                      maintain their UV stability and fiber strength. If the
                      product is damaged as a result of a manufacturing defect,
                      the defective product will be replaced free of charge.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Replacement covers the defective turf material only. Turf
                      World is not responsible for removal or disposal of
                      defective turf, or for installation of replacement
                      material.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Extended Warranty */}
            <div className="group relative overflow-hidden rounded-2xl bg-white border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative p-6 md:p-8">
                <div className="flex items-start gap-4 md:gap-6">
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
                        <Sparkles className="w-6 h-6 md:w-7 md:h-7 text-white" />
                      </div>
                      <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                        02
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                      Extended Warranty — Years 9–16
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Turf World provides an additional 8-year extended warranty
                      that supplements the manufacturer&apos;s warranty, for a
                      combined total of 16 years from the date of shipment. This
                      warranty covers manufacturing defects, UV degradation, and
                      excessive fading. The extended warranty is prorated as
                      follows:
                    </p>

                    {/* Proration Table */}
                    <div className="rounded-xl overflow-hidden border border-border/50">
                      <div className="grid grid-cols-3 bg-slate-50 text-sm font-semibold">
                        <div className="px-4 py-3">Period</div>
                        <div className="px-4 py-3">Coverage</div>
                        <div className="px-4 py-3 hidden sm:block">
                          Details
                        </div>
                      </div>
                      {prorationSchedule.map((row) => (
                        <div
                          key={row.years}
                          className="grid grid-cols-3 sm:grid-cols-3 border-t border-border/50 text-sm"
                        >
                          <div className="px-4 py-3 font-medium">
                            {row.years}
                          </div>
                          <div className="px-4 py-3">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                              {row.coverage}
                            </span>
                          </div>
                          <div className="px-4 py-3 text-muted-foreground hidden sm:block">
                            {row.description}
                          </div>
                        </div>
                      ))}
                    </div>

                    <p className="mt-4 text-sm text-muted-foreground">
                      This extended warranty applies only to the original
                      purchaser and does not transfer to contractors, retailers,
                      installers, or subsequent purchasers.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Exclusions */}
            <div className="group relative overflow-hidden rounded-2xl bg-white border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative p-6 md:p-8">
                <div className="flex items-start gap-4 md:gap-6">
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform duration-300">
                        <AlertTriangle className="w-6 h-6 md:w-7 md:h-7 text-white" />
                      </div>
                      <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                        03
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                      What&apos;s Not Covered
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      All synthetic turf is subject to normal wear and tear,
                      which is not a manufacturing defect and is not covered.
                      Additionally, the warranty does not cover damage caused by:
                    </p>

                    <div className="grid sm:grid-cols-2 gap-2">
                      {warrantyExclusions.map((exclusion) => (
                        <div
                          key={exclusion}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0 mt-1.5" />
                          {exclusion}
                        </div>
                      ))}
                    </div>

                    <p className="mt-4 text-sm text-muted-foreground">
                      Slight variations in texture, thatch yarn, or color
                      between dye lots are expected over the life of the product
                      and are not considered defects. Turf World cannot guarantee
                      matching dye lots for repairs done after installation.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Limitations */}
            <div className="group relative overflow-hidden rounded-2xl bg-white border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative p-6 md:p-8">
                <div className="flex items-start gap-4 md:gap-6">
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center shadow-lg shadow-slate-500/20 group-hover:scale-105 transition-transform duration-300">
                        <FileText className="w-6 h-6 md:w-7 md:h-7 text-white" />
                      </div>
                      <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                        04
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                      Limitations
                    </h2>
                    <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                      <p>
                        Turf World will not be liable for any manufacturing
                        defect until the manufacturer&apos;s warranty has
                        expired. All claims during years 1–8 must be made
                        against the manufacturer&apos;s warranty.
                      </p>
                      <p>
                        Authorized repairs performed by the manufacturer or Turf
                        World do not extend or restart the warranty period.
                      </p>
                      <p>
                        This warranty applies only to the turf material itself.
                        Turf World does not warrant the workmanship of
                        installation or any products used during installation.
                        The warranty applies only to material installed in a
                        suitable location in compliance with manufacturer
                        guidelines.
                      </p>
                      <p>
                        It is the original purchaser&apos;s responsibility to
                        determine suitability of the material for its intended
                        use. Turf World expressly disclaims warranties of
                        merchantability and fitness for a particular purpose.
                      </p>
                      <p>
                        Turf World will not be liable for consequential,
                        special, indirect, or incidental damages, including lost
                        profits, loss of use, labor costs for removal or
                        replacement, or freight. Maximum liability shall not
                        exceed the original purchase price of the material.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Claims */}
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
                        05
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                      How to File a Claim
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Claims must be submitted in writing within 30 days of
                      discovering the alleged defect and must include:
                    </p>
                    <div className="space-y-2 mb-4">
                      {[
                        "Copy of original sales receipt with purchase date",
                        "Product identification and quantity",
                        "Proof of turf production and installation date",
                        "Name of installation company",
                        "Batch and lot number",
                        "Product sample and infill material sample",
                        "Minimum of 3 clear photos showing the problem",
                      ].map((item) => (
                        <div
                          key={item}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          {item}
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      Turf World shall have 30 days to inspect and test the
                      material. Upon acceptance of a claim, Turf World reserves
                      the right to repair, provide replacement material, issue a
                      refund, or pay the equivalent cost of comparable
                      replacement material.
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Any controversy or claim shall be settled by binding
                      arbitration through JAMS, with arbitration taking place in
                      Ontario, California. California law applies regardless of
                      the place of purchase.
                    </p>
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
                      Warranty Questions?
                    </h2>
                    <p className="text-white/70 leading-relaxed mb-4">
                      Our team is here to help with any warranty-related
                      questions or to walk you through the claims process.
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

      {/* Landscape Care Guide */}
      <section className="py-12 md:py-16 border-t">
        <div className="container">
          <div className="px-4 sm:px-6">
            <div className="text-center mb-8">
              <span className="text-xs sm:text-sm font-semibold text-primary uppercase tracking-wider">
                Included Care Guide
              </span>
              <h2 className="mt-2">
                Maintain Your Warranty
              </h2>
              <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
                Proper care extends the life of your turf and keeps your
                warranty valid. Follow these guidelines for best results.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              {careSteps.map((step) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.title}
                    className="group relative overflow-hidden rounded-2xl bg-white border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 p-6"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-md shadow-primary/20">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                          {step.title}
                        </h3>
                      </div>
                      <ul className="space-y-2">
                        {step.points.map((point) => (
                          <li
                            key={point}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24 border-t">
        <div className="container text-center">
          <h2 className="max-w-3xl mx-auto">
            Protected by the Industry&apos;s Best Warranty
          </h2>
          <p className="mt-6 text-body-lg text-muted-foreground max-w-xl mx-auto">
            Shop with confidence knowing every Turf World product comes with
            16 years of coverage.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="btn-premium text-lg px-8 h-14"
              asChild
            >
              <Link href="/products">
                Shop Turf
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 h-14"
              asChild
            >
              <Link href="/samples">Get Free Samples</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
