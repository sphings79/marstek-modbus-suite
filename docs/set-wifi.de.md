# WLAN-Zugangsdaten setzen: `marstek_modbus.set_wifi`

**English: [set-wifi.md](set-wifi.md)**

Der Dienst `marstek_modbus.set_wifi` schreibt den WLAN-Namen (SSID) und das Passwort über die
Modbus-Register 41500–41631 in das Kommunikationsmodul einer **Venus D**, **Venus A** oder **Venus E
v3**. Er ist für den Fall gedacht, dass die Batterie in ein anderes Netz wechseln muss und du das
nicht über Bluetooth erledigen willst. Die Venus E v3 nutzt denselben Control-Code und dasselbe
Image des Kommunikationsmoduls wie die Venus D, es gelten also dieselbe Abfolge und dieselben
Grenzen. Die Venus E v1/v2 ist nicht abgedeckt: Sie ist eine andere Firmware-Familie.

> **Warnung.** Die Firmware legt die Zugangsdaten in einem EEPROM-Bereich (0x420–0x45F) ab, der sich
> mit der Adresse 0x441 überschneidet. Das ist ein Firmware-Fehler. Ein falscher oder abgebrochener
> Schreibvorgang kann das Modul mit falschen Zugangsdaten zurücklassen. Den Dienst nur verwenden,
> wenn die Batterie auf anderem Weg erreichbar ist, über die Marstek-App oder ein Kabel, um das zu
> korrigieren.

## Einschalten

Der Dienst ist aus, bis du für die Batterie **Optionen → DEV-Register → DEV-Register
anzeigen** einschaltest, dieselbe Option, die auch die DEV-Tasten lädt. Ohne sie wird der Aufruf mit
einer Meldung abgelehnt und nichts geschrieben. Eine pausierte Batterie (Modbus-Geräteabfrage) wird
ebenfalls abgelehnt: Schreiben würde die Verbindung wieder öffnen.

## Aufrufen

Über das Panel (Reiter **System → Wartung → WLAN**, angezeigt für Venus D, A und E v3, nur für
Administratoren; es prüft vor dem Senden dieselben Regeln, zielt auf den im Panel gewählten Speicher
und leert das Passwortfeld nach jedem Versuch), über **Entwicklerwerkzeuge → Aktionen** oder per YAML.
Das Panel ruft nicht den Dienst auf: Es schickt den eigenen Websocket-Befehl der Integration
`marstek_modbus/set_wifi`, der genau dieselben Prüfungen und dieselbe Schreibfolge ausführt, aber nicht
aufgezeichnet wird (siehe [Das Passwort bleibt geheim](#das-passwort-bleibt-geheim)). Dienstaufruf per
YAML:

```yaml
action: marstek_modbus.set_wifi
target:
  device_id: <the battery's device id>
data:
  ssid: "MyNetwork"
  password: "my-wifi-password"
```

Ist genau eine Venus D, A oder E v3 eingerichtet, kann das Ziel entfallen. Bei mehreren die Batterie
wählen. `password` weglassen für ein offenes Netz.

## Was vor dem Schreiben geprüft wird

| Feld | Regel |
|---|---|
| `ssid` | 1 bis 31 druckbare ASCII-Zeichen, ohne `,` und `"` |
| `password` | leer (offenes Netz) oder 8 bis 31 druckbare ASCII-Zeichen, ohne `,` und `"` (ein 32. Zeichen würde Register 41616 benutzen, siehe Warnung) |

Das Modul bekommt beides in einem unquotierten AT-Befehl, deshalb werden Komma und Anführungszeichen
abgelehnt. Wird eine Regel verletzt, schlägt der Aufruf mit einer übersetzten Meldung fehl, und es
wurde kein Register berührt.

## Was auf dem Gerät passiert

- Ein Register enthält je zwei Zeichen, das erste im High-Byte: 41500–41515 für die SSID,
  41600–41631 für das Passwort. Ein Text endet dort, wo ein 0x00-Byte es sagt; die Puffer werden
  vorher nicht gelöscht.
- Zuerst wird die SSID geschrieben, dann das Passwort. Die SSID allein übernimmt nichts: Erst das
  Schreiben des letzten Passwort-Registers, des Registers mit dem Terminator, übergibt beides an das
  Modul.
- Das Passwort wird genau bis einschließlich dieses Terminator-Registers geschrieben, danach folgt
  kein Null-Auffüllen, weil jedes weitere Null-Register eine zweite Übernahme auslösen würde.
- Während das Modul die Zugangsdaten übernimmt, bricht die WLAN-, Cloud- und App-Verbindung ab.
  Modbus über Ethernet und RS485 bleibt unberührt. Bei falschen Zugangsdaten bleibt die Verbindung
  weg, bis das Modul auf die in der Steuereinheit gespeicherten Zugangsdaten zurückfällt; die
  falschen hat das Modul dann bereits in seinem eigenen Flash gespeichert.
- Schlägt ein Schreibvorgang fehl, hält der Aufruf an diesem Register an und nennt es. Ein Fehler vor
  dem letzten Passwort-Register lässt alles, wie es war; schlägt das letzte Register selbst fehl, ist
  unklar, ob das Modul die Zugangsdaten übernommen hat. Das WLAN der Batterie prüfen und erneut
  aufrufen.

## Das Passwort bleibt geheim

- Die Passwort-Register lesen immer 0, und die Integration liest sie nie zurück.
- Das Passwort wird nie protokolliert, auch nicht auf Debug-Stufe, und das Rohdaten-Protokoll der
  Modbus-Bibliothek ist für diese Anfragen stummgeschaltet. Es landet in keinem Zustand, keinem
  Attribut und keiner Fehlermeldung.
- **Das Panel hält das Passwort aus dem Recorder heraus.** Es schickt die Zugangsdaten über den
  Websocket-Befehl `marstek_modbus/set_wifi`, nicht über einen Dienstaufruf, und Home Assistant
  zeichnet Websocket-Befehle nicht auf. Das Passwort steht dann in keinem Ereignis, keinem Zustand und
  keiner Protokollzeile (außer du schaltest Debug-Logging für
  `homeassistant.components.websocket_api` ein, das jede eingehende Websocket-Nachricht protokolliert).
- **Der Dienst zeichnet es im Klartext auf.** Ein Dienstaufruf trägt das Passwort, und Home Assistant
  schreibt jedes `call_service`-Ereignis mit seinen Daten in die Recorder-Datenbank (und damit in
  Backups). Das gilt für jeden Aufrufweg des Dienstes: Entwicklerwerkzeuge, Skripte, Automationen und
  YAML. Die Entwicklerwerkzeuge verbergen das Passwort also nicht, und ein Skript oder eine
  Automation, die den Dienst aufruft, zeigt es auch in ihrer Ablaufverfolgung. Das Passwort nicht in
  einer Automation oder einem Skript ablegen. Das Panel benutzen oder, wenn der Dienst nötig ist, den
  Ereignistyp vor der Benutzung ausschließen, zum Beispiel
  `recorder: exclude: event_types: [call_service]` in der `configuration.yaml` (Neustart nötig), und
  das WLAN-Passwort danach noch einmal ändern, falls es schon aufgezeichnet wurde.
- `wifi_ssid` (Venus D, standardmäßig deaktiviert) liest den eingestellten Netzwerknamen zurück. Er
  landet in der Recorder-Datenbank und in Backups, deshalb ist er standardmäßig aus.
