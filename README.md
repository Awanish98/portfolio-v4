# Awanish Kumar

Software developer from India, also known as Jordan. This is the multi-page portfolio: featured websites, a rotating all-projects carousel, a complete 106-project showcase and a CV. Every page also has a live date/weather card and a toggleable generative ambient soundtrack in the bottom-left corner.

Live: **https://awanish98.github.io/portfolio-v4/**

## Run it locally

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`. No build step, no dependencies.

## Deploying to Netlify

Connect the `portfolio-v4` GitHub repo to Netlify (recommended) so the serverless function for Bob is deployed too. Manual drag-and-drop of a ZIP publishes static files but may not activate Functions.

Build settings: leave **build command** empty, **publish directory** `.` (root). `netlify.toml` already points Functions to `netlify/functions`.

## Bob — the assistant

Bob is the floating chat + voice assistant on every page.

- Frontend: `bob.js` + `bob.css`
- Backend: `netlify/functions/bob-chat.mjs` → `POST /api/bob`
- Model: Gemini (`gemini-3.5-flash-lite` by default)

**Set the API key in Netlify UI** → Site settings → Environment variables:

```
GEMINI_API_KEY=your_key_here
GEMINI_MODEL=gemini-3.5-flash-lite     # optional
```

The key stays server-side. Never put it in a JS file or commit it. Without a key, Bob automatically falls back to a small built-in local brain so the UI still works in previews.

Voice input uses the browser Speech Recognition API (Chrome/Edge), voice output uses Speech Synthesis — both free, no key needed.

## Files

- `index.html` — landing page (featured + carousel + showcase CTA + about/contact)
- `showcase.html` / `showcase.js` / `showcase.css` — all 106 projects, filters, search, animations
- `projects-data.js` — one shared project dataset
- `resume.html` — CV
- `styles.css`, `glass.css`, `carousel.css` — styling
- `corner-widgets.js`, `corner-widgets.css` — live date/weather (Open-Meteo, no key) + play/mute ambient soundscape (Web Audio, no audio file)
- `bob.js`, `bob.css`, `netlify/functions/bob-chat.mjs` — assistant
