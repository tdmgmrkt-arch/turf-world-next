"use client";

import { useState, useEffect } from "react";
import NextLink from "next/link";
import NextImage from "next/image";
import {
  Check,
  X,
  Package,
  ArrowRight,
  Mail,
  MapPin,
  User,
  Sparkles,
  PartyPopper,
  Loader2,
  ChevronLeft,
  Star,
  Phone,
  CheckSquare,
} from "lucide-react";
import { Button as ShadcnButton } from "@/components/ui/button";
import { Input as ShadcnInput } from "@/components/ui/input";
import { Label as ShadcnLabel } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { PRODUCTS } from "@/lib/products";

// Cast to work around React 19 JSX type incompatibility with Radix UI / Shadcn / Next.js
const Button = ShadcnButton as any;
const Input = ShadcnInput as any;
const Label = ShadcnLabel as any;
const Link = NextLink as any;
const Image = NextImage as any;

type Step = "select" | "details" | "confirm";

export function SampleBoxBuilder() {
  const [step, setStep] = useState<Step>("select");
  const [selectedSamples, setSelectedSamples] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    email: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleSample = (id: string) => {
    if (selectedSamples.includes(id)) {
      setSelectedSamples(selectedSamples.filter((s) => s !== id));
    } else {
      setSelectedSamples([...selectedSamples, id]);
    }
  };

  const selectAll = () => {
    setSelectedSamples(PRODUCTS.map((p) => p.id));
  };

  const clearAll = () => {
    setSelectedSamples([]);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // TODO: Submit to backend/email service
    await new Promise((r) => setTimeout(r, 1500));
    setStep("confirm");
    setIsSubmitting(false);
  };

  const selectedProducts = PRODUCTS.filter((p) =>
    selectedSamples.includes(p.id)
  );

  // Scroll to top when step changes (mobile UX improvement)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  const isFormValid =
    formData.firstName &&
    formData.lastName &&
    formData.address &&
    formData.city &&
    formData.state &&
    formData.postalCode &&
    formData.email &&
    formData.phone;

  if (step === "confirm") {
    return (
      <div className="max-w-lg mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-white border border-border/50 shadow-2xl">
          {/* Celebration decoration */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-emerald-500 to-primary" />
          <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl" />

          <div className="relative p-8 md:p-12 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-emerald-600 shadow-xl shadow-primary/30">
              <PartyPopper className="h-10 w-10 text-white" />
            </div>

            <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
              Samples on the Way!
            </h2>
            <p className="mt-3 text-muted-foreground">
              We&apos;ve sent a confirmation to <span className="font-medium text-foreground">{formData.email}</span>.
              Your samples will arrive in 3-5 business days.
            </p>

            <div className="mt-8 rounded-2xl bg-gradient-to-br from-muted/50 to-muted p-6">
              <p className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Your Sample Box ({selectedProducts.length} samples)
              </p>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {selectedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white shadow-sm"
                  >
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                      {product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-green-600" />
                      )}
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-sm">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.weight}oz • {product.pileHeight}" pile</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button variant="premium" size="lg" className="mt-8 w-full h-14" asChild>
              <Link href="/products">
                Browse Full Catalog
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Floating Sample Bar - shows at bottom on mobile when samples selected */}
      {step === "select" && selectedSamples.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-gradient-to-t from-slate-900 via-slate-900 to-slate-900/95 backdrop-blur-sm border-t border-white/10 p-4 shadow-2xl">
          <div className="container flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{selectedSamples.length} sample{selectedSamples.length !== 1 ? 's' : ''} selected</p>
                <p className="text-white/50 text-xs">Fast shipping included</p>
              </div>
            </div>
            <Button
              variant="premium"
              size="default"
              className="h-11 px-6"
              onClick={() => setStep("details")}
            >
              Continue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Mobile Form Submit Bar - shows at bottom when on details step */}
      {step === "details" && (
        <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-gradient-to-t from-slate-900 via-slate-900 to-slate-900/95 backdrop-blur-sm border-t border-white/10 p-4 shadow-2xl">
          <div className="container flex items-center justify-between gap-4">
            <button
              onClick={() => setStep("select")}
              className="flex items-center gap-1 text-white/70 hover:text-white text-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            <Button
              variant="premium"
              size="default"
              className="h-11 px-6 flex-1 max-w-[200px]"
              onClick={handleSubmit}
              disabled={isSubmitting || !isFormValid}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Order Samples
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-5 pb-24 lg:pb-0">
        {/* Left: Sample Selection / Form */}
        <div className="lg:col-span-4">
        {step === "select" ? (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-bold">Choose Your Samples</h2>
                <p className="text-muted-foreground mt-1">Select as many turf samples as you&apos;d like</p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={selectedSamples.length === PRODUCTS.length ? clearAll : selectAll}
                  className="h-10 rounded-xl"
                >
                  <CheckSquare className="w-4 h-4 mr-2" />
                  {selectedSamples.length === PRODUCTS.length ? "Clear All" : "Select All"}
                </Button>
                <div className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm transition-all",
                  selectedSamples.length > 0
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground"
                )}>
                  <Package className="w-4 h-4" />
                  {selectedSamples.length} selected
                </div>
              </div>
            </div>

            {/* Sample Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {PRODUCTS.map((product) => {
                const isSelected = selectedSamples.includes(product.id);

                return (
                  <button
                    key={product.id}
                    onClick={() => toggleSample(product.id)}
                    className={cn(
                      "group relative rounded-2xl border-2 p-4 text-left transition-all duration-300",
                      isSelected
                        ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                        : "border-border/50 bg-white hover:border-primary/30 hover:shadow-md"
                    )}
                  >
                    {/* Selection indicator */}
                    <div
                      className={cn(
                        "absolute right-3 top-3 z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all duration-200",
                        isSelected
                          ? "border-primary bg-primary text-white"
                          : "border-slate-300 bg-white group-hover:border-primary/50"
                      )}
                    >
                      {isSelected && <Check className="h-3.5 w-3.5" />}
                    </div>

                    {/* Sample preview */}
                    <div className={cn(
                      "relative mb-3 h-24 w-full rounded-xl overflow-hidden shadow-md transition-transform duration-300",
                      isSelected && "scale-[1.02]"
                    )}>
                      {product.images[0] ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-green-600" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    </div>

                    {/* Details */}
                    <div className="space-y-1">
                      <p className="font-semibold pr-6 text-sm line-clamp-1">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.weight}oz • {product.pileHeight}" pile
                      </p>
                      <span
                        className={cn(
                          "inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide",
                          product.category === "pet" && "bg-amber-100 text-amber-700",
                          product.category === "putting" && "bg-blue-100 text-blue-700",
                          product.category === "landscape" && "bg-emerald-100 text-emerald-700"
                        )}
                      >
                        {product.category === "pet" ? "Pet Turf" : product.category === "putting" ? "Putting Green" : "Landscape"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-white border border-border/50 shadow-xl overflow-hidden">
            {/* Form Header */}
            <div className="p-6 bg-gradient-to-r from-slate-900 to-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Shipping Details</h3>
                  <p className="text-white/60 text-sm">Where should we send your samples?</p>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-6 space-y-5">
              {/* Name Row */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    First Name *
                  </Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="John"
                    className="h-12 rounded-xl border-border/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium">
                    Last Name *
                  </Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Smith"
                    className="h-12 rounded-xl border-border/50"
                    required
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  Address *
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="123 Main St"
                  className="h-12 rounded-xl border-border/50"
                  required
                />
              </div>

              {/* City, State, Postal Code */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm font-medium">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Los Angeles"
                    className="h-12 rounded-xl border-border/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-sm font-medium">State *</Label>
                  <Input
                    id="state"
                    value={formData.state}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, state: e.target.value })}
                    placeholder="CA"
                    maxLength={2}
                    className="h-12 rounded-xl border-border/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode" className="text-sm font-medium">Postal Code *</Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, postalCode: e.target.value })}
                    placeholder="90210"
                    className="h-12 rounded-xl border-border/50"
                    required
                  />
                </div>
              </div>

              {/* Email and Phone */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    className="h-12 rounded-xl border-border/50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    Phone *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(555) 123-4567"
                    className="h-12 rounded-xl border-border/50"
                    required
                  />
                </div>
              </div>

              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <Star className="w-3 h-3 text-amber-500" />
                We&apos;ll send you project tips and exclusive offers. Unsubscribe anytime.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Right: Sample Box Summary */}
      <div>
        <div className="sticky top-24">
          <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Your Sample Box</h3>
                  <p className="text-white/60 text-sm">{selectedSamples.length} samples selected</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {selectedSamples.length === 0 ? (
                <div className="h-[550px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto rounded-full bg-white/10 flex items-center justify-center mb-4">
                      <Sparkles className="w-8 h-8 text-white/40" />
                    </div>
                    <p className="text-white/60">No samples selected</p>
                    <p className="text-white/40 text-sm mt-1">Click on the turf samples you want</p>
                  </div>
                </div>
              ) : (
                <ul className="space-y-2 h-[550px] overflow-y-auto">
                  {selectedProducts.map((product) => (
                    <li
                      key={product.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 rounded-lg overflow-hidden shadow-lg flex-shrink-0">
                          {product.images[0] ? (
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-green-600" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white truncate">{product.name}</p>
                          <p className="text-xs text-white/50">{product.weight}oz</p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleSample(product.id)}
                        className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-red-500/20 hover:text-red-400 transition-colors flex-shrink-0"
                        aria-label={`Remove ${product.name}`}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {/* Total */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-white/80 font-medium">Total</span>
                  <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">
                    FREE
                  </span>
                </div>
                <p className="mt-1 text-xs text-white/40">
                  Fast shipping included
                </p>
              </div>

              {/* Actions */}
              {step === "select" ? (
                <Button
                  variant="premium"
                  size="lg"
                  className="mt-6 w-full h-14"
                  disabled={selectedSamples.length === 0}
                  onClick={() => setStep("details")}
                >
                  Continue
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              ) : (
                <div className="mt-6 space-y-3">
                  <Button
                    variant="premium"
                    size="lg"
                    className="w-full h-14"
                    onClick={handleSubmit}
                    disabled={isSubmitting || !isFormValid}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Order Free Samples
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="lg"
                    className="w-full h-12 text-white/70 hover:text-white hover:bg-white/10"
                    onClick={() => setStep("select")}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back to Selection
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Trust badges */}
          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              No Credit Card
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Fast Shipping
            </span>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
