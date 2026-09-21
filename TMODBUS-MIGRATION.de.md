# Was eine verspätete Modbus-Antwort kostet, und was ein Wechsel der Client-Bibliothek daran ändert

**English: [TMODBUS-MIGRATION.md](TMODBUS-MIGRATION.md)**

Das hier ist eine Messauswertung. Es gibt sie, weil die Frage „soll diese
Integration von pymodbus auf tmodbus wechseln?" immer wieder aus dem Bauch
beantwortet wurde — von uns selbst zweimal, und beide Male anders. Unten steht,
was drei Probe-Läufe gegen einen Marstek Venus D tatsächlich gezeigt haben und
worin sich die beiden Client-Bibliotheken in dem einen Fall unterscheiden, in
dem es zählt.

Die Entscheidung ist inzwischen gefallen: die Integration läuft auf tmodbus.
Was hier steht, ist die Begründung dafür, nicht mehr die Abwägung davor — der
Abschnitt, der einen Umbau vorausgeplant hat, ist mit dem Umbau weggefallen.

Wer eine Modbus-Integration für ein Gerät betreut, das unter Last pausiert,
sollte daraus entscheiden können, ob dieselbe Überlegung auch für ihn gilt.
Womöglich nicht — siehe [Wo das nicht verallgemeinerbar ist](#wo-das-nicht-verallgemeinerbar-ist).

## Die Kurzfassung

Diese Batterie hört alle fünfundachtzig Sekunden für rund viereinhalb Sekunden
auf zu antworten, während ihre Firmware Telemetrie über TLS hochlädt. Das ist
kein Fehlerfall, sondern das, was das Gerät tut, wenn alles funktioniert.

Ein Client, dessen Timeout kürzer ist als die Pause, gibt auf — und die Antwort
kommt ein, zwei Sekunden später trotzdem, ohne dass noch jemand auf sie wartet.
Wohin diese Antwort geht, entscheidet die Client-Bibliothek:

* **tmodbus** ordnet Antworten über die Transaction-ID den offenen Anfragen zu.
  Eine Antwort ohne passende Anfrage wird protokolliert und verworfen, und die
  gerade laufende Anfrage bekommt ihre eigene.
* **pymodbus** sendet auf demselben Socket neu und behält die Transaction-ID.
  Die späte Antwort fällt deshalb beim ID-Check derjenigen Anfrage durch, die
  gerade läuft, und reißt sie mit.

Mit pymodbus bleibt nur ein Timeout, das länger ist als die längste Pause des
Geräts. Hier heißt das zehn Sekunden — und selbst die haben einmal nicht
gereicht. Zehn Sekunden schließen jede Regelung aus, die schnell reagieren muss;
eine Nulleinspeisung zum Beispiel. Mit tmodbus ist ein kurzes Timeout
unbedenklich: die pausierte Anfrage scheitert, und sonst nichts.

Das ist das ganze Argument. Alles Weitere ist der Beleg dafür.

## Die Messungen

Dafür wurde ein Probe-Skript geschrieben. Es liest dieselben Registerblöcke wie
die Integration, in denselben Gruppen, mit demselben Frame-Abstand, aber ohne
Retry-Leiter und ohne Register-Backoff — damit nicht verdeckt wird, was der erste
Versuch gesehen hat. Jeder Read wird nach der ausgelösten Exception einsortiert
und als CSV-Zeile geschrieben. Es läuft auf dem tmodbus-Backend, weil tmodbus die
Fehlerarten auseinanderhalten kann; pymodbus meldet eine korrupte und eine
ausbleibende Antwort als denselben Timeout.

Alle drei Läufe gegen einen Venus D, Control-Firmware v150, sieben Packs,
Ethernet.

### Lauf 2 und 3 — gleiches Gerät, gleiche Last, zwei Timeouts

Diese beiden sind ein kontrolliertes Paar: gleicher Proxy, gleiche drei Clients,
gleicher Telemetriezustand. **Der einzige Unterschied ist das Client-Timeout.**
Sie kommen zuerst, weil der Vergleich der Kern ist.

| | Lauf 2, Timeout 3 s | Lauf 3, Timeout 10 s |
|---|---|---|
| Dauer | 8,8 min | 14,9 min |
| Reads | 1400 | 2322 |
| aufgetretene Stalls | 6 | 9 |
| Rate | 0,68 / min | 0,60 / min |
| Kosten je Stall | **1 Timeout + 1 späte Antwort**, 6 von 6 | 1 langsamer Read, der gelingt, 8 von 9 |
| Median Lesedauer | 0,300 s | 0,300 s |

Das zugrunde liegende Ereignis ist in beiden dasselbe, und es ist periodisch:

```
Lauf 2, Abstände zwischen den Timeouts       86,3  89,0  83,9  84,8  85,0 s   Mittel 85,8
Lauf 3, Abstände zwischen den langsamen Reads 85,3  84,9  85,2  85,2  84,8 s   Mittel 85,1
```

In Lauf 3, wo der Client gewartet hat, dauerten acht dieser Reads **3,91, 4,40,
4,48, 4,50, 4,53, 4,55, 4,62 und 4,64 Sekunden** — und jeder einzelne gelang. In
Lauf 2, wo er bei drei Sekunden aufgab, wurde aus jedem Stall stattdessen ein
Fehlschlag plus eine verwaiste Antwort. Der neunte Stall in Lauf 3 ist der, der
über zehn Sekunden lief, siehe unten.

Die sechs Verwaisten aus Lauf 2 wurden aus dem Log dekodiert und gegen die
jeweils gerade aufgegebene Anfrage geprüft. Transaction-ID **und** Registerzahl
stimmen in allen sechs Fällen überein:

```
tid 46    30 Register  ← Timeout auf 43100-43129 (30)   landete in 44002-44003, ok in 1,939 s
tid 272    1 Register  ← Timeout auf 30303      (1)     landete in 32100,       ok in 1,635 s
tid 505    1 Register  ← Timeout auf 30001      (1)     landete in 30006,       ok in 1,301 s
tid 724    1 Register  ← Timeout auf 32100      (1)     landete in 32104-32105, ok in 1,641 s
tid 937    8 Register  ← Timeout auf 30020-30027 (8)    landete in 30037-30040, ok in 2,145 s
tid 1150  10 Register  ← Timeout auf 43100-43109 (10)   landete in 44002-44003, ok in 1,682 s
```

Jede davon traf mitten in einen unbeteiligten Read, und jeder dieser Reads gelang
trotzdem — langsam, weil zuerst ein fremder Frame auf dem Socket lag, aber
korrekt. Genau dieser letzte Halbsatz ist der ganze Unterschied zwischen den
beiden Bibliotheken. pymodbus hätte diese sechs Reads ebenfalls scheitern lassen:
aus sechs Fehlern wären zwölf geworden.

Lauf 3 hat außerdem gezeigt, dass ein höheres Timeout keine Lösung ist, sondern
nur eine längere Lunte:

```
01:11:29   32204   Timeout nach 10,083 s
01:11:30   34002   die Antwort trifft ein, Transaction-ID 505, und wird verworfen
```

Ein Stall hat auch zehn Sekunden überschritten. Und ein Abstand in Lauf 3 betrug
169,7 s, exakt das Doppelte des Takts — ein ausgelassener Upload, das erste
Anzeichen dafür, dass der Rückstau abgebaut wird.

### Woher die Pause kommt

Firmware v150 schickt ihre Telemetrie über TLS, und der Schlüsselaustausch kostet
diesen MCU rund vier Sekunden, in denen er nicht mehr auf Modbus antwortet. Der
Mechanismus ist in [FIRMWARE-DROPOUTS.de.md](FIRMWARE-DROPOUTS.de.md) aus einem
Dekompilat der Firmware beschrieben. Der hier gemessene 85-Sekunden-Takt ist
schneller als die dort dokumentierten rund fünf Minuten, weil die Batterie
Telemetrie abgearbeitet hat, die sie gepuffert hatte, während ihr Endpoint nicht
erreichbar war.

Diese Zuordnung ist eine Ableitung, kein Mitschnitt: periodisch auf eine halbe
Sekunde genau, rund vier Sekunden lang, trat auf, als der Telemetrie-Endpoint
erreichbar war, und nicht, als er es nicht war — und passt auf einen
dokumentierten Mechanismus.

### Lauf 1 — direkt an der Batterie, Telemetrie-Endpoint nicht erreichbar

Zwei Stunden, 24958 Reads, kein Proxy, kein weiterer Client, und die Batterie
ohne Gegenstelle für ihren Upload.

```
ok             24935   99,91 %
timeout           20    0,08 %
connection         3    0,01 %

desync             0
protocol           0
späte Antworten    0
```

Ein völlig anderes Fehlerbild. Drei Ausfälle von 16,5 s, 16,7 s und 24,6 s,
**1804 und 1824 Sekunden auseinander** — die Firmware setzt ihren Netzwerkchip
nach 1800 Sekunden zurück, wenn ihr Telemetrie-Rückstau nicht abfließt. Das ist
der zweite Mechanismus aus FIRMWARE-DROPOUTS, hier gemessen statt dekompiliert.
Verfügbarkeit über die zwei Stunden: 99,197 %.

Keine späten Antworten, und es konnte auch keine geben: während eines Chip-Resets
ist das Gerät vollständig weg und der Socket stirbt, es bleibt also nichts übrig,
was verspätet antworten könnte. Außerhalb der Ausfälle war die Verbindung sauber
— Median 0,150 s, p99 0,183 s, in zwei Stunden kein einziger Read über einer
Sekunde.

**Für sich genommen spricht dieser Lauf dagegen, irgendetwas zu ändern** — und
genau das war unser Schluss daraus, bevor die anderen beiden liefen. Er
unterscheidet sich von Lauf 2 und 3 allerdings in zwei Punkten gleichzeitig, kein
Proxy *und* keine Telemetrie: allein daraus lässt sich nichts zuordnen.

### Was der Proxy beiträgt, und warum er nicht der Schuldige ist

Es läge nahe, den Proxy verantwortlich zu machen, also wurde er gemessen.
`modbus-proxy` 1.1.0 als Home-Assistant-Add-on hält **eine** Upstream-Verbindung
und multiplext alle Clients darauf. Mit seinem Log auf DEBUG bekommt jede Anfrage
und jede Antwort auf beiden Seiten einen Zeitstempel, was „wartet im Proxy" von
„wartet auf das Gerät" trennt:

```
Wartezeit einer Anfrage im Proxy, bevor sie nach oben geht
  alle Clients   n=123   Median  67 ms   p95 218 ms   max 249 ms
```

Die Batterie selbst antwortete in 30 bis 70 ms. Der Proxy verdoppelt also grob
die mittlere Latenz — 0,150 s direkt gegen 0,300 s über ihn — und legt am Rand
eine Viertelsekunde drauf. Mehrsekündige Stalls erzeugt er nicht, und er ist
nicht der Grund für die verspäteten Antworten. Ein einzelner Client, der mit drei
Sekunden Timeout direkt mit dieser Batterie spricht, sähe dieselben sechs Fehler
pro neun Minuten.

(Die 19 `connection`-Zeilen in der CSV von Lauf 2 sind der Neustart des Add-ons,
um sein Logging auf DEBUG zu stellen — kein Ereignis des Geräts.)

## Warum sich die beiden Bibliotheken unterscheiden

Keine Designmeinung, sondern jeweils eine einzige Dispatch-Entscheidung.

tmodbus führt auf TCP eine Tabelle offener Anfragen, indiziert über die
Transaction-ID. Ein Frame, dessen ID nicht darin steht, wird protokolliert und
verworfen:

> Received unexpected response with Transaction ID: %d. Discarding bytes: %s

Über diese Warnung zählt der Probe die späten Antworten überhaupt erst. Die
laufende Anfrage wartet unbeirrt auf ihre eigene ID und bekommt sie.

pymodbus wiederholt auf demselben Socket und verwendet die Transaction-ID erneut.
Eine späte Antwort ist damit von der erwarteten nicht zu unterscheiden, bis der
ID-Check fehlschlägt — und dann ist die falsche Anfrage bereits gescheitert. Der
Client dieser Integration trug die Notlösung und ihre Begründung als Kommentar:

> pymodbus retries a request internally before it gives up, each attempt against
> the full timeout […] it re-sends on the same socket, keeps the transaction id,
> and a late response then fails the id check anyway.

Deshalb lief pymodbus dort mit `retries=0` und einer eigenen Retry-Leiter, die
zwischen den Versuchen neu verbindet. Das bremste das Symptom, es behob es nicht.

`modbus-connection` — die Abstraktion, die damals als Weg dorthin betrachtet
wurde; gebaut wurde am Ende direkt gegen tmodbus — bildet außerdem beide
Backends auf eine gemeinsame Fehlerhierarchie ab, sodass ein Aufrufer einen
Timeout von einem kaputten Frame von einer Antwort auf den falschen Austausch
unterscheiden kann:

```
ModbusError
├── ModbusConnectionError → ClientClosedError
├── ModbusTimeoutError            (auch ein eingebauter TimeoutError)
├── ModbusProtocolError → ModbusDesyncError
└── ModbusExceptionError → IllegalDataAddressError, ServerDeviceBusyError, …
```

Mit pymodbus hinter derselben Schnittstelle kommen eine korrupte und eine
ausbleibende Antwort beide als `ModbusTimeoutError` an, mit tmodbus nicht. An
diesem Gerät hat diese Unterscheidung allerdings nie gegriffen: über alle drei
Läufe null `ModbusDesyncError` und null `ModbusProtocolError`. **Das
diagnostische Argument für den Umbau hat den Kontakt mit den Daten nicht
überlebt. Das Argument der späten Antworten schon.**

## Wo das nicht verallgemeinerbar ist

* **Ein Gerät, eine Firmware.** Alles hier ist ein Venus D auf Control-Firmware
  v150, und die Pausen kommen aus dem Telemetrie-Upload dieser Firmware. Ein
  Gerät, das innerhalb deines Timeouts antwortet, erzeugt nichts davon, und für
  das bringt der Umbau nichts.
* **Das Argument trägt der Vergleich von Lauf 2 gegen Lauf 3.** Lauf 1
  unterscheidet sich von beiden in zwei Variablen gleichzeitig und steht hier
  wegen der Chip-Reset-Zahlen, nicht als Kontrolle.
* **In Lauf 2 und 3 waren durchgehend drei Clients und ein Proxy im Spiel.** Der
  Beitrag des Proxys wurde gemessen und ist klein, aber ein Lauf mit nur einem
  Client bei drei Sekunden Timeout wurde nicht gemacht.
* **Die TLS-Zuordnung ist abgeleitet** — aus Periodizität, Dauer, dem zeitlichen
  Zusammenhang mit der Erreichbarkeit des Endpoints und einem dokumentierten
  Mechanismus. Den Handshake hat niemand mitgeschnitten.
* **Kein einziger Desync- oder Protokollfehler ist aufgetreten.** Die
  Fehlerarten, die tmodbus benennen kann und pymodbus nicht, kamen hier gar nicht
  vor. Wer den Umbau darauf stützen will, findet in diesen Daten keine
  Unterstützung.

## Was wir daraus geschlossen haben

Die Frage ist eigentlich nicht, welche Bibliothek besser ist. Sie lautet, ob dein
Gerät länger pausieren kann als dein Timeout — und was dein Client mit der
Antwort macht, die danach eintrifft.

Für ein Gerät, das prompt antwortet, spielt nichts davon eine Rolle. Für eines,
das pausiert — und dieses pausiert konstruktionsbedingt alle fünfundachtzig
Sekunden — entscheidet der Umgang mit der späten Antwort, ob eine Pause einen
fehlgeschlagenen Read kostet oder zwei, und ob man überhaupt ein kurzes Timeout
fahren darf.

Deshalb wurde umgebaut. Nicht weil die Diagnose besser geworden wäre, das ist
sie nicht, sondern weil ein Drei-Sekunden-Timeout nur auf einem Backend sicher
ist, das späte Antworten wegwirft.

---

*Rohdaten: drei CSVs, eine Zeile pro Blockread mit Ergebnis, Dauer und dem
dekodierten Detail jedes verworfenen Frames. Bei Bedarf gern.*
