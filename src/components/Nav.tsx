"use client";

import { useSyncExternalStore } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

const items = [
  { href: "/", key: "home" as const },
  { href: "/work", key: "work" as const },
  { href: "/contact", key: "contact" as const },
] satisfies { href: "/" | "/work" | "/contact"; key: "home" | "work" | "contact" }[];

/*
 * The theme lives in the DOM and localStorage, not in React, so it is read
 * as an external store. That keeps the inline pre-paint script as the single
 * source of truth and avoids a flash on load.
 */
const listeners = new Set<() => void>();

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", onChange);
  return () => {
    listeners.delete(onChange);
    mq.removeEventListener("change", onChange);
  };
}

function getSnapshot(): "light" | "dark" {
  const explicit = document.documentElement.getAttribute("data-theme");
  if (explicit === "light" || explicit === "dark") return explicit;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function ThemeToggle({ label }: { label: string }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, () => "light");

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    listeners.forEach((l) => l());
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      className="font-mono text-[0.8em] text-muted transition-colors hover:text-fg"
    >
      <span suppressHydrationWarning>[{theme}]</span>
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
              <span className="arrow" aria-hidden="true">
                -&gt;
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
            className="transition-colors hover:text-fg"
          >
            {other.toUpperCase()}
          </Link>
          <ThemeToggle label={t("theme")} />
        </div>
      </div>
    </header>
  );
}
