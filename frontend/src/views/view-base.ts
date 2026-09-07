import { LitElement, html, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { baseStyles } from "../styles";
import type { DeviceReader } from "../entities";
import type { Formatter } from "../format";

export type Translate = (
  key: string,
  values?: Record<string, string | number>,
) => string;

/**
 * What every tab shares: the device being shown, number formatting, and the
 * label/value row that makes up most of the panel.
 */
export abstract class MkView extends LitElement {
  @property({ attribute: false }) reader!: DeviceReader;
  @property({ attribute: false }) fmt!: Formatter;
  @property({ attribute: false }) t!: Translate;

  static styles = [baseStyles];

  /**
   * One row, named and scaled by the entity itself. Rows whose entity is
   * missing or disabled are skipped rather than shown empty: a battery that
   * does not report a value should not leave a gap where a number belongs.
   *
   * Pass `raw` for states that only look numeric - a firmware build like
   * 202409090159 is an identifier, and thousands separators turn it into
   * nonsense.
   */
  protected kv(
    key: string,
    digits = 1,
    opts: { tone?: string; label?: string; raw?: boolean } = {},
  ): TemplateResult | typeof nothing {
    const r = this.reader;
    if (!r.entityId(key)) return nothing;

    const raw = r.state(key);
    if (!raw) return nothing;

    const numeric = opts.raw ? null : r.num(key);
    const unit = r.unit(key);
    const text =
      numeric === null
        ? raw.state
        : `${this.fmt.num(numeric, digits)}${unit ? ` ${unit}` : ""}`;

    return html`
      <div class="kv">
        <span>${opts.label ?? r.label(key)}</span>
        <b class=${opts.tone ?? ""}>${text}</b>
      </div>
    `;
  }

  /** A row with a value the view worked out itself. */
  protected row(
    label: string,
    value: string,
    tone = "",
  ): TemplateResult {
    return html`
      <div class="kv">
        <span>${label}</span>
        <b class=${tone}>${value}</b>
      </div>
    `;
  }

  /** Pack indices, 1-based, as many as this battery reports. */
  protected get packs(): number[] {
    return Array.from({ length: this.reader.packCount() }, (_, i) => i + 1);
  }
}
