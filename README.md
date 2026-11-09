# QualiFi

Audience-specific landing pages for a finance-agent pilot. Plain HTML/CSS/JS,
server-rendered with Node.js. The server stores requests and measurement events
in a private SQLite database. There is no live AI analysis, email/WhatsApp
connection, automatic agent activation, or outbound email sender in this version.

## Run

Requires **Node.js 24+** (built-in `node:sqlite`). No production package installation
or build step is needed.

```sh
cp .env.example .env
npm run dev
```

Open `http://localhost:3000`. `npm start` runs the same server. `.env` is loaded by
Node; do not commit it. Use `npm ci` to install development-only DOM test dependencies.

| Audience | Turkish | English |
| --- | --- | --- |
| Businesses | `/isletmeler` | `/en/business` |
| Freelancers | `/freelancerlar` | `/en/freelancers` |
| Finance teams | `/finans-ekipleri` | `/en/finance-teams` |
| Banks: corporate pilot | `/bankalar` | `/en/banks` |

`/` and `/index.html` retain the English business entry; `/tr`, `/tr/` and `/tr.html`
retain Turkish. Language switching preserves the audience. `site.cjs` contains
shared page structure and localized content. `index.html` and `tr.html` are
committed HTML snapshots; regenerate with `npm run build:pages` after editing
`site.cjs`. The server renders segment routes directly.

## Conversion flows

- **Set up an agent:** three-step pilot request (outcome, sample/own agreement and
  preferred channel, contact). It creates a pilot request, not an active agent.
- **Waiting list:** email and explicit data-use agreement; stored separately from
  pilot and meeting requests. Confirmation means a database record, not email verification.
- **Talk to a human:** configured external scheduling link and a working meeting
  request form. A request is not a confirmed booking. With no configured calendar,
  the page clearly offers the request form instead of fabricated availability.

Own contracts: PDF or UTF-8 TXT, up to 5 MB. Uploaded only on final submit; stored
as a BLOB tied to the lead, never served publicly or sent to a model. A sample
agreement path avoids sharing a real document. File signature/type checks are
not a full malware scan. Review access/retention and infrastructure before inviting
real customer uploads to a production deployment.

## Google Calendar (or another booking provider)

Create an **appointment schedule** in Google Calendar, then copy its public
booking-page link. Set the real link in `.env` and restart:

```dotenv
CALENDAR_URL=https://calendar.google.com/calendar/appointments/schedules/YOUR_SCHEDULE
```

Only HTTPS booking links are accepted. Google Calendar's booking page handles
available dates, time zones and reservation confirmation. An ordinary calendar
view/share URL is not a booking page. Appointment-scheduling availability and
features depend on the account. Cal.com/Calendly HTTPS links work too.

Connecting Google Calendar to a chat does not configure this website automatically.
No calendar account credentials are collected or exposed by this application.

Calendar opens are recorded as `calendar_opened`, never `meeting_booked`. If a
meeting request is saved first, its opaque ID is appended as `qualifi_lead_id`.
Booking attribution requires a provider adapter that preserves that ID; Google
appointment scheduling is **not** wired directly to the webhook by this version.

### Optional verified-booking adapter

A trusted provider adapter can POST JSON to `/api/booking-webhook`:

```json
{"leadId":"EXISTING-MEETING-LEAD-UUID","bookingId":"PROVIDER-RESERVATION-ID","startsAt":"2026-12-01T10:00:00Z"}
```

Set `BOOKING_WEBHOOK_SECRET` in the environment. Send Unix seconds in
`x-qualifi-timestamp` and the hex HMAC-SHA256 of `TIMESTAMP.RAW_JSON_BODY` in
`x-qualifi-signature`, signed using that secret. Timestamps must be within five
minutes. Reservation IDs are deduplicated; only verified callbacks create
`meeting_booked`. The adapter, cancellation handling and provider credentials
must be configured separately; this is not a native Google webhook receiver.

## Records and measurement

`DATA_DIR` defaults to `./data`. It contains `qualifi.sqlite` and its SQLite
journal files. Keep the complete directory on a **persistent private volume**
with backups. A temporary/serverless filesystem will lose records on replacement.
The directory is ignored by Git and is not a public static directory.

Optional analytics start only after the visitor allows them. Declining analytics
leaves the forms usable; operational submissions still record their selected
solution and campaign source, without a visitor ID. Page events never include
email, raw query strings, filenames, documents or free-form input.

Visits, visible cards, selections, actual form interactions and setup progress
are recorded separately. Successful requests/uploads are recorded by the server
in the same transaction as the data. Retries use stable IDs; repeated identical
kind/email/audience/solution requests do not inflate conversion counts.

Campaign fields are restricted to `utm_source`, `utm_medium`, `utm_campaign`,
`utm_content`, `utm_term` (up to 100 ASCII letters/numbers/spaces/`_.-`). The first
and most recent tagged entry in a browser tab are retained separately. Use
non-personal campaign identifiers. A valid `?offer=forecast` or `?offer=autopilot`
preselects an outcome. Card order is balanced by the consented visitor ID and
stable on return; this is not a complete causal A/B experimentation platform.

Owner-only reports run on the server; no reporting or contact-data API is exposed:

```sh
npm run report
npm run report -- --json
# This explicit export includes contact information. Keep the output private.
npm run report -- --export-leads
# Delete a lead and its contract/booking records:
npm run report -- --delete=LEAD_UUID
# Delete leads/contracts/bookings and events older than the chosen number of days:
npm run report -- --prune=30
```

The report includes raw counts, first/latest campaign attribution, consented
visitor counts and card-exposure conversion percentages. It counts conversions
for the same visitor, audience and offer after exposure. Leads without analytics
consent and hero conversions without card exposure remain in operational totals,
not the exposure denominator. Browser blocking and opt-outs limit coverage.
These data do not automatically establish product preference or market fit.
Qualification and meeting attendance still need team follow-up; they are not
inferred automatically. Schedule pruning yourself; retention is not automatic.

## Deployment configuration

Set `PUBLIC_ORIGIN` to the exact HTTPS origin. Serve behind HTTPS; configure
`HOST=0.0.0.0` if the host requires external binding. Use a persistent disk for
`DATA_DIR`, keep it private, and back up SQLite using an appropriate consistent
backup process. The default address remains localhost for development.

Rate limits are in memory and keyed by the direct socket address. Behind a proxy,
add platform-level limiting using verified client identity/IP; forwarded headers
are deliberately not trusted here. This app is designed as a single Node process
with SQLite; multi-instance deployment requires shared durable storage and
coordinated rate limiting. No external CRM, analytics service, or email service
has been provisioned. GitHub source synchronization does not publish a live site.

## Verification

```sh
npm ci
npm run check
npm test
npm run build:pages
```

Integration tests cover HTTP routes, database persistence/retries, input and file
validation, analytics permission, booking signatures, and deletion. DOM tests
exercise actual client code against the real test server: wizard choices,
back/next, validation, retry preservation, opt-out/opt-in, and calendar fallback.
They do not replace visual/browser QA. Managed browser QA was unavailable in the
implementation environment because the Sites `cua_repl.js` interface was absent.

Google Fonts is optional; system fallbacks work offline. The current page uses
original QualiFi styling and component structure inspired by the uploaded
landing template; the full dashboard template and its data have not been imported.
