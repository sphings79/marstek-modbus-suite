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
    opts: { tone?: string; label?: string; raw?: boolean; version?: boolean; duration?: boolean } = {},
  ): TemplateResult | typeof nothing {
    const r = this.reader;
    if (!r.entityId(key)) return nothing;

    const raw = r.state(key);
    if (!raw) return nothing;

    if (opts.version) {
      return html`
        <div class="kv">
          <span>${opts.label ?? r.label(key)}</span>
          <b class=${opts.tone ?? ""}>${this.fmt.version(raw.state)}</b>
        </div>
      `;
    }

    const numeric = opts.raw ? null : r.num(key);
    const unit = r.unit(key);
    // A duration carries its own units, so the entity's "h" would read twice.
    const text =
      numeric === null
        ? raw.state
        : opts.duration
          ? this.fmt.duration(numeric)
          : `${this.fmt.num(numeric, digits)}${unit ? ` ${unit}` : ""}`;

    return html`
      <div class="kv">
        <span>${opts.label ?? r.label(key)}</span>
        <b class=${opts.tone ?? ""}>${text}</b>
      </div>
    `;
  }

  /**
   * The first of these keys the device actually has, as a `kv` row.
   *
   * A reading can live under two names depending on the model: the multi-pack
   * Venus D and A carry the BMS version only as pack 1's entity, where the
   * single-pack E models map 30204 as bms_version. Voltage and current look
   * like the same case and are not - see `packElectrical`.
   */
  protected kvFirst(
    keys: string[],
    digits = 1,
    opts: { tone?: string; label?: string; raw?: boolean; version?: boolean; duration?: boolean } = {},
  ): TemplateResult | typeof nothing {
    const key = keys.find((candidate) => this.reader.entityId(candidate));
    return key ? this.kv(key, digits, opts) : nothing;
  }

  /**
   * Terminal voltage and current of the pack that is actually working.
   *
   * The multi-pack Venus D and A serve these per pack, and only the
   * conducting one carries a reading: pack 1's current register sits at 0
   * while another pack does the work. Pinning the pair to pack 1 is how a
   * 45 A discharge came to be shown as 0 A, so the rows follow the pack the
   * device has switched in and say which one that is. The single-pack E
   * models map one unindexed pair and keep it unlabelled.
   */
  protected packElectrical(): (TemplateResult | typeof nothing)[] {
    const r = this.reader;
    // The indexed pair decides, the way kvFirst used to order it. A D that was
    // set up under an older version can still carry a battery_voltage entity
    // from a register map that no longer has one; it sits at unavailable, and
    // preferring it drops both rows instead of showing the pack.
    if (!r.entityId("battery_1_voltage")) {
      return [this.kv("battery_voltage", 2), this.kv("battery_current", 2)];
    }

    const pack = r.conductingPack();
    const where =
      pack === null
        ? this.t("common.standby")
        : this.t("common.pack_n", { pack });

    if (pack === null) {
      const dash = this.t("common.unavailable");
      return [
        this.row(`${this.t("common.voltage")} · ${where}`, dash),
        this.row(`${this.t("common.current")} · ${where}`, dash),
      ];
    }

    return [
      this.kv(`battery_${pack}_voltage`, 2, {
        label: `${this.t("common.voltage")} · ${where}`,
      }),
      this.kv(`battery_${pack}_current`, 2, {
        label: `${this.t("common.current")} · ${where}`,
      }),
    ];
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
