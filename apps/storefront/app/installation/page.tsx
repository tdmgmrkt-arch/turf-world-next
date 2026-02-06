import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle,
  Ruler,
  Shovel,
  Layers,
  Scissors,
  Hammer,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export const metadata: Metadata = {
  title: "Installation Guide | Turf World",
  description:
    "Step-by-step artificial grass installation guide. Learn how to install synthetic turf like a pro with our 7-step process.",
  keywords: [
    "artificial grass installation",
    "turf installation guide",
    "how to install artificial turf",
    "synthetic grass installation steps",
    "DIY turf installation",
  ],
};

const installationSteps = [
  {
    step: 1,
    title: "Remove Grass",
    image: "/installation.step1.webp",
    description:
      "It's time to remove that lawn that has caused you so much frustration over the years: the water bills, brown spots, mowing, mud, say goodbye to it all. We recommend removing 4-5 inches of your existing lawn or base. Keep in mind that proper drainage and leveling during turf base installation is essential to ensure a quality finished installation.",
  },
  {
    step: 2,
    title: "Add Base",
    image: "/installation.step2.webp",
    description:
      "Evenly spread 3 inches of class II road base or similar. The class II road base will make it easier to create a level platform with proper drainage. We do not recommend using a weed barrier to prevent vegetation from growing; this isn't recommended with artificial grass because you want water to flow through freely and not get trapped. Use a compactor until you achieve a smooth surface.",
  },
  {
    step: 3,
    title: "Lay Turf",
    image: "/installation.step3.webp",
    description:
      "Roll out your new artificial grass. Be very careful not to drag your turf across freshly prepared base. It is best to let the turf sit in the sun for 30 minutes to an hour to let it expand prior to install. If you are working with multiple rolls, it is very important that the blade direction and stitch patterns are facing the same way. Crossing blade directions will result in poor appearance. Carefully nudge and move your artificial grass into the proper position. We recommend to protect your knees and shins while manipulating the turf. A carpet kicker will come in handy to stretch and maneuver the turf.",
  },
  {
    step: 4,
    title: "Cut to Fit",
    image: "/installation.step4.webp",
    description:
      'It is time to make the appropriate cuts. The best cutting devices are razor knives and carpet cutters. All cuts should be made from the back of the synthetic grass so you can see the stitch rows. When making the cut leave \u00BC" to \u00BD" of turf over the edge of your border; this will help with the finishing touches at the end of your project. If you are working with multiple pieces of synthetic grass be sure that the blades of your turf are facing the same direction when seaming and that the space between each stitch row matches. Place the edge of your seam tape down the center of the seam and make an "S" pattern with your glue on each side of the tape. Move turf into place and let the glue set for 15 minutes. Place your nails or staples every 6 inches around the perimeter.',
  },
  {
    step: 5,
    title: "Secure Perimeter",
    image: "/installation.step5.webp",
    description:
      'Time to secure your artificial grass to the ground. Start by tucking the \u00BC" to \u00BD" edge you left into the border with a metal spike. Using a hammer, drive your galvanized nails or D-spikes non-obtrusively at 6-8 inch intervals along the perimeter. Pay special attention to seams. Place nails on either side of seams every 2 feet or less. Before you infill, make sure to brush the turf with a power broom or push broom. This will get the blade memory vertical.',
  },
  {
    step: 6,
    title: "Spread Infill",
    image: "/installation.step6.webp",
    description:
      "Meeting the proper infill requirements for the turf system you have purchased is extremely important to the appearance, performance, and lifespan of your artificial grass. Please ask your sales rep for infill requirements. There are many different types of sand or infill, but we recommend silica / acrylic coated sand, zeolite, silica sand, or crumb rubber. Use drop spreader or power broom to evenly distribute the proper amount of infill.",
  },
  {
    step: 7,
    title: "Brush Infill",
    image: "/installation.step7.webp",
    description:
      "Once the infill has been placed, using a power broom or another stiff bristled broom brush the turf. This will assist the turf blades in standing straight up to make your new artificial lawn look like freshly mowed grass. Repeat the process until your infill is brushed in evenly and your seams disappear. Brushing up your turf blades will be the only quarterly maintenance we recommend outside of proper sanitation if you have pets. Once the infill has been placed, brush against the grass blades to get the blades standing. Lastly, rinse the grass of all remaining dust and infill.",
  },
];

export default function InstallationPage() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Breadcrumb items={[{ label: "Installation Guide" }]} />

      {/* Installation Process */}
      <section className="py-10 sm:py-12 md:py-16 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950">
        <div className="container px-4 sm:px-6">
          <div className="text-center mb-6 sm:mb-8">
            <span className="text-xs sm:text-sm font-semibold text-emerald-400 uppercase tracking-wider">
              DIY Installation Guide
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight mt-2">
              Install Your Turf Like a Pro
            </h1>
            <p className="text-white/50 mt-3 max-w-2xl mx-auto">
              7 steps to transform your yard with premium artificial grass.
              No experience required.
            </p>
          </div>

          {/* Cross Section Diagram */}
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-emerald-400 tracking-tight mb-4">Understanding the Layers</h2>
          <div className="mb-8 sm:mb-10">
            <div className="relative rounded-xl overflow-hidden ring-1 ring-white/10">
              {/* Image */}
              <div className="relative aspect-[16/10] sm:aspect-[16/9] md:aspect-[2/1]">
                <Image
                  src="/turflayers.nolabels.webp"
                  alt="Artificial grass cross section showing installation layers"
                  fill
                  className="object-contain object-right"
                  sizes="(max-width: 768px) 100vw, 900px"
                />

                {/* Layer Labels */}
                {[
                  { label: "Turf Fiber", top: "17%", optional: false },
                  { label: "Infill", top: "32%", optional: false },
                  { label: "Weed Barrier", top: "47%", optional: true },
                  { label: "Leveling Sand", top: "53%", optional: false },
                  { label: "Aggregate Base", top: "65%", optional: false },
                  { label: "Wire Mesh", top: "82%", optional: true },
                  { label: "Compacted Soil", top: "88%", optional: false },
                ].map((layer) => (
                  <div
                    key={layer.label}
                    className="absolute left-0 w-[44%] sm:w-[44%] flex items-center"
                    style={{ top: layer.top, transform: "translateY(-50%)" }}
                  >
                    {/* Label text */}
                    <span
                      className={`text-[9px] sm:text-[11px] md:text-xs font-semibold sm:tracking-wider uppercase whitespace-nowrap pl-2 sm:pl-4 pr-1 sm:pr-3 ${
                        layer.optional
                          ? "text-amber-400"
                          : "text-white"
                      }`}
                    >
                      {layer.label}
                      {layer.optional && (
                        <span className="text-[7px] sm:text-[9px] ml-0.5 font-normal opacity-60">*</span>
                      )}
                    </span>
                    {/* Connector line */}
                    <div
                      className={`flex-1 h-px ${
                        layer.optional ? "bg-amber-400/40" : "bg-white/25"
                      }`}
                    />
                    {/* Dot at end of line */}
                    <div
                      className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full flex-shrink-0 ${
                        layer.optional ? "bg-amber-400" : "bg-emerald-400"
                      }`}
                    />
                  </div>
                ))}

                {/* Optional legend */}
                <div className="absolute bottom-2 left-3 sm:bottom-3 sm:left-4 flex items-center gap-1.5">
                  <span className="text-[8px] sm:text-[10px] text-white/40 italic">* Optional</span>
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8 sm:mb-10" />

          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-emerald-400 tracking-tight mb-5">The Process</h2>
          <div className="space-y-8 sm:space-y-10">
            {installationSteps.map((step, index) => (
              <div
                key={step.step}
                className={`flex flex-col ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } gap-5 md:gap-8 items-center`}
              >
                {/* Image */}
                <div className="w-full md:w-1/2">
                  <div className="relative">
                    <div className="relative aspect-[2/1] rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-lg">
                      <Image
                        src={step.image}
                        alt={`Step ${step.step}: ${step.title}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                    <div className="absolute -top-2.5 left-0 sm:-left-2.5 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-br from-emerald-400 to-primary shadow-[0_2px_12px_rgba(16,185,129,0.4)] flex items-center justify-center ring-1 ring-white/20">
                      <span className="font-extrabold text-white text-base sm:text-lg">
                        {step.step}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="w-full md:w-1/2">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                      Step {String(step.step).padStart(2, "0")}
                    </span>
                    <div className="flex-1 h-px bg-white/10" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-white/50 leading-relaxed text-sm sm:text-base">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pro Tips Section */}
      <section className="py-10 sm:py-12 md:py-14 bg-slate-950">
        <div className="container px-4 sm:px-6">
          <div className="text-center mb-6 sm:mb-8">
            <span className="text-xs sm:text-sm font-semibold text-emerald-400 uppercase tracking-wider">
              Expert Advice
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight mt-2">
              Pro Tips for a Perfect Install
            </h2>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6 sm:mb-8" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: "Let Turf Acclimate",
                desc: "Unroll your turf and let it sit in the sun for 30-60 minutes before cutting. This allows the material to expand and relax for easier installation.",
              },
              {
                title: "Match Blade Direction",
                desc: "When seaming multiple pieces, always ensure blade direction and stitch patterns face the same way. Mismatched directions will result in a visible seam.",
              },
              {
                title: "Cut from the Back",
                desc: "Always flip the turf over and cut from the backing side. This gives you a clear view of stitch rows and ensures clean, precise cuts.",
              },
              {
                title: "Compact Your Base",
                desc: "A well-compacted base is critical. Use a plate compactor and make multiple passes. The surface should be firm enough to walk on without leaving footprints.",
              },
              {
                title: "Nail Spacing Matters",
                desc: "Place nails every 6-8 inches around the perimeter and every 2 feet or less along seams. Under-nailing is one of the most common installation mistakes.",
              },
              {
                title: "Brush Against the Grain",
                desc: "After infill, always brush against the blade direction. This lifts the fibers upright for a natural, freshly-mowed appearance.",
              },
            ].map((tip) => (
              <div
                key={tip.title}
                className="p-5 rounded-xl bg-white/5 border border-white/10"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-white mb-1">
                      {tip.title}
                    </h3>
                    <p className="text-sm text-white/60 leading-relaxed">
                      {tip.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 md:py-14 bg-gradient-to-br from-primary to-emerald-700">
        <div className="container px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
            Ready to Get Started?
          </h2>
          <p className="text-white/80 mb-6 max-w-lg mx-auto">
            Shop our premium artificial turf collection and get everything you
            need for a professional installation.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/products">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90"
              >
                Shop Turf
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/calculator">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                Calculate Materials
              </Button>
            </Link>
            <Link href="/samples">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
              >
                Free Samples
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
