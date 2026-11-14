# 🧘 Mindful Coach: The Frontend

Welcome to the friendly face of your AI mental coach! This is a **Next.js 16** app that puts a calm, comfy chat UI on top of the FastAPI backend in [`/api`](../api/README.md).

Talk to the coach about **stress**, **motivation**, **habits**, or **confidence**, and it'll answer with encouragement and practical next steps. ✨

---

## 🎒 What you'll need

| Tool | Version | Why |
| --- | --- | --- |
| [Node.js](https://nodejs.org/) | **20.9+** | Runs Next.js |
| npm | comes with Node | Installs packages |
| [`uv`](https://docs.astral.sh/uv/) | latest | Runs the Python backend |

You'll also need a working `.env` in the **repo root** with your LLM provider key. See the [API README](../api/README.md) for setup. Your API key stays on the server and never touches the browser. 🔒

---

## 🚀 Run it locally (two terminals, one happy coach)

**Terminal 1: start the backend** (from the repo root):

```bash
uv sync
uv run uvicorn api.index:app --reload
```

The API is now running on `http://localhost:8000`.

**Terminal 2: start the frontend:**

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:3000** and say hi! 👋

> 💡 The green dot in the header means the frontend can reach the backend. Red means it can't, so check Terminal 1.

---

## 🧠 How the frontend talks to the backend

The UI always calls **relative** URLs like `/api/chat` and `/api/health`. Where they end up depends on where the app is running:

- **Locally (`npm run dev`)**: [`next.config.ts`](./next.config.ts) has a dev-only rewrite that proxies `/api/*` to `http://localhost:8000/api/*`. No CORS headaches.
- **On Vercel**: the root [`vercel.json`](../vercel.json) uses [Vercel Services](https://vercel.com/kb/guide/vercel-services) to run two apps in one project: `frontend` (this Next.js app) and `backend` (FastAPI from `api/index.py`). Its rewrites send `/api/*` to the backend, with the full path intact, and everything else to the frontend.

Running the backend on a different host or port? Point the proxy at it:

```bash
API_URL=http://localhost:9000 npm run dev
```

(Restart `npm run dev` after changing it, since rewrites load at startup.)

> 📝 **Heads up:** the backend is *single-turn*. Every message is answered on its own, without memory of earlier ones. The UI shows your whole conversation, but only your latest message is sent. Give the coach the context it needs each time!

---

## 🗂️ What's inside

```
frontend/
├── app/
│   ├── page.tsx              # The chat page: state, sending, health checks
│   ├── layout.tsx            # Root layout, fonts, page title
│   ├── globals.css           # Colour tokens + typing-dot animation
│   └── components/
│       ├── WelcomeCard.tsx   # "What is this?" intro + starter prompts
│       ├── MessageBubble.tsx # One chat bubble (you vs. coach)
│       ├── Markdown.tsx      # Pretty Markdown for coach replies
│       ├── ChatInput.tsx     # Auto-growing textarea + Send button
│       ├── TypingIndicator.tsx
│       └── types.ts
├── lib/api.ts                # Typed fetch helpers + friendly error messages
└── next.config.ts            # Dev proxy to FastAPI
```

### UX goodies 🎁

- **Enter** sends, **Shift+Enter** adds a new line
- The input box and chat bubbles grow to fit what you write
- Coach replies render as **Markdown**: headings, lists, bold, tables, and code look the way they should
- A "Coach is typing…" indicator while you wait
- Readable error messages (bad API key, rate limit, backend down…)
- Works in light and dark mode, on phones and desktops

---

## 🛠️ Handy scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload on :3000 |
| `npm run build` | Production build |
| `npm run start` | Serve the production build (no `/api` proxy, so use Vercel or put a proxy in front) |
| `npm run lint` | ESLint checks |

---

## ☁️ Deploying to Vercel

From the **repo root** (not `frontend/`), so `vercel.json` can wire up both halves:

```bash
npm i -g vercel
vercel
```

Then add your provider env vars (`LLM_PROVIDER`, `OPENAI_API_KEY` / `ANTHROPIC_API_KEY`, and so on) in the Vercel project settings, and redeploy. 🎉

Want to rehearse the real Vercel routing on your machine first? From the repo root (with any `npm run dev` stopped):

```bash
npx vercel dev --local   # starts both services behind Vercel's router
```

> 🧯 Saw `Cannot patch preview comments when immutable static file upload is enabled`? That came from the old `builds` config in `vercel.json`, which couldn't detect the Next.js version in `frontend/`. The Services config fixes it. Also check that **Framework Preset** is **Services** (or "Other") under Project Settings → Build and Deployment, and that **Root Directory** is the repo root.

---

## 🩺 Troubleshooting

| You see… | Try this |
| --- | --- |
| 🔴 "Backend offline" / "Can't reach the backend" | Start the API in Terminal 1 (`uv run uvicorn api.index:app --reload`) |
| "Invalid API key for provider…" | Fix the key in the repo-root `.env`, then restart the API |
| "Rate limit exceeded…" | Take a deep breath 🧘 and try again in a moment |
| Port 3000 or 8000 already in use | `lsof -ti:3000 \| xargs kill -9` (or `8000`) |

---

*Mindful Coach is an AI, not a substitute for professional mental-health care. If you're in crisis, please contact local emergency services.* 💙
