import {
  Flame,
  Leaf,
  Shield,
  Dog,
  Award,
  Droplets,
  Sun,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { TurfAttributes } from "@/types";

interface TrustBadgeProps {
  icon: React.ReactNode;
  label: string;
  description?: string;
  variant?: "fire" | "eco" | "warranty" | "pet" | "default";
  className?: string;
}

const variantStyles = {
  fire: "border-orange-200 bg-orange-50 text-orange-700",
  eco: "border-green-200 bg-green-50 text-green-700",
  warranty: "border-blue-200 bg-blue-50 text-blue-700",
  pet: "border-amber-200 bg-amber-50 text-amber-700",
  default: "border-gray-200 bg-gray-50 text-gray-700",
};

/**
 * Individual Trust Badge
 */
export function TrustBadge({
  icon,
  label,
  description,
  variant = "default",
  className,
}: TrustBadgeProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border px-3 py-2",
        variantStyles[variant],
        className
      )}
    >
      <div className="flex-shrink-0">{icon}</div>
      <div>
        <p className="text-sm font-medium">{label}</p>
        {description && (
          <p className="text-xs opacity-80">{description}</p>
        )}
      </div>
    </div>
  );
}

/**
 * Generate trust badges from TurfAttributes
 */
export function generateTrustBadges(
  attributes: Partial<TurfAttributes>
): TrustBadgeProps[] {
  const badges: TrustBadgeProps[] = [];

  // Fire Rating
  if (attributes.fire_rating === "Class_A") {
    badges.push({
      icon: <Flame className="h-4 w-4" />,
      label: "Class-A Fire Rated",
      description: "Highest fire safety standard",
      variant: "fire",
    });
  }

  // PFAS Free
  if (attributes.pfas_free) {
    badges.push({
      icon: <Leaf className="h-4 w-4" />,
      label: "PFAS Free",
      description: "No forever chemicals",
      variant: "eco",
    });
  }

  // Lead Free
  if (attributes.lead_free) {
    badges.push({
      icon: <Shield className="h-4 w-4" />,
      label: "Lead Free",
      description: "Safe for kids & pets",
      variant: "eco",
    });
  }

  // Pet Friendly
  if (attributes.pet_friendly) {
    badges.push({
      icon: <Dog className="h-4 w-4" />,
      label: "Pet Friendly",
      description: attributes.antimicrobial
        ? "Antimicrobial treated"
        : "Safe for pets",
      variant: "pet",
    });
  }

  // High Drainage (for pet turf)
  if (attributes.drainage_rate && attributes.drainage_rate >= 80) {
    badges.push({
      icon: <Droplets className="h-4 w-4" />,
      label: "High Drainage",
      description: `${attributes.drainage_rate}+ gal/min/sqft`,
      variant: "pet",
    });
  }

  // Warranty
  if (attributes.warranty_years) {
    badges.push({
      icon: <Award className="h-4 w-4" />,
      label: `${attributes.warranty_years}-Year Warranty`,
      description: "Full manufacturer coverage",
      variant: "warranty",
    });
  }

  // UV Stability
  if (attributes.uv_stability_hours && attributes.uv_stability_hours >= 3000) {
    badges.push({
      icon: <Sun className="h-4 w-4" />,
      label: "UV Stabilized",
      description: `${attributes.uv_stability_hours}+ hours tested`,
      variant: "default",
    });
  }

  return badges;
}

/**
 * TrustBadgeGrid - Display all relevant badges for a product
 */
interface TrustBadgeGridProps {
  attributes: Partial<TurfAttributes>;
  className?: string;
  maxBadges?: number;
}

export function TrustBadgeGrid({
  attributes,
  className,
  maxBadges = 6,
}: TrustBadgeGridProps) {
  const badges = generateTrustBadges(attributes).slice(0, maxBadges);

  if (badges.length === 0) return null;

  return (
    <div className={cn("grid grid-cols-2 gap-2 md:grid-cols-3", className)}>
      {badges.map((badge, index) => (
        <TrustBadge key={index} {...badge} />
      ))}
    </div>
  );
}

/**
 * Compact trust badges for product cards
 */
interface TrustBadgeChipsProps {
  attributes: Partial<TurfAttributes>;
  className?: string;
}

export function TrustBadgeChips({ attributes, className }: TrustBadgeChipsProps) {
  const chips: { label: string; variant: keyof typeof variantStyles }[] = [];

  if (attributes.fire_rating === "Class_A") {
    chips.push({ label: "Fire Safe", variant: "fire" });
  }
  if (attributes.pfas_free) {
    chips.push({ label: "PFAS Free", variant: "eco" });
  }
  if (attributes.pet_friendly && attributes.antimicrobial) {
    chips.push({ label: "Pet Pro", variant: "pet" });
  } else if (attributes.pet_friendly) {
    chips.push({ label: "Pet Safe", variant: "pet" });
  }
  if (attributes.warranty_years && attributes.warranty_years >= 15) {
    chips.push({ label: `${attributes.warranty_years}yr`, variant: "warranty" });
  }

  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {chips.map((chip, index) => (
        <span
          key={index}
          className={cn(
            "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
            variantStyles[chip.variant]
          )}
        >
          <CheckCircle className="mr-1 h-3 w-3" />
          {chip.label}
        </span>
      ))}
    </div>
  );
}
