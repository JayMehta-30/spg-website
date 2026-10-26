# SPG: HANDOFF FOR ANY NEW DEVELOPER OR CHATGPT SESSION

## First read

SPG is a small owner-led apartment accommodation website in Kandivali West, Mumbai. One property is live-for-enquiry, two are unpublished placeholders. YogaTopics is a separate optional wellness business. Existing owner uses WhatsApp as the ONLY request channel for the first release.

## Non-negotiable product invariants

1. Never add "Book now", instant-confirm, checkout, deposits, payment gateway, public date availability, first-come-first-served claim, fake reservations, or an enquiry-approval promise unless the owner explicitly requests a new phase.
2. WhatsApp communication is personal; the site does not know whether any apartment is currently booked and must not say it is available or unavailable for specific dates.
3. Respect the owner policy: accommodation currently intended for couples, not single-person rentals. Do not infer additional gender, marital, religion or nationality policies. Local regulatory and society rules require qualified review.
4. Never present dummy images, testimonials, reviews, rates, or amenities as verified facts. Do not show unpublished properties.
5. Keep public UI sections separated from editable content and from future review/email workflows.
6. Treat secret credentials and private enquiries as privileged data. Never leak them via frontend code, public APIs or generated files.

## How to update content

For photos, headline, pricing, amenities, eligibility, WhatsApp number: Use `/admin`. No code edits needed. Pictures can be uploaded or placed via image URL. Save each section explicitly.

## How to update UI with ChatGPT

Suggested user instruction: "Please inspect this SPG repository, particularly README.md and docs/AI_HANDOFF.md. I want to change [specific UI element]. Keep current WhatsApp-only flow and admin content editable. Do not add booking, payments or public availability. Update the appropriate React components and CSS, show changed files, and run build/tests."

1. Create a git branch / commit before changes.
2. UI: `client/src/main.tsx` contains components for Header, Footer, Home, Stays, Details, Wellness, About and Admin. Styles: `client/src/styles.css`.
3. Content schema: `server/data/site.seed.json`; API endpoints in `server/src/index.js`; TypeScript types near top of frontend entry file.
4. Reusable components: Img, WhatsApp, PropertyCard. Keep them reusable when adding properties.
5. If changing fields, update seed JSON + backend save validation + client types + admin form + public component, all together.
6. Check desktop, mobile, dark hero contrast, keyboard access, broken links, demo-photo labels, WhatsApp destination and admin authorisation.
7. Make no silent changes to booking rules or guest eligibility.

## Improvement opportunity

For long-term maintainability, split `client/src/main.tsx` into feature folders and small components after visual design approval. The current code is kept in one file to make this packaged starter simpler to inspect. For robust launch, migrate JSON to PostgreSQL and upload folder to object storage, with migrations and backup/restore. Add integration tests and app monitoring.
