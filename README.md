# lucia-adams.com

Portfolio for Lucia Adams. Next.js on Cloudflare Workers, Spanish by default
with an English toggle, a guestbook and a contact form both backed by D1, and
Turnstile guarding both once it's set up.

## Running it

```bash
pnpm install
pnpm dev            # http://localhost:3000
```

The guestbook and contact form need a local database once:

```bash
pnpm db:migrate:local
```

Everything written locally lives in `.wrangler/state` and is not shared.

## Going live on Cloudflare

The site is not deployed yet. Three steps, in order.

**1. Create the database.** This prints a `database_id`.

```bash
npx wrangler d1 create lucia-adams-guestbook
```

**2. Paste that id into `wrangler.jsonc`**, replacing
`REPLACE_WITH_ID_FROM_WRANGLER_D1_CREATE`. Nothing works until this is real.

**3. Create the tables on the remote database, then deploy.**

```bash
pnpm db:migrate     # applies migrations/ to the real D1
pnpm deploy         # builds with OpenNext and uploads the Worker
```

`pnpm preview` runs the built Worker locally, which is closer to production
than `pnpm dev` and worth using before a deploy.

## Turnstile (bot protection)

Both forms work without this, held up by a honeypot field and rate limiting
alone. Adding Turnstile is optional but recommended before the site is public.
It has to be created by hand: the CLI token available in this environment is
missing the `challenge-widgets.write` scope, so the dashboard is the only way.

**1. Create the widget.** [dash.cloudflare.com](https://dash.cloudflare.com) →
Turnstile → Add widget.
- Domains: `localhost`, `127.0.0.1`, and `lucia-adams.com` once that's live.
- Widget mode: **Invisible**. No checkbox, no visible UI at all.

**2. Site key** (public, safe to commit) goes in `wrangler.jsonc`, replacing
`REPLACE_WITH_SITE_KEY_FROM_DASHBOARD` under `vars.TURNSTILE_SITE_KEY`.

**3. Secret key** (never commit this) goes in two places:

```bash
# Production
npx wrangler secret put TURNSTILE_SECRET

# Local dev — create .dev.vars (already gitignored) with:
echo 'TURNSTILE_SECRET=your-secret-here' >> .dev.vars
```

That's it. `src/lib/turnstile.ts` reads `TURNSTILE_SECRET` at request time and
starts verifying every submission the moment it's set. No code changes, no
redeploy needed beyond picking up the new secret.

## Guestbook

Signatures publish immediately, because a guestbook that holds every note for
review does not feel like a guestbook. Protecting it:

- Name capped at 40 characters, message at 220.
- A honeypot field no human can see. Bots that fill it get a cheerful `200`
  and nothing is written.
- Three signatures per author per 24 hours. The author is identified by a
  SHA-256 hash of their IP salted with the current date, so it cannot be used
  to follow anyone across days.
- Turnstile, once set up (see above).

To take a note down:

```bash
npx wrangler d1 execute lucia-adams-guestbook --remote \
  --command="UPDATE guestbook SET approved = 0 WHERE id = 12"
```

Only rows with `approved = 1` are shown. To review everything before it goes
public instead, change the column default in a new migration and flip rows to
`1` as you approve them.

## Contact form

Deliberately not a `mailto:` link and the email address is not printed
anywhere on the site. Submissions go straight into D1's `messages` table
instead, guarded the same way the guestbook is (length caps, honeypot, rate
limit, Turnstile). Nothing here emails anyone yet; read new messages with:

```bash
npx wrangler d1 execute lucia-adams-guestbook --remote \
  --command="SELECT id, name, email, message, created_at FROM messages WHERE read = 0 ORDER BY created_at DESC"
```

Mark one as handled:

```bash
npx wrangler d1 execute lucia-adams-guestbook --remote \
  --command="UPDATE messages SET read = 1 WHERE id = 12"
```

If checking D1 by hand gets old, the natural next step is an email
notification on insert (Cloudflare Email Workers, or a provider like Resend)
so a new message actually pings somewhere. Out of scope for now.

## Layout of the code

| Path | What lives there |
| --- | --- |
| `src/app/[locale]/` | The three pages: home, work, contact |
| `src/components/` | Nav, footer, guestbook, contact form, project card, Turnstile widget |
| `src/lib/guestbook.ts` | Guestbook D1 access, validation, Turnstile check |
| `src/lib/contact.ts` | Contact form D1 access, validation, Turnstile check |
| `src/lib/turnstile.ts` | The siteverify call, shared by both |
| `src/app/api/guestbook/`, `src/app/api/contact/` | The endpoints each form posts to |
| `messages/` | Every visible string, Spanish and English |
| `migrations/` | D1 schema (guestbook, then messages) |

Routes are localized: `/trabajo` and `/contacto` in Spanish, `/work` and
`/contact` in English, because the nav renders paths literally and the label
has to match the address.

## Commands

| Command | Does |
| --- | --- |
| `pnpm dev` | Local dev with Cloudflare bindings |
| `pnpm build` | Next build (type checking included) |
| `pnpm lint` | ESLint |
| `pnpm preview` | Build and run the Worker locally |
| `pnpm deploy` | Build and deploy to Cloudflare |
| `pnpm cf-typegen` | Regenerate binding types after editing `wrangler.jsonc` |
| `pnpm db:migrate:local` | Apply D1 migrations locally |
| `pnpm db:migrate` | Apply D1 migrations to the real database |
