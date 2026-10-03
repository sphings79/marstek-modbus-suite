/**
 * Writing back to the battery.
 *
 * Everything the panel changes goes through here, so the views stay free of
 * Home Assistant service calls and there is one place that knows how a
 * register key becomes an entity id.
 */

import type { HassCallError, HomeAssistant, LocalizeFunc, PressResult } from "./types";
import type { DeviceReader } from "./entities";
import { PLATFORM } from "./entities";

/** Prefix Home Assistant puts in front of a validation error's message. */
const VALIDATION_PREFIX = "Validation error: ";

export class DeviceControls {
  /** Exception texts of an integration, loaded once per language and domain. */
  private static exceptions = new Map<string, Promise<LocalizeFunc | null>>();

  constructor(
    private readonly hass: HomeAssistant,
    private readonly reader: DeviceReader,
  ) {}

  /**
   * One service call against the entity behind `key`.
   *
   * The promise is returned so callers can report a refusal; without one a
   * control would sit at "pending" with nothing on screen saying why. Home
   * Assistant's own toast is suppressed for the calls whose refusal the panel
   * shows itself (`quiet`).
   */
  private call(
    domain: string,
    service: string,
    key: string,
    data: Record<string, unknown>,
    quiet = false,
  ): Promise<unknown> {
    const entity_id = this.reader.entityId(key);
    if (!entity_id) return Promise.resolve();
    return this.hass.callService(
      domain,
      service,
      { entity_id, ...data },
      undefined,
      quiet ? false : undefined,
    );
  }

  setNumber(key: string, value: number) {
    return this.call("number", "set_value", key, { value });
  }

  selectOption(key: string, option: string) {
    return this.call("select", "select_option", key, { option });
  }

  /**
   * Days and/or window of a schedule slot in one step. `key` is any entity
   * of the slot. The integration validates the slot as a whole and rejects
   * a dead window or an overlap with the error's translation key.
   */
  setSchedule(
    key: string,
    data: { days?: string[]; start?: number; end?: number },
  ) {
    const entity_id = this.reader.entityId(key);
    if (!entity_id) return Promise.resolve();
    return this.hass.callWS({ type: "marstek_modbus/schedule/set", entity_id, ...data });
  }

  setSwitch(key: string, on: boolean) {
    return this.call("switch", on ? "turn_on" : "turn_off", key, {});
  }

  /**
   * Press a button entity through the integration's websocket command.
   *
   * Without a token, a button with a two-step confirmation writes nothing and
   * answers with its warning and a one-time token (`needs_confirm`); the
   * caller asks the user and calls again with the token inside the window,
   * which writes once. A button without a confirmation writes at once. A
   * stale token is refused with the code `confirm_expired` (see
   * isConfirmExpired). The token belongs to this connection, so a press of
   * the same button elsewhere neither arms nor confirms it.
   */
  press(key: string, confirmToken?: string): Promise<PressResult | undefined> {
    const entity_id = this.reader.entityId(key);
    if (!entity_id) return Promise.resolve(undefined);
    return this.hass.callWS<PressResult>({
      type: `${PLATFORM}/press_button`,
      entity_id,
      ...(confirmToken ? { confirm_token: confirmToken } : {}),
    });
  }

  /**
   * False only when Home Assistant says the signed-in user is no
   * administrator. An unknown user (an older frontend without `hass.user`)
   * counts as allowed: the server decides, and its refusal is mapped by
   * isUnauthorized.
   */
  get isAdmin(): boolean {
    return this.hass.user?.is_admin !== false;
  }

  /** True when the integration registered this service (set_wifi). */
  hasService(service: string): boolean {
    return !!this.hass.services?.[PLATFORM]?.[service];
  }

  /**
   * Send Wi-Fi credentials to this battery's communication module.
   *
   * Through the integration's websocket command, not the service: Home
   * Assistant records every service call with its data, password included,
   * in its database, and a websocket command is not recorded. The password
   * is not kept by the panel, not logged, and not part of any URL.
   */
  setWifi(ssid: string, password: string) {
    return this.hass.callWS({
      type: `${PLATFORM}/set_wifi`,
      device_id: this.reader.deviceId,
      ssid,
      password,
    });
  }

  /**
   * The warning of a press that needs confirming, in the user's language
   * where the integration's translation is reachable, otherwise the text
   * the server sent in its own language.
   */
  async warningText(result: PressResult): Promise<string> {
    if (result.translation_domain && result.translation_key) {
      const localize = await this.exceptionTexts(result.translation_domain);
      const text = localize?.(
        `component.${result.translation_domain}.exceptions.${result.translation_key}.message`,
        result.translation_placeholders,
      );
      if (text) return text;
    }
    return result.warning ?? "";
  }

  /**
   * The text of a refused call, in the user's language where the raising
   * integration's translation is reachable (this one's, or Home Assistant's
   * own - a number refusing a value out of range), otherwise the server's
   * message without Home Assistant's "Validation error:" prefix.
   */
  async errorText(err: unknown): Promise<string> {
    const e = (err ?? {}) as HassCallError;
    if (e.translation_domain && e.translation_key) {
      const localize = await this.exceptionTexts(e.translation_domain);
      const text = localize?.(
        `component.${e.translation_domain}.exceptions.${e.translation_key}.message`,
        e.translation_placeholders,
      );
      if (text) return text;
    }
    const message = e.message ?? String(err);
    return message.startsWith(VALIDATION_PREFIX) ? message.slice(VALIDATION_PREFIX.length) : message;
  }

  private exceptionTexts(domain: string): Promise<LocalizeFunc | null> {
    const id = `${this.hass.language || "en"}/${domain}`;
    let texts = DeviceControls.exceptions.get(id);
    if (!texts) {
      const load = this.hass.loadBackendTranslation;
      texts = load
        ? load.call(this.hass, "exceptions", domain).catch(() => null)
        : Promise.resolve(null);
      DeviceControls.exceptions.set(id, texts);
    }
    return texts;
  }
}

/**
 * True when Home Assistant refused a command because the user is no
 * administrator (websocket error code `unauthorized`, raised by the
 * admin-only decorator of press_button and set_wifi).
 */
export function isUnauthorized(err: unknown): boolean {
  return (err as HassCallError | undefined)?.code === "unauthorized";
}

/** True when a confirming press was refused because its token had run out. */
export function isConfirmExpired(err: unknown): boolean {
  return (err as HassCallError | undefined)?.code === "confirm_expired";
}
