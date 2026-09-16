# What a late Modbus reply costs, and what changing the client library does about it

**Deutsch: [TMODBUS-MIGRATION.de.md](TMODBUS-MIGRATION.de.md)**

This is a measurement write-up, not a recommendation. It exists because the
question "should this integration move from pymodbus to Home Assistant's
`modbus-connection`?" kept getting answered from opinion, including twice by us,
in opposite directions. Below is what three probe runs against a Marstek Venus D
actually showed, what the difference between the two client libraries is in the
one case where it matters, and what a migration would involve.

Anyone maintaining a Modbus integration for a device that pauses under load
should be able to decide from this whether the same reasoning applies to them.
It may well not — see [Where this does not generalise](#where-this-does-not-generalise).

## The short version

This battery stops answering for about four and a half seconds, every eighty-five
seconds, while its firmware uploads telemetry over TLS. That is not a fault
condition; it is what the device does when everything is working.

A client whose timeout is shorter than the pause gives up, and the answer arrives
anyway a second or two later, with nobody waiting for it. Where that reply goes
is decided by the client library:

* **tmodbus** matches replies to requests by transaction id. A reply with no
  matching request is logged and dropped, and the request currently in flight
  gets its own answer.
* **pymodbus** re-sends on the same socket and keeps the transaction id, so the
  late reply fails the id check of whichever request is in flight and takes that
  one down too.

With pymodbus the only way to avoid the second failure is a timeout longer than
the device's worst pause. Here that means ten seconds, and even that was not
always enough. Ten seconds rules out any control loop that has to react quickly —
zero export regulation, for one. With tmodbus a short timeout is safe: the
stalled request fails, and nothing else does.

That is the whole argument. Everything below is the evidence.

## The measurements

A probe was written for this. It reads the same register blocks as the
integration, in the same groups, with the same pacing, but with no retry ladder
and no per-register backoff, so that what the first attempt saw is not hidden.
Every read is classified by the exception it raised and written to CSV, one row
per read. It runs on the tmodbus backend, because tmodbus can tell the failure
modes apart; pymodbus reports a corrupt reply and a missing reply as the same
timeout.

All three runs are against one Venus D, control firmware v150, seven packs, on
Ethernet.

### Runs 2 and 3 — the same device, the same load, two timeouts

These two are a controlled pair: same proxy, same three clients, same telemetry
state. **The only difference is the client timeout.** Take them first, because
the comparison is the point.

| | run 2, timeout 3 s | run 3, timeout 10 s |
|---|---|---|
| duration | 8.8 min | 14.9 min |
| reads | 1400 | 2322 |
| stalls encountered | 6 | 9 |
| rate | 0.68 / min | 0.60 / min |
| what each stall cost | **1 timeout + 1 late reply**, 6 of 6 | 1 slow read that succeeded, 8 of 9 |
| median read | 0.300 s | 0.300 s |

The underlying event is identical in both, and it is periodic:

```
run 2, intervals between timeouts    86.3  89.0  83.9  84.8  85.0 s   mean 85.8
run 3, intervals between slow reads  85.3  84.9  85.2  85.2  84.8 s   mean 85.1
```

In run 3, where the client waited, eight of those reads took **3.91, 4.40, 4.48,
4.50, 4.53, 4.55, 4.62 and 4.64 seconds** and every one of them succeeded. In run
2, where it gave up at three, each stall became a failure plus an orphaned reply
instead. The ninth stall in run 3 is the one that ran past ten seconds, below.

The six orphans in run 2 were decoded from the log and matched against the
request that had just been abandoned. Transaction id and register count agree in
every case:

```
tid 46    30 registers  ← timeout on 43100-43129 (30)   landed in 44002-44003, ok in 1.939 s
tid 272    1 register   ← timeout on 30303     (1)      landed in 32100,       ok in 1.635 s
tid 505    1 register   ← timeout on 30001     (1)      landed in 30006,       ok in 1.301 s
tid 724    1 register   ← timeout on 32100     (1)      landed in 32104-32105, ok in 1.641 s
tid 937    8 registers  ← timeout on 30020-30027 (8)    landed in 30037-30040, ok in 2.145 s
tid 1150  10 registers  ← timeout on 43100-43109 (10)   landed in 44002-44003, ok in 1.682 s
```

Every one of them arrived in the middle of an unrelated read, and every one of
those reads still succeeded — slowly, because the socket had a stranger's frame
on it first, but correctly. That last clause is the entire difference between the
two libraries. pymodbus would have failed those six reads as well, turning six
failures into twelve.

Run 3 also showed that raising the timeout is not a fix, only a longer fuse:

```
01:11:29   32204   timeout after 10.083 s
01:11:30   34002   the reply arrives, transaction id 505, and is discarded
```

One stall exceeded ten seconds. And one interval in run 3 came out at 169.7 s,
exactly twice the rhythm — a skipped upload, the first sign of the backlog
draining.

### Where the pause comes from

Firmware v150 sends its telemetry over TLS, and the key exchange costs this MCU
about four seconds during which it stops answering Modbus. The mechanism is
documented in [FIRMWARE-DROPOUTS.md](FIRMWARE-DROPOUTS.md) from a decompile of
the firmware. The 85-second rhythm measured here is faster than the roughly
five minutes documented there, because the battery was working through telemetry
it had buffered while its endpoint was unreachable.

This attribution is an inference, not a packet capture: periodic to within half a
second, about four seconds long, appeared when the telemetry endpoint was
reachable and not when it was not, and matches a documented mechanism.

### Run 1 — straight at the battery, telemetry endpoint unreachable

Two hours, 24958 reads, no proxy, no other client, and the battery unable to
reach anything to upload to.

```
ok           24935   99.91 %
timeout         20    0.08 %
connection       3    0.01 %

desync           0
protocol         0
late replies     0
```

A completely different failure mode. Three outages, 16.5 s, 16.7 s and 24.6 s,
**1804 and 1824 seconds apart** — the firmware resets its own network chip after
1800 seconds when its telemetry backlog cannot drain, which is the other
mechanism in FIRMWARE-DROPOUTS.md, here measured rather than decompiled.
Availability over the two hours: 99.197 %.

No late replies, and none were possible: during a chip reset the device is gone
outright and the socket dies, so there is nothing left to answer late. Outside
the outages the link was clean — median read 0.150 s, p99 0.183 s, not one read
over a second in two hours.

**On its own, this run argues against changing anything**, which is what we
concluded from it before running the other two. Note that it differs from runs 2
and 3 in two ways at once, no proxy *and* no telemetry: it cannot be used to
attribute anything to either by itself.

### What the proxy contributes, and why it is not the culprit

It would be easy to blame the proxy, so it was measured. `modbus-proxy` 1.1.0 as
a Home Assistant add-on, holding **one** upstream connection and multiplexing all
clients onto it. With its log at DEBUG, every request and reply is timestamped on
both sides, which separates "waiting in the proxy" from "waiting for the device":

```
time a request waits inside the proxy before it goes upstream
  all clients   n=123   median  67 ms   p95 218 ms   max 249 ms
```

The battery answered in 30 to 70 ms. So the proxy roughly doubles the median
latency — 0.150 s direct against 0.300 s through it — and adds a quarter of a
second at the tail. It does not produce multi-second stalls, and it is not what
makes the replies late. A single client talking straight to this battery with a
three-second timeout would see the same six failures per nine minutes.

(The 19 connection errors in run 2's CSV are the add-on being restarted to switch
its logging to DEBUG, not a device event.)

## Why the two libraries differ

Not a design opinion: it is one dispatch decision in each.

tmodbus, on TCP, keeps a map of pending requests keyed by transaction id. A frame
whose id is not in the map is logged and dropped:

> Received unexpected response with Transaction ID: %d. Discarding bytes: %s

That warning is how the probe counts late replies at all. The request in flight
keeps waiting for its own id and gets it.

pymodbus retries on the same socket and reuses the transaction id, so a late
reply is indistinguishable from the answer it is waiting for until the id check
fails — at which point the wrong request has already failed. This integration's
own client carries the workaround and the reason in a comment:

> pymodbus retries a request internally before it gives up, each attempt against
> the full timeout […] it re-sends on the same socket, keeps the transaction id,
> and a late response then fails the id check anyway.

which is why it runs pymodbus with `retries=0` and does its own retry ladder,
reconnecting between attempts. That is a brake on the symptom, not a fix.

`modbus-connection` also maps both backends onto one neutral exception hierarchy,
so a caller can tell a timeout from a corrupt frame from a reply to the wrong
exchange:

```
ModbusError
├── ModbusConnectionError → ClientClosedError
├── ModbusTimeoutError            (also a builtin TimeoutError)
├── ModbusProtocolError → ModbusDesyncError
└── ModbusExceptionError → IllegalDataAddressError, ServerDeviceBusyError, …
```

With pymodbus behind the same interface, a corrupt reply and a missing reply both
arrive as `ModbusTimeoutError`; with tmodbus they do not. On this device that
distinction never fired: across all three runs, zero `ModbusDesyncError` and zero
`ModbusProtocolError`. **The diagnostic argument for migrating did not survive
contact with the data. The late-reply argument did.**

## What migrating looks like

`modbus-connection` is an abstraction over pymodbus or tmodbus, not a
reimplementation. Home Assistant core's own `modbus` integration already pulls
`modbus-connection[tmodbus]` alongside pymodbus, so on a current installation the
dependency is likely present already. It needs Python 3.12 or newer.

For this integration's client — 990 lines built around `AsyncModbusTcpClient` —
the split came out as follows.

**Replaced by the library**

| ours | theirs |
|---|---|
| a lock serialising requests, against transaction-id collisions | requests on one connection are serialised |
| `message_wait_ms`, measured from the end of the previous request | `unit.set_message_spacing()`, same semantics |
| timeout normalisation and guarding | `unit.require_timeout()` |
| a settle delay before a reconnect | `unit.require_connect_delay()` |
| detecting and recycling a half-open socket | `connection.disconnect()`; the next request rebuilds |
| `int32` / `uint32` / float / string / IPv4 decoding | `modbus_connection.decode` |
| `retries=0` plus reflection over `client.ctx.retries` to price a call | gone; neither backend retries, and there is no knob |

**Still ours**

* the retry ladder, with a reconnect between attempts. `modbus-connection` turns
  per-request retries off in both backends and exposes no setting, so the policy
  belongs to the caller. The Huawei library does the same thing with `tenacity`.
* the connect backoff, 1 s doubling to 30 s, which stops a device in reset from
  being hammered. Not in the library.
* the guard timeout each caller wraps around a read — simpler now, because a call
  is one attempt against one timeout instead of a ladder priced by reflection.

**Changed shape**

The error model inverts. Today the code checks `result.isError()` and the length
of `result.registers`; afterwards every failure is an exception. The bodies of the
read and write methods get rewritten rather than edited.

**Worth knowing before you start**

`huawei_solar`'s maintainer — who wrote tmodbus, and whose library Home Assistant
core now ships — has declined to migrate his own integration for now. His reason
is specific: Huawei uses vendor function code `0x41` for its login handshake and
optimizer file transfer, and `ModbusUnit` deliberately offers no raw-PDU seam, so
a migration has to reach around the abstraction. An integration that speaks only
standard function codes does not hit that. This one uses FC03, FC06 and FC16 and
nothing else.

The library is also young. First releases were July 2026, it is at 4.12.1 as of
writing with 38 releases behind it, and there are already deprecations in the
API. Pin the version.

## Where this does not generalise

* **One device, one firmware.** Everything here is a Venus D on control firmware
  v150, and the pauses come from that firmware's telemetry upload. A device that
  answers within your timeout produces none of this, and for it the migration
  buys nothing.
* **The comparison that carries the argument is runs 2 against 3.** Run 1 differs
  from both in two variables at once and is included for the chip-reset numbers,
  not as a control.
* **Three clients and a proxy were present throughout runs 2 and 3.** The proxy's
  contribution was measured and is small, but a single-client run at a
  three-second timeout was not done.
* **The TLS attribution is inferred**, from periodicity, duration, timing against
  the endpoint's reachability, and a documented mechanism. Nobody captured the
  handshake.
* **No desync or protocol error was ever observed.** The failure modes tmodbus
  can name and pymodbus cannot did not occur here at all. If your case for
  migrating rests on those, this data does not support it.

## What we concluded

The question is not really which library is better. It is whether your device
can pause for longer than your timeout, and what your client does with the answer
that turns up afterwards.

For a device that answers promptly, none of this matters. For one that pauses —
and this one pauses every eighty-five seconds by design — the late-reply handling
decides whether a pause costs you one failed read or two, and whether you are
allowed to keep a short timeout at all.

We are migrating. Not because the diagnosis got better, it did not, but because a
three-second timeout is only safe on a backend that throws late replies away.

---

*Raw data: three CSVs, one row per block read with outcome, duration and the
decoded detail of every discarded frame. Ask if they would be useful.*
