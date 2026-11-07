export const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL"] as const;

export type Size = (typeof SIZE_OPTIONS)[number];
export type FitPreference = "fitted" | "regular" | "relaxed";

export function recommendSize(size: Size, fit: FitPreference): Size {
  const currentIndex = SIZE_OPTIONS.indexOf(size);
  const adjustment = fit === "fitted" ? -1 : fit === "relaxed" ? 1 : 0;
  const recommendedIndex = Math.min(
    SIZE_OPTIONS.length - 1,
    Math.max(0, currentIndex + adjustment),
  );
  return SIZE_OPTIONS[recommendedIndex];
}
