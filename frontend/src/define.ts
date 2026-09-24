/**
 * Registering the panel's elements, and noticing a newer bundle.
 *
 * Home Assistant loads the panel as `marstek-modbus-panel.js?v=<version>`.
 * After an update the page often stays open - the iOS app in particular just
 * reconnects - and the frontend loads the panel again under the new URL. To
 * the browser that is a different module, so the whole bundle runs a second
 * time in the same window, and every `customElements.define` throws because
 * the first run already took the names.
 *
 * The decorator here skips a name that is already registered, so the second
 * run is quiet. The instance on screen keeps running the old code, so the
 * newer bundle also announces itself, and the panel offers a reload.
 */

/** The version in this bundle's own URL; empty in a build without one. */
export const BUNDLE_VERSION = new URL(import.meta.url).searchParams.get("v") ?? "";

/** Fired on window when a bundle with a different version has been loaded. */
export const BUNDLE_LOADED_EVENT = "marstek-modbus-bundle-loaded";

const LATEST_KEY = "__marstekModbusLatestBundle";

type BundleGlobals = { [LATEST_KEY]?: string };
const globals = window as unknown as BundleGlobals;

const previous = globals[LATEST_KEY];
globals[LATEST_KEY] = BUNDLE_VERSION;
if (previous !== undefined && previous !== BUNDLE_VERSION) {
  window.dispatchEvent(new CustomEvent(BUNDLE_LOADED_EVENT, { detail: BUNDLE_VERSION }));
}

/** The newest bundle version loaded into this window so far. */
export function latestBundleVersion(): string {
  return globals[LATEST_KEY] ?? BUNDLE_VERSION;
}

/** Like Lit's `@customElement`, but a name that is already taken is left alone. */
export function customElement(name: string) {
  return (element: CustomElementConstructor) => {
    if (!customElements.get(name)) customElements.define(name, element);
  };
}
