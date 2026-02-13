"use client";

import NextLink from "next/link";
import NextImage from "next/image";
import { usePathname } from "next/navigation";
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
  Facebook as LucideFacebook,
  Instagram as LucideInstagram,
  ChevronDown as LucideChevronDown,
  User as LucideUser,
  LogOut as LucideLogOut,
} from "lucide-react";
import { AccountButton } from "@/components/account/account-dropdown";
import { useAuthStore } from "@/lib/auth-store";
import { useAuth } from "@/hooks/use-auth";

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
const Facebook = LucideFacebook as any;
const Instagram = LucideInstagram as any;
const ChevronDown = LucideChevronDown as any;
const UserIcon = LucideUser as any;
const LogOutIcon = LucideLogOut as any;

function YelpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor">
      <path d="m4.188 10.095.736-.17.073-.02A.813.813 0 0 0 5.45 8.65a1 1 0 0 0-.3-.258 3 3 0 0 0-.428-.198l-.808-.295a76 76 0 0 0-1.364-.493c-.296-.106-.549-.198-.766-.266-.041-.013-.087-.025-.124-.038a2.1 2.1 0 0 0-.606-.116.72.72 0 0 0-.572.245 2 2 0 0 0-.105.132 1.6 1.6 0 0 0-.155.309c-.15.443-.225.908-.22 1.376.002.423.013.966.246 1.334a.8.8 0 0 0 .22.24c.166.114.333.129.507.141.26.019.513-.045.764-.103l2.447-.566zm8.219-3.911a4.2 4.2 0 0 0-.8-1.14 1.6 1.6 0 0 0-.275-.21 2 2 0 0 0-.15-.073.72.72 0 0 0-.621.031c-.142.07-.294.182-.496.37-.028.028-.063.06-.094.089-.167.156-.353.35-.574.575q-.51.516-1.01 1.042l-.598.62a3 3 0 0 0-.298.365 1 1 0 0 0-.157.364.8.8 0 0 0 .007.301q0 .007.003.013a.81.81 0 0 0 .945.616l.074-.014 3.185-.736c.251-.058.506-.112.732-.242.151-.088.295-.175.394-.35a.8.8 0 0 0 .093-.313c.05-.434-.178-.927-.36-1.308M6.706 7.523c.23-.29.23-.722.25-1.075.07-1.181.143-2.362.201-3.543.022-.448.07-.89.044-1.34-.022-.372-.025-.799-.26-1.104C6.528-.077 5.644-.033 5.04.05q-.278.038-.553.104a8 8 0 0 0-.543.149c-.58.19-1.393.537-1.53 1.204-.078.377.106.763.249 1.107.173.417.41.792.625 1.185.57 1.036 1.15 2.066 1.728 3.097.172.308.36.697.695.857q.033.015.068.025c.15.057.313.068.469.032l.028-.007a.8.8 0 0 0 .377-.226zm-.276 3.161a.74.74 0 0 0-.923-.234 1 1 0 0 0-.145.09 2 2 0 0 0-.346.354c-.026.033-.05.077-.08.104l-.512.705q-.435.591-.861 1.193c-.185.26-.346.479-.472.673l-.072.11c-.152.235-.238.406-.282.559a.7.7 0 0 0-.03.314c.013.11.05.217.108.312q.046.07.1.138a1.6 1.6 0 0 0 .257.237 4.5 4.5 0 0 0 2.196.76 1.6 1.6 0 0 0 .349-.027 2 2 0 0 0 .163-.048.8.8 0 0 0 .278-.178.7.7 0 0 0 .17-.266c.059-.147.098-.335.123-.613l.012-.13c.02-.231.03-.502.045-.821q.037-.735.06-1.469l.033-.87a2.1 2.1 0 0 0-.055-.623 1 1 0 0 0-.117-.27zm5.783 1.362a2.2 2.2 0 0 0-.498-.378l-.112-.067c-.199-.12-.438-.246-.719-.398q-.644-.353-1.295-.695l-.767-.407c-.04-.012-.08-.04-.118-.059a2 2 0 0 0-.466-.166 1 1 0 0 0-.17-.018.74.74 0 0 0-.725.616 1 1 0 0 0 .01.293c.038.204.13.406.224.583l.41.768q.341.65.696 1.294c.152.28.28.52.398.719q.036.057.068.112c.145.239.261.39.379.497a.73.73 0 0 0 .596.201 2 2 0 0 0 .168-.029 1.6 1.6 0 0 0 .325-.129 4 4 0 0 0 .855-.64c.306-.3.577-.63.788-1.006q.045-.08.076-.165a2 2 0 0 0 .051-.161q.019-.083.029-.168a.8.8 0 0 0-.038-.327.7.7 0 0 0-.165-.27" />
    </svg>
  );
}

const socialLinks = [
  { name: "Facebook", href: "https://www.facebook.com/profile.php?id=61552575488475", icon: Facebook },
  { name: "Instagram", href: "https://www.instagram.com/_turfworld/", icon: Instagram },
  { name: "Yelp", href: "https://www.yelp.com/biz/turf-world-pomona?uid=XeIZ7fn8hGprnkV3-3HW4Q&utm_campaign=www_business_share_popup&utm_medium=copy_link&utm_source=(direct)", icon: YelpIcon },
];

// Cast to work around React 19 JSX type incompatibility
const Link = NextLink as any;
const Image = NextImage as any;
const Button = ShadcnButton as any;

const turfCategories = [
  {
    title: "Landscape Turf",
    href: "/products?use=landscape",
    description: "Lawns, yards & landscaping",
    image: "/landscape.card.webp",
    priceFrom: "$1.30",
    imagePosition: "top-center 60%",
  },
  {
    title: "Pet Turf",
    href: "/products?use=pet",
    description: "Antimicrobial/high-drainage",
    image: "/pets.card.webp",
    priceFrom: "$1.85",
    imagePosition: "center 60%",
  },
  {
    title: "Putting Greens",
    href: "/products?use=putting",
    description: "Pro-grade performance",
    image: "/golf.card.webp",
    priceFrom: "$3.75",
    imagePosition: "center 30%",
  },
  {
    title: "Installation Supplies",
    href: "/supplies",
    description: "Everything you need",
    image: "/supplies.card.webp",
    priceFrom: "$29",
    imagePosition: "center 2%",
  },
];

const supplyCategories = [
  {
    title: "Infill",
    href: "/supplies#infill",
    description: "Weight/support & odor control",
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

// Desktop navigation links (simple list)
const desktopNavLinks = [
  { name: "Calculator", href: "/calculator" },
  { name: "Locations", href: "/locations" },
  { name: "Wholesale", href: "/broker" },
];

// Mobile-only resource links (full list including legal/policy pages)
const mobileResourceLinks = [
  { name: "Calculator", href: "/calculator" },
  { name: "Locations", href: "/locations" },
  { name: "Wholesale", href: "/broker" },
  { name: "Installation Guide", href: "/installation" },
  { name: "Warranty Information", href: "/warranty" },
  { name: "Shipping Policy", href: "/shipping" },
  { name: "Return Policy", href: "/returns" },
  { name: "FAQ", href: "/faq" },
  { name: "Terms & Conditions", href: "/terms-and-conditions" },
  { name: "Privacy Policy", href: "/privacy-policy" },
];

export function Header() {
  const pathname = usePathname();
  const { openCart, getItemCount } = useCartStore();
  const itemCount = getItemCount();
  const [turfMenuOpen, setTurfMenuOpen] = useState(false);
  const [suppliesMenuOpen, setSuppliesMenuOpen] = useState(false);
  const [aboutMenuOpen, setAboutMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const { isAuthenticated } = useAuthStore();
  const { logout } = useAuth();
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
                  src="/turf.world.alternate.header.logo.webp"
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

              {desktopNavLinks.map((link) => (
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

              <AccountButton />

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
                  <Truck className="h-4 w-4" /> Fast Nationwide Shipping
                </span>
                <span className="flex items-center gap-1.5">
                  <Shield className="h-4 w-4" /> 16-Year Warranty
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
                        style={cat.imagePosition ? { objectPosition: cat.imagePosition } : undefined}
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
              <div className="col-span-4 border-l pl-10 flex flex-col">
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
                <div className="mt-auto pt-6 border-t">
                  <p className="text-sm text-muted-foreground mb-2">Questions? We&apos;re here to help.</p>
                  <a
                    href="tel:(909) 491-2203"
                    className="flex items-center gap-2 text-lg font-bold text-primary hover:underline"
                  >
                    <Phone className="h-5 w-5" /> (909) 491-2203
                  </a>
                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground mt-5 mb-5">Follow Us</p>
                    <div className="flex items-center gap-2">
                      {socialLinks.map((social) => (
                        <a
                          key={social.name}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all"
                          aria-label={social.name}
                        >
                          <social.icon className="h-3.5 w-3.5" />
                        </a>
                      ))}
                    </div>
                  </div>
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
              <div className="col-span-4 border-l pl-10 flex flex-col">
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
                <div className="mt-auto pt-6 border-t">
                  <p className="text-sm text-muted-foreground mb-2">Need help choosing supplies?</p>
                  <a
                    href="tel:(909) 491-2203"
                    className="flex items-center gap-2 text-lg font-bold text-primary hover:underline"
                  >
                    <Phone className="h-5 w-5" /> (909) 491-2203
                  </a>
                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground mt-5 mb-5">Follow Us</p>
                    <div className="flex items-center gap-2">
                      {socialLinks.map((social) => (
                        <a
                          key={social.name}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all"
                          aria-label={social.name}
                        >
                          <social.icon className="h-3.5 w-3.5" />
                        </a>
                      ))}
                    </div>
                  </div>
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
                      <Shield className="h-4 w-4 text-primary" /> 16-Year Warranty
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Star className="h-4 w-4 text-amber-500" /> 4.9/5 Customer Rating
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="col-span-4 border-l pl-10 flex flex-col">
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
                <div className="mt-auto pt-6 border-t">
                  <p className="text-sm text-muted-foreground mb-2">Questions? We&apos;re here to help.</p>
                  <a
                    href="tel:(909) 491-2203"
                    className="flex items-center gap-2 text-lg font-bold text-primary hover:underline"
                  >
                    <Phone className="h-5 w-5" /> (909) 491-2203
                  </a>
                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground mt-5 mb-5">Follow Us</p>
                    <div className="flex items-center gap-2">
                      {socialLinks.map((social) => (
                        <a
                          key={social.name}
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all"
                          aria-label={social.name}
                        >
                          <social.icon className="h-3.5 w-3.5" />
                        </a>
                      ))}
                    </div>
                  </div>
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

            {/* Contextual "Now Browsing" Header */}
            {(() => {
              const currentCategory = turfCategories.find(cat => pathname === cat.href || pathname?.startsWith(cat.href.split('?')[0])) ||
                                     supplyCategories.find(cat => pathname === cat.href || pathname?.startsWith(cat.href.split('#')[0]));

              if (currentCategory) {
                return (
                  <div className="px-4 py-3 bg-gradient-to-r from-primary/5 to-emerald-50 border-b border-primary/10">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                        Now Browsing: {currentCategory.title}
                      </span>
                    </div>
                  </div>
                );
              }
              return null;
            })()}

            <div className="relative flex-1">
              <div className="absolute inset-0 overflow-y-auto">
                {/* Turf Categories - Primary Visual Block */}
                <div className="p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Shop Turf</p>
                <div className="grid grid-cols-2 gap-2">
                  {turfCategories.map((cat) => {
                    const isActive = pathname === cat.href || pathname?.startsWith(cat.href.split('?')[0]);
                    return (
                      <Link
                        key={cat.title}
                        href={cat.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "relative rounded-lg overflow-hidden aspect-square transition-all active:scale-95",
                          isActive && "ring-2 ring-primary ring-offset-2"
                        )}
                      >
                        <Image
                          src={cat.image}
                          alt={cat.title}
                          fill
                          className="object-cover"
                          style={cat.imagePosition ? { objectPosition: cat.imagePosition } : undefined}
                          priority
                        />
                        <div className={cn(
                          "absolute inset-0 bg-gradient-to-t transition-colors",
                          isActive
                            ? "from-primary/90 to-primary/20"
                            : "from-black/70 to-transparent"
                        )} />
                        <div className="absolute bottom-2 left-2 right-2 text-white">
                          <span className={cn(
                            "font-semibold text-sm block",
                            isActive && "text-white"
                          )}>{cat.title}</span>
                          <span className="text-xs text-white/90">From {cat.priceFrom}/sf</span>
                        </div>
                        {isActive && (
                          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400 shadow-lg" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Calculator Bridge - Prominent CTA */}
              <div className="px-4 py-3 border-t bg-gradient-to-br from-primary/5 to-emerald-50/50">
                <Link
                  href="/calculator"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block group"
                >
                  <div className="flex items-center gap-3 p-3.5 rounded-xl bg-gradient-to-r from-primary to-emerald-600 shadow-lg shadow-primary/20 transition-all active:scale-95 hover:shadow-xl hover:shadow-primary/30">
                    <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Calculator className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">Turf Project Calculator</span>
                        <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[9px] font-semibold text-white uppercase tracking-wider">Free</span>
                      </div>
                      <p className="text-xs text-white/90 mt-0.5">Get exact materials & pricing instantly</p>
                    </div>
                    <div className="text-white/80 transition-transform group-hover:translate-x-1">→</div>
                  </div>
                </Link>
              </div>

              {/* Supplies Categories - Primary Visual Block */}
              <div className="p-4 border-t">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Shop Supplies</p>
                <div className="grid grid-cols-2 gap-2">
                  {supplyCategories.map((cat) => {
                    const isActive = pathname === cat.href || pathname?.startsWith(cat.href.split('#')[0]);
                    return (
                      <Link
                        key={cat.title}
                        href={cat.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "relative rounded-lg overflow-hidden aspect-square border transition-all active:scale-95",
                          isActive
                            ? "border-primary ring-2 ring-primary ring-offset-2"
                            : "border-slate-200"
                        )}
                      >
                        <Image
                          src={cat.image}
                          alt={cat.title}
                          fill
                          className="object-cover"
                          priority
                        />
                        <div className={cn(
                          "absolute inset-0 bg-gradient-to-t transition-colors",
                          isActive
                            ? "from-primary/90 via-primary/20 to-transparent"
                            : "from-black/70 via-black/20 to-transparent"
                        )} />
                        <div className="absolute bottom-0 left-0 right-0 p-2">
                          <span className="font-semibold text-sm block text-white">{cat.title}</span>
                        </div>
                        {isActive && (
                          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400 shadow-lg" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* About - Accordion */}
              <div className="border-t">
                <button
                  onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-all active:scale-[0.98]"
                >
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">About</span>
                  <ChevronDown className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform duration-200",
                    mobileAboutOpen && "rotate-180"
                  )} />
                </button>
                <div className={cn(
                  "overflow-hidden transition-all duration-300 ease-in-out",
                  mobileAboutOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                )}>
                  <div className="px-4 pb-4 space-y-1">
                    {aboutCategories.map((cat) => {
                      const isActive = pathname === cat.href;
                      return (
                        <Link
                          key={cat.title}
                          href={cat.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            "flex items-center justify-between py-2.5 px-3 rounded-lg transition-all active:scale-95 text-sm",
                            isActive
                              ? "bg-primary/10 text-primary font-semibold"
                              : "hover:bg-slate-50 text-foreground"
                          )}
                        >
                          <span>{cat.title}</span>
                          {isActive && (
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          )}
                        </Link>
                      );
                    })}
                    <Link
                      href="/contact"
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center justify-between py-2.5 px-3 rounded-lg transition-all active:scale-95 text-sm",
                        pathname === "/contact"
                          ? "bg-primary/10 text-primary font-semibold"
                          : "hover:bg-slate-50 text-foreground"
                      )}
                    >
                      <span>Contact</span>
                      {pathname === "/contact" && (
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      )}
                    </Link>
                  </div>
                </div>
              </div>

              {/* Resources - Accordion */}
              <div className="border-t">
                <button
                  onClick={() => setMobileResourcesOpen(!mobileResourcesOpen)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-all active:scale-[0.98]"
                >
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Resources</span>
                  <ChevronDown className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform duration-200",
                    mobileResourcesOpen && "rotate-180"
                  )} />
                </button>
                <div className={cn(
                  "overflow-hidden transition-all duration-300 ease-in-out",
                  mobileResourcesOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
                )}>
                  <div className="px-4 pb-4 space-y-1">
                    {mobileResourceLinks.map((link) => {
                      const isActive = pathname === link.href;
                      return (
                        <Link
                          key={link.name}
                          href={link.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            "flex items-center justify-between py-2.5 px-3 rounded-lg transition-all active:scale-95 text-sm",
                            isActive
                              ? "bg-primary/10 text-primary font-semibold"
                              : "hover:bg-slate-50 text-foreground"
                          )}
                        >
                          <span>{link.name}</span>
                          {isActive && (
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
              </div>
            </div>

            {/* Account Section */}
            <div className="p-4 border-t border-slate-200">
              {isAuthenticated ? (
                <div className="space-y-1">
                  <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Account
                  </div>
                  <Link
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <UserIcon className="h-4 w-4 text-slate-400" />
                    My Account
                  </Link>
                  <Link
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <Package className="h-4 w-4 text-slate-400" />
                    Order History
                  </Link>
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <LogOutIcon className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/account/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 transition-colors"
                >
                  <UserIcon className="h-4 w-4" />
                  Sign In / Create Account
                </Link>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-slate-50">
              <a href="tel:(909) 491-2203" className="flex items-center justify-center gap-2 mb-3 text-sm font-medium transition-all active:scale-95 hover:text-primary">
                <Phone className="h-4 w-4" /> (909) 491-2203
              </a>
              <Link href="/samples" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-primary hover:bg-primary/90 transition-all active:scale-95" size="lg">
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
