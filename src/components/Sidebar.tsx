"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

const items = [
  { href: "/", key: "home" as const },
  { href: "/work", key: "work" as const },
  { href: "/contact", key: "contact" as const },
];

/**
 * Boxed sidebar navigation, the old personal-homepage arrangement.
 * Labels are kept ASCII so they can render in the pixel face.
 */
export default function Sidebar() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const locale = useLocale();

  return (
    <aside className="lg:sticky lg:top-6 lg:self-start">
      <div className="shell overflow-hidden bg-paper">
        <div className="border-b-[3px] border-ink bg-lime px-4 py-3">
          <p className="font-chrome text-[13px] tracking-wide">{t("name")}</p>
          <p className="font-chrome text-[9px] tracking-wide text-ink/70">
            {t("role")}
          </p>
        </div>

        <nav className="p-3">
          <ul>
            {items.map(({ href, key }) => {
              const active = pathname === href;
              return (
                <li key={key} className="mb-1.5 last:mb-0">
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-2 rounded-[10px] border-[3px] px-3 py-2 font-chrome text-[11px] tracking-wide ${
                      active
                        ? "border-ink bg-butter"
                        : "bevel-btn border-transparent hover:border-ink"
                    }`}
                  >
                    <span aria-hidden="true">{active ? ">" : "-"}</span>
                    {t(key)}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="rule my-4" />

          <div className="flex gap-1.5">
            {(["es", "en"] as const).map((code) => (
              <Link
                key={code}
                href={pathname}
                locale={code}
                className={`flex-1 rounded-[8px] border-[3px] border-ink py-1.5 text-center font-chrome text-[10px] ${
                  locale === code ? "bg-pink" : "bevel-btn bg-shade text-ink/70"
                }`}
              >
                {code.toUpperCase()}
              </Link>
            ))}
          </div>

          <Link
            href="/contact"
            className="press mt-3 block rounded-full border-[3px] border-ink bg-tangerine px-4 py-2.5 text-center text-sm font-bold"
          >
            {t("cta")}
          </Link>
        </nav>
      </div>
    </aside>
  );
}
