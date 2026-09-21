/**
 * Number formatting in the user's locale.
 *
 * A German install expects "12,72", an English one "12.72". Home Assistant
 * hands us the language, so the panel has no business hard-coding either.
 */

const DASH = "—";

export class Formatter {
  private readonly cache = new Map<string, Intl.NumberFormat>();

  /**
   * `extra` adds decimal places on top of what each view asks for. Views name
   * the precision a reading deserves; this is the user saying they want to see
   * further than that.
   */
  constructor(
    private readonly language: string,
    private readonly extra = 0,
  ) {}

  /** How many places this formatter adds, so a caller can spot a stale one. */
  get extraDigits(): number {
    return this.extra;
  }

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
    return this.formatter(digits + this.extra).format(value);
  }

  /**
   * A number that carries its sign, for values where direction is the point:
   * grid power, battery power. Zero stays unsigned.
   */
  signed(value: number | null | undefined, digits = 0): string {
    if (value === null || value === undefined || !Number.isFinite(value)) return DASH;
    const text = this.formatter(digits + this.extra).format(Math.abs(value));
    if (value > 0) return `+${text}`;
    if (value < 0) return `−${text}`;
    return text;
  }

  /**
   * A firmware version. The device encodes four-digit versions with the last
   * digit as the minor part, so 1177 is version 117.7. Shorter values are
   * already in their final form and are left alone.
   *
   * The integration now applies the same rule to the entity state, so this
   * usually sees "117.7" and passes it through. It stays because the step is
   * idempotent and the panel also has to render a device set up under an
   * older version, whose entities still carry the raw number.
   */
  version(value: string | null | undefined): string {
    if (value === null || value === undefined || value === "") return DASH;
    return /^\d{4}$/.test(value) ? `${value.slice(0, 3)}.${value.slice(3)}` : value;
  }

  /**
   * A span of hours as hours and minutes.
   *
   * The runtime sensors report fractional hours, and "8,8 h" asks the reader
   * to do the conversion in their head every time. Minutes are what the
   * question was in - how long until it is empty - so the answer is given in
   * them.
   *
   * The unit words are the same in every language the panel ships, so they sit
   * here rather than in the catalogues. Whole hours drop the minutes, and
   * anything under an hour drops the hours, so a value never carries a part
   * that reads as zero.
   */
  duration(hours: number | null | undefined): string {
    if (hours === null || hours === undefined || !Number.isFinite(hours)) return DASH;

    const total = Math.round(Math.abs(hours) * 60);
    const h = Math.floor(total / 60);
    const m = total % 60;
    const sign = hours < 0 ? "−" : "";

    if (h === 0) return `${sign}${this.formatter(0).format(m)} min`;
    if (m === 0) return `${sign}${this.formatter(0).format(h)} h`;
    return `${sign}${this.formatter(0).format(h)} h ${this.formatter(0).format(m)} min`;
  }

  /** Millivolts from a volt reading, which is how cell deltas are read. */
  millivolts(value: number | null | undefined): string {
    if (value === null || value === undefined || !Number.isFinite(value)) return DASH;
    return this.formatter(0).format(Math.round(value * 1000));
  }
}
