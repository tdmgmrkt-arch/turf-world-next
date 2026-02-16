"use client";

import { useState, useEffect } from "react";
import NextLink from "next/link";
import NextImage from "next/image";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  CreditCard,
  Truck,
  User,
  Check,
  ShoppingBag,
  Lock,
  AlertCircle,
  Loader2,
  ArrowRight,
  Package,
  Sparkles,
  Award,
  MapPin,
  Mail,
  Phone,
  Zap,
} from "lucide-react";
import { Button as ShadcnButton } from "@/components/ui/button";
import { Input as ShadcnInput } from "@/components/ui/input";
import { useAuthStore } from "@/lib/auth-store";
import { medusa } from "@/lib/medusa";
import { Label as ShadcnLabel } from "@/components/ui/label";
import { StripeProvider } from "@/components/stripe-provider";
import { useCartStore } from "@/lib/store";
import { useMedusaCart } from "@/hooks/use-medusa-cart";
import { formatPrice, cn } from "@/lib/utils";
import { isSoCalZipCode } from "@/lib/socal-zipcodes";
import { getEligibleWillCallLocations, WILL_CALL_LOCATIONS } from "@/lib/will-call-locations";
import type { CartItem } from "@/types";

// Cast to work around React 19 JSX type incompatibility with Radix UI / Shadcn / Next.js
const Button = ShadcnButton as any;
const Input = ShadcnInput as any;
const Label = ShadcnLabel as any;
const Link = NextLink as any;
const Image = NextImage as any;

type Step = "information" | "shipping" | "payment" | "confirmation";

const STEPS: { id: Step; label: string; icon: React.ReactNode }[] = [
  { id: "information", label: "Information", icon: <User className="h-4 w-4" /> },
  { id: "shipping", label: "Shipping", icon: <Truck className="h-4 w-4" /> },
  { id: "payment", label: "Payment", icon: <CreditCard className="h-4 w-4" /> },
  { id: "confirmation", label: "Confirmed", icon: <Check className="h-4 w-4" /> },
];

// Shipping pricing constants (all values in cents)
const SHIPPING_CAP = 15000; // $150 — percentage-based options hidden above this (SoCal only)
const NEXT_DAY_FLAT_RATE = 15000; // $150 flat rate for SoCal next-day shipping

type ShippingOption = {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
  note: string | null;
  icon: any;
};

function getShippingOptions(zip: string, subtotal: number, cartItems: CartItem[]): ShippingOption[] {
  const socal = isSoCalZipCode(zip);
  const options: ShippingOption[] = [];

  if (socal) {
    // Will-call pickup — free, SoCal only
    const eligibleLocations = getEligibleWillCallLocations(cartItems);
    for (const loc of eligibleLocations) {
      options.push({
        id: loc.id,
        name: `Free Will Call — ${loc.name}`,
        description: `${loc.address}, ${loc.city}, ${loc.state} ${loc.zip}`,
        price: 0,
        estimatedDays: "Ready within 1 business day",
        note: "Free pickup",
        icon: MapPin,
      });
    }

    // SoCal: Next-day $150 flat, LTL 10%, Expedited 20%
    options.push({
      id: "nextday",
      name: "Next Day Shipping",
      description: "SoCal residents — next business day delivery",
      price: NEXT_DAY_FLAT_RATE,
      estimatedDays: "Next business day",
      note: "SoCal flat rate",
      icon: Zap,
    });

    const ltlPrice = Math.round(subtotal * 0.10);
    if (ltlPrice <= SHIPPING_CAP) {
      options.push({
        id: "freight",
        name: "LTL Freight",
        description: "For turf rolls — delivered to your driveway",
        price: ltlPrice,
        estimatedDays: "5–10 business days",
        note: null,
        icon: Truck,
      });
    }

    const expeditedPrice = Math.round(subtotal * 0.20);
    if (expeditedPrice <= SHIPPING_CAP) {
      options.push({
        id: "expedited",
        name: "Expedited Freight",
        description: "Faster delivery for urgent projects",
        price: expeditedPrice,
        estimatedDays: "3–5 business days",
        note: null,
        icon: Package,
      });
    }
  } else {
    // Non-SoCal: LTL 10% (default), Expedited 25%, Next-day 40%
    options.push({
      id: "freight",
      name: "LTL Freight",
      description: "For turf rolls — delivered to your driveway",
      price: Math.round(subtotal * 0.10),
      estimatedDays: "5–10 business days",
      note: null,
      icon: Truck,
    });

    options.push({
      id: "expedited",
      name: "Expedited Freight",
      description: "Faster delivery for urgent projects",
      price: Math.round(subtotal * 0.25),
      estimatedDays: "3–5 business days",
      note: null,
      icon: Package,
    });

    options.push({
      id: "nextday",
      name: "Next Day Shipping",
      description: "Priority next business day delivery",
      price: Math.round(subtotal * 0.40),
      estimatedDays: "Next business day",
      note: null,
      icon: Zap,
    });
  }

  // Always sort cheapest first — auto-select picks [0] (cheapest)
  options.sort((a, b) => a.price - b.price);
  return options;
}

// Inner payment form component (uses Stripe hooks)
function PaymentForm({
  onSuccess,
  onBack,
  total,
  isProcessing,
  setIsProcessing,
}: {
  onSuccess: (orderId: string) => void;
  onBack: () => void;
  total: number;
  isProcessing: boolean;
  setIsProcessing: (v: boolean) => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { completeCheckout } = useMedusaCart();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation`,
        },
        redirect: "if_required",
      });

      if (stripeError) {
        setErrorMessage(stripeError.message || "Payment failed");
        setIsProcessing(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === "succeeded") {
        const order = await completeCheckout();
        if (order) {
          onSuccess(order.id);
        } else {
          onSuccess(paymentIntent.id);
        }
      }
    } catch (err) {
      console.error("Payment error:", err);
      setErrorMessage("An unexpected error occurred");
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Payment Details</h2>
              <p className="text-sm text-white/60">All transactions are secure and encrypted</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="rounded-xl border border-slate-200 p-4 bg-slate-50">
            <PaymentElement options={{ layout: "tabs" }} />
          </div>

          {errorMessage && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-4 rounded-xl border border-red-100">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {errorMessage}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              disabled={isProcessing}
              className="h-12 px-6 rounded-xl"
            >
              Back
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-base font-semibold"
              disabled={!stripe || !elements || isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Pay {formatPrice(total)}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

export function CheckoutForm() {
  const { items, getSubtotal, clearCart } = useCartStore();
  const {
    cart: medusaCart,
    updateShippingAddress,
    createPaymentSession,
    syncLocalCartToMedusa,
    addShippingMethod,
  } = useMedusaCart();

  const [currentStep, setCurrentStep] = useState<Step>("information");
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isInitializingPayment, setIsInitializingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<{
    items: typeof items;
    subtotal: number;
    shippingCost: number;
    tax: number;
    total: number;
    selectedShipping: string;
  } | null>(null);

  // Form state
  const { isAuthenticated, customer } = useAuthStore();
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [useNewAddress, setUseNewAddress] = useState(false);
  const [saveNewAddress, setSaveNewAddress] = useState(true);
  const [newAddressLabel, setNewAddressLabel] = useState("");

  const applyAddress = (addr: any) => {
    setShipping({
      firstName: addr.first_name || "",
      lastName: addr.last_name || "",
      company: addr.company || "",
      address: addr.address_1 || "",
      apartment: addr.address_2 || "",
      city: addr.city || "",
      state: addr.province || "",
      zip: addr.postal_code || "",
    });
  };

  // If logged in, pre-fill contact email and fetch saved addresses
  useEffect(() => {
    if (isAuthenticated && customer) {
      setContact((prev) => ({
        email: prev.email || customer.email || "",
        phone: prev.phone || customer.phone || "",
      }));
      // Fetch saved addresses and auto-fill the first one
      medusa.store.customer.listAddress()
        .then((res: any) => {
          const addrs = res.addresses || [];
          setSavedAddresses(addrs);
          if (addrs.length > 0) {
            setSelectedAddressId(addrs[0].id);
            applyAddress(addrs[0]);
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated, customer]);

  const [contact, setContact] = useState({ email: "", phone: "" });
  const [shipping, setShipping] = useState({
    firstName: "",
    lastName: "",
    company: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zip: "",
  });
  const [selectedShipping, setSelectedShipping] = useState("");

  const subtotal = getSubtotal();
  const shippingOptions = getShippingOptions(shipping.zip, subtotal, items);

  // Always auto-select cheapest (first) option when zip, cart, or subtotal changes
  useEffect(() => {
    if (shippingOptions.length > 0) {
      setSelectedShipping(shippingOptions[0].id);
    }
  }, [shipping.zip, subtotal, items]);

  // Scroll to top when step changes (mobile UX improvement)
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  const shippingCost = shippingOptions.find((o) => o.id === selectedShipping)?.price || 0;
  // Use Medusa's calculated tax if available, otherwise 0 (tax calculated after shipping address is set)
  const tax = medusaCart?.tax_total || 0;
  const total = subtotal + shippingCost + tax;

  // Initialize payment session when reaching payment step
  useEffect(() => {
    if (currentStep === "payment" && !clientSecret && !isInitializingPayment) {
      initializePayment();
    }
  }, [currentStep, clientSecret, isInitializingPayment]);

  const initializePayment = async () => {
    setIsInitializingPayment(true);
    setPaymentError(null);
    try {
      // Step 1: Sync local cart items to Medusa with cut dimension metadata
      await syncLocalCartToMedusa(items);

      // Step 2: Update shipping address
      await updateShippingAddress({
        first_name: shipping.firstName,
        last_name: shipping.lastName,
        address_1: shipping.address,
        address_2: shipping.apartment || undefined,
        city: shipping.city,
        province: shipping.state,
        postal_code: shipping.zip,
        country_code: "us",
        phone: contact.phone || undefined,
      });

      // Step 3: Add Medusa shipping method (required for payment collection)
      await addShippingMethod();

      // Step 4: Create payment session
      const secret = await createPaymentSession();
      if (secret) {
        setClientSecret(secret);
      } else {
        setPaymentError("Unable to initialize payment. Please try again.");
      }
    } catch (err) {
      console.error("Failed to initialize payment:", err);
      setPaymentError("Unable to initialize payment. Please try again.");
    } finally {
      setIsInitializingPayment(false);
    }
  };

  const handlePaymentSuccess = (newOrderId: string) => {
    // Store order data before clearing cart
    setCompletedOrder({
      items: [...items],
      subtotal,
      shippingCost,
      tax,
      total,
      selectedShipping,
    });
    setOrderId(newOrderId);
    setCurrentStep("confirmation");
    clearCart();
  };

  // Empty Cart State (but not if we have a completed order to show)
  if (items.length === 0 && !completedOrder) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="relative">
          <div className="h-24 w-24 rounded-full bg-slate-100 flex items-center justify-center">
            <ShoppingBag className="h-12 w-12 text-slate-300" />
          </div>
          <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-emerald-600" />
          </div>
        </div>
        <h2 className="mt-6 text-2xl font-bold text-slate-900">Your cart is empty</h2>
        <p className="mt-2 text-muted-foreground max-w-sm">
          Add some premium artificial turf to your cart before checking out.
        </p>
        <Button className="mt-6 h-12 px-8 rounded-xl" asChild>
          <Link href="/products">
            Browse Products
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Step Indicator - Full Width */}
      <div className="mb-8 flex items-center justify-between">
        {STEPS.map((step, index) => {
          const stepIndex = STEPS.findIndex((s) => s.id === currentStep);
          const isActive = step.id === currentStep;
          const isCompleted = stepIndex > index;

          return (
            <div key={step.id} className="flex items-center flex-1">
              <button
                onClick={() => isCompleted && setCurrentStep(step.id)}
                disabled={!isCompleted}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors",
                  isActive && "text-emerald-600",
                  isCompleted && !isActive && "text-emerald-600 hover:text-emerald-700",
                  !isActive && !isCompleted && "text-slate-400"
                )}
              >
                <span className={cn(
                  "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold border-2 transition-colors",
                  isActive && "border-emerald-600 bg-emerald-600 text-white",
                  isCompleted && "border-emerald-600 bg-emerald-600 text-white",
                  !isActive && !isCompleted && "border-slate-300 text-slate-400"
                )}>
                  {isCompleted ? <Check className="h-3.5 w-3.5" /> : index + 1}
                </span>
                <span className="hidden sm:inline">{step.label}</span>
              </button>
              {index < STEPS.length - 1 && (
                <div className={cn(
                  "flex-1 h-px mx-4",
                  isCompleted ? "bg-emerald-600" : "bg-slate-200"
                )} />
              )}
            </div>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid gap-8 lg:grid-cols-5">
        {/* Left: Form */}
        <div className="lg:col-span-3">
          {/* Step Content */}
        {currentStep === "information" && (
          <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Section Header */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-4 py-3 sm:px-6 sm:py-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/10 flex items-center justify-center">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white">Contact Information</h2>
                  <p className="text-xs sm:text-sm text-white/60">We&apos;ll use this to send order updates</p>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Auth Banner */}
              {!isAuthenticated ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                  <p className="text-sm text-emerald-800">
                    Have an account?{" "}
                    <Link href="/account/login?redirect=/checkout" className="font-semibold text-emerald-700 hover:text-emerald-800 underline">
                      Log in
                    </Link>{" "}
                    for faster checkout
                  </p>
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                  <p className="text-sm text-emerald-800">
                    Logged in as <span className="font-semibold">{customer?.email}</span>
                  </p>
                </div>
              )}

              {/* Contact Fields */}
              <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="email" className="text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2">
                    <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={contact.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setContact({ ...contact, email: e.target.value })}
                    placeholder="john@example.com"
                    required
                    className="h-10 sm:h-12 rounded-lg sm:rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <Label htmlFor="phone" className="text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2">
                    <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={contact.phone}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setContact({ ...contact, phone: e.target.value })}
                    placeholder="(555) 123-4567"
                    required
                    className="h-10 sm:h-12 rounded-lg sm:rounded-xl border-slate-200 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Shipping Address Section */}
              <div className="pt-4 sm:pt-6 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500" />
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">Shipping Address</h3>
                </div>

                {/* Saved Address Selector */}
                {isAuthenticated && savedAddresses.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {savedAddresses.map((addr: any) => (
                      <button
                        key={addr.id}
                        type="button"
                        onClick={() => {
                          setSelectedAddressId(addr.id);
                          setUseNewAddress(false);
                          applyAddress(addr);
                        }}
                        className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
                          selectedAddressId === addr.id && !useNewAddress
                            ? "border-emerald-500 bg-emerald-50/50"
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="text-sm">
                            {addr.metadata?.name && (
                              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wide">{addr.metadata.name} &middot; </span>
                            )}
                            <span className="font-medium text-slate-900">{addr.first_name} {addr.last_name}</span>
                            <p className="text-slate-500 mt-0.5">
                              {addr.address_1}{addr.address_2 ? `, ${addr.address_2}` : ""}, {addr.city}, {addr.province} {addr.postal_code}
                            </p>
                          </div>
                          <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                            selectedAddressId === addr.id && !useNewAddress
                              ? "border-emerald-500"
                              : "border-slate-300"
                          }`}>
                            {selectedAddressId === addr.id && !useNewAddress && (
                              <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setUseNewAddress(true);
                        setSelectedAddressId(null);
                        setShipping({ firstName: "", lastName: "", company: "", address: "", apartment: "", city: "", state: "", zip: "" });
                      }}
                      className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
                        useNewAddress
                          ? "border-emerald-500 bg-emerald-50/50"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">Use a different address</span>
                        <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                          useNewAddress ? "border-emerald-500" : "border-slate-300"
                        }`}>
                          {useNewAddress && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                        </div>
                      </div>
                    </button>
                  </div>
                )}

                {/* Address form - show when no saved addresses OR "new address" selected */}
                {(!isAuthenticated || savedAddresses.length === 0 || useNewAddress) && (
                <div className="space-y-3 sm:space-y-4">
                  <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                    <div className="space-y-1 sm:space-y-2">
                      <Label htmlFor="firstName" className="text-xs sm:text-sm font-medium">First Name</Label>
                      <Input
                        id="firstName"
                        value={shipping.firstName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShipping({ ...shipping, firstName: e.target.value })}
                        required
                        className="h-10 sm:h-12 rounded-lg sm:rounded-xl border-slate-200"
                      />
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <Label htmlFor="lastName" className="text-xs sm:text-sm font-medium">Last Name</Label>
                      <Input
                        id="lastName"
                        value={shipping.lastName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShipping({ ...shipping, lastName: e.target.value })}
                        required
                        className="h-10 sm:h-12 rounded-lg sm:rounded-xl border-slate-200"
                      />
                    </div>
                  </div>

                  {/* Combined address row on mobile: Company + Apt (both optional) */}
                  <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-1">
                    <div className="space-y-1 sm:space-y-2">
                      <Label htmlFor="company" className="text-xs sm:text-sm font-medium text-slate-500">Company</Label>
                      <Input
                        id="company"
                        value={shipping.company}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShipping({ ...shipping, company: e.target.value })}
                        placeholder="Optional"
                        className="h-10 sm:h-12 rounded-lg sm:rounded-xl border-slate-200"
                      />
                    </div>
                    <div className="space-y-1 sm:space-y-2 sm:hidden">
                      <Label htmlFor="apartment-mobile" className="text-xs font-medium text-slate-500">Apt/Suite</Label>
                      <Input
                        id="apartment-mobile"
                        value={shipping.apartment}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShipping({ ...shipping, apartment: e.target.value })}
                        placeholder="Optional"
                        className="h-10 rounded-lg border-slate-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 sm:space-y-2">
                    <Label htmlFor="address" className="text-xs sm:text-sm font-medium">Street Address</Label>
                    <Input
                      id="address"
                      value={shipping.address}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShipping({ ...shipping, address: e.target.value })}
                      placeholder="123 Main St"
                      required
                      className="h-10 sm:h-12 rounded-lg sm:rounded-xl border-slate-200"
                    />
                  </div>

                  <div className="hidden sm:block space-y-2">
                    <Label htmlFor="apartment" className="text-sm font-medium text-slate-500">Apt, suite, etc. (optional)</Label>
                    <Input
                      id="apartment"
                      value={shipping.apartment}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShipping({ ...shipping, apartment: e.target.value })}
                      className="h-12 rounded-xl border-slate-200"
                    />
                  </div>

                  <div className="grid gap-3 sm:gap-4 grid-cols-3 sm:grid-cols-3">
                    <div className="space-y-1 sm:space-y-2">
                      <Label htmlFor="city" className="text-xs sm:text-sm font-medium">City</Label>
                      <Input
                        id="city"
                        value={shipping.city}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShipping({ ...shipping, city: e.target.value })}
                        required
                        className="h-10 sm:h-12 rounded-lg sm:rounded-xl border-slate-200"
                      />
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <Label htmlFor="state" className="text-xs sm:text-sm font-medium">State</Label>
                      <Input
                        id="state"
                        value={shipping.state}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShipping({ ...shipping, state: e.target.value })}
                        maxLength={2}
                        placeholder="CA"
                        required
                        className="h-10 sm:h-12 rounded-lg sm:rounded-xl border-slate-200"
                      />
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <Label htmlFor="zip" className="text-xs sm:text-sm font-medium">ZIP</Label>
                      <Input
                        id="zip"
                        value={shipping.zip}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setShipping({ ...shipping, zip: e.target.value })}
                        required
                        className="h-10 sm:h-12 rounded-lg sm:rounded-xl border-slate-200"
                      />
                    </div>
                  </div>
                  {/* Save address checkbox */}
                  {isAuthenticated && (
                    <div className="space-y-2 pt-1">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={saveNewAddress}
                          onChange={(e) => setSaveNewAddress(e.target.checked)}
                          className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-sm text-slate-600">Save this address to my account</span>
                      </label>
                      {saveNewAddress && (
                        <div className="flex items-center gap-2 pl-6">
                          <label className="text-xs text-slate-500 whitespace-nowrap">Label:</label>
                          <input
                            type="text"
                            placeholder="e.g. Home, Work"
                            value={newAddressLabel}
                            onChange={(e) => setNewAddressLabel(e.target.value)}
                            className="flex-1 h-8 px-2.5 rounded-md border border-dashed border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-400"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
                )}
              </div>

              <Button
                className="w-full h-12 sm:h-14 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-sm sm:text-base font-semibold"
                onClick={async () => {
                  // Save address to account if checked
                  if (isAuthenticated && saveNewAddress && (useNewAddress || savedAddresses.length === 0)) {
                    try {
                      await medusa.store.customer.createAddress({
                        first_name: shipping.firstName,
                        last_name: shipping.lastName,
                        company: shipping.company || undefined,
                        address_1: shipping.address,
                        address_2: shipping.apartment || undefined,
                        city: shipping.city,
                        province: shipping.state,
                        postal_code: shipping.zip,
                        country_code: "us",
                        phone: contact.phone || undefined,
                        metadata: newAddressLabel ? { name: newAddressLabel } : undefined,
                      });
                    } catch {
                      // Don't block checkout if save fails
                    }
                  }
                  setCurrentStep("shipping");
                }}
                disabled={
                  !contact.email ||
                  !shipping.firstName ||
                  !shipping.lastName ||
                  !shipping.address ||
                  !shipping.city ||
                  !shipping.state ||
                  !shipping.zip
                }
              >
                Continue to Shipping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {currentStep === "shipping" && (
          <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Section Header */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-4 py-3 sm:px-6 sm:py-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-white/10 flex items-center justify-center">
                  <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white">Shipping Method</h2>
                  <p className="text-xs sm:text-sm text-white/60">Choose your preferred delivery option</p>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              {/* Freight notice */}
              <div className="flex items-start gap-2 sm:gap-3 rounded-lg sm:rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-3 sm:p-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-md sm:rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <Package className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm sm:text-base font-semibold text-amber-900">Turf ships via LTL Freight</p>
                  <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-amber-800">
                    Due to roll size and weight, all orders ship via freight carrier.
                  </p>
                </div>
              </div>

              {/* Shipping options */}
              <div className="space-y-2 sm:space-y-3">
                {shippingOptions.map((option) => (
                  <label
                    key={option.id}
                    className={cn(
                      "flex cursor-pointer items-start gap-3 sm:gap-4 rounded-lg sm:rounded-xl border-2 p-3 sm:p-5 transition-all",
                      selectedShipping === option.id
                        ? "border-emerald-500 bg-emerald-50/50 shadow-lg shadow-emerald-500/10"
                        : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    )}
                  >
                    <div className={cn(
                      "mt-0.5 h-4 w-4 sm:h-5 sm:w-5 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0",
                      selectedShipping === option.id
                        ? "border-emerald-500 bg-emerald-500"
                        : "border-slate-300"
                    )}>
                      {selectedShipping === option.id && (
                        <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 sm:gap-2">
                          <option.icon className={cn(
                            "h-4 w-4 sm:h-5 sm:w-5",
                            selectedShipping === option.id ? "text-emerald-600" : "text-slate-400"
                          )} />
                          <span className="text-sm sm:text-base font-bold text-slate-900">{option.name}</span>
                        </div>
                        <span className={cn(
                          "text-sm sm:text-lg font-bold flex-shrink-0",
                          option.price === 0 ? "text-emerald-600" : "text-slate-900"
                        )}>
                          {option.price === 0 ? "FREE" : formatPrice(option.price)}
                        </span>
                      </div>
                      <p className="mt-0.5 sm:mt-1 text-xs sm:text-sm text-slate-600">{option.description}</p>
                      <p className="text-xs sm:text-sm text-slate-500">{option.estimatedDays}</p>
                      {option.note && (
                        <p className="mt-1.5 sm:mt-2 inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-100 px-2 py-0.5 sm:py-1 rounded-full">
                          <Sparkles className="h-3 w-3" />
                          {option.note}
                        </p>
                      )}
                    </div>
                    <input
                      type="radio"
                      name="shipping"
                      value={option.id}
                      checked={selectedShipping === option.id}
                      onChange={() => setSelectedShipping(option.id)}
                      className="sr-only"
                    />
                  </label>
                ))}
              </div>

              <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep("information")}
                  className="h-10 sm:h-12 px-4 sm:px-6 rounded-lg sm:rounded-xl text-sm"
                >
                  Back
                </Button>
                <Button
                  className="flex-1 h-12 sm:h-14 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-sm sm:text-base font-semibold"
                  onClick={() => setCurrentStep("payment")}
                >
                  Continue to Payment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {currentStep === "payment" && (
          <>
            {isInitializingPayment ? (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="py-16">
                  <div className="flex flex-col items-center justify-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-slate-900">Initializing secure payment...</p>
                      <p className="text-sm text-slate-500 mt-1">This will only take a moment</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : paymentError && !clientSecret ? (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="py-16">
                  <div className="flex flex-col items-center justify-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                      <AlertCircle className="h-8 w-8 text-red-500" />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-slate-900">{paymentError}</p>
                      <p className="text-sm text-slate-500 mt-1">Check your connection and try again</p>
                    </div>
                    <button
                      onClick={initializePayment}
                      className="mt-2 px-6 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              </div>
            ) : clientSecret ? (
              <StripeProvider clientSecret={clientSecret}>
                <PaymentForm
                  onSuccess={handlePaymentSuccess}
                  onBack={() => setCurrentStep("shipping")}
                  total={total}
                  isProcessing={isProcessing}
                  setIsProcessing={setIsProcessing}
                />
              </StripeProvider>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Section Header */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Payment (Demo Mode)</h2>
                      <p className="text-sm text-white/60">Test the checkout experience</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-4">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-amber-900">Demo Mode Active</p>
                      <p className="mt-1 text-sm text-amber-800">
                        Stripe is not configured. Click below to simulate a successful order for testing.
                      </p>
                    </div>
                  </div>

                  {/* Fake card input for visual */}
                  <div className="rounded-xl border border-slate-200 p-5 bg-slate-50">
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-slate-500">Card Number</Label>
                        <Input
                          placeholder="4242 4242 4242 4242"
                          disabled
                          className="h-12 mt-1.5 bg-white rounded-xl border-slate-200"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-slate-500">Expiry Date</Label>
                          <Input placeholder="12/28" disabled className="h-12 mt-1.5 bg-white rounded-xl border-slate-200" />
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-slate-500">CVC</Label>
                          <Input placeholder="123" disabled className="h-12 mt-1.5 bg-white rounded-xl border-slate-200" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep("shipping")}
                      disabled={isProcessing}
                      className="h-12 px-6 rounded-xl"
                    >
                      Back
                    </Button>
                    <Button
                      className="flex-1 h-14 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-base font-semibold"
                      disabled={isProcessing}
                      onClick={async () => {
                        setIsProcessing(true);
                        await new Promise((resolve) => setTimeout(resolve, 2000));
                        const demoOrderId = `demo-${Date.now()}`;
                        handlePaymentSuccess(demoOrderId);
                      }}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Lock className="mr-2 h-4 w-4" />
                          Place Order (Demo) - {formatPrice(total)}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Confirmation */}
        {currentStep === "confirmation" && orderId && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Success Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-8 text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-white flex items-center justify-center">
                <Check className="h-8 w-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-white">Order Confirmed!</h2>
              <p className="text-emerald-100 mt-2">Thank you for your purchase</p>
              <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20">
                <span className="text-sm text-white/80">Order number:</span>
                <span className="font-mono font-bold text-white">{orderId}</span>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* What's Next */}
              <div>
                <h3 className="font-bold text-slate-900 mb-4">What Happens Next</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Confirmation Email</p>
                      <p className="text-sm text-slate-500">You&apos;ll receive a receipt within a few minutes</p>
                    </div>
                  </div>
                  {(() => {
                    const method = completedOrder?.selectedShipping ?? selectedShipping;
                    const isWillCall = method.startsWith("willcall-");
                    const isNextDay = method === "nextday";
                    return (
                      <>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                            <Package className="w-4 h-4 text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900">Order Processing</p>
                            <p className="text-sm text-slate-500">
                              {isWillCall
                                ? "We'll prepare your turf for pickup"
                                : isNextDay
                                  ? "We'll prepare your turf for next-day dispatch"
                                  : "We'll prepare your turf in 1-2 business days"}
                            </p>
                          </div>
                        </div>
                        {isWillCall ? (
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                              <MapPin className="w-4 h-4 text-emerald-600" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">Will Call Pickup</p>
                              <p className="text-sm text-slate-500">Your order will be ready for pickup within 1 business day</p>
                            </div>
                          </div>
                        ) : isNextDay ? (
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                              <Zap className="w-4 h-4 text-emerald-600" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">Next Day Delivery</p>
                              <p className="text-sm text-slate-500">Your order will arrive the next business day</p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                              <Truck className="w-4 h-4 text-emerald-600" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-900">
                                {method === "expedited" ? "Expedited Freight" : "LTL Freight Delivery"}
                              </p>
                              <p className="text-sm text-slate-500">
                                {method === "expedited"
                                  ? "The carrier will deliver within 3-5 business days"
                                  : "The carrier will call to schedule delivery within 5-10 business days"}
                              </p>
                            </div>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Shipping / Pickup Address */}
              <div className="pt-4 border-t border-slate-200">
                {(completedOrder?.selectedShipping ?? selectedShipping).startsWith("willcall-") ? (() => {
                  const loc = WILL_CALL_LOCATIONS.find(l => l.id === (completedOrder?.selectedShipping ?? selectedShipping));
                  return loc ? (
                    <>
                      <h3 className="font-bold text-slate-900 mb-2">Pickup Location</h3>
                      <p className="text-slate-600">
                        {loc.address}<br />
                        {loc.city}, {loc.state} {loc.zip}
                      </p>
                    </>
                  ) : null;
                })() : (
                  <>
                    <h3 className="font-bold text-slate-900 mb-2">Shipping To</h3>
                    <p className="text-slate-600">
                      {shipping.firstName} {shipping.lastName}<br />
                      {shipping.address}{shipping.apartment && `, ${shipping.apartment}`}<br />
                      {shipping.city}, {shipping.state} {shipping.zip}
                    </p>
                  </>
                )}
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row gap-3">
                <Button className="flex-1 h-12 rounded-xl" asChild>
                  <Link href="/products">
                    Continue Shopping
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right: Order Summary */}
      <div className="lg:col-span-2">
        <div className="sticky top-24 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Summary Header */}
          <div className={cn(
            "px-6 py-4",
            completedOrder ? "bg-gradient-to-r from-emerald-500 to-emerald-600" : "bg-gradient-to-r from-slate-900 to-slate-800"
          )}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                {completedOrder ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <ShoppingBag className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">
                  {completedOrder ? "Order Complete" : "Order Summary"}
                </h2>
                <p className="text-sm text-white/60">
                  {(completedOrder?.items || items).length} {(completedOrder?.items || items).length === 1 ? "item" : "items"}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {/* Items */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {(completedOrder?.items || items).map((item) => (
                <div key={item.id} className="flex gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="h-16 w-16 flex-shrink-0 rounded-lg bg-white overflow-hidden border border-slate-200">
                    {item.thumbnail ? (
                      <Image
                        src={item.thumbnail}
                        alt={item.title}
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <Package className="h-6 w-6 text-slate-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{item.title}</p>
                    {item.dimensions && (
                      <p className="text-xs text-slate-500 mt-0.5">
                        {item.dimensions.widthFeet}&apos; × {item.dimensions.lengthFeet}&apos;
                        <span className="mx-1">•</span>
                        {item.dimensions.squareFeet} sq ft
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-slate-500">Qty: {item.quantity}</span>
                      <span className="text-sm font-bold text-slate-900">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="font-medium">{formatPrice(completedOrder?.subtotal ?? subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Shipping</span>
                <span className={cn("font-medium", (completedOrder?.shippingCost ?? shippingCost) === 0 && "text-emerald-600")}>
                  {(completedOrder?.shippingCost ?? shippingCost) === 0 ? "FREE" : formatPrice(completedOrder?.shippingCost ?? shippingCost)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Tax</span>
                <span className="font-medium">{formatPrice(completedOrder?.tax ?? tax)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-slate-200">
                <span className="text-lg font-bold text-slate-900">Total</span>
                <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-emerald-500">
                  {formatPrice(completedOrder?.total ?? total)}
                </span>
              </div>
            </div>

            {/* Trust badges */}
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Lock className="h-4 w-4 text-emerald-600" />
                </div>
                <span className="text-slate-600">Secure 256-bit SSL encryption</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Award className="h-4 w-4 text-emerald-600" />
                </div>
                <span className="text-slate-600">16-Year Warranty included</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Truck className="h-4 w-4 text-emerald-600" />
                </div>
                <span className="text-slate-600">Fast nationwide shipping</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
