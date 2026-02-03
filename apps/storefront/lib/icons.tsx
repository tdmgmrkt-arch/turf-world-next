/**
 * Type-safe icon re-exports for React 19 compatibility
 *
 * Lucide icons have type conflicts with React 19 JSX types.
 * This file re-exports them with proper typing to avoid build errors.
 */
import {
  Calculator as LucideCalculator,
  Package as LucidePackage,
  Scissors as LucideScissors,
  Layers as LucideLayers,
  ArrowRight as LucideArrowRight,
  Info as LucideInfo,
  AlertTriangle as LucideAlertTriangle,
  CheckCircle as LucideCheckCircle,
  Sparkles as LucideSparkles,
  Ruler as LucideRuler,
  Shield as LucideShield,
  Star as LucideStar,
  ChevronDown as LucideChevronDown,
} from "lucide-react";
import type { LucideProps } from "lucide-react";
import React from "react";

// Type assertion to fix React 19 JSX compatibility
type IconComponent = React.FC<LucideProps>;

export const Calculator = LucideCalculator as IconComponent;
export const Package = LucidePackage as IconComponent;
export const Scissors = LucideScissors as IconComponent;
export const Layers = LucideLayers as IconComponent;
export const ArrowRight = LucideArrowRight as IconComponent;
export const Info = LucideInfo as IconComponent;
export const AlertTriangle = LucideAlertTriangle as IconComponent;
export const CheckCircle = LucideCheckCircle as IconComponent;
export const Sparkles = LucideSparkles as IconComponent;
export const Ruler = LucideRuler as IconComponent;
export const Shield = LucideShield as IconComponent;
export const Star = LucideStar as IconComponent;
export const ChevronDown = LucideChevronDown as IconComponent;
