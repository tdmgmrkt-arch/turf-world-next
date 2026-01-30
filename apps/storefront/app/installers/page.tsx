import { Metadata } from "next";
import Link from "next/link";
import { MapPin, Star, Phone, CheckCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Find Certified Installers | Professional Turf Installation",
  description:
    "Find certified artificial turf installers near you. All installers are vetted, insured, and trained on Turf World products. Free quotes available.",
};

// Mock installer data - would come from database
const INSTALLERS = [
  {
    id: "inst_1",
    name: "Green Pro Landscaping",
    city: "Los Angeles",
    state: "CA",
    rating: 4.9,
    reviewCount: 127,
    yearsExperience: 12,
    certifications: ["Turf World Certified", "Licensed & Insured"],
    specialties: ["Pet Turf", "Landscape", "Commercial"],
    phone: "(310) 555-0123",
    featured: true,
  },
  {
    id: "inst_2",
    name: "Desert Turf Experts",
    city: "Phoenix",
    state: "AZ",
    rating: 4.8,
    reviewCount: 89,
    yearsExperience: 8,
    certifications: ["Turf World Certified", "Licensed & Insured"],
    specialties: ["Pet Turf", "Water Conservation"],
    phone: "(602) 555-0456",
    featured: true,
  },
  {
    id: "inst_3",
    name: "Pacific Lawn Solutions",
    city: "San Diego",
    state: "CA",
    rating: 4.7,
    reviewCount: 64,
    yearsExperience: 6,
    certifications: ["Turf World Certified", "Licensed & Insured"],
    specialties: ["Landscape", "Putting Greens"],
    phone: "(858) 555-0789",
    featured: false,
  },
  {
    id: "inst_4",
    name: "Emerald City Turf",
    city: "Seattle",
    state: "WA",
    rating: 4.9,
    reviewCount: 52,
    yearsExperience: 10,
    certifications: ["Turf World Certified", "Licensed & Insured"],
    specialties: ["Landscape", "Pet Turf", "Rooftop"],
    phone: "(206) 555-0321",
    featured: false,
  },
  {
    id: "inst_5",
    name: "Mile High Grass Co",
    city: "Denver",
    state: "CO",
    rating: 4.6,
    reviewCount: 41,
    yearsExperience: 5,
    certifications: ["Turf World Certified", "Licensed & Insured"],
    specialties: ["Landscape", "Pet Turf"],
    phone: "(303) 555-0654",
    featured: false,
  },
  {
    id: "inst_6",
    name: "Vegas Turf Pros",
    city: "Las Vegas",
    state: "NV",
    rating: 4.8,
    reviewCount: 78,
    yearsExperience: 9,
    certifications: ["Turf World Certified", "Licensed & Insured", "Water Rebate Specialist"],
    specialties: ["Water Conservation", "Pet Turf", "Commercial"],
    phone: "(702) 555-0987",
    featured: true,
  },
];

export default function InstallersPage() {
  const featuredInstallers = INSTALLERS.filter((i) => i.featured);
  const allInstallers = INSTALLERS;

  return (
    <div className="container py-8 md:py-12">
      {/* Hero */}
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Find Certified Installers
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          All installers are vetted, insured, and factory-trained on Turf World
          products. Get a free quote today.
        </p>
      </div>

      {/* Search */}
      <div className="mx-auto mt-8 max-w-xl">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Enter your city or ZIP code"
              className="pl-10"
              aria-label="Search by city or ZIP code"
            />
          </div>
          <Button>Search</Button>
        </div>
      </div>

      {/* Featured Installers */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold">Featured Installers</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredInstallers.map((installer) => (
            <InstallerCard key={installer.id} installer={installer} featured />
          ))}
        </div>
      </section>

      {/* All Installers */}
      <section className="mt-12">
        <h2 className="text-xl font-semibold">All Certified Installers</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {allInstallers.map((installer) => (
            <InstallerCard key={installer.id} installer={installer} />
          ))}
        </div>
      </section>

      {/* Become an Installer CTA */}
      <section className="mt-16 rounded-lg bg-muted p-8 text-center">
        <h2 className="text-2xl font-bold">Are you a landscaper?</h2>
        <p className="mt-2 text-muted-foreground">
          Join our network of certified installers. Get leads, training, and
          preferred pricing on Turf World products.
        </p>
        <Button className="mt-4" variant="outline">
          Apply to Join
        </Button>
      </section>

      {/* Why Use a Certified Installer */}
      <section className="mt-16">
        <h2 className="text-center text-2xl font-bold">
          Why Use a Certified Installer?
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          <BenefitCard
            title="Factory Trained"
            description="All installers complete our certification program and know our products inside and out."
          />
          <BenefitCard
            title="Warranty Protected"
            description="Professional installation protects your 15-year warranty. DIY installation may void coverage."
          />
          <BenefitCard
            title="Licensed & Insured"
            description="Every installer is licensed, bonded, and carries liability insurance for your protection."
          />
        </div>
      </section>
    </div>
  );
}

function InstallerCard({
  installer,
  featured = false,
}: {
  installer: (typeof INSTALLERS)[number];
  featured?: boolean;
}) {
  return (
    <Card className={featured ? "border-primary" : ""}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{installer.name}</CardTitle>
            <p className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {installer.city}, {installer.state}
            </p>
          </div>
          {featured && <Badge>Featured</Badge>}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold">{installer.rating}</span>
          </div>
          <span className="text-sm text-muted-foreground">
            ({installer.reviewCount} reviews)
          </span>
          <span className="text-sm text-muted-foreground">
            • {installer.yearsExperience} years exp.
          </span>
        </div>

        {/* Certifications */}
        <div className="flex flex-wrap gap-1">
          {installer.certifications.map((cert) => (
            <span
              key={cert}
              className="inline-flex items-center gap-1 text-xs text-green-700"
            >
              <CheckCircle className="h-3 w-3" />
              {cert}
            </span>
          ))}
        </div>

        {/* Specialties */}
        <div className="flex flex-wrap gap-1">
          {installer.specialties.map((specialty) => (
            <Badge key={specialty} variant="secondary" className="text-xs">
              {specialty}
            </Badge>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button size="sm" className="flex-1">
            Get Quote
          </Button>
          <Button size="sm" variant="outline">
            <Phone className="mr-1 h-3 w-3" />
            Call
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function BenefitCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-lg border p-6 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
        <CheckCircle className="h-6 w-6 text-primary" />
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
