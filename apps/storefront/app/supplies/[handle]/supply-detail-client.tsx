"use client";

import { useState } from "react";
import NextImage from "next/image";
import NextLink from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Shield,
  Truck,
  Sparkles,
  Minus,
  Plus,
  ShoppingCart,
  Info,
} from "lucide-react";
import { Button as ShadcnButton } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { formatPrice, cn } from "@/lib/utils";
import { type Accessory } from "@/lib/products";
import { useCartStore } from "@/lib/store";

// Cast to work around React 19 JSX type incompatibility with Radix UI / Shadcn / Next.js
const Button = ShadcnButton as any;
const Image = NextImage as any;
const Link = NextLink as any;

interface SupplyDetailClientProps {
  accessory: Accessory;
  relatedAccessories: Accessory[];
}

export default function SupplyDetailClient({ accessory, relatedAccessories }: SupplyDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();

  const handleAddToCart = () => {
    if (!accessory) return;
    addItem({
      id: `${accessory.id}-${Date.now()}`,
      productId: accessory.id,
      variantId: accessory.id,
      title: accessory.name,
      thumbnail: accessory.images[0] || null,
      quantity: quantity,
      unitPrice: accessory.priceCents,
    });
  };

  const totalPrice = (accessory.priceCents * quantity) / 100;

  // Category display names
  const categoryDisplayNames: Record<Accessory["category"], string> = {
    infill: "Infill",
    seaming: "Seaming Supplies",
    installation: "Installation",
    tools: "Tools & Accessories",
  };

  // Usage info based on category
  const getUsageInfo = () => {
    switch (accessory.category) {
      case "infill":
        return {
          title: "Application Guide",
          items: [
            "Apply 1-2 lbs per sq ft for standard installations",
            "Use a drop spreader for even distribution",
            "Brush turf fibers upright after application",
            "Top up annually to maintain blade support",
          ],
        };
      case "seaming":
        return {
          title: "Installation Tips",
          items: [
            "Fold back turf edges to expose seam area",
            "Apply tape with adhesive side up",
            "Spread turf adhesive evenly on tape",
            "Press turf edges firmly into adhesive",
          ],
        };
      case "installation":
        return {
          title: "Usage Guidelines",
          items: [
            "Install base materials before laying turf",
            "Ensure proper drainage slope (1% grade)",
            "Secure edges every 6 inches with nails",
            "Allow turf to acclimate before final trimming",
          ],
        };
      case "tools":
        return {
          title: "Pro Tips",
          items: [
            "Use proper safety equipment during installation",
            "Maintain tools for best performance",
            "Follow manufacturer guidelines",
            "Store in dry conditions",
          ],
        };
    }
  };

  const usageInfo = getUsageInfo();

  return (
    <div className="min-h-screen">
      <Breadcrumb items={[
        { label: "Supplies", href: "/supplies" },
        { label: accessory.name }
      ]} />

      <div className="container py-8 md:py-12">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left: Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden rounded-3xl bg-gradient-to-br from-slate-100 via-gray-100 to-slate-200 border">
              {accessory.images[selectedImage] && (
                <Image
                  src={accessory.images[selectedImage]}
                  alt={accessory.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              )}

              {/* Badge */}
              {accessory.badge && (
                <div className="absolute top-4 left-4 z-10">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold text-white shadow-lg",
                      accessory.badgeColor || "bg-primary"
                    )}
                  >
                    <Sparkles className="w-4 h-4" />
                    {accessory.badge}
                  </span>
                </div>
              )}

              {/* Navigation arrows */}
              {accessory.images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setSelectedImage((prev) =>
                        prev === 0 ? accessory.images.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      setSelectedImage((prev) =>
                        prev === accessory.images.length - 1 ? 0 : prev + 1
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
            {accessory.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {accessory.images.map((image, index) => (
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
                      alt={`${accessory.name} view ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Trust Badges */}
            <div className="hidden lg:grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/50">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Truck className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Fast Shipping</p>
                  <p className="text-xs text-muted-foreground">
                    Nationwide delivery
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/50">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Quality Guarantee</p>
                  <p className="text-xs text-muted-foreground">Pro-grade materials</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="space-y-6">
            {/* Category Badge */}
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                {categoryDisplayNames[accessory.category]}
              </span>
              {accessory.inStock && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 flex items-center gap-1">
                  <Check className="w-3 h-3" /> In Stock
                </span>
              )}
            </div>

            {/* Title + Price Row */}
            <div className="flex flex-row items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">{accessory.name}</h1>
                {accessory.size && <p className="mt-2 text-muted-foreground">{accessory.size}</p>}
              </div>
              <div className="flex-shrink-0">
                {accessory.comparePriceCents && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs sm:text-base text-slate-400 line-through">
                      {formatPrice(accessory.comparePriceCents)}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-rose-600 bg-rose-50 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded">
                      {Math.round((1 - accessory.priceCents / accessory.comparePriceCents) * 100)}% OFF
                    </span>
                  </div>
                )}
                <div className="flex items-baseline gap-2">
                  <span className={cn(
                    "text-2xl sm:text-4xl font-bold",
                    accessory.comparePriceCents
                      ? "text-rose-600"
                      : "text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-600"
                  )}>
                    {formatPrice(accessory.priceCents)}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-muted-foreground leading-relaxed">
              {accessory.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {accessory.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-muted text-xs font-medium capitalize"
                >
                  {tag.replace(/-/g, " ")}
                </span>
              ))}
            </div>

            {/* Quantity Selector */}
            <div className="p-6 rounded-2xl border bg-card">
              <label className="block text-sm font-medium mb-3">Quantity</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-20 h-12 text-center text-lg font-semibold border-x bg-transparent focus:outline-none"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center hover:bg-muted transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="mt-6 pt-6 border-t flex items-center justify-between">
                <span className="text-muted-foreground">Total</span>
                <span className="text-3xl font-bold">
                  ${totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              {/* Add to Cart */}
              <Button
                size="lg"
                variant="premium"
                className="w-full mt-6 h-14 text-lg"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>

              <p className="text-center text-sm text-muted-foreground mt-4">
                Fast nationwide shipping
              </p>
            </div>

            {/* Mobile Trust Badges */}
            <div className="grid grid-cols-2 gap-3 lg:hidden">
              <div className="text-center p-3 rounded-xl bg-muted/50">
                <Truck className="w-5 h-5 text-primary mx-auto mb-1" />
                <p className="text-xs font-medium">Fast Shipping</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-muted/50">
                <Shield className="w-5 h-5 text-primary mx-auto mb-1" />
                <p className="text-xs font-medium">Quality Guarantee</p>
              </div>
            </div>

            {/* Calculator Link */}
            <Link
              href="/calculator"
              className="flex items-center justify-between p-4 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Not sure how much you need?</p>
                  <p className="text-sm text-muted-foreground">
                    Our calculator tells you exactly what to order
                  </p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-primary" />
            </Link>
          </div>
        </div>

        {/* Usage Info Section */}
        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {/* Usage Guide */}
          <div className="p-8 rounded-3xl bg-card border">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Info className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">{usageInfo.title}</h2>
            </div>
            <ul className="space-y-4">
              {usageInfo.items.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-primary">
                      {index + 1}
                    </span>
                  </div>
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Details */}
          <div className="p-8 rounded-3xl bg-muted/30 border">
            <h2 className="text-xl font-bold mb-4">Product Details</h2>
            <div className="space-y-4">
              <div className="flex justify-between py-3 border-b">
                <span className="text-muted-foreground">Size</span>
                <span className="font-medium">{accessory.size}</span>
              </div>
              <div className="flex justify-between py-3 border-b">
                <span className="text-muted-foreground">Category</span>
                <span className="font-medium capitalize">{accessory.category}</span>
              </div>
              <div className="flex justify-between py-3 border-b">
                <span className="text-muted-foreground">SKU</span>
                <span className="font-medium uppercase">{accessory.handle}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="text-muted-foreground">Availability</span>
                <span className="font-medium text-green-600">In Stock</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedAccessories.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Related Supplies</h2>
              <Button variant="outline" asChild>
                <Link href="/supplies">
                  View All Supplies
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedAccessories.map((related) => (
                <Link
                  key={related.id}
                  href={`/supplies/${related.handle}`}
                  className="group"
                >
                  <div className="rounded-2xl border overflow-hidden bg-white hover:shadow-xl transition-all hover:-translate-y-1">
                    <div className="relative aspect-square bg-gradient-to-br from-slate-100 to-gray-100">
                      {related.images[0] && (
                        <Image
                          src={related.images[0]}
                          alt={related.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 640px) 100vw, 25vw"
                        />
                      )}
                      {related.badge && (
                        <span
                          className={cn(
                            "absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-bold text-white",
                            related.badgeColor || "bg-primary"
                          )}
                        >
                          {related.badge}
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-1">
                        {related.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {related.size}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-lg font-bold text-primary">
                          {formatPrice(related.priceCents)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* CTA Banner */}
        <div className="mt-16 pt-16 border-t text-center">
          <h2 className="max-w-3xl mx-auto">
            Need Help With Your Project?
          </h2>
          <p className="mt-6 text-body-lg text-muted-foreground max-w-xl mx-auto">
            Our project calculator can help you determine exactly how much of
            each supply you need for your turf installation.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="btn-premium text-lg px-8 h-14" asChild>
              <Link href="/calculator">
                Try the Calculator
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 h-14" asChild>
              <Link href="/products">Shop Turf</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
