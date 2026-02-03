import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle,
  Package,
  Truck,
  Settings,
  HeadphonesIcon,
  FileText,
  ShoppingBag,
  TrendingUp,
  Star,
  Users,
  Home,
  Building2,
  Dog,
  Trophy,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export const metadata: Metadata = {
  title: "Wholesale Partner Program | Turf World",
  description:
    "Join 5,000+ happy landscapers and contractors who trust Turf World for premium artificial turf at exclusive wholesale prices.",
  keywords: [
    "wholesale turf",
    "contractor pricing",
    "bulk turf",
    "landscaper discount",
    "reseller program",
  ],
};

const benefits = [
  {
    icon: CheckCircle,
    title: "No Surprises",
    description:
      "Our turf products are engineered for durability, performance, and aesthetics. With Turf World, you can be confident you're offering your customers the best while maintaining healthy profit margins. We provide exclusive wholesale pricing to contractors and resellers.",
  },
  {
    icon: Package,
    title: "Bulk Turf Supply You Can Count On",
    description:
      "We know your business depends on a reliable supply of materials. That's why we offer bulk ordering options and flexible supply arrangements to ensure you always have the turf you need, when you need it.",
  },
  {
    icon: Settings,
    title: "Customized Solutions",
    description:
      "Whether you're working on a commercial landscape, a residential project, or sports fields, we have the perfect turf solutions for every application. Our diverse range of products makes it easy to meet any client's needs.",
  },
  {
    icon: HeadphonesIcon,
    title: "Long-Term Support",
    description:
      "Need assistance with product selection or logistics? Our team of turf experts is here to help. We offer dedicated support to contractors and resellers, from choosing the right product to managing delivery schedules.",
  },
];

const steps = [
  {
    number: 1,
    icon: FileText,
    title: "Apply for Wholesale Pricing",
    description:
      "Fill out our quick form to apply for our exclusive reseller and contractor pricing. Our team will verify your details and get in touch with the next steps.",
  },
  {
    number: 2,
    icon: ShoppingBag,
    title: "Access Our Product Catalog",
    description:
      "Once approved, access Turf World's wholesale pricing, our product catalog, and bulk order options to find the right turf for your clients quickly and easily.",
  },
  {
    number: 3,
    icon: TrendingUp,
    title: "Grow Your Business",
    description:
      "With Turf World's high-quality turf and exceptional customer service, you'll have everything you need to grow your business and deliver superior results for your clients.",
  },
];

const testimonials = [
  {
    quote:
      "Switched over to Turf World after trying different turf distributors, and I can confidently say their turfs are top-notch. They offer a great range of materials with unbeatable quality. The product I received not only met but far exceeded my expectations. They also have turf options that stand up better in the sun compared to others. If you're looking for high-quality turf, I highly recommend giving them a try—you won't be disappointed.",
    title: "Give them a try you won't be disappointed",
    name: "James M.",
    initials: "JM",
    role: "Landscape Contractor",
  },
  {
    quote:
      "The service I received from Turf World was top-tier. Their team answered all my questions quickly and thoroughly. The communication was clear and prompt, ensuring all my concerns were addressed. Their turf quality is also incredible—it completely transformed my lawn into a lush, green oasis. Turf World goes above and beyond, and I would highly recommend them to anyone seeking exceptional products and service.",
    title: "Turf World is truly exceptional",
    name: "Sarah R.",
    initials: "SR",
    role: "Business Owner",
  },
  {
    quote:
      "Look no further—Turf World is the best in the game! My turf looks absolutely amazing! Their staff is friendly, knowledgeable, and professional. Fast and efficient service with competitive and affordable pricing. They answered all my questions quickly and patiently. The quality of the turf and their products are top-notch. I definitely recommend Turf World for all your artificial turf needs; you absolutely won't regret it!",
    title: "Highly recommend this",
    name: "Mike T.",
    initials: "MT",
    role: "Landscaping Professional",
  },
];

const productCategories = [
  { name: "Residential Lawns", icon: Home, href: "/products?use=landscape" },
  { name: "Commercial Landscapes", icon: Building2, href: "/products?use=commercial" },
  { name: "Pet-Friendly Turf", icon: Dog, href: "/products?use=pet" },
  { name: "Sports Fields", icon: Trophy, href: "/products?use=putting" },
];

const partnerBenefits = [
  {
    icon: CheckCircle,
    title: "No Surprises",
    description: "We provide clear timelines and keep you informed throughout the entire process.",
  },
  {
    icon: Settings,
    title: "Professional Installation",
    description: "Our skilled team will install your turf seamlessly, ensuring a natural, flawless finish.",
  },
  {
    icon: Package,
    title: "Customized Solutions",
    description: "Our experts will assess your outdoor space and recommend the best turf options to suit your needs and vision.",
  },
  {
    icon: HeadphonesIcon,
    title: "Long-Term Support",
    description: "We're here for you beyond installation, offering maintenance tips and support to keep your lawn looking lush and beautiful.",
  },
];

export default function BrokerPage() {
  return (
    <div className="min-h-screen">
      <Breadcrumb items={[{ label: "Wholesale" }]} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 sm:py-16 md:py-24">
        <Image
          src="/broker-program-hero.webp"
          alt="Wholesale partner program"
          fill
          className="object-cover object-bottom"
          priority
        />
        <div className="absolute inset-0 bg-slate-900/70" />

        <div className="container px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-xs sm:text-sm text-white/80 mb-4 sm:mb-6">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#34CE95]" />
              <span>Wholesale Partner Program</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
              Grow Your Business with{" "}
              <span className="text-[#34CE95]">Turf World</span>
            </h1>

            <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              Join 5,000+ happy landscapers and contractors who trust Turf World
              for premium artificial turf at exclusive wholesale prices.
            </p>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-6 sm:mt-8">
              <div className="flex items-center gap-2 text-white/60">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                </div>
                <span className="text-xs sm:text-sm">Free Shipping</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                </div>
                <span className="text-xs sm:text-sm">16-Year Warranty</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container">
          <div className="grid gap-12 md:grid-cols-2">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#34CE95] to-emerald-600 flex items-center justify-center text-white shadow-lg">
                    <benefit.icon className="w-7 h-7" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#34CE95] uppercase tracking-wider mb-4">
              Getting Started
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              How Our Process Works
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {steps.map((step) => (
              <div
                key={step.number}
                className="relative p-8 rounded-3xl bg-white border border-border/50 shadow-lg"
              >
                <div className="absolute -top-5 left-8">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#34CE95] to-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {step.number}
                  </div>
                </div>
                <div className="pt-4">
                  <div className="w-12 h-12 rounded-xl bg-[#34CE95]/10 flex items-center justify-center mb-4">
                    <step.icon className="w-6 h-6 text-[#34CE95]" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="premium" size="lg" className="h-14 px-8" asChild>
              <Link href="#apply">
                Start Your Application
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="container">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#34CE95] uppercase tracking-wider mb-4">
              Success Stories
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
              Join 5,000+ Happy Landscapers!
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="p-8 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">
                  &ldquo;{testimonial.title}&rdquo;
                </h3>
                <p className="text-white/70 text-sm leading-relaxed mb-6">
                  {testimonial.quote}
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#34CE95] to-emerald-600 flex items-center justify-center text-white font-bold">
                    {testimonial.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="text-sm text-white/60">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-20 md:py-28 bg-white">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#34CE95] uppercase tracking-wider mb-4">
                Our Products
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Premium Artificial Grass Solutions
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Discover the transformation Turf World can bring to your outdoor
                spaces. Our premium, long-lasting turf solutions range from lush,
                maintenance-free lawns to custom-designed landscapes.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Whether you&apos;re enhancing residential greenery, creating durable
                commercial landscapes, or installing pet-friendly and
                high-performance sports turf, Turf World has the perfect solution.
                Enjoy the beauty, durability, and functionality you need for any
                project.
              </p>
              <Button variant="premium" size="lg" asChild>
                <Link href="/products">
                  Browse Our Catalog
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {productCategories.map((category) => (
                <Link
                  key={category.name}
                  href={category.href}
                  className="group p-6 rounded-2xl bg-muted/50 border border-border/50 hover:border-[#34CE95]/50 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#34CE95]/10 flex items-center justify-center mb-4 group-hover:bg-[#34CE95]/20 transition-colors">
                    <category.icon className="w-6 h-6 text-[#34CE95]" />
                  </div>
                  <h3 className="font-semibold group-hover:text-[#34CE95] transition-colors">
                    {category.name}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partner Benefits Section */}
      <section className="py-20 md:py-28 bg-muted/30">
        <div className="container">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#34CE95] uppercase tracking-wider mb-4">
              Partner Benefits
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              What You Can Expect With Turf World
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
            {partnerBenefits.map((benefit) => (
              <div
                key={benefit.title}
                className="text-center p-6 rounded-2xl bg-white border border-border/50 shadow-sm"
              >
                <div className="w-14 h-14 rounded-2xl bg-[#34CE95]/10 flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="w-7 h-7 text-[#34CE95]" />
                </div>
                <h3 className="font-bold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="apply" className="py-20 md:py-28 bg-gradient-to-br from-[#34CE95] to-emerald-600">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">
              Ready to Partner with Turf World?
            </h2>
            <p className="text-lg text-white/90 mb-10">
              Apply today and get access to exclusive wholesale pricing, dedicated
              support, and premium turf products that will help grow your business.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="h-14 px-8 bg-white text-[#34CE95] hover:bg-white/90 rounded-xl"
                asChild
              >
                <Link href="/contact">
                  Apply Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 border-white/30 text-white hover:bg-white/10 rounded-xl"
                asChild
              >
                <Link href="/samples">Request Free Samples</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
