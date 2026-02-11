import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  HelpCircle as LucideHelpCircle,
  Phone as LucidePhone,
  ArrowRight as LucideArrowRight,
} from "lucide-react";
import { Button as ShadcnButton } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { FAQCategory } from "./faq-accordion";

// Cast to work around React 19 JSX type incompatibility
const Button = ShadcnButton as any;
const HelpCircle = LucideHelpCircle as any;
const Phone = LucidePhone as any;
const ArrowRight = LucideArrowRight as any;

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Turf World",
  description:
    "Find answers to common questions about artificial grass, installation, pricing, shipping, and our warranty. Expert help for your turf project.",
  keywords: [
    "artificial grass faq",
    "turf questions",
    "synthetic turf help",
    "turf installation questions",
  ],
};

const faqCategories = [
  {
    category: "Products & Pricing",
    icon: "Package",
    color: "from-primary to-emerald-600",
    questions: [
      {
        question: "What types of artificial grass do you offer?",
        answer:
          "We offer three main categories: Landscape Turf (for lawns and yards), Pet Turf (antimicrobial with high drainage), and Putting Greens (pro-grade performance). Each category has multiple options with varying pile heights (1.25\"-2\"), face weights (60-100+ oz), and price points ($1.30-$3.75+ per sq ft).",
      },
      {
        question: "How much does artificial grass cost?",
        answer:
          "Our turf ranges from $1.30 to $3.75+ per square foot depending on quality and type. Landscape turf starts around $1.30/sq ft, pet turf around $1.85/sq ft, and putting greens around $3.75/sq ft. Use our Project Calculator to get an exact estimate including materials and supplies for your specific project.",
      },
      {
        question: "What's included in the price?",
        answer:
          "The per-square-foot price is for the turf material only. You'll also need installation supplies (weed barrier, nails, infill, seam tape) which our calculator automatically adds based on your project size. We offer transparent pricing with no hidden fees.",
      },
      {
        question: "Do you offer bulk or wholesale pricing?",
        answer:
          "Yes! We offer contractor and wholesale pricing for large orders, commercial projects, and repeat customers. Contact us at (909) 491-2203 or visit our Wholesale page for volume pricing information.",
      },
      {
        question: "What's the difference between landscape and pet turf?",
        answer:
          "Pet turf features antimicrobial backing to prevent bacteria growth and enhanced drainage (up to 1,200 inches/hour) to quickly drain liquids. It uses ZeoFill infill which neutralizes pet odors. Landscape turf is optimized for realistic appearance and foot traffic but has standard drainage and uses silica sand infill.",
      },
    ],
  },
  {
    category: "Ordering & Samples",
    icon: "Sparkles",
    color: "from-emerald-500 to-emerald-700",
    questions: [
      {
        question: "Can I get free samples?",
        answer:
          "Yes! We offer free 8\"x8\" samples (about the size of a standard sheet of paper) so you can see and feel the quality before buying. You can order up to 3 samples per household at no cost, including free shipping. No credit card required.",
      },
      {
        question: "How long does it take to receive samples?",
        answer:
          "Most samples arrive within 3-5 business days. We ship via USPS Priority Mail and you'll receive tracking information via email once your order ships.",
      },
      {
        question: "How do I place an order?",
        answer:
          "Browse our products online, use our Project Calculator to get an exact estimate, then add items to your cart. You can complete your purchase online or call (909) 491-2203 to speak with our team. We accept all major credit cards.",
      },
      {
        question: "Do I need to buy a full roll?",
        answer:
          "No! We can cut turf to your exact specifications. Our standard rolls are 15 feet wide and vary in length, but we'll calculate the optimal cuts for your project and minimize waste. The calculator shows exactly how many rolls and cuts you'll need.",
      },
    ],
  },
  {
    category: "Shipping & Delivery",
    icon: "Truck",
    color: "from-blue-500 to-blue-700",
    questions: [
      {
        question: "Do you ship nationwide?",
        answer:
          "Yes! We ship artificial grass and installation supplies across the entire United States. Shipping costs are calculated at checkout based on order weight, dimensions, and your location.",
      },
      {
        question: "How long does shipping take?",
        answer:
          "Standard ground shipping takes 3-7 business days nationwide. Southern California customers may qualify for next-day delivery (extra fee applies). Orders placed before 2 PM PST ship same business day, subject to stock availability.",
      },
      {
        question: "What are shipping costs?",
        answer:
          "Shipping costs vary based on order size and destination. Southern California orders over $1,500 may qualify for free standard shipping. Large orders requiring freight shipping will receive a custom quote. Use our checkout to see exact shipping costs for your order.",
      },
      {
        question: "Can I pick up my order locally?",
        answer:
          "Absolutely! Choose 'Will Call / Pickup' at checkout to save on shipping. Our warehouse is located at 2370 S. Grove Ave, Ontario, CA 91761. Hours: Mon-Fri 8AM-4PM, Sat 9AM-2PM (Closed Sunday). Most orders are ready same day if placed before 2 PM.",
      },
      {
        question: "What if my order requires freight shipping?",
        answer:
          "Orders over 500 lbs or multiple rolls (typically 3+) require LTL freight shipping. The carrier will contact you to schedule delivery. Curbside delivery is standard. Liftgate service and inside delivery available for additional fee. Someone must be present to receive and sign for freight deliveries.",
      },
    ],
  },
  {
    category: "Installation",
    icon: "Package",
    color: "from-amber-500 to-orange-600",
    questions: [
      {
        question: "Is artificial grass difficult to install?",
        answer:
          "Many homeowners successfully install turf themselves! It requires basic tools and physical labor (excavation, base preparation, cutting, securing). We provide a detailed installation guide. If you prefer professional installation, we can connect you with experienced local installers.",
      },
      {
        question: "What supplies do I need for installation?",
        answer:
          "Essential supplies include: weed barrier (prevents growth underneath), infill (keeps blades upright), 5-inch nails (secure edges), seam tape (join pieces), and optional gopher wire (prevent rodent damage). Our calculator automatically calculates exact quantities needed for your project.",
      },
      {
        question: "Do I need infill?",
        answer:
          "Infill is highly recommended but not required. It helps turf blades stand upright, adds cushioning, improves drainage, and extends turf life. We recommend 1 bag per 50 sq ft. Pet turf uses ZeoFill (odor-neutralizing), while landscape turf uses 60-grit silica sand.",
      },
      {
        question: "How do I prepare the base?",
        answer:
          "Proper base preparation is critical. Steps include: 1) Remove existing grass/sod, 2) Excavate 3-4 inches, 3) Install weed barrier, 4) Add 2-3 inches of decomposed granite or crushed stone, 5) Compact thoroughly, 6) Ensure proper drainage slope. See our Installation Guide for detailed instructions.",
      },
      {
        question: "Can I install turf over concrete?",
        answer:
          "Yes! Turf can be installed over concrete patios, pool decks, or rooftops. Use outdoor carpet padding for cushioning and secure with adhesive or outdoor tape around perimeter and seams. Ensure proper drainage so water doesn't pool on the concrete surface.",
      },
    ],
  },
  {
    category: "Warranty & Returns",
    icon: "Shield",
    color: "from-slate-600 to-slate-800",
    questions: [
      {
        question: "What warranty do you offer?",
        answer:
          "We offer an industry-leading 16-year warranty: 8 years manufacturer warranty (full replacement for defects) plus 8 years extended warranty by Turf World (prorated coverage). The warranty covers UV stability, fiber strength, and manufacturing defects.",
      },
      {
        question: "What does the warranty cover?",
        answer:
          "The warranty covers manufacturing defects, UV degradation, and excessive fading under normal use. It does NOT cover normal wear and tear, damage from improper installation, burns, cuts, vandalism, or damage from incorrect infill or cleaning methods. See our Warranty page for complete details.",
      },
      {
        question: "What is your return policy?",
        answer:
          "We accept returns within 30 days of delivery. Products must be unused, in original packaging, and in resalable condition. A 20% restocking fee applies. Custom orders, cut products, opened infill, and installed turf are non-returnable. Customer pays return shipping unless due to our error.",
      },
      {
        question: "How do I file a warranty claim?",
        answer:
          "Submit claims in writing within 30 days of discovering the defect. Include: sales receipt, product info, installation date, batch/lot number, product sample, 3+ clear photos. Email orders@turf-world.com or call (909) 491-2203. We'll inspect within 30 days and provide repair, replacement, or refund.",
      },
    ],
  },
  {
    category: "Maintenance & Care",
    icon: "Sparkles",
    color: "from-emerald-500 to-emerald-700",
    questions: [
      {
        question: "How do I clean artificial grass?",
        answer:
          "For light cleaning: rinse with water or use a sponge mop with 5% low-sudsing detergent in hot water. For heavy soiling: follow with 3% ammonia solution, then rinse thoroughly. Rainfall is the best natural cleanser. Never use chlorine bleach or highly acidic/alkaline cleaners (pH must be 5-9).",
      },
      {
        question: "Does artificial grass need to be brushed?",
        answer:
          "Yes, periodic brushing is recommended. Use a synthetic bristle brush (never metal) to cross-brush against the grain, keeping fibers upright and restoring appearance. Focus on high-traffic areas. Brushing quarterly maintains optimal look and prevents matting.",
      },
      {
        question: "How long does artificial grass last?",
        answer:
          "With proper care and maintenance, quality artificial grass lasts 15-20+ years. Our products come with a 16-year warranty. Longevity depends on traffic level, UV exposure, maintenance, and quality of installation. Higher face weight (90-100+ oz) products last longer in high-traffic areas.",
      },
      {
        question: "Is artificial grass safe for pets?",
        answer:
          "Absolutely! Our pet turf features antimicrobial backing that prevents bacteria growth and enhanced drainage (up to 1,200 inches/hour). Use ZeoFill infill to neutralize odors. Simply rinse solid waste and hose down the area. Pet turf is non-toxic, lead-free, and PFAS-free.",
      },
      {
        question: "Will artificial grass get hot in the sun?",
        answer:
          "Like any surface, turf can get warm in direct sunlight, but our products use heat-resistant fibers. To cool it down, simply spray with water. Lighter colored turf (tan, olive) stays cooler than darker green varieties. Infill also helps regulate temperature.",
      },
    ],
  },
];

export default function FAQPage() {

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/50 to-background">
      <Breadcrumb items={[{ label: "FAQ" }]} />

      {/* Hero Section */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        <Image
          src="/turf-hero.webp"
          alt="FAQ"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-slate-900/70" />

        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 mb-6 shadow-lg shadow-primary/30">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-white/60 max-w-xl mx-auto">
              Find answers to common questions about artificial grass, installation,
              pricing, and more.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="px-4 sm:px-6 space-y-12">
            {faqCategories.map((category) => (
              <FAQCategory key={category.category} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-12 md:py-16 border-t">
        <div className="container">
          <div className="px-4 sm:px-6">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 md:p-8 shadow-2xl">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl" />

              <div className="relative">
                <div className="flex items-start gap-4 md:gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                      <Phone className="w-6 h-6 md:w-7 md:h-7 text-white" />
                    </div>
                  </div>

                  <div className="flex-1">
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
                      Still Have Questions?
                    </h2>
                    <p className="text-white/70 leading-relaxed mb-4">
                      Our team is here to help! We're happy to answer any questions
                      about products, installation, or your specific project needs.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <a
                        href="tel:909-491-2203"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        (909) 491-2203
                      </a>
                      <a
                        href="mailto:orders@turf-world.com"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium transition-colors"
                      >
                        orders@turf-world.com
                      </a>
                      <Link
                        href="/contact"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition-colors"
                      >
                        Contact Us
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24 border-t">
        <div className="container text-center">
          <h2 className="max-w-3xl mx-auto">Ready to Get Started?</h2>
          <p className="mt-6 text-body-lg text-muted-foreground max-w-xl mx-auto">
            Browse our full selection of artificial grass or get free samples to
            see the quality for yourself.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="btn-premium text-lg px-8 h-14"
              asChild
            >
              <Link href="/products">
                Shop Turf
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 h-14"
              asChild
            >
              <Link href="/samples">Get Free Samples</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
