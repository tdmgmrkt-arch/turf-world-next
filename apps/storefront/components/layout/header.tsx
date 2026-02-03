"use client";

import NextLink from "next/link";
import NextImage from "next/image";
import { Button as ShadcnButton } from "@/components/ui/button";
import { useCartStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import {
  ShoppingCart as LucideShoppingCart,
  Menu as LucideMenu,
  X as LucideX,
  Phone as LucidePhone,
  Calculator as LucideCalculator,
  Sparkles as LucideSparkles,
  Truck as LucideTruck,
  Shield as LucideShield,
  Clock as LucideClock,
  Package as LucidePackage,
  Star as LucideStar,
  Heart as LucideHeart,
} from "lucide-react";

// Cast Lucide icons to work around React 19 JSX type incompatibility
const ShoppingCart = LucideShoppingCart as any;
const Menu = LucideMenu as any;
const X = LucideX as any;
const Phone = LucidePhone as any;
const Calculator = LucideCalculator as any;
const Sparkles = LucideSparkles as any;
const Truck = LucideTruck as any;
const Shield = LucideShield as any;
const Clock = LucideClock as any;
const Package = LucidePackage as any;
const Star = LucideStar as any;
const Heart = LucideHeart as any;

// Cast to work around React 19 JSX type incompatibility
const Link = NextLink as any;
const Image = NextImage as any;
const Button = ShadcnButton as any;

const turfCategories = [
  {
    title: "Residential Turf",
    href: "/products?use=landscape",
    description: "Lawns, yards & landscaping",
    image: "/residential.avif",
    priceFrom: "$1.30",
  },
  {
    title: "Pet & Dog Turf",
    href: "/products?use=pet",
    description: "Antimicrobial/high-drainage",
    image: "/pets.avif",
    priceFrom: "$1.85",
  },
  {
    title: "Putting Greens",
    href: "/products?use=putting",
    description: "Pro-grade performance",
    image: "/golf.avif",
    priceFrom: "$3.75",
  },
  {
    title: "Commercial Turf",
    href: "/products?use=commercial",
    description: "Heavy-duty & safe",
    image: "/commercial.avif",
    priceFrom: "$1.65",
  },
];

const supplyCategories = [
  {
    title: "Infill",
    href: "/supplies#infill",
    description: "Weight, support & odor control",
    image: "/products/infill.webp",
  },
  {
    title: "Seaming",
    href: "/supplies#seaming",
    description: "Join turf pieces seamlessly",
    image: "/products/seamtape.webp",
  },
  {
    title: "Installation",
    href: "/supplies#installation",
    description: "Nails, weed barrier & more",
    image: "/products/weedbarrier.webp",
  },
  {
    title: "Tools",
    href: "/supplies#tools",
    description: "Finishing touches",
    image: "/products/nails.webp",
  },
];

const aboutCategories = [
  {
    title: "About Us",
    href: "/about",
    description: "Our story & mission",
    image: "/aboutus.card.webp",
  },
  {
    title: "Turf Talk",
    href: "/blog",
    description: "Tips, guides & news",
    image: "/installation.guide.card.webp",
  },
  {
    title: "Project Gallery",
    href: "/gallery",
    description: "See our installations",
    image: "/project.gallery.card.webp",
  },
  {
    title: "Reviews",
    href: "/reviews",
    description: "Customer testimonials",
    image: "/reviews.card.webp",
  },
];

const navLinks = [
  { name: "Calculator", href: "/calculator" },
  { name: "Locations", href: "/locations" },
  { name: "Wholesale", href: "/broker" },
];

export function Header() {
  const { openCart, getItemCount } = useCartStore();
  const itemCount = getItemCount();
  const [turfMenuOpen, setTurfMenuOpen] = useState(false);
  const [suppliesMenuOpen, setSuppliesMenuOpen] = useState(false);
  const [aboutMenuOpen, setAboutMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const turfTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const suppliesTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const aboutTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTurfEnter = () => {
    if (turfTimeoutRef.current) clearTimeout(turfTimeoutRef.current);
    setSuppliesMenuOpen(false);
    setAboutMenuOpen(false);
    setTurfMenuOpen(true);
  };

  const handleTurfLeave = () => {
    turfTimeoutRef.current = setTimeout(() => setTurfMenuOpen(false), 100);
  };

  const handleSuppliesEnter = () => {
    if (suppliesTimeoutRef.current) clearTimeout(suppliesTimeoutRef.current);
    setTurfMenuOpen(false);
    setAboutMenuOpen(false);
    setSuppliesMenuOpen(true);
  };

  const handleSuppliesLeave = () => {
    suppliesTimeoutRef.current = setTimeout(() => setSuppliesMenuOpen(false), 100);
  };

  const handleAboutEnter = () => {
    if (aboutTimeoutRef.current) clearTimeout(aboutTimeoutRef.current);
    setTurfMenuOpen(false);
    setSuppliesMenuOpen(false);
    setAboutMenuOpen(true);
  };

  const handleAboutLeave = () => {
    aboutTimeoutRef.current = setTimeout(() => setAboutMenuOpen(false), 100);
  };

  useEffect(() => {
    return () => {
      if (turfTimeoutRef.current) clearTimeout(turfTimeoutRef.current);
      if (suppliesTimeoutRef.current) clearTimeout(suppliesTimeoutRef.current);
      if (aboutTimeoutRef.current) clearTimeout(aboutTimeoutRef.current);
    };
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white border-b">
        <div className="container">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <div className="relative h-10 w-[180px]">
                <Image
                  src="/turf.world.alternate.header.logo.png"
                  alt="Turf World"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {/* Shop Turf - Mega Menu Trigger */}
              <div
                onMouseEnter={handleTurfEnter}
                onMouseLeave={handleTurfLeave}
              >
                <button
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors rounded-md",
                    turfMenuOpen ? "text-primary bg-primary/5" : "hover:text-primary"
                  )}
                >
                  Shop Turf
                  <span className={cn("text-xs transition-transform", turfMenuOpen && "rotate-180")}>▼</span>
                </button>
              </div>

              {/* Shop Supplies - Mega Menu Trigger */}
              <div
                onMouseEnter={handleSuppliesEnter}
                onMouseLeave={handleSuppliesLeave}
              >
                <button
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors rounded-md",
                    suppliesMenuOpen ? "text-primary bg-primary/5" : "hover:text-primary"
                  )}
                >
                  Shop Supplies
                  <span className={cn("text-xs transition-transform", suppliesMenuOpen && "rotate-180")}>▼</span>
                </button>
              </div>

              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              ))}

              {/* About - Mega Menu Trigger */}
              <div
                onMouseEnter={handleAboutEnter}
                onMouseLeave={handleAboutLeave}
              >
                <button
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-colors rounded-md",
                    aboutMenuOpen ? "text-primary bg-primary/5" : "hover:text-primary"
                  )}
                >
                  About
                  <span className={cn("text-xs transition-transform", aboutMenuOpen && "rotate-180")}>▼</span>
                </button>
              </div>

              <Link
                href="/contact"
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium hover:text-primary transition-colors"
              >
                Contact
              </Link>

              <Link href="/samples">
                <Button size="sm" className="ml-3 bg-primary hover:bg-primary/90">
                  Free Samples
                </Button>
              </Link>
            </nav>

            {/* Right Side */}
            <div className="flex items-center gap-3">
              <a href="tel:(909) 491-2203" className="hidden xl:flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors">
                <Phone className="h-4 w-4" /> (909) 491-2203
              </a>

              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={openCart}
              >
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                    {itemCount}
                  </span>
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Turf Mega Menu */}
        <div
          className={cn(
            "absolute left-0 right-0 top-full bg-white border-t shadow-2xl transition-all duration-200",
            turfMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
          )}
          onMouseEnter={handleTurfEnter}
          onMouseLeave={handleTurfLeave}
        >
          {/* Promo Banner */}
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
            <div className="container py-2.5 flex items-center justify-between text-sm">
              <div className="flex items-center gap-6">
                <span className="flex items-center gap-1.5 font-medium">
                  <Truck className="h-4 w-4" /> Free Shipping on Orders $1,500+
                </span>
                <span className="flex items-center gap-1.5">
                  <Shield className="h-4 w-4" /> 15-Year Warranty
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" /> Ships in 2-3 Days
                </span>
              </div>
              <Link href="/samples" onClick={() => setTurfMenuOpen(false)} className="flex items-center gap-1.5 font-semibold hover:underline underline-offset-2">
                Get Free Samples →
              </Link>
            </div>
          </div>

          <div className="container py-8">
            <div className="grid grid-cols-12 gap-10">
              {/* Category Cards */}
              <div className="col-span-8">
                <div className="grid grid-cols-4 gap-4">
                  {turfCategories.map((cat) => (
                    <Link
                      key={cat.title}
                      href={cat.href}
                      onClick={() => setTurfMenuOpen(false)}
                      className="group relative rounded-xl overflow-hidden bg-slate-100 aspect-[3/4]"
                    >
                      <Image
                        src={cat.image}
                        alt={cat.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h3 className="font-bold text-lg leading-tight">{cat.title}</h3>
                        <p className="text-white/80 text-sm mt-0.5">{cat.description}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-sm">
                            From <span className="font-bold text-emerald-400">{cat.priceFrom}</span>/sf
                          </span>
                          <span className="flex items-center gap-1 text-xs font-medium text-white/90 group-hover:text-emerald-400 transition-colors">
                            Shop Now →
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* View All Link */}
                <div className="mt-6 flex items-center justify-between">
                  <Link
                    href="/products"
                    onClick={() => setTurfMenuOpen(false)}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline underline-offset-2"
                  >
                    View All Turf Options →
                  </Link>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      ✓ PFAS-Free
                    </span>
                    <span className="flex items-center gap-1.5">
                      ✓ Lead-Free
                    </span>
                    <span className="flex items-center gap-1.5">
                      ✓ Made in USA
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="col-span-4 border-l pl-10">
                {/* Quick Actions */}
                <div className="space-y-3">
                  <Link
                    href="/calculator"
                    onClick={() => setTurfMenuOpen(false)}
                    className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-primary">
                      <Calculator className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <span className="font-semibold block group-hover:text-primary transition-colors">Project Calculator</span>
                      <span className="text-sm text-muted-foreground">Get exact sq ft & pricing</span>
                    </div>
                    <span className="text-muted-foreground group-hover:text-primary transition-colors">→</span>
                  </Link>

                  <Link
                    href="/samples"
                    onClick={() => setTurfMenuOpen(false)}
                    className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 transition-colors group border border-emerald-100"
                  >
                    <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-emerald-600">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <span className="font-semibold block text-emerald-900">Free Sample Kit</span>
                      <span className="text-sm text-emerald-700">See & feel before you buy</span>
                    </div>
                    <span className="text-emerald-600">→</span>
                  </Link>
                </div>

                {/* Contact */}
                <div className="mt-6 pt-6 border-t">
                  <p className="text-sm text-muted-foreground mb-2">Questions? We&apos;re here to help.</p>
                  <a
                    href="tel:(909) 491-2203"
                    className="flex items-center gap-2 text-lg font-bold text-primary hover:underline"
                  >
                    <Phone className="h-5 w-5" /> (909) 491-2203
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Supplies Mega Menu */}
        <div
          className={cn(
            "absolute left-0 right-0 top-full bg-white border-t shadow-2xl transition-all duration-200",
            suppliesMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
          )}
          onMouseEnter={handleSuppliesEnter}
          onMouseLeave={handleSuppliesLeave}
        >
          {/* Promo Banner */}
          <div className="bg-gradient-to-r from-slate-700 to-slate-800 text-white">
            <div className="container py-2.5 flex items-center justify-between text-sm">
              <div className="flex items-center gap-6">
                <span className="flex items-center gap-1.5 font-medium">
                  <Package className="h-4 w-4" /> Ships With Your Turf Order
                </span>
                <span className="flex items-center gap-1.5">
                  <Shield className="h-4 w-4" /> Quality Guaranteed
                </span>
                <span className="flex items-center gap-1.5">
                  <Truck className="h-4 w-4" /> Fast Shipping
                </span>
              </div>
              <Link href="/calculator" onClick={() => setSuppliesMenuOpen(false)} className="flex items-center gap-1.5 font-semibold hover:underline underline-offset-2">
                Calculate What You Need →
              </Link>
            </div>
          </div>

          <div className="container py-8">
            <div className="grid grid-cols-12 gap-10">
              {/* Category Cards */}
              <div className="col-span-8">
                <div className="grid grid-cols-4 gap-4">
                  {supplyCategories.map((cat) => (
                    <Link
                      key={cat.title}
                      href={cat.href}
                      onClick={() => setSuppliesMenuOpen(false)}
                      className="group relative rounded-xl overflow-hidden border border-slate-200 aspect-[3/4] hover:border-primary/40 hover:shadow-xl transition-all duration-300"
                    >
                      {/* Background Image */}
                      <Image
                        src={cat.image}
                        alt={cat.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                      {/* Content */}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <h3 className="font-bold text-base text-white">{cat.title}</h3>
                        <p className="text-white/70 text-sm mt-0.5">{cat.description}</p>
                        <div className="mt-2 flex items-center text-xs font-semibold text-emerald-400 group-hover:underline">
                          Shop Now →
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* View All Link */}
                <div className="mt-6 flex items-center justify-between">
                  <Link
                    href="/supplies"
                    onClick={() => setSuppliesMenuOpen(false)}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline underline-offset-2"
                  >
                    View All Supplies →
                  </Link>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      ✓ Pro-Grade Quality
                    </span>
                    <span className="flex items-center gap-1.5">
                      ✓ Competitive Pricing
                    </span>
                    <span className="flex items-center gap-1.5">
                      ✓ Bundle & Save
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="col-span-4 border-l pl-10">
                {/* Quick Actions */}
                <div className="space-y-3">
                  <Link
                    href="/calculator"
                    onClick={() => setSuppliesMenuOpen(false)}
                    className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-primary">
                      <Calculator className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <span className="font-semibold block group-hover:text-primary transition-colors">Project Calculator</span>
                      <span className="text-sm text-muted-foreground">Know exactly what you need</span>
                    </div>
                    <span className="text-muted-foreground group-hover:text-primary transition-colors">→</span>
                  </Link>

                  <Link
                    href="/products"
                    onClick={() => setSuppliesMenuOpen(false)}
                    className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 transition-colors group border border-emerald-100"
                  >
                    <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-emerald-600">
                      <Package className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <span className="font-semibold block text-emerald-900">Shop Turf First</span>
                      <span className="text-sm text-emerald-700">Bundle turf + supplies</span>
                    </div>
                    <span className="text-emerald-600">→</span>
                  </Link>
                </div>

                {/* Contact */}
                <div className="mt-6 pt-6 border-t">
                  <p className="text-sm text-muted-foreground mb-2">Need help choosing supplies?</p>
                  <a
                    href="tel:(909) 491-2203"
                    className="flex items-center gap-2 text-lg font-bold text-primary hover:underline"
                  >
                    <Phone className="h-5 w-5" /> (909) 491-2203
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* About Mega Menu */}
        <div
          className={cn(
            "absolute left-0 right-0 top-full bg-white border-t shadow-2xl transition-all duration-200",
            aboutMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
          )}
          onMouseEnter={handleAboutEnter}
          onMouseLeave={handleAboutLeave}
        >
          <div className="container py-8">
            <div className="grid grid-cols-12 gap-10">
              {/* About Cards */}
              <div className="col-span-8">
                <div className="grid grid-cols-4 gap-4">
                  {aboutCategories.map((cat) => (
                    <Link
                      key={cat.title}
                      href={cat.href}
                      onClick={() => setAboutMenuOpen(false)}
                      className="group relative rounded-xl overflow-hidden bg-slate-100 aspect-[3/4]"
                    >
                      <Image
                        src={cat.image}
                        alt={cat.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h3 className="font-bold text-lg leading-tight">{cat.title}</h3>
                        <p className="text-white/80 text-sm mt-0.5">{cat.description}</p>
                        <span className="inline-flex items-center text-xs font-semibold text-emerald-400 mt-2 group-hover:underline">
                          Learn More →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Why Turf World row */}
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-sm font-semibold text-muted-foreground">Why Turf World?     →</span>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Heart className="h-4 w-4 text-primary" /> Family-owned since 2015
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Shield className="h-4 w-4 text-primary" /> 15-Year Warranty
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Star className="h-4 w-4 text-amber-500" /> 4.9/5 Customer Rating
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="col-span-4 border-l pl-10">
                {/* Quick Actions */}
                <div className="space-y-3">
                  <Link
                    href="/samples"
                    onClick={() => setAboutMenuOpen(false)}
                    className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 transition-colors group border border-emerald-100"
                  >
                    <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-emerald-600">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <span className="font-semibold block text-emerald-900">Free Sample Kit</span>
                      <span className="text-sm text-emerald-700">See & feel before you buy</span>
                    </div>
                    <span className="text-emerald-600">→</span>
                  </Link>

                  <Link
                    href="/calculator"
                    onClick={() => setAboutMenuOpen(false)}
                    className="flex items-center gap-3 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-primary">
                      <Calculator className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <span className="font-semibold block group-hover:text-primary transition-colors">Project Calculator</span>
                      <span className="text-sm text-muted-foreground">Get exact sq ft & pricing</span>
                    </div>
                    <span className="text-muted-foreground group-hover:text-primary transition-colors">→</span>
                  </Link>
                </div>

                {/* Contact */}
                <div className="mt-6 pt-6 border-t">
                  <p className="text-sm text-muted-foreground mb-2">Questions? We&apos;re here to help.</p>
                  <a
                    href="tel:(909) 491-2203"
                    className="flex items-center gap-2 text-lg font-bold text-primary hover:underline"
                  >
                    <Phone className="h-5 w-5" /> (909) 491-2203
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden transition-all duration-300",
          mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        )}
      >
        <div className="absolute inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />

        <div className={cn(
          "absolute top-0 right-0 h-full w-full max-w-sm bg-white shadow-xl transition-transform duration-300",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-semibold">Menu</span>
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {/* Turf Categories */}
              <div className="p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Shop Turf</p>
                <div className="grid grid-cols-2 gap-2">
                  {turfCategories.map((cat) => (
                    <Link
                      key={cat.title}
                      href={cat.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="relative rounded-lg overflow-hidden aspect-square"
                    >
                      <Image src={cat.image} alt={cat.title} fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2 text-white">
                        <span className="font-semibold text-sm block">{cat.title}</span>
                        <span className="text-xs text-white/80">From {cat.priceFrom}/sf</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Supplies Categories */}
              <div className="p-4 border-t">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Shop Supplies</p>
                <div className="grid grid-cols-2 gap-2">
                  {supplyCategories.map((cat) => (
                    <Link
                      key={cat.title}
                      href={cat.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="relative rounded-lg overflow-hidden aspect-square border border-slate-200"
                    >
                      <Image
                        src={cat.image}
                        alt={cat.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-2">
                        <span className="font-semibold text-sm block text-white">{cat.title}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* About */}
              <div className="p-4 border-t">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">About</p>
                <div className="grid grid-cols-2 gap-2">
                  {aboutCategories.map((cat) => (
                    <Link
                      key={cat.title}
                      href={cat.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="relative rounded-lg overflow-hidden aspect-square"
                    >
                      <Image src={cat.image} alt={cat.title} fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-2 left-2 right-2 text-white">
                        <span className="font-semibold text-sm block">{cat.title}</span>
                        <span className="text-xs text-white/80">{cat.description}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="p-4 border-t">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Resources</p>
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 py-3 font-medium hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 py-3 font-medium hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-slate-50">
              <a href="tel:(909) 491-2203" className="flex items-center justify-center gap-2 mb-3 text-sm font-medium">
                <Phone className="h-4 w-4" /> (909) 491-2203
              </a>
              <Link href="/samples" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-primary hover:bg-primary/90" size="lg">
                  <Sparkles className="h-4 w-4 mr-1" /> Get Free Samples
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
