# NeoMonitor — CLAUDE.md

## Project

NeoMonitor is a vital signs monitor simulator for medical resuscitation training (NRP 2020, PALS, ACLS). Deployed at **neomonitor.pro**. Author: Dr. Diego Steinberg.

## Architecture

**Single-file SPA** — all code lives in `index.html` (~1750 lines). No build system, no bundler, no separate JS/CSS files. Edit and deploy directly.

### Tech stack (all via CDN, no npm)

| Library | Version | Purpose |
|---|---|---|
| React | 18 UMD | UI components (JSX via Babel standalone) |
| Firebase | 10.8.0 | Firestore (real-time sync), Auth |
| Tailwind CSS | CDN | Styling |
| html5-qrcode | latest | QR scanning on the control device |
| Google Analytics | G-DK9H6YBTY9 | Usage tracking via `trackNeoEvent()` |

### Key data structures in index.html

- **`TRANSLATIONS`** — i18n object with keys `es`, `en`, `pt`. All user-facing strings must be added here in all three languages.
- **`PATIENT_CONFIG`** — alarm thresholds and presets per patient type (`neonatal`, `pediatrico`, `adulto`).
- **`PATIENT_DEFAULTS`** — default HR/SpO2 per patient type.
- **`DEFAULT_VITALS`** — baseline Firestore document state.
- **`CLINICAL_CASES`** — scripted multi-stage simulation scenarios. Each stage has `hr`, `spo2`, and `transition` (seconds).
- **`NON_TECHNICAL_SKILLS`** — debriefing checklist items (Spanish only).
- **`Icons`** — inline SVG icon components.

### Audio system

Uses Web Audio API (`AudioContext`). Key functions:
- `initAudio()` — must be called from a user gesture before any sound plays.
- `playBeep(pitch)` — single beep for heartbeat.
- `playAlarmSequence(type)` — `'critical'` or `'warning'` alarm pattern.
- `playGrunt()` — neonatal expiratory grunt sound.

### Two-device system

- **Monitor** (tablet/PC): displays waveforms and vitals, reads state from Firestore.
- **Control** (smartphone): pairs via QR code scan, writes commands to Firestore.
- Session is keyed by a short alphanumeric ID shown on the monitor.

### Firestore connection handling & resilience

**States:**
- `isConnected` — boolean, true when Firestore is reachable
- `connectionError` — string, error message from Firestore (e.g., "Permission denied", "Network error")
- `isRetrying` — boolean, true when automatic retry loop is active
- `retryCount` — number, incremented with each retry attempt

**Listener error handling:**
The main `onSnapshot()` listener has an error callback that:
1. Sets `isConnected=false` and stores the error message
2. Activates `isRetrying=true` to start the automatic retry loop
3. Shows a red banner with error details and retry count

**Automatic retry (every 5 seconds):**
- `useEffect` with `isRetrying` dependency runs `db.get()` to verify connection
- If successful: resets `isConnected=true`, clears error, stops retry loop
- If fails: continues retrying, increments counter displayed in banner
- User sees: `🔴 Desconectado: Permission denied (reintentando... intento #7)`

**Error sources that trigger retry:**
1. `onSnapshot()` error — listener connection lost
2. `writeToFirestore()` errors — failed write on control device
3. Session initialization errors — failed `.set()` when creating session

**Debugging:**
- Check browser Console (F12) for `[Firestore]` prefixed logs
- Look for `Error en listener`, `Error escribiendo`, `Retry #N` messages
- Banner stays visible until connection recovers automatically

## Patient types and alarm thresholds

| Type | HR critical | HR warning low | HR warning high | SpO2 critical | SpO2 warning |
|---|---|---|---|---|---|
| Neonatal | <60 | <100 | >180 | <80% | <89% |
| Pediátrico | <60 | <70 | >160 | <88% | <94% |
| Adulto | <40 | <50 | >150 | <88% | <94% |

## Development conventions

- **No build step** — changes take effect immediately on page reload.
- **All UI text must be added in all three languages** (`es`, `en`, `pt`) inside `TRANSLATIONS`.
- **New clinical cases** go into `CLINICAL_CASES` with a unique `id`, a `patientType`, a trilingual `title` and `presentation`, and a `stages` array.
- **New patient presets** go into `PATIENT_CONFIG[patientType].presets`.
- Tailwind classes are used for all layout/color. Custom CSS is minimal and lives in the `<style>` block in `<head>`.
- Sponsor slot is managed by the `<SponsorSpace>` component.

## What NOT to do

- Do not split the code into multiple files or introduce a build system unless explicitly requested.
- Do not add npm dependencies.
- **DO add error handling for Firestore operations** (listener, writes, initialization). Network errors must be caught and retried.
- Do not add error handling for internal React state or guaranteed operations.
- Do not add features not explicitly requested.

## Recent fixes (beta branch)

- **v1.05+**: Firestore connection resilience with automatic retry every 5 seconds on error. Users see red error banner with retry count. No need for manual reconnection.
