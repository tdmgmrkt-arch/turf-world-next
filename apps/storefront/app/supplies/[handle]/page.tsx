import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getAccessoryByHandle as getAccessoryByHandleSync,
  getAccessoriesByCategory as getAccessoriesByCategorySync,
} from "@/lib/products";
import {
  getAccessoryByHandle,
  getAccessoriesByCategory,
} from "@/lib/medusa-products";
import { USE_MEDUSA_API } from "@/lib/medusa-client";
import SupplyDetailClient from "./supply-detail-client";

interface SupplyDetailPageProps {
  params: Promise<{ handle: string }>;
}

export async function generateMetadata({ params }: SupplyDetailPageProps): Promise<Metadata> {
  const { handle } = await params;

  // Fetch accessory based on feature flag
  const accessory = USE_MEDUSA_API
    ? await getAccessoryByHandle(handle)
    : getAccessoryByHandleSync(handle);

  if (!accessory) {
    return {
      title: "Supply Not Found | Turf World",
    };
  }

  return {
    title: `${accessory.name} | Installation Supplies | Turf World`,
    description: accessory.description,
    openGraph: {
      title: accessory.name,
      description: accessory.description,
      images: accessory.images.map(img => ({ url: img })),
    },
  };
}

export default async function SupplyDetailPage({ params }: SupplyDetailPageProps) {
  const { handle } = await params;

  // Fetch accessory based on feature flag
  const accessory = USE_MEDUSA_API
    ? await getAccessoryByHandle(handle)
    : getAccessoryByHandleSync(handle);

  if (!accessory) {
    notFound();
  }

  // Get related accessories (same category, different product)
  const relatedAccessories = USE_MEDUSA_API
    ? (await getAccessoriesByCategory(accessory.category))
        .filter((a) => a.id !== accessory.id)
        .slice(0, 4)
    : getAccessoriesByCategorySync(accessory.category)
        .filter((a) => a.id !== accessory.id)
        .slice(0, 4);

  return (
    <SupplyDetailClient
      accessory={accessory}
      relatedAccessories={relatedAccessories}
    />
  );
}
