import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function yearsToBlockHeight(years: number): number {
  const blocksPerYear = 365.25 * 24 * 60 / 10; // ~52596
  return Math.round(years * blocksPerYear);
}

function yearsToDate(expiryYears: number): Date {
  const now = new Date();
  const future = new Date(now);
  const days = expiryYears * 365.25; // Include leap years
  future.setDate(future.getDate() + days);
  return future;
}


function padStrikePrice(strike: number): string {
  // Assumes price is in the form like 0.0001 or 200
  // Multiply by 100000 if fractional token like BRC-20 or use cents for equity options
  const normalized = strike < 1 ? Math.round(strike * 1e8) : Math.round(strike * 1000);
  return normalized.toString().padStart(8, "0");
}

function formatDate(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}${mm}${dd}`;
}
function optionNameGenerator(
  date: Date,
  ticker: string,
  type: "call" | "put",
  strike: number
): string {
  const dateStr = formatDate(date); // e.g. 20250601
  const typeLetter = type.toLowerCase() === "call" ? "C" : "P";
  const strikeStr = padStrikePrice(strike); // e.g. 00020000

  return `${ticker.toUpperCase()}${dateStr}${typeLetter}${strikeStr}`;
}

export { optionNameGenerator, yearsToBlockHeight, yearsToDate }