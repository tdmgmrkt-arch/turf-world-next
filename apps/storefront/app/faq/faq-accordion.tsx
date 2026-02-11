"use client";

import { useState } from "react";
import {
  ChevronDown as LucideChevronDown,
  Package as LucidePackage,
  Truck as LucideTruck,
  Shield as LucideShield,
  Sparkles as LucideSparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ChevronDown = LucideChevronDown as any;
const Package = LucidePackage as any;
const Truck = LucideTruck as any;
const Shield = LucideShield as any;
const Sparkles = LucideSparkles as any;

const iconMap: Record<string, any> = {
  Package,
  Truck,
  Shield,
  Sparkles,
};

interface FAQAccordionProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

export function FAQAccordion({
  question,
  answer,
  isOpen,
  onToggle,
}: FAQAccordionProps) {
  return (
    <div className="group rounded-xl border border-border/50 bg-white shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 sm:p-5 text-left transition-colors hover:bg-slate-50"
      >
        <h3 className="font-semibold text-sm sm:text-base pr-4 group-hover:text-primary transition-colors">
          {question}
        </h3>
        <ChevronDown
          className={cn(
            "w-5 h-5 flex-shrink-0 text-muted-foreground transition-transform duration-300",
            isOpen && "rotate-180 text-primary"
          )}
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0">
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
}

interface FAQCategoryProps {
  category: {
    category: string;
    icon: string;
    color: string;
    questions: Array<{ question: string; answer: string }>;
  };
}

export function FAQCategory({ category }: FAQCategoryProps) {
  const [openItems, setOpenItems] = useState<number | null>(null);
  const Icon = iconMap[category.icon] || Package;

  const toggleItem = (index: number) => {
    setOpenItems(openItems === index ? null : index);
  };

  return (
    <div>
      {/* Category Header */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className={`w-10 h-10 rounded-lg bg-gradient-to-br ${category.color} flex items-center justify-center shadow-md`}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-2xl font-bold">{category.category}</h2>
      </div>

      {/* Questions */}
      <div className="space-y-3">
        {category.questions.map((faq, index) => (
          <FAQAccordion
            key={index}
            question={faq.question}
            answer={faq.answer}
            isOpen={openItems === index}
            onToggle={() => toggleItem(index)}
          />
        ))}
      </div>
    </div>
  );
}
