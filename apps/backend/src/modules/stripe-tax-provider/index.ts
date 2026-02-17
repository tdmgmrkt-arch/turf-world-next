import { ModuleProvider, Modules } from "@medusajs/framework/utils";
import StripeTaxService from "./service";

export default ModuleProvider(Modules.TAX, {
  services: [StripeTaxService],
});
