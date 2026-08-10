"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

const items = [
  { href: "/", key: "home" as const },
  { href: "/work", key: "work" as const },
  { href: "/contact", key: "contact" as const },
];

/**
 * Full-width header bar. Labels are kept ASCII so they can render in the
 * pixel face, which has no accented characters.
 */
export default function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const locale = useLocale();

  return (
    <header className="shell bg-paper">
      <div className="flex items-baseline justify-between gap-4 border-b-[3px] border-ink bg-lime px-4 py-2">
        <p className="font-chrome text-[13px] tracking-wide">{t("name")}</p>
        <p className="font-chrome text-[9px] tracking-wide text-ink/70">
          {t("role")}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2 p-3">
        <nav className="flex flex-wrap gap-2">
          {items.map(({ href, key }) => {
            const active = pathname === href;
            return (
              <Link
                key={key}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-2 border-[3px] px-4 py-2 font-chrome text-[11px] tracking-wide ${
                  active
                    ? "border-ink bg-butter"
                    : "bevel-btn border-transparent hover:border-ink"
                }`}
              >
                <span aria-hidden="true">{active ? ">" : "-"}</span>
                {t(key)}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div className="flex">
            {(["es", "en"] as const).map((code) => (
              <Link
                key={code}
                href={pathname}
                locale={code}
                className={`border-[3px] border-ink px-3 py-2 font-chrome text-[10px] ${
                  code === "en" ? "border-l-0" : ""
                } ${locale === code ? "bg-pink" : "bevel-btn bg-shade text-ink/70"}`}
              >
                {code.toUpperCase()}
              </Link>
            ))}
          </div>

          <Link
            href="/contact"
            className="press border-[3px] border-ink bg-tangerine px-5 py-2 text-sm font-bold"
          >
            {t("cta")}
          </Link>
        </div>
      </div>
    </header>
  );
}
