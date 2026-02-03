"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

// Cast to work around React 19 JSX type incompatibility with Radix UI
const SliderRoot = SliderPrimitive.Root as any;
const SliderTrack = SliderPrimitive.Track as any;
const SliderRange = SliderPrimitive.Range as any;
const SliderThumb = SliderPrimitive.Thumb as any;

const Slider = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<"span"> & {
    value?: number[];
    defaultValue?: number[];
    min?: number;
    max?: number;
    step?: number;
    onValueChange?: (value: number[]) => void;
  }
>(({ className, ...props }, ref) => (
  <SliderRoot
    ref={ref}
    className={cn(
      "relative flex w-full touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderTrack className="relative h-3 w-full grow overflow-hidden rounded-full bg-gradient-to-r from-muted to-muted/80 shadow-inner">
      <SliderRange className="absolute h-full bg-gradient-to-r from-primary to-emerald-500 transition-all duration-150" />
    </SliderTrack>
    <SliderThumb className="block h-6 w-6 rounded-full border-3 border-white bg-gradient-to-br from-primary to-emerald-600 shadow-lg shadow-primary/25 ring-offset-background transition-all duration-200 hover:scale-110 hover:shadow-xl hover:shadow-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-95 disabled:pointer-events-none disabled:opacity-50" />
  </SliderRoot>
));
Slider.displayName = "Slider";

export { Slider };
