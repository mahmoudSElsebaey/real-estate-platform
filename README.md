# Aether Residences

Premium Real Estate, Resorts, Property Investment, Hotel & Apartment Booking Platform.

## Brand

**Aether Residences** — Exceptional Living. Timeless Investment.

Centralized brand configuration lives in `src/config/brand.config.ts`.

## Tech Stack (Stage 1)

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- next-intl (Arabic + English, RTL/LTR)
- Framer Motion (prepared)
- class-variance-authority + clsx + tailwind-merge

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app redirects to `/en` or `/ar`.

## Structure

```
src/
  app/[locale]/     # Localized routes
  components/       # UI + Layout + Home
  config/           # brand.config.ts
  i18n/             # next-intl setup
  lib/              # utils
messages/           # en.json + ar.json
```

## Stage 1 Status

- Brand system ✅
- Design tokens ✅
- i18n + RTL/LTR ✅
- Header (creative, transparent/scrolled) ✅
- Footer ✅
- Hero ✅
- Homepage sections ✅
- Centralized brand config ✅

## Development Stages

See project documentation for the full stage roadmap.
