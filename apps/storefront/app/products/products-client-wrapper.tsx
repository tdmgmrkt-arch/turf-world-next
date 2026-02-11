"use client";

import { useState } from "react";
import Link from "next/link";
import { Filter as LucideFilter } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Product } from "@/lib/products";
import {
  ProductsGridWithMobileFilters,
  type TechnicalFilters,
} from "./products-grid-with-mobile-filters";

const Filter = LucideFilter as any;

const SORT_FIELDS = [
  { label: "Featured", field: "" },
  { label: "Price", field: "price", defaultDir: "asc" as const },
  { label: "Weight", field: "weight", defaultDir: "desc" as const },
  { label: "Height", field: "height", defaultDir: "desc" as const },
];

interface ProductsClientWrapperProps {
  products: Product[];
  useFilter?: string;
  sort?: string;
}

export function ProductsClientWrapper({ products, useFilter, sort }: ProductsClientWrapperProps) {
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [technicalFilters, setTechnicalFilters] = useState<TechnicalFilters>({
    priceRanges: [],
    pileHeights: [],
    faceWeights: [],
  });

  const hasActiveFilters =
    technicalFilters.priceRanges.length > 0 ||
    technicalFilters.pileHeights.length > 0 ||
    technicalFilters.faceWeights.length > 0;

  const activeFilterCount =
    technicalFilters.priceRanges.length +
    technicalFilters.pileHeights.length +
    technicalFilters.faceWeights.length;

  return (
    <>
      {/* Mobile-only filter button - appears before sort */}
      <div className="sm:hidden container px-4 sm:px-6">
        <button
          onClick={() => setShowMobileFilters(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-border bg-background hover:bg-muted transition-colors"
        >
          <Filter className="w-4 h-4" />
          <span className="font-medium text-sm">Filters</span>
          {hasActiveFilters && (
            <span className="ml-1 px-2 py-0.5 rounded-full bg-primary text-white text-xs font-medium">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Sort Section - now part of sticky bar */}
      <div className="sm:hidden container px-4 sm:px-6 mt-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Sort:</span>
          <div className="flex gap-0.5 bg-muted rounded-full p-0.5 flex-1">
            {SORT_FIELDS.map((option) => {
              const currentField = sort ? sort.replace(/-asc$|-desc$/, '') : '';
              const currentDir = sort?.endsWith('-asc') ? 'asc' : sort?.endsWith('-desc') ? 'desc' : null;
              const isActive = option.field === '' ? !sort : currentField === option.field;

              let nextSort = '';
              if (option.field === '') {
                nextSort = '';
              } else if (isActive) {
                nextSort = `${option.field}-${currentDir === 'asc' ? 'desc' : 'asc'}`;
              } else {
                nextSort = `${option.field}-${option.defaultDir}`;
              }

              const baseHref = useFilter && useFilter !== "all" ? `?use=${useFilter}` : "";
              const sortParam = nextSort ? `${baseHref ? "&" : "?"}sort=${nextSort}` : "";

              return (
                <Link
                  key={option.field || "featured"}
                  href={`/products${baseHref}${sortParam}`}
                  className="flex-1"
                  scroll={false}
                >
                  <button
                    className={cn(
                      "w-full px-2 py-1 rounded-full text-[10px] font-medium transition-all inline-flex items-center justify-center gap-0.5",
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

      {/* Product Grid with Filters */}
      <div className="container px-4 sm:px-6 py-6 sm:py-8 md:py-12">
        <ProductsGridWithMobileFilters
          products={products}
          showMobileFilters={showMobileFilters}
          setShowMobileFilters={setShowMobileFilters}
          technicalFilters={technicalFilters}
          setTechnicalFilters={setTechnicalFilters}
        />
      </div>
    </>
  );
}
