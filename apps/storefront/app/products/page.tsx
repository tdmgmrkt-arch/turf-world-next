import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight as LucideArrowRight,
  Sparkles as LucideSparkles,
  Truck as LucideTruck,
  Shield as LucideShield,
  Filter as LucideFilter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { cn } from "@/lib/utils";
import { PRODUCTS, type ProductUse } from "@/lib/products";
import { fetchAllProducts } from "@/lib/medusa-products";
import { USE_MEDUSA_API } from "@/lib/medusa-client";
import { ProductsClientWrapper } from "./products-client-wrapper";

// Cast Lucide icons to work around React 19 JSX type incompatibility
const ArrowRight = LucideArrowRight as any;
const Sparkles = LucideSparkles as any;
const Truck = LucideTruck as any;
const Shield = LucideShield as any;
const Filter = LucideFilter as any;

export const metadata: Metadata = {
  title: "Shop Artificial Grass | Premium Turf Collection",
  description:
    "Browse our complete collection of professional-grade artificial turf. Fast nationwide shipping, 16-year warranty, direct from manufacturer pricing.",
};

const USE_FILTERS: { label: string; value: ProductUse | "all"; icon?: string }[] = [
  { label: "All Products", value: "all" },
  { label: "Landscape", value: "landscape" },
  { label: "Pet Turf", value: "pet" },
  { label: "Putting Green", value: "putting" },
];

const SORT_FIELDS = [
  { label: "Featured", field: "" },
  { label: "Price", field: "price", defaultDir: "asc" as const },
  { label: "Weight", field: "weight", defaultDir: "desc" as const },
  { label: "Height", field: "height", defaultDir: "desc" as const },
];

interface ProductsPageProps {
  searchParams: Promise<{ use?: string; sort?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { use: useFilter, sort } = await searchParams;

  // Fetch products from API or use hardcoded data based on feature flag
  const allProducts = USE_MEDUSA_API ? await fetchAllProducts() : PRODUCTS;

  // Filter products
  let filteredProducts = allProducts;
  if (useFilter && useFilter !== "all") {
    filteredProducts = allProducts.filter((p) =>
      p.uses.includes(useFilter as ProductUse)
    );
  }

  // Sort products
  if (sort === "price-asc") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => a.priceCents - b.priceCents
    );
  } else if (sort === "price-desc") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => b.priceCents - a.priceCents
    );
  } else if (sort === "weight-asc") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => a.weight - b.weight
    );
  } else if (sort === "weight-desc") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => b.weight - a.weight
    );
  } else if (sort === "height-asc") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => a.pileHeight - b.pileHeight
    );
  } else if (sort === "height-desc") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => b.pileHeight - a.pileHeight
    );
  } else {
    // Default: featured first, then by weight
    filteredProducts = [...filteredProducts].sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return b.weight - a.weight;
    });
  }

  const currentFilter = USE_FILTERS.find((f) => f.value === (useFilter || "all"));
  const filterCounts = USE_FILTERS.map((f) => ({
    ...f,
    count:
      f.value === "all"
        ? allProducts.length
        : allProducts.filter((p) => p.uses.includes(f.value as ProductUse)).length,
  }));

  return (
    <div className="min-h-screen">
      <Breadcrumb items={[{ label: "Products" }]} />

      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-10 sm:py-14 md:py-20 lg:py-24">
        {/* Background image for specific filters */}
        {useFilter === "pet" && (
          <>
            <Image
              src="/pet.turf.hero.webp"
              alt="Pet turf"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-slate-900/60" />
          </>
        )}
        {useFilter === "putting" && (
          <>
            <Image
              src="/putting.green.hero.webp"
              alt="Putting green turf"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-slate-900/60" />
          </>
        )}
        {useFilter === "landscape" && (
          <>
            <Image
              src="/landscape.hero.webp"
              alt="Landscape turf"
              fill
              className="object-cover object-[center_75%]"
              priority
            />
            <div className="absolute inset-0 bg-slate-900/60" />
          </>
        )}
        {/* Shop All Turf hero (no filter or "all") */}
        {(!useFilter || useFilter === "all") && (
          <>
            <Image
              src="/shop.all.turf.hero.webp"
              alt="Shop all turf"
              fill
              className="object-cover object-[center_25%]"
              priority
            />
            <div className="absolute inset-0 bg-slate-900/60" />
          </>
        )}

        <div className="container px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-slate-800/60 backdrop-blur-sm border border-emerald-400/30 text-xs sm:text-sm font-semibold text-emerald-400 shadow-lg mb-4 sm:mb-6">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
              Direct from Manufacturer
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight drop-shadow-lg">
              {currentFilter?.value === "all" ? "Shop All Turf" : currentFilter?.label}
            </h1>

            <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-white/90 max-w-xl drop-shadow-md">
              Professional-grade artificial grass with fast nationwide shipping, 16-year
              warranty, and contractor-direct pricing.
            </p>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-2 sm:gap-3 mt-6 sm:mt-8">
              <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-slate-800/60 backdrop-blur-sm border border-white/20">
                <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                <span className="text-xs sm:text-sm font-semibold text-white">Fast Shipping</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-slate-800/60 backdrop-blur-sm border border-white/20">
                <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                <span className="text-xs sm:text-sm font-semibold text-white">16-Year Warranty</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-slate-800/60 backdrop-blur-sm border border-white/20">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                <span className="text-xs sm:text-sm font-semibold text-white">PFAS-Free</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Bar */}
      <section className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b">
        <div className="container px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col gap-3 sm:gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Category Filters */}
            {/* Desktop: Show all pills */}
            <div className="hidden sm:flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 no-scrollbar">
              <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              {filterCounts.map((filter) => (
                <Link
                  key={filter.value}
                  href={`/products${filter.value !== "all" ? `?use=${filter.value}` : ""}${sort ? `${filter.value !== "all" ? "&" : "?"}sort=${sort}` : ""}`}
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

            {/* Mobile: Show only 3 unselected pills */}
            <div className="flex sm:hidden items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {filterCounts
                .filter((f) => (useFilter === f.value || (!useFilter && f.value === "all")) ? false : true)
                .map((filter) => (
                  <Link
                    key={filter.value}
                    href={`/products${filter.value !== "all" ? `?use=${filter.value}` : ""}${sort ? `${filter.value !== "all" ? "&" : "?"}sort=${sort}` : ""}`}
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

            {/* Sort - Desktop only, mobile handled in ProductsClientWrapper */}
            <div className="hidden sm:flex items-center gap-2 sm:gap-3">
              <span className="text-xs sm:text-sm text-muted-foreground">Sort:</span>
              <div className="flex gap-0.5 sm:gap-1 bg-muted rounded-full p-0.5 sm:p-1">
                {SORT_FIELDS.map((option) => {
                  const currentField = sort ? sort.replace(/-asc$|-desc$/, '') : '';
                  const currentDir = sort?.endsWith('-asc') ? 'asc' : sort?.endsWith('-desc') ? 'desc' : null;
                  const isActive = option.field === '' ? !sort : currentField === option.field;

                  // Compute the next sort value
                  let nextSort = '';
                  if (option.field === '') {
                    // Featured — no sort param
                    nextSort = '';
                  } else if (isActive) {
                    // Toggle direction
                    nextSort = `${option.field}-${currentDir === 'asc' ? 'desc' : 'asc'}`;
                  } else {
                    // Activate with default direction
                    nextSort = `${option.field}-${option.defaultDir}`;
                  }

                  const baseHref = useFilter && useFilter !== "all" ? `?use=${useFilter}` : "";
                  const sortParam = nextSort ? `${baseHref ? "&" : "?"}sort=${nextSort}` : "";

                  return (
                    <Link
                      key={option.field || "featured"}
                      href={`/products${baseHref}${sortParam}`}
                      scroll={false}
                    >
                      <button
                        className={cn(
                          "px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium transition-all inline-flex items-center gap-0.5",
                          isActive
                            ? "bg-white shadow-sm text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {option.label}
                        {option.field && (
                          <span className={cn("ml-0.5 w-3 text-center", isActive ? "text-primary" : "invisible")}>
                            {isActive && currentDir === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </button>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Client wrapper handles mobile filter button, sort, and grid */}
      <ProductsClientWrapper
        products={filteredProducts}
        useFilter={useFilter}
        sort={sort}
      />

      {/* Calculator CTA */}
      <div className="container px-4 sm:px-6 pb-6 sm:pb-8 md:pb-12">
        <section className="mt-12 sm:mt-16 md:mt-20 pt-12 sm:pt-16 md:pt-20 border-t">
          <div className="text-center">
            <h2 className="max-w-3xl mx-auto">
              Not sure how much turf you need?
            </h2>
            <p className="mt-6 text-body-lg text-muted-foreground max-w-xl mx-auto">
              Our smart calculator does the math for you. Get an instant estimate
              with exact materials and pricing.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="btn-premium text-lg px-8 h-14" asChild>
                <Link href="/calculator">
                  Try the Calculator
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
