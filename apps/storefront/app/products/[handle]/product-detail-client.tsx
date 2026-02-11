"use client";

import { useState, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
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
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatPrice, cn } from "@/lib/utils";
import { ACCESSORIES, type Product, type Accessory } from "@/lib/products";
import { useCartStore } from "@/lib/store";

type Cut = {
  id: string;
  length: number; // in feet
};

const ROLL_WIDTH = 15; // feet
const ROLL_LENGTH = 100; // feet
const MIN_CUT_LENGTH = 10; // minimum cut length in feet

// Tooltip content for install supply items
const getSupplyTooltip = (handle: string): { title: string; description: string } => {
  const tooltips: Record<string, { title: string; description: string }> = {
    "zeodorizer": {
      title: "Why Zeodorizer?",
      description: "Natural zeolite that neutralizes pet urine odors on contact. Essential for pet installations to keep your yard fresh and odor-free."
    },
    "60-grit-sand": {
      title: "Why Silica Sand?",
      description: "Helps turf blades stand upright, adds realistic weight, and improves drainage. Standard infill for landscape installations."
    },
    "16-grit-sand": {
      title: "Why Coarse Sand?",
      description: "Excellent drainage for high-moisture areas. Coarser texture perfect for pet zones and areas with heavy water flow."
    },
    "camofill": {
      title: "Why CamoFill?",
      description: "Premium green-tinted infill that blends invisibly with turf. Provides excellent support while maintaining a natural appearance."
    },
    "weed-barrier": {
      title: "Why Weed Barrier?",
      description: "Blocks weeds from growing through your turf. Saves countless hours of maintenance and keeps your lawn looking pristine year-round."
    },
    "5-inch-nails": {
      title: "Why Landscape Nails?",
      description: "Heavy-duty galvanized nails secure turf edges and prevent shifting. Essential for a professional, long-lasting installation."
    },
    "gopher-wire": {
      title: "Why Gopher Wire?",
      description: "Prevents gophers and rodents from burrowing under your turf. Highly recommended for areas with active rodent populations."
    },
    "seam-tape-6x50": {
      title: "Why Seam Tape?",
      description: "Professional-grade tape joins turf sections with invisible seams. Creates a seamless, natural appearance across your entire lawn."
    },
    "seam-tape-8x33": {
      title: "Why Seam Tape?",
      description: "Extra-wide tape for heavy-duty installations. Provides superior hold for high-traffic areas and commercial projects."
    },
    "seam-tape-8x50": {
      title: "Why Seam Tape?",
      description: "Best value for large projects with multiple seams. Creates invisible, durable joins between turf sections."
    },
    "u-staples": {
      title: "Why U-Staples?",
      description: "Secure seams and edges with professional-grade staples. Essential for preventing turf movement and maintaining clean lines."
    },
  };

  return tooltips[handle] || {
    title: "Why This Item?",
    description: "Recommended for professional installation results."
  };
};

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

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [squareFootage, setSquareFootage] = useState(150);
  const [sqftInputValue, setSqftInputValue] = useState("150"); // Display state for input
  const [cuts, setCuts] = useState<Cut[]>(() => generateCutsFromSqFt(150));
  const [cutInputValues, setCutInputValues] = useState<Record<string, string>>({}); // Display state for cut length inputs
  const [showCutsDetail, setShowCutsDetail] = useState(true);
  const [isEditingCuts, setIsEditingCuts] = useState(false);
  const [selectedPackageItems, setSelectedPackageItems] = useState<Record<string, boolean>>({});
  const [packageItemQuantities, setPackageItemQuantities] = useState<Record<string, number>>({});
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

  // Calculate package items based on square footage (recommended quantities)
  const packageItems = useMemo(() => {
    const items: Array<{
      accessory: typeof ACCESSORIES[0];
      recommendedQty: number;
      note: string;
    }> = [];

    // Determine if pet turf (will be set after product check)
    const isPet = product?.category === "pet";

    // 1. Infill - 1 bag per 50 sqft (based on input square footage)
    if (isPet) {
      const zeodorizer = ACCESSORIES.find(a => a.handle === "zeodorizer");
      if (zeodorizer) {
        const bagsNeeded = Math.ceil(squareFootage / 50);
        items.push({
          accessory: zeodorizer,
          recommendedQty: bagsNeeded,
          note: "1 bag per 50 sqft",
        });
      }
    } else {
      const infill = ACCESSORIES.find(a => a.handle === "60-grit-sand");
      if (infill) {
        const bagsNeeded = Math.ceil(squareFootage / 50);
        items.push({
          accessory: infill,
          recommendedQty: bagsNeeded,
          note: "1 bag per 50 sqft",
        });
      }
    }

    // 2. Weed barrier - 1 roll per 800 sqft
    const weedBarrier = ACCESSORIES.find(a => a.handle === "weed-barrier");
    if (weedBarrier) {
      const rollsNeeded = Math.ceil(totalSquareFeet / 800);
      items.push({
        accessory: weedBarrier,
        recommendedQty: rollsNeeded,
        note: "Prevents weed growth",
      });
    }

    // 3. Nails - 1 box per 800 sqft
    const nails = ACCESSORIES.find(a => a.handle === "5-inch-nails");
    if (nails) {
      const boxesNeeded = Math.ceil(totalSquareFeet / 800);
      items.push({
        accessory: nails,
        recommendedQty: boxesNeeded,
        note: "For edges & seams",
      });
    }

    // 4. Gopher wire - 1 roll covers 400 sqft (4' x 100')
    const gopherWire = ACCESSORIES.find(a => a.handle === "gopher-wire");
    if (gopherWire) {
      const rollsNeeded = Math.ceil(totalSquareFeet / 400);
      items.push({
        accessory: gopherWire,
        recommendedQty: rollsNeeded,
        note: "Prevents rodent damage",
      });
    }

    // 5. Seam tape - 1 less than total number of cuts (for joining seams)
    const seamTapeQuantity = Math.max(0, cuts.length - 1);
    if (seamTapeQuantity > 0) {
      const seamTape = ACCESSORIES.find(a => a.handle === "seam-tape-8x50");
      if (seamTape) {
        items.push({
          accessory: seamTape,
          recommendedQty: seamTapeQuantity,
          note: `For ${seamTapeQuantity} seam${seamTapeQuantity !== 1 ? 's' : ''}`,
        });
      }
    }

    return items;
  }, [squareFootage, totalSquareFeet, cuts.length, product?.category]);

  // Get actual quantity for an item (custom or recommended)
  const getItemQuantity = (handle: string, recommendedQty: number) => {
    return packageItemQuantities[handle] ?? recommendedQty;
  };

  // Update quantity for an item
  const updateItemQuantity = (handle: string, qty: number) => {
    setPackageItemQuantities(prev => ({
      ...prev,
      [handle]: Math.max(1, qty)
    }));
  };

  const packageTotalCents = packageItems.reduce((sum, item) => {
    if (!selectedPackageItems[item.accessory.handle]) return sum;
    const qty = getItemQuantity(item.accessory.handle, item.recommendedQty);
    return sum + (item.accessory.priceCents * qty);
  }, 0);
  const hasAnyPackageItemSelected = packageItems.some(item => selectedPackageItems[item.accessory.handle]);

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
    if (!product) return;
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

    // Add selected package items
    packageItems.forEach((item) => {
      if (selectedPackageItems[item.accessory.handle]) {
        const qty = getItemQuantity(item.accessory.handle, item.recommendedQty);
        const uniqueId = `${item.accessory.id}-pkg-${timestamp}`;
        addItem({
          id: uniqueId,
          productId: item.accessory.id,
          variantId: uniqueId,
          title: item.accessory.name,
          thumbnail: item.accessory.images[0] || null,
          quantity: qty,
          unitPrice: item.accessory.priceCents,
        });
      }
    });
  };

  const isPetTurf = product.category === "pet";
  const isPutting = product.category === "putting";

  // Suggested accessories based on product type
  const suggestedAccessories = isPetTurf
    ? ACCESSORIES.filter(
        (a) => a.handle === "zeodorizer" || a.handle === "16-grit-sand"
      )
    : ACCESSORIES.filter(
        (a) => a.handle === "60-grit-sand" || a.handle === "weed-barrier"
      );

  const turfPriceCents = product.priceCents * totalSquareFeet;
  const totalPriceCents = turfPriceCents + packageTotalCents;
  const totalPrice = totalPriceCents / 100;

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Breadcrumb items={[
        { label: "Products", href: "/products" },
        { label: product.name }
      ]} />

      <div className="container px-4 sm:px-6 py-6 lg:py-8">
        {/* Product Header - Full Width */}
        <div className="mb-6 lg:mb-8">
          {/* Top Row: Title/Reviews on left, Price on right */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Left: Category, Title, Reviews */}
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider mb-1">
                <span
                  className={cn(
                    "font-bold",
                    isPetTurf
                      ? "text-amber-600"
                      : isPutting
                        ? "text-blue-600"
                        : "text-emerald-600"
                  )}
                >
                  {isPetTurf
                    ? "Pet Turf"
                    : isPutting
                      ? "Putting Green"
                      : "Landscape"}
                </span>
                {product.inStock && (
                  <>
                    <span>/</span>
                    <span className="text-green-600 font-medium flex items-center gap-1">
                      In Stock
                    </span>
                  </>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">{product.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-amber-400 fill-amber-400"
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  (127 Reviews)
                </span>
              </div>
            </div>

            {/* Right: Pricing Card */}
            <div className={cn(
              "border rounded-lg px-4 py-2 sm:mt-2 flex-shrink-0",
              product.comparePriceCents
                ? "bg-rose-50 border-rose-200"
                : "bg-slate-50 border-slate-100"
            )}>
              {product.comparePriceCents && (
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-xs text-slate-500 line-through">
                    {formatPrice(product.comparePriceCents)}
                  </span>
                  <span className="text-xs font-bold text-rose-600 bg-rose-100 px-2 py-0.5 rounded">
                    {Math.round((1 - product.priceCents / product.comparePriceCents) * 100)}% OFF
                  </span>
                </div>
              )}
              <div className="flex items-baseline gap-1 sm:text-right">
                <span className={cn(
                  "text-3xl lg:text-4xl font-bold",
                  product.comparePriceCents ? "text-rose-600" : "text-slate-600"
                )}>
                  {formatPrice(product.priceCents)}
                </span>
                <span className="text-lg text-slate-500">/sq ft</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mt-4 max-w-3xl">
            {product.description}
          </p>

          {/* Key Specs - Horizontal row */}
          <div className="flex flex-wrap gap-2 text-sm mt-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/60 border border-border/50">
              <Layers className="w-3.5 h-3.5 text-primary" />
              <span className="font-medium">{product.weight} oz</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/60 border border-border/50">
              <Ruler className="w-3.5 h-3.5 text-primary" />
              <span className="font-medium">{product.pileHeight}&quot; Pile Height</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/60 border border-border/50">
              <Package className="w-3.5 h-3.5 text-primary" />
              <span className="font-medium">{product.rollSize}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted/60 border border-border/50">
              {isPetTurf ? <Dog className="w-3.5 h-3.5 text-primary" /> : <Leaf className="w-3.5 h-3.5 text-primary" />}
              <span className="font-medium">{product.backing}</span>
            </span>
          </div>
        </div>

        <div className="grid gap-6 sm:gap-8 lg:grid-cols-2 lg:items-stretch">
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
                <span className="text-xs font-medium">Fast Shipping</span>
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
                <SpecRow label="Total Weight" value={`${product.weight} oz`} />
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

          {/* Right: Order Configuration */}
          <div className="space-y-3 min-w-0 lg:flex lg:flex-col">
            {/* Order Configuration */}
            <div className="p-3 sm:p-4 rounded-xl border bg-card shadow-sm overflow-hidden lg:flex-1 lg:flex lg:flex-col">
              {/* Card Header */}
              <div className="flex items-center justify-between mb-3 pb-3 border-b">
                <div>
                  <h2 className="text-lg font-bold">Configure Your Order</h2>
                  <p className="text-xs text-muted-foreground">Select your size, cuts & materials</p>
                </div>
                <Scissors className="w-5 h-5 text-muted-foreground/40" />
              </div>
              {/* Step 1: Square Footage Input */}
              <div className="p-3 rounded-lg border bg-emerald-50/50 border-emerald-200/50">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-md bg-emerald-600 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white">1</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold">Enter Square Footage</h4>
                    <p className="text-[11px] text-emerald-700/80">We'll calculate your cuts and materials</p>
                  </div>
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

              {/* Step 2: Cuts Breakdown */}
              <div className="mt-3 p-3 rounded-lg border bg-slate-50/50 border-slate-200/50">
                <button
                  onClick={() => setShowCutsDetail(!showCutsDetail)}
                  className="w-full flex items-center gap-2"
                >
                  <div className="w-6 h-6 rounded-md bg-slate-600 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white">2</span>
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="text-sm font-semibold">Review Your Cuts</h4>
                    <p className="text-[11px] text-slate-600">
                      <span className="font-semibold">{cuts.length} cut{cuts.length !== 1 ? 's' : ''}</span> from <span className="font-semibold">{rollsNeeded} roll{rollsNeeded !== 1 ? 's' : ''}</span>
                      {isEditingCuts ? ' • Custom layout' : ' • Auto-optimized'}
                    </p>
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

                {showCutsDetail && (
                  <div className="mt-3 pt-3 border-t border-slate-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] text-slate-500 font-medium">
                        All cuts are 15ft wide
                      </span>
                      <div className="flex items-center gap-2">
                        {isEditingCuts && (
                          <button
                            type="button"
                            onClick={resetToAutoGenerate}
                            className="text-[10px] text-slate-500 hover:text-slate-700 transition-colors"
                          >
                            Reset to auto
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={addCut}
                          className="text-[10px] text-white bg-primary hover:bg-primary/90 px-2 py-1 rounded font-medium flex items-center gap-0.5 transition-colors"
                        >
                          <Plus className="w-2.5 h-2.5" />
                          Add Cut
                        </button>
                      </div>
                    </div>

                    {/* Table header */}
                    <div className="grid grid-cols-[auto_1fr_auto_auto] gap-x-3 px-2 pb-1.5 border-b text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                      <span>#</span>
                      <span>Dimensions</span>
                      <span className="text-right">Area</span>
                      <span className="w-6"></span>
                    </div>

                    {/* Cut rows - min-height reserves space for 2 cuts to prevent layout shift */}
                    <div className="divide-y min-h-[88px]">
                      {cuts.map((cut, index) => (
                        <div key={cut.id} className="grid grid-cols-[auto_1fr_auto_auto] gap-x-3 items-center px-2 py-2 hover:bg-white/50 transition-colors rounded">
                          <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold flex items-center justify-center">
                            {index + 1}
                          </span>
                          <div className="flex items-center gap-1.5 text-sm">
                            <span className="text-muted-foreground">15′</span>
                            <span className="text-muted-foreground">×</span>
                            <input
                              type="number"
                              value={getCutInputValue(cut)}
                              onChange={(e) => handleCutLengthChange(cut.id, e.target.value)}
                              onBlur={() => handleCutLengthBlur(cut.id)}
                              className="w-12 h-7 text-center font-bold border rounded bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                              min={MIN_CUT_LENGTH}
                              max={ROLL_LENGTH}
                            />
                            <span className="text-muted-foreground">ft</span>
                          </div>
                          <span className="text-sm font-bold text-primary tabular-nums">
                            {(cut.length * ROLL_WIDTH).toLocaleString()} sf
                          </span>
                          <button
                            type="button"
                            onClick={() => removeCut(cut.id)}
                            disabled={cuts.length === 1}
                            className={cn(
                              "w-6 h-6 rounded flex items-center justify-center transition-all",
                              cuts.length === 1
                                ? "text-muted-foreground/20 cursor-not-allowed"
                                : "text-muted-foreground hover:text-red-500 hover:bg-red-50"
                            )}
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Install Package Items - Individual Selection */}
              <div className="mt-3 p-3 rounded-lg border bg-emerald-50/40 border-emerald-200/40">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-md bg-stone-100 flex items-center justify-center">
                    <Package className="w-3.5 h-3.5 text-emerald-700" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-semibold">Add Install Supplies?</h4>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-600/20 hover:bg-emerald-600/30 transition-all duration-200 hover:scale-110"
                              onClick={(e) => e.preventDefault()}
                            >
                              <HelpCircle className="w-4 h-4 text-emerald-700" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="right" align="start" alignOffset={-10} sideOffset={8} className="max-w-[340px] sm:max-w-[420px] p-3 sm:p-4 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
                            <div className="space-y-1.5">
                              <h4 className="font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
                                <span className="text-emerald-400">•</span>
                                Why Install Supplies?
                              </h4>
                              <p className="text-[11px] sm:text-xs text-white/80 leading-snug">
                                These supplies are essential for a professional installation. Infill keeps turf blades upright and adds cushioning. Weed barrier prevents growth underneath. Nails secure edges and seams. Quantities are auto-calculated for your project size.
                              </p>
                              <p className="text-[10px] text-white/50 italic pt-1 border-t border-white/10">
                                All items are optional but highly recommended for best results
                              </p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <p className="text-[11px] text-stone-600">
                      Qty auto-calculated for your <span className="font-semibold">{squareFootage.toLocaleString()} sq ft</span> project
                    </p>
                  </div>
                  {packageItems.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        const allSelected = packageItems.every(item => selectedPackageItems[item.accessory.handle]);
                        const newState: Record<string, boolean> = {};
                        packageItems.forEach(item => {
                          newState[item.accessory.handle] = !allSelected;
                        });
                        setSelectedPackageItems(newState);
                      }}
                      className="text-[10px] text-emerald-700 hover:text-emerald-800 font-medium transition-colors px-2 py-1 rounded bg-stone-100 hover:bg-stone-200"
                    >
                      {packageItems.every(item => selectedPackageItems[item.accessory.handle]) ? 'Deselect All' : 'Select All'}
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {packageItems.map((item) => {
                    const isSelected = selectedPackageItems[item.accessory.handle] || false;
                    const currentQty = getItemQuantity(item.accessory.handle, item.recommendedQty);
                    const isCustomQty = packageItemQuantities[item.accessory.handle] !== undefined &&
                                        packageItemQuantities[item.accessory.handle] !== item.recommendedQty;
                    const itemTotal = item.accessory.priceCents * currentQty;

                    return (
                      <div
                        key={item.accessory.id}
                        className={cn(
                          "flex items-center gap-2 p-2 rounded-lg border transition-all",
                          isSelected
                            ? "border-primary bg-primary/5"
                            : "border-muted hover:border-primary/30"
                        )}
                      >
                        {/* Checkbox */}
                        <label className="cursor-pointer flex-shrink-0">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => setSelectedPackageItems(prev => ({
                              ...prev,
                              [item.accessory.handle]: e.target.checked
                            }))}
                            className="sr-only"
                          />
                          <div className={cn(
                            "w-4 h-4 rounded border-2 flex items-center justify-center transition-all",
                            isSelected
                              ? "bg-primary border-primary"
                              : "border-muted-foreground/30"
                          )}>
                            {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                          </div>
                        </label>

                        {/* Image */}
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

                        {/* Name & note */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-medium truncate">{item.accessory.name}</span>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    type="button"
                                    className="inline-flex items-center justify-center w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-full bg-emerald-600/20 hover:bg-emerald-600/30 transition-all duration-200 hover:scale-110 flex-shrink-0"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                    }}
                                  >
                                    <HelpCircle className="w-3.5 h-3.5 text-emerald-700" />
                                  </button>
                                </TooltipTrigger>
                                <TooltipContent side="right" align="start" alignOffset={-10} sideOffset={8} className="max-w-[280px] sm:max-w-[340px] p-3 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
                                  <div className="space-y-1">
                                    <h4 className="font-bold text-xs text-white flex items-center gap-1.5">
                                      <span className="text-emerald-400">•</span>
                                      {getSupplyTooltip(item.accessory.handle).title}
                                    </h4>
                                    <p className="text-[10px] sm:text-[11px] text-white/80 leading-snug">
                                      {getSupplyTooltip(item.accessory.handle).description}
                                    </p>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <span className="text-[10px] text-muted-foreground">{item.note}</span>
                        </div>

                        {/* Quantity controls - always visible */}
                        <div className="flex items-center border rounded bg-white">
                          <button
                            type="button"
                            onClick={() => updateItemQuantity(item.accessory.handle, currentQty - 1)}
                            disabled={currentQty <= 1}
                            className="w-6 h-6 flex items-center justify-center hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold tabular-nums">{currentQty}</span>
                          <button
                            type="button"
                            onClick={() => updateItemQuantity(item.accessory.handle, currentQty + 1)}
                            className="w-6 h-6 flex items-center justify-center hover:bg-muted transition-colors"
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                        </div>

                        {/* Price */}
                        <span className="text-xs font-semibold text-primary flex-shrink-0 min-w-[50px] text-right">
                          {formatPrice(itemTotal)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Order Summary & Add to Cart */}
              <div className="mt-3 p-3 rounded-lg border bg-blue-50/50 border-blue-200/50 lg:mt-auto">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white">3</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold">Review & Add to Cart</h4>
                    <p className="text-[11px] text-blue-700/80">Your order summary</p>
                  </div>
                </div>

                {/* Summary Stats - Inline */}
                <div className="flex items-center justify-between text-[10px] sm:text-xs mb-2 gap-1 p-2 rounded bg-white/60">
                  <span className="text-muted-foreground">Need: <span className="font-semibold text-foreground">{squareFootage.toLocaleString()}</span></span>
                  <span className="text-muted-foreground">Get: <span className="font-semibold text-primary">{totalSquareFeet.toLocaleString()}</span></span>
                  <span className="text-muted-foreground">Rolls: <span className="font-semibold text-foreground">{rollsNeeded}</span></span>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Turf ({totalSquareFeet} sf)</span>
                    <span className="font-medium">{formatPrice(turfPriceCents)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Install Items</span>
                    <span className="font-medium">{formatPrice(packageTotalCents)}</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center pt-2 border-t border-blue-200/50 mt-2">
                  <span className="text-sm font-medium text-foreground">Total</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-green-600">
                      ${totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Add to Cart Button */}
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
            <SpecRow label="Total Weight" value={`${product.weight} oz`} />
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

        {/* Installation Guide Snippet */}
        <Link href="/installation" className="block mt-12 group">
          <div className="p-6 lg:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-white/[0.06] shadow-2xl hover:border-white/[0.1] transition-all">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-xl lg:text-2xl font-bold text-white">
                  Installation Guide
                </h2>
                <p className="text-sm text-white/40 mt-0.5">7 steps to a perfect lawn</p>
              </div>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold group-hover:bg-primary/90 transition-all">
                View Full Guide
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 lg:gap-4">
              {[
                { step: 1, title: "Remove Grass", desc: "Clear existing lawn and debris", image: "/installation.step1.webp" },
                { step: 2, title: "Add Base", desc: "Spread and compact road base", image: "/installation.step2.webp" },
                { step: 3, title: "Lay Turf", desc: "Roll out and position turf", image: "/installation.step3.webp" },
                { step: 4, title: "Cut to Fit", desc: "Trim edges with razor knife", image: "/installation.step4.webp" },
                { step: 5, title: "Secure", desc: "Nail perimeter and seams", image: "/installation.step5.webp" },
                { step: 6, title: "Add Infill", desc: "Spread infill evenly", image: "/installation.step6.webp" },
                { step: 7, title: "Brush", desc: "Brush fibers upright", image: "/installation.step7.webp" },
              ].map((item) => (
                <div key={item.step} className="relative rounded-xl aspect-[3/4]">
                  <div className="absolute inset-0 rounded-xl overflow-hidden ring-1 ring-white/10">
                    <Image
                      src={item.image}
                      alt={`Step ${item.step}: ${item.title}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 14vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/5" />
                  </div>
                  <div className="absolute -top-2.5 -left-2.5 w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-gradient-to-br from-emerald-400 to-primary shadow-[0_2px_12px_rgba(16,185,129,0.4)] flex items-center justify-center ring-1 ring-white/20">
                    <span className="font-extrabold text-white text-base lg:text-lg">{item.step}</span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="font-semibold text-white text-sm leading-tight mb-0.5">{item.title}</h3>
                    <p className="text-[11px] text-white/50 leading-snug">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Link>

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
