/**
 * Shared currency formatting utilities — Taiwanese New Dollar (NTD / TWD).
 * All monetary values are displayed in NT$ with no decimal places.
 */

const NTD = new Intl.NumberFormat('zh-TW', {
  style: 'currency',
  currency: 'TWD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/**
 * Format a number as NTD.
 * e.g. 142580 → "NT$142,580"
 */
export function formatCurrency(value: number): string {
  return NTD.format(Math.abs(value));
}

/**
 * Format a number as compact NTD (thousands).
 * e.g. 7600 → "NT$7.6k"
 */
export function formatCompact(value: number): string {
  const abs = Math.abs(value);
  if (abs >= 1000) {
    return `NT$${(abs / 1000).toFixed(1)}k`;
  }
  return formatCurrency(abs);
}

/**
 * Format a signed currency value with explicit +/− prefix.
 * e.g. 4800 → "+NT$4,800"   -280 → "−NT$280"
 */
export function formatSigned(value: number): string {
  const sign = value >= 0 ? '+' : '−';
  return `${sign}${formatCurrency(Math.abs(value))}`;
}
