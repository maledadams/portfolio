import { useTranslations } from "next-intl";

export const links = [
  { label: "Email", href: "mailto:maledadams@gmail.com", text: "maledadams@gmail.com" },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/lucia-m-adams/",
    text: "lucia-m-adams",
  },
  { label: "GitHub", href: "https://github.com/maledadams", text: "maledadams" },
];

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="mt-6 border-t border-line py-10">
      <div className="center flex flex-wrap items-center justify-between gap-x-8 gap-y-3 font-mono text-[0.8em] text-muted">
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="underline decoration-1 underline-offset-4 transition-colors hover:text-fg"
            >
              {link.label}
            </a>
          ))}
        </div>
        <p>{t("note")}</p>
      </div>
    </footer>
  );
}
