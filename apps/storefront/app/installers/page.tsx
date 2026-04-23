import { Metadata } from "next";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { InstallerInquiryForm } from "./installer-inquiry-form";

export const metadata: Metadata = {
  title: "Request Installation | Turf World",
  description:
    "Need artificial turf installed? Submit a quick form and we'll connect you with one of our partnered, vetted installers in your area. Free consultation.",
  keywords: [
    "turf installation",
    "artificial grass installer",
    "turf installer near me",
    "professional turf installation",
    "partnered turf installer",
  ],
};

export default function InstallersPage() {
  return (
    <div className="min-h-screen">
      <Breadcrumb items={[{ label: "Installation" }]} />
      <InstallerInquiryForm />
    </div>
  );
}
