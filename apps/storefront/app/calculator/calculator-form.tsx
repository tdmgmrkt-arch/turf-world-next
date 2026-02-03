"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTurfLogic } from "@/hooks/use-turf-logic";

// Cast to work around React 19 JSX type incompatibility with Radix UI / Shadcn / Next.js
const SafeTooltipProvider = TooltipProvider as any;
const SafeTooltip = Tooltip as any;
const SafeTooltipTrigger = TooltipTrigger as any;
const SafeTooltipContent = TooltipContent as any;
const SafeLabel = Label as any;
const SafeInput = Input as any;
const SafeSlider = Slider as any;
const SafeButton = Button as any;
const SafeImage = Image as any;
const SafeLink = Link as any;
import { formatPrice, cn } from "@/lib/utils";
import { PRODUCTS, getProductByHandle } from "@/lib/products";

// Calculator turf options derived from real products
const TURF_OPTIONS = [
  {
    id: "turf-world-63",
    productHandle: "turf-world-63",
    name: "Turf World 63",
    pricePerSqFtCents: 130,
    description: "Budget-friendly 63oz, 1.25\" pile",
    isPet: false,
    badge: "Budget Pick",
    color: "emerald",
  },
  {
    id: "turf-world-88",
    productHandle: "turf-world-88",
    name: "Turf World 88",
    pricePerSqFtCents: 179,
    description: "Best seller 88oz, 1.75\" pile",
    isPet: false,
    badge: "Best Seller",
    color: "emerald",
  },
  {
    id: "super-natural-96",
    productHandle: "super-natural-96",
    name: "Super Natural 96",
    pricePerSqFtCents: 209,
    description: "Ultra-realistic 96oz, 1.67\" pile",
    isPet: false,
    badge: "Most Realistic",
    color: "emerald",
  },
  {
    id: "olive-92-pet",
    productHandle: "olive-92-pet",
    name: "Olive 92 Pet",
    pricePerSqFtCents: 209,
    description: "Premium pet turf, 92oz, antimicrobial",
    isPet: true,
    badge: "Best for Dogs",
    color: "amber",
  },
  {
    id: "putting-green",
    productHandle: "putting-green",
    name: "Pro Putt Green",
    pricePerSqFtCents: 195,
    description: "Tournament quality, 0.71\" pile",
    isPet: false,
    badge: "Pro Grade",
    color: "blue",
  },
];

// Get other products not in the preset options
const OTHER_PRODUCTS = PRODUCTS.filter(
  (p) => !TURF_OPTIONS.some((t) => t.productHandle === p.handle)
);

export function CalculatorForm() {
  const [selectedTurf, setSelectedTurf] = useState(TURF_OPTIONS[1]); // Default to standard
  const [includeInfill, setIncludeInfill] = useState(true);
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  const {
    widthFeet,
    lengthFeet,
    setWidthFeet,
    setLengthFeet,
    squareFeet,
    estimate,
    totalPriceCents,
    cuts,
    rollsNeeded,
    totalCutSquareFeet,
  } = useTurfLogic({
    pricePerSqFtCents: selectedTurf.pricePerSqFtCents,
    isPetTurf: selectedTurf.isPet,
    includeInfill,
  });

  // Calculate additional costs
  const seamTapeCostCents = estimate.seaming.seamTapeFeet * 50; // ~$0.50/ft
  const infillCostCents = estimate.infill
    ? estimate.infill.bagsNeeded * 3995
    : 0; // $39.95/bag
  const adhesiveCostCents = estimate.seaming.seamCount > 0 ? 8995 : 0; // $89.95 per 5gal
  const grandTotalCents =
    totalPriceCents + seamTapeCostCents + infillCostCents + adhesiveCostCents;

  return (
    <SafeTooltipProvider>
      {/* Notification Banners - Compact pills on mobile, full banners on desktop */}
      {/* Mobile: Inline pills */}
      <div className="flex flex-wrap gap-1.5 mb-3 sm:hidden">
        {estimate.turf.wastePercentage > 10 && (
          <SafeTooltip>
            <SafeTooltipTrigger asChild>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1">
                <span className="text-amber-600">⚠️</span>
                <span className="text-[11px] font-semibold text-amber-800">
                  {estimate.turf.wastePercentage}% Overage
                </span>
              </div>
            </SafeTooltipTrigger>
            <SafeTooltipContent side="bottom" className="max-w-[200px] text-xs">
              Your {widthFeet}ft width requires {estimate.turf.rollsNeeded} roll{estimate.turf.rollsNeeded !== 1 ? "s" : ""} side by side
            </SafeTooltipContent>
          </SafeTooltip>
        )}

        {estimate.seaming.seamCount > 0 && (
          <SafeTooltip>
            <SafeTooltipTrigger asChild>
              <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1">
                <span className="text-blue-600">✂️</span>
                <span className="text-[11px] font-semibold text-blue-800">
                  {estimate.seaming.seamCount} Seam{estimate.seaming.seamCount !== 1 ? "s" : ""}
                </span>
              </div>
            </SafeTooltipTrigger>
            <SafeTooltipContent side="bottom" className="max-w-[200px] text-xs">
              Multiple turf pieces joined with seam tape
            </SafeTooltipContent>
          </SafeTooltip>
        )}

        {estimate.seaming.seamCount === 0 && (
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1">
            <span className="text-emerald-600">✓</span>
            <span className="text-[11px] font-semibold text-emerald-800">No Seams</span>
          </div>
        )}
      </div>

      {/* Desktop: Full banners */}
      <div className="hidden sm:block space-y-2 mb-6">
        {/* Material overage warning */}
        {estimate.turf.wastePercentage > 10 && (
          <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm">⚠️</span>
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-semibold text-amber-800 text-sm">
                {estimate.turf.wastePercentage}% Material Overage
              </span>
              <span className="text-amber-700 text-sm ml-2">
                Your {widthFeet}ft width requires {estimate.turf.rollsNeeded} roll{estimate.turf.rollsNeeded !== 1 ? "s" : ""} side by side.
              </span>
              {estimate.notes.find((n) => n.includes("Tip:")) && (
                <span className="text-amber-800 font-medium text-sm ml-2">
                  {estimate.notes.find((n) => n.includes("Tip:"))}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Seam required info */}
        {estimate.seaming.seamCount > 0 && (
          <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm">ℹ️</span>
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-semibold text-blue-800 text-sm">
                {estimate.seaming.seamCount} Seam{estimate.seaming.seamCount !== 1 ? "s" : ""} Required
              </span>
              <span className="text-blue-700 text-sm ml-2">
                Multiple turf pieces joined with seam tape. Seams are virtually invisible when installed correctly.
              </span>
            </div>
          </div>
        )}

        {/* No seams celebration */}
        {estimate.seaming.seamCount === 0 && (
          <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm">✓</span>
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-semibold text-emerald-800 text-sm">No Seams Needed!</span>
              <span className="text-emerald-700 text-sm ml-2">
                Your project fits within a single 15ft roll width.
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:gap-6 lg:gap-8 lg:grid-cols-2">
        {/* Left: Inputs */}
        <div className="space-y-4 sm:space-y-6">
          {/* Dimensions Card */}
          <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-white border border-border/50 shadow-lg transition-all duration-300 hover:shadow-xl">
            {/* Decorative gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3 mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-lg shadow-primary/20">
                  <span className="text-white text-sm sm:text-base">📐</span>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold">Project Dimensions</h3>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Enter your measurements below</p>
                </div>
              </div>

              <div className="space-y-2">
                {/* Width Input */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <SafeLabel htmlFor="width" className="flex items-center gap-1.5 text-xs font-medium">
                      Width
                      <SafeTooltip>
                        <SafeTooltipTrigger asChild>
                          <span className="w-3.5 h-3.5 rounded-full bg-muted flex items-center justify-center cursor-help text-[10px]">
                          +
                          </span>
                        </SafeTooltipTrigger>
                        <SafeTooltipContent className="rounded-xl">
                          <p>The shorter side of your project area</p>
                        </SafeTooltipContent>
                      </SafeTooltip>
                    </SafeLabel>
                    <span className="text-sm font-bold text-primary">{widthFeet} ft</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <SafeSlider
                      id="width"
                      min={5}
                      max={100}
                      step={1}
                      value={[widthFeet]}
                      onValueChange={([v]: number[]) => setWidthFeet(v)}
                      aria-label="Project width in feet"
                      className="flex-1"
                    />
                    <SafeInput
                      type="number"
                      min={1}
                      max={500}
                      value={widthFeet}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWidthFeet(Number(e.target.value))}
                      className="h-7 w-16 text-xs rounded border-border/50 focus:border-primary focus:ring-primary"
                      aria-label="Project width input"
                    />
                  </div>
                </div>

                {/* Length Input */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <SafeLabel htmlFor="length" className="flex items-center gap-1.5 text-xs font-medium">
                      Length
                      <SafeTooltip>
                        <SafeTooltipTrigger asChild>
                          <span className="w-3.5 h-3.5 rounded-full bg-muted flex items-center justify-center cursor-help text-[10px]">
                            +
                          </span>
                        </SafeTooltipTrigger>
                        <SafeTooltipContent className="rounded-xl">
                          <p>The longer side of your project area</p>
                        </SafeTooltipContent>
                      </SafeTooltip>
                    </SafeLabel>
                    <span className="text-sm font-bold text-primary">{lengthFeet} ft</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <SafeSlider
                      id="length"
                      min={5}
                      max={150}
                      step={1}
                      value={[lengthFeet]}
                      onValueChange={([v]: number[]) => setLengthFeet(v)}
                      aria-label="Project length in feet"
                      className="flex-1"
                    />
                    <SafeInput
                      type="number"
                      min={1}
                      max={500}
                      value={lengthFeet}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLengthFeet(Number(e.target.value))}
                      className="h-7 w-16 text-xs rounded border-border/50 focus:border-primary focus:ring-primary"
                      aria-label="Project length input"
                    />
                  </div>
                </div>

                {/* Square footage display */}
                <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-primary to-emerald-600 p-2">
                  <p className="text-center">
                    <span className="text-xl font-bold text-white">{squareFeet.toLocaleString()}</span>
                    <span className="text-white/80 text-xs font-medium ml-1">sq ft</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Turf Selection */}
          <div className="group relative rounded-xl sm:rounded-2xl bg-white border border-border/50 shadow-lg transition-all duration-300 hover:shadow-xl">

            <div className="relative p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3 mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                  <span className="text-white text-sm sm:text-base">🌿</span>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold">Select Your Turf</h3>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Choose the perfect option for your project</p>
                </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                {TURF_OPTIONS.map((turf) => {
                  const product = getProductByHandle(turf.productHandle);
                  return (
                    <button
                      key={turf.id}
                      onClick={() => setSelectedTurf(turf)}
                      className={cn(
                        "w-full rounded-lg border-2 p-2.5 sm:p-2 text-left transition-all duration-200 active:scale-[0.98]",
                        selectedTurf.id === turf.id
                          ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                          : "border-border/50 hover:border-primary/30 hover:bg-muted/50"
                      )}
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        {/* Product thumbnail */}
                        {product?.images[0] && (
                          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded overflow-hidden flex-shrink-0">
                            <SafeImage
                              src={product.images[0]}
                              alt={turf.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
                            <div className={cn(
                              "w-3 h-3 rounded-full border-2 transition-all duration-200 flex items-center justify-center flex-shrink-0",
                              selectedTurf.id === turf.id
                                ? "border-primary bg-primary"
                                : "border-muted-foreground/30"
                            )}>
                              {selectedTurf.id === turf.id && (
                                <div className="w-1 h-1 rounded-full bg-white" />
                              )}
                            </div>
                            <span className="text-xs sm:text-sm font-semibold truncate">{turf.name}</span>
                            {turf.badge && (
                              <span className={cn(
                                "text-[8px] sm:text-[9px] font-bold px-1 sm:px-1.5 py-0.5 rounded-full uppercase tracking-wide whitespace-nowrap",
                                turf.color === "amber" && "bg-amber-100 text-amber-700",
                                turf.color === "emerald" && "bg-emerald-100 text-emerald-700",
                                turf.color === "blue" && "bg-blue-100 text-blue-700",
                              )}>
                                {turf.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[9px] sm:text-[10px] text-muted-foreground pl-[18px] hidden sm:block">
                            {turf.description}
                          </p>
                        </div>
                        <span className={cn(
                          "text-[10px] sm:text-xs font-bold whitespace-nowrap",
                          selectedTurf.id === turf.id ? "text-primary" : "text-muted-foreground"
                        )}>
                          {formatPrice(turf.pricePerSqFtCents)}/sf
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Other Products - Card Style Dropdown */}
              {OTHER_PRODUCTS.length > 0 && (
                <div className="relative mt-1.5 sm:mt-2">
                  {/* Check if a non-preset product is selected */}
                  {(() => {
                    const isOtherSelected = !TURF_OPTIONS.some(t => t.id === selectedTurf.id);
                    const selectedProduct = isOtherSelected
                      ? OTHER_PRODUCTS.find(p => p.handle === selectedTurf.id)
                      : null;

                    return (
                      <button
                        type="button"
                        onClick={() => setShowMoreOptions(!showMoreOptions)}
                        className={cn(
                          "w-full rounded-lg border-2 p-2.5 sm:p-2 text-left transition-all duration-200 active:scale-[0.98]",
                          isOtherSelected
                            ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                            : "border-dashed border-border/50 hover:border-primary/30 hover:bg-muted/50"
                        )}
                      >
                        <div className="flex items-center gap-2 sm:gap-3">
                          {/* Show selected product or placeholder */}
                          {isOtherSelected && selectedProduct ? (
                            <>
                              {selectedProduct.images[0] && (
                                <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded overflow-hidden flex-shrink-0">
                                  <SafeImage
                                    src={selectedProduct.images[0]}
                                    alt={selectedProduct.name}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1 sm:gap-1.5">
                                  <div className="w-3 h-3 rounded-full border-2 border-primary bg-primary flex items-center justify-center flex-shrink-0">
                                    <div className="w-1 h-1 rounded-full bg-white" />
                                  </div>
                                  <span className="text-xs sm:text-sm font-semibold truncate">{selectedProduct.name}</span>
                                  <span className={cn(
                                    "text-[10px] transition-transform flex-shrink-0",
                                    showMoreOptions && "rotate-180"
                                  )}>▼</span>
                                </div>
                                <p className="text-[9px] sm:text-[10px] text-muted-foreground pl-[18px] hidden sm:block">
                                  {selectedProduct.weight}oz, {selectedProduct.pileHeight}" pile
                                </p>
                              </div>
                              <span className="text-[10px] sm:text-xs font-bold text-primary whitespace-nowrap">
                                {formatPrice(selectedProduct.priceCents)}/sf
                              </span>
                            </>
                          ) : (
                            <>
                              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded bg-muted/50 border-2 border-dashed border-border/50 flex items-center justify-center flex-shrink-0">
                                <span className="text-muted-foreground/50">📦</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1 sm:gap-1.5">
                                  <div className="w-3 h-3 rounded-full border-2 border-muted-foreground/30 flex-shrink-0" />
                                  <span className="text-xs sm:text-sm font-semibold text-muted-foreground">Other Turf Options</span>
                                  <span className={cn(
                                    "text-[10px] text-muted-foreground transition-transform flex-shrink-0",
                                    showMoreOptions && "rotate-180"
                                  )}>▼</span>
                                </div>
                                <p className="text-[9px] sm:text-[10px] text-muted-foreground pl-[18px] hidden sm:block">
                                  {OTHER_PRODUCTS.length} more products available
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      </button>
                    );
                  })()}

                  {/* Dropdown list */}
                  {showMoreOptions && (
                    <div className="absolute z-10 left-0 right-0 mt-1 max-h-64 sm:max-h-80 overflow-y-auto rounded-lg border border-border/50 bg-white shadow-xl">
                      {OTHER_PRODUCTS.map((product) => {
                        const isSelected = selectedTurf.id === product.handle;
                        return (
                          <button
                            key={product.handle}
                            onClick={() => {
                              setSelectedTurf({
                                id: product.handle,
                                productHandle: product.handle,
                                name: product.name,
                                pricePerSqFtCents: product.priceCents,
                                description: `${product.weight}oz, ${product.pileHeight}" pile`,
                                isPet: product.category === "pet",
                                badge: product.badge || "",
                                color: "emerald",
                              });
                              setShowMoreOptions(false);
                            }}
                            className={cn(
                              "w-full flex items-center gap-2 p-2.5 sm:p-2 text-left transition-colors border-b border-border/30 last:border-b-0 active:bg-muted",
                              isSelected
                                ? "bg-primary/10"
                                : "hover:bg-muted/50"
                            )}
                          >
                            {product.images[0] && (
                              <div className="relative w-9 h-9 sm:w-8 sm:h-8 rounded overflow-hidden flex-shrink-0">
                                <SafeImage
                                  src={product.images[0]}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className={cn(
                                "font-medium text-xs truncate",
                                isSelected && "text-primary"
                              )}>
                                {product.name}
                              </p>
                              <p className="text-[9px] sm:text-[10px] text-muted-foreground">
                                {product.weight}oz • {product.pileHeight}" pile
                              </p>
                            </div>
                            <span className={cn(
                              "text-[10px] sm:text-xs font-bold",
                              isSelected ? "text-primary" : "text-muted-foreground"
                            )}>
                              {formatPrice(product.priceCents)}/sf
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Infill toggle */}
              <div className="mt-2 sm:mt-3 p-2.5 sm:p-2 rounded-lg bg-muted/50 border border-border/50">
                <label className="flex items-center gap-2 cursor-pointer active:opacity-70">
                  <input
                    type="checkbox"
                    id="include-infill"
                    checked={includeInfill}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIncludeInfill(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className={cn(
                    "w-5 h-5 sm:w-4 sm:h-4 rounded border-2 transition-all duration-200 flex items-center justify-center flex-shrink-0",
                    includeInfill
                      ? "bg-primary border-primary"
                      : "border-muted-foreground/30"
                  )}>
                    {includeInfill && (
                      <span className="text-white text-[10px]">✓</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-xs">Include infill in estimate</span>
                    {selectedTurf.isPet && (
                      <span className="text-amber-600 text-[10px] font-medium ml-1">(Recommended)</span>
                    )}
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Results */}
        <div className="space-y-4 sm:space-y-6">
          {/* Cuts Breakdown Card */}
          <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-white border border-border/50 shadow-lg">
            <div className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3 mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center">
                  <span className="text-white text-sm sm:text-base">✂️</span>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold">Your Cuts</h3>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">
                    {cuts.length} cut{cuts.length !== 1 ? "s" : ""} from {rollsNeeded} roll{rollsNeeded !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {/* Cuts list */}
              <div className="space-y-1 sm:space-y-1.5 mb-3">
                {cuts.map((cut, index) => (
                  <div
                    key={cut.id}
                    className="flex items-center justify-between p-1.5 sm:p-2 rounded-lg bg-muted/50 border border-border/50"
                  >
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <span className="text-[10px] sm:text-xs font-bold text-muted-foreground w-4 sm:w-5">
                        #{index + 1}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold">
                        15′ × {cut.length}′
                      </span>
                      <span className="text-muted-foreground text-[10px] sm:text-xs">
                        ({cut.squareFeet.toLocaleString()} sf)
                      </span>
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-primary">
                      {formatPrice(cut.squareFeet * selectedTurf.pricePerSqFtCents)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Summary stats */}
              <div className="space-y-1 pt-2 border-t text-[10px] sm:text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">You Need</span>
                  <span className="font-semibold">{squareFeet.toLocaleString()} sq ft</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">You Get</span>
                  <span className="font-semibold text-primary">{totalCutSquareFeet.toLocaleString()} sq ft</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rolls Required</span>
                  <span className="font-semibold">{rollsNeeded} roll{rollsNeeded !== 1 ? "s" : ""}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Materials Breakdown */}
          <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-4 sm:p-6 shadow-2xl">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 sm:w-40 h-32 sm:h-40 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-24 sm:w-32 h-24 sm:h-32 bg-emerald-500/20 rounded-full blur-3xl" />

            <div className="relative">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <span className="text-white text-lg sm:text-xl">📦</span>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">Your Materials List</h3>
                  <p className="text-xs sm:text-sm text-white/60">Everything you need for your project</p>
                </div>
              </div>

              <div className="space-y-2">
                {/* Turf */}
                <MaterialRow
                  emoji="📦"
                  title={selectedTurf.name}
                  subtitle={`${cuts.length} cut${cuts.length !== 1 ? "s" : ""} from ${rollsNeeded} roll${rollsNeeded !== 1 ? "s" : ""} (${totalCutSquareFeet.toLocaleString()} sq ft)`}
                  price={totalPriceCents}
                  highlight
                />

                {/* Seam Tape */}
                {estimate.seaming.seamCount > 0 && (
                  <MaterialRow
                    emoji="✂️"
                    title="Seam Tape"
                    subtitle={`${estimate.seaming.seamTapeFeet} linear ft for ${estimate.seaming.seamCount} seam${estimate.seaming.seamCount !== 1 ? "s" : ""}`}
                    price={seamTapeCostCents}
                  />
                )}

                {/* Adhesive */}
                {estimate.seaming.seamCount > 0 && (
                  <MaterialRow
                    emoji="🧴"
                    title="Seam Adhesive"
                    subtitle="5-gallon bucket"
                    price={adhesiveCostCents}
                  />
                )}

                {/* Infill */}
                {estimate.infill && includeInfill && (
                  <MaterialRow
                    emoji="🪨"
                    title="ZeoFill Infill"
                    subtitle={`${estimate.infill.bagsNeeded} bag${estimate.infill.bagsNeeded !== 1 ? "s" : ""} (${estimate.infill.poundsNeeded} lbs)`}
                    price={infillCostCents}
                  />
                )}

                {/* Divider & Total */}
                <div className="border-t border-white/10 pt-3 sm:pt-4 mt-3 sm:mt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white/80 font-medium text-sm sm:text-base">Estimated Total</span>
                    <div className="text-right">
                      <span className="text-2xl sm:text-3xl font-bold text-white">{formatPrice(grandTotalCents)}</span>
                    </div>
                  </div>
                  <p className="mt-1.5 sm:mt-2 text-[10px] sm:text-xs text-white/40">
                    Excludes shipping & tax. Final price calculated at checkout.
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-2 pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-white/10">
                  <SafeButton size="lg" variant="premium" className="w-full h-11 sm:h-12 text-sm sm:text-base" asChild>
                    <SafeLink href={`/products/${selectedTurf.productHandle}`}>
                      Shop {selectedTurf.name} →
                    </SafeLink>
                  </SafeButton>
                  <SafeButton size="lg" variant="ghost" className="w-full h-9 sm:h-10 text-xs sm:text-sm text-white/70 bg-white/5 border border-white/10 hover:text-white hover:bg-white/10" asChild>
                    <SafeLink href="/samples">
                      ✨ Order Free Samples First
                    </SafeLink>
                  </SafeButton>
                </div>

                {/* Trust indicators */}
                <div className="flex items-center justify-center gap-3 sm:gap-4 pt-3 sm:pt-4 mt-2">
                  <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-[11px] text-white/50">
                    <span className="text-primary">🛡️</span>
                    <span>16-Year Warranty</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-[11px] text-white/50">
                    <span className="text-amber-500">⭐</span>
                    <span>4.9/5 Rating</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SafeTooltipProvider>
  );
}

function MaterialRow({
  emoji,
  title,
  subtitle,
  price,
  highlight = false,
}: {
  emoji: string;
  title: string;
  subtitle: string;
  price: number;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg p-1.5 sm:p-2 transition-all duration-200",
        highlight
          ? "bg-gradient-to-r from-primary/20 to-emerald-500/20 border border-primary/30"
          : "bg-white/5 border border-white/10"
      )}
    >
      <div
        className={cn(
          "flex h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0 items-center justify-center rounded-lg",
          highlight ? "bg-primary text-white" : "bg-white/10 text-white/60"
        )}
      >
        <span className="text-sm">{emoji}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn(
          "text-xs sm:text-sm font-semibold truncate",
          highlight ? "text-white" : "text-white/80"
        )}>{title}</p>
        <p className="text-[9px] sm:text-[10px] text-white/50 truncate">{subtitle}</p>
      </div>
      <p className={cn(
        "font-bold whitespace-nowrap text-xs sm:text-sm",
        highlight ? "text-white" : "text-white/80"
      )}>{formatPrice(price)}</p>
    </div>
  );
}
