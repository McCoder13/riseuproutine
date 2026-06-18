# Morning Flow

First-iteration baseline for a mobile-first morning and evening routine PWA.

## What is included

- Polished morning launch screen with date, clock, weather placeholder, and start action.
- Full-screen guided morning routine with progress, skip, and done controls.
- Completion flow into a simple daily dashboard.
- Time-aware dashboard copy for morning, midday, afternoon, evening, and night.
- Evening routine with a wake-time setup step.
- Local storage for notes, routine completion, and tomorrow's wake time.
- PWA manifest and service worker for installable/offline-ready behavior on supported browsers.

## Run locally

This is a static app. Open `index.html` directly for a quick visual check.

For service worker and PWA behavior, serve the folder over localhost:

```powershell
python -m http.server 5173
```

Then open `http://localhost:5173`.

## Platform notes

The app does not claim it can wake the phone, force full-screen Safari, autoplay audio, or set alarms. The evening flow saves a target wake time and reminds you to set the real alarm in the iPhone Clock app.
