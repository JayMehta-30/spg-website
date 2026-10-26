# SPG Roadmap

## Phase A — implemented starter
- Responsive React + Vite public website.
- One published apartment with gallery, editable detail content and WhatsApp enquiry.
- Two UNPUBLISHED future-property records.
- Generic brand, stay, wellness, about and contact links.
- Owner editor for hero, copy, WhatsApp details, images, rates and property visibility.
- No public availability, FCFS, payment or instant booking.

## Before public launch
- Owner supplies actual photos/videos, verified property facts, rates, terms, contact number, and approved eligibility language.
- Replace all demo visuals. Add a small accessible video component if there is a suitable video to share. Do not autoplay sound.
- Verify WhatsApp deep-link; set contact info; test local approval communication.
- Resolve applicable Kandivali West / Mumbai housing society, licensing/registration and guest policies with qualified advisors.
- Migrate content and uploads to reliable durable storage, configure backups, HTTPS, monitoring and hardened authentication.
- Improve server rendering/prerender for public SEO.

## Phase B — optional later, when 2 more properties are ready
This is a **new workflow**, not an existing capability:
- Public stay request form with safe data minimisation, consent/privacy notice, protected database storage and notifications.
- Configurable approximately 10-calendar-day review window starting on successful submission; communicate as "normally reviewed within 10 days", not a guarantee.
- Owner dashboard: New, Reviewing, Need Information, Approved, Declined, Closed, and optionally Expired. Owner can change status, add internal notes and manually choose applicant irrespective of arrival order, subject to applicable policies.
- Owner-approved email messages sent from a verified business mailbox only after human approval; no auto-confirmation from form submission or the passing of 10 days.
- If an applicant is approved, do not automatically block a property's dates unless a separate reservation confirmation process is implemented.
- Proper email delivery monitoring, retries, unsubscribing rules where applicable, privacy retention/deletion handling and audit log.
- No public queue position or live booked/unbooked signal.

## Future architectural migration
Preferred production schema: Property, PropertyImage, RateOption, PublicPageContent, AdminUser, WellnessService. Phase B adds AccommodationEnquiry, EnquiryStatusEvent, EnquiryNote and EmailDelivery. Enquiry data should remain restricted to authorised administrators.
