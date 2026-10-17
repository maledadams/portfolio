import type { ContactAnswers } from "./contact-options";

/** Spanish labels for each option key, as the visitor saw them. */
type OptionLabels = {
  services: Record<string, string>;
  org: Record<string, string>;
  site: Record<string, string>;
  budget: Record<string, string>;
  timeline: Record<string, string>;
};

/** Everything a visitor typed goes through here before it touches HTML. */
function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// The site's palette and type, flipped to a white page. Email clients that
// can't load the web fonts (Gmail) fall back to Arial / Courier New.
const INK = "#191919";
const MUTED = "#6b6b6b";
const LINE = "#ececec";
const SOFT = "#f6f6f6";
const RED = "#ff0000";
const SANS = "'Libre Franklin', Arial, Helvetica, sans-serif";
const MONO = "'Space Mono', 'Courier New', Courier, monospace";

function row(label: string, value: string): string {
  return `
          <tr>
            <td style="padding:14px 0;border-top:1px solid ${LINE};width:110px;padding-right:12px;vertical-align:top;font-family:${MONO};font-size:11px;letter-spacing:0.04em;text-transform:uppercase;color:${MUTED};">${esc(label)}</td>
            <td style="padding:14px 0;border-top:1px solid ${LINE};vertical-align:top;font-family:${SANS};font-size:15px;line-height:1.5;color:${INK};">${esc(value)}</td>
          </tr>`;
}

function chip(text: string): string {
  return `<span style="display:inline-block;margin:0 6px 6px 0;padding:6px 12px;border-radius:6px;background:${SOFT};font-family:${MONO};font-size:12px;color:${INK};"><span style="color:${RED};">&#10039;</span>&nbsp;${esc(text)}</span>`;
}

/**
 * The notification Lucia gets for each contact-flow submission: subject
 * carries the triage details, the HTML mirrors the site (sparkle, mono
 * labels, rounded cards) on white, and a plain-text part goes alongside for
 * clients that won't render HTML.
 */
export function renderContactEmail(a: ContactAnswers, label: OptionLabels) {
  // Strip control characters so a name can't break the subject line.
  const safeName = a.name.replace(/[\u0000-\u001f\u007f]/g, " ");
  const firstName = safeName.split(" ")[0] || safeName;
  const budget = label.budget[a.budget];
  const timeline = label.timeline[a.timeline];
  const services = a.services.map((s) => label.services[s]).join(", ");

  const subject = `Nuevo mensaje de ${safeName} · ${budget} · ${timeline}`;
  const reply = `mailto:${encodeURIComponent(a.email)}?subject=${encodeURIComponent(
    "Re: tu mensaje en lucia-adams.com",
  )}`;

  const note = a.message
    ? `<div style="padding:18px 20px;border-radius:6px;background:${SOFT};font-family:${SANS};font-size:15px;line-height:1.6;color:${INK};white-space:pre-wrap;">${esc(a.message)}</div>`
    : `<p style="margin:0;font-family:${SANS};font-size:14px;font-style:italic;color:${MUTED};">No dejó nota.</p>`;

  const html = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
  <title>${esc(subject)}</title>
  <link href="https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@400;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background:#ffffff;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(`${services} · ${budget} · ${timeline}`)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;">
    <tr>
      <td align="center" style="padding:40px 20px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">

          <tr>
            <td style="padding-bottom:36px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-family:${SANS};font-size:20px;font-weight:700;letter-spacing:-0.02em;color:${INK};">L.A.</td>
                  <td align="right" style="font-family:${MONO};font-size:11px;letter-spacing:0.04em;text-transform:uppercase;color:${MUTED};">/nuevo mensaje</td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding-bottom:8px;font-family:${SANS};font-size:28px;line-height:1.2;font-weight:700;letter-spacing:-0.02em;color:${INK};">
              <span style="color:${RED};">&#10039;</span> ${esc(firstName)} te escribió
            </td>
          </tr>
          <tr>
            <td style="padding-bottom:24px;font-family:${MONO};font-size:13px;color:${MUTED};">
              ${esc(a.email)}
            </td>
          </tr>

          <tr>
            <td style="padding-bottom:28px;">
              ${chip(budget)}${chip(timeline)}
            </td>
          </tr>

          <tr>
            <td>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${row("Nombre", a.name)}${row(
                "Necesita",
                services,
              )}${row("Proyecto", label.org[a.org])}${row("Sitio web", label.site[a.site])}${row(
                "Presupuesto",
                budget,
              )}${row("Para cuándo", timeline)}
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:28px 0 10px;border-top:1px solid ${LINE};font-family:${MONO};font-size:11px;letter-spacing:0.04em;text-transform:uppercase;color:${MUTED};">Nota</td>
          </tr>
          <tr>
            <td style="padding-bottom:32px;">${note}</td>
          </tr>

          <tr>
            <td style="padding-bottom:44px;">
              <a href="${esc(reply)}" style="display:inline-block;padding:13px 22px;border-radius:6px;background:${INK};font-family:${MONO};font-size:13px;font-weight:700;color:#ffffff;text-decoration:none;">Responder a ${esc(firstName)} &rarr;</a>
            </td>
          </tr>

          <tr>
            <td style="padding-top:20px;border-top:1px solid ${LINE};font-family:${MONO};font-size:11px;color:${MUTED};">
              lucia-adams.com &middot; formulario de contacto
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = [
    `${a.name} te escribió`,
    a.email,
    "",
    `Necesita: ${services}`,
    `Proyecto: ${label.org[a.org]}`,
    `Sitio web: ${label.site[a.site]}`,
    `Presupuesto: ${budget}`,
    `Para cuándo: ${timeline}`,
    "",
    a.message || "(sin nota)",
    "",
    "lucia-adams.com · formulario de contacto",
  ].join("\n");

  return { subject, html, text };
}
