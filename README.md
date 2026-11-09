# QualiFi

Audience-specific landing pages for a finance-agent pilot. Plain HTML/CSS/JS,
server-rendered with Node.js. The server stores requests and measurement events
in a private SQLite database. There is no live AI analysis, email/WhatsApp
connection, automatic agent activation, or outbound email sender in this version.

## Open the campaign pages locally

On Windows, extract the ZIP first, then double-click **`start-windows.cmd`** inside
the extracted project folder. With Node.js 24+ installed, it starts the server
and opens `http://localhost:3000/kampanyalar` in your default browser. Keep the
terminal window open. This native Windows launcher has not been executed in the
Linux development environment; the underlying server/routes are integration-tested.

Alternatively, run `npm run preview` from the project directory. It prints the
same address (automatic browser opening is Windows-only). No package installation
is required to run the site; `npm ci` is for the development tests.

The directory links seven distinct offers, each available in Turkish and English:

| Campaign | Turkish page | English page | Primary action |
| --- | --- | --- | --- |
| Contract cash flow | `/tr/sozlesmeden-nakit-akisi` | `/en/contract-cash-flow` | Add a contract / pilot interest |
| Freelancer income plan | `/tr/freelancer-gelir-plani` | `/en/freelancer-income-plan` | Join the income-plan waitlist |
| Receivables follow-up | `/tr/tahsilat-takibi` | `/en/receivables-follow-up` | Join the receivables pilot |
| Gmail sales follow-up | `/tr/gmail-satis-takibi` | `/en/gmail-sales-follow-up` | Join the follow-up agent waitlist |
| Sales outlook | `/tr/satis-ongorusu` | `/en/sales-outlook` | Join the sales-outlook waitlist |
| WhatsApp payment follow-up | `/tr/whatsapp-odeme-takibi` | `/en/whatsapp-payment-follow-up` | Register WhatsApp pilot interest |
| Bank risk pilot | `/tr/banka-risk-pilotu` | `/en/bank-risk-pilot` | Register corporate interest |

English directory: `/en/campaigns`. Each language switch keeps the same campaign
and only the allowed UTM parameters. The original general/segment pages below
remain available for organic navigation; ad campaigns can link directly to the
new focused pages. Campaign copy is in `campaigns.cjs`, rendering in
`campaign-site.cjs`, behavior in `campaign.js`, and styling in `campaign.css`.

Every campaign repeats **one primary CTA**, measured as `primary_cta_clicked`
before form validation or contact collection. A demo is a post-interest option,
never a competing CTA on the initial campaign page. No fake analysis/account
connection is shown after a click; the form states the pilot stage explicitly.

By the owner's decision, all Turkish campaign pages hide prices. Only the
English contract cash-flow page shows **planned $29/analysis**, and the English
Gmail follow-up page shows **planned $99/business/month**. These are explicitly
pricing hypotheses, not purchasable packages; no payment is collected.

The owner supplied the public contact shown on campaign pages:
**Muhammed Talha Güler — talha.guler@ozu.edu.tr**. This is contact copy, not an
email-sending integration or evidence of institutional endorsement.

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

The new `campaignCta` report separately groups campaign ID, localized page ID,
offer, CTA goal, page version and price exposure. Its primary rate is unique
visitors who clicked the primary CTA divided by measured unique page visitors.
Repeated clicks on different copies of the same button count once per visitor
for the rate. Form starts and saved registrations remain separate columns.
Only post-view behavior on the same localized page is matched. Non-consented
submissions appear in `campaignRecords`, outside the measured visitor denominator.
Language describes the page/target market, not an observed geographic location.

Campaign metadata is derived from the server-side catalog, not trusted from the
request body. Submissions are deduplicated within a localized page, allowing
the same email to express interest in different offers/languages. Consequently,
the sum of page records is not a globally unique person count.

On first use of the new schema, the existing SQLite lead table is migrated in
a transaction to add `page_id`. Existing rows become `legacy`; contract and
booking relationships are preserved. Migration and cascading deletion are
covered with a populated old-schema test. Back up existing production data
before application upgrades.

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

The persistent 5-second/LIFT review process is documented in
[`docs/conversion-quality.md`](docs/conversion-quality.md). Run:

```sh
npm ci
npm run setup:hooks
npm run quality
```

The repository-local pre-commit hook runs the same quality command. It checks
syntax, campaign structure and functional/DOM tests. The automated report is
written to ignored `work/quality/latest.json`. It explicitly marks human
5-second comprehension and actual visual testing as unverified; it does not
invent a conversion score. A read-only independent conversion review is part
of the instructions for future logical landing-page changes.

BackstopJS is a development-only screenshot comparison tool, with mobile and
desktop page/form scenarios for all 14 localized pages:

```sh
npm run visual:reference
npm run visual:test
npm run visual:report
# After actually reviewing the candidate differences:
npm run visual:approve
```

The visual runner uses a temporary database and declines analytics. References
belong under `visual/baselines/`; candidates and reports under ignored
`work/visual/`. Run on a local/supported browser environment. This managed Sites
session lacks the required browser interface; the wrapper reports not-run with
exit code 2 instead of claiming success. `CHROME_PATH` can select an installed
Chrome. Development installation may download Puppeteer's browser; use
`PUPPETEER_SKIP_DOWNLOAD=1` where only code tests are intended.

See [`docs/conversion-review.md`](docs/conversion-review.md) for the completed
source review and remaining product questions. Microsoft Clarity and new
session-recording integration are paused by the owner's latest instruction.

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
