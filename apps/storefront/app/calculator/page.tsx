import { Metadata } from "next";
import Link from "next/link";
import {
  Calculator as LucideCalculator,
  Sparkles as LucideSparkles,
  Ruler as LucideRuler,
  Scissors as LucideScissors,
  Package as LucidePackage,
  ArrowRight as LucideArrowRight,
} from "lucide-react";
import { CalculatorForm } from "./calculator-form";
import { Button as ShadcnButton } from "@/components/ui/button";

// Cast Button to work around React 19 JSX type incompatibility
const Button = ShadcnButton as any;
import { Breadcrumb } from "@/components/ui/breadcrumb";

// Cast Lucide icons to work around React 19 JSX type incompatibility
const Calculator = LucideCalculator as any;
const Sparkles = LucideSparkles as any;
const Ruler = LucideRuler as any;
const Scissors = LucideScissors as any;
const Package = LucidePackage as any;
const ArrowRight = LucideArrowRight as any;

export const metadata: Metadata = {
  title: "Project Calculator | How Much Turf Do I Need?",
  description:
    "Free artificial turf calculator. Enter your dimensions and instantly see how many rolls, seam tape, and infill bags you need. No signup required.",
  keywords: [
    "turf calculator",
    "artificial grass calculator",
    "how much turf do I need",
    "turf cost calculator",
    "lawn calculator",
  ],
};

const features = [
  {
    iconName: "Ruler",
    title: "Precise Measurements",
    description: "Accounts for 15ft roll widths and optimal seam placement",
  },
  {
    iconName: "Scissors",
    title: "Waste Calculation",
    description: "Includes realistic waste estimates for clean edges",
  },
  {
    iconName: "Package",
    title: "Complete Materials List",
    description: "Seam tape, infill, adhesive - everything you need",
  },
];

const faqs = [
  {
    question: "Why is turf sold in 15ft widths?",
    answer:
      "15ft is the industry standard width for artificial turf rolls. This width is optimal for manufacturing, shipping, and installation. Most residential projects can be covered with 1-2 rolls side by side.",
  },
  {
    question: "What is Total Weight and why does it matter?",
    answer:
      "Total Weight measures the density of turf fibers in ounces per square yard. Higher Total Weight (80oz+) means more fibers, better durability, and a more realistic appearance. For high-traffic areas or pets, we recommend 80oz or higher.",
  },
  {
    question: "Do I need infill?",
    answer:
      "Infill helps turf blades stand upright, provides cushioning, and aids drainage. For pet turf, we strongly recommend ZeoFill organic infill which also neutralizes odors. Standard landscaping turf can work without infill but will look better with it.",
  },
  {
    question: "How do I join multiple pieces of turf?",
    answer:
      "Use seam tape and turf adhesive to join pieces. The tape goes underneath the seam, adhesive is applied on top, then the turf edges are pressed together. Our calculator automatically tells you how much seam tape you need.",
  },
  {
    question: "How accurate is this calculator?",
    answer:
      "Our calculator uses the same formulas professional installers use. It accounts for the 15ft roll width constraint and calculates material needed including typical waste. For complex shapes (L-shaped yards, curves), we recommend adding 5-10% extra material.",
  },
];

export default function CalculatorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/50 to-background">
      <Breadcrumb items={[{ label: "Calculator" }]} />

      {/* Calculator Section - Full Tool */}
      <section className="py-4 sm:py-8 md:py-12">
        <div className="container px-3 sm:px-6">
          <div className="mx-auto max-w-[80rem]">
            {/* Calculator Card */}
            <div className="relative">
              {/* Glow effect - hidden on mobile for performance */}
              <div className="hidden sm:block absolute -inset-1 bg-gradient-to-r from-primary/20 via-emerald-500/20 to-primary/20 rounded-[2rem] blur-xl opacity-50" />

              {/* Main card */}
              <div className="relative bg-card rounded-2xl sm:rounded-3xl border shadow-premium overflow-hidden">
                {/* Integrated Header */}
                <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 sm:px-6 py-4 sm:py-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-lg">
                        <Calculator className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                      <div>
                        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                          Project Calculator
                        </h1>
                        <p className="text-xs sm:text-sm text-white/60">
                          Enter dimensions → Select Your Turf → Get your materials list
                        </p>
                      </div>
                    </div>
                    {/* Feature pills - desktop only */}
                    <div className="hidden md:flex items-center gap-2">
                      {features.map((feature) => (
                        <div
                          key={feature.title}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 border border-white/10"
                        >
                          {feature.iconName === "Ruler" && <Ruler className="w-3.5 h-3.5 text-primary" />}
                          {feature.iconName === "Scissors" && <Scissors className="w-3.5 h-3.5 text-primary" />}
                          {feature.iconName === "Package" && <Package className="w-3.5 h-3.5 text-primary" />}
                          <span className="text-xs font-medium text-white/80">{feature.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Calculator Content */}
                <div className="p-3 sm:p-6 pb-6 sm:pb-10">
                  <CalculatorForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <span className="text-caption uppercase tracking-widest text-primary font-semibold">
              How It Works
            </span>
            <h2 className="mt-4">Three Steps to Your Perfect Estimate</h2>
          </div>

          <div className="mx-auto max-w-4xl">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Enter Dimensions",
                  description:
                    "Input your project width and length. Our calculator handles the 15ft roll math.",
                },
                {
                  step: "02",
                  title: "Select Your Turf",
                  description:
                    "Choose from our premium collection. See real-time pricing as you select.",
                },
                {
                  step: "03",
                  title: "Get Your List",
                  description:
                    "Receive a complete materials breakdown with quantities and total cost.",
                },
              ].map((item, index) => (
                <div key={item.step} className="relative">
                  {index < 2 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-primary/30 to-transparent -translate-x-1/2" />
                  )}
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                      <span className="text-2xl font-bold text-primary">
                        {item.step}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="mt-2 text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="text-center mb-12">
            <span className="text-caption uppercase tracking-widest text-primary font-semibold">
              FAQ
            </span>
            <h2 className="mt-4">Common Questions</h2>
          </div>

          <div className="grid gap-4 max-w-5xl mx-auto">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="group p-6 rounded-2xl bg-white border border-border/50 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300"
              >
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{faq.question}</h3>
                <p className="mt-2 text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary to-emerald-700">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center text-white">
            <Sparkles className="w-12 h-12 mx-auto mb-6 opacity-80" />
            <h2 className="text-white">Ready to Transform Your Space?</h2>
            <p className="mt-4 text-xl text-white/80">
              Get free samples shipped to your door and see the quality firsthand.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90"
                asChild
              >
                <Link href="/samples">
                  Get Free Samples
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="border-2 border-white/40 text-white bg-white/10 hover:bg-white/20 hover:text-white"
                asChild
              >
                <Link href="/products">Browse Products</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
