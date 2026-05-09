# goproxe

Standalone Next.js app for **goproxe.com** — the PROXe AI Customer Acquisition System landing page.

Extracted from the bconclub monorepo's `app/proxe/` route.

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in Supabase + Vapi keys
npm run dev                   # runs on http://localhost:3002
```

## Build for production

```bash
npm run build
npm run start
```

## Structure

```
app/
├── page.tsx              # / → renders <ProxeLanding />
├── layout.tsx            # root <html>/<body> + metadata
├── globals.css           # minimal reset
├── components/           # ProxeLanding, Grainient, VapiOrb, shared/, ui/
├── contexts/             # DeployModalContext
├── lib/                  # supabase, chat sessions, local storage
├── styles/               # landing.css + theme files
└── configs.ts
public/proxe/             # brand assets, favicons, images
```

## Deploy

Targeted at **goproxe.com**. Configure your host (Vercel, etc.) to:
- Set the env vars from `.env.example`
- Build with `npm run build`
- Start with `npm run start` (port 3002 by default)
