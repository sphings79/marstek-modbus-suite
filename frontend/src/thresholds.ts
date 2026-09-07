/**
 * Where a reading stops being normal.
 *
 * These sat inline in three views and drifted apart: the same pack could read
 * green on the overview and red in the table below it. One definition, so a
 * change lands everywhere the number is judged.
 */

/**
 * Spread between the highest and lowest cell *inside one pack*, in volts.
 *
 * Never apply these across the whole stack. The device works one pack at a
 * time, so packs sit at different states of charge and their cells at
 * different voltages - a difference that says nothing about cell health.
 */
export const CELL_DELTA_WARN_V = 0.05;
export const CELL_DELTA_CRIT_V = 0.1;

/** The tone for an in-pack delta, or "" when there is nothing to judge. */
export function cellDeltaTone(delta: number | null): string {
  if (delta === null) return "";
  if (delta >= CELL_DELTA_CRIT_V) return "crit";
  if (delta >= CELL_DELTA_WARN_V) return "warn";
  return "ok";
}

/**
 * The same verdict for a table or a matrix, where a healthy value stays plain.
 * Colouring every ordinary row green is how a table stops being scannable.
 */
export function cellDeltaFlag(delta: number | null): string {
  const tone = cellDeltaTone(delta);
  return tone === "ok" ? "" : tone;
}

/**
 * How far apart the packs' states of charge may sit before it means anything.
 *
 * The device works one pack at a time rather than all of them in parallel, so
 * during a charge or a discharge the packs are routinely around ten points
 * apart. That is the design working, not a fault, and flagging it would train
 * the reader to ignore both the tile and the table.
 */
export const SPREAD_WARN_PP = 12;
export const SPREAD_CRIT_PP = 20;
/** Bar scale, so an ordinary working spread does not sit at the end of it. */
export const SPREAD_SCALE_PP = 25;
