# goproxe

Standalone Next.js app for **goproxe.com** â€” the PROXe AI Lead Conversion System landing page.

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
â”œâ”€â”€ page.tsx              # / â†’ renders <ProxeLanding />
â”œâ”€â”€ layout.tsx            # root <html>/<body> + metadata
â”œâ”€â”€ globals.css           # minimal reset
â”œâ”€â”€ components/           # ProxeLanding, Grainient, VapiOrb, shared/, ui/
â”œâ”€â”€ contexts/             # DeployModalContext
â”œâ”€â”€ lib/                  # supabase, chat sessions, local storage
â”œâ”€â”€ styles/               # landing.css + theme files
â””â”€â”€ configs.ts
public/proxe/             # brand assets, favicons, images
```

## Deploy

Targeted at **goproxe.com**. Configure your host (Vercel, etc.) to:
- Set the env vars from `.env.example`
- Build with `npm run build`
- Start with `npm run start` (port 3002 by default)
