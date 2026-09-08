/**
 * What the user has chosen about the panel itself, as opposed to the battery.
 *
 * Two stores, because the settings answer two different questions.
 *
 * The ones about taste - colours, which tab opens, what is hidden - live in
 * Home Assistant under the viewer's own user id, so a phone and a laptop show
 * the same panel to the same person and nobody else's choices move.
 *
 * The ones about the screen in front of you - scale and width - stay in
 * `localStorage`. A 4K monitor, a laptop and a phone want different answers,
 * and syncing them would mean the last device used wins on all of them. They
 * are left out of the export box for the same reason.
 */

import { DEFAULT_SCHEME, schemeById } from "./palettes";
import type { HomeAssistant } from "./types";

export type ThemeMode = "auto" | "dark" | "light";

export interface PanelSettings {
  /** Colour scheme id from `palettes.ts`. */
  scheme: string;
  /** Whether to follow Home Assistant's light/dark or override it. */
  mode: ThemeMode;
  /** Tab to open on, or "last" to resume where the panel was left. */
  startTab: string;
  /** Tabs the user has hidden. Tabs the battery cannot fill hide themselves. */
  hiddenTabs: string[];
  /** One decimal place more than each view asks for. */
  extraDigits: boolean;
}

/**
 * What the panel looks like on this screen. Per browser, never exported.
 */
export interface LocalSettings {
  /** Percent. Applied as a zoom, so spacing grows with the type. */
  fontScale: number;
  /** Content width in real screen pixels, or "full" for no limit. */
  maxWidth: number | "full";
}

export const FONT_SCALE_MIN = 90;
export const FONT_SCALE_MAX = 150;
export const FONT_SCALE_STEP = 5;

export const WIDTH_MIN = 1200;
export const WIDTH_STEP = 20;

export const DEFAULT_LOCAL: LocalSettings = {
  fontScale: 100,
  maxWidth: "full",
};

export const DEFAULT_SETTINGS: PanelSettings = {
  scheme: DEFAULT_SCHEME,
  mode: "auto",
  startTab: "last",
  hiddenTabs: [],
  extraDigits: false,
};

const STORAGE_KEY = "marstek-panel.settings";
const LOCAL_KEY = "marstek-panel.local";

/** Websocket commands the integration serves for the shared settings. */
const WS_GET = "marstek_modbus/settings/get";
const WS_SET = "marstek_modbus/settings/set";

/**
 * Read the stored settings, field by field.
 *
 * Anything unrecognised falls back to its default rather than failing the
 * whole load: a scheme removed in a later version should cost the user their
 * colour choice, not every other setting they made.
 */
export function loadSettings(): PanelSettings {
  try {
    const text = localStorage.getItem(STORAGE_KEY);
    if (!text) return { ...DEFAULT_SETTINGS };
    return parseSettings(JSON.parse(text));
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

/**
 * Turn anything into a valid settings object, field by field.
 *
 * Shared by the stored value and by whatever someone pastes into the import
 * box, so a hand-edited file cannot put the panel into a state the settings
 * view has no control for.
 */
export function parseSettings(stored: unknown): PanelSettings {
  if (!stored || typeof stored !== "object") return { ...DEFAULT_SETTINGS };
  const raw = stored as Record<string, unknown>;

  return {
    scheme:
      typeof raw.scheme === "string" && schemeById(raw.scheme).id === raw.scheme
        ? raw.scheme
        : DEFAULT_SETTINGS.scheme,
    mode:
      raw.mode === "dark" || raw.mode === "light" || raw.mode === "auto"
        ? raw.mode
        : DEFAULT_SETTINGS.mode,
    startTab: typeof raw.startTab === "string" ? raw.startTab : DEFAULT_SETTINGS.startTab,
    hiddenTabs: Array.isArray(raw.hiddenTabs)
      ? raw.hiddenTabs.filter((id): id is string => typeof id === "string")
      : [],
    extraDigits: raw.extraDigits === true,
  };
}

/** The settings as text, for the export box. */
export function exportSettings(settings: PanelSettings): string {
  return JSON.stringify(settings, null, 2);
}

/**
 * Read a pasted settings object. Returns null when the text is not JSON at
 * all - a typo should say so rather than silently resetting everything to
 * defaults, which is what parseSettings alone would do.
 */
export function importSettings(text: string): PanelSettings | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
  return parseSettings(parsed);
}

export function saveSettings(settings: PanelSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Private windows and blocked site data throw here. The choice still
    // applies for this session; it just will not survive a reload.
  }
}

export function clearSettings(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // See above.
  }
}

/* ------------------------------------------------------------------ *
 * The screen in front of you: scale and width, per browser.
 * ------------------------------------------------------------------ */

/** Round to the nearest step and hold inside the range. */
function snap(value: number, min: number, max: number, step: number): number {
  const stepped = Math.round(value / step) * step;
  return Math.min(max, Math.max(min, stepped));
}

export function parseLocal(stored: unknown): LocalSettings {
  if (!stored || typeof stored !== "object") return { ...DEFAULT_LOCAL };
  const raw = stored as Record<string, unknown>;

  const width = raw.maxWidth;
  return {
    fontScale:
      typeof raw.fontScale === "number" && Number.isFinite(raw.fontScale)
        ? snap(raw.fontScale, FONT_SCALE_MIN, FONT_SCALE_MAX, FONT_SCALE_STEP)
        : DEFAULT_LOCAL.fontScale,
    maxWidth:
      typeof width === "number" && Number.isFinite(width) && width >= WIDTH_MIN
        ? Math.round(width / WIDTH_STEP) * WIDTH_STEP
        : "full",
  };
}

export function loadLocal(): LocalSettings {
  try {
    const text = localStorage.getItem(LOCAL_KEY);
    if (!text) return { ...DEFAULT_LOCAL };
    return parseLocal(JSON.parse(text));
  } catch {
    return { ...DEFAULT_LOCAL };
  }
}

export function saveLocal(local: LocalSettings): void {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(local));
  } catch {
    // Private windows and blocked site data throw here.
  }
}

export function clearLocal(): void {
  try {
    localStorage.removeItem(LOCAL_KEY);
  } catch {
    // See above.
  }
}

/* ------------------------------------------------------------------ *
 * Taste: stored in Home Assistant, under the viewer's own user id.
 * ------------------------------------------------------------------ */

/**
 * Read the shared settings.
 *
 * Returns null when the integration does not answer - an older version, or a
 * connection that dropped. The caller shows the defaults and says so, rather
 * than quietly falling back to this browser's old copy: two stores that
 * disagree are worse than one that is plainly empty.
 */
export async function loadShared(hass: HomeAssistant): Promise<PanelSettings | null> {
  try {
    const stored = await hass.callWS<Record<string, unknown>>({ type: WS_GET });
    // An empty answer is a user who has never saved anything. Everything this
    // browser already had is theirs, so it goes up as their starting point
    // rather than being thrown away.
    if (!stored || Object.keys(stored).length === 0) {
      const legacy = readLegacy();
      if (legacy) {
        await saveShared(hass, legacy);
        return legacy;
      }
      return { ...DEFAULT_SETTINGS };
    }
    return parseSettings(stored);
  } catch {
    return null;
  }
}

export async function saveShared(
  hass: HomeAssistant,
  settings: PanelSettings,
): Promise<void> {
  try {
    await hass.callWS({ type: WS_SET, settings });
  } catch {
    // The choice still applies for this session; it just will not survive a
    // reload. The settings view reports the store being unreachable.
  }
}

/**
 * The settings this browser stored before they moved into Home Assistant.
 *
 * Read once, on the first load that finds nothing on the server. The old key
 * is deliberately left in place: if the migration goes wrong, the values the
 * user picked are still there to look at.
 */
function readLegacy(): PanelSettings | null {
  try {
    const text = localStorage.getItem(STORAGE_KEY);
    if (!text) return null;
    return parseSettings(JSON.parse(text));
  } catch {
    return null;
  }
}
