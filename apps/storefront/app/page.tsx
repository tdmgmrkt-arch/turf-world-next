"use client";

import NextLink from "next/link";
import NextImage from "next/image";
import {
  ArrowRight as LucideArrowRight,
  Calculator as LucideCalculator,
  Dog as LucideDog,
  Leaf as LucideLeaf,
  Trophy as LucideTrophy,
  Shield as LucideShield,
  Award as LucideAward,
  Truck as LucideTruck,
  Star as LucideStar,
  Play as LucidePlay,
  CheckCircle2 as LucideCheckCircle2,
  Sparkles as LucideSparkles,
  Gift as LucideGift,
} from "lucide-react";
import { Button as ShadcnButton } from "@/components/ui/button";

// Cast to work around React 19 JSX type incompatibility
const Link = NextLink as any;
const Image = NextImage as any;
const Button = ShadcnButton as any;
const ArrowRight = LucideArrowRight as any;
const Calculator = LucideCalculator as any;
const Dog = LucideDog as any;
const Leaf = LucideLeaf as any;
const Trophy = LucideTrophy as any;
const Shield = LucideShield as any;
const Award = LucideAward as any;
const Truck = LucideTruck as any;
const Star = LucideStar as any;
const Play = LucidePlay as any;
const CheckCircle2 = LucideCheckCircle2 as any;
const Sparkles = LucideSparkles as any;
const Gift = LucideGift as any;

const categories = [
  {
    title: "Pet Turf",
    description: "Engineered for pets. High-drainage, antimicrobial, built to last.",
    icon: Dog,
    href: "/products?use=pet",
    image: "/pets.card.webp",
    gradient: "from-amber-500/20 to-orange-500/20",
    iconBg: "bg-amber-500",
    imagePosition: "center 5%",
  },
  {
    title: "Landscape",
    description: "Lush, realistic lawns that stay green 365 days a year.",
    icon: Leaf,
    href: "/products?use=landscape",
    image: "/landscape.card.webp",
    gradient: "from-emerald-500/20 to-green-500/20",
    iconBg: "bg-emerald-500",
    imagePosition: "center",
  },
  {
    title: "Putting Greens",
    description: "Tournament-quality nylon. Perfect roll, every time.",
    icon: Trophy,
    href: "/products?use=putting",
    image: "/golf.card.webp",
    gradient: "from-blue-500/20 to-cyan-500/20",
    iconBg: "bg-blue-500",
  },
  {
    title: "Installation Supplies",
    description: "Everything you need for a professional turf installation.",
    icon: Shield,
    href: "/supplies",
    image: "/supplies.card.webp",
    gradient: "from-purple-500/20 to-indigo-500/20",
    iconBg: "bg-purple-500",
    imagePosition: "center",
  },
];

const stats = [
  { value: "50K+", label: "Happy Customers" },
  { value: "16yr", label: "Warranty" },
  { value: "4.9", label: "Star Rating", icon: Star },
  { value: "Nationwide", label: "Shipping" },
];

const features = [
  {
    icon: Shield,
    title: "PFAS-Free Promise",
    description: "No forever chemicals. Safe for your family, pets, and the environment.",
  },
  {
    icon: Award,
    title: "Class-A Fire Rated",
    description: "Meets the highest safety standards. California wildfire compliant.",
  },
  {
    icon: Truck,
    title: "Free Nationwide Shipping",
    description: "Direct to your door. No hidden fees, no surprises.",
  },
  {
    icon: Sparkles,
    title: "Premium C8 Yarn",
    description: "We use C8-grade polypropylene — the highest tier of turf fiber for superior softness, UV resistance, and long-lasting color.",
  },
  {
    icon: Calculator,
    title: "Instant Project Pricing",
    description: "Know exactly what you need before you buy. No guesswork.",
  },
];

const testimonials = [
  {
    name: "Sarah M.",
    location: "Phoenix, AZ",
    image: "/images/testimonial-1.jpg",
    rating: 5,
    text: "Finally, a turf company that doesn't make you call for pricing. Ordered Friday, installed Sunday. My dog loves it.",
  },
  {
    name: "Mike T.",
    location: "San Diego, CA",
    image: "/images/testimonial-2.jpg",
    rating: 5,
    text: "The calculator told me exactly what I needed. No more, no less. Saved me hundreds compared to the local shop.",
  },
  {
    name: "Jennifer L.",
    location: "Las Vegas, NV",
    image: "/images/testimonial-3.jpg",
    rating: 5,
    text: "Got the water rebate AND a beautiful lawn. Should have done this years ago. The quality is incredible.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Mobile Floating Samples CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-gradient-to-t from-slate-900 via-slate-900 to-slate-900/95 backdrop-blur-sm border-t border-white/10 p-4 shadow-2xl">
        <Link href="/samples" className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Gift className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">Get Free Samples</p>
              <p className="text-white/50 text-xs">See & feel before you buy</p>
            </div>
          </div>
          <Button variant="premium" size="default" className="h-11 px-5">
            Order Free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="flex flex-col pb-24 lg:pb-0">
      {/* Hero Section - Full Width Background */}
      <section className="relative min-h-[60vh] sm:min-h-[65vh] lg:min-h-[70vh] flex items-center overflow-hidden">
        {/* Full-width Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/hero1.webp"
            alt="Beautiful artificial turf installation"
            fill
            className="object-cover"
            priority
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
        </div>

        <div className="container relative z-10 py-12 sm:py-16 lg:py-20">
          <div className="max-w-3xl">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Trusted by 50,000+ homeowners</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white tracking-tight">
              Professional Turf.{" "}
              <span className="text-[#34CE95]">
                Direct Pricing.
              </span>
            </h1>

            <p className="mt-4 sm:mt-5 text-base sm:text-lg lg:text-xl text-white/80 max-w-xl">
              Skip the middleman markup. Get the same premium artificial grass
              professionals use, delivered to your door with transparent pricing
              and a 16-year warranty.
            </p>

            {/* CTA Buttons */}
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3">
              <Button size="lg" variant="premium" className="text-base sm:text-lg px-6 sm:px-8 h-12 sm:h-14" asChild>
                <Link href="/products">
                  Shop All Turf
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" className="text-base sm:text-lg px-6 sm:px-8 h-12 sm:h-14 bg-white/10 border-2 border-white/30 text-white hover:bg-white/20 rounded-xl backdrop-blur-sm" asChild>
                <Link href="/calculator">
                  <Calculator className="mr-2 h-5 w-5" />
                  Calculate Your Project
                </Link>
              </Button>
            </div>

            {/* Stats Row */}
            <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-white/20">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-1">
                      <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                        {stat.value}
                      </span>
                      {stat.icon && <stat.icon className="w-5 h-5 text-amber-400 fill-amber-400" />}
                    </div>
                    <span className="text-sm text-white/60">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Shop by Use - Premium Cards */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-background to-muted/30">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-caption uppercase tracking-widest text-primary font-semibold">
              Collections
            </span>
            <h2 className="mt-4">Find Your Perfect Turf</h2>
            <p className="mt-4 text-body-lg text-muted-foreground">
              Engineered for specific needs. Every blade designed with purpose.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Link key={category.title} href={category.href} className="group">
                <div className="relative h-[350px] rounded-3xl overflow-hidden card-hover">
                  {/* Category Image */}
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  {/* Content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <div className={`w-12 h-12 rounded-xl ${category.iconBg} flex items-center justify-center mb-3 shadow-lg`}>
                      <category.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{category.title}</h3>
                    <p className="mt-1.5 text-sm text-white/80 line-clamp-2">{category.description}</p>
                    <div className="mt-3 flex items-center text-white text-sm font-medium">
                      <span>Explore</span>
                      <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-2" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Calculator CTA - Premium Design */}
      <section className="py-16 sm:py-20 lg:py-24 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-primary" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-emerald-800" />
        <div className="absolute inset-0 bg-hero-pattern opacity-10" />

        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/10 rounded-full blur-3xl" />

        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="text-white">
              <span className="text-caption uppercase tracking-widest text-white/60 font-semibold">
                Project Calculator
              </span>
              <h2 className="mt-4 text-white">
                Know Exactly What You Need
              </h2>
              <p className="mt-6 text-xl text-white/80 leading-relaxed">
                Our smart calculator does the math for you. Enter your dimensions
                and get an instant breakdown of rolls, seam tape, infill, and
                total cost. No surprises at checkout.
              </p>

              <ul className="mt-8 space-y-4">
                {[
                  "Instant material calculations",
                  "Accurate waste estimates",
                  "Complete accessory list",
                  "Real-time pricing"
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-white/90">
                    <CheckCircle2 className="w-5 h-5 text-gold-400 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <Button
                size="lg"
                variant="secondary"
                className="mt-10 text-lg px-8 h-14 bg-white text-primary hover:bg-white/90"
                asChild
              >
                <Link href="/calculator">
                  Try the Calculator
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            {/* Calculator Preview - Matches actual tool styling */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/10">
                {/* Dark Header */}
                <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-lg">
                      <Calculator className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-white">Project Calculator</p>
                      <p className="text-xs text-white/60">20ft × 30ft = 600 sq ft</p>
                    </div>
                  </div>
                </div>

                {/* Materials List - Dark Card Style */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-5">
                  {/* Decorative elements */}
                  <div className="absolute top-20 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

                  <div className="relative space-y-2">
                    {/* Material Rows */}
                    <div className="flex items-center gap-2 rounded-lg p-2 bg-gradient-to-r from-primary/20 to-emerald-500/20 border border-primary/30">
                      <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                        <Leaf className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">Turf World 88</p>
                        <p className="text-[10px] text-white/50">2 cuts from 1 roll (600 sq ft)</p>
                      </div>
                      <p className="font-bold text-white text-sm">$1,074</p>
                    </div>

                    <div className="flex items-center gap-2 rounded-lg p-2 bg-white/5 border border-white/10">
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-white/60 text-xs">✂️</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white/80 truncate">Seam Tape</p>
                        <p className="text-[10px] text-white/50">30 linear ft for 1 seam</p>
                      </div>
                      <p className="font-bold text-white/80 text-sm">$15</p>
                    </div>

                    <div className="flex items-center gap-2 rounded-lg p-2 bg-white/5 border border-white/10">
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-white/60 text-xs">📦</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white/80 truncate">ZeoFill Infill</p>
                        <p className="text-[10px] text-white/50">12 bags (600 lbs)</p>
                      </div>
                      <p className="font-bold text-white/80 text-sm">$479</p>
                    </div>

                    {/* Total */}
                    <div className="border-t border-white/10 pt-3 mt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-white/80 font-medium text-sm">Estimated Total</span>
                        <span className="text-2xl font-bold text-white">$1,568</span>
                      </div>
                      <p className="mt-1 text-[10px] text-white/40">
                        Excludes shipping & tax
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-3 right-0 sm:-right-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                Save 30% vs retail
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-caption uppercase tracking-widest text-primary font-semibold">
              Why Turf World
            </span>
            <h2 className="mt-4">Built Different</h2>
            <p className="mt-4 text-body-lg text-muted-foreground">
              We obsess over quality so you don&apos;t have to worry.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group p-8 rounded-3xl bg-card border border-border hover:border-primary/50 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <feature.icon className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="mt-3 text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 sm:py-20 lg:py-24 bg-muted/30">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-caption uppercase tracking-widest text-primary font-semibold">
              Testimonials
            </span>
            <h2 className="mt-4">Loved by Homeowners</h2>
            <p className="mt-4 text-body-lg text-muted-foreground">
              Join thousands who&apos;ve transformed their outdoor spaces.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="p-8 rounded-3xl bg-card border border-border card-hover"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-gold-500 fill-gold-500" />
                  ))}
                </div>

                <p className="text-lg leading-relaxed">&ldquo;{testimonial.text}&rdquo;</p>

                <div className="mt-8 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-semibold text-primary">
                      {testimonial.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Free Samples CTA */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container">
          <div className="relative rounded-3xl overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src="/hero2.webp"
                alt="Beautiful turf installation"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
            </div>

            <div className="relative p-12 lg:p-20">
              <div className="max-w-2xl">
                <span className="text-caption uppercase tracking-widest text-primary font-semibold">
                  Try Before You Buy
                </span>
                <h2 className="mt-4 text-white">See It. Feel It. Love It.</h2>
                <p className="mt-6 text-body-lg text-white/80">
                  Order up to 3 free samples and experience the quality firsthand.
                  Feel the texture, see the color in your light, and make the
                  right choice for your space.
                </p>
                <Button size="lg" className="mt-8 btn-premium text-lg px-8 h-14" asChild>
                  <Link href="/samples">
                    Order Free Samples
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-20 lg:py-24 border-t">
        <div className="container text-center">
          <h2 className="max-w-3xl mx-auto">
            Ready to Transform Your Outdoor Space?
          </h2>
          <p className="mt-6 text-body-lg text-muted-foreground max-w-xl mx-auto">
            Join 50,000+ homeowners who chose Turf World for quality,
            transparency, and unbeatable value.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="btn-premium text-lg px-8 h-14" asChild>
              <Link href="/products">
                Start Shopping
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 h-14" asChild>
              <Link href="/locations">
                Find Your Location
              </Link>
            </Button>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}
