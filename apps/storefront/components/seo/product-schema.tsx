import type { TurfAttributes } from "@/types";

interface ProductSchemaProps {
  product: {
    title: string;
    handle: string;
    description: string;
    pricePerSqFtCents: number;
    thumbnail?: string | null;
    attributes?: Partial<TurfAttributes>;
  };
  reviews?: {
    averageRating: number;
    reviewCount: number;
  };
}

/**
 * ProductSchema - Schema.org Product JSON-LD
 *
 * Helps search engines understand product data.
 * Enables rich results (price, rating, availability).
 */
export function ProductSchema({ product, reviews }: ProductSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.thumbnail || "https://turf-world.com/og-image.jpg",
    url: `https://turf-world.com/products/${product.handle}`,
    brand: {
      "@type": "Brand",
      name: "Turf World",
    },
    offers: {
      "@type": "Offer",
      price: (product.pricePerSqFtCents / 100).toFixed(2),
      priceCurrency: "USD",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: (product.pricePerSqFtCents / 100).toFixed(2),
        priceCurrency: "USD",
        unitCode: "FTK", // Square foot
        unitText: "sq ft",
      },
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "Turf World",
      },
    },
    ...(reviews && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: reviews.averageRating,
        reviewCount: reviews.reviewCount,
        bestRating: 5,
        worstRating: 1,
      },
    }),
    // Additional product attributes
    ...(product.attributes && {
      additionalProperty: [
        product.attributes.face_weight && {
          "@type": "PropertyValue",
          name: "Total Weight",
          value: `${product.attributes.face_weight} oz/sq yd`,
        },
        product.attributes.pile_height && {
          "@type": "PropertyValue",
          name: "Pile Height",
          value: `${product.attributes.pile_height} inches`,
        },
        product.attributes.warranty_years && {
          "@type": "PropertyValue",
          name: "Warranty",
          value: `${product.attributes.warranty_years} years`,
        },
        product.attributes.fire_rating && {
          "@type": "PropertyValue",
          name: "Fire Rating",
          value: product.attributes.fire_rating.replace("_", " "),
        },
      ].filter(Boolean),
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * FAQSchema - Schema.org FAQPage JSON-LD
 *
 * For FAQ sections on product and help pages.
 */
interface FAQSchemaProps {
  faqs: Array<{ question: string; answer: string }>;
}

export function FAQSchema({ faqs }: FAQSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * OrganizationSchema - For homepage/site-wide
 */
export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Turf World",
    url: "https://turf-world.com",
    logo: "https://turf-world.com/logo.png",
    description:
      "Direct-to-consumer supplier of professional-grade artificial grass.",
    address: {
      "@type": "PostalAddress",
      addressCountry: "US",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+(909) 491-2203",
      contactType: "customer service",
      availableLanguage: "English",
    },
    sameAs: [
      "https://www.facebook.com/profile.php?id=61552575488475",
      "https://www.instagram.com/_turfworld/",
      "https://www.yelp.com/biz/turf-world-pomona",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * BreadcrumbSchema - For navigation
 */
interface BreadcrumbSchemaProps {
  items: Array<{ name: string; href: string }>;
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `https://turf-world.com${item.href}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * LocalBusinessSchema - For location pages
 */
interface LocalBusinessSchemaProps {
  city: string;
  state: string;
}

export function LocalBusinessSchema({ city, state }: LocalBusinessSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `Turf World - ${city}`,
    description: `Professional artificial grass supplier serving ${city}, ${state}. Shop online for premium turf with fast nationwide shipping.`,
    url: `https://turf-world.com/locations/${city.toLowerCase().replace(/\s+/g, "-")}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: city,
      addressRegion: state,
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      // Would be populated dynamically
    },
    areaServed: {
      "@type": "City",
      name: city,
    },
    priceRange: "$$",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
