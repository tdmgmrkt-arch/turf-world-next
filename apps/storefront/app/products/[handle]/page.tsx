"use client";

import { useState, useRef, useMemo } from "react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import {
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Check,
  Shield,
  Truck,
  Star,
  Sparkles,
  Package,
  Ruler,
  Layers,
  Leaf,
  Dog,
  Award,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
  Scissors,
  Info,
  ChevronDown,
  Edit3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { formatPrice, cn } from "@/lib/utils";
import {
  PRODUCTS,
  ACCESSORIES,
  getProductByHandle,
  type Product,
} from "@/lib/products";
import { useCartStore } from "@/lib/store";

type Cut = {
  id: string;
  length: number; // in feet
};

const ROLL_WIDTH = 15; // feet
const ROLL_LENGTH = 100; // feet
const MIN_CUT_LENGTH = 10; // minimum cut length in feet

// Generate optimal cuts from square footage
const generateCutsFromSqFt = (sqft: number): Cut[] => {
  const linearFeet = Math.ceil(sqft / ROLL_WIDTH);
  const cuts: Cut[] = [];
  let remaining = linearFeet;
  const timestamp = Date.now();

  while (remaining > 0) {
    // Take up to ROLL_LENGTH (100ft) at a time, minimum MIN_CUT_LENGTH (10ft)
    const cutLength = Math.min(remaining, ROLL_LENGTH);
    if (cutLength >= MIN_CUT_LENGTH) {
      cuts.push({ id: `${timestamp}-${cuts.length}`, length: cutLength });
      remaining -= cutLength;
    } else {
      // If remaining is less than min, add it to the last cut or make min cut
      if (cuts.length > 0) {
        // Already have cuts, the remaining is waste
        break;
      } else {
        // First cut, make minimum
        cuts.push({ id: `${timestamp}-0`, length: MIN_CUT_LENGTH });
        break;
      }
    }
  }

  return cuts.length > 0 ? cuts : [{ id: `${timestamp}-0`, length: MIN_CUT_LENGTH }];
};

function ProductDetailPage() {
  const params = useParams();
  const handle = params.handle as string;
  const product = getProductByHandle(handle);

  const [selectedImage, setSelectedImage] = useState(0);
  const [squareFootage, setSquareFootage] = useState(150);
  const [sqftInputValue, setSqftInputValue] = useState("150"); // Display state for input
  const [cuts, setCuts] = useState<Cut[]>(() => generateCutsFromSqFt(150));
  const [cutInputValues, setCutInputValues] = useState<Record<string, string>>({}); // Display state for cut length inputs
  const [showCutsDetail, setShowCutsDetail] = useState(false);
  const [isEditingCuts, setIsEditingCuts] = useState(false);
  const [includeCompletePackage, setIncludeCompletePackage] = useState(false);
  const { addItem } = useCartStore();

  // Ref to track current squareFootage for +/- button handlers (avoids stale closure)
  const squareFootageRef = useRef(squareFootage);
  squareFootageRef.current = squareFootage;

  // Calculate totals from cuts (single source of truth)
  const totalLinearFeet = cuts.reduce((sum, cut) => sum + cut.length, 0);
  const totalSquareFeet = totalLinearFeet * ROLL_WIDTH;

  // Calculate rolls needed using first-fit decreasing bin packing
  const calculateRollsNeeded = () => {
    const sortedCuts = [...cuts].sort((a, b) => b.length - a.length);
    const rolls: number[] = []; // remaining space in each roll

    for (const cut of sortedCuts) {
      const rollIndex = rolls.findIndex(remaining => remaining >= cut.length);
      if (rollIndex >= 0) {
        rolls[rollIndex] -= cut.length;
      } else {
        rolls.push(ROLL_LENGTH - cut.length);
      }
    }
    return Math.max(1, rolls.length);
  };

  const rollsNeeded = calculateRollsNeeded();
  const wasteLinearFeet = (rollsNeeded * ROLL_LENGTH) - totalLinearFeet;
  const wastePercentage = rollsNeeded > 0 ? Math.round((wasteLinearFeet / (rollsNeeded * ROLL_LENGTH)) * 100) : 0;

  // Calculate package items based on square footage
  const packageItems = useMemo(() => {
    const items: Array<{
      accessory: typeof ACCESSORIES[0];
      quantity: number;
      totalCents: number;
      note: string;
    }> = [];

    // Determine if pet turf (will be set after product check)
    const isPet = product?.category === "pet";

    // 1. Infill - 1 lb/sqft standard, 1.5 lb/sqft for pet turf
    // Standard bags are 50 lbs, zeodorizer is 40 lbs
    if (isPet) {
      const zeodorizer = ACCESSORIES.find(a => a.handle === "zeodorizer");
      if (zeodorizer) {
        const lbsNeeded = totalSquareFeet * 1.5;
        const bagsNeeded = Math.ceil(lbsNeeded / 40); // 40 lb bags
        items.push({
          accessory: zeodorizer,
          quantity: bagsNeeded,
          totalCents: zeodorizer.priceCents * bagsNeeded,
          note: `${Math.round(lbsNeeded)} lbs needed`,
        });
      }
    } else {
      const infill = ACCESSORIES.find(a => a.handle === "60-grit-sand");
      if (infill) {
        const lbsNeeded = totalSquareFeet * 1;
        const bagsNeeded = Math.ceil(lbsNeeded / 50); // 50 lb bags
        items.push({
          accessory: infill,
          quantity: bagsNeeded,
          totalCents: infill.priceCents * bagsNeeded,
          note: `${Math.round(lbsNeeded)} lbs needed`,
        });
      }
    }

    // 2. Seam tape - only if multiple strips needed (rollsNeeded > 1 means seams)
    const stripsAcross = Math.ceil(totalSquareFeet / (totalLinearFeet * ROLL_WIDTH)) || 1;
    // Actually, for seams we need to know if width > 15ft
    // Since we're working with linear feet from a 15ft roll, we may need seams
    // For simplicity: if ordering > 100 linear feet, likely need seams
    if (totalLinearFeet > ROLL_LENGTH) {
      const seamTape = ACCESSORIES.find(a => a.handle === "seam-tape-8x50");
      if (seamTape) {
        // Estimate seam length: each seam is ~lengthFeet, and we might have multiple seams
        const estimatedSeamCount = Math.ceil(totalLinearFeet / ROLL_LENGTH) - 1;
        const seamLengthNeeded = estimatedSeamCount * (totalLinearFeet / Math.ceil(totalLinearFeet / ROLL_LENGTH));
        const rollsNeeded = Math.ceil(seamLengthNeeded / 50); // 50ft per roll
        items.push({
          accessory: seamTape,
          quantity: Math.max(1, rollsNeeded),
          totalCents: seamTape.priceCents * Math.max(1, rollsNeeded),
          note: "For joining cuts",
        });
      }
    }

    // 3. Weed barrier - 1 roll covers 1800 sqft (6' x 300')
    const weedBarrier = ACCESSORIES.find(a => a.handle === "weed-barrier");
    if (weedBarrier) {
      const rollsNeeded = Math.ceil(totalSquareFeet / 1800);
      items.push({
        accessory: weedBarrier,
        quantity: rollsNeeded,
        totalCents: weedBarrier.priceCents * rollsNeeded,
        note: "Prevents weed growth",
      });
    }

    // 4. Nails - 1 box per ~500 sqft for perimeter and seam securing
    const nails = ACCESSORIES.find(a => a.handle === "5-inch-nails");
    if (nails) {
      const boxesNeeded = Math.ceil(totalSquareFeet / 500);
      items.push({
        accessory: nails,
        quantity: boxesNeeded,
        totalCents: nails.priceCents * boxesNeeded,
        note: "For edges & seams",
      });
    }

    return items;
  }, [totalSquareFeet, totalLinearFeet, product?.category]);

  const packageTotalCents = packageItems.reduce((sum, item) => sum + item.totalCents, 0);

  // Update square footage and auto-generate cuts (always exits custom mode)
  const handleSquareFootageChange = (newSqFt: number) => {
    const validSqFt = Math.max(MIN_CUT_LENGTH * ROLL_WIDTH, newSqFt); // Minimum 150 sq ft
    squareFootageRef.current = validSqFt; // Update ref immediately for rapid clicks
    setSquareFootage(validSqFt);
    setSqftInputValue(validSqFt.toString());
    setIsEditingCuts(false); // Exit custom mode when using sq ft input
    setCuts(generateCutsFromSqFt(validSqFt));
  };

  // Dedicated increment/decrement handlers to avoid closure issues
  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const current = squareFootageRef.current;
    handleSquareFootageChange(current + 1);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const current = squareFootageRef.current;
    handleSquareFootageChange(current - 1);
  };

  // Handle input typing - allow empty/partial values while typing
  const handleSqftInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSqftInputValue(value);

    // If it's a valid number, update the actual square footage and regenerate cuts
    const parsed = parseInt(value);
    if (!isNaN(parsed) && parsed >= MIN_CUT_LENGTH * ROLL_WIDTH) {
      setSquareFootage(parsed);
      setIsEditingCuts(false); // Exit custom mode when typing
      setCuts(generateCutsFromSqFt(parsed));
    }
  };

  // Validate on blur - enforce minimum
  const handleSqftInputBlur = () => {
    const parsed = parseInt(sqftInputValue);
    const validSqFt = isNaN(parsed) || parsed < MIN_CUT_LENGTH * ROLL_WIDTH
      ? MIN_CUT_LENGTH * ROLL_WIDTH
      : parsed;

    setSquareFootage(validSqFt);
    setSqftInputValue(validSqFt.toString());
    setIsEditingCuts(false); // Exit custom mode on blur
    setCuts(generateCutsFromSqFt(validSqFt));
  };

  // Cut management functions
  const addCut = () => {
    setIsEditingCuts(true);
    const newCuts = [...cuts, { id: Date.now().toString(), length: MIN_CUT_LENGTH }];
    setCuts(newCuts);
    // Update square footage to match
    const newLinearFeet = newCuts.reduce((sum, cut) => sum + cut.length, 0);
    const newSqFt = newLinearFeet * ROLL_WIDTH;
    setSquareFootage(newSqFt);
    setSqftInputValue(newSqFt.toString());
  };

  const removeCut = (id: string) => {
    if (cuts.length > 1) {
      setIsEditingCuts(true);
      const newCuts = cuts.filter(cut => cut.id !== id);
      setCuts(newCuts);
      // Update square footage to match
      const newLinearFeet = newCuts.reduce((sum, cut) => sum + cut.length, 0);
      const newSqFt = newLinearFeet * ROLL_WIDTH;
      setSquareFootage(newSqFt);
      setSqftInputValue(newSqFt.toString());
    }
  };

  const updateCutLength = (id: string, length: number) => {
    setIsEditingCuts(true);
    const validLength = Math.max(MIN_CUT_LENGTH, Math.min(ROLL_LENGTH, length));
    const newCuts = cuts.map(cut =>
      cut.id === id ? { ...cut, length: validLength } : cut
    );
    setCuts(newCuts);
    // Update square footage to match
    const newLinearFeet = newCuts.reduce((sum, cut) => sum + cut.length, 0);
    const newSqFt = newLinearFeet * ROLL_WIDTH;
    setSquareFootage(newSqFt);
    setSqftInputValue(newSqFt.toString());
    // Update display value
    setCutInputValues(prev => ({ ...prev, [id]: validLength.toString() }));
  };

  // Handle cut length input typing - allow free typing
  const handleCutLengthChange = (id: string, value: string) => {
    setCutInputValues(prev => ({ ...prev, [id]: value }));
  };

  // Validate cut length on blur
  const handleCutLengthBlur = (id: string) => {
    const inputValue = cutInputValues[id];
    const parsed = parseInt(inputValue);
    const validLength = isNaN(parsed) || parsed < MIN_CUT_LENGTH
      ? MIN_CUT_LENGTH
      : Math.min(ROLL_LENGTH, parsed);

    setIsEditingCuts(true);
    const newCuts = cuts.map(cut =>
      cut.id === id ? { ...cut, length: validLength } : cut
    );
    setCuts(newCuts);
    // Update square footage to match
    const newLinearFeet = newCuts.reduce((sum, cut) => sum + cut.length, 0);
    const newSqFt = newLinearFeet * ROLL_WIDTH;
    setSquareFootage(newSqFt);
    setSqftInputValue(newSqFt.toString());
    // Update display value to validated value
    setCutInputValues(prev => ({ ...prev, [id]: validLength.toString() }));
  };

  // Get display value for cut length input (fallback to actual cut length)
  const getCutInputValue = (cut: Cut) => {
    return cutInputValues[cut.id] ?? cut.length.toString();
  };

  // Reset to auto-generate mode
  const resetToAutoGenerate = () => {
    setIsEditingCuts(false);
    setCuts(generateCutsFromSqFt(squareFootage));
  };

  const handleAddToCart = () => {
    // Add each cut as a separate cart item
    const timestamp = Date.now();
    cuts.forEach((cut, index) => {
      const cutSqFt = cut.length * ROLL_WIDTH;
      const uniqueId = `${product.id}-cut${index + 1}-${timestamp}`;
      addItem({
        id: uniqueId,
        productId: product.id,
        variantId: uniqueId, // Unique variantId so each cut is a separate line item
        title: `${product.name} - Cut #${index + 1}`,
        thumbnail: product.images[0] || null,
        quantity: 1,
        unitPrice: product.priceCents * cutSqFt,
        dimensions: {
          widthFeet: ROLL_WIDTH,
          lengthFeet: cut.length,
          squareFeet: cutSqFt,
        },
      });
    });

    // Add package items if selected
    if (includeCompletePackage) {
      packageItems.forEach((item) => {
        const uniqueId = `${item.accessory.id}-pkg-${timestamp}`;
        addItem({
          id: uniqueId,
          productId: item.accessory.id,
          variantId: uniqueId,
          title: item.accessory.name,
          thumbnail: item.accessory.images[0] || null,
          quantity: item.quantity,
          unitPrice: item.accessory.priceCents,
        });
      });
    }
  };

  if (!product) {
    notFound();
  }

  const isPetTurf = product.category === "pet";
  const isPutting = product.category === "putting";

  // Get related products (same category, different product)
  const relatedProducts = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  // Suggested accessories based on product type
  const suggestedAccessories = isPetTurf
    ? ACCESSORIES.filter(
        (a) => a.handle === "zeodorizer" || a.handle === "16-grit-sand"
      )
    : ACCESSORIES.filter(
        (a) => a.handle === "60-grit-sand" || a.handle === "weed-barrier"
      );

  const turfPriceCents = product.priceCents * totalSquareFeet;
  const totalPriceCents = turfPriceCents + (includeCompletePackage ? packageTotalCents : 0);
  const totalPrice = totalPriceCents / 100;

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Breadcrumb items={[
        { label: "Products", href: "/products" },
        { label: product.name }
      ]} />

      <div className="container px-4 sm:px-6 py-6 lg:py-8">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-2 lg:items-start">
          {/* Left: Image Gallery */}
          <div className="space-y-3">
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-100 via-green-100 to-emerald-200 border">
              {product.images[selectedImage] && (
                <Image
                  src={product.images[selectedImage]}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              )}

              {/* Badge */}
              {product.badge && (
                <div className="absolute top-4 left-4 z-10">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold text-white shadow-lg",
                      product.badgeColor || "bg-primary"
                    )}
                  >
                    <Sparkles className="w-4 h-4" />
                    {product.badge}
                  </span>
                </div>
              )}

              {/* Navigation arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setSelectedImage((prev) =>
                        prev === 0 ? product.images.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      setSelectedImage((prev) =>
                        prev === product.images.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      "relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all",
                      selectedImage === index
                        ? "border-primary shadow-lg shadow-primary/20"
                        : "border-transparent hover:border-primary/50"
                    )}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Trust Badges - Compact */}
            <div className="hidden lg:flex gap-2 pt-2">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50">
                <Truck className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium">Free Shipping</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium">{product.warranty}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50">
                <Award className="w-4 h-4 text-primary" />
                <span className="text-xs font-medium">Class A Fire</span>
              </div>
            </div>

            {/* Specifications - Desktop only (shows below photos) */}
            <div className="hidden lg:block mt-3 p-4 rounded-xl bg-card border">
              <h2 className="text-sm font-bold mb-2">Specifications</h2>
              <div className="grid grid-cols-2 gap-x-4 text-xs">
                <SpecRow label="Face Weight" value={`${product.weight} oz`} />
                <SpecRow label="Pile Height" value={`${product.pileHeight}"`} />
                <SpecRow label="Roll Size" value={product.rollSize} />
                <SpecRow label="Backing" value={product.backing} />
                <SpecRow label="Warranty" value={product.warranty} />
                <SpecRow label="Fire Rating" value="Class A" />
                <SpecRow label="PFAS Free" value="Yes" />
                <SpecRow label="Lead Free" value="Yes" />
                {isPetTurf && (
                  <>
                    <SpecRow label="Antimicrobial" value="Yes" />
                    <SpecRow label="Drainage" value="100+ gal/min/sqft" />
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="space-y-3 min-w-0">
            {/* Category Badge + Title Row */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={cn(
                    "px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider",
                    isPetTurf
                      ? "bg-amber-100 text-amber-700"
                      : isPutting
                        ? "bg-blue-100 text-blue-700"
                        : "bg-emerald-100 text-emerald-700"
                  )}
                >
                  {isPetTurf
                    ? "Pet Turf"
                    : isPutting
                      ? "Putting Green"
                      : "Landscape"}
                </span>
                {product.inStock && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 flex items-center gap-1">
                    <Check className="w-3 h-3" /> In Stock
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold">{product.name}</h1>
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5 text-amber-400 fill-amber-400"
                    />
                  ))}
                  <span className="ml-1 text-sm font-medium">4.9</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  127 reviews
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-600">
                {formatPrice(product.priceCents)}
              </span>
              <span className="text-base text-muted-foreground">/sq ft</span>
              {product.comparePriceCents && (
                <span className="text-base text-muted-foreground line-through ml-2">
                  {formatPrice(product.comparePriceCents)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Key Specs - Compact inline */}
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted/50">
                <Layers className="w-3.5 h-3.5 text-primary" />
                <span className="font-medium">{product.weight} oz</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted/50">
                <Ruler className="w-3.5 h-3.5 text-primary" />
                <span className="font-medium">{product.pileHeight}&quot;</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted/50">
                <Package className="w-3.5 h-3.5 text-primary" />
                <span className="font-medium">{product.rollSize}</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted/50">
                {isPetTurf ? <Dog className="w-3.5 h-3.5 text-primary" /> : <Leaf className="w-3.5 h-3.5 text-primary" />}
                <span className="font-medium">{product.backing}</span>
              </span>
            </div>

            {/* Order Configuration */}
            <div className="p-3 sm:p-4 rounded-xl border bg-card shadow-sm overflow-hidden">
              {/* Section Header with mini process */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center">
                    <Ruler className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-sm">Configure Your Order</h3>
                </div>
                <div className="hidden sm:flex items-center gap-1 text-[10px] text-muted-foreground">
                  <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">1</span>
                  <span>Enter</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                  <span className="px-1.5 py-0.5 rounded bg-muted font-medium">2</span>
                  <span>Review</span>
                  <ArrowRight className="w-2.5 h-2.5" />
                  <span className="px-1.5 py-0.5 rounded bg-muted font-medium">3</span>
                  <span>Add</span>
                </div>
              </div>

              {/* Step 1: Square Footage Input */}
              <div className="p-3 rounded-lg bg-gradient-to-br from-primary/5 to-emerald-500/5 border border-primary/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-medium text-primary uppercase tracking-wider flex items-center gap-1">
                    <span className="w-4 h-4 rounded bg-primary text-white flex items-center justify-center text-[9px] font-bold">1</span>
                    Enter Square Footage
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center flex-1 bg-white border-2 border-primary/20 rounded-lg overflow-hidden shadow-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                    <button
                      type="button"
                      onClick={handleDecrement}
                      className="w-10 h-11 flex items-center justify-center hover:bg-muted transition-colors border-r"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      value={sqftInputValue}
                      onChange={handleSqftInputChange}
                      onBlur={handleSqftInputBlur}
                      placeholder="150"
                      className="flex-1 h-11 text-center text-xl font-bold bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      min={150}
                    />
                    <button
                      type="button"
                      onClick={handleIncrement}
                      className="w-10 h-11 flex items-center justify-center hover:bg-muted transition-colors border-l"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold">sq ft</span>
                    <p className="text-[10px] text-muted-foreground">min. 150</p>
                  </div>
                </div>
              </div>

              {/* Step 2: Cuts Breakdown - Expandable */}
              <div className="mt-3">
                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1 mb-1.5">
                  <span className="w-4 h-4 rounded bg-muted text-foreground flex items-center justify-center text-[9px] font-bold">2</span>
                  Review Your Cuts
                </span>
                <button
                  onClick={() => setShowCutsDetail(!showCutsDetail)}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted border border-transparent hover:border-border transition-all"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-md bg-white border flex items-center justify-center">
                      <Scissors className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <div className="text-left">
                      <span className="text-sm font-semibold block">
                        {cuts.length} cut{cuts.length !== 1 ? 's' : ''} from {rollsNeeded} roll{rollsNeeded !== 1 ? 's' : ''}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {isEditingCuts ? 'Custom' : 'Auto-optimized'} • Click to {showCutsDetail ? 'hide' : 'customize'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {isEditingCuts && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-medium">Custom</span>
                    )}
                    <div className={cn(
                      "w-6 h-6 rounded-md bg-white border flex items-center justify-center transition-transform",
                      showCutsDetail && "rotate-180"
                    )}>
                      <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                  </div>
                </button>
              </div>

              {showCutsDetail && (
                <div className="mt-2 p-3 rounded-lg border bg-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-muted-foreground px-1.5 py-0.5 rounded bg-muted">
                      15ft wide rolls
                    </span>
                    <div className="flex items-center gap-2">
                      {isEditingCuts && (
                        <button
                          type="button"
                          onClick={resetToAutoGenerate}
                          className="text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Reset
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={addCut}
                        className="text-[10px] text-white bg-primary hover:bg-primary/90 px-2 py-1 rounded font-medium flex items-center gap-0.5 transition-colors"
                      >
                        <Plus className="w-2.5 h-2.5" />
                        Add
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    {cuts.map((cut, index) => (
                      <div key={cut.id} className="flex items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 rounded hover:bg-muted/50 transition-colors">
                        <span className="text-[9px] sm:text-[10px] font-medium text-muted-foreground w-4 sm:w-5">#{index + 1}</span>
                        <div className="flex items-center flex-1 min-w-0 border rounded overflow-hidden bg-white text-[10px] sm:text-xs">
                          <span className="px-1.5 sm:px-2 py-1 sm:py-1.5 font-medium text-muted-foreground bg-muted border-r whitespace-nowrap">15′×</span>
                          <input
                            type="number"
                            value={getCutInputValue(cut)}
                            onChange={(e) => handleCutLengthChange(cut.id, e.target.value)}
                            onBlur={() => handleCutLengthBlur(cut.id)}
                            className="w-10 sm:w-12 h-6 sm:h-7 text-center font-bold bg-transparent focus:outline-none focus:bg-primary/5 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            min={MIN_CUT_LENGTH}
                            max={ROLL_LENGTH}
                          />
                          <span className="px-1.5 sm:px-2 py-1 sm:py-1.5 font-medium text-muted-foreground bg-muted border-l">ft</span>
                        </div>
                        <span className="text-[10px] sm:text-xs font-semibold w-11 sm:w-14 text-right flex-shrink-0">
                          {(cut.length * ROLL_WIDTH).toLocaleString()} sf
                        </span>
                        <button
                          type="button"
                          onClick={() => removeCut(cut.id)}
                          disabled={cuts.length === 1}
                          className={cn(
                            "w-5 h-5 sm:w-6 sm:h-6 rounded flex items-center justify-center transition-all flex-shrink-0",
                            cuts.length === 1
                              ? "text-muted-foreground/30 cursor-not-allowed"
                              : "text-muted-foreground hover:text-red-500 hover:bg-red-50"
                          )}
                        >
                          <Trash2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Complete Package Option */}
              <div className="mt-3">
                <label
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all",
                    includeCompletePackage
                      ? "border-primary bg-primary/5"
                      : "border-muted hover:border-primary/30 hover:bg-muted/30"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={includeCompletePackage}
                      onChange={(e) => setIncludeCompletePackage(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={cn(
                      "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                      includeCompletePackage
                        ? "bg-primary border-primary"
                        : "border-muted-foreground/30"
                    )}>
                      {includeCompletePackage && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div>
                      <span className="text-sm font-semibold block">Add Complete Install Package</span>
                      <span className="text-[11px] text-muted-foreground">
                        Infill, weed barrier, nails{totalLinearFeet > ROLL_LENGTH ? ', seam tape' : ''} • Save 5%
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-primary">+{formatPrice(packageTotalCents)}</span>
                  </div>
                </label>

                {/* Package Items Detail */}
                {includeCompletePackage && (
                  <div className="mt-2 p-3 rounded-lg bg-muted/30 border space-y-2">
                    {packageItems.map((item) => (
                      <div key={item.accessory.id} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="relative w-8 h-8 rounded overflow-hidden bg-white border flex-shrink-0">
                            {item.accessory.images[0] && (
                              <Image
                                src={item.accessory.images[0]}
                                alt={item.accessory.name}
                                fill
                                className="object-cover"
                                sizes="32px"
                              />
                            )}
                          </div>
                          <div>
                            <span className="font-medium block">{item.accessory.name}</span>
                            <span className="text-muted-foreground">
                              {item.quantity}× • {item.note}
                            </span>
                          </div>
                        </div>
                        <span className="font-semibold">{formatPrice(item.totalCents)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Step 3: Order Summary & Add to Cart */}
              <div className="mt-3">
                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1 mb-1.5">
                  <span className="w-4 h-4 rounded bg-muted text-foreground flex items-center justify-center text-[9px] font-bold">3</span>
                  Add to Cart
                </span>
                <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 border">
                  {/* Summary Stats - Inline */}
                  <div className="flex items-center justify-between text-[10px] sm:text-xs mb-2 gap-1">
                    <span className="text-muted-foreground">Need: <span className="font-semibold text-foreground">{squareFootage.toLocaleString()}</span></span>
                    <span className="text-muted-foreground">Get: <span className="font-semibold text-primary">{totalSquareFeet.toLocaleString()}</span></span>
                    <span className="text-muted-foreground">Rolls: <span className="font-semibold text-foreground">{rollsNeeded}</span></span>
                  </div>

                  {/* Price Breakdown when package included */}
                  {includeCompletePackage && (
                    <div className="space-y-1 pt-2 border-t border-slate-200 text-xs">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Turf ({totalSquareFeet} sf)</span>
                        <span className="font-medium">{formatPrice(turfPriceCents)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Install Package</span>
                        <span className="font-medium">{formatPrice(packageTotalCents)}</span>
                      </div>
                    </div>
                  )}

                  {/* Total */}
                  <div className={cn(
                    "flex justify-between items-center pt-2",
                    includeCompletePackage ? "border-t border-slate-200 mt-2" : "border-t border-slate-200"
                  )}>
                    <span className="text-sm text-muted-foreground">Total</span>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-600">
                        ${totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Add to Cart */}
              <Button
                size="lg"
                variant="premium"
                className="w-full mt-3 h-12 text-base"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
            </div>

            {/* Mobile Trust Badges */}
            <div className="grid grid-cols-3 gap-3 lg:hidden">
              <div className="text-center p-3 rounded-xl bg-muted/50">
                <Truck className="w-5 h-5 text-primary mx-auto mb-1" />
                <p className="text-xs font-medium">Free Ship</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-muted/50">
                <Shield className="w-5 h-5 text-primary mx-auto mb-1" />
                <p className="text-xs font-medium">{product.warranty}</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-muted/50">
                <Award className="w-5 h-5 text-primary mx-auto mb-1" />
                <p className="text-xs font-medium">Class A</p>
              </div>
            </div>

            {/* Calculator CTA - Mobile only */}
            <Link
              href={`/calculator?product=${product.handle}`}
              className="lg:hidden flex items-center justify-between p-3 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Need help with measurements?</p>
                  <p className="text-xs text-muted-foreground">
                    Try our project calculator
                  </p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-primary" />
            </Link>
          </div>
        </div>

        {/* Mobile Specifications - Only shows on mobile (desktop has it in left column) */}
        <div className="mt-12 lg:hidden p-6 rounded-2xl bg-card border">
          <h2 className="text-xl font-bold mb-4">Specifications</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <SpecRow label="Face Weight" value={`${product.weight} oz`} />
            <SpecRow label="Pile Height" value={`${product.pileHeight}"`} />
            <SpecRow label="Roll Size" value={product.rollSize} />
            <SpecRow label="Backing" value={product.backing} />
            <SpecRow label="Warranty" value={product.warranty} />
            <SpecRow label="Fire Rating" value="Class A" />
            <SpecRow label="PFAS Free" value="Yes" />
            <SpecRow label="Lead Free" value="Yes" />
            {isPetTurf && (
              <>
                <SpecRow label="Antimicrobial" value="Yes" />
                <SpecRow label="Drainage" value="100+ gal/min/sqft" />
              </>
            )}
          </div>
        </div>

        {/* Accessories Section */}
        <div className="mt-8 lg:mt-12 p-6 rounded-2xl bg-muted/30 border">
          <h2 className="text-xl font-bold mb-4">Recommended Accessories</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {suggestedAccessories.map((accessory) => (
              <Link
                key={accessory.id}
                href={`/supplies/${accessory.handle}`}
                className="flex items-center gap-4 p-3 rounded-xl bg-white hover:shadow-md transition-shadow"
              >
                <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                  {accessory.images[0] && (
                    <Image
                      src={accessory.images[0]}
                      alt={accessory.name}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm line-clamp-1">
                    {accessory.name}
                  </p>
                  <p className="text-sm text-primary font-semibold">
                    {formatPrice(accessory.priceCents)}
                  </p>
                </div>
              </Link>
            ))}
            <Link
              href="/supplies"
              className="flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 hover:bg-primary/5 transition-colors text-muted-foreground hover:text-primary"
            >
              <span className="text-sm font-medium">View All Supplies</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Installation Guide */}
        <div className="mt-12 p-6 lg:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <h2 className="text-xl lg:text-2xl font-bold text-white mb-6">
            Installation Guide
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4 lg:gap-6">
            {[
              {
                step: 1,
                title: "Clear Area",
                desc: "Remove existing grass, weeds, and debris",
              },
              {
                step: 2,
                title: "Excavate",
                desc: "Dig down 3-4\" for proper base depth",
              },
              {
                step: 3,
                title: "Add Base",
                desc: "Spread and compact crushed rock base",
              },
              {
                step: 4,
                title: "Weed Barrier",
                desc: "Lay fabric to prevent weed growth",
              },
              {
                step: 5,
                title: "Roll Turf",
                desc: "Unroll turf, trim edges to fit",
              },
              {
                step: 6,
                title: "Secure",
                desc: "Nail perimeter and seams every 6\"",
              },
              {
                step: 7,
                title: "Add Infill",
                desc: "Spread infill and brush fibers up",
              },
            ].map((item) => (
              <div key={item.step} className="text-white">
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-primary/20 flex items-center justify-center mb-2">
                  <span className="font-bold text-primary text-sm lg:text-base">{item.step}</span>
                </div>
                <h3 className="font-semibold text-sm lg:text-base mb-1">{item.title}</h3>
                <p className="text-xs lg:text-sm text-white/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Related Products</h2>
              <Button variant="outline" asChild>
                <Link href={`/products?use=${product.category}`}>
                  View All
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/products/${relatedProduct.handle}`}
                  className="group"
                >
                  <div className="rounded-2xl border overflow-hidden bg-white hover:shadow-xl transition-all hover:-translate-y-1">
                    <div className="relative aspect-[4/3] bg-gradient-to-br from-emerald-100 to-green-100">
                      {relatedProduct.images[0] && (
                        <Image
                          src={relatedProduct.images[0]}
                          alt={relatedProduct.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, 25vw"
                        />
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold group-hover:text-primary transition-colors">
                        {relatedProduct.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-lg font-bold text-primary">
                          {formatPrice(relatedProduct.priceCents)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          /sq ft
                        </span>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <span className="px-2 py-0.5 rounded bg-muted text-xs">
                          {relatedProduct.weight}oz
                        </span>
                        <span className="px-2 py-0.5 rounded bg-muted text-xs">
                          {relatedProduct.pileHeight}&quot;
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-1.5 border-b last:border-b-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

export default ProductDetailPage;
