/**
 * Number formatting in the user's locale.
 *
 * A German install expects "12,72", an English one "12.72". Home Assistant
 * hands us the language, so the panel has no business hard-coding either.
 */

const DASH = "—";

export class Formatter {
  private readonly cache = new Map<string, Intl.NumberFormat>();

  constructor(private readonly language: string) {}

  private formatter(digits: number): Intl.NumberFormat {
    const key = String(digits);
    let f = this.cache.get(key);
    if (!f) {
      f = new Intl.NumberFormat(this.language || "en", {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
      });
      this.cache.set(key, f);
    }
    return f;
  }

  /** A plain number, or an em dash when there is nothing to show. */
  num(value: number | null | undefined, digits = 0): string {
    if (value === null || value === undefined || !Number.isFinite(value)) return DASH;
    return this.formatter(digits).format(value);
  }

  /**
   * A number that carries its sign, for values where direction is the point:
   * grid power, battery power. Zero stays unsigned.
   */
  signed(value: number | null | undefined, digits = 0): string {
    if (value === null || value === undefined || !Number.isFinite(value)) return DASH;
    const text = this.formatter(digits).format(Math.abs(value));
    if (value > 0) return `+${text}`;
    if (value < 0) return `−${text}`;
    return text;
  }

  /** Millivolts from a volt reading, which is how cell deltas are read. */
  millivolts(value: number | null | undefined): string {
    if (value === null || value === undefined || !Number.isFinite(value)) return DASH;
    return this.formatter(0).format(Math.round(value * 1000));
  }
}
