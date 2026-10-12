/**
 * Banker's Rounding (Round Half to Even) to replicate Python 3's built-in round().
 */
export function roundHalfEven(num: number, decimals: number = 0): number {
  if (isNaN(num)) return num;
  const factor = Math.pow(10, decimals);
  const n = +(num * factor).toFixed(10);
  const floor = Math.floor(n);
  const diff = n - floor;
  const EPSILON = 1e-8;

  if (Math.abs(diff - 0.5) < EPSILON) {
    const isEven = Math.abs(floor % 2) === 0;
    return (isEven ? floor : floor + 1) / factor;
  }
  return Math.round(n) / factor;
}
