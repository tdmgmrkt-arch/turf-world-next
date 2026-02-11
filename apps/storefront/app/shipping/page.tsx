import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Truck as LucideTruck,
  CheckCircle as LucideCheckCircle,
  MapPin as LucideMapPin,
  Clock as LucideClock,
  Phone as LucidePhone,
  ArrowRight as LucideArrowRight,
  Package as LucidePackage,
  DollarSign as LucideDollarSign,
  Calendar as LucideCalendar,
  AlertCircle as LucideAlertCircle,
} from "lucide-react";
import { Button as ShadcnButton } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";

// Cast to work around React 19 JSX type incompatibility
const Button = ShadcnButton as any;
const Truck = LucideTruck as any;
const CheckCircle = LucideCheckCircle as any;
const MapPin = LucideMapPin as any;
const Clock = LucideClock as any;
const Phone = LucidePhone as any;
const ArrowRight = LucideArrowRight as any;
const Package = LucidePackage as any;
const DollarSign = LucideDollarSign as any;
const Calendar = LucideCalendar as any;
const AlertCircle = LucideAlertCircle as any;

export const metadata: Metadata = {
  title: "Shipping Policy | Turf World",
  description:
    "Fast nationwide shipping on artificial grass and installation supplies. Learn about our shipping methods, delivery times, and freight options.",
  keywords: [
    "turf shipping",
    "artificial grass delivery",
    "nationwide shipping",
    "freight shipping",
    "turf delivery times",
  ],
};

const shippingMethods = [
  {
    name: "Standard Ground Shipping",
    time: "3-7 business days",
    description: "Available for most orders nationwide",
    icon: Package,
    color: "from-primary to-emerald-600",
  },
  {
    name: "Next-Day Shipping",
    time: "1 business day",
    description: "Southern California only (limited availability)",
    icon: Clock,
    color: "from-blue-500 to-blue-700",
  },
  {
    name: "LTL Freight",
    time: "5-10 business days",
    description: "Large orders requiring freight carrier",
    icon: Truck,
    color: "from-amber-500 to-orange-600",
  },
  {
    name: "Will Call / Pickup",
    time: "Same day",
    description: "Pickup at our Pomona, CA warehouse",
    icon: MapPin,
    color: "from-emerald-500 to-emerald-700",
  },
];

const processingNotes = [
  "Orders placed before 2 PM PST ship same business day (subject to stock availability)",
  "Orders placed after 2 PM PST ship next business day",
  "Weekend and holiday orders ship the next business day",
  "Custom orders may require additional processing time",
  "You'll receive tracking information via email once your order ships",
];

const shippingCosts = [
  {
    region: "Southern California",
    standardCost: "Calculated at checkout",
    nextDay: "Available (extra fee)",
    notes: "Most orders qualify for next-day delivery",
  },
  {
    region: "California (other regions)",
    standardCost: "Calculated at checkout",
    nextDay: "Not available",
    notes: "Standard ground shipping 3-5 business days",
  },
  {
    region: "Nationwide",
    standardCost: "Calculated at checkout",
    nextDay: "Not available",
    notes: "Standard ground shipping 5-7 business days",
  },
];

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/50 to-background">
      <Breadcrumb items={[{ label: "Shipping Policy" }]} />

      {/* Hero Section */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <Image
          src="/turf-hero.webp"
          alt="Shipping Policy"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-slate-900/70" />

        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 mb-6 shadow-lg shadow-primary/30">
              <Truck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Shipping Policy
            </h1>
            <p className="text-lg text-white/60 max-w-xl mx-auto">
              Fast, reliable nationwide shipping on all artificial grass and
              installation supplies. We ship across the USA.
            </p>
          </div>
        </div>
      </section>

      {/* Shipping Methods */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="px-4 sm:px-6">
            <div className="text-center mb-8">
              <span className="text-xs sm:text-sm font-semibold text-primary uppercase tracking-wider">
                Delivery Options
              </span>
              <h2 className="mt-2">Choose Your Shipping Method</h2>
              <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
                We offer multiple shipping options to meet your project timeline
                and budget.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              {shippingMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <div
                    key={method.name}
                    className="group relative overflow-hidden rounded-2xl bg-white border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 p-6"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative">
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className={`w-10 h-10 rounded-lg bg-gradient-to-br ${method.color} flex items-center justify-center shadow-md shadow-primary/20`}
                        >
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold group-hover:text-primary transition-colors">
                            {method.name}
                          </h3>
                          <p className="text-sm font-semibold text-primary">
                            {method.time}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {method.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Processing Times */}
            <div className="group relative overflow-hidden rounded-2xl bg-white border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative p-6 md:p-8">
                <div className="flex items-start gap-4 md:gap-6">
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
                        <Calendar className="w-6 h-6 md:w-7 md:h-7 text-white" />
                      </div>
                      <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                        01
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                      Order Processing & Fulfillment
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Most orders ship within 1-2 business days. Here&apos;s what
                      to expect:
                    </p>

                    <div className="space-y-2">
                      {processingNotes.map((note) => (
                        <div
                          key={note}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          {note}
                        </div>
                      ))}
                    </div>

                    <p className="mt-4 text-sm text-muted-foreground">
                      <strong>Note:</strong> Delivery times are estimates and not
                      guaranteed. Weather, carrier delays, and other factors beyond
                      our control may impact delivery schedules.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Costs */}
            <div className="group relative overflow-hidden rounded-2xl bg-white border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative p-6 md:p-8">
                <div className="flex items-start gap-4 md:gap-6">
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
                        <DollarSign className="w-6 h-6 md:w-7 md:h-7 text-white" />
                      </div>
                      <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                        02
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                      Shipping Costs
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Shipping costs are calculated at checkout based on order
                      weight, dimensions, and destination. Here&apos;s a general
                      breakdown:
                    </p>

                    {/* Shipping table */}
                    <div className="rounded-xl overflow-hidden border border-border/50 mb-4">
                      <div className="grid grid-cols-4 bg-slate-50 text-xs sm:text-sm font-semibold">
                        <div className="px-3 sm:px-4 py-3">Region</div>
                        <div className="px-3 sm:px-4 py-3">Standard</div>
                        <div className="px-3 sm:px-4 py-3">Next-Day</div>
                        <div className="px-3 sm:px-4 py-3 hidden sm:block">
                          Notes
                        </div>
                      </div>
                      {shippingCosts.map((row) => (
                        <div
                          key={row.region}
                          className="grid grid-cols-4 border-t border-border/50 text-xs sm:text-sm"
                        >
                          <div className="px-3 sm:px-4 py-3 font-medium">
                            {row.region}
                          </div>
                          <div className="px-3 sm:px-4 py-3 text-muted-foreground">
                            {row.standardCost}
                          </div>
                          <div className="px-3 sm:px-4 py-3">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                row.nextDay === "Available (extra fee)"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {row.nextDay}
                            </span>
                          </div>
                          <div className="px-3 sm:px-4 py-3 text-muted-foreground hidden sm:block">
                            {row.notes}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p>
                        <strong>Freight Orders:</strong> Large orders requiring
                        freight shipping will receive a custom shipping quote
                        before order confirmation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Freight Shipping */}
            <div className="group relative overflow-hidden rounded-2xl bg-white border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative p-6 md:p-8">
                <div className="flex items-start gap-4 md:gap-6">
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform duration-300">
                        <Truck className="w-6 h-6 md:w-7 md:h-7 text-white" />
                      </div>
                      <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                        03
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                      LTL Freight Shipping
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Large orders exceeding standard carrier weight limits
                      require Less-Than-Truckload (LTL) freight shipping. This
                      typically applies to:
                    </p>

                    <div className="space-y-2 mb-4">
                      {[
                        "Orders over 500 lbs total weight",
                        "Multiple rolls of turf (typically 3+ rolls)",
                        "Large-scale commercial projects",
                        "Bulk accessory orders",
                      ].map((item) => (
                        <div
                          key={item}
                          className="flex items-start gap-2 text-sm text-muted-foreground"
                        >
                          <CheckCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                          {item}
                        </div>
                      ))}
                    </div>

                    <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
                      <div className="flex gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div className="space-y-2 text-sm text-amber-900">
                          <p>
                            <strong>Important:</strong> Freight deliveries
                            require someone to be present to receive and sign for
                            the shipment. The carrier will contact you to schedule
                            delivery.
                          </p>
                          <p>
                            Curbside delivery is standard. Liftgate service and
                            inside delivery are available for an additional fee.
                            Contact us for pricing.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Will Call / Pickup */}
            <div className="group relative overflow-hidden rounded-2xl bg-white border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative p-6 md:p-8">
                <div className="flex items-start gap-4 md:gap-6">
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
                        <MapPin className="w-6 h-6 md:w-7 md:h-7 text-white" />
                      </div>
                      <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                        04
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                      Will Call / Local Pickup
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Save on shipping costs by picking up your order at our
                      Pomona, California warehouse. Here&apos;s how it works:
                    </p>

                    <div className="space-y-2 mb-4">
                      {[
                        "Select 'Will Call / Pickup' at checkout",
                        "You'll receive a confirmation email when your order is ready",
                        "Most orders ready same day (if placed before 2 PM)",
                        "Bring photo ID and order confirmation",
                        "Our team will help load your vehicle",
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

                    <div className="rounded-lg bg-slate-50 border border-border/50 p-4">
                      <p className="text-sm font-semibold mb-2">
                        Warehouse Location:
                      </p>
                      <p className="text-sm text-muted-foreground">
                        2370 S. Grove Ave
                        <br />
                        Ontario, CA 91761
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        <strong>Hours:</strong> Monday-Friday 8:00 AM - 4:00 PM,
                        Saturday 9:00 AM - 2:00 PM (Closed Sunday)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tracking */}
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
                      Order Tracking
                    </h2>
                    <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                      <p>
                        Once your order ships, you&apos;ll receive an email with
                        tracking information. You can track your shipment directly
                        through the carrier&apos;s website.
                      </p>
                      <p>
                        <strong>Carriers we use:</strong> UPS, FedEx, and various
                        regional LTL freight carriers depending on your location
                        and order size.
                      </p>
                      <p>
                        If you have questions about your shipment or need to make
                        delivery arrangements, contact us at (909) 491-2203.
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
                      Questions About Shipping?
                    </h2>
                    <p className="text-white/70 leading-relaxed mb-4">
                      Our team can help with shipping estimates, delivery
                      options, and tracking information.
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
          <h2 className="max-w-3xl mx-auto">Ready to Get Started?</h2>
          <p className="mt-6 text-body-lg text-muted-foreground max-w-xl mx-auto">
            Shop our full selection of professional-grade artificial grass and
            installation supplies.
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
              <Link href="/calculator">Project Calculator</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
