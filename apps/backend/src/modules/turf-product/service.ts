import { MedusaService } from "@medusajs/framework/utils";
import { TurfAttributes } from "./models/turf-attributes";

/**
 * TurfAttributesService
 *
 * CRUD + turf-specific business logic for the calculator.
 */
export class TurfAttributesService extends MedusaService({
  TurfAttributes,
}) {
  /**
   * List by primary use case (for category pages)
   */
  async listByUseCase(
    useCase: "landscape" | "pet" | "playground" | "sports" | "putting" | "rooftop"
  ) {
    return this.listTurfAttributes({ primary_use: useCase });
  }

  /**
   * Pet-friendly turf with high drainage
   */
  async listPetFriendly() {
    return this.listTurfAttributes({
      pet_friendly: true,
      drainage_rate: { $gte: 30 },
    });
  }

  /**
   * Putting greens (nylon, golf-optimized)
   */
  async listPuttingGreens() {
    return this.listTurfAttributes({
      golf_optimized: true,
      yarn_type: "Nylon",
    });
  }

  // ================================================
  // CALCULATOR LOGIC (The "useTurfLogic" backend)
  // ================================================

  /**
   * Calculate rolls needed for a project
   * CRITICAL: Turf is sold in 15ft widths only
   *
   * @returns rolls needed, total linear feet, waste %
   */
  calculateRollsNeeded(
    widthFeet: number,
    lengthFeet: number
  ): {
    rolls: number;
    totalLinearFeet: number;
    wastePercentage: number;
    seamCount: number;
  } {
    const ROLL_WIDTH = 15;

    // How many 15ft sections to cover width
    const rollsAcross = Math.ceil(widthFeet / ROLL_WIDTH);
    const totalLinearFeet = rollsAcross * lengthFeet;

    // Waste calculation
    const actualCoverage = rollsAcross * ROLL_WIDTH * lengthFeet;
    const neededCoverage = widthFeet * lengthFeet;
    const wastePercentage =
      Math.round(((actualCoverage - neededCoverage) / neededCoverage) * 1000) / 10;

    // Seams = number of joints between rolls
    const seamCount = rollsAcross > 1 ? rollsAcross - 1 : 0;

    return {
      rolls: rollsAcross,
      totalLinearFeet,
      wastePercentage,
      seamCount,
    };
  }

  /**
   * Calculate infill requirement
   * Pet turf needs more infill for drainage/odor control
   *
   * @returns pounds of infill needed
   */
  calculateInfillLbs(squareFeet: number, isPetTurf: boolean): number {
    const LBS_PER_SQFT = isPetTurf ? 1.5 : 1.0;
    return Math.ceil(squareFeet * LBS_PER_SQFT);
  }

  /**
   * Calculate seam tape needed
   * Each seam runs the full length of the project
   *
   * @returns linear feet of seam tape
   */
  calculateSeamTapeFeet(widthFeet: number, lengthFeet: number): number {
    const { seamCount } = this.calculateRollsNeeded(widthFeet, lengthFeet);
    return seamCount * lengthFeet;
  }

  /**
   * Full project estimate - the "Anti-Frustration" calculator
   * Input: dimensions. Output: everything the customer needs to buy.
   */
  getProjectEstimate(
    widthFeet: number,
    lengthFeet: number,
    options: { isPetTurf?: boolean; needsInfill?: boolean } = {}
  ) {
    const { isPetTurf = false, needsInfill = true } = options;
    const squareFeet = widthFeet * lengthFeet;
    const rollCalc = this.calculateRollsNeeded(widthFeet, lengthFeet);

    return {
      projectSquareFeet: squareFeet,
      turf: {
        rollsNeeded: rollCalc.rolls,
        linearFeetTotal: rollCalc.totalLinearFeet,
        wastePercentage: rollCalc.wastePercentage,
      },
      seaming: {
        seamCount: rollCalc.seamCount,
        seamTapeFeet: this.calculateSeamTapeFeet(widthFeet, lengthFeet),
      },
      infill: needsInfill
        ? {
            poundsNeeded: this.calculateInfillLbs(squareFeet, isPetTurf),
            bagsNeeded: Math.ceil(this.calculateInfillLbs(squareFeet, isPetTurf) / 50), // 50lb bags
          }
        : null,
      notes: [
        `Turf sold in 15ft widths`,
        rollCalc.seamCount > 0 ? `${rollCalc.seamCount} seam(s) required` : "No seams needed",
        rollCalc.wastePercentage > 10 ? `Consider adjusting dimensions to reduce ${rollCalc.wastePercentage}% waste` : null,
      ].filter(Boolean),
    };
  }
}
