import { Module } from "@medusajs/framework/utils";
import { TurfAttributesService } from "./service";

export const TURF_PRODUCT_MODULE = "turfProduct";

export default Module(TURF_PRODUCT_MODULE, {
  service: TurfAttributesService,
});

export * from "./models/turf-attributes";
export { TurfAttributesService } from "./service";
