"use client";

import { useState } from "react";
import NextLink from "next/link";
import NextImage from "next/image";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  ArrowRight,
  Sparkles,
  PartyPopper,
  Loader2,
  Shield,
  Truck,
  Gift,
  Calculator,
} from "lucide-react";
import { Button as ShadcnButton } from "@/components/ui/button";
import { Input as ShadcnInput } from "@/components/ui/input";
import { Textarea as ShadcnTextarea } from "@/components/ui/textarea";
import { Label as ShadcnLabel } from "@/components/ui/label";
import { Breadcrumb } from "@/components/ui/breadcrumb";

// Cast to work around React 19 JSX type incompatibility with Radix UI / Shadcn / Next.js
const Button = ShadcnButton as any;
const Input = ShadcnInput as any;
const Textarea = ShadcnTextarea as any;
const Label = ShadcnLabel as any;
const Link = NextLink as any;
const Image = NextImage as any;

const faqs = [
  {
    question: "What are your shipping options?",
    answer:
      "We offer free freight shipping on all turf orders. Most orders ship within 1-2 business days and arrive within 5-10 business days depending on your location.",
  },
  {
    question: "Do you offer samples?",
    answer:
      "Yes! We offer up to 3 free turf samples shipped directly to your door. No credit card required, no obligation to buy.",
  },
  {
    question: "What's your return policy?",
    answer:
      "We offer a 30-day satisfaction guarantee. If you're not happy with your purchase, contact us and we'll make it right.",
  },
  {
    question: "Do you offer installation services?",
    answer:
      "We focus on providing the highest quality turf at the best prices. For installation, we recommend working with a local landscaper or using our DIY installation guides.",
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen">
      <Breadcrumb items={[{ label: "Contact Us" }]} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 sm:py-16 md:py-24">
        <Image
          src="/shop.all.turf.hero.webp"
          alt="Contact us"
          fill
          className="object-cover object-[center_25%]"
          priority
        />
        <div className="absolute inset-0 bg-slate-900/70" />

        <div className="container px-4 sm:px-6 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-xs sm:text-sm text-white/80 mb-4 sm:mb-6">
              <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
              <span>We typically respond within 24 hours</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
              Get in{" "}
              <span className="text-[#34CE95]">Touch</span>
            </h1>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              Have questions about our products or need help with your project?
              We're here to help.
            </p>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-6 sm:mt-8">
              <div className="flex items-center gap-2 text-white/60">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                </div>
                <span className="text-xs sm:text-sm">Fast Shipping</span>
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

      {/* Contact Form + Business Info */}
      <section className="py-10 sm:py-14 md:py-20">
        <div className="container px-4 sm:px-6">
          <div>
            <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
              {/* Contact Form Card */}
              <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-white border border-border/50 shadow-xl">
                {/* Dark Header */}
                <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 sm:px-6 py-4 sm:py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-lg">
                      <Send className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-white">Send a Message</h2>
                      <p className="text-xs sm:text-sm text-white/60">We'll get back to you within 24 hours</p>
                    </div>
                  </div>
                </div>

                {/* Form Content */}
                <div className="p-4 sm:p-6">
                  {isSubmitted ? (
                    <div className="text-center py-12">
                      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary to-emerald-600 shadow-xl shadow-primary/30">
                        <PartyPopper className="h-10 w-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
                        Message Sent!
                      </h3>
                      <p className="mt-3 text-muted-foreground max-w-sm mx-auto">
                        Thanks for reaching out! We'll get back to you at{" "}
                        <span className="font-medium text-foreground">{formData.email}</span> shortly.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid gap-5 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            placeholder="Your name"
                            required
                            value={formData.name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                            className="h-12 rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            required
                            value={formData.email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
                            className="h-12 rounded-xl"
                          />
                        </div>
                      </div>
                      <div className="grid gap-5 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone (optional)</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="(555) 123-4567"
                            value={formData.phone}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, phone: e.target.value })}
                            className="h-12 rounded-xl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="subject">Subject</Label>
                          <Input
                            id="subject"
                            placeholder="How can we help?"
                            required
                            value={formData.subject}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, subject: e.target.value })}
                            className="h-12 rounded-xl"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          placeholder="Tell us about your project..."
                          required
                          rows={5}
                          value={formData.message}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, message: e.target.value })}
                          className="rounded-xl resize-none"
                        />
                      </div>
                      <Button
                        type="submit"
                        size="lg"
                        variant="premium"
                        className="w-full h-12"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </div>
              </div>

              {/* Business Info Card */}
              <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-white border border-border/50 shadow-xl">
                {/* Dark Header */}
                <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4 sm:px-6 py-4 sm:py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-lg">
                      <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg sm:text-xl font-bold text-white">Business Info</h2>
                      <p className="text-xs sm:text-sm text-white/60">Reach us directly</p>
                    </div>
                  </div>
                </div>

                {/* Info Content */}
                <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  {/* Contact Methods */}
                  <div className="space-y-3 sm:space-y-4">
                    <a
                      href="tel:(909) 491-2203"
                      className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
                    >
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm sm:text-base group-hover:text-primary transition-colors">
                          (909) 491-2203
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground">Call us anytime</p>
                      </div>
                    </a>

                    <a
                      href="mailto:sales@turf.world"
                      className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
                    >
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm sm:text-base group-hover:text-primary transition-colors">
                          sales@turf.world
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground">24hr response time</p>
                      </div>
                    </a>
                  </div>

                  {/* Divider */}
                  <div className="border-t" />

                  {/* Location & Hours */}
                  <div className="grid gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm sm:text-base">Location</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">Los Angeles, CA</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">Ships nationwide</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm sm:text-base">Business Hours</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">Mon - Fri: 8am - 6pm PST</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">Sat: 9am - 2pm PST</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links Banners */}
            <div className="grid gap-3 sm:gap-4 mt-6 sm:mt-8">
              <Link
                href="/samples"
                className="group flex items-center justify-between p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/20 flex items-center justify-center">
                    <Gift className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-base sm:text-lg">Request Free Samples</p>
                    <p className="text-xs sm:text-sm text-white/80">Up to 3 samples, shipped free</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform hidden sm:block" />
              </Link>

              <Link
                href="/calculator"
                className="group flex items-center justify-between p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/10 flex items-center justify-center">
                    <Calculator className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-base sm:text-lg">Project Calculator</p>
                    <p className="text-xs sm:text-sm text-white/70">Get your materials list</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform hidden sm:block" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-muted/30">
        <div className="container px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-primary uppercase tracking-wider mb-3 sm:mb-4">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              FAQ
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
              Common Questions
            </h2>
          </div>

          <div className="grid gap-3 sm:gap-4">
            {faqs.map((faq) => (
              <div
                key={faq.question}
                className="group p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white border border-border/50 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300"
              >
                <h3 className="font-semibold text-base sm:text-lg group-hover:text-primary transition-colors">
                  {faq.question}
                </h3>
                <p className="mt-1.5 sm:mt-2 text-sm sm:text-base text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24 border-t">
        <div className="container text-center">
          <h2 className="max-w-3xl mx-auto">
            Ready to Transform Your Space?
          </h2>
          <p className="mt-6 text-body-lg text-muted-foreground max-w-xl mx-auto">
            Get free samples shipped to your door and see the quality firsthand.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="btn-premium text-lg px-8 h-14" asChild>
              <Link href="/samples">
                Get Free Samples
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 h-14" asChild>
              <Link href="/products">Browse Products</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
