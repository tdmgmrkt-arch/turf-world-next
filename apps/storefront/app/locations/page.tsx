import { Metadata } from "next";
import Link from "next/link";
import { MapPin, Building2, Info, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

// Cast to work around React 19 JSX type incompatibility
const MapPinIcon = MapPin as any;
const Building2Icon = Building2 as any;
const InfoIcon = Info as any;
const SparklesIcon = Sparkles as any;
const CardAny = Card as any;
const CardContentAny = CardContent as any;
const LinkAny = Link as any;

export const metadata: Metadata = {
  title: "Locations | Turf World Artificial Grass",
  description:
    "Turf World ships artificial grass nationwide. Find local information for your area including water rebate programs and climate-specific recommendations.",
};

const WILL_CALL_LOCATIONS = [
  {
    name: "Pomona",
    address: "1970 W Holt Ave",
    city: "Pomona",
    state: "CA",
    zip: "91768",
  },
  {
    name: "Irvine",
    address: "15791 Rockfield Blvd, Ste D",
    city: "Irvine",
    state: "CA",
    zip: "92618",
  },
  {
    name: "Chino",
    address: "14651 Yorba Ave",
    city: "Chino",
    state: "CA",
    zip: "91710",
  },
];

const REGIONS = [
  {
    name: "West Coast",
    cities: [
      { name: "Los Angeles", slug: "los-angeles", state: "CA" },
      { name: "San Diego", slug: "san-diego", state: "CA" },
      { name: "Phoenix", slug: "phoenix", state: "AZ" },
      { name: "Las Vegas", slug: "las-vegas", state: "NV" },
      { name: "Seattle", slug: "seattle", state: "WA" },
    ],
  },
  {
    name: "Southwest",
    cities: [
      { name: "Denver", slug: "denver", state: "CO" },
      { name: "Austin", slug: "austin", state: "TX" },
    ],
  },
  {
    name: "Southeast",
    cities: [{ name: "Miami", slug: "miami", state: "FL" }],
  },
];

export default function LocationsPage() {
  return (
    <div className="container py-8 md:py-12">
      {/* Header */}
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          We Ship Nationwide
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Fast nationwide shipping on all turf orders. Find local information for your area
          including water rebate programs and climate-specific recommendations.
        </p>
      </div>

      {/* Main Warehouse */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4">Main Warehouse</h2>
        <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 flex items-center gap-5 shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
            <Building2Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-bold text-white text-lg">Turf World — Main Warehouse</p>
            <p className="text-white/70 mt-0.5">1970 W Holt Ave, Pomona, CA 91768</p>
          </div>
        </div>
      </div>

      {/* Will Call Pickup Locations */}
      <div className="mt-12">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h2 className="text-xl font-semibold">Will Call Pickup Locations</h2>
        </div>

        {/* Product-specific note */}
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 mb-5">
          <InfoIcon className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            <strong>Note:</strong> Will call availability is product-specific — not all products are available for pickup at every location. Eligible pickup options will be shown at checkout based on your order.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {WILL_CALL_LOCATIONS.map((loc) => (
            <div
              key={loc.name}
              className="rounded-2xl border border-border/50 bg-white shadow-sm p-5 flex items-start gap-4 hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                <MapPinIcon className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">{loc.name}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{loc.address}</p>
                <p className="text-sm text-muted-foreground">{loc.city}, {loc.state} {loc.zip}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Coming soon */}
        <div className="mt-5 rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/50 p-6 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <SparklesIcon className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="font-semibold text-emerald-900">More Locations Coming Soon</p>
            <p className="text-sm text-emerald-700 mt-0.5">
              We&apos;re expanding our will call pickup network nationwide. Check back for new locations near you.
            </p>
          </div>
        </div>
      </div>

      {/* City / Region Grid */}
      <div className="mt-16 space-y-12">
        {REGIONS.map((region) => (
          <section key={region.name}>
            <h2 className="text-xl font-semibold">{region.name}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {region.cities.map((city) => (
                <LinkAny key={city.slug} href={`/locations/${city.slug}`}>
                  <CardAny className="transition-all hover:border-primary hover:shadow-md">
                    <CardContentAny className="flex items-center gap-3 p-4">
                      <MapPinIcon className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">{city.name}</p>
                        <p className="text-sm text-muted-foreground">{city.state}</p>
                      </div>
                    </CardContentAny>
                  </CardAny>
                </LinkAny>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-16 rounded-lg bg-muted p-8 text-center">
        <h2 className="text-xl font-bold">Don&apos;t see your city?</h2>
        <p className="mt-2 text-muted-foreground">
          We ship to all 50 states. Browse our full product catalog and use the
          project calculator to get started.
        </p>
        <div className="mt-4 flex justify-center gap-4">
          <LinkAny
            href="/products"
            className="text-primary underline-offset-4 hover:underline"
          >
            Shop All Products
          </LinkAny>
          <LinkAny
            href="/calculator"
            className="text-primary underline-offset-4 hover:underline"
          >
            Project Calculator
          </LinkAny>
        </div>
      </div>
    </div>
  );
}
