"use client";

import { useState } from "react";
import NextLink from "next/link";
import NextImage from "next/image";
import { Button as ShadcnButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Phone as LucidePhone,
  Mail as LucideMail,
  MapPin as LucideMapPin,
  Facebook as LucideFacebook,
  Instagram as LucideInstagram,
} from "lucide-react";

// Cast Lucide icons to work around React 19 JSX type incompatibility
const Phone = LucidePhone as any;
const Mail = LucideMail as any;
const MapPin = LucideMapPin as any;
const Facebook = LucideFacebook as any;
const Instagram = LucideInstagram as any;

function YelpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor">
      <path d="m4.188 10.095.736-.17.073-.02A.813.813 0 0 0 5.45 8.65a1 1 0 0 0-.3-.258 3 3 0 0 0-.428-.198l-.808-.295a76 76 0 0 0-1.364-.493c-.296-.106-.549-.198-.766-.266-.041-.013-.087-.025-.124-.038a2.1 2.1 0 0 0-.606-.116.72.72 0 0 0-.572.245 2 2 0 0 0-.105.132 1.6 1.6 0 0 0-.155.309c-.15.443-.225.908-.22 1.376.002.423.013.966.246 1.334a.8.8 0 0 0 .22.24c.166.114.333.129.507.141.26.019.513-.045.764-.103l2.447-.566zm8.219-3.911a4.2 4.2 0 0 0-.8-1.14 1.6 1.6 0 0 0-.275-.21 2 2 0 0 0-.15-.073.72.72 0 0 0-.621.031c-.142.07-.294.182-.496.37-.028.028-.063.06-.094.089-.167.156-.353.35-.574.575q-.51.516-1.01 1.042l-.598.62a3 3 0 0 0-.298.365 1 1 0 0 0-.157.364.8.8 0 0 0 .007.301q0 .007.003.013a.81.81 0 0 0 .945.616l.074-.014 3.185-.736c.251-.058.506-.112.732-.242.151-.088.295-.175.394-.35a.8.8 0 0 0 .093-.313c.05-.434-.178-.927-.36-1.308M6.706 7.523c.23-.29.23-.722.25-1.075.07-1.181.143-2.362.201-3.543.022-.448.07-.89.044-1.34-.022-.372-.025-.799-.26-1.104C6.528-.077 5.644-.033 5.04.05q-.278.038-.553.104a8 8 0 0 0-.543.149c-.58.19-1.393.537-1.53 1.204-.078.377.106.763.249 1.107.173.417.41.792.625 1.185.57 1.036 1.15 2.066 1.728 3.097.172.308.36.697.695.857q.033.015.068.025c.15.057.313.068.469.032l.028-.007a.8.8 0 0 0 .377-.226zm-.276 3.161a.74.74 0 0 0-.923-.234 1 1 0 0 0-.145.09 2 2 0 0 0-.346.354c-.026.033-.05.077-.08.104l-.512.705q-.435.591-.861 1.193c-.185.26-.346.479-.472.673l-.072.11c-.152.235-.238.406-.282.559a.7.7 0 0 0-.03.314c.013.11.05.217.108.312q.046.07.1.138a1.6 1.6 0 0 0 .257.237 4.5 4.5 0 0 0 2.196.76 1.6 1.6 0 0 0 .349-.027 2 2 0 0 0 .163-.048.8.8 0 0 0 .278-.178.7.7 0 0 0 .17-.266c.059-.147.098-.335.123-.613l.012-.13c.02-.231.03-.502.045-.821q.037-.735.06-1.469l.033-.87a2.1 2.1 0 0 0-.055-.623 1 1 0 0 0-.117-.27zm5.783 1.362a2.2 2.2 0 0 0-.498-.378l-.112-.067c-.199-.12-.438-.246-.719-.398q-.644-.353-1.295-.695l-.767-.407c-.04-.012-.08-.04-.118-.059a2 2 0 0 0-.466-.166 1 1 0 0 0-.17-.018.74.74 0 0 0-.725.616 1 1 0 0 0 .01.293c.038.204.13.406.224.583l.41.768q.341.65.696 1.294c.152.28.28.52.398.719q.036.057.068.112c.145.239.261.39.379.497a.73.73 0 0 0 .596.201 2 2 0 0 0 .168-.029 1.6 1.6 0 0 0 .325-.129 4 4 0 0 0 .855-.64c.306-.3.577-.63.788-1.006q.045-.08.076-.165a2 2 0 0 0 .051-.161q.019-.083.029-.168a.8.8 0 0 0-.038-.327.7.7 0 0 0-.165-.27" />
    </svg>
  );
}

// Cast to work around React 19 JSX type incompatibility
const Link = NextLink as any;
const Image = NextImage as any;
const Button = ShadcnButton as any;

const footerLinks = {
  shop: {
    title: "Shop",
    links: [
      { name: "All Products", href: "/products" },
      { name: "Pet Turf", href: "/products?use=pet" },
      { name: "Landscape", href: "/products?use=landscape" },
      { name: "Putting Greens", href: "/products?use=putting" },
      { name: "Supplies", href: "/supplies" },
    ],
  },
  resources: {
    title: "Resources",
    links: [
      { name: "Project Calculator", href: "/calculator" },
      { name: "Free Samples", href: "/samples" },
      { name: "Installation Guide", href: "/installation" },
      { name: "Find Installers", href: "/installers" },
      { name: "FAQ", href: "/faq" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { name: "About Us", href: "/about" },
      { name: "Service Areas", href: "/locations" },
      { name: "Reviews", href: "/reviews" },
      { name: "Partner With Us", href: "/broker" },
      { name: "Contact", href: "/contact" },
    ],
  },
  legal: {
    title: "Legal",
    links: [
      { name: "Privacy Policy", href: "/privacy-policy" },
      { name: "Terms of Service", href: "/terms-and-conditions" },
      { name: "Shipping Policy", href: "/shipping" },
      { name: "Return Policy", href: "/returns" },
      { name: "Warranty", href: "/warranty" },
    ],
  },
};

const socialLinks = [
  { name: "Facebook", href: "https://www.facebook.com/profile.php?id=61552575488475" },
  { name: "Instagram", href: "https://www.instagram.com/_turfworld/" },
  { name: "Yelp", href: "https://www.yelp.com/biz/turf-world-pomona?uid=XeIZ7fn8hGprnkV3-3HW4Q&utm_campaign=www_business_share_popup&utm_medium=copy_link&utm_source=(direct)" },
];

export function Footer() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white/80">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="container px-4 sm:px-6 py-8 md:py-16">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 md:gap-8">
            <div className="max-w-md">
              <h3 className="text-xl md:text-2xl font-bold text-white">Get Turf Tips & Deals</h3>
              <p className="mt-1 md:mt-2 text-sm text-white/60">
                Subscribe for installation tips, seasonal offers, and exclusive discounts.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full lg:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 lg:w-80 px-4 h-12 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
              />
              <Button className="w-full sm:w-auto px-8 h-12 rounded-xl btn-premium">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container px-4 sm:px-6 py-8 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8 lg:gap-12">
          {/* Logo & Contact */}
          <div className="col-span-1 md:col-span-3 lg:col-span-2">
            <Link href="/">
              <div className="relative h-10 md:h-12 w-[160px] md:w-[200px]">
                <Image
                  src="/turf.world.alternate.header.logo.webp"
                  alt="Turf World"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>

            <p className="mt-3 md:mt-4 text-sm text-white/60 max-w-xs">
              Professional-grade artificial grass, direct to your door. Skip the middleman
              and save with transparent pricing.
            </p>

            <div className="mt-4 md:mt-6 space-y-2 md:space-y-3">
              <a
                href="tel:(909) 491-2203"
                className="flex items-center gap-3 text-sm hover:text-white transition-colors"
              >
                <Phone className="h-4 w-4 text-primary" />
                (909) 491-2203
              </a>
              <a
                href="mailto:orders@turf-world.com"
                className="flex items-center gap-3 text-sm hover:text-white transition-colors"
              >
                <Mail className="h-4 w-4 text-primary" />
                orders@turf-world.com
              </a>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-primary" />
                Ships Nationwide
              </div>
            </div>

            {/* Social Links - Always visible */}
            <div className="mt-4 md:mt-6 flex gap-2 md:gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary hover:text-white transition-all text-sm"
                  aria-label={social.name}
                >
                  {social.name === "Facebook" && <Facebook className="h-4 w-4" />}
                  {social.name === "Instagram" && <Instagram className="h-4 w-4" />}
                  {social.name === "Yelp" && <YelpIcon className="h-4 w-4" />}
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns - Accordion on Mobile, Grid on Desktop */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={section.title} className="col-span-1">
              {/* Mobile: Accordion Header */}
              <button
                onClick={() => toggleSection(key)}
                className="md:hidden w-full flex items-center justify-between py-3 border-b border-white/10"
                aria-expanded={openSection === key}
              >
                <h4 className="font-semibold text-white text-sm">{section.title}</h4>
                <span
                  className={cn(
                    "text-white/60 transition-transform duration-200",
                    openSection === key && "rotate-180"
                  )}
                >
                  ▼
                </span>
              </button>

              {/* Desktop: Static Header */}
              <h4 className="hidden md:block font-semibold text-white mb-4">{section.title}</h4>

              {/* Mobile: Collapsible Links */}
              <ul
                className={cn(
                  "md:hidden overflow-hidden transition-all duration-200 ease-in-out",
                  openSection === key ? "max-h-48 py-3" : "max-h-0"
                )}
              >
                {section.links.map((link) => (
                  <li key={link.name} className="py-1.5">
                    <Link
                      href={link.href}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Desktop: Always Visible Links */}
              <ul className="hidden md:block space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container px-4 sm:px-6 py-4 md:py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-xs md:text-sm text-white/40 text-center md:text-left">
              &copy; {new Date().getFullYear()} Turf World. All rights reserved.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-4 text-[10px] md:text-xs text-white/40">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-emerald-500"></span>
                PFAS-Free
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-amber-500"></span>
                Class-A Fire
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-blue-500"></span>
                16-Year Warranty
              </span>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-[10px] md:text-xs text-white/40">Secure checkout</span>
              <div className="flex gap-1">
                {["Visa", "MC", "Amex", "PayPal"].map((method) => (
                  <div
                    key={method}
                    className="w-7 h-4 md:w-8 md:h-5 rounded bg-white/10 flex items-center justify-center text-[7px] md:text-[8px] font-medium"
                  >
                    {method}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
