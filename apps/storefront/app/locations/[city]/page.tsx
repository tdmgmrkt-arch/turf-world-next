import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Sun, Droplets, Dog, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LocalBusinessSchema } from "@/components/seo/product-schema";

// City data for programmatic SEO
const CITIES: Record<
  string,
  {
    name: string;
    state: string;
    stateCode: string;
    climate: "hot" | "moderate" | "cold";
    waterRestrictions: boolean;
    topUseCase: "pet" | "landscape" | "water-saving";
    heroMessage: string;
    benefits: string[];
  }
> = {
  phoenix: {
    name: "Phoenix",
    state: "Arizona",
    stateCode: "AZ",
    climate: "hot",
    waterRestrictions: true,
    topUseCase: "water-saving",
    heroMessage: "Save water in the desert with artificial turf",
    benefits: [
      "Eliminate lawn watering and save up to 50,000 gallons/year",
      "Heat-resistant CoolFlow technology reduces surface temperature",
      "No brown patches during Arizona summers",
      "Qualifies for water rebate programs",
    ],
  },
  "los-angeles": {
    name: "Los Angeles",
    state: "California",
    stateCode: "CA",
    climate: "moderate",
    waterRestrictions: true,
    topUseCase: "water-saving",
    heroMessage: "California drought? Your lawn doesn't have to suffer",
    benefits: [
      "Meet LA water restrictions while keeping a green lawn",
      "Class-A fire rated for California wildfire compliance",
      "PFAS-free turf safe for your family",
      "Eligible for LADWP turf replacement rebates",
    ],
  },
  "san-diego": {
    name: "San Diego",
    state: "California",
    stateCode: "CA",
    climate: "moderate",
    waterRestrictions: true,
    topUseCase: "pet",
    heroMessage: "Pet-friendly turf for San Diego dog owners",
    benefits: [
      "High-drainage turf perfect for year-round outdoor living",
      "Antimicrobial treatment for pet odor control",
      "Beach sand resistant - easy to clean",
      "San Diego County water rebate eligible",
    ],
  },
  seattle: {
    name: "Seattle",
    state: "Washington",
    stateCode: "WA",
    climate: "cold",
    waterRestrictions: false,
    topUseCase: "landscape",
    heroMessage: "A green lawn that doesn't turn to mud in the rain",
    benefits: [
      "Superior drainage handles Seattle rain",
      "No mud, no mess - stays green year-round",
      "UV-stabilized for cloudy days and sunny summers",
      "Pet-friendly options for Pacific Northwest dog owners",
    ],
  },
  denver: {
    name: "Denver",
    state: "Colorado",
    stateCode: "CO",
    climate: "cold",
    waterRestrictions: true,
    topUseCase: "water-saving",
    heroMessage: "Mile-high lawns without the water bill",
    benefits: [
      "Perfect for Denver's dry climate and water restrictions",
      "Handles freeze-thaw cycles without damage",
      "UV protection for high-altitude sun exposure",
      "Denver Water rebate program eligible",
    ],
  },
  austin: {
    name: "Austin",
    state: "Texas",
    stateCode: "TX",
    climate: "hot",
    waterRestrictions: true,
    topUseCase: "pet",
    heroMessage: "Keep Austin green without watering",
    benefits: [
      "Beat Austin heat with cooling infill options",
      "Dog-friendly turf for Austin's pet-loving culture",
      "No more allergy-triggering grass pollen",
      "Austin Water rebate program eligible",
    ],
  },
  miami: {
    name: "Miami",
    state: "Florida",
    stateCode: "FL",
    climate: "hot",
    waterRestrictions: false,
    topUseCase: "landscape",
    heroMessage: "Hurricane-resistant turf that stays put",
    benefits: [
      "Handles Florida humidity and heavy rain",
      "Won't flood or wash away in storms",
      "Resists mold and mildew in tropical climate",
      "Low maintenance in year-round growing season",
    ],
  },
  "las-vegas": {
    name: "Las Vegas",
    state: "Nevada",
    stateCode: "NV",
    climate: "hot",
    waterRestrictions: true,
    topUseCase: "water-saving",
    heroMessage: "Vegas residents save thousands with artificial turf",
    benefits: [
      "Southern Nevada Water Authority rebates up to $3/sqft",
      "Eliminate grass watering in the Mojave Desert",
      "Heat-resistant turf that won't burn feet",
      "Perfect for backyard entertainment spaces",
    ],
  },
};

interface LocationPageProps {
  params: Promise<{ city: string }>;
}

export async function generateMetadata({
  params,
}: LocationPageProps): Promise<Metadata> {
  const { city: citySlug } = await params;
  const city = CITIES[citySlug];

  if (!city) {
    return { title: "Location Not Found" };
  }

  return {
    title: `Artificial Grass in ${city.name}, ${city.stateCode} | Turf World`,
    description: `${city.heroMessage}. Shop premium artificial turf for ${city.name} homes. Fast shipping, 16-Year Warranty. ${city.waterRestrictions ? "Water rebate eligible." : ""}`,
    keywords: [
      `artificial grass ${city.name}`,
      `turf ${city.name}`,
      `fake grass ${city.name}`,
      `artificial lawn ${city.name} ${city.stateCode}`,
      city.waterRestrictions ? `water rebate ${city.name}` : "",
    ].filter(Boolean),
    openGraph: {
      title: `Artificial Grass in ${city.name} | Turf World`,
      description: city.heroMessage,
    },
  };
}

export async function generateStaticParams() {
  return Object.keys(CITIES).map((city) => ({ city }));
}

export default async function LocationPage({ params }: LocationPageProps) {
  const { city: citySlug } = await params;
  const city = CITIES[citySlug];

  if (!city) {
    notFound();
  }

  const useCaseIcon = {
    pet: Dog,
    landscape: Leaf,
    "water-saving": Droplets,
  }[city.topUseCase];

  const UseCaseIcon = useCaseIcon;

  return (
    <>
      <LocalBusinessSchema city={city.name} state={city.state} />

      <div className="flex flex-col">
        {/* Hero */}
        <section className="bg-gradient-to-b from-turf-50 to-background py-16 md:py-24">
          <div className="container">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-sm text-primary">
                <UseCaseIcon className="h-4 w-4" />
                {city.topUseCase === "pet" && "Pet Turf Specialists"}
                {city.topUseCase === "landscape" && "Premium Landscape Turf"}
                {city.topUseCase === "water-saving" && "Water Conservation"}
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Artificial Grass in {city.name}, {city.stateCode}
              </h1>
              <p className="mt-4 text-lg text-muted-foreground">
                {city.heroMessage}
              </p>

              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <Button size="lg" asChild>
                  <Link href="/products">
                    Shop Turf
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/samples">Get Free Samples</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16">
          <div className="container">
            <h2 className="text-center text-2xl font-bold">
              Why {city.name} Homeowners Choose Turf World
            </h2>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {city.benefits.map((benefit, index) => (
                <Card key={index}>
                  <CardContent className="flex items-start gap-3 pt-6">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <span className="text-sm font-bold text-primary">
                        {index + 1}
                      </span>
                    </div>
                    <p>{benefit}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Climate-specific recommendations */}
        <section className="bg-muted/50 py-16">
          <div className="container">
            <h2 className="text-center text-2xl font-bold">
              Recommended for {city.name}&apos;s Climate
            </h2>
            <p className="mt-2 text-center text-muted-foreground">
              Our top picks for{" "}
              {city.climate === "hot"
                ? "hot, dry climates"
                : city.climate === "cold"
                  ? "cold, wet climates"
                  : "moderate climates"}
            </p>

            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              <RecommendedProduct
                name="K9 Pro Pet Turf"
                description="High drainage, antimicrobial"
                pricePerSqFt="$2.99"
                href="/products/k9-pro-pet-turf"
                badge={city.topUseCase === "pet" ? "Best for You" : undefined}
              />
              <RecommendedProduct
                name="EcoLush 108"
                description="Premium landscape, 108oz"
                pricePerSqFt="$3.25"
                href="/products/ecolush-premium-108"
                badge={city.topUseCase === "landscape" ? "Best for You" : undefined}
              />
              <RecommendedProduct
                name="California 65"
                description="Budget-friendly, 65oz"
                pricePerSqFt="$1.99"
                href="/products/california-65"
                badge={city.waterRestrictions ? "Rebate Eligible" : undefined}
              />
            </div>
          </div>
        </section>

        {/* Water rebate section (if applicable) */}
        {city.waterRestrictions && (
          <section className="py-16">
            <div className="container">
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-800">
                    <Droplets className="h-5 w-5" />
                    {city.name} Water Rebate Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-blue-700">
                  <p>
                    Many {city.name} area water districts offer rebates for
                    replacing grass with artificial turf. Contact your local water
                    provider to learn about available programs.
                  </p>
                  <p className="mt-2 font-medium">
                    Turf World products qualify for most rebate programs. We can
                    provide receipts and product specifications for your
                    application.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-16 sm:py-20 lg:py-24 border-t">
          <div className="container text-center">
            <h2 className="max-w-3xl mx-auto">
              Ready to transform your {city.name} lawn?
            </h2>
            <p className="mt-6 text-body-lg text-muted-foreground max-w-xl mx-auto">
              Fast shipping to {city.name}. 16-Year Warranty on all turf.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="btn-premium text-lg px-8 h-14" asChild>
                <Link href="/calculator">
                  Calculate Your Project
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 h-14" asChild>
                <Link href="/samples">Order Free Samples</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

function RecommendedProduct({
  name,
  description,
  pricePerSqFt,
  href,
  badge,
}: {
  name: string;
  description: string;
  pricePerSqFt: string;
  href: string;
  badge?: string;
}) {
  return (
    <Link href={href}>
      <Card className="h-full transition-all hover:border-primary hover:shadow-lg">
        <CardHeader className="pb-2">
          {badge && (
            <span className="mb-2 inline-block w-fit rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
              {badge}
            </span>
          )}
          <CardTitle className="text-lg">{name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{description}</p>
          <p className="mt-2 text-lg font-bold text-primary">
            {pricePerSqFt}/sqft
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
