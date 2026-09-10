"use client";

import { useLocale, useTranslations } from "next-intl";
import { ArrowRightIcon, TranslateIcon } from "@phosphor-icons/react";
import { Link, usePathname } from "@/i18n/navigation";

const items = [
  { href: "/work", key: "work" as const },
  { href: "/guestbook", key: "guestbook" as const },
  { href: "/contact", key: "contact" as const },
] satisfies {
  href: "/work" | "/guestbook" | "/contact";
  key: "work" | "guestbook" | "contact";
}[];

const langLabel = { es: "ESP", en: "ENG" } satisfies Record<"es" | "en", string>;

const laLetters = ["L", ".", "A", "."];

export default function Nav() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const locale = useLocale();
  const other = locale === "es" ? "en" : "es";

  return (
    <header className="center grid grid-cols-[1fr_auto_1fr] items-center gap-x-4 gap-y-4 pt-8 pb-14 sm:pt-10">
      <Link
        href="/"
        aria-label={t("name")}
        className="la-logo justify-self-start text-[1.15em] font-bold tracking-tight"
      >
        {laLetters.map((ch, i) => (
          <span
            key={i}
            className="la-letter"
            style={{ "--letter-delay": `${i * 70}ms` } as React.CSSProperties}
          >
            {ch}
          </span>
        ))}
      </Link>

      <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-mono text-[0.8em] sm:gap-x-7">
        {items.map(({ href, key }) => (
          <Link
            key={key}
            href={href}
            aria-current={pathname === href ? "page" : undefined}
            className="navlink text-muted transition-colors hover:text-fg aria-[current=page]:text-fg"
          >
            <span className="arrow" aria-hidden>
              <ArrowRightIcon size="1em" weight="bold" />
            </span>
            <span className="slash">/</span>
            {t(key)}
          </Link>
        ))}
      </nav>

      <div className="flex justify-end">
        <Link
          href={pathname}
          locale={other}
          aria-label={t("lang")}
          className="lang-toggle flex items-center gap-1.5 border border-line px-2.5 py-1 font-mono text-[0.75em] text-muted transition-colors hover:border-white hover:text-fg"
        >
          <TranslateIcon size="1em" weight="bold" aria-hidden />
          {langLabel[other]}
        </Link>
      </div>
    </header>
  );
}
