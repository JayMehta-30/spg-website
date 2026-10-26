# SPG — Flexible Stays Website (MVP v0.1)

React + TypeScript + Vite public site and content editor; Node.js + Express API. Designed for SPG apartments in Kandivali West, Mumbai, with two unpublished future-property records.

## IMPORTANT: Current business rules

- **WhatsApp only**, using an owner-configured number. Until the real WhatsApp number is set, public CTA displays "WhatsApp contact being set up". No fabricated number.
- **No public availability or waitlist counter.** Visitors cannot reserve a date, see a live occupancy state, pay, or claim a place in a queue.
- **No first-come-first-served promise.** Owner personally reviews all WhatsApp conversations and chooses how to respond.
- **Couples-only notice** on listings and property pages, subject to legal/local professional confirmation. No discriminatory restrictions beyond owner-approved terms.
- **No web enquiry form** and no enquiry database in the current WhatsApp-only phase. WhatsApp chats are NOT automatically stored in SPG.
- **No automated 10-day deadline or approval email yet.** Planned for a later release once approved and operational details are clarified. Future waiting period is not guaranteed availability or an offer.
- **Demo artwork** is labelled explicitly and is never represented as actual property photography.

## Run locally

Prerequisites: Node 20+ and npm. This repository has no vendored dependencies; an internet connection is required for initial `npm install`.

1. Copy `.env.example` to `.env` at repository root.
2. Set strong unique `ADMIN_PASSWORD` and `SESSION_SECRET` values (never commit `.env`).
3. `npm install`
4. `npm run dev`
5. Open http://localhost:5173 for the website, http://localhost:5173/admin for the owner editor.
6. In the editor, set the aunt's correct WhatsApp number as **international digits only**: `91` + Indian mobile number. Save changes and test the WhatsApp link.

The server must use the same site origin (`SITE_ORIGIN`) that visitors use. In local development Vite forwards `/api` and `/uploads` to Express.

## Editing without coding

Sign in at `/admin`. Website Settings controls hero headings, supporting text, hero photo, contact links and wellness content. Each property has its own name, description, rates/rate label, amenities, house rules, eligibility wording, photo gallery and publish toggle. Uploaded images are stored under `server/uploads/`; the editor also supports secure HTTPS photo URLs.

**IMPORTANT:** Changes are published after pressing **Save changes**. On the public website reload to see updated values. New apartments are unpublished by default.

- Real images: upload JPEG, PNG, WebP or AVIF (max 6 MB/image). Use WebP for speed. Videos are **not implemented in v0.1**; a curated video block can be added later once real media is provided.
- Dummy rates are intentionally not fabricated. Update the public rate text when owner confirms preferred wording.
- Avoid publishing "upcoming" apartments until fully ready.
- For a future ChatGPT-assisted redesign, share this project ZIP/repository with ChatGPT or a coding assistant and ask it to **read `docs/AI_HANDOFF.md` first**. Normal copy and photo changes should use `/admin` instead of editing code.

## Content persistence and production limitations

This starter uses an atomic JSON file (`server/data/site.json`) to make the first release easy to run and maintain. On first launch, content is loaded from `server/data/site.seed.json`; editing creates `site.json`. Site data is not stored in React components. Uploaded images are stored locally in `server/uploads/`.

**Do not deploy the API to ephemeral storage** (many serverless hosts) without replacing JSON + local uploads. For a real public launch, move mutable site data to PostgreSQL and photos to a persistent object-storage bucket such as Supabase Storage or S3, or deploy the server on a persistent disk with backups. The prior planning recommendation of PostgreSQL remains the preferred production upgrade. This is a functional starter, not a production-certified hospitality backend.

Other production requirements: host behind HTTPS with same-origin `/api` proxy, strong unique secrets, secure backups, admin authentication hardening (ideally passkey/2FA), upload malware/content checks, content audit history, uptime monitoring and a privacy review. Admin is presently a single password login with signed, 12-hour HttpOnly cookie. All write endpoints require auth and check Origin; repeated logins are rate-limited. Public pages do not publish user personal data.

### Deployment topology

```
Internet HTTPS -> reverse proxy / same domain
   /               -> Vite production files (client/dist)
   /api/*          -> long-running Node Express server
   /uploads/*      -> Node Express server's persistent upload dir
```

If using split hosting (e.g. Vercel static frontend + Node backend), configure the frontend host's rewrites/proxy for `/api` and `/uploads` to point to the API's HTTPS origin. Do NOT simply change fetch to a cross-origin endpoint without implementing cookie/CSRF policy. Public SEO on this Vite SPA is basic metadata only; for stronger Google indexing, prerender the public landing and property pages or adopt SSR after content is finalised.

## Project structure

- `client/src/main.tsx` — React routes/components including public pages and admin editor.
- `client/src/styles.css` — SPG design tokens and responsive styles.
- `client/public/images/demo-*` — clearly labelled temporary placeholder visuals.
- `server/src/index.js` — Express API, signed-cookie admin auth, JSON content persistence and photo upload.
- `server/data/site.seed.json` — starter content: one published apartment, two unpublished.
- `docs/AI_HANDOFF.md` — safe guide for other developers and AI agents.
- `docs/ROADMAP.md` — current scope and delayed 10-day email review flow.

## Developer notes

- Run `npm run build` after installing dependencies to catch TypeScript/build errors.
- Image and URL inputs are editable through the admin, but avoid third-party image URLs whose permissions are uncertain. Replace demo art with real property assets.
- Admin JSON stores editable public site content; it is deliberately separate from any future applicant data.
- First-phase eligibility is shown to prospects, not inferred from sensitive personal attributes.
- No automated booking, approval, rent collection or availability calendar is present.
