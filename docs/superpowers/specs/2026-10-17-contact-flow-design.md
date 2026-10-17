# Contact flow: one question at a time

## Goal

Replace the name/email/message form on `/contacto` with a guided flow that
asks one short question per screen. It should feel effortless for someone who
genuinely needs the work (tap, tap, done) and give Lucia enough context to
spot serious leads before opening the email. Nobody is turned away; every
answer is just recorded.

## Questions

Seven required steps, then one optional note. Easy questions first, the
email near the end, the note last.

| # | Key | Question (es / en) | Input | Options (stored key → label es / en) |
|---|---|---|---|---|
| 1 | `name` | ¿Cómo te llamas? / What's your name? | text, 1–60 chars | — |
| 2 | `services` | ¿En qué te puedo ayudar? / What can I help with? | tags, **1 or more** | `web` Sitio web o tienda / Website or store · `brand` Marca y logo / Brand & logo · `automation` Automatización o IA / Automation or AI · `system` Sistema a medida / Custom system · `consulting` Consultoría / Consulting · `other` Otra cosa / Something else |
| 3 | `org` | ¿Qué describe mejor tu proyecto? / What best describes your project? | one tag | `business` Negocio o tienda / Business or store · `nonprofit` ONG / Nonprofit · `startup` Startup · `personal` Personal u otro / Personal or other |
| 4 | `site` | ¿Ya tienes sitio web? / Do you already have a website? | one tag | `yes` Sí / Yes · `redo` Sí, pero hay que rehacerlo / Yes, but it needs a redo · `no` No |
| 5 | `budget` | ¿Con qué presupuesto cuentas? / What budget do you have in mind? | one tag | `lt500` Menos de $500 / Under $500 · `500-1500` $500–1.5K · `1500-5000` $1.5K–5K · `5000+` $5K+ |
| 6 | `timeline` | ¿Para cuándo lo necesitas? / When do you need it? | one tag | `asap` Lo antes posible / As soon as possible · `1-3m` En 1–3 meses / In 1–3 months · `3m+` En 3 meses o más / 3+ months out · `exploring` Solo estoy explorando / Just exploring |
| 7 | `email` | ¿A qué email te respondo? / Where should I reply? | email, ≤120 chars | — |
| 8 | `message` | ¿Algo más que quieras contarme? **(opcional)** / Anything else? **(optional)** | text box, 0–1000 chars | — |

Each step has a one-line hint under the question that lowers the stakes, for
example on budget: "Es solo para orientarme, no un compromiso." / "Just to
get my bearings, not a commitment." Step 8's button reads "Enviar" whether or
not the note is filled; an empty note is a normal, complete submission.

## Experience

- Lives in a card styled like the Trabajos cards (`info-card` fill and
  rounding), in the existing form section of `/contacto`. "Cómo Trabajo"
  stays above it.
- Top of the card: a thin progress bar and "3 / 8".
- Answers are tags in the "Lo Que Hago" style, with the red sparkle. Selected
  tags read clearly as selected (solid fill).
- Single-choice steps advance on click after a short beat (~250 ms) so the
  selection is visible. Text and multi-select steps advance with "Siguiente"
  or Enter; the button is disabled until the step is valid.
- "← Atrás" on every step after the first; answers are kept when going back.
- Steps slide in horizontally (forward and back directions). With
  `prefers-reduced-motion: reduce`, steps swap with no movement.
- The text input on each text step is focused automatically.
- After sending, a personal thank-you replaces the card: "¡Gracias, Ana! Te
  respondo en uno o dos días." Errors appear inside the card on the last step
  with the existing localized messages, and the answers are kept so they can
  retry.
- All copy lives in `messages/es.json` and `messages/en.json`.

## Data and security

- **Approach:** answers stay in component state and go out in one POST to the
  existing `/api/contact` at the end. Nothing is stored for people who leave
  halfway.
- **Kept as is:** Turnstile (fail-closed in production), the honeypot field,
  length caps, 3 submissions per author per 24 h on a day-salted IP hash.
- **Validation:** the server accepts only the option keys listed above.
  `services` must be a non-empty array of known keys with no duplicates; every
  other choice must be exactly one known key. Anything else returns
  `invalid`. `message` becomes optional (0–1000 chars).
- **Storage:** migration `0003_contact_answers.sql` adds nullable columns to
  `messages`: `services` (comma-separated keys), `org`, `site`, `budget`,
  `timeline`. Existing rows stay valid.
- **Email (Resend):** subject carries the triage details, for example
  "Nuevo mensaje de Ana · $1.5K–5K · En 1–3 meses". The plain-text body lists
  every answer by its Spanish label, then the note (or "(sin nota)").
  A budget of `lt500` is visible in the subject like any other. Reply-To is
  the visitor's email.

## Components

- `src/lib/contact-options.ts`: the option keys per question, shared by the
  form and the server. Single source of truth for validation.
- `src/components/ContactFlow.tsx`: the step machine (client). Replaces
  `ContactForm.tsx`.
- `src/lib/contact.ts`: validation, insert and the email extended for the
  new fields.
- `src/app/api/contact/route.ts`: passes the new fields through.

## Testing

- Local `next dev`: walk the flow in Spanish and English, with and without
  the optional note, then confirm the row in local D1 has every column.
- POST bad values directly (unknown budget key, empty services, duplicate
  services) and confirm each returns `400 invalid`.
- Check keyboard-only use (Tab, Enter, Atrás), a phone-width viewport, and
  reduced motion.

## Out of scope

Saving partial answers, an admin view of leads, and scoring or auto-rejecting
leads.
