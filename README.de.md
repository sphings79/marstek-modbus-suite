<div align="center">

<img src="assets/banner.svg" alt="Marstek Modbus Suite — Home-Assistant-Integration für Marstek-Venus-Speicher über lokales Modbus TCP" width="100%">

# Marstek Modbus Suite

### Dein Marstek Venus, ausgelesen und gesteuert über lokales Modbus TCP — mit eigenem Dashboard.

[![Release](https://img.shields.io/github/v/release/sphings79/marstek-modbus-suite?include_prereleases&style=for-the-badge&color=2ae6dc&labelColor=0b131d)](https://github.com/sphings79/marstek-modbus-suite/releases)
[![HACS](https://img.shields.io/badge/HACS-eigenes%20Repository-2ae6dc?style=for-the-badge&labelColor=0b131d)](https://hacs.xyz/)
[![Home Assistant](https://img.shields.io/badge/Home%20Assistant-2025.9%2B-2ae6dc?style=for-the-badge&labelColor=0b131d)](https://www.home-assistant.io/)
[![Lizenz](https://img.shields.io/github/license/sphings79/marstek-modbus-suite?style=for-the-badge&color=2ae6dc&labelColor=0b131d)](LICENSE)

**Kein Marstek-Konto · Keine Cloud · Kein MQTT-Broker · Kein YAML**

🇩🇪 Deutsch · 🇬🇧 English · 🇳🇱 Nederlands — [English version of this page](README.md)

</div>

<div align="center">

|  |  |  |
|:--|:--|:--|
| 🔌 **Nur lokal** | ein TCP-Socket, nichts verlässt das Haus | |
| 📊 **Eigenes Panel** | sieben Reiter, keine Custom Cards nötig | |
| 🎛️ **Schreibt, nicht nur liest** | Leistung, Grenzwerte, Modi, sechs Zeitpläne | |
| 🔬 **Je Pack, je Zelle** | 112 Zellspannungen auf einer gemeinsamen Achse | |
| 🎨 **Sieben Farbschemata** | hell und dunkel, deine Wahl | |
| 🌍 **Drei Sprachen** | und es folgt Home Assistant | |

</div>

---

## Das Panel

Die Integration bringt ihre eigene Seite mit. Sie erscheint in der Seitenleiste, sobald ein
Speicher eingerichtet ist, und braucht keine installierten Custom Cards — jedes Element darin
gehört zur Integration.

### Übersicht

<div align="center">
<img src="assets/ui-overview.svg" alt="Übersicht: Ladezustand als Doppelring, elektrische Messwerte, Reserve und Lebensdauer sowie sechs Kacheln für Tagesenergie, Zelldelta, Temperatur, MPPT und Wirkungsgrad" width="100%">
</div>

Der äußere Ring ist die Meldung des BMS, der innere das, was oberhalb der Entladegrenze nutzbar
ist — der Abstand zwischen beiden **ist** die Reserve, gezeigt statt beschrieben.

Zwei der vier Felder darunter folgen der Flussrichtung: beim Laden steht dort, was noch hineinpasst
und wie lange es bis voll dauert, beim Entladen, was noch herauskommt und wie lange bis leer. Immer
nur eine der beiden Laufzeiten zählt, und ein fester Platz zeigte die Hälfte der Zeit einen
stehenden Countdown.

### Zellen

<div align="center">
<img src="assets/ui-cells.svg" alt="Zellen: Zellspannungsbereich jedes Packs auf einer gemeinsamen Achse, wobei Pack 3 sichtbar breiter ist als die anderen" width="100%">
</div>

Der Zellbereich jedes Packs auf **einer gemeinsamen Achse**. Der Speicher meldet ein Delta je Pack,
aber nie eines über den ganzen Stapel — ein Pack, das in sich auseinanderläuft, ist in den Zahlen
eine unter vielen und hier sofort erkennbar. Es ist der Balken, der breit geworden ist.

Die Spreizung **über** den Stapel steht bewusst ohne Bewertung da: Das Gerät arbeitet ein Pack nach
dem anderen, also stehen die Packs auf verschiedenen Niveaus und ihre Zellen folgen. Das sagt nichts
über die Zellgesundheit. Das Delta **innerhalb** eines Packs schon.

### Packs

<div align="center">
<img src="assets/ui-packs.svg" alt="Packs: Ladezustand je Pack als Säulen mit kWh-Angabe, Entladegrenze und Notstromgrenze eingezeichnet, das arbeitende Pack markiert" width="100%">
</div>

Ladezustand je Pack auf gemeinsamer Skala, mit zwei eingezeichneten Linien: der Entladegrenze und
darunter der Grenze, die die **Notstromsteckdose** bei einem Ausfall erreicht. Das in Akzentfarbe
markierte Pack ist das, das gerade Strom führt — das Gerät arbeitet eines nach dem anderen.

### Steuerung

<div align="center">
<img src="assets/ui-control.svg" alt="Steuerung: Lade- und Entladeleistung, Grenzwerte, Benutzer- und erzwungener Modus, Notstrom- und RS485-Schalter sowie die sechs Zeitpläne mit Zeiten, Leistung und Tag" width="100%">
</div>

Lade- und Entladeleistung, die Grenzwerte, Benutzer- und erzwungener Modus, die Schalter für
Notstrom und RS485 — und alle sechs Zeitpläne mit Zeiten, Leistung, Tag und An/Aus.

Jeder Regler liest seine Grenzen aus der Entität, statt sie fest zu verdrahten. Derselbe Editor ist
damit auf einem **1500-W**-Venus-A genauso richtig wie auf einem **2500-W**-Venus-D. Zeiten werden
zwischen dem HHMM der Register und einem Uhrzeitfeld umgerechnet.

> [!NOTE]
> Was den Speicher von außen regelt — eine Nulleinspeisungs-Automation, ein Energiemanager —
> schreibt dieselben Register und gewinnt innerhalb von Sekunden. Passiert das direkt nach einer
> Eingabe, sagt der Reiter das, statt kaputt auszusehen.

### Einstellungen

<div align="center">
<img src="assets/ui-settings.svg" alt="Einstellungen: sieben Farbschemata als Kacheln in ihren eigenen Farben, Hell/Dunkel-Wahl, Nachkommastellen, Startreiter und Auswahl der sichtbaren Reiter" width="100%">
</div>

Sieben Farbschemata, jedes mit eigener heller und dunkler Fassung — darunter eines, das die Farben
deines Home-Assistant-Themes übernimmt. Dazu Hell/Dunkel-Vorgabe, Startreiter, Ausblenden einzelner
Reiter, eine zusätzliche Nachkommastelle und Import/Export, um alles in einen anderen Browser zu
tragen.

Reiter, die dein Speicher nicht füllen kann, stehen ausgegraut mit Begründung in der Liste — so
bleibt ein selbst ausgeblendeter Reiter von einem unterscheidbar, den es nie gab.

---

## Sprachen

| | Einrichtung und Optionen | Entitätsnamen | Das Panel |
|---|:---:|:---:|:---:|
| 🇩🇪 **Deutsch** | ✅ | ✅ | ✅ |
| 🇬🇧 **English** | ✅ | ✅ | ✅ |
| 🇳🇱 **Nederlands** | ✅ | ✅ | fällt auf Englisch zurück |

Alle drei folgen der Sprache, auf die Home Assistant eingestellt ist — nichts zu konfigurieren. Die
Entitätsnamen kommen aus dem Übersetzungssystem von Home Assistant, und genau deshalb findet das
Panel seine Werte über das **Register** hinter einer Entität statt über ihren Namen: Gerät
umbenennen, in einen anderen Bereich verschieben, Sprache wechseln — das Panel arbeitet weiter.

Eine weitere Sprache ist ein Pull Request mit einer Datei.
`custom_components/marstek_modbus/translations/` enthält die Entitätsnamen,
`frontend/src/locales/` den eigenen Text des Panels.

---

## Was dein Modell kann

Nicht jede Venus hat dieselbe Hardware. Eine Venus E hat einen fest eingebauten Speicher, der sich
nicht erweitern lässt, und keine Solareingänge; A und D nehmen bis zu sechs beziehungsweise sieben
Packs auf und haben MPPT. Das Panel blendet Reiter aus, für die ein Modell keine Daten hat, und die
Entitätsliste folgt denselben Grenzen.

### Messwerte

| | Venus A | Venus D | Venus E v1/v2 | Venus E v3 |
|---|:---:|:---:|:---:|:---:|
| Ladezustand, Leistung, Spannung, Strom | ✅ | ✅ | ✅ | ✅ |
| AC-Seite: Leistung, Spannung, Frequenz | ✅ | ✅ | ✅ | ✅ |
| Notstromausgang | ✅ | ✅ | ✅ | ✅ |
| Energiezähler: Tag, Monat, gesamt | ✅ | ✅ | ✅ | ✅ |
| Roundtrip- und Umwandlungswirkungsgrad | ✅ | ✅ | ✅ | ✅ |
| Nutzbare Energie, Energie bis voll, Laufzeit | ✅ | ✅ | ✅ | ✅ |
| **Notstromreserve** — Energie, an die nur die Notstromsteckdose kommt | ✅ | ✅ | ❌ | ❌ |
| Verbleibende Zyklen und Batteriezustand | ✅ | ✅ | ✅ | ✅ |
| Innen- und Zelltemperaturen | ✅ | ✅ | ✅ | ✅ |
| Firmware-Versionen, Netzwerkdiagnose | ✅ | ✅ | ✅ | ✅ |
| Stör- und Alarmregister | ✅ | ✅ | ✅ | ❌ |
| **Solareingänge (MPPT)** | ✅ | ✅ | ❌ | ❌ |
| **Zellspannungen je Pack** | ✅ | ✅ | ❌ | ❌ |
| **Ladezustand je Pack** | ✅ | ✅ | ❌ | ❌ |
| **Temperaturen und Zyklen je Pack** | ✅ | ✅ | ❌ | ❌ |
| **Schutzflags je Pack** | ✅ | ✅ | ❌ | ❌ |
| **Welches Pack gerade Strom führt** | ✅ | ✅ | ❌ | ❌ |
| Batteriepacks | bis zu 6 | bis zu 7 | 1, fest verbaut | 1, fest verbaut |

### Steuerung

| | Venus A | Venus D | Venus E v1/v2 | Venus E v3 |
|---|:---:|:---:|:---:|:---:|
| Lade- und Entladeleistung | ✅ | ✅ | ✅ | ✅ |
| Leistungsgrenzen | 1500 W | 2500 W | 2500 W | 2500 W |
| Ladeziel (SoC-Obergrenze) | ✅ | ✅ | ✅ | ✅ |
| Betriebsmodus, erzwungener Modus | ✅ | ✅ | ✅ | ✅ |
| Sechs Zeitpläne mit Tagesauswahl | ✅ | ✅ | ✅ | ✅ |
| Notstrommodus | ✅ | ✅ | ✅ | ✅ |
| RS485-Steuermodus | ✅ | ✅ | ✅ | ✅ |
| Gerät neu starten | ✅ | ✅ | ✅ | ✅ |
| Netzstandard | ❌ | ❌ | ✅ | ❌ |

Alles in dieser Tabelle lässt sich sowohl im Reiter **Steuerung** als auch in der Entitätsliste
ändern.

### Panel-Reiter

| | Venus A | Venus D | Venus E v1/v2 | Venus E v3 |
|---|:---:|:---:|:---:|:---:|
| Übersicht | ✅ | ✅ | ✅ | ✅ |
| Zellen | ✅ | ✅ | ❌ | ❌ |
| Packs | ✅ | ✅ | ❌ | ❌ |
| Solar | ✅ | ✅ | ❌ | ❌ |
| Energie | ✅ | ✅ | ✅ | ✅ |
| **Steuerung** | ✅ | ✅ | ✅ | ✅ |
| System | ✅ | ✅ | ✅ | ✅ |
| **Einstellungen** (das Zahnrad) | ✅ | ✅ | ✅ | ✅ |

Ein Reiter erscheint nur, wenn der Speicher etwas hineinzustellen hat, und lässt sich in den
Einstellungen von Hand ausblenden — dort stehen die, die dein Modell nicht füllen kann, ausgegraut
mit Begründung.

> [!IMPORTANT]
> Venus **A**, **D** und **E v3** teilen eine Firmware-Basis. Venus **E v1/v2** baut auf einer
> **völlig anderen** auf — ein Registerfund aus A-/D-/E3-Firmware sagt nichts über E v1/v2, wo eine
> übereinstimmende Registernummer Zufall ist, solange sie nicht dort bestätigt wurde.

---

## Warum Modbus

Bluetooth erreicht den Speicher von einem Telefon aus, eines nach dem anderen. Die Cloud erreicht
ihn von überall, aber nur so weit, wie Marsteks App es zulässt, und nur solange deren Dienst läuft.
Modbus ist die Schnittstelle, die immer da ist, in Millisekunden antwortet und von Wechselrichtern,
SPSen und Energiemanagern gleichermaßen gelesen wird — Home Assistant sieht also **dieselben Zahlen
aus derselben Quelle** wie alles andere in deiner Anlage.

<div align="center">
<img src="assets/architecture.svg" alt="Die Integration öffnet eine Modbus-TCP-Verbindung zu einem Gateway am RS485-Port des Speichers oder direkt zum Speicher, wo dieser selbst Modbus TCP spricht" width="100%">
</div>

---

## Voraussetzungen

- Eine **Modbus-RTU-zu-TCP-Bridge** am RS485-Port des Speichers
  - oder eine **Ethernet-Verbindung** direkt zu einem Speicher, der selbst Modbus TCP spricht
- **IP-Adresse**, **Port** (meist 502) und **Unit ID** (auch Slave ID) dieser Bridge
- Home Assistant **2025.9** oder neuer
- HACS, für die bequeme Installation

### Getestete Gateways

| Gateway | Anmerkung |
|---|---|
| Elfin EW11 | WLAN auf RS485 |
| PUSR DR134 | Modbus-Gateway |
| Waveshare RS485 auf RJ45 | Ethernet-Wandler |
| M5Stack RS485 + Atom S3 Lite | RS485-Modul mit Atom S3 Lite |
| Venus A / D / E v3 über Ethernet | Kein Adapter nötig |

---

## Installation

1. Dieses Repository in HACS unter **Integrationen → Benutzerdefinierte Repositories** hinzufügen
   (Kategorie: Integration)
2. **Marstek Modbus Suite** installieren
3. Home Assistant neu starten
4. Integration über **Einstellungen → Geräte & Dienste** hinzufügen

<div align="center">
<img src="assets/setup.de.svg" alt="Home-Assistant-Konfigurationsdialog: IP-Adresse, Port, Unit ID und Geräteversion des Marstek-Venus-Speichers" width="70%">
</div>

Trage die Adresse deines Modbus-TCP-Gateways ein, den Port (Standard 502), die Unit ID (Standard 1,
gültig 1–255) und die Geräteversion — `A`, `D`, `E v1/v2` oder `E v3`. Die Geräteversion wählt die
Registerkarte aus und muss deshalb zur tatsächlichen Hardware passen.

Im zweiten Schritt vergibst du den **Gerätenamen**, vorbelegt passend zur gewählten Geräteversion.
Der Name benennt nicht nur das Gerät, sondern steckt auch in jeder Entity-ID
(`sensor.marstek_venus_e_soc_batterie`). Er greift nur einmal: Ein späteres Umbenennen ändert den
Anzeigenamen, nicht die Entity-IDs. Zwei Speicher brauchen zwei verschiedene Namen — die
Integration weist einen bereits vergebenen zurück.

### Umstieg von Marstek Venus Modbus

Diese Integration ist ein Fork von
[ViperRNMC/marstek_venus_modbus](https://github.com/ViperRNMC/marstek_venus_modbus) und liegt im
selben Ordner `custom_components/marstek_modbus`. Beide lassen sich deshalb nicht parallel
installieren, das alte Repository muss vorher aus HACS entfernt werden. Für die Entitäten gibt es
zwei Wege:

- **Config-Eintrag stehen lassen** (empfohlen): Nur das HACS-Repository tauschen und den Eintrag
  unter *Geräte & Dienste* nicht löschen. Dann ändert sich nichts — Gerätename, Entity-IDs und
  Verlauf bleiben, weil die Entitäten an der unveränderten Eintrags-ID hängen. Diese Integration
  kennt jeden Registerschlüssel der alten, es kommen nur welche dazu.
- **Eintrag doch gelöscht**: Beim Neuanlegen im zweiten Schritt den Namen eintragen, den der alte
  Eintrag hatte — standardmäßig `Marstek Venus Modbus`. Beide Integrationen verwenden dieselben
  Entitätsnamen, deshalb entstehen exakt dieselben Entity-IDs wie vorher und Dashboards sowie
  Automationen laufen unverändert weiter.

> Die Bilder in diesem README sind Illustrationen, keine Fotos einer laufenden Instanz.

---

## Entitäten

<div align="center">
<img src="assets/entities.svg" alt="Geräteseite in Home Assistant mit den Sensoren, die die Integration Marstek Modbus Suite anlegt" width="70%">
</div>

Alles landet auf einem Gerät. **Jede Entität, die das Panel liest, ist standardmäßig aktiv** — das
Panel ist damit vollständig, sobald die Integration eingerichtet ist, ohne dass du etwas von Hand
einschalten musst. Deaktiviert bleibt, wonach keine Ansicht fragt: Register ohne geklärte Bedeutung,
Werte, die ein anderer Sensor bereits liefert, und Diagnosen für Fälle, die dich nichts angehen. Wer
die trotzdem will, aktiviert sie in der Entitätsliste.

Über die reinen Register hinaus leitet die Integration einige Werte ab, die das Gerät selbst nicht
meldet:

| Entität | Bedeutung |
|---|---|
| `usable_energy` | was oberhalb der Entladegrenze liegt |
| `energy_to_full` | was bis zur Ladeobergrenze fehlt |
| `runtime_to_empty` / `runtime_to_full` | Stunden bei aktueller Leistung, jeweils nur in ihrer Richtung |
| `remaining_cycles`, `battery_health` | Verschleiß gegen die Zyklenangabe der Zellen |
| `backup_reserve_energy` | was unter der Grenze liegt und nur über die Notstromsteckdose erreichbar ist (A und D) |
| `stored_energy`, `round_trip_efficiency_*` | Energie im Speicher, Wirkungsgrad über drei Zeitebenen |

---

## Konfiguration

### Verbindung

Unter **Optionen → Verbindungseinstellungen**: IP-Adresse, Port und Unit ID des Gateways sowie die
**Wartezeit zwischen Nachrichten** (Standard 80 ms).

Diese Wartezeit gilt für jede Anfrage, ein höherer Wert verlängert also jeden Abfragezyklus
entsprechend: Bei 300 ms dauert ein Zyklus mit 50 Anfragen 15 Sekunden, bei 80 ms vier. Erhöhe sie
nur, wenn ein Gateway beim Standardwert Antworten verliert, und senke sie wieder, sobald die
Verbindung stabil läuft.

### Energiefenster

Unter **Optionen → Energiefenster**: die **Entladegrenze** in Prozent, Standard 12.

Venus A, D und E v3 geben die Entladegrenze nicht über Modbus heraus — was du in der Marstek-App
eingestellt hast, lässt sich also nicht zurücklesen und wird hier eingetragen. Die Einstellung gilt
je Speicher, zwei können sich also unterscheiden. Die obere Grenze liest die Integration aus dem
Gerät, sofern es sie meldet.

Daran messen `usable_energy`, `energy_to_full` und beide Laufzeit-Sensoren, und das Panel zeichnet
sie als Linie quer über die Pack-Säulen.

### Abfrageintervalle

| Klasse | Standard | Umfasst |
|---|---|---|
| **Hohe Priorität** | 10 s | Schnell veränderliche Werte — Leistung, Spannung, Strom, SoC, Zustände |
| **Niedrige Priorität** | 60 s | Träge Werte — Zählerstände, Diagnose, Firmware, Geräteangaben |

Benachbarte fällige Register werden nach Möglichkeit zu einem Blockzugriff zusammengefasst;
scheitert dieser, fallen die betroffenen Entitäten auf Einzelabfragen zurück. Deaktivierte
Entitäten werden übersprungen — außer ein berechneter Sensor hängt an ihnen, dann werden sie
trotzdem abgefragt.

---

## Was lokal bleibt

Die Integration spricht mit deinem Gateway und mit sonst nichts. Kein Marstek-Konto, keine
Telemetrie, keine ausgehende Verbindung außer dem einen TCP-Socket zu der Adresse, die du
konfiguriert hast.

---

## Bekannte Probleme

- **Benutzer-Arbeitsmodus (AI Optimized) wird nicht korrekt zurückgemeldet**
  Wird `User Work Mode` auf `2 (Trade Mode)` gesetzt, erscheint der neue Zustand unter Umständen
  nicht. Die Marstek-App zeigt den richtigen Modus, Home Assistant weiterhin den vorherigen — wegen
  einer Abweichung in der Antwort des Modbus-Registers. Das liegt an der Firmware.

- **Der Speicher verschwindet alle 30 Minuten aus dem Netz**
  Ein paar Sekunden ohne Modbus und ohne Ping, in festem Rhythmus. Das ist die Firmware des Geräts,
  die ihren Netzwerkchip zurücksetzt, wenn sie Marsteks Cloud nicht erreicht — nicht diese
  Integration und nicht dein Netzwerk. Von hier aus lässt es sich nicht verhindern, nur schnell
  überstehen, und genau das tut die Integration seit 1.2.0. Mechanismus und Abhilfe:
  **[FIRMWARE-DROPOUTS.de.md](FIRMWARE-DROPOUTS.de.md)**.

---

## Häufige Fragen

**Brauche ich ein Gateway, oder kann der Speicher selbst Modbus TCP?**
Venus A, D und E v3 lassen sich direkt per Ethernet anschließen und sprechen Modbus TCP ohne
Adapter. Für alles andere brauchst du eine RS485-auf-TCP-Bridge am RS485-Port.

**Kann ich das parallel zu einem anderen Modbus-Client betreiben?**
Die meisten Gateways bedienen einen TCP-Client zur Zeit. Hält bereits ein Wechselrichter oder
Energiemanager die Verbindung, nimm entweder ein Gateway, das multiplext, oder lies den Speicher
über jenes System aus.

**Warum zeigt meine Venus E weniger Reiter?**
Weil sie weniger Sensoren hat. Eine Venus E hat einen fest eingebauten Speicher und keine
MPPT-Eingänge — Zellen, Packs und Solar wären leere Räume. Sie werden ausgeblendet statt leer
angezeigt.

**Kann ich mehrere Speicher nutzen?**
Ja. Lege jeden als eigenen Integrationseintrag an; das Panel bekommt dann eine Auswahl und merkt
sich, welchen du zuletzt angesehen hast. Eine Summenansicht über mehrere Speicher gibt es noch
nicht.

**Funktioniert das zusammen mit venuscontrol?**
Ja, beides ergänzt sich: [venuscontrol](https://github.com/sphings79/venuscontrol) konfiguriert den
Speicher über Bluetooth — unter anderem lassen sich dort die Schnittstellen einschalten, die diese
Integration anschließend über Modbus liest.

**Wird meine Venus E v1/v2 vollständig unterstützt?**
Sie ist definiert, aber dieses Modell läuft auf einer anderen Firmware-Basis, und die
Registerforschung hier stammt von A-/D-/E3-Hardware. Behandle Funde zu E v1/v2 als unbestätigt.

---

## Verwandte Projekte

- 🖥️ **[venuscontrol](https://github.com/sphings79/venuscontrol)** — cloudfreies
  Web-Bluetooth-Bedienpanel für Venus A / D, inklusive OTA-Firmware-Updates
- 📦 **[Marstek-Firmware-Archiv](https://github.com/sphings79/marstek-firmware-archiv)**
- 🛰️ **[Marstek Offline Endpoint](https://github.com/sphings79/Marstek-offline-endpoint)** —
  beantwortet den Telemetrie-Upload lokal, wodurch die 30-Minuten-Aussetzer verschwinden und die
  Daten im Haus bleiben
- 🔬 **[Reverse Engineering der Venus-D-Firmware](https://github.com/sphings79/Marstek-Venus-D-Firmware-Reverse-Engineering)**
- 🌐 **[Weitere Projekte und Tools](https://sphings-dev.de/)**

## Dank

- Upstream-Integration: **[ViperRNMC/marstek_venus_modbus](https://github.com/ViperRNMC/marstek_venus_modbus)**
