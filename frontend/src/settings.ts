/**
 * What the user has chosen about the panel itself, as opposed to the battery.
 *
 * This lives in `localStorage`, which means it is per browser: the same person
 * on a laptop and a phone gets two independent sets. That is the trade for not
 * adding a backend store, and the settings view says so.
 */

import { DEFAULT_SCHEME, schemeById } from "./palettes";

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

export const DEFAULT_SETTINGS: PanelSettings = {
  scheme: DEFAULT_SCHEME,
  mode: "auto",
  startTab: "last",
  hiddenTabs: [],
  extraDigits: false,
};

const STORAGE_KEY = "marstek-panel.settings";

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
