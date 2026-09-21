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
 *
 * These two are the defaults. How far apart packs drift depends on how many
 * are stacked and on how hard the installation is driven, so both are
 * adjustable in the settings view - see the range below.
 */
export const SPREAD_WARN_PP = 19;
export const SPREAD_CRIT_PP = 25;

/** What the settings view offers, and the step its sliders take. */
export const SPREAD_MIN_PP = 5;
export const SPREAD_MAX_PP = 60;
export const SPREAD_STEP_PP = 1;

/**
 * Bar scale. Above the critical threshold rather than on it, so a spread that
 * is genuinely running away still has room to grow visibly instead of sitting
 * pinned at the end of the bar.
 */
export function spreadScale(crit: number): number {
  return crit + 5;
}

/** The tone for a stack spread, or "" when there is nothing to judge. */
export function spreadTone(
  spread: number | null,
  warn: number = SPREAD_WARN_PP,
  crit: number = SPREAD_CRIT_PP,
): string {
  if (spread === null) return "";
  if (spread >= crit) return "crit";
  if (spread >= warn) return "warn";
  return "ok";
}

/**
 * Is one pack far enough from the middle of the stack to point at?
 *
 * Asked only once the stack as a whole is already flagged. The tile above the
 * table answers "are the packs drifting apart", and this answers "which ones";
 * a table that forms its own second opinion is how a green tile ends up
 * sitting over red rows.
 *
 * Half the warn threshold, because the tile measures the full width of the
 * stack - highest minus lowest - while this measures one pack's distance from
 * the middle of it.
 */
export function packIsOutlier(
  soc: number | null,
  median: number | null,
  spread: number | null,
  warn: number = SPREAD_WARN_PP,
): boolean {
  if (soc === null || median === null || spread === null) return false;
  if (spread < warn) return false;
  return Math.abs(soc - median) > warn / 2;
}
