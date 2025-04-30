import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name: string): string {
  if (!name) return '';
  
  // Split the name into words and get the first letter of each word
  const words = name.trim().split(/\s+/);
  const initials = words
    .slice(0, 2) // Take first two words
    .map(word => word.charAt(0).toUpperCase()) // Get first letter of each word
    .join('');
    
  return initials;
}
