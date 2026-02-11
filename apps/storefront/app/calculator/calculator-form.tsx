"use client";

import React, { useState, useEffect, useRef } from "react";
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
import { Scissors as LucideScissors, HelpCircle as LucideHelpCircle, X as LucideX } from "lucide-react";
import { useTurfLogic } from "@/hooks/use-turf-logic";

// Cast Lucide icons to work around React 19 JSX type incompatibility
const Scissors = LucideScissors as any;
const HelpCircle = LucideHelpCircle as any;
const X = LucideX as any;

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
import { useTurfOptions, type TurfOption } from "@/hooks/use-turf-options";

export function CalculatorForm() {
  const { presetOptions, otherProducts, accessories, getProduct } = useTurfOptions();

  const [selectedTurf, setSelectedTurf] = useState<TurfOption | null>(null);
  const [includeInfill, setIncludeInfill] = useState(true);
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  // Ref for dropdown container to handle click-outside
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Set default selection after presets load
  useEffect(() => {
    if (!selectedTurf && presetOptions.length > 0) {
      // Default to 2nd option (was TURF_OPTIONS[1])
      const defaultOption = presetOptions[1] || presetOptions[0];
      setSelectedTurf(defaultOption);
    }
  }, [presetOptions, selectedTurf]);

  // Handle click-outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowMoreOptions(false);
      }
    }

    if (showMoreOptions) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showMoreOptions]);

  // IMPORTANT: Call ALL hooks unconditionally (React Rules of Hooks)
  // Use safe defaults if selectedTurf is null during initial load
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
    pricePerSqFtCents: selectedTurf?.pricePerSqFtCents || 0,
    isPetTurf: selectedTurf?.isPet || false,
    includeInfill,
  });

  // Calculate package items based on square footage (same logic as product page)
  const packageItems = React.useMemo(() => {
    // Return empty array if selectedTurf not yet loaded
    if (!selectedTurf) return [];

    const items: Array<{
      accessory: typeof accessories[0];
      qty: number;
      note: string;
    }> = [];

    // 1. Infill - 1 bag per 50 sqft
    if (includeInfill) {
      if (selectedTurf.isPet) {
        const zeodorizer = accessories.find(a => a.handle === "zeodorizer");
        if (zeodorizer) {
          items.push({
            accessory: zeodorizer,
            qty: Math.ceil(squareFeet / 50),
            note: "1 bag per 50 sqft",
          });
        }
      } else {
        const infill = accessories.find(a => a.handle === "60-grit-sand");
        if (infill) {
          items.push({
            accessory: infill,
            qty: Math.ceil(squareFeet / 50),
            note: "1 bag per 50 sqft",
          });
        }
      }
    }

    // 2. Weed barrier - 1 roll per 800 sqft
    const weedBarrier = accessories.find(a => a.handle === "weed-barrier");
    if (weedBarrier) {
      items.push({
        accessory: weedBarrier,
        qty: Math.ceil(totalCutSquareFeet / 800),
        note: "Prevents weed growth",
      });
    }

    // 3. Nails - 1 box per 800 sqft
    const nails = accessories.find(a => a.handle === "5-inch-nails");
    if (nails) {
      items.push({
        accessory: nails,
        qty: Math.ceil(totalCutSquareFeet / 800),
        note: "For edges & seams",
      });
    }

    // 4. Gopher wire - 1 roll per 400 sqft
    const gopherWire = accessories.find(a => a.handle === "gopher-wire");
    if (gopherWire) {
      items.push({
        accessory: gopherWire,
        qty: Math.ceil(totalCutSquareFeet / 400),
        note: "Prevents rodent damage",
      });
    }

    // 5. Seam tape - based on seam count
    if (estimate.seaming.seamCount > 0) {
      const seamTape = accessories.find(a => a.handle === "seam-tape-8x50");
      if (seamTape) {
        items.push({
          accessory: seamTape,
          qty: estimate.seaming.seamCount,
          note: `For ${estimate.seaming.seamCount} seam${estimate.seaming.seamCount !== 1 ? 's' : ''}`,
        });
      }
    }

    return items;
  }, [selectedTurf, squareFeet, totalCutSquareFeet, estimate.seaming.seamCount, includeInfill, accessories]);

  const suppliesTotalCents = packageItems.reduce((sum, item) => sum + (item.accessory.priceCents * item.qty), 0);
  const grandTotalCents = totalPriceCents + suppliesTotalCents;

  // Handle loading state - guard placed AFTER all hooks to satisfy React Rules of Hooks
  if (!selectedTurf || presetOptions.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Loading calculator...</p>
        {presetOptions.length === 0 && (
          <p className="text-xs text-red-500 mt-2">No featured products found</p>
        )}
      </div>
    );
  }

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

      {/* Desktop: Full banners - min-h prevents layout shift when notifications change */}
      <div className="hidden sm:block space-y-2 mb-6 min-h-[116px]">
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

      <div className="grid gap-4 sm:gap-6 lg:gap-8 lg:grid-cols-3">
        {/* Left: Inputs + Cuts - creative grid layout */}
        <div className="lg:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
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

          {/* Cuts Breakdown Card - side by side with Dimensions */}
          <div className="group relative overflow-hidden rounded-xl sm:rounded-2xl bg-white border border-border/50 shadow-lg">
            <div className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3 mb-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center">
                  <Scissors className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold">Your Cuts</h3>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">
                    {cuts.length} cut{cuts.length !== 1 ? "s" : ""} from {rollsNeeded} roll{rollsNeeded !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {/* Cuts list - fixed height fits 2 cuts, 3rd triggers scroll */}
              <div className="space-y-1 sm:space-y-1.5 mb-3 h-[88px] overflow-y-auto">
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

          {/* Turf Selection - spans full width */}
          <div className="lg:col-span-2 group relative rounded-xl sm:rounded-2xl bg-white border border-border/50 shadow-lg transition-all duration-300 hover:shadow-xl overflow-visible">

            <div className="relative p-3 sm:p-4 overflow-visible">
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
                {presetOptions.map((turf) => {
                  const product = getProduct(turf.productHandle);
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

              {/* Advanced Options - Visual Grouping */}
              <div className="mt-3 sm:mt-4 p-3 sm:p-4 rounded-xl bg-gradient-to-br from-muted/30 to-muted/50 border border-border/30 overflow-visible">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Advanced Options</span>
                </div>

              {/* Other Products - Card Style Dropdown */}
              {otherProducts.length > 0 && (
                <div ref={dropdownRef} className="relative mt-1.5 sm:mt-2 overflow-visible">
                  {/* Check if a non-preset product is selected */}
                  {(() => {
                    const isOtherSelected = !presetOptions.some(t => t.id === selectedTurf.id);
                    const selectedProduct = isOtherSelected
                      ? otherProducts.find(p => p.handle === selectedTurf.id)
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
                                  {otherProducts.length} more products available
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
                    <div className="absolute z-50 left-0 right-0 mt-1 max-h-64 sm:max-h-80 rounded-lg border border-border/50 bg-white shadow-2xl overflow-hidden">
                      {/* Dropdown header with close button */}
                      <div className="sticky top-0 z-10 flex items-center justify-between px-3 py-2 bg-gradient-to-r from-muted/80 to-muted/50 border-b border-border/30 backdrop-blur-sm">
                        <span className="text-xs font-semibold text-muted-foreground">
                          Select a Product
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowMoreOptions(false)}
                          className="p-1 rounded-md hover:bg-white/50 transition-colors"
                          aria-label="Close dropdown"
                        >
                          <X className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                      </div>

                      {/* Products list */}
                      <div className="max-h-56 sm:max-h-72 overflow-y-auto">
                      {otherProducts.map((product) => {
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
                      </div> {/* End products list */}
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
                  <div className="flex-1 min-w-0 flex items-center gap-1.5">
                    <span className="font-medium text-xs">Include infill in estimate</span>
                    {selectedTurf.isPet && (
                      <span className="text-amber-600 text-[10px] font-medium">(Recommended)</span>
                    )}
                    <SafeTooltip>
                      <SafeTooltipTrigger asChild>
                        <button
                          type="button"
                          className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary/20 hover:bg-primary/30 transition-all duration-200 hover:scale-110"
                          onClick={(e: React.MouseEvent) => e.preventDefault()}
                        >
                          <HelpCircle className="w-4 h-4 text-primary" />
                        </button>
                      </SafeTooltipTrigger>
                      <SafeTooltipContent side="right" align="start" alignOffset={-10} sideOffset={8} className="max-w-[340px] sm:max-w-[420px] p-3 sm:p-4 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
                        <div className="space-y-1.5">
                          <h4 className="font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
                            <span className="text-primary">•</span>
                            What is Infill?
                          </h4>
                          <p className="text-[11px] sm:text-xs text-white/80 leading-snug">
                            Infill helps turf blades stand upright, adds cushioning, and improves drainage. For pet turf, ZeoFill neutralizes odors.
                          </p>
                          <p className="text-[10px] text-white/50 italic pt-1 border-t border-white/10">
                            Highly recommended for longevity and realistic appearance
                          </p>
                        </div>
                      </SafeTooltipContent>
                    </SafeTooltip>
                  </div>
                </label>
              </div>

              </div> {/* End Advanced Options */}
            </div>
          </div>

        </div>

        {/* Right: Materials List (sticky like sample box) */}
        <div>
          <div className="sticky top-24">
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

                {/* Supply items from accessories */}
                {packageItems.map((item, index) => {
                  // Add "(Recommended)" label before first infill item
                  const isInfill = item.accessory.handle === "zeodorizer" || item.accessory.handle === "60-grit-sand";
                  const isFirstInfill = isInfill && index === 0;

                  return (
                    <React.Fragment key={item.accessory.id}>
                      {isFirstInfill && (
                        <div className="flex items-center gap-1.5 mt-2 mb-1">
                          <div className="h-px flex-1 bg-white/10" />
                          <span className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">
                            Recommended
                          </span>
                          <div className="h-px flex-1 bg-white/10" />
                        </div>
                      )}
                      <MaterialRow
                        title={item.accessory.name}
                        subtitle={`${item.qty} × ${formatPrice(item.accessory.priceCents)} — ${item.note}`}
                        price={item.accessory.priceCents * item.qty}
                        image={item.accessory.images[0]}
                      />
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Divider & Total - outside fixed container so it stays in place */}
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
  image,
}: {
  emoji?: string;
  title: string;
  subtitle: string;
  price: number;
  highlight?: boolean;
  image?: string;
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
          "relative flex h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0 items-center justify-center rounded-lg overflow-hidden",
          highlight ? "bg-primary text-white" : "bg-white/10 text-white/60"
        )}
      >
        {image ? (
          <SafeImage src={image} alt={title} fill className="object-cover" sizes="32px" />
        ) : (
          <span className="text-sm">{emoji}</span>
        )}
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
