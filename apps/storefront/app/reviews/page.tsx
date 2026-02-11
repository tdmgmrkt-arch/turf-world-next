import { Metadata } from "next";
import NextLink from "next/link";
import NextImage from "next/image";
import {
  Star as LucideStar,
  Quote as LucideQuote,
  ThumbsUp as LucideThumbsUp,
  CheckCircle as LucideCheckCircle,
  ArrowRight as LucideArrowRight,
  Shield as LucideShield,
  Truck as LucideTruck,
  Heart as LucideHeart,
} from "lucide-react";
import { Button as ShadcnButton } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";

// Cast to work around React 19 JSX type incompatibility
const Link = NextLink as any;
const Image = NextImage as any;
const Button = ShadcnButton as any;
const Star = LucideStar as any;
const Quote = LucideQuote as any;
const ThumbsUp = LucideThumbsUp as any;
const CheckCircle = LucideCheckCircle as any;
const ArrowRight = LucideArrowRight as any;
const Shield = LucideShield as any;
const Truck = LucideTruck as any;
const Heart = LucideHeart as any;

export const metadata: Metadata = {
  title: "Customer Reviews | Turf World",
  description:
    "Read real reviews from Turf World customers. See why homeowners and businesses trust us for their artificial turf needs.",
  keywords: [
    "turf world reviews",
    "artificial turf reviews",
    "customer testimonials",
    "turf installation reviews",
  ],
};

const reviews = [
  {
    id: 1,
    name: "Michael R.",
    location: "Rancho Cucamonga, CA",
    rating: 5,
    title: "Best investment for our backyard!",
    review:
      "We were spending $300+ per month on water and countless weekends mowing. After installing Turf World 88, our backyard looks amazing year-round with zero maintenance. The quality is incredible - our neighbors can't believe it's artificial. The kids and dogs love it!",
    product: "Turf World 88",
    projectSize: "1,200 sq ft",
    date: "January 2025",
    verified: true,
    helpful: 47,
    image: "/reviews/review-1.webp",
  },
  {
    id: 2,
    name: "Sarah T.",
    location: "Ontario, CA",
    rating: 5,
    title: "Perfect for our three dogs",
    review:
      "After trying multiple pet turf options, Turf World's Pet Pro is by far the best. The drainage is excellent - no more muddy paws! The antimicrobial properties really work, and cleaning is a breeze. It's held up beautifully after a year of heavy use.",
    product: "Pet Pro 88",
    projectSize: "800 sq ft",
    date: "December 2024",
    verified: true,
    helpful: 38,
    image: "/reviews/review-2.webp",
  },
  {
    id: 3,
    name: "David L.",
    location: "Upland, CA",
    rating: 5,
    title: "Golf practice at home!",
    review:
      "As an avid golfer, I wanted a practice green that played like the real thing. The Pro Putt 15 is tournament-quality - the ball roll is true and consistent. My short game has improved dramatically. Worth every penny!",
    product: "Pro Putt 15",
    projectSize: "450 sq ft",
    date: "November 2024",
    verified: true,
    helpful: 29,
  },
  {
    id: 4,
    name: "Jennifer M.",
    location: "Fontana, CA",
    rating: 5,
    title: "Transformed our rental property",
    review:
      "We own several rental properties and were tired of dealing with dead lawns and landscape maintenance. Installed Turf World 63 at all of them - tenants love it, maintenance is zero, and properties look great in listing photos. Great ROI!",
    product: "Turf World 63",
    projectSize: "600 sq ft (per property)",
    date: "November 2024",
    verified: true,
    helpful: 52,
  },
  {
    id: 5,
    name: "Carlos G.",
    location: "Riverside, CA",
    rating: 5,
    title: "Restaurant patio looks amazing",
    review:
      "Installed commercial turf on our restaurant patio. Customers constantly compliment it, and we save thousands on landscaping annually. The team at Turf World was incredibly helpful with wholesale pricing and product selection.",
    product: "Commercial Grade",
    projectSize: "2,000 sq ft",
    date: "October 2024",
    verified: true,
    helpful: 31,
  },
  {
    id: 6,
    name: "Amanda K.",
    location: "Claremont, CA",
    rating: 5,
    title: "Finally, a green lawn in California!",
    review:
      "With all the drought restrictions, our natural lawn was always brown and embarrassing. Now we have a lush, green yard that's the envy of the neighborhood. The installation guide was clear, and their support team answered all my questions.",
    product: "Turf World 88",
    projectSize: "950 sq ft",
    date: "October 2024",
    verified: true,
    helpful: 44,
    image: "/reviews/review-6.webp",
  },
  {
    id: 7,
    name: "Robert H.",
    location: "San Bernardino, CA",
    rating: 4,
    title: "Great product, minor learning curve",
    review:
      "The turf quality is excellent and looks fantastic. Installation took a bit longer than expected (I'm a DIYer), but their customer service walked me through the tricky parts. Six months later, still looks brand new.",
    product: "Turf World 88",
    projectSize: "700 sq ft",
    date: "September 2024",
    verified: true,
    helpful: 23,
  },
  {
    id: 8,
    name: "Lisa P.",
    location: "Corona, CA",
    rating: 5,
    title: "Exceeded all expectations",
    review:
      "I was skeptical about artificial turf looking 'real' but Turf World 88 is absolutely stunning. The multi-tone blades look natural, and it feels soft underfoot. My kids play on it daily with no wear showing. The 16-Year Warranty gave me confidence.",
    product: "Turf World 88",
    projectSize: "1,100 sq ft",
    date: "September 2024",
    verified: true,
    helpful: 36,
  },
];

const ratingStats = {
  average: 4.9,
  total: 1247,
  breakdown: [
    { stars: 5, percentage: 92 },
    { stars: 4, percentage: 6 },
    { stars: 3, percentage: 1 },
    { stars: 2, percentage: 0.5 },
    { stars: 1, percentage: 0.5 },
  ],
};

const trustFactors = [
  {
    icon: CheckCircle,
    title: "Verified Purchases",
    description: "All reviews are from confirmed Turf World customers",
  },
  {
    icon: Shield,
    title: "16-Year Warranty",
    description: "Every product backed by our industry-leading warranty",
  },
  {
    icon: Truck,
    title: "Fast Shipping",
    description: "Nationwide delivery across the continental US",
  },
  {
    icon: Heart,
    title: "Family Owned",
    description: "Serving Southern California families since 2015",
  },
];

export default function ReviewsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/50 to-background">
      <Breadcrumb items={[{ label: "Reviews" }]} />

      {/* Hero Section */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl" />

        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 mb-6 shadow-lg shadow-primary/30">
              <Star className="w-8 h-8 text-white fill-white" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Customer Reviews
            </h1>
            <p className="text-lg text-white/60 mb-8">
              See what real customers are saying about Turf World products
            </p>

            {/* Rating Summary */}
            <div className="inline-flex items-center gap-6 p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
              <div className="text-center">
                <p className="text-5xl font-bold text-white">
                  {ratingStats.average}
                </p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-5 h-5 text-amber-400 fill-amber-400"
                    />
                  ))}
                </div>
              </div>
              <div className="h-16 w-px bg-white/20" />
              <div className="text-left">
                <p className="text-2xl font-bold text-white">
                  {ratingStats.total.toLocaleString()}
                </p>
                <p className="text-white/60 text-sm">Verified Reviews</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rating Breakdown */}
      <section className="py-12 bg-white border-b">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-6 text-center">
              Rating Breakdown
            </h2>
            <div className="space-y-3">
              {ratingStats.breakdown.map((item) => (
                <div key={item.stars} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-20">
                    <span className="font-medium">{item.stars}</span>
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  </div>
                  <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-12 text-right">
                    {item.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Factors */}
      <section className="py-12 bg-muted/30">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustFactors.map((factor) => {
              const Icon = factor.icon;
              return (
                <div
                  key={factor.title}
                  className="flex items-start gap-4 p-6 rounded-2xl bg-white border border-border/50 shadow-sm"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{factor.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {factor.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="mb-8">
            <span className="text-caption uppercase tracking-widest text-primary font-semibold">
              Customer Stories
            </span>
            <h2 className="mt-2">What Our Customers Say</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="group p-6 md:p-8 rounded-2xl bg-white border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                      {review.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{review.name}</p>
                        {review.verified && (
                          <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                            <CheckCircle className="w-3 h-3" />
                            Verified
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {review.location}
                      </p>
                    </div>
                  </div>
                  <Quote className="w-8 h-8 text-primary/20" />
                </div>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating
                          ? "text-amber-400 fill-amber-400"
                          : "text-muted"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">
                    {review.date}
                  </span>
                </div>

                {/* Content */}
                <h3 className="font-bold mb-2">{review.title}</h3>
                <p className="text-muted-foreground mb-4">{review.review}</p>

                {/* Image if available */}
                {review.image && (
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
                    <Image
                      src={review.image}
                      alt={`${review.name}'s project`}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Product Info */}
                <div className="flex flex-wrap gap-4 pt-4 border-t text-sm">
                  <div>
                    <span className="text-muted-foreground">Product: </span>
                    <span className="font-medium">{review.product}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Size: </span>
                    <span className="font-medium">{review.projectSize}</span>
                  </div>
                </div>

                {/* Helpful */}
                <div className="flex items-center gap-4 mt-4 pt-4 border-t">
                  <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                    <ThumbsUp className="w-4 h-4" />
                    Helpful ({review.helpful})
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="mt-12 text-center">
            <Button variant="outline" size="lg">
              Load More Reviews
            </Button>
          </div>
        </div>
      </section>

      {/* Write a Review CTA */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="mb-4">Share Your Experience</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Purchased from Turf World? We&apos;d love to hear about your
              project! Your feedback helps other homeowners make informed
              decisions.
            </p>
            <Button size="lg" asChild>
              <Link href="/contact">Write a Review</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24 border-t">
        <div className="container text-center">
          <h2 className="max-w-3xl mx-auto">Join Thousands of Happy Customers</h2>
          <p className="mt-6 text-body-lg text-muted-foreground max-w-xl mx-auto">
            Get free samples and see why Turf World is rated 4.9/5 stars.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="btn-premium text-lg px-8 h-14" asChild>
              <Link href="/samples">
                Get Free Samples
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 h-14" asChild>
              <Link href="/products">Shop Products</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
