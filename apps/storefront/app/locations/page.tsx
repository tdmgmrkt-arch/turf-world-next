import { Metadata } from "next";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Service Areas | Artificial Grass Delivery Nationwide",
  description:
    "Turf World ships artificial grass nationwide. Find local information for your city including water rebates, climate recommendations, and installation tips.",
};

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
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          We Ship Nationwide
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Free shipping on all turf orders. Find local information for your area
          including water rebate programs and climate-specific recommendations.
        </p>
      </div>

      <div className="mt-12 space-y-12">
        {REGIONS.map((region) => (
          <section key={region.name}>
            <h2 className="text-xl font-semibold">{region.name}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {region.cities.map((city) => (
                <Link key={city.slug} href={`/locations/${city.slug}`}>
                  <Card className="transition-all hover:border-primary hover:shadow-md">
                    <CardContent className="flex items-center gap-3 p-4">
                      <MapPin className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">{city.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {city.state}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
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
          <Link
            href="/products"
            className="text-primary underline-offset-4 hover:underline"
          >
            Shop All Products
          </Link>
          <Link
            href="/calculator"
            className="text-primary underline-offset-4 hover:underline"
          >
            Project Calculator
          </Link>
        </div>
      </div>
    </div>
  );
}
