/**
 * The colour schemes the panel can wear.
 *
 * Every palette fills the same nineteen tokens twice, once for a dark ground
 * and once for a light one, because a neon accent that sings on near-black
 * turns into an illegible pastel on white. They are hand-tuned rather than
 * derived: taking a dark palette and lightening it algorithmically produces
 * mud, and this panel is supposed to look deliberate.
 *
 * `reactor` is the design the panel was drawn in and is also what `styles.ts`
 * hard-codes, so it is the one scheme that costs nothing to apply - the panel
 * simply leaves the stylesheet alone.
 */

/** The tokens a palette has to fill. Order is documentation, not enforced. */
export interface Palette {
  bg: string;
  surface: string;
  "surface-2": string;
  inset: string;
  line: string;
  "line-soft": string;
  fg: string;
  "fg-2": string;
  dim: string;
  accent: string;
  "accent-deep": string;
  "accent-wash": string;
  magenta: string;
  "magenta-wash": string;
  ok: string;
  warn: string;
  crit: string;
  track: string;
  "on-accent": string;
}

export interface Scheme {
  id: string;
  /** Shown as-is; these are names, not sentences, so they are not translated. */
  name: string;
  dark: Palette;
  /** Absent when the scheme has no ground of its own - see `ha`. */
  light?: Palette;
}

export const SCHEMES: Scheme[] = [
  {
    id: "reactor",
    name: "Reactor",
    dark: {
      bg: "#05090f",
      surface: "#0b131d",
      "surface-2": "#101b28",
      inset: "#0d1723",
      line: "#1b2b3d",
      "line-soft": "#152435",
      fg: "#dff2f6",
      "fg-2": "#9fb8c6",
      dim: "#5d7d92",
      accent: "#2ae6dc",
      "accent-deep": "#1b8fd6",
      "accent-wash": "#0e2b30",
      magenta: "#ff3ea5",
      "magenta-wash": "#2a0d1e",
      ok: "#35d67a",
      warn: "#ffb020",
      crit: "#ff4d5e",
      track: "#132434",
      "on-accent": "#04141a",
    },
    light: {
      bg: "#eef2f6",
      surface: "#ffffff",
      "surface-2": "#f6f9fb",
      inset: "#e8eef3",
      line: "#cbd8e2",
      "line-soft": "#dfe7ee",
      fg: "#0c1a24",
      "fg-2": "#3a5162",
      dim: "#5b7484",
      accent: "#0c847e",
      "accent-deep": "#0f5f8c",
      "accent-wash": "#d9f0ee",
      magenta: "#b4176e",
      "magenta-wash": "#fbe4f0",
      ok: "#0f7a44",
      warn: "#8a5804",
      crit: "#b52436",
      track: "#dae3ea",
      "on-accent": "#ffffff",
    },
  },

  {
    id: "cockpit",
    name: "Cockpit",
    dark: {
      bg: "#0a0704",
      surface: "#14100a",
      "surface-2": "#1c1710",
      inset: "#17120b",
      line: "#35291a",
      "line-soft": "#281f14",
      fg: "#f5e8d2",
      "fg-2": "#c4ac8a",
      dim: "#8a7355",
      accent: "#ffb020",
      "accent-deep": "#d2690c",
      "accent-wash": "#33220a",
      magenta: "#ff5f3a",
      "magenta-wash": "#331309",
      ok: "#9ecb3a",
      warn: "#ffd54a",
      crit: "#ff4a3d",
      track: "#241c11",
      "on-accent": "#1a1000",
    },
    light: {
      bg: "#f5f0e6",
      surface: "#fffdf8",
      "surface-2": "#faf5ea",
      inset: "#efe7d6",
      line: "#d9cdb4",
      "line-soft": "#e8dfcc",
      fg: "#201705",
      "fg-2": "#5b4a2d",
      dim: "#7d6a48",
      accent: "#a35c00",
      "accent-deep": "#7c3d05",
      "accent-wash": "#f6e6c8",
      magenta: "#b53a17",
      "magenta-wash": "#fadfd6",
      ok: "#4d6b12",
      warn: "#8a5804",
      crit: "#b02a20",
      track: "#e3d8c2",
      "on-accent": "#fffdf8",
    },
  },

  {
    id: "verdant",
    name: "Verdant",
    dark: {
      bg: "#040b07",
      surface: "#0a150f",
      "surface-2": "#0f1d16",
      inset: "#0c1811",
      line: "#1c3226",
      "line-soft": "#152920",
      fg: "#ddf5e5",
      "fg-2": "#9cc0ab",
      dim: "#5d8570",
      accent: "#7ee787",
      "accent-deep": "#26a269",
      "accent-wash": "#0f2b1c",
      magenta: "#3ddbd9",
      "magenta-wash": "#0a2a2c",
      ok: "#7ee787",
      warn: "#ffc94a",
      crit: "#ff5f6d",
      track: "#12281c",
      "on-accent": "#04140a",
    },
    light: {
      bg: "#eef4ef",
      surface: "#ffffff",
      "surface-2": "#f5faf6",
      inset: "#e6efe8",
      line: "#c7d9cc",
      "line-soft": "#dbe8de",
      fg: "#0a1a10",
      "fg-2": "#385643",
      dim: "#5a7864",
      accent: "#1a7f4b",
      "accent-deep": "#115e37",
      "accent-wash": "#d7f0e0",
      magenta: "#0d7d7b",
      "magenta-wash": "#d4f0ef",
      ok: "#1a7f4b",
      warn: "#8a5804",
      crit: "#b52436",
      track: "#d9e5db",
      "on-accent": "#ffffff",
    },
  },

  {
    id: "plasma",
    name: "Plasma",
    dark: {
      bg: "#07050f",
      surface: "#110d1e",
      "surface-2": "#191330",
      inset: "#140f26",
      line: "#2c2350",
      "line-soft": "#211a3e",
      fg: "#eae4ff",
      "fg-2": "#b3a8d8",
      dim: "#7568a8",
      accent: "#a06bff",
      "accent-deep": "#5b3ed6",
      "accent-wash": "#22164a",
      magenta: "#ff5bc8",
      "magenta-wash": "#2e0f2a",
      ok: "#4ddba0",
      warn: "#ffc046",
      crit: "#ff5470",
      track: "#1c1638",
      "on-accent": "#0b0618",
    },
    light: {
      bg: "#f1eef8",
      surface: "#ffffff",
      "surface-2": "#f8f5fd",
      inset: "#ebe6f6",
      line: "#d2c8e8",
      "line-soft": "#e2dbf1",
      fg: "#150c28",
      "fg-2": "#47395f",
      dim: "#6b5c88",
      accent: "#6b2fd0",
      "accent-deep": "#4a1aa8",
      "accent-wash": "#e7dbfb",
      magenta: "#b81f86",
      "magenta-wash": "#fbdcf0",
      ok: "#0f7a52",
      warn: "#8a5804",
      crit: "#b52440",
      track: "#e0d8f0",
      "on-accent": "#ffffff",
    },
  },

  {
    id: "ember",
    name: "Ember",
    dark: {
      bg: "#0a0605",
      surface: "#150e0b",
      "surface-2": "#1e1511",
      inset: "#191110",
      line: "#38231b",
      "line-soft": "#2a1a15",
      fg: "#f7e6dd",
      "fg-2": "#c7a696",
      dim: "#8d6a5c",
      accent: "#ff6b3d",
      "accent-deep": "#c22f1e",
      "accent-wash": "#331408",
      magenta: "#ffc247",
      "magenta-wash": "#2e2209",
      ok: "#58c98a",
      warn: "#ffc247",
      crit: "#ff3b30",
      track: "#251712",
      "on-accent": "#190802",
    },
    light: {
      bg: "#f6f0ec",
      surface: "#ffffff",
      "surface-2": "#fbf5f1",
      inset: "#efe4dd",
      line: "#ddc9bd",
      "line-soft": "#ebdcd3",
      fg: "#22110a",
      "fg-2": "#5e4235",
      dim: "#7f6153",
      accent: "#c1401b",
      "accent-deep": "#922b12",
      "accent-wash": "#fadfd3",
      magenta: "#8a6206",
      "magenta-wash": "#f7e9c9",
      ok: "#0f7a44",
      warn: "#8a5804",
      crit: "#b52436",
      track: "#e6d6cb",
      "on-accent": "#ffffff",
    },
  },

  {
    id: "glacier",
    name: "Glacier",
    dark: {
      bg: "#060a10",
      surface: "#0d141d",
      "surface-2": "#131d29",
      inset: "#101825",
      line: "#223549",
      "line-soft": "#1a2b3c",
      fg: "#e4eef8",
      "fg-2": "#a6bccf",
      dim: "#67839c",
      accent: "#63b3ff",
      "accent-deep": "#2f6fd0",
      "accent-wash": "#112a45",
      magenta: "#9fd8e8",
      "magenta-wash": "#10262e",
      ok: "#4fd1a5",
      warn: "#ffcb5c",
      crit: "#ff6b7d",
      track: "#16232f",
      "on-accent": "#04101d",
    },
    light: {
      bg: "#eef2f7",
      surface: "#ffffff",
      "surface-2": "#f6f9fc",
      inset: "#e7edf4",
      line: "#c8d5e3",
      "line-soft": "#dde5ee",
      fg: "#0b1622",
      "fg-2": "#3c5064",
      dim: "#5f7488",
      accent: "#1462b8",
      "accent-deep": "#0c4383",
      "accent-wash": "#d9e9fb",
      magenta: "#2a7f96",
      "magenta-wash": "#d6eef4",
      ok: "#0f7a52",
      warn: "#8a5804",
      crit: "#b52440",
      track: "#dbe4ee",
      "on-accent": "#ffffff",
    },
  },

  {
    /**
     * Not a palette of its own: every token points at the variable Home
     * Assistant's active theme sets, with the Reactor value as the fallback for
     * themes that leave one undefined. There is no light variant because the
     * theme already decides that - which also means the panel's own light/dark
     * setting has no effect while this scheme is selected.
     */
    id: "ha",
    name: "Home Assistant",
    dark: {
      bg: "var(--primary-background-color, #05090f)",
      surface: "var(--card-background-color, #0b131d)",
      "surface-2": "var(--secondary-background-color, #101b28)",
      inset: "var(--secondary-background-color, #0d1723)",
      line: "var(--divider-color, #1b2b3d)",
      "line-soft": "var(--divider-color, #152435)",
      fg: "var(--primary-text-color, #dff2f6)",
      "fg-2": "var(--secondary-text-color, #9fb8c6)",
      dim: "var(--secondary-text-color, #5d7d92)",
      accent: "var(--primary-color, #2ae6dc)",
      "accent-deep": "var(--dark-primary-color, #1b8fd6)",
      "accent-wash": "var(--secondary-background-color, #0e2b30)",
      magenta: "var(--accent-color, #ff3ea5)",
      "magenta-wash": "var(--secondary-background-color, #2a0d1e)",
      ok: "var(--success-color, #35d67a)",
      warn: "var(--warning-color, #ffb020)",
      crit: "var(--error-color, #ff4d5e)",
      track: "var(--divider-color, #132434)",
      "on-accent": "var(--text-primary-color, #04141a)",
    },
  },
];

export const DEFAULT_SCHEME = "reactor";

export function schemeById(id: string): Scheme {
  return SCHEMES.find((s) => s.id === id) ?? SCHEMES[0];
}

/** True while the scheme takes its colours from Home Assistant's theme. */
export function followsHaTheme(id: string): boolean {
  return !schemeById(id).light;
}

/**
 * Push a scheme onto an element as inline custom properties.
 *
 * Inline styles beat the `:host` rule in `styles.ts`, so applying a scheme is
 * a plain overwrite and returning to Reactor is a removal - no extra selector,
 * no specificity contest. Everything below the host inherits, which is why the
 * tokens are declared in exactly one place to begin with.
 */
export function applyScheme(host: HTMLElement, id: string, light: boolean): void {
  const scheme = schemeById(id);
  const palette = (light && scheme.light) || scheme.dark;
  const useCss = scheme.id === DEFAULT_SCHEME;

  for (const [token, value] of Object.entries(palette)) {
    const name = `--mk-${token}`;
    if (useCss) host.style.removeProperty(name);
    else host.style.setProperty(name, value);
  }
}
