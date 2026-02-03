"use client";

import NextLink from "next/link";
import { ChevronRight as LucideChevronRight } from "lucide-react";

// Cast to work around React 19 JSX type incompatibility
const Link = NextLink as any;
const ChevronRight = LucideChevronRight as any;

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <div className="border-b bg-muted/30">
      <div className="container py-3 px-3 sm:px-6">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          {items.map((item, index) => (
            <span key={index} className="flex items-center gap-2">
              <ChevronRight className="w-4 h-4" />
              {item.href ? (
                <Link
                  href={item.href}
                  className="hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-foreground font-medium">{item.label}</span>
              )}
            </span>
          ))}
        </nav>
      </div>
    </div>
  );
}
