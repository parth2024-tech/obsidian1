import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines classes using clsx and tailwind-merge.
 * Used for shadcn/ui components.
 * 
 * @param inputs - Class values to combine
 * @returns A single string of combined and deduplicated Tailwind classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
