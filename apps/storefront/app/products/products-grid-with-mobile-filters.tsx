"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Sparkles as LucideSparkles,
  X as LucideX,
} from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";
import type { Product } from "@/lib/products";

// Cast Lucide icons
const Sparkles = LucideSparkles as any;
const X = LucideX as any;

const PRICE_RANGES = [
  { label: "Under $1.50", value: "0-150" },
  { label: "$1.50 - $2.00", value: "150-200" },
  { label: "$2.00 - $2.50", value: "200-250" },
  { label: "$2.50+", value: "250-999" },
];

const PILE_HEIGHTS = [
  { label: '1.25"', value: 1.25 },
  { label: '1.5"', value: 1.5 },
  { label: '1.75"', value: 1.75 },
  { label: '2.0"', value: 2.0 },
];

const FACE_WEIGHTS = [
  { label: "60-70 oz", value: "60-70" },
  { label: "70-80 oz", value: "70-80" },
  { label: "80-90 oz", value: "80-90" },
  { label: "90-100 oz", value: "90-100" },
  { label: "100+ oz", value: "100-999" },
];

export interface TechnicalFilters {
  priceRanges: string[];
  pileHeights: number[];
  faceWeights: string[];
}

interface ProductsGridProps {
  products: Product[];
  showMobileFilters: boolean;
  setShowMobileFilters: (show: boolean) => void;
  technicalFilters: TechnicalFilters;
  setTechnicalFilters: React.Dispatch<React.SetStateAction<TechnicalFilters>>;
}

export function ProductsGridWithMobileFilters({
  products,
  showMobileFilters,
  setShowMobileFilters,
  technicalFilters,
  setTechnicalFilters,
}: ProductsGridProps) {

  // Apply technical filters
  const filteredProducts = products.filter((product) => {
    // Price filter
    if (technicalFilters.priceRanges.length > 0) {
      const matchesPrice = technicalFilters.priceRanges.some((range) => {
        const [min, max] = range.split("-").map(Number);
        return product.priceCents >= min && product.priceCents <= max;
      });
      if (!matchesPrice) return false;
    }

    // Pile height filter
    if (technicalFilters.pileHeights.length > 0) {
      if (!technicalFilters.pileHeights.includes(product.pileHeight)) {
        return false;
      }
    }

    // Face weight filter
    if (technicalFilters.faceWeights.length > 0) {
      const matchesWeight = technicalFilters.faceWeights.some((range) => {
        const [min, max] = range.split("-").map(Number);
        return product.weight >= min && product.weight <= max;
      });
      if (!matchesWeight) return false;
    }

    return true;
  });

  const hasActiveFilters =
    technicalFilters.priceRanges.length > 0 ||
    technicalFilters.pileHeights.length > 0 ||
    technicalFilters.faceWeights.length > 0;

  const clearAllFilters = () => {
    setTechnicalFilters({
      priceRanges: [],
      pileHeights: [],
      faceWeights: [],
    });
  };

  const togglePriceRange = (value: string) => {
    setTechnicalFilters((prev) => ({
      ...prev,
      priceRanges: prev.priceRanges.includes(value)
        ? prev.priceRanges.filter((v) => v !== value)
        : [...prev.priceRanges, value],
    }));
  };

  const togglePileHeight = (value: number) => {
    setTechnicalFilters((prev) => ({
      ...prev,
      pileHeights: prev.pileHeights.includes(value)
        ? prev.pileHeights.filter((v) => v !== value)
        : [...prev.pileHeights, value],
    }));
  };

  const toggleFaceWeight = (value: string) => {
    setTechnicalFilters((prev) => ({
      ...prev,
      faceWeights: prev.faceWeights.includes(value)
        ? prev.faceWeights.filter((v) => v !== value)
        : [...prev.faceWeights, value],
    }));
  };

  return (
    <>
      {/* Results count */}
      <p className="text-xs sm:text-sm text-muted-foreground mb-6 sm:mb-8">
        Showing {filteredProducts.length}{" "}
        {filteredProducts.length === 1 ? "product" : "products"}
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
          <button
            onClick={clearAllFilters}
            className="mt-4 sm:mt-6 px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}

      {/* Mobile Filter Overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 sm:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowMobileFilters(false)}
          />

          {/* Panel */}
          <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-background shadow-2xl overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b bg-background">
              <h2 className="text-lg font-bold">Filters</h2>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-6">
              {/* Clear button */}
              {hasActiveFilters && (
                <button
                  onClick={() => {
                    clearAllFilters();
                    setShowMobileFilters(false);
                  }}
                  className="w-full py-2 px-4 rounded-lg border border-border hover:bg-muted transition-colors text-sm font-medium"
                >
                  Clear All Filters
                </button>
              )}

              {/* Filters */}
              <div className="space-y-6">
                {/* Price */}
                <div>
                  <h3 className="font-semibold mb-3">Price</h3>
                  <div className="space-y-2">
                    {PRICE_RANGES.map((range) => (
                      <label key={range.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={technicalFilters.priceRanges.includes(range.value)}
                          onChange={() => togglePriceRange(range.value)}
                          className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className="text-sm">{range.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Pile Height */}
                <div>
                  <h3 className="font-semibold mb-3">Pile Height</h3>
                  <div className="space-y-2">
                    {PILE_HEIGHTS.map((height) => (
                      <label key={height.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={technicalFilters.pileHeights.includes(height.value)}
                          onChange={() => togglePileHeight(height.value)}
                          className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className="text-sm">{height.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Face Weight */}
                <div>
                  <h3 className="font-semibold mb-3">Face Weight</h3>
                  <div className="space-y-2">
                    {FACE_WEIGHTS.map((weight) => (
                      <label key={weight.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={technicalFilters.faceWeights.includes(weight.value)}
                          onChange={() => toggleFaceWeight(weight.value)}
                          className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className="text-sm">{weight.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 p-4 border-t bg-background">
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full py-3 px-4 rounded-lg bg-primary text-white font-medium hover:bg-primary/90 transition-colors"
              >
                Show {filteredProducts.length} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const mainImage = product.images[0];

  return (
    <Link href={`/products/${product.handle}`} className="group">
      <div
        className="h-full rounded-2xl sm:rounded-3xl border border-border/50 bg-white overflow-hidden transition-all duration-500 hover:shadow-xl hover:-translate-y-1 hover:border-primary/30 flex flex-col"
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
              <span
                className={cn(
                  "inline-flex items-center gap-1 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold text-white shadow-lg",
                  product.badgeColor || "bg-primary"
                )}
              >
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
        <div className="p-4 sm:p-5 md:p-6 flex flex-col flex-1">
          {/* Category tag */}
          <span className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-primary">
            {product.category === "pet"
              ? "Pet Turf"
              : product.category === "putting"
              ? "Putting Green"
              : "Landscape"}
          </span>

          {/* Title */}
          <h3 className="mt-1.5 sm:mt-2 font-bold text-sm sm:text-base md:text-lg group-hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Description - hidden on mobile, fixed height on desktop */}
          <p className="hidden sm:block mt-3 text-sm text-muted-foreground line-clamp-2 h-10">
            {product.description}
          </p>

          {/* Specs */}
          <div className="mt-4 sm:mt-5 flex flex-wrap gap-1 sm:gap-2">
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

          {/* Price - pushed to bottom with mt-auto */}
          <div className="mt-auto pt-4 sm:pt-5 border-t flex items-end justify-between">
            <div>
              {/* Show compare-at price if promotion active */}
              {product.comparePriceCents && (
                <div className="mb-0.5">
                  <span className="text-[10px] sm:text-xs text-muted-foreground line-through">
                    {formatPrice(product.comparePriceCents)}
                  </span>
                  <span className="ml-1.5 text-[9px] sm:text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                    {Math.round(
                      (1 - product.priceCents / product.comparePriceCents) * 100
                    )}
                    % OFF
                  </span>
                </div>
              )}
              <span
                className={cn(
                  "text-lg sm:text-xl md:text-2xl font-bold",
                  product.comparePriceCents
                    ? "text-rose-600"
                    : "text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-600"
                )}
              >
                {formatPrice(product.priceCents)}
              </span>
              <span className="text-[10px] sm:text-sm text-muted-foreground">
                /sq ft
              </span>
            </div>
            {/* In Stock badge */}
            <div className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full bg-emerald-50 border border-emerald-200">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] sm:text-xs font-medium text-emerald-700">
                In Stock
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
