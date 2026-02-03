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
  Youtube as LucideYoutube,
  Twitter as LucideTwitter,
} from "lucide-react";

// Cast Lucide icons to work around React 19 JSX type incompatibility
const Phone = LucidePhone as any;
const Mail = LucideMail as any;
const MapPin = LucideMapPin as any;
const Facebook = LucideFacebook as any;
const Instagram = LucideInstagram as any;
const Youtube = LucideYoutube as any;
const Twitter = LucideTwitter as any;

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
      { name: "Contact", href: "/contact" },
      { name: "Careers", href: "/careers" },
    ],
  },
  legal: {
    title: "Legal",
    links: [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Shipping Policy", href: "/shipping" },
      { name: "Return Policy", href: "/returns" },
      { name: "Warranty", href: "/warranty" },
    ],
  },
};

const socialLinks = [
  { name: "Facebook", href: "https://facebook.com/turfworld" },
  { name: "Instagram", href: "https://instagram.com/turfworld" },
  { name: "YouTube", href: "https://youtube.com/turfworld" },
  { name: "Twitter", href: "https://twitter.com/turfworld" },
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
                  src="/turf.world.alternate.header.logo.png"
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
                href="mailto:hello@turfworld.com"
                className="flex items-center gap-3 text-sm hover:text-white transition-colors"
              >
                <Mail className="h-4 w-4 text-primary" />
                hello@turfworld.com
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
                  {social.name === "YouTube" && <Youtube className="h-4 w-4" />}
                  {social.name === "Twitter" && <Twitter className="h-4 w-4" />}
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
                15-Year Warranty
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
