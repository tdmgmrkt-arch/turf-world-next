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
  Truck,
  Shield,
  Star,
  Wrench,
  Filter as LucideFilter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { formatPrice, cn } from "@/lib/utils";
import { ACCESSORIES, type Accessory } from "@/lib/products";

// Cast Lucide icons to work around React 19 JSX type incompatibility
const Filter = LucideFilter as any;

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

type SupplyCategory = Accessory["category"] | "all";

const USE_FILTERS: { label: string; value: SupplyCategory }[] = [
  { label: "All Supplies", value: "all" },
  { label: "Infill", value: "infill" },
  { label: "Seaming", value: "seaming" },
  { label: "Installation", value: "installation" },
  { label: "Tools", value: "tools" },
];

interface SuppliesPageProps {
  searchParams: Promise<{ use?: string }>;
}

export default async function SuppliesPage({ searchParams }: SuppliesPageProps) {
  const { use: useFilter } = await searchParams;

  const accessories = ACCESSORIES;

  // Filter
  let filtered = accessories;
  if (useFilter && useFilter !== "all") {
    filtered = accessories.filter((a) => a.category === useFilter);
  }

  const currentFilter = USE_FILTERS.find((f) => f.value === (useFilter || "all"));
  const filterCounts = USE_FILTERS.map((f) => ({
    ...f,
    count:
      f.value === "all"
        ? accessories.length
        : accessories.filter((a) => a.category === f.value).length,
  }));

  return (
    <div className="min-h-screen">
      <Breadcrumb items={[{ label: "Supplies" }]} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-10 sm:py-14 md:py-20 lg:py-24">
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
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-slate-800/60 backdrop-blur-sm border border-emerald-400/30 text-xs sm:text-sm font-semibold text-emerald-400 shadow-lg mb-4 sm:mb-6">
              <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
              Ships with Your Turf Order
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight drop-shadow-lg">
              {currentFilter?.value === "all"
                ? <>Installation <span className="text-[#34CE95]">Supplies</span></>
                : currentFilter?.label}
            </h1>

            <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-white/90 max-w-xl drop-shadow-md">
              Everything you need to complete your turf installation.
              Professional-grade materials at competitive prices.
            </p>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-2 sm:gap-3 mt-6 sm:mt-8">
              <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-slate-800/60 backdrop-blur-sm border border-white/20">
                <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                <span className="text-xs sm:text-sm font-semibold text-white">Quality Guaranteed</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-slate-800/60 backdrop-blur-sm border border-white/20">
                <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                <span className="text-xs sm:text-sm font-semibold text-white">Fast Shipping</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-slate-800/60 backdrop-blur-sm border border-white/20">
                <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
                <span className="text-xs sm:text-sm font-semibold text-white">4.9/5 Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Bar */}
      <section className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b">
        <div className="container px-4 sm:px-6 py-3 sm:py-4">
          {/* Desktop: all pills with filter icon */}
          <div className="hidden sm:flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 no-scrollbar">
            <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            {filterCounts.map((filter) => (
              <Link
                key={filter.value}
                href={`/supplies${filter.value !== "all" ? `?use=${filter.value}` : ""}`}
                scroll={false}
              >
                <button
                  className={cn(
                    "px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap",
                    (useFilter === filter.value || (!useFilter && filter.value === "all"))
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "bg-muted hover:bg-muted/80 text-foreground"
                  )}
                >
                  {filter.label}
                  <span className="ml-1 sm:ml-1.5 text-[10px] sm:text-xs opacity-70">({filter.count})</span>
                </button>
              </Link>
            ))}
          </div>

          {/* Mobile: show only unselected pills */}
          <div className="flex sm:hidden items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {filterCounts
              .filter((f) => (useFilter === f.value || (!useFilter && f.value === "all")) ? false : true)
              .map((filter) => (
                <Link
                  key={filter.value}
                  href={`/supplies${filter.value !== "all" ? `?use=${filter.value}` : ""}`}
                  className="flex-1"
                  scroll={false}
                >
                  <button
                    className="w-full px-3 py-2 rounded-full text-xs font-medium transition-all whitespace-nowrap bg-muted hover:bg-muted/80 text-foreground"
                  >
                    {filter.label}
                  </button>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-6 sm:py-8 md:py-12">
        <div className="container px-4 sm:px-6">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No supplies found in this category.</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-3">
              {filtered.map((supply) => {
                const catDisplay = getCategoryDisplay(supply.category);
                const CatIcon = catDisplay.icon as any;
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
                              <CatIcon className="w-8 h-8 text-white" />
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

                      {/* Category pill */}
                      <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 z-10">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium text-white/90 bg-black/40 backdrop-blur-sm">
                          <CatIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          {catDisplay.displayName}
                        </span>
                      </div>
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
          )}
        </div>
      </section>

      {/* Calculator CTA */}
      <div className="container px-4 sm:px-6 pb-6 sm:pb-8 md:pb-12">
        <section className="mt-12 sm:mt-16 md:mt-20 pt-12 sm:pt-16 md:pt-20 border-t">
          <div className="text-center">
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
    </div>
  );
}
