// Digits only (empty OK) — the gate for every keystroke.
export const typingRegex = /^\d*$/;

// Digit string -> integer. Blank or garbage -> 0, never NaN/float.
export function parseCurrency(raw: string): number {
  return typingRegex.test(raw) ? Number(raw || "0") : 0;
}

// Digit string -> "1,234,567". Empty stays empty so the field can look blank.
// ponytail: regex grouping instead of Number().toLocaleString() — no round-trip,
// preserves leading zeros mid-typing, locale-independent.
export function formatCurrency(raw: string): string {
  return raw.replace(/\B(?=(\d{3})+$)/g, ",");
}
