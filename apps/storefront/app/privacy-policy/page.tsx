import { Metadata } from "next";
import {
  Shield as LucideShield,
  Database as LucideDatabase,
  Send as LucideSend,
  Users as LucideUsers,
  Lock as LucideLock,
  UserCheck as LucideUserCheck,
  Scale as LucideScale,
  RefreshCw as LucideRefreshCw,
  Phone as LucidePhone,
} from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";

// Cast Lucide icons to work around React 19 JSX type incompatibility
const Shield = LucideShield as any;
const Database = LucideDatabase as any;
const Send = LucideSend as any;
const Users = LucideUsers as any;
const Lock = LucideLock as any;
const UserCheck = LucideUserCheck as any;
const Scale = LucideScale as any;
const RefreshCw = LucideRefreshCw as any;
const Phone = LucidePhone as any;

export const metadata: Metadata = {
  title: "Privacy Policy | Turf World",
  description: "Turf World privacy policy - how we collect, use, and protect your personal information.",
};

const sections = [
  {
    icon: Shield,
    number: "01",
    title: "Introduction",
    content: "Welcome to Turf-World.com. This Privacy Policy explains our practices concerning the personal information we collect from you or that you provide to us through our 10DLC services. Our use of this information is intended to enhance your experience with our services.",
  },
  {
    icon: Database,
    number: "02",
    title: "Information Collection",
    content: "We collect personal information when you subscribe to our SMS notifications. This includes your mobile phone number and the content of your messages when you communicate with us.",
  },
  {
    icon: Send,
    number: "03",
    title: "Use of Information",
    content: "The information we collect is primarily used to send you updates and promotional offers related to our products and services. We may also use this information for network improvement and customer support purposes.",
  },
  {
    icon: Users,
    number: "04",
    title: "Sharing of Information",
    content: "We do not share your personal data with third parties, except in compliance with legal obligations or in case of a business transfer. Any third-party service providers used will be bound by confidentiality agreements to respect the security of your data.",
  },
  {
    icon: Lock,
    number: "05",
    title: "Data Security",
    content: "We implement a variety of security measures to maintain the safety of your personal information. These include encryption protocols and software safeguards.",
  },
  {
    icon: UserCheck,
    number: "06",
    title: "User Rights",
    content: "You have the right to access, correct, or delete your personal information. To exercise these rights, please get in touch with us directly using the information provided below.",
  },
  {
    icon: Scale,
    number: "07",
    title: "Compliance",
    content: "We comply with all applicable laws and regulations regarding data protection and privacy. This includes fulfilling our obligations under local data protection laws.",
  },
  {
    icon: RefreshCw,
    number: "08",
    title: "Changes to the Policy",
    content: "This Privacy Policy may be updated periodically to reflect changes in our personal information practices or relevant laws. We will post a prominent notice on our site to notify you of any significant changes.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-muted/50 to-background">
      <Breadcrumb items={[{ label: "Privacy Policy" }]} />

      {/* Hero Section */}
      <section className="py-12 md:py-16 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl" />

        <div className="container relative">
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-emerald-600 mb-6 shadow-lg shadow-primary/30">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-white/60">
              Your privacy matters to us. Learn how we protect your information.
            </p>
          </div>
        </div>
      </section>

      {/* Policy Sections */}
      <section className="py-12 md:py-16">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-4 md:gap-6">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <div
                    key={section.number}
                    className="group relative overflow-hidden rounded-2xl bg-white border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    {/* Hover gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative p-6 md:p-8">
                      <div className="flex items-start gap-4 md:gap-6">
                        {/* Number & Icon */}
                        <div className="flex-shrink-0">
                          <div className="relative">
                            <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-primary to-emerald-600 flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
                              <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                            </div>
                            <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                              {section.number}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h2 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                            {section.title}
                          </h2>
                          <p className="text-muted-foreground leading-relaxed">
                            {section.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Contact Section - Special styling */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-6 md:p-8 shadow-2xl">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl" />

                <div className="relative">
                  <div className="flex items-start gap-4 md:gap-6">
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                          <Phone className="w-6 h-6 md:w-7 md:h-7 text-white" />
                        </div>
                        <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                          09
                        </span>
                      </div>
                    </div>

                    <div className="flex-1">
                      <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
                        Contact Information
                      </h2>
                      <p className="text-white/70 leading-relaxed mb-4">
                        If you have any questions or concerns about our privacy practices, we&apos;re here to help.
                      </p>
                      <div className="flex flex-wrap gap-4">
                        <a
                          href="tel:909-491-2203"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium transition-colors"
                        >
                          <Phone className="w-4 h-4" />
                          909-491-2203
                        </a>
                        <a
                          href="mailto:orders@turf-world.com"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white font-medium transition-colors"
                        >
                          orders@turf-world.com
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
