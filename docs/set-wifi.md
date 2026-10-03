# Setting the Wi-Fi credentials: `marstek_modbus.set_wifi`

**Deutsch: [set-wifi.de.md](set-wifi.de.md)**

The service `marstek_modbus.set_wifi` writes the Wi-Fi network name (SSID) and the password to the
communication module of a **Venus D**, **Venus A** or **Venus E v3**, through the Modbus registers
41500–41631. It is for the case where the battery has to join another network and you would rather
not do that over Bluetooth. The Venus E v3 runs the same control code and the same communication
module image as the Venus D, so the same sequence and the same limits apply. The Venus E v1/v2 is
not covered: it is a different firmware family.

> **Warning.** The firmware stores the credentials in an EEPROM area (0x420–0x45F) that overlaps
> address 0x441. That is a firmware bug. A wrong or an aborted write can leave the module with wrong
> credentials. Use the service only when the battery is reachable another way, the Marstek app or a
> cable, to correct it.

## Turn it on

The service is off until you turn on **Options → DEV registers → Show DEV registers** for the
battery, the same option that loads the DEV buttons. Without it the call is refused with a message
and nothing is written. A paused battery (Modbus device polling) is refused too: writing would
reopen the connection.

## Call it

From the panel (tab **System → Maintenance → Wi-Fi**, shown for the Venus D, A and E v3, admin users
only; it checks the same rules before sending, targets the battery selected in the panel and empties
the password field after every attempt), from **Developer tools → Actions**, or from YAML. The panel
does not call the service: it sends the integration's own websocket command `marstek_modbus/set_wifi`,
which runs exactly the same checks and the same write sequence, but is not recorded (see
[The password stays secret](#the-password-stays-secret)). Service call from YAML:

```yaml
action: marstek_modbus.set_wifi
target:
  device_id: <the battery's device id>
data:
  ssid: "MyNetwork"
  password: "my-wifi-password"
```

With exactly one Venus D, A or E v3 set up, the target can be left out. With several, choose the battery.
Leave `password` out for an open network.

## What is checked before anything is written

| Field | Rule |
|---|---|
| `ssid` | 1 to 31 printable ASCII characters, without `,` and `"` |
| `password` | empty (open network) or 8 to 31 printable ASCII characters, without `,` and `"` (a 32nd character would use register 41616, see the warning) |

The module receives both in one unquoted AT command, which is why the comma and the double quote
are refused. If a rule is broken, the call fails with a translated message and no register has been
touched.

## What happens on the device

- Registers hold two characters each, the first in the high byte: 41500–41515 for the SSID,
  41600–41631 for the password. A string ends where a 0x00 byte says so; the buffers are not cleared
  first.
- The SSID is written first, then the password. Nothing is applied by the SSID alone: the write of
  the password's last register, the one that holds the terminator, hands both to the module.
- The password is written exactly up to and including that terminator register, and no zero padding
  follows it, because every further zero register would trigger a second takeover.
- While the module takes the credentials over, the Wi-Fi, cloud and app connection drops. Modbus over
  Ethernet and RS485 is not affected. With wrong credentials the connection stays down until the
  module falls back to the credentials stored in the control unit; the module has by then already
  stored the wrong ones in its own flash.
- If a write fails, the call stops at that register and says which one. A failure before the last
  password register leaves everything as it was; if the last register itself fails, it is unknown
  whether the module took the credentials over. Check the battery's Wi-Fi and call again.

## The password stays secret

- The password registers always read 0, and the integration never reads them back.
- The password is never logged, not even at debug level, and the raw frame log of the Modbus library is
  muted for those requests. It is not put into a state, an attribute or an error message.
- **The panel keeps the password out of the recorder.** It sends the credentials through the websocket
  command `marstek_modbus/set_wifi`, not through a service call, and Home Assistant does not record
  websocket commands. The password is then in no event, no state and no log line (unless you turn on
  debug logging for `homeassistant.components.websocket_api`, which logs every incoming websocket
  message).
- **The service records it in clear text.** A service call carries the password, and Home Assistant
  writes every `call_service` event, with its data, into the recorder database (and therefore into
  backups). This happens for every way of calling the service: Developer tools, scripts, automations
  and YAML. Developer tools are therefore not a safe way to hide the password, and a script or
  automation that calls the service also shows it in its trace. Do not store the password in an
  automation or script. Use the panel, or, if you need the service, exclude the event type before
  using it, for example `recorder: exclude: event_types: [call_service]` in `configuration.yaml`
  (restart required), and change the Wi-Fi password again afterwards if it was already recorded.
- `wifi_ssid` (Venus D, disabled by default) reads the configured network name back. It is shown in
  the recorder database and in backups, which is why it is off by default.
