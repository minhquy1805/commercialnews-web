export function formatCompactNumber(value?: number | null) {
  if (value === undefined || value === null) {
    return "0";
  }

  return new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}
