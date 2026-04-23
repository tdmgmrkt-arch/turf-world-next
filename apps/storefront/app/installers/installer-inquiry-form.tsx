"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight as LucideArrowRight,
  CheckCircle as LucideCheckCircle,
  Hammer as LucideHammer,
  ShieldCheck as LucideShieldCheck,
  Users as LucideUsers,
  Loader2 as LucideLoader2,
  Mail as LucideMail,
  Phone as LucidePhone,
  MapPin as LucideMapPin,
} from "lucide-react";
import { Button as ShadcnButton } from "@/components/ui/button";
import { Input as ShadcnInput } from "@/components/ui/input";
import { Label as ShadcnLabel } from "@/components/ui/label";

const Button = ShadcnButton as any;
const Input = ShadcnInput as any;
const Label = ShadcnLabel as any;
const ArrowRight = LucideArrowRight as any;
const CheckCircle = LucideCheckCircle as any;
const Hammer = LucideHammer as any;
const ShieldCheck = LucideShieldCheck as any;
const Users = LucideUsers as any;
const Loader2 = LucideLoader2 as any;
const Mail = LucideMail as any;
const Phone = LucidePhone as any;
const MapPin = LucideMapPin as any;

const WEBHOOK_URL =
  "https://services.leadconnectorhq.com/hooks/lBYgCVRxgw7QkJkVotLZ/webhook-trigger/612afb3f-c344-450d-8038-baaa72cf565f";

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  notes: string;
};

const initialForm: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zip: "",
  notes: "",
};

export function InstallerInquiryForm() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const updateField = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = field === "state" ? e.target.value.toUpperCase() : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    try {
      const res = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "installer.inquiry",
          firstName: form.firstName,
          lastName: form.lastName,
          fullName: `${form.firstName} ${form.lastName}`.trim(),
          email: form.email,
          phone: form.phone,
          address: form.address,
          city: form.city,
          state: form.state,
          zip: form.zip,
          addressOneLine: [
            form.address,
            [form.city, form.state, form.zip].filter(Boolean).join(" "),
          ]
            .filter(Boolean)
            .join(", "),
          notes: form.notes,
          submittedAt: new Date().toISOString(),
        }),
      });

      if (!res.ok) {
        throw new Error(`Submission failed (${res.status})`);
      }

      setStatus("success");
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err?.message ?? "Something went wrong. Please try again or call us.");
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 sm:py-16 md:py-24">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#34CE95]/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#34CE95]/5 rounded-full blur-[100px]" />

        <div className="container px-4 sm:px-6 relative z-10">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 text-xs sm:text-sm text-white/80 mb-4 sm:mb-6">
              <Hammer className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#34CE95]" />
              <span>Professional Installation</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
              We install turf.{" "}
              <span className="text-[#34CE95]">Let us connect you with a pro.</span>
            </h1>

            <p className="mt-4 sm:mt-5 text-base sm:text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              Fill out the form below and our team will reach out to connect you with one of our partnered installers in your area.
            </p>

            <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-5 sm:mt-6">
              <div className="flex items-center gap-2 text-white/60">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#34CE95]/20 flex items-center justify-center">
                  <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#34CE95]" />
                </div>
                <span className="text-xs sm:text-sm">Vetted &amp; insured</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#34CE95]/20 flex items-center justify-center">
                  <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#34CE95]" />
                </div>
                <span className="text-xs sm:text-sm">Partnered installers</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#34CE95]/20 flex items-center justify-center">
                  <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#34CE95]" />
                </div>
                <span className="text-xs sm:text-sm">Free consultation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Split row: form on left, image on right */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container px-4 sm:px-6">
          <div className="grid gap-8 lg:gap-12 lg:grid-cols-[1.1fr_1fr] items-stretch max-w-6xl mx-auto">

            {/* Left: form */}
            <div id="installer-form" className="scroll-mt-24">
              {status === "success" ? (
                <SuccessCard firstName={form.firstName} />
              ) : (
                <div className="rounded-3xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 p-6 sm:p-8 md:p-10 shadow-lg">
                  <div className="mb-6">
                    <p className="text-xs font-semibold text-[#34CE95] uppercase tracking-wider mb-2">
                      Get Started
                    </p>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                      Request installation help
                    </h3>
                    <p className="text-sm text-slate-600 mt-2">
                      We'll reach out within one business day to connect you with a partnered installer.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                        <Input
                          id="firstName"
                          value={form.firstName}
                          onChange={updateField("firstName")}
                          required
                          autoComplete="given-name"
                          className="h-11 rounded-xl bg-white border-slate-200"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                        <Input
                          id="lastName"
                          value={form.lastName}
                          onChange={updateField("lastName")}
                          required
                          autoComplete="family-name"
                          className="h-11 rounded-xl bg-white border-slate-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-sm font-medium flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" /> Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={updateField("email")}
                        required
                        autoComplete="email"
                        placeholder="you@example.com"
                        className="h-11 rounded-xl bg-white border-slate-200"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-slate-400" /> Phone
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={form.phone}
                        onChange={updateField("phone")}
                        required
                        autoComplete="tel"
                        placeholder="(555) 123-4567"
                        className="h-11 rounded-xl bg-white border-slate-200"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="address" className="text-sm font-medium flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" /> Project Address
                      </Label>
                      <Input
                        id="address"
                        value={form.address}
                        onChange={updateField("address")}
                        required
                        autoComplete="street-address"
                        placeholder="1234 Main St"
                        className="h-11 rounded-xl bg-white border-slate-200"
                      />
                    </div>

                    <div className="grid gap-4 grid-cols-[1fr_5rem_7rem] sm:grid-cols-[1fr_6rem_8rem]">
                      <div className="space-y-1.5">
                        <Label htmlFor="city" className="text-sm font-medium">City</Label>
                        <Input
                          id="city"
                          value={form.city}
                          onChange={updateField("city")}
                          required
                          autoComplete="address-level2"
                          className="h-11 rounded-xl bg-white border-slate-200"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="state" className="text-sm font-medium">State</Label>
                        <Input
                          id="state"
                          value={form.state}
                          onChange={updateField("state")}
                          maxLength={2}
                          required
                          autoComplete="address-level1"
                          className="h-11 rounded-xl bg-white border-slate-200 uppercase"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="zip" className="text-sm font-medium">ZIP</Label>
                        <Input
                          id="zip"
                          value={form.zip}
                          onChange={updateField("zip")}
                          required
                          autoComplete="postal-code"
                          className="h-11 rounded-xl bg-white border-slate-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="notes" className="text-sm font-medium">Project notes (optional)</Label>
                      <textarea
                        id="notes"
                        value={form.notes}
                        onChange={updateField("notes")}
                        rows={3}
                        placeholder="Rough sq ft, timeline, any specifics..."
                        className="w-full rounded-xl bg-white border border-slate-200 p-3 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-[#34CE95] focus:border-transparent"
                      />
                    </div>

                    {status === "error" && (
                      <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                        {errorMsg} Or call us at{" "}
                        <a href="tel:9094912203" className="font-semibold underline">
                          (909) 491-2203
                        </a>
                        .
                      </div>
                    )}

                    <Button
                      type="submit"
                      size="lg"
                      disabled={status === "submitting"}
                      className="w-full h-12 bg-[#34CE95] hover:bg-emerald-500 text-white text-base font-semibold rounded-xl"
                    >
                      {status === "submitting" ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Request Installation
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-slate-500 text-center">
                      By submitting, you agree to be contacted by Turf World about installation services.
                    </p>
                  </form>
                </div>
              )}
            </div>

            {/* Right: full-bleed image */}
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 min-h-[400px] lg:min-h-0">
              <Image
                src="/installers.png"
                alt="Turf World installer consulting with a homeowner in their yard"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 45vw, 100vw"
                priority
              />
            </div>

          </div>
        </div>
      </section>

      {/* How It Works — horizontal 3-column */}
      <section className="py-12 md:py-20 bg-slate-50 border-t border-slate-200">
        <div className="container px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10 md:mb-14">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#34CE95] uppercase tracking-wider mb-3">
                How It Works
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                Three steps to a professional install
              </h2>
            </div>

            <div className="grid gap-6 md:gap-8 md:grid-cols-3">
              <div className="relative p-6 md:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div className="absolute -top-4 left-6 w-10 h-10 rounded-full bg-gradient-to-br from-[#34CE95] to-emerald-600 flex items-center justify-center text-white font-bold shadow-lg">
                  1
                </div>
                <h3 className="font-bold text-slate-900 mb-2 mt-2">Submit your info</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Fill out the form with your contact details and project location. Takes about a minute.
                </p>
              </div>

              <div className="relative p-6 md:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div className="absolute -top-4 left-6 w-10 h-10 rounded-full bg-gradient-to-br from-[#34CE95] to-emerald-600 flex items-center justify-center text-white font-bold shadow-lg">
                  2
                </div>
                <h3 className="font-bold text-slate-900 mb-2 mt-2">We'll reach out</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Our team contacts you within one business day to understand your project and match you with a partnered installer in your area.
                </p>
              </div>

              <div className="relative p-6 md:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div className="absolute -top-4 left-6 w-10 h-10 rounded-full bg-gradient-to-br from-[#34CE95] to-emerald-600 flex items-center justify-center text-white font-bold shadow-lg">
                  3
                </div>
                <h3 className="font-bold text-slate-900 mb-2 mt-2">Get your quote</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Our installer provides a free, no-obligation consultation and estimate for your project.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support footer — horizontal callouts */}
      <section className="py-10 md:py-14 bg-white">
        <div className="container px-4 sm:px-6">
          <div className="grid gap-5 md:gap-6 md:grid-cols-2 items-stretch max-w-6xl mx-auto">

            {/* Call */}
            <a
              href="tel:9094912203"
              className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 md:p-7 text-white shadow-xl hover:shadow-2xl transition-shadow"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#34CE95]/10 rounded-full blur-[80px]" />

              <div className="relative flex items-center gap-5">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-[#34CE95] to-emerald-600 flex items-center justify-center shadow-lg">
                  <Phone className="w-6 h-6 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#34CE95] uppercase tracking-wider mb-1">
                    Prefer to call?
                  </p>
                  <h3 className="text-xl md:text-2xl font-bold tracking-tight">
                    (909) 491-2203
                  </h3>
                  <p className="text-xs text-white/60 leading-relaxed mt-1">
                    Mon–Fri, 8am–5pm PT
                  </p>
                </div>

                <ArrowRight className="flex-shrink-0 w-5 h-5 text-[#34CE95] group-hover:translate-x-1 transition-transform" />
              </div>
            </a>

            {/* Financing */}
            <Link
              href="/financing"
              className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#34CE95] to-emerald-600 p-6 md:p-7 text-white shadow-xl hover:shadow-2xl transition-shadow"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-[80px]" />

              <div className="relative flex items-center gap-5">
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-white/80 uppercase tracking-wider mb-1">
                    Need financing?
                  </p>
                  <h3 className="text-xl md:text-2xl font-bold tracking-tight">
                    Up to $75,000
                  </h3>
                  <p className="text-xs text-white/80 leading-relaxed mt-1">
                    Pre-qualify with no impact to your credit
                  </p>
                </div>

                <ArrowRight className="flex-shrink-0 w-5 h-5 text-white group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

          </div>
        </div>
      </section>
    </>
  );
}

function SuccessCard({ firstName }: { firstName: string }) {
  return (
    <div className="rounded-3xl bg-white border border-slate-200 p-8 md:p-10 shadow-lg text-center">
      <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-[#34CE95] to-emerald-600 flex items-center justify-center mb-6 shadow-lg">
        <CheckCircle className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-3">
        Thanks{firstName ? `, ${firstName}` : ""}!
      </h3>
      <p className="text-slate-600 leading-relaxed mb-6">
        We got your request. A member of our team will reach out within one business day to connect you with a partnered installer in your area.
      </p>
      <div className="space-y-3 mb-6">
        <Link
          href="/products"
          className="block p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition-colors text-left"
        >
          <p className="text-sm text-slate-700 leading-relaxed">
            <strong className="text-slate-900">Want a head start?</strong>{" "}
            <span className="text-[#34CE95] hover:text-emerald-600 underline underline-offset-2">
              Browse our turf products while you wait
            </span>
            .
          </p>
        </Link>

        <Link
          href="/financing"
          className="block p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition-colors text-left"
        >
          <p className="text-sm text-slate-700 leading-relaxed">
            <strong className="text-slate-900">Thinking about financing?</strong>{" "}
            <span className="text-[#34CE95] hover:text-emerald-600 underline underline-offset-2">
              Pre-qualify for up to $75,000 with no credit impact
            </span>
            .
          </p>
        </Link>
      </div>
      <Button size="lg" className="w-full h-12 bg-[#34CE95] hover:bg-emerald-500 text-white font-semibold rounded-xl" asChild>
        <Link href="/products">
          Browse Turf Products
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
