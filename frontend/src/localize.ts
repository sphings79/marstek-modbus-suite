/**
 * Panel translations.
 *
 * English is bundled because it is the fallback for every missing key. The
 * other languages are separate chunks loaded on demand, so a German install
 * never downloads the Polish catalogue.
 */

import { en } from "./locales/en";

export type Strings = Record<string, string>;

/** Languages with their own catalogue, beyond the bundled English. */
const LOADERS: Record<string, () => Promise<Strings>> = {
  de: () => import("./locales/de").then((m) => m.de),
};

export const AVAILABLE_LANGUAGES = ["en", ...Object.keys(LOADERS)].sort();

const loaded: Record<string, Strings> = { en };

/** Reduce "de-CH" to "de"; Home Assistant hands out regional codes. */
function base(language: string): string {
  return (language || "en").split("-")[0].toLowerCase();
}

/**
 * Fetch a catalogue, falling back to English when the language is unknown or
 * its chunk fails to load.
 */
export async function loadCatalogue(language: string): Promise<Strings> {
  const code = base(language);
  if (loaded[code]) return loaded[code];

  const loader = LOADERS[code];
  if (!loader) return en;

  try {
    loaded[code] = await loader();
    return loaded[code];
  } catch {
    return en;
  }
}

/**
 * Look up a key, falling back to English and finally to the key itself, so a
 * missing translation shows something identifiable rather than nothing.
 *
 * Placeholders are written as {name} and replaced from `values`.
 */
export function translate(
  catalogue: Strings,
  key: string,
  values?: Record<string, string | number>,
): string {
  let text = catalogue[key] ?? en[key] ?? key;
  if (values) {
    for (const [name, value] of Object.entries(values)) {
      text = text.replace(`{${name}}`, String(value));
    }
  }
  return text;
}
