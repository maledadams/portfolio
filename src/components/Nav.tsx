"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  ArrowRightIcon,
  MoonIcon,
  SunIcon,
  TranslateIcon,
} from "@phosphor-icons/react";
import { Link, usePathname } from "@/i18n/navigation";

const items = [
  { href: "/", key: "home" as const },
  { href: "/work", key: "work" as const },
  { href: "/contact", key: "contact" as const },
] satisfies {
  href: "/" | "/work" | "/contact";
  key: "home" | "work" | "contact";
}[];

/**
 * Stateless on purpose: which icon shows is decided entirely by CSS from the
 * `data-theme` attribute, so there is nothing to hydrate and no mismatch
 * between what the server rendered and what the boot script already applied.
 */
function ThemeToggle({ label }: { label: string }) {
  const toggle = () => {
    const root = document.documentElement;
    const current =
      root.getAttribute("data-theme") ??
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    const next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      className="theme-toggle text-muted transition-colors hover:text-fg"
    >
      <SunIcon className="sun" size="1.15em" weight="regular" aria-hidden />
      <MoonIcon className="moon" size="1.15em" weight="regular" aria-hidden />
    </button>
  );
}

export default function Nav() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const locale = useLocale();
  const other = locale === "es" ? "en" : "es";

  return (
    <header className="center flex flex-wrap items-center justify-between gap-x-8 gap-y-4 pt-8 pb-14 sm:pt-10">
      <Link href="/" className="font-mono text-[0.8em] tracking-tight">
        {t("name")}
      </Link>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[0.8em] sm:gap-x-8">
        <nav className="flex items-center gap-x-5 sm:gap-x-7">
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

        <div className="flex items-center gap-4 text-muted">
          <Link
            href={pathname}
            locale={other}
            aria-label={t("lang")}
            className="flex items-center gap-1.5 transition-colors hover:text-fg"
          >
            <TranslateIcon size="1.15em" weight="regular" aria-hidden />
            {other.toUpperCase()}
          </Link>
          <ThemeToggle label={t("theme")} />
        </div>
      </div>
    </header>
  );
}
