import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Star, Truck, Shield, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { formatPrice, cn } from "@/lib/utils";
import { PRODUCTS, type Product, type ProductUse } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop Artificial Grass | Premium Turf Collection",
  description:
    "Browse our complete collection of professional-grade artificial turf. Free shipping, 16-year warranty, direct from manufacturer pricing.",
};

const USE_FILTERS: { label: string; value: ProductUse | "all"; icon?: string }[] = [
  { label: "All Products", value: "all" },
  { label: "Landscape", value: "landscape" },
  { label: "Pet Turf", value: "pet" },
  { label: "Putting Green", value: "putting" },
  { label: "Playground", value: "playground" },
  { label: "Commercial", value: "commercial" },
];

const SORT_OPTIONS = [
  { label: "Featured", value: "" },
  { label: "Price: Low", value: "price-asc" },
  { label: "Price: High", value: "price-desc" },
  { label: "Weight", value: "weight" },
];

interface ProductsPageProps {
  searchParams: Promise<{ use?: string; sort?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { use: useFilter, sort } = await searchParams;

  // Filter products
  let filteredProducts = PRODUCTS;
  if (useFilter && useFilter !== "all") {
    filteredProducts = PRODUCTS.filter((p) =>
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
  } else if (sort === "weight") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => b.weight - a.weight
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
        ? PRODUCTS.length
        : PRODUCTS.filter((p) => p.uses.includes(f.value as ProductUse)).length,
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
        {useFilter === "commercial" && (
          <>
            <Image
              src="/commercial.hero.webp"
              alt="Commercial turf"
              fill
              className="object-cover object-[center_25%]"
              priority
            />
            <div className="absolute inset-0 bg-slate-900/60" />
          </>
        )}
        {useFilter === "playground" && (
          <>
            <Image
              src="/playground.hero.webp"
              alt="Playground turf"
              fill
              className="object-cover object-[center_40%]"
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
            <span className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold text-emerald-400 shadow-lg mb-4 sm:mb-6">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Direct from Manufacturer
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight drop-shadow-lg">
              {currentFilter?.value === "all" ? "Shop All Turf" : currentFilter?.label}
            </h1>

            <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-white/90 max-w-xl drop-shadow-md">
              Professional-grade artificial grass with free shipping, 16-year
              warranty, and contractor-direct pricing.
            </p>

            {/* Trust indicators */}
            <div className="flex flex-wrap gap-2 sm:gap-4 mt-6 sm:mt-8">
              <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/15 backdrop-blur-sm">
                <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                <span className="text-xs sm:text-sm font-medium text-white">Free Shipping</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/15 backdrop-blur-sm">
                <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                <span className="text-xs sm:text-sm font-medium text-white">16-Year Warranty</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/15 backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                <span className="text-xs sm:text-sm font-medium text-white">PFAS-Free</span>
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
            <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
              <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0 hidden sm:block" />
              {filterCounts.map((filter) => (
                <Link
                  key={filter.value}
                  href={`/products${filter.value !== "all" ? `?use=${filter.value}` : ""}${sort ? `${filter.value !== "all" ? "&" : "?"}sort=${sort}` : ""}`}
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

            {/* Sort */}
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-xs sm:text-sm text-muted-foreground">Sort:</span>
              <div className="flex gap-0.5 sm:gap-1 bg-muted rounded-full p-0.5 sm:p-1">
                {SORT_OPTIONS.map((option) => (
                  <Link
                    key={option.value}
                    href={`/products${useFilter && useFilter !== "all" ? `?use=${useFilter}` : ""}${option.value ? `${useFilter && useFilter !== "all" ? "&" : "?"}sort=${option.value}` : ""}`}
                  >
                    <button
                      className={cn(
                        "px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-medium transition-all",
                        (sort === option.value || (!sort && !option.value))
                          ? "bg-white shadow-sm text-foreground"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {option.label}
                    </button>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container px-4 sm:px-6 py-6 sm:py-8 md:py-12">
        {/* Results count */}
        <p className="text-xs sm:text-sm text-muted-foreground mb-6 sm:mb-8">
          Showing {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}
        </p>

        {/* Product Grid */}
        <div className="grid gap-4 sm:gap-6 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {/* Empty state */}
        {filteredProducts.length === 0 && (
          <div className="mt-12 sm:mt-16 text-center py-12 sm:py-16">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-muted flex items-center justify-center mb-4 sm:mb-6">
              <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold">No products found</h3>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              Try adjusting your filters or browse all products.
            </p>
            <Button asChild className="mt-4 sm:mt-6">
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
        )}

        {/* Calculator CTA */}
        <section className="mt-12 sm:mt-16 md:mt-20">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 sm:p-8 md:p-12 lg:p-16">
            {/* Decorative - hidden on mobile */}
            <div className="hidden sm:block absolute top-0 right-0 w-96 h-96 bg-primary/30 rounded-full blur-[150px]" />
            <div className="hidden sm:block absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-[100px]" />

            <div className="relative text-center max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                Not sure how much turf you need?
              </h2>
              <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-white/70">
                Our smart calculator does the math for you. Get an instant estimate
                with exact materials and pricing.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
                <Button variant="premium" size="lg" className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8" asChild>
                  <Link href="/calculator">
                    Try the Calculator
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-8 border-white/20 text-white hover:bg-white/10 rounded-xl" asChild>
                  <Link href="/samples">Get Free Samples</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const mainImage = product.images[0];

  return (
    <Link href={`/products/${product.handle}`} className="group">
      <div
        className="h-full rounded-xl sm:rounded-2xl border border-border/50 bg-white overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-1 hover:border-primary/30"
        style={{ animationDelay: `${index * 50}ms` }}
      >
        {/* Image */}
        <div className="relative aspect-[4/3] bg-gradient-to-br from-emerald-100 via-green-100 to-emerald-200 overflow-hidden">
          {mainImage && (
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
            />
          )}

          {/* Gradient overlay - hidden on mobile */}
          <div className="hidden sm:block absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badge */}
          {product.badge && (
            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10">
              <span className={cn(
                "inline-flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold text-white shadow-lg",
                product.badgeColor || "bg-primary"
              )}>
                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                {product.badge}
              </span>
            </div>
          )}

          {/* Quick view on hover - hidden on mobile */}
          <div className="hidden sm:flex absolute inset-0 items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <span className="px-4 py-2 bg-white/95 backdrop-blur-sm rounded-full text-sm font-medium shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
              View Details
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4 md:p-5">
          {/* Category tag */}
          <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-primary">
            {product.category === "pet" ? "Pet Turf" : product.category === "putting" ? "Putting Green" : "Landscape"}
          </span>

          {/* Title */}
          <h3 className="mt-0.5 sm:mt-1 font-bold text-sm sm:text-base md:text-lg group-hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Description - hidden on mobile */}
          <p className="hidden sm:block mt-2 text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>

          {/* Specs */}
          <div className="mt-2 sm:mt-4 flex flex-wrap gap-1 sm:gap-2">
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg bg-muted text-[10px] sm:text-xs font-medium">
              {product.weight}oz
            </span>
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg bg-muted text-[10px] sm:text-xs font-medium">
              {product.pileHeight}&quot;
            </span>
            <span className="hidden sm:inline px-2 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-xs font-medium">
              {product.warranty}
            </span>
          </div>

          {/* Price */}
          <div className="mt-2 sm:mt-4 pt-2 sm:pt-4 border-t flex items-end justify-between">
            <div>
              <span className="text-lg sm:text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-600">
                {formatPrice(product.priceCents)}
              </span>
              <span className="text-[10px] sm:text-sm text-muted-foreground">/sq ft</span>
            </div>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </div>
    </Link>
  );
}
