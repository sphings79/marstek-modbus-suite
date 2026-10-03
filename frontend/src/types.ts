/**
 * The slice of the Home Assistant frontend object this panel actually uses.
 *
 * Home Assistant does not publish types for custom panels, so this is a hand
 * written subset rather than an import. Keep it minimal: every field here is a
 * promise about someone else's API.
 */

export interface HassEntityAttributes {
  friendly_name?: string;
  unit_of_measurement?: string;
  device_class?: string;
  state_class?: string;
  [key: string]: unknown;
}

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: HassEntityAttributes;
  last_changed: string;
  last_updated: string;
}

/**
 * Registry entry as the frontend sees it. `translation_key` is what makes this
 * panel independent of naming: it carries the register key the integration
 * assigned, no matter what the entity or its area ended up being called.
 */
export interface EntityRegistryDisplayEntry {
  entity_id: string;
  device_id?: string;
  area_id?: string;
  platform?: string;
  translation_key?: string;
  entity_category?: string;
  hidden?: boolean;
}

export interface DeviceRegistryEntry {
  id: string;
  name?: string | null;
  name_by_user?: string | null;
  manufacturer?: string | null;
  model?: string | null;
}

/**
 * What a refused service call or websocket command rejects with. A
 * `ServiceValidationError` raised by the integration arrives with code
 * "service_validation_error", its translation key and placeholders, and a
 * message already translated into the server's language (prefixed with
 * "Validation error: " for service calls).
 */
export interface HassCallError {
  code?: string;
  message?: string;
  translation_domain?: string;
  translation_key?: string;
  translation_placeholders?: Record<string, string>;
}

/**
 * The answer of the integration's press_button command. `needs_confirm`
 * comes with the warning (translation key and placeholders, plus the text in
 * the server's language), a one-time token and the window in seconds.
 */
export interface PressResult {
  needs_confirm: boolean;
  written?: boolean;
  token?: string;
  expires_in?: number;
  warning?: string;
  translation_domain?: string;
  translation_key?: string;
  translation_placeholders?: Record<string, string>;
}

export type LocalizeFunc = (key: string, values?: Record<string, unknown>) => string;

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  entities: Record<string, EntityRegistryDisplayEntry>;
  devices: Record<string, DeviceRegistryEntry>;
  /** Registered services by domain; only the presence of a name is used. */
  services?: Record<string, Record<string, unknown>>;
  language: string;
  /** The signed-in user; `is_admin` decides whether the maintenance commands may be used. */
  user?: { is_admin?: boolean };
  themes: { darkMode: boolean };
  callWS<T>(msg: Record<string, unknown>): Promise<T>;
  /**
   * The frontend shows its own toast for a refused call unless
   * `notifyOnError` is false - which the panel passes wherever it reports the
   * refusal itself.
   */
  callService(
    domain: string,
    service: string,
    data?: Record<string, unknown>,
    target?: Record<string, unknown>,
    notifyOnError?: boolean,
  ): Promise<unknown>;
  /**
   * Translations of a backend category, here the integration's exception
   * texts in the user's own language. Optional: older frontends lack it, and
   * the server's message stands in.
   */
  loadBackendTranslation?(category: string, integration?: string): Promise<LocalizeFunc>;
}
