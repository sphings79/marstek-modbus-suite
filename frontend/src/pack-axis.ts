/**
 * The fixed voltage axis of the pack matrix.
 *
 * All packs of these batteries are LFP (Venus D and E v3: 16 cells, Venus A:
 * 13 cells, charge limit about 3.69 V per cell), so the window is fixed at
 * 3.00 - 3.70 V instead of following the data. An axis that rescales to the
 * current readings makes a stack in which every pack sits within a few
 * millivolts jump around between refreshes, and a pack that drifted sideways
 * stops standing out because the scale moves with it.
 *
 * A reading outside the default window (deep discharge, over-voltage, the
 * E v3 report clamp of exactly 4.000 V) widens it, but only to the next
 * multiple of 0.1 V on the side that needs it, so the axis changes in whole
 * steps and is otherwise stable.
 *
 * Everything is computed in tenths of a volt (integers), so 3.7 V is 37 and
 * no float noise decides where a window edge falls.
 */

/** Default window in tenths of a volt. */
const DEFAULT_LO = 30;
const DEFAULT_HI = 37;
/** Guards against 3.7000000000000006 widening the window to 3.8 V. */
const EPS = 1e-6;
/** Most labelled ticks the axis carries before it thins them out. */
const MAX_INTERVALS = 10;

export interface AxisWindow {
  lo: number;
  hi: number;
}

/** The axis window in volts for the given readings (empty list: default). */
export function axisWindow(values: number[]): AxisWindow {
  let lo = DEFAULT_LO;
  let hi = DEFAULT_HI;
  for (const v of values) {
    if (!Number.isFinite(v)) continue;
    lo = Math.min(lo, Math.floor(v * 10 + EPS));
    hi = Math.max(hi, Math.ceil(v * 10 - EPS));
  }
  return { lo: lo / 10, hi: hi / 10 };
}

/**
 * Tick values in volts: every 0.1 V, or every 0.2 / 0.5 / 1 V when a wide
 * window (a 0 V reading) would otherwise crowd the axis. Always multiples of
 * the step, so the labels stay round.
 */
export function axisTicks({ lo, hi }: AxisWindow): number[] {
  const loT = Math.round(lo * 10);
  const hiT = Math.round(hi * 10);
  const step = [1, 2, 5, 10, 20].find((s) => (hiT - loT) / s <= MAX_INTERVALS) ?? 20;
  const out: number[] = [];
  for (let t = Math.ceil(loT / step) * step; t <= hiT; t += step) out.push(t / 10);
  return out;
}
