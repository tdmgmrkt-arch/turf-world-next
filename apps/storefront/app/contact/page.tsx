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
  Facebook as LucideFacebook,
  Instagram as LucideInstagram,
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
const Facebook = LucideFacebook as any;
const Instagram = LucideInstagram as any;

function YelpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor">
      <path d="m4.188 10.095.736-.17.073-.02A.813.813 0 0 0 5.45 8.65a1 1 0 0 0-.3-.258 3 3 0 0 0-.428-.198l-.808-.295a76 76 0 0 0-1.364-.493c-.296-.106-.549-.198-.766-.266-.041-.013-.087-.025-.124-.038a2.1 2.1 0 0 0-.606-.116.72.72 0 0 0-.572.245 2 2 0 0 0-.105.132 1.6 1.6 0 0 0-.155.309c-.15.443-.225.908-.22 1.376.002.423.013.966.246 1.334a.8.8 0 0 0 .22.24c.166.114.333.129.507.141.26.019.513-.045.764-.103l2.447-.566zm8.219-3.911a4.2 4.2 0 0 0-.8-1.14 1.6 1.6 0 0 0-.275-.21 2 2 0 0 0-.15-.073.72.72 0 0 0-.621.031c-.142.07-.294.182-.496.37-.028.028-.063.06-.094.089-.167.156-.353.35-.574.575q-.51.516-1.01 1.042l-.598.62a3 3 0 0 0-.298.365 1 1 0 0 0-.157.364.8.8 0 0 0 .007.301q0 .007.003.013a.81.81 0 0 0 .945.616l.074-.014 3.185-.736c.251-.058.506-.112.732-.242.151-.088.295-.175.394-.35a.8.8 0 0 0 .093-.313c.05-.434-.178-.927-.36-1.308M6.706 7.523c.23-.29.23-.722.25-1.075.07-1.181.143-2.362.201-3.543.022-.448.07-.89.044-1.34-.022-.372-.025-.799-.26-1.104C6.528-.077 5.644-.033 5.04.05q-.278.038-.553.104a8 8 0 0 0-.543.149c-.58.19-1.393.537-1.53 1.204-.078.377.106.763.249 1.107.173.417.41.792.625 1.185.57 1.036 1.15 2.066 1.728 3.097.172.308.36.697.695.857q.033.015.068.025c.15.057.313.068.469.032l.028-.007a.8.8 0 0 0 .377-.226zm-.276 3.161a.74.74 0 0 0-.923-.234 1 1 0 0 0-.145.09 2 2 0 0 0-.346.354c-.026.033-.05.077-.08.104l-.512.705q-.435.591-.861 1.193c-.185.26-.346.479-.472.673l-.072.11c-.152.235-.238.406-.282.559a.7.7 0 0 0-.03.314c.013.11.05.217.108.312q.046.07.1.138a1.6 1.6 0 0 0 .257.237 4.5 4.5 0 0 0 2.196.76 1.6 1.6 0 0 0 .349-.027 2 2 0 0 0 .163-.048.8.8 0 0 0 .278-.178.7.7 0 0 0 .17-.266c.059-.147.098-.335.123-.613l.012-.13c.02-.231.03-.502.045-.821q.037-.735.06-1.469l.033-.87a2.1 2.1 0 0 0-.055-.623 1 1 0 0 0-.117-.27zm5.783 1.362a2.2 2.2 0 0 0-.498-.378l-.112-.067c-.199-.12-.438-.246-.719-.398q-.644-.353-1.295-.695l-.767-.407c-.04-.012-.08-.04-.118-.059a2 2 0 0 0-.466-.166 1 1 0 0 0-.17-.018.74.74 0 0 0-.725.616 1 1 0 0 0 .01.293c.038.204.13.406.224.583l.41.768q.341.65.696 1.294c.152.28.28.52.398.719q.036.057.068.112c.145.239.261.39.379.497a.73.73 0 0 0 .596.201 2 2 0 0 0 .168-.029 1.6 1.6 0 0 0 .325-.129 4 4 0 0 0 .855-.64c.306-.3.577-.63.788-1.006q.045-.08.076-.165a2 2 0 0 0 .051-.161q.019-.083.029-.168a.8.8 0 0 0-.038-.327.7.7 0 0 0-.165-.27" />
    </svg>
  );
}

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

                  {/* Divider */}
                  <div className="border-t" />

                  {/* Social Media */}
                  <div>
                    <p className="font-semibold text-sm sm:text-base mb-3">Follow Us</p>
                    <div className="flex items-center gap-3">
                      <a
                        href="https://www.facebook.com/profile.php?id=61552575488475"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-muted/50 hover:bg-primary hover:text-white flex items-center justify-center text-muted-foreground transition-all"
                        aria-label="Facebook"
                      >
                        <Facebook className="w-5 h-5" />
                      </a>
                      <a
                        href="https://www.instagram.com/_turfworld/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-muted/50 hover:bg-primary hover:text-white flex items-center justify-center text-muted-foreground transition-all"
                        aria-label="Instagram"
                      >
                        <Instagram className="w-5 h-5" />
                      </a>
                      <a
                        href="https://www.yelp.com/biz/turf-world-pomona?uid=XeIZ7fn8hGprnkV3-3HW4Q&utm_campaign=www_business_share_popup&utm_medium=copy_link&utm_source=(direct)"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-muted/50 hover:bg-primary hover:text-white flex items-center justify-center text-muted-foreground transition-all"
                        aria-label="Yelp"
                      >
                        <YelpIcon className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

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
