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

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  entities: Record<string, EntityRegistryDisplayEntry>;
  devices: Record<string, DeviceRegistryEntry>;
  language: string;
  themes: { darkMode: boolean };
  callWS<T>(msg: Record<string, unknown>): Promise<T>;
}
