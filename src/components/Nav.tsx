"use client";

import { useLocale, useTranslations } from "next-intl";
import { TranslateIcon } from "@phosphor-icons/react";
import { Link, usePathname } from "@/i18n/navigation";

const items = [
  { href: "/work", key: "work" as const },
  { href: "/contact", key: "contact" as const },
] satisfies {
  href: "/work" | "/contact";
  key: "work" | "contact";
}[];

const langLabel = { es: "ESP", en: "ENG" } satisfies Record<"es" | "en", string>;

const laLetters = ["L", ".", "A", "."];

export default function Nav() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const locale = useLocale();
  const other = locale === "es" ? "en" : "es";

  // Phones: logo and language on one row, the nav centered under them.
  // From sm up: a three-column grid with the nav in the middle.
  return (
    <header className="center flex flex-wrap items-center justify-between gap-y-3 pt-6 pb-10 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:gap-x-4 sm:pt-10 sm:pb-14">
      <Link
        href="/"
        aria-label={t("name")}
        className="la-logo justify-self-start text-[1.15em] font-bold tracking-tight whitespace-nowrap"
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

      <nav className="order-last flex w-full flex-wrap items-center justify-center gap-x-5 gap-y-2 font-mono text-[0.8em] sm:order-none sm:w-auto sm:gap-x-7">
        {items.map(({ href, key }) => (
          <Link
            key={key}
            href={href}
            aria-current={pathname === href ? "page" : undefined}
            className="navlink text-muted transition-colors hover:text-fg aria-[current=page]:text-fg"
          >
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
          className="lang-toggle btn-card flex items-center gap-1.5 px-2.5 py-1 font-mono text-[0.75em] text-muted hover:text-fg"
        >
          <TranslateIcon size="1em" weight="bold" aria-hidden />
          {langLabel[other]}
        </Link>
      </div>
    </header>
  );
}
