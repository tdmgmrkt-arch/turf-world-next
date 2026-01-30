"use client";

import { useState } from "react";
import { Calculator, Info, ShoppingCart, Scissors, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTurfLogic } from "@/hooks/use-turf-logic";
import { useCartStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface TurfCalculatorProps {
  productId: string;
  productTitle: string;
  productThumbnail?: string | null;
  variantId: string;
  /** Price per square foot in cents */
  pricePerSqFtCents: number;
  /** Is this pet turf? */
  isPetTurf?: boolean;
  className?: string;
}

/**
 * TurfCalculator - The "Anti-Frustration" Component
 *
 * This is the PDP's default mode ("Project Mode" not "Item Mode").
 * User enters dimensions → sees everything they need to buy.
 *
 * Strategic value:
 * - Reduces support tickets ("how many rolls do I need?")
 * - Increases AOV via cross-sell (infill, seam tape)
 * - Builds trust via transparency (shows waste %)
 */
export function TurfCalculator({
  productId,
  productTitle,
  productThumbnail,
  variantId,
  pricePerSqFtCents,
  isPetTurf = false,
  className,
}: TurfCalculatorProps) {
  const [includeInfill, setIncludeInfill] = useState(isPetTurf);
  const { addItem } = useCartStore();

  const {
    widthFeet,
    lengthFeet,
    setWidthFeet,
    setLengthFeet,
    squareFeet,
    estimate,
    totalPriceCents,
  } = useTurfLogic({
    pricePerSqFtCents,
    isPetTurf,
    includeInfill,
  });

  const handleAddToCart = () => {
    addItem({
      id: `${variantId}-${widthFeet}x${lengthFeet}-${Date.now()}`,
      productId,
      variantId,
      title: productTitle,
      thumbnail: productThumbnail ?? null,
      quantity: 1,
      unitPrice: totalPriceCents,
      dimensions: {
        widthFeet,
        lengthFeet,
        squareFeet,
      },
    });
  };

  return (
    <TooltipProvider>
      <Card className={cn("border-2 border-primary/20", className)}>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calculator className="h-5 w-5 text-primary" />
            Project Calculator
            <Badge variant="secondary" className="ml-auto text-xs">
              Project Mode
            </Badge>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Dimension Inputs */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="width" className="flex items-center gap-1">
                Width (ft)
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>The shorter dimension of your project area</p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Input
                id="width"
                type="number"
                min={1}
                max={500}
                value={widthFeet}
                onChange={(e) => setWidthFeet(Number(e.target.value))}
                aria-label="Project width in feet"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="length" className="flex items-center gap-1">
                Length (ft)
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>The longer dimension of your project area</p>
                  </TooltipContent>
                </Tooltip>
              </Label>
              <Input
                id="length"
                type="number"
                min={1}
                max={500}
                value={lengthFeet}
                onChange={(e) => setLengthFeet(Number(e.target.value))}
                aria-label="Project length in feet"
              />
            </div>
          </div>

          {/* Coverage Summary */}
          <div className="rounded-lg bg-muted p-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">
                {squareFeet.toLocaleString()} sq ft
              </p>
              <p className="text-sm text-muted-foreground">
                {widthFeet}ft × {lengthFeet}ft project area
              </p>
            </div>
          </div>

          {/* Estimate Breakdown */}
          <div className="space-y-3">
            <h4 className="font-medium">What You Need:</h4>

            {/* Turf */}
            <div className="flex items-center justify-between rounded-md border p-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <Package className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Turf Rolls</p>
                  <p className="text-xs text-muted-foreground">
                    {estimate.turf.rollsNeeded} roll{estimate.turf.rollsNeeded !== 1 ? "s" : ""} × {lengthFeet}ft
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium">{formatPrice(totalPriceCents)}</p>
                <p className="text-xs text-muted-foreground">
                  {estimate.turf.linearFeetTotal} linear ft
                </p>
              </div>
            </div>

            {/* Seaming (if needed) */}
            {estimate.seaming.seamCount > 0 && (
              <div className="flex items-center justify-between rounded-md border border-dashed p-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/10">
                    <Scissors className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Seam Tape</p>
                    <p className="text-xs text-muted-foreground">
                      {estimate.seaming.seamCount} seam{estimate.seaming.seamCount !== 1 ? "s" : ""} needed
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{estimate.seaming.seamTapeFeet} ft</p>
                  <Badge variant="outline" className="text-xs">
                    Recommended
                  </Badge>
                </div>
              </div>
            )}

            {/* Infill Toggle */}
            {estimate.infill && (
              <div
                className={cn(
                  "flex items-center justify-between rounded-md border p-3 transition-colors",
                  includeInfill ? "border-primary/50 bg-primary/5" : "border-dashed"
                )}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="include-infill"
                    checked={includeInfill}
                    onChange={(e) => setIncludeInfill(e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300"
                    aria-label="Include infill in order"
                  />
                  <div>
                    <p className="text-sm font-medium">ZeoFill Infill</p>
                    <p className="text-xs text-muted-foreground">
                      {estimate.infill.poundsNeeded} lbs ({estimate.infill.bagsNeeded} bags)
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {isPetTurf && (
                    <Badge variant="pet" className="text-xs">
                      Pet Essential
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Waste Warning */}
          {estimate.turf.wastePercentage > 10 && (
            <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm">
              <p className="font-medium text-amber-800">
                {estimate.turf.wastePercentage}% material overage
              </p>
              <p className="text-xs text-amber-600">
                {estimate.notes.find((n) => n.includes("Tip:")) ||
                  "Turf is sold in 15ft widths, some overage is normal."}
              </p>
            </div>
          )}

          {/* Notes */}
          <ul className="space-y-1 text-xs text-muted-foreground">
            {estimate.notes.slice(0, 2).map((note, i) => (
              <li key={i} className="flex items-start gap-1">
                <span className="mt-0.5">•</span>
                {note}
              </li>
            ))}
          </ul>

          {/* Add to Cart */}
          <div className="space-y-3 border-t pt-4">
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>Total</span>
              <span className="text-primary">{formatPrice(totalPriceCents)}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {formatPrice(pricePerSqFtCents)}/sq ft × {estimate.turf.linearFeetTotal * 15} sq ft ordered
            </p>

            <Button
              size="lg"
              className="w-full"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}
