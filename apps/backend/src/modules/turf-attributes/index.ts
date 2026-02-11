import { Module } from "@medusajs/framework/utils";
import TurfAttributesService from "./service";

/**
 * Turf Attributes Module
 *
 * Registers the TurfAttributes model with Medusa.
 * This makes it available throughout the application.
 */
export const TURF_ATTRIBUTES_MODULE = "turf_attributes";

export default Module(TURF_ATTRIBUTES_MODULE, {
  service: TurfAttributesService,
});

export * from "./models";
