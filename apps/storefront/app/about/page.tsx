import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Award,
  Shield,
  Leaf,
  Truck,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export const metadata: Metadata = {
  title: "About Us | Turf World",
  description:
    "At Turf World, we're dedicated to providing the highest quality artificial turf products at wholesale prices. Learn about our mission and values.",
  keywords: [
    "about turf world",
    "artificial turf company",
    "wholesale turf",
    "premium artificial grass",
  ],
};

const values = [
  {
    icon: Award,
    title: "Uncompromising Quality",
    description:
      "Every product in our catalog meets rigorous quality standards. We use only C8 commercial-grade yarn and UV-stabilized materials for lasting performance.",
  },
  {
    icon: Shield,
    title: "Industry-Leading Warranties",
    description:
      "We stand behind our products with warranties up to 16 years. Your investment is protected with comprehensive coverage against defects and UV degradation.",
  },
  {
    icon: Leaf,
    title: "Eco-Friendly Solutions",
    description:
      "Our turf products are 100% lead-free and help conserve water. Choose sustainable landscaping without sacrificing beauty or durability.",
  },
  {
    icon: Truck,
    title: "Nationwide Shipping",
    description:
      "We offer free freight shipping on all orders across the United States. Large orders ship via liftgate delivery right to your location.",
  },
];

const benefits = [
  "Wholesale pricing on all products",
  "Expert guidance on product selection",
  "Free samples before you buy",
  "Fast processing and shipping",
  "Dedicated customer support",
  "Flexible roll sizes cut to your length",
];

const stats = [
  { value: "27+", label: "Premium Products" },
  { value: "16", label: "Year Warranty" },
  { value: "100%", label: "Lead-Free" },
  { value: "FREE", label: "Nationwide Shipping" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Breadcrumb items={[{ label: "About Us" }]} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 sm:py-16 md:py-24">
        <Image
          src="/hero1.webp"
          alt="Turf World premium artificial turf"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-slate-900/70" />

        <div className="container px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-xs sm:text-sm text-white/80 mb-4 sm:mb-6">
              <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#34CE95]" />
              <span>Our Mission</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
              Transforming Outdoor Spaces with{" "}
              <span className="text-[#34CE95]">Premium Turf</span>
            </h1>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              At Turf World, we&apos;re dedicated to providing the highest quality
              artificial turf products at wholesale prices, making premium turf
              accessible to everyone.
            </p>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-6 sm:mt-8">
              <div className="flex items-center gap-2 text-white/60">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                </div>
                <span className="text-xs sm:text-sm">Fast Shipping</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                </div>
                <span className="text-xs sm:text-sm">16-Year Warranty</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 sm:py-16 md:py-24 lg:py-28 bg-white">
        <div className="container px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#34CE95] uppercase tracking-wider mb-3 sm:mb-4">
              Our Values
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              What Sets Us Apart
            </h2>
          </div>

          <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div
                key={value.title}
                className="p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl md:rounded-3xl bg-muted/30 border border-border/50 hover:shadow-lg hover:border-[#34CE95]/30 transition-all duration-300"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#34CE95] to-emerald-600 flex items-center justify-center text-white shadow-lg mb-3 sm:mb-4 md:mb-6">
                  <value.icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3">{value.title}</h3>
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-12 sm:py-16 md:py-24 lg:py-28 bg-muted/30">
        <div className="container px-4 sm:px-6">
          <div className="grid gap-8 sm:gap-10 lg:gap-12 lg:grid-cols-2 items-center">
            <div>
              <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#34CE95] uppercase tracking-wider mb-3 sm:mb-4">
                Why Choose Us
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4 sm:mb-6">
                Your Success is Our Priority
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6 sm:mb-8">
                Whether you&apos;re a contractor working on a large commercial
                project or a homeowner looking to transform your backyard, we
                provide the same level of dedication and service to every
                customer.
              </p>
              <ul className="space-y-3 sm:space-y-4">
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex items-center gap-2 sm:gap-3">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#34CE95]/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[#34CE95]" />
                    </div>
                    <span className="text-sm sm:text-base text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl md:rounded-3xl bg-white border border-border/50 shadow-sm text-center"
                >
                  <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#34CE95] mb-1 sm:mb-2">
                    {stat.value}
                  </p>
                  <p className="text-xs sm:text-sm md:text-base text-muted-foreground font-medium">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24 border-t">
        <div className="container text-center">
          <h2 className="max-w-3xl mx-auto">
            Ready to Get Started?
          </h2>
          <p className="mt-6 text-body-lg text-muted-foreground max-w-xl mx-auto">
            Browse our selection of premium artificial turf or request free
            samples to see the quality for yourself.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="btn-premium text-lg px-8 h-14" asChild>
              <Link href="/products">
                Shop All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 h-14" asChild>
              <Link href="/samples">Request Free Samples</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
