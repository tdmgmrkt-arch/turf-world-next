import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Package,
  Scissors,
  Droplets,
  Hammer,
  ArrowRight,
  Sparkles,
  Check,
  Star,
  Truck,
  Shield,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { formatPrice, cn } from "@/lib/utils";
import { ACCESSORIES, type Accessory } from "@/lib/products";

export const metadata: Metadata = {
  title: "Turf Installation Supplies | Infill, Seam Tape, Nails & More",
  description:
    "Everything you need to install artificial turf. Silica sand, CamoFill infill, seam tape, nails, and weed barrier. Ships with your turf order.",
};

// Map accessories to display format with icons and gradients
const getCategoryDisplay = (category: Accessory["category"]) => {
  switch (category) {
    case "infill":
      return { icon: Droplets, gradient: "from-amber-400 to-orange-500", displayName: "Infill" };
    case "seaming":
      return { icon: Scissors, gradient: "from-blue-400 to-indigo-500", displayName: "Seaming" };
    case "installation":
      return { icon: Hammer, gradient: "from-slate-500 to-slate-700", displayName: "Installation" };
    case "tools":
      return { icon: Wrench, gradient: "from-purple-400 to-indigo-500", displayName: "Tools" };
    default:
      return { icon: Package, gradient: "from-gray-400 to-gray-600", displayName: "Other" };
  }
};

const CATEGORIES: { name: Accessory["category"]; displayName: string; icon: typeof Droplets; description: string; gradient: string }[] = [
  {
    name: "infill",
    displayName: "Infill",
    icon: Droplets,
    description: "Add weight, support, and odor control to your turf",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    name: "seaming",
    displayName: "Seaming",
    icon: Scissors,
    description: "Join multiple turf pieces seamlessly",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    name: "installation",
    displayName: "Installation",
    icon: Hammer,
    description: "Nails, weed barrier, and protection materials",
    gradient: "from-slate-600 to-slate-800",
  },
  {
    name: "tools",
    displayName: "Tools & Accessories",
    icon: Wrench,
    description: "Golf cups, padding, and finishing touches",
    gradient: "from-purple-500 to-indigo-600",
  },
];

export default async function SuppliesPage() {
  // Always use local ACCESSORIES data — Medusa prices have been unreliable.
  // The import script ensures Medusa DB prices match, but we don't depend on
  // Medusa API here since local products-data.json is the source of truth.
  const accessories = ACCESSORIES;

  return (
    <div className="min-h-screen">
      <Breadcrumb items={[{ label: "Supplies" }]} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 sm:py-16 md:py-24 lg:py-28">
        {/* Background Image */}
        <Image
          src="/shop.all.turf.hero.webp"
          alt="Installation supplies"
          fill
          className="object-cover object-[center_25%]"
          priority
        />
        <div className="absolute inset-0 bg-slate-900/60" />

        <div className="container px-4 sm:px-6 relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-xs sm:text-sm text-white/80 mb-4 sm:mb-6">
              <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
              <span>Ships with Your Turf Order</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
              Installation{" "}
              <span className="text-[#34CE95]">
                Supplies
              </span>
            </h1>

            <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              Everything you need to complete your turf installation.
              Professional-grade materials at competitive prices.
            </p>

            {/* Category pills */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-6 sm:mt-10">
              {CATEGORIES.map((cat) => (
                <a
                  key={cat.name}
                  href={`#${cat.name}`}
                  className="group flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-white hover:bg-white/20 transition-all duration-300"
                >
                  <cat.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                  <span className="text-sm sm:text-base font-medium">{cat.displayName}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-4 sm:py-6 border-b bg-muted/30">
        <div className="container px-4 sm:px-6">
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 md:gap-16">
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
              <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <span>Quality Guaranteed</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
              <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              <span>Fast Shipping</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
              <span>4.9/5 Customer Rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-10 sm:py-14 md:py-20">
        <div className="container px-4 sm:px-6">
          {CATEGORIES.map((category, catIdx) => {
            const categoryItems = accessories.filter(
              (a) => a.category === category.name
            );
            if (categoryItems.length === 0) return null;

            return (
              <div
                key={category.name}
                id={category.name}
                className={cn("scroll-mt-24", catIdx > 0 && "mt-12 sm:mt-16 md:mt-20")}
              >
                {/* Category Header */}
                <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                  <div
                    className={cn(
                      "w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br flex items-center justify-center shadow-lg",
                      category.gradient
                    )}
                  >
                    <category.icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">{category.displayName}</h2>
                    <p className="text-xs sm:text-sm md:text-base text-muted-foreground">{category.description}</p>
                  </div>
                </div>

                {/* Products Grid */}
                <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-3">
                  {categoryItems.map((supply) => {
                    const catDisplay = getCategoryDisplay(supply.category);
                    const hasImage = supply.images && supply.images.length > 0;

                    return (
                      <Link
                        key={supply.id}
                        href={`/supplies/${supply.handle}`}
                        className="group relative flex flex-col rounded-xl sm:rounded-2xl bg-white border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                      >
                        {/* Product Image */}
                        <div className="h-28 sm:h-36 md:h-40 relative bg-gradient-to-br from-muted/50 to-muted overflow-hidden">
                          {hasImage ? (
                            <Image
                              src={supply.images[0]}
                              alt={supply.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <>
                              {/* Pattern overlay for items without images */}
                              <div className={cn("absolute inset-0 bg-gradient-to-br", catDisplay.gradient)} />
                              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-30" />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                  <catDisplay.icon className="w-8 h-8 text-white" />
                                </div>
                              </div>
                            </>
                          )}

                          {/* Gradient overlay for readability */}
                          {hasImage && (
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                          )}

                          {/* Badge */}
                          {supply.badge && (
                            <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10">
                              <span className={cn(
                                "inline-flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold text-white shadow-lg",
                                supply.badgeColor || "bg-primary"
                              )}>
                                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                {supply.badge}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex flex-1 flex-col p-3 sm:p-4 md:p-6">
                          <div className="flex items-start justify-between gap-1 sm:gap-2">
                            <h3 className="text-sm sm:text-base md:text-lg font-bold group-hover:text-primary transition-colors line-clamp-2">
                              {supply.name}
                            </h3>
                            <span className="text-[10px] sm:text-xs font-medium text-muted-foreground bg-muted px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full whitespace-nowrap flex-shrink-0">
                              {supply.size}
                            </span>
                          </div>
                          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-muted-foreground flex-1 line-clamp-2 hidden sm:block">
                            {supply.description}
                          </p>

                          {/* Tags - hidden on mobile */}
                          {supply.tags.length > 0 && (
                            <div className="hidden md:flex flex-wrap gap-2 mt-4">
                              {supply.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full bg-muted text-muted-foreground"
                                >
                                  <Check className="w-2.5 h-2.5 text-primary" />
                                  {tag.replace(/-/g, " ")}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Price & Action */}
                          <div className="mt-3 sm:mt-4 md:mt-6 pt-2 sm:pt-3 md:pt-4 border-t flex items-center justify-between">
                            <div>
                              {/* Show compare-at price if promotion active */}
                              {supply.comparePriceCents && (
                                <div className="mb-0.5">
                                  <span className="text-[10px] sm:text-xs text-muted-foreground line-through">
                                    {formatPrice(supply.comparePriceCents)}
                                  </span>
                                  <span className="ml-1.5 text-[9px] sm:text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                                    {Math.round((1 - supply.priceCents / supply.comparePriceCents) * 100)}% OFF
                                  </span>
                                </div>
                              )}
                              <span className={cn(
                                "text-lg sm:text-xl md:text-2xl font-bold",
                                supply.comparePriceCents
                                  ? "text-rose-600"
                                  : "text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-600"
                              )}>
                                {formatPrice(supply.priceCents)}
                              </span>
                            </div>
                            <span className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-primary group-hover:underline">
                              View Details
                              <ArrowRight className="w-4 h-4" />
                            </span>
                            <ArrowRight className="w-4 h-4 sm:hidden text-primary" />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Calculator CTA */}
      <section className="py-16 sm:py-20 lg:py-24 border-t">
        <div className="container text-center">
          <h2 className="max-w-3xl mx-auto">
            Not Sure What You Need?
          </h2>
          <p className="mt-6 text-body-lg text-muted-foreground max-w-xl mx-auto">
            Our project calculator tells you exactly how much infill, seam tape,
            and adhesive you need based on your project dimensions.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="btn-premium text-lg px-8 h-14" asChild>
              <Link href="/calculator">
                Use the Calculator
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 h-14" asChild>
              <Link href="/samples">Get Free Samples</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
