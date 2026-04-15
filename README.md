# screenshot → calendar

Drop a screenshot, extract events with local OCR + a local LLM, and add them straight to Google Calendar. No API credits needed.

## How it works

1. **Tesseract.js** — runs OCR in your browser (WebAssembly) to pull text out of the image
2. **Ollama** — a local LLM reads the raw text and returns structured events as JSON
3. Review and edit the extracted events, then add them to Google Calendar with one click

## Prerequisites

- [Node.js](https://nodejs.org) 20+
- [Ollama](https://ollama.com) installed and running

```bash
ollama pull llama3.1:8b
```

Any instruction-tuned model works. You can change the model name in the in-app settings panel.

## Local setup

```bash
git clone https://github.com/your-username/screenshot-to-calendar
cd screenshot-to-calendar
npm install
cp .env.example .env
```

Add your Google OAuth Client ID to `.env` (see [Google Calendar setup](#google-calendar-setup) below), then:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Settings

Click the gear icon in the top-right to configure Ollama without rebuilding:

| Setting | Default | Description |
|---------|---------|-------------|
| Base URL | `http://localhost:11434` | Ollama endpoint |
| Model | `llama3.1:8b` | Model used for event extraction |

Settings are saved to `localStorage`.

## Google Calendar setup

1. Go to [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials
2. Create an **OAuth 2.0 Client ID** (Web application)
3. Add your origin to **Authorized JavaScript origins** (e.g. `http://localhost:5173`)
4. Copy the Client ID into `.env`:

```
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

## GitHub Pages deployment

The app builds and deploys automatically via GitHub Actions on every push to `main`.

### Required repo secret

In your repo → Settings → Secrets → Actions, add:

```
VITE_GOOGLE_CLIENT_ID = your-client-id.apps.googleusercontent.com
```

Also add your GitHub Pages URL to **Authorized JavaScript origins** in Google Cloud Console.

### Using Ollama from a deployed page

GitHub Pages is HTTPS. Browsers block requests from HTTPS pages to plain `http://` endpoints, so `http://localhost:11434` won't work directly. You need to expose Ollama over HTTPS.

**Option 1 — ngrok (easiest):**
```bash
# Allow your GitHub Pages domain in Ollama first
OLLAMA_ORIGINS="https://your-username.github.io" ollama serve

# In a second terminal
ngrok http 11434
```
Paste the `https://...ngrok.io` URL into the app's settings panel (gear icon).

**Option 2 — Tailscale / Cloudflare Tunnel / Caddy:**
Any HTTPS reverse proxy in front of Ollama works the same way.

In all cases, set `OLLAMA_ORIGINS` to include your GitHub Pages URL so Ollama allows the cross-origin request:

```bash
OLLAMA_ORIGINS="https://your-username.github.io" ollama serve
```

## Stack

- [React](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vitejs.dev) + [Tailwind CSS](https://tailwindcss.com)
- [Tesseract.js](https://github.com/naptha/tesseract.js) — in-browser OCR
- [Ollama](https://ollama.com) — local LLM inference
- [Google Calendar API](https://developers.google.com/calendar)
