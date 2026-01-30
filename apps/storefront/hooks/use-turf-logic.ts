"use client";

import { useState, useMemo, useCallback } from "react";
import type { ProjectEstimate } from "@/types";

const ROLL_WIDTH_FEET = 15;
const ROLL_LENGTH_FEET = 100; // Max length per roll
const MIN_CUT_LENGTH = 10; // Minimum cut length
const INFILL_LBS_PER_SQFT_STANDARD = 1.0;
const INFILL_LBS_PER_SQFT_PET = 1.5;
const INFILL_BAG_SIZE_LBS = 50;

// Cut type for tracking individual pieces
export type Cut = {
  id: string;
  stripIndex: number; // Which strip across the width (0, 1, 2...)
  length: number; // Length of this cut in feet
  squareFeet: number;
};

interface UseTurfLogicOptions {
  /** Price per square foot in cents */
  pricePerSqFtCents: number;
  /** Is this pet turf? Affects infill calculation */
  isPetTurf?: boolean;
  /** Include infill in estimate? */
  includeInfill?: boolean;
}

interface UseTurfLogicReturn {
  // Input state
  widthFeet: number;
  lengthFeet: number;
  setWidthFeet: (width: number) => void;
  setLengthFeet: (length: number) => void;

  // Computed values
  squareFeet: number;
  estimate: ProjectEstimate;
  totalPriceCents: number;
  cuts: Cut[];
  rollsNeeded: number;
  totalCutSquareFeet: number;

  // Helpers
  reset: () => void;
}

/**
 * useTurfLogic - The "Anti-Frustration" Calculator Hook
 *
 * Solves the main UX problem: "I have a 500 sq ft yard, how many rolls do I need?"
 *
 * Input: Width + Length in feet
 * Output: Everything the customer needs to buy:
 *   - Number of 15ft rolls
 *   - Total linear feet to order
 *   - Seam tape (linear feet)
 *   - Infill bags (50lb)
 *   - Waste percentage (helps customer optimize dimensions)
 *
 * Usage:
 * ```tsx
 * const { widthFeet, setWidthFeet, lengthFeet, setLengthFeet, estimate } = useTurfLogic({
 *   pricePerSqFtCents: 299,
 *   isPetTurf: true,
 * });
 * ```
 */
export function useTurfLogic(options: UseTurfLogicOptions): UseTurfLogicReturn {
  const { pricePerSqFtCents, isPetTurf = false, includeInfill = true } = options;

  const [widthFeet, setWidthFeetState] = useState(20);
  const [lengthFeet, setLengthFeetState] = useState(30);

  // Clamp inputs to reasonable ranges
  const setWidthFeet = useCallback((width: number) => {
    setWidthFeetState(Math.max(1, Math.min(500, width)));
  }, []);

  const setLengthFeet = useCallback((length: number) => {
    setLengthFeetState(Math.max(1, Math.min(500, length)));
  }, []);

  const reset = useCallback(() => {
    setWidthFeetState(20);
    setLengthFeetState(30);
  }, []);

  // All calculations are memoized
  const { squareFeet, estimate, totalPriceCents, cuts, rollsNeeded, totalCutSquareFeet } = useMemo(() => {
    const sqft = widthFeet * lengthFeet;

    // CRITICAL: Turf is sold in 15ft widths
    // Calculate how many 15ft sections needed to cover the width
    const stripsAcross = Math.ceil(widthFeet / ROLL_WIDTH_FEET);

    // Generate actual cuts for each strip
    // Each strip needs to cover the full length, but rolls are max 100ft
    const generatedCuts: Cut[] = [];
    let cutId = 0;

    for (let stripIndex = 0; stripIndex < stripsAcross; stripIndex++) {
      let remainingLength = lengthFeet;

      while (remainingLength > 0) {
        // Take up to ROLL_LENGTH_FEET (100ft) at a time, minimum MIN_CUT_LENGTH
        const cutLength = Math.min(remainingLength, ROLL_LENGTH_FEET);

        if (cutLength >= MIN_CUT_LENGTH) {
          generatedCuts.push({
            id: `cut-${cutId++}`,
            stripIndex,
            length: cutLength,
            squareFeet: cutLength * ROLL_WIDTH_FEET,
          });
          remainingLength -= cutLength;
        } else if (cutLength > 0) {
          // If remaining is less than min, extend to minimum
          generatedCuts.push({
            id: `cut-${cutId++}`,
            stripIndex,
            length: MIN_CUT_LENGTH,
            squareFeet: MIN_CUT_LENGTH * ROLL_WIDTH_FEET,
          });
          break;
        } else {
          break;
        }
      }
    }

    // Calculate total linear feet from cuts
    const linearFeetTotal = generatedCuts.reduce((sum, cut) => sum + cut.length, 0);
    const totalCutSqFt = generatedCuts.reduce((sum, cut) => sum + cut.squareFeet, 0);

    // Calculate rolls needed using first-fit decreasing bin packing
    const sortedCuts = [...generatedCuts].sort((a, b) => b.length - a.length);
    const rolls: number[] = []; // remaining space in each roll

    for (const cut of sortedCuts) {
      // Find a roll with enough space
      let placed = false;
      for (let i = 0; i < rolls.length; i++) {
        if (rolls[i] >= cut.length) {
          rolls[i] -= cut.length;
          placed = true;
          break;
        }
      }
      // If no roll has space, start a new roll
      if (!placed) {
        rolls.push(ROLL_LENGTH_FEET - cut.length);
      }
    }

    const calculatedRollsNeeded = rolls.length;

    // Actual coverage vs needed coverage
    const actualCoverage = totalCutSqFt;
    const wastePercentage = sqft > 0 ? Math.round(((actualCoverage - sqft) / sqft) * 1000) / 10 : 0;

    // Seams: one seam for each joint between strips
    const seamCount = stripsAcross > 1 ? stripsAcross - 1 : 0;
    const seamTapeFeet = seamCount * lengthFeet;

    // Infill calculation (pet turf needs more)
    const lbsPerSqFt = isPetTurf ? INFILL_LBS_PER_SQFT_PET : INFILL_LBS_PER_SQFT_STANDARD;
    const infillPounds = Math.ceil(sqft * lbsPerSqFt);
    const infillBags = Math.ceil(infillPounds / INFILL_BAG_SIZE_LBS);

    // Generate helpful notes
    const notes: string[] = [
      `Turf is sold in ${ROLL_WIDTH_FEET}ft wide rolls`,
    ];

    if (seamCount > 0) {
      notes.push(`Your project requires ${seamCount} seam${seamCount > 1 ? "s" : ""}`);
    } else {
      notes.push("No seams needed - single roll coverage");
    }

    if (wastePercentage > 15) {
      notes.push(
        `Consider adjusting dimensions to reduce ${wastePercentage}% material waste`
      );
    }

    // Calculate if a different width would be more efficient
    const optimalWidth = stripsAcross * ROLL_WIDTH_FEET;
    if (optimalWidth !== widthFeet && wastePercentage > 10) {
      notes.push(
        `Tip: A ${optimalWidth}ft width would use the same material with zero waste`
      );
    }

    const est: ProjectEstimate = {
      projectSquareFeet: sqft,
      turf: {
        rollsNeeded: calculatedRollsNeeded,
        linearFeetTotal,
        wastePercentage,
      },
      seaming: {
        seamCount,
        seamTapeFeet,
      },
      infill: includeInfill
        ? {
            poundsNeeded: infillPounds,
            bagsNeeded: infillBags,
          }
        : null,
      notes,
    };

    // Price based on actual square footage ordered (includes waste)
    const priceCents = totalCutSqFt * pricePerSqFtCents;

    return {
      squareFeet: sqft,
      estimate: est,
      totalPriceCents: priceCents,
      cuts: generatedCuts,
      rollsNeeded: calculatedRollsNeeded,
      totalCutSquareFeet: totalCutSqFt,
    };
  }, [widthFeet, lengthFeet, pricePerSqFtCents, isPetTurf, includeInfill]);

  return {
    widthFeet,
    lengthFeet,
    setWidthFeet,
    setLengthFeet,
    squareFeet,
    estimate,
    totalPriceCents,
    cuts,
    rollsNeeded,
    totalCutSquareFeet,
    reset,
  };
}
