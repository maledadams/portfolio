# lucia-adams.com

Portfolio for Lucia Adams. Next.js on Cloudflare Workers, Spanish by default
with an English toggle, and a contact form backed by D1, guarded by Turnstile,
that emails a copy of each message through Resend.

## Running it

```bash
pnpm install
pnpm dev            # http://localhost:3000
```

The contact form needs a local database once:

```bash
pnpm db:migrate:local
```

Everything written locally lives in `.wrangler/state` and is not shared.

## Going live on Cloudflare

The D1 database `lucia-adams-portfolio` already exists and has its tables;
its id is in `wrangler.jsonc`. The Worker is served on `lucia-adams.com`
(the `routes` entry in `wrangler.jsonc`).

```bash
pnpm db:migrate     # applies any new migrations/ to the real D1
pnpm deploy         # builds with OpenNext and uploads the Worker
```

`pnpm preview` runs the built Worker locally, which is closer to production
than `pnpm dev` and worth using before a deploy.

**Building on Windows** needs Developer Mode on (Settings → System → For
developers), because the OpenNext build creates symlinks. Without it the build
fails with `EPERM ... symlink`. Building inside WSL works too.

`src/middleware.ts` is deliberately not renamed to `proxy.ts`: Next 16 runs
`proxy.ts` on the Node.js runtime, which OpenNext for Cloudflare can't deploy.

## Turnstile (bot protection)

**Required in production.** `src/lib/turnstile.ts` fails closed: if
`TURNSTILE_SECRET` is missing, every submission is rejected with a "not
available" message instead of slipping through. Only `pnpm dev` skips the
check. The widget has to be created by hand: the CLI token is missing the
`challenge-widgets.write` scope, so the dashboard is the only way.

**1. Create the widget.** [dash.cloudflare.com](https://dash.cloudflare.com) →
Turnstile → Add widget.
- Domains: `lucia-adams.com`, plus `localhost` if you want to test it locally.
- Widget mode: **Invisible**. No checkbox, no visible UI at all.

**2. Site key** (public, already in `wrangler.jsonc` as
`vars.TURNSTILE_SITE_KEY`). `vars.TURNSTILE_HOSTNAMES` lists the frontend
hosts a token may come from (`lucia-adams.com` only, never localhost); the
server rejects tokens whose hostname or action (`contact`) don't match.

**3. Secret key** (never commit this, never paste it into a chat):

```bash
npx wrangler secret put TURNSTILE_SECRET
```

## Contact form

Deliberately not a `mailto:` link and the email address is not printed
anywhere on the site or in the repo. Submissions go into D1's `messages`
table, guarded by length caps, a honeypot, a rate limit (3 per author per
24 h, keyed on a day-salted IP hash) and Turnstile.

**Email on every new message (Resend).** After a message is saved, a copy is
sent through [Resend](https://resend.com): an HTML email styled like the site
on white (`src/lib/contact-email.ts`, everything the visitor typed is escaped)
plus a plain-text part, with Reply-To set to the sender. It's best-effort: if Resend is down or unconfigured the message is
still saved. To turn it on:

1. Create a Resend account and add the domain `lucia-adams.com`. Resend can
   add its DNS records to Cloudflare for you. They live on `send.` and
   `resend._domainkey.`, so the Zoho MX records are untouched.
2. Create an API key with **Sending access** only, limited to that domain.
3. Store both values as secrets:

```bash
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put NOTIFY_EMAIL     # the inbox that gets the copies
```

Mail is sent from `contacto@lucia-adams.com` (see `notify()` in
`src/lib/contact.ts`).

Read messages straight from D1:

```bash
npx wrangler d1 execute lucia-adams-portfolio --remote   --command="SELECT id, name, email, message, created_at FROM messages WHERE read = 0 ORDER BY created_at DESC"
```

Mark one as handled:

```bash
npx wrangler d1 execute lucia-adams-portfolio --remote   --command="UPDATE messages SET read = 1 WHERE id = 12"
```

## Layout of the code

| Path | What lives there |
| --- | --- |
| `src/app/[locale]/` | The three pages: home, work, contact |
| `src/components/` | Nav, footer, contact form, project card, Turnstile widget |
| `src/lib/contact.ts` | Contact form D1 access, validation, Turnstile check |
| `src/lib/turnstile.ts` | The siteverify call |
| `src/app/api/contact/` | The endpoint the contact form posts to |
| `messages/` | Every visible string, Spanish and English |
| `migrations/` | D1 schema (`0001` is the retired guestbook table, `0002` is messages) |

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
