// Digit string -> "123 456 789" (groups of 3). Empty stays empty.
export function formatPhone(raw: string): string {
  return raw.replace(/(\d{3})(?=\d)/g, "$1 ");
}

