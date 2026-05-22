# VOM Industry Group — Invoice Generator

A modern, Gen Z-style invoice generator web app for VOM Industry Group. Built as a fully static, client-side application with a premium SaaS aesthetic.

## Features

- **Live Invoice Builder** — real-time two-panel layout (form + preview)
- **Dynamic Item Rows** — add/remove unlimited invoice items with smooth animations
- **PPN 11% Tax Toggle** — toggle Indonesian VAT on/off with auto-calculation
- **PDF Export** — high-quality A4 PDF via jsPDF + html2canvas
- **Print Support** — open print dialog with formatted invoice
- **Indonesian Rupiah (IDR)** — all amounts use `Intl.NumberFormat('id-ID')` (e.g. Rp 1.250.000)
- **Reset Form** — one-click reset to defaults
- **Fully Responsive** — mobile, tablet, desktop

## Design

- Glassmorphism with soft gradients (violet → indigo → cyan)
- Dark premium theme (`#050510` base)
- Inter typeface
- Animated floating orbs in hero section
- Linear / Stripe / Vercel-inspired aesthetics

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js-style TanStack Start (React 19) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| PDF | jsPDF + html2canvas |
| Routing | TanStack Router |
| Deployment | Netlify (static) |

## Local Development

```bash
npm install
npm run dev
```

The dev server starts at `http://localhost:3000`.

## Build

```bash
npm run build
```

Output is a fully static site deployable to Netlify.
