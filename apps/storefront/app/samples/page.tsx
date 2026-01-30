import { Metadata } from "next";
import Image from "next/image";
import {
  Sparkles,
  Truck,
  Clock,
  HandHeart,
  Star,
  Shield,
  Check,
  Gift,
} from "lucide-react";
import { SampleBoxBuilder } from "./sample-box-builder";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export const metadata: Metadata = {
  title: "Free Turf Samples | Feel It Before You Buy",
  description:
    "Order up to 3 free artificial turf samples. See and feel the quality before you commit. Free shipping, no credit card required.",
  keywords: [
    "free turf samples",
    "artificial grass samples",
    "turf swatches",
    "feel artificial grass",
  ],
};

export default function SamplesPage() {
  return (
    <div className="min-h-screen">
      <Breadcrumb items={[{ label: "Free Samples" }]} />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 sm:py-16 md:py-24 lg:py-28">
        {/* Background Image */}
        <Image
          src="/order-samples-hero.webp"
          alt="Order turf samples"
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-slate-900/70" />

        <div className="container px-4 sm:px-6 relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-xs sm:text-sm text-white/80 mb-4 sm:mb-6">
              <Gift className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
              <span>100% Free • No Credit Card Required</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white tracking-tight">
              See It. Feel It.{" "}
              <span className="text-[#34CE95]">
                Love It.
              </span>
            </h1>

            <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              Experience premium turf quality firsthand. Order up to 3 free samples
              and we&apos;ll ship them directly to your door—no strings attached.
            </p>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-6 sm:mt-10">
              <div className="flex items-center gap-2 text-white/60">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                </div>
                <span className="text-xs sm:text-sm">Free Shipping</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                </div>
                <span className="text-xs sm:text-sm">3-5 Day Delivery</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <HandHeart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                </div>
                <span className="text-xs sm:text-sm">No Obligation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Builder Section */}
      <section className="py-10 sm:py-14 md:py-20 bg-gradient-to-b from-muted/30 to-background">
        <div className="container px-4 sm:px-6">
          <SampleBoxBuilder />
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 sm:py-16 md:py-24 lg:py-28 bg-white">
        <div className="container px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-primary uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Why Order Samples
            </span>
            <h2 className="mt-3 sm:mt-4 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              The Smart Way to Shop
            </h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Don&apos;t just look at pictures. Experience the quality that sets us apart.
            </p>
          </div>

          <div className="grid gap-6 sm:gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            <BenefitCard
              icon={<HandHeart className="w-6 h-6" />}
              iconBg="from-primary to-emerald-600"
              title="Feel the Quality"
              description="Touch the fibers, feel the backing, and see the true colors in your own lighting conditions."
              features={["Realistic texture", "Premium fibers", "Soft underfoot"]}
            />
            <BenefitCard
              icon={<Star className="w-6 h-6" />}
              iconBg="from-amber-500 to-orange-600"
              title="Compare Options"
              description="Order different face weights and colors to find your perfect match before committing."
              features={["Multiple weights", "Color variations", "Side-by-side compare"]}
            />
            <BenefitCard
              icon={<Shield className="w-6 h-6" />}
              iconBg="from-blue-500 to-indigo-600"
              title="Test with Pets"
              description="Let your furry friends walk on it. See how they react to the texture and drainage."
              features={["Pet-safe materials", "Drainage test", "Odor resistance"]}
            />
          </div>
        </div>
      </section>

      {/* Social Proof Strip */}
      <section className="py-8 sm:py-12 bg-gradient-to-r from-primary to-emerald-600">
        <div className="container px-4 sm:px-6">
          <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 md:gap-16 text-white">
            <div className="text-center">
              <p className="text-3xl sm:text-4xl md:text-5xl font-bold">50K+</p>
              <p className="text-xs sm:text-sm text-white/80 mt-1">Samples Shipped</p>
            </div>
            <div className="hidden md:block w-px h-12 bg-white/20" />
            <div className="text-center">
              <p className="text-3xl sm:text-4xl md:text-5xl font-bold">4.9</p>
              <p className="text-xs sm:text-sm text-white/80 mt-1">Average Rating</p>
            </div>
            <div className="hidden md:block w-px h-12 bg-white/20" />
            <div className="text-center">
              <p className="text-3xl sm:text-4xl md:text-5xl font-bold">92%</p>
              <p className="text-xs sm:text-sm text-white/80 mt-1">Conversion Rate</p>
            </div>
            <div className="hidden md:block w-px h-12 bg-white/20" />
            <div className="text-center">
              <p className="text-3xl sm:text-4xl md:text-5xl font-bold">48hr</p>
              <p className="text-xs sm:text-sm text-white/80 mt-1">Avg Ship Time</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 md:py-24 lg:py-28">
        <div className="container px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
              Common Questions
            </h2>
            <p className="mt-3 sm:mt-4 text-sm sm:text-base text-muted-foreground">
              Everything you need to know about our free sample program.
            </p>
          </div>

          <div className="grid gap-3 sm:gap-4 max-w-5xl mx-auto">
            <FAQCard
              question="How long does shipping take?"
              answer="Most samples arrive within 3-5 business days. We ship via USPS Priority Mail and you'll receive tracking info via email."
            />
            <FAQCard
              question="Is it really free?"
              answer="Yes! We cover the cost of samples and shipping. No credit card required, no hidden fees, no obligation to buy."
            />
            <FAQCard
              question="What size are the samples?"
              answer="Each sample is approximately 8&quot; x 8&quot; (about the size of a standard sheet of paper). Large enough to truly feel the quality."
            />
            <FAQCard
              question="Can I order more than 3 samples?"
              answer="We limit to 3 samples per household to keep the program sustainable. Choose wisely! If you need more, contact our team."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function BenefitCard({
  icon,
  iconBg,
  title,
  description,
  features,
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  description: string;
  features: string[];
}) {
  return (
    <div className="group relative p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl bg-gradient-to-br from-muted/50 to-white border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Decorative gradient - hidden on mobile */}
      <div className="hidden sm:block absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative">
        <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${iconBg} flex items-center justify-center text-white shadow-lg mb-4 sm:mb-6`}>
          {icon}
        </div>
        <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">{title}</h3>
        <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">{description}</p>
        <ul className="space-y-2">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-xs sm:text-sm">
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary" />
              </div>
              <span className="text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function FAQCard({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <div className="group p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white border border-border/50 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300">
      <h3 className="font-semibold text-base sm:text-lg group-hover:text-primary transition-colors">{question}</h3>
      <p className="mt-1.5 sm:mt-2 text-sm sm:text-base text-muted-foreground">{answer}</p>
    </div>
  );
}
