import { LitElement, html, nothing, type TemplateResult } from "lit";
import { property } from "lit/decorators.js";
import { baseStyles } from "../styles";
import type { DeviceReader } from "../entities";
import type { Formatter } from "../format";

export type Translate = (
  key: string,
  values?: Record<string, string | number>,
) => string;

/** The pack NTCs the multi-pack maps and the E v3 serve per pack. */
export const PACK_NTCS = [1, 2, 3, 4];

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
    opts: {
      tone?: string;
      label?: string;
      raw?: boolean;
      version?: boolean;
      /** Tooltip on the row, for a label the panel chose itself. */
      title?: string;
      /** Let a long text break over lines instead of running off the card. */
      wrap?: boolean;
    } = {},
  ): TemplateResult | typeof nothing {
    const r = this.reader;
    if (!r.entityId(key)) return nothing;

    const raw = r.state(key);
    if (!raw) return nothing;

    if (opts.version) {
      return html`
        <div class="kv" title=${opts.title || nothing}>
          <span>${opts.label ?? r.label(key)}</span>
          <b class=${opts.tone ?? ""}>${this.fmt.version(raw.state)}</b>
        </div>
      `;
    }

    const numeric = opts.raw ? null : r.num(key);
    const unit = r.unit(key);
    const text =
      numeric === null
        ? raw.state
        : `${this.fmt.num(numeric, digits)}${unit ? ` ${unit}` : ""}`;

    return html`
      <div class="kv" title=${opts.title || nothing}>
        <span>${opts.label ?? r.label(key)}</span>
        <b class="${opts.tone ?? ""} ${opts.wrap ? "wrap" : ""}">${text}</b>
      </div>
    `;
  }

  /**
   * The text of a fault or warning code in the panel's language.
   *
   * Only for a sensor that decodes its codes itself (the MPPT codes of the
   * Venus A): its state is then an English text, and the catalogue may hold
   * the same code in the reader's language under `code.<key>.<code>`. A
   * sensor that shows a plain number gets none, however the catalogue reads -
   * the Venus D has the same register and no proof what its codes mean. Null
   * when there is no text at all.
   */
  protected codeLabel(key: string): string | null {
    const r = this.reader;
    const entityText = r.codeText(key);
    if (entityText === null) return null;
    const code = r.code(key);
    if (code !== null) {
      const catalogueKey = `code.${key}.${code}`;
      const text = this.t(catalogueKey);
      if (text !== catalogueKey) return text;
    }
    return entityText;
  }

  /**
   * A fault or warning code as a row: its text, or the plain number when the
   * sensor has none. Never grouped with thousands separators - 1367 is a code,
   * and "1.367" reads like a quantity. A decoded text carries the code in its
   * tooltip.
   */
  protected codeRow(key: string, tone = ""): TemplateResult | typeof nothing {
    const r = this.reader;
    if (!r.entityId(key) || !r.state(key)) return nothing;
    const text = this.codeLabel(key);
    if (text === null) return this.kv(key, 0, { raw: true, tone });
    const code = r.code(key);
    return this.row(r.label(key), text, tone, {
      title: code === null ? undefined : String(code),
      wrap: true,
    });
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
    opts: { tone?: string; label?: string; raw?: boolean; version?: boolean; title?: string; wrap?: boolean } = {},
  ): TemplateResult | typeof nothing {
    const key = keys.find((candidate) => this.reader.entityId(candidate));
    return key ? this.kv(key, digits, opts) : nothing;
  }

  /**
   * Terminal voltage and current of the pack that is actually working.
   *
   * The multi-pack Venus D and A serve these per pack, and only a pack that
   * is switched in (MOSFET status 1 to 3, see `conductingPack`) carries a
   * reading: pack 1's current register sits at 0 while another pack does the
   * work. Pinning the pair to pack 1 is how a 45 A discharge came to be shown
   * as 0 A, so the rows follow the pack the device has switched in and say
   * which one that is: "Voltage · active pack 3", with a tooltip saying that
   * this is the pack switched in right now and the others are idle. Without a
   * pack switched in the label says standby. A plain "Pack 3" read like a
   * mistake next to rows about other packs. The single-pack E models map one
   * unindexed pair and keep it unlabelled.
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
        : this.t("common.active_pack", { pack });
    const title = this.t("common.active_pack_hint");

    if (pack === null) {
      const dash = this.t("common.unavailable");
      return [
        this.row(`${this.t("common.voltage")} · ${where}`, dash, "", { title }),
        this.row(`${this.t("common.current")} · ${where}`, dash, "", { title }),
      ];
    }

    return [
      this.kv(`battery_${pack}_voltage`, 2, {
        label: `${this.t("common.voltage")} · ${where}`,
        title,
      }),
      this.kv(`battery_${pack}_current`, 2, {
        label: `${this.t("common.current")} · ${where}`,
        title,
      }),
    ];
  }

  /**
   * A row with a value the view worked out itself. `title` puts the raw
   * figure behind a decoded text into a tooltip; `wrap` lets a long value
   * break over lines instead of running off the card.
   */
  protected row(
    label: string,
    value: string,
    tone = "",
    opts: { title?: string; wrap?: boolean } = {},
  ): TemplateResult {
    return html`
      <div class="kv">
        <span>${label}</span>
        <b class="${tone} ${opts.wrap ? "wrap" : ""}" title=${opts.title || nothing}>${value}</b>
      </div>
    `;
  }

  /**
   * The unit of the first of these keys the device actually reports.
   *
   * Read off the entity rather than written into the layout. Temperatures
   * carry a device class, so Home Assistant hands an imperial install °F -
   * a heading that says °C would then be labelling the wrong numbers. An
   * empty string when nothing reports one, which every caller treats as "say
   * nothing" rather than printing a stray separator.
   */
  protected unitOf(...keys: string[]): string {
    for (const key of keys) {
      const unit = this.reader.unit(key);
      if (unit) return unit;
    }
    return "";
  }

  /**
   * A note for the single-pack Venus E v3, whose pack readings are disabled
   * by default: Home Assistant does not hand disabled entities to the
   * frontend, so the panel cannot show them and says how to get them rather
   * than leaving empty boxes. Nothing on the multi-pack models, where these
   * readings are enabled by default, and nothing once all of them report.
   */
  protected disabledPackNote(fields: string[]): TemplateResult | typeof nothing {
    const r = this.reader;
    if (!r.isSinglePack()) return nothing;
    const missing = fields.filter((field) => !r.entityId(r.packKey(1, field)));
    if (!missing.length) return nothing;
    return html`<div
      class="panel note"
      role="note"
      style="margin:0 0 var(--mk-gap);border-color:var(--mk-warn)"
    >
      ${this.t("common.pack_entities_disabled")}
    </div>`;
  }

  /** Pack indices, 1-based, as many as this battery reports. */
  protected get packs(): number[] {
    return Array.from({ length: this.reader.packCount() }, (_, i) => i + 1);
  }

  /** The cell NTC readings pack `pack` reports right now (none when disabled). */
  protected packCellTemps(pack: number): number[] {
    return PACK_NTCS.map((n) => this.reader.num(`battery_${pack}_cell_temperature_${n}`)).filter(
      (v): v is number => v !== null,
    );
  }

  /**
   * The highest and lowest cell temperature over every pack and all of their
   * cell NTCs, and the pack(s) that hold each extreme (several on a tie).
   * Null when no pack NTC reports - the Venus E v1/v2 have none, and the E v3
   * has them disabled by default - so a caller falls back to the firmware's
   * own maximum, which is the only stack-wide figure the BMS serves.
   */
  protected cellTempExtremes(): {
    hi: { value: number; packs: number[] };
    lo: { value: number; packs: number[] };
  } | null {
    const perPack = this.packs
      .map((pack) => ({ pack, temps: this.packCellTemps(pack) }))
      .filter((x) => x.temps.length > 0);
    if (!perPack.length) return null;

    const hiValue = Math.max(...perPack.map((x) => Math.max(...x.temps)));
    const loValue = Math.min(...perPack.map((x) => Math.min(...x.temps)));
    return {
      hi: {
        value: hiValue,
        packs: perPack.filter((x) => Math.max(...x.temps) === hiValue).map((x) => x.pack),
      },
      lo: {
        value: loValue,
        packs: perPack.filter((x) => Math.min(...x.temps) === loValue).map((x) => x.pack),
      },
    };
  }
}
