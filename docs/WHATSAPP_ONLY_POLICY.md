# SPG — Current WhatsApp-only enquiry policy

## Public website (now)
- Primary call-to-action: **Enquire on WhatsApp** / **Speak with the host**.
- Avoid **Book Now**, **Reserve**, instant availability, public booked/unbooked labels, queue sizes, and first-come-first-served messaging.
- The public website should display only owner-published apartment pages; being published means visitors may enquire, **not** that specific dates are available.
- WhatsApp opens a visitor-initiated message to the owner, using the configured number. No WhatsApp messages are saved into SPG automatically.
- Owner personally considers date requests, guest suitability, and agreed terms. Enquiry does **not** secure a reservation. Final approval is communicated personally.
- The couples-only eligibility notice is displayed; no extra demographic restrictions should be invented.

## Future, not implemented
When apartments 02 and 03 are ready, consider a secure website enquiry form and an owner-reviewed email decision flow. The approximately 10-day review period must be explicitly approved before it is communicated. Do not automatically confirm or reserve inventory when the period expires.

## Content updates
Sign in at `/admin`, enter official WhatsApp number as country-code digits (India `91` + number), upload actual apartment images, update descriptions and rates, and press Save changes. Keep apartments 02 and 03 unpublished until ready.

## Before launch
- Test actual WhatsApp link on mobile and desktop.
- Replace labelled demonstration assets with licensed or owned real photography.
- Confirm all eligibility, rental terms and the public contact number.
- Deploy image uploads and content storage onto persistent backed-up storage, behind HTTPS; do not rely on ephemeral serverless disk.
- Complete authentication hardening, access checks, rate-limiting/security testing and privacy/legal review.
