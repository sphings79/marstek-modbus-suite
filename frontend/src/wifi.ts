/**
 * The rules of the set_wifi service, checked before anything is sent.
 *
 * They mirror `encode_wifi_credentials` in the integration's services.py, in
 * the same order, so the panel refuses exactly what the server would refuse
 * and names the same rule: the SSID 1 to 31 characters, the password empty
 * (open network) or 8 to 31, both printable ASCII without a comma or a double
 * quote, the two characters the module's unquoted AT command cannot carry.
 *
 * Kept free of imports so it can be exercised on its own.
 */

export const WIFI_SSID_MAX = 31;
export const WIFI_PASSWORD_MIN = 8;
export const WIFI_PASSWORD_MAX = 31;

export interface WifiProblem {
  /** Panel catalogue key of the message. */
  key: string;
  values?: Record<string, number>;
}

function validText(text: string): boolean {
  for (const char of text) {
    const code = char.codePointAt(0) ?? 0;
    if (code < 0x20 || code > 0x7e || char === "," || char === '"') return false;
  }
  return true;
}

/** The first rule the credentials break, or null when they pass. */
export function checkWifi(ssid: string, password: string): WifiProblem | null {
  // Counted in characters, as the server counts them, not in UTF-16 units.
  const ssidLength = [...ssid].length;
  const passwordLength = [...password].length;

  if (ssidLength < 1 || ssidLength > WIFI_SSID_MAX) {
    return { key: "wifi.err.ssid_length", values: { max: WIFI_SSID_MAX } };
  }
  if (!validText(ssid)) return { key: "wifi.err.ssid_chars" };
  if (password && (passwordLength < WIFI_PASSWORD_MIN || passwordLength > WIFI_PASSWORD_MAX)) {
    return {
      key: "wifi.err.password_length",
      values: { min: WIFI_PASSWORD_MIN, max: WIFI_PASSWORD_MAX },
    };
  }
  if (!validText(password)) return { key: "wifi.err.password_chars" };
  return null;
}
