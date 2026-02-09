import { Metadata } from "next";
import NextLink from "next/link";
import NextImage from "next/image";
import {
  Images as LucideImages,
  MapPin as LucideMapPin,
  Ruler as LucideRuler,
  ArrowRight as LucideArrowRight,
  Home as LucideHome,
  Building2 as LucideBuilding2,
  Dog as LucideDog,
  Flag as LucideFlag,
} from "lucide-react";
import { Button as ShadcnButton } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";

// Cast to work around React 19 JSX type incompatibility
const Link = NextLink as any;
const Image = NextImage as any;
const Button = ShadcnButton as any;
const Images = LucideImages as any;
const MapPin = LucideMapPin as any;
const Ruler = LucideRuler as any;
const ArrowRight = LucideArrowRight as any;
const Home = LucideHome as any;
const Building2 = LucideBuilding2 as any;
const Dog = LucideDog as any;
const Flag = LucideFlag as any;

export const metadata: Metadata = {
  title: "Project Gallery | Turf World Installations",
  description:
    "See real artificial turf installations from Turf World customers. Get inspired for your own project.",
  keywords: [
    "artificial turf gallery",
    "turf installation photos",
    "artificial grass projects",
    "lawn transformation",
  ],
};

const projects = [
  {
    id: 1,
    title: "Modern Backyard Transformation",
    location: "Rancho Cucamonga, CA",
    size: "1,200 sq ft",
    product: "Turf World 88",
    category: "Residential",
    image: "/gallery/project-1.webp",
    featured: true,
  },
  {
    id: 2,
    title: "Pet-Friendly Paradise",
    location: "Ontario, CA",
    size: "800 sq ft",
    product: "Pet Pro 88",
    category: "Pet",
    image: "/gallery/project-2.webp",
  },
  {
    id: 3,
    title: "Backyard Putting Green",
    location: "Upland, CA",
    size: "400 sq ft",
    product: "Pro Putt 15",
    category: "Putting Green",
    image: "/gallery/project-3.webp",
  },
  {
    id: 4,
    title: "Commercial Courtyard",
    location: "Fontana, CA",
    size: "2,500 sq ft",
    product: "Turf World 63",
    category: "Commercial",
    image: "/gallery/project-4.webp",
  },
  {
    id: 5,
    title: "Drought-Free Front Lawn",
    location: "Claremont, CA",
    size: "600 sq ft",
    product: "Turf World 88",
    category: "Residential",
    image: "/gallery/project-5.webp",
  },
  {
    id: 6,
    title: "Rooftop Dog Run",
    location: "Los Angeles, CA",
    size: "350 sq ft",
    product: "Pet Pro 88",
    category: "Pet",
    image: "/gallery/project-6.webp",
  },
  {
    id: 7,
    title: "Poolside Paradise",
    location: "Riverside, CA",
    size: "900 sq ft",
    product: "Turf World 88",
    category: "Residential",
    image: "/gallery/project-7.webp",
  },
  {
    id: 8,
    title: "Restaurant Patio",
    location: "San Bernardino, CA",
    size: "1,800 sq ft",
    product: "Commercial Grade",
    category: "Commercial",
    image: "/gallery/project-8.webp",
  },
  {
    id: 9,
    title: "Backyard Golf Practice",
    location: "Chino Hills, CA",
    size: "500 sq ft",
    product: "Pro Putt 15",
    category: "Putting Green",
    image: "/gallery/project-9.webp",
  },
];

const categories = [
  { name: "All", icon: Images, count: projects.length },
  {
    name: "Residential",
    icon: Home,
    count: projects.filter((p) => p.category === "Residential").length,
  },
  {
    name: "Pet",
    icon: Dog,
    count: projects.filter((p) => p.category === "Pet").length,
  },
  {
    name: "Putting Green",
    icon: Flag,
    count: projects.filter((p) => p.category === "Putting Green").length,
  },
  {
    name: "Commercial",
    icon: Building2,
    count: projects.filter((p) => p.category === "Commercial").length,
  },
];

const stats = [
  { value: "5,000+", label: "Projects Completed" },
  { value: "2M+", label: "Sq Ft Installed" },
  { value: "4.9/5", label: "Customer Rating" },
  { value: "10+", label: "Years Experience" },
];

export default function GalleryPage() {
  const featuredProject = projects.find((p) => p.featured);

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/50 to-background">
      <Breadcrumb items={[{ label: "Project Gallery" }]} />

      {/* Hero Section */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl" />

        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 mb-6 shadow-lg shadow-primary/30">
              <Images className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Project Gallery
            </h1>
            <p className="text-lg text-white/60">
              See real transformations from Turf World customers across Southern
              California
            </p>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="text-center p-4 rounded-xl bg-white/5 border border-white/10"
              >
                <p className="text-2xl md:text-3xl font-bold text-white">
                  {stat.value}
                </p>
                <p className="text-sm text-white/60">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-6 border-b bg-white sticky top-16 z-40">
        <div className="container">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.name}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    category.name === "All"
                      ? "bg-primary text-white"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.name}
                  <span className="text-xs opacity-70">({category.count})</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Project */}
      {featuredProject && (
        <section className="py-12 md:py-16">
          <div className="container">
            <div className="mb-8">
              <span className="text-caption uppercase tracking-widest text-primary font-semibold">
                Featured Project
              </span>
            </div>

            <div className="relative rounded-3xl overflow-hidden">
              <div className="aspect-[21/9] relative">
                <Image
                  src={featuredProject.image}
                  alt={featuredProject.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
              </div>

              <div className="absolute inset-0 flex items-center">
                <div className="p-8 md:p-12 max-w-xl">
                  <span className="inline-block px-3 py-1 rounded-full bg-primary text-white text-sm font-semibold mb-4">
                    {featuredProject.category}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    {featuredProject.title}
                  </h2>

                  <div className="flex flex-wrap gap-4 text-white/80 mb-6">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      {featuredProject.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Ruler className="w-4 h-4" />
                      {featuredProject.size}
                    </span>
                  </div>

                  <p className="text-white/70 mb-6">
                    Product Used:{" "}
                    <span className="text-white font-semibold">
                      {featuredProject.product}
                    </span>
                  </p>

                  <Button
                    className="bg-white text-slate-900 hover:bg-white/90"
                    asChild
                  >
                    <Link href="/samples">
                      Get This Look
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Gallery Grid */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container">
          <div className="mb-8">
            <span className="text-caption uppercase tracking-widest text-primary font-semibold">
              All Projects
            </span>
            <h2 className="mt-2">Browse Our Work</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="group relative rounded-2xl overflow-hidden bg-white border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-[4/3] relative overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 flex items-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      size="sm"
                      className="bg-white text-slate-900 hover:bg-white/90"
                    >
                      View Details
                    </Button>
                  </div>

                  {/* Category badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-semibold">
                      {project.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2">{project.title}</h3>

                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {project.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Ruler className="w-3.5 h-3.5" />
                      {project.size}
                    </span>
                  </div>

                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm">
                      <span className="text-muted-foreground">Product:</span>{" "}
                      <span className="font-medium">{project.product}</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Submit Your Project */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="mb-4">Share Your Transformation</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Installed Turf World products? We&apos;d love to feature your
              project! Share your photos and inspire other homeowners.
            </p>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Submit Your Project</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24 border-t">
        <div className="container text-center">
          <h2 className="max-w-3xl mx-auto">Ready to Transform Your Space?</h2>
          <p className="mt-6 text-body-lg text-muted-foreground max-w-xl mx-auto">
            Get free samples and start planning your project today.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="btn-premium text-lg px-8 h-14" asChild>
              <Link href="/samples">
                Get Free Samples
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 h-14" asChild>
              <Link href="/calculator">Use Calculator</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
