import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string): string {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(numAmount);
}

export function formatArea(area: number | string): string {
  return `${area} m²`;
}

// Format location string
export function formatLocation(location: string): string {
  return location.trim();
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

// Function to create staggered animation variants
export function staggeredAnimationVariants(staggerChildren = 0.1, delayChildren = 0) {
  return {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren,
        delayChildren,
      },
    },
  };
}

// Animation variants for individual items
export function itemAnimationVariants(duration = 0.5, y = 20) {
  return {
    hidden: { opacity: 0, y },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration,
        ease: "easeOut",
      },
    },
  };
}

// Format budget from range value
export function formatBudgetRange(range: string): string {
  switch (range) {
    case "1-2":
      return "€1,000,000 - €2,000,000";
    case "2-5":
      return "€2,000,000 - €5,000,000";
    case "5-10":
      return "€5,000,000 - €10,000,000";
    case "10+":
      return "€10,000,000+";
    default:
      return range;
  }
}

// Get URL for image with quality parameter
export function getImageUrl(url: string, quality = 80, width = 1200): string {
  if (!url) return "";
  return `${url}?ixlib=rb-1.2.1&auto=format&fit=crop&w=${width}&q=${quality}`;
}

// Function to generate property reference
export function generatePropertyReference(): string {
  const prefix = "LS-";
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}${randomNum}`;
}
