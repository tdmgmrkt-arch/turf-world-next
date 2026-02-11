import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductByHandle as getProductByHandleSync, PRODUCTS } from "@/lib/products";
import { getProductByHandle, fetchAllProducts } from "@/lib/medusa-products";
import { USE_MEDUSA_API } from "@/lib/medusa-client";
import ProductDetailClient from "./product-detail-client";

interface ProductDetailPageProps {
  params: Promise<{ handle: string }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { handle } = await params;

  // Fetch product based on feature flag
  const product = USE_MEDUSA_API
    ? await getProductByHandle(handle)
    : getProductByHandleSync(handle);

  if (!product) {
    return {
      title: "Product Not Found | Turf World",
    };
  }

  return {
    title: `${product.name} | Turf World`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images.map(img => ({ url: img })),
    },
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { handle } = await params;

  // Fetch product based on feature flag
  const product = USE_MEDUSA_API
    ? await getProductByHandle(handle)
    : getProductByHandleSync(handle);

  if (!product) {
    notFound();
  }

  // Fetch all products for related products
  const allProducts = USE_MEDUSA_API
    ? await fetchAllProducts()
    : PRODUCTS;

  // Get related products (same category, different product)
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}
