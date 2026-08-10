"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

const sheets = [
  { code: "A-1", href: "/", key: "home" as const },
  { code: "A-2", href: "/work", key: "work" as const },
  { code: "A-3", href: "/contact", key: "contact" as const },
];

export default function SheetNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const locale = useLocale();

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line bg-deep/85 backdrop-blur-sm">
      <nav className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
        <Link
          href="/"
          className="whitespace-nowrap font-mono text-xs tracking-[0.14em] text-ink hover:text-cyan sm:text-sm"
        >
          {t("name")}
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          {sheets.map((sheet) => {
            const active = pathname === sheet.href;
            return (
              <Link
                key={sheet.code}
                href={sheet.href}
                aria-current={active ? "page" : undefined}
                className={`whitespace-nowrap border px-2 py-1.5 font-mono text-[11px] tracking-[0.12em] transition-colors sm:px-3 ${
                  active
                    ? "border-cyan bg-cyan text-deep"
                    : "border-line text-dim hover:border-cyan hover:text-cyan"
                }`}
              >
                {sheet.code}
                <span className="hidden lg:inline">
                  {" / "}
                  {t(sheet.key)}
                </span>
              </Link>
            );
          })}

          <div className="ml-2 flex items-center border border-line sm:ml-4">
            {(["es", "en"] as const).map((code) => (
              <Link
                key={code}
                href={pathname}
                locale={code}
                className={`px-2.5 py-1.5 font-mono text-[11px] tracking-[0.12em] transition-colors ${
                  locale === code
                    ? "bg-amber text-deep"
                    : "text-dim hover:text-amber"
                }`}
              >
                {code.toUpperCase()}
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
