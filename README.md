# Awanish Kumar

Software developer from India, also known as Jordan. This is the multi-page portfolio: featured websites, a rotating all-projects carousel, a complete 106-project showcase and a CV. Every page also has a compact live clock/weather chip in the nav bar with a toggleable generative ambient soundtrack — no audio file or API key needed.

Live: **https://awanish98.github.io/portfolio-v4/**

## Run it locally

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`. No build step, no dependencies.

## Deploying to Netlify

Connect the `portfolio-v4` GitHub repo to Netlify (recommended) so the serverless function for Bob is deployed too. Manual drag-and-drop of a ZIP publishes static files but may not activate Functions.

Build settings: leave **build command** empty, **publish directory** `.` (root). `netlify.toml` already points Functions to `netlify/functions`.

### "Powered by Netlify" badge

New public projects created on a Free plan show a Netlify badge in the bottom-right corner. The reliable fix is the official per-project setting:

**Netlify UI → your project → Project configuration → General → Powered by Netlify badge → Off → Save.** It applies on the next request; no redeploy needed. If the setting is locked on your plan, the site also ships a defensive fallback: `responsive.css` hides every known badge shell and `premium.js` removes any badge iframe injected later. That fallback is best-effort — Netlify can change its injection markup at any time, so prefer the dashboard toggle.

## Bob — the assistant

Bob is the floating chat + voice assistant on every page.

- Frontend: `bob.js` + `bob.css`
- Backend: `netlify/functions/bob-chat.mjs` → `POST /api/bob`
- Model: Gemini (fast flash-lite model by default — set `GEMINI_MODEL` to override)

**Set the API key in Netlify UI** → Site settings → Environment variables:

```
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=optional-model-id         # optional
```

The key stays server-side. Never put it in a JS file or commit it. Without a key, Bob automatically falls back to a small built-in local brain so the UI still works in previews.

Voice input uses the browser Speech Recognition API (Chrome/Edge), voice output uses Speech Synthesis — both free, no key needed.

## Files

- `index.html` — landing page (featured + carousel + showcase CTA + about/contact)
- `showcase.html` / `showcase.js` / `showcase.css` — all 106 projects, filters, search, animations
- `projects-data.js` — one shared project dataset
- `resume.html` — CV
- `styles.css`, `glass.css`, `carousel.css` — styling
- `corner-widgets.js`, `corner-widgets.css` — compact nav clock/weather chip (Open-Meteo, no key) + play/mute ambient soundscape (Web Audio, no audio file)
- `responsive.css` — global responsive hardening: phones (320px+), tablets, laptops and short landscape; collision-free nav drawer, scrollable landscape menu, safe-area aware Bob, clipped decorative overflow
- `bob.js`, `bob.css`, `netlify/functions/bob-chat.mjs` — assistant
