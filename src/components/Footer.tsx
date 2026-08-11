import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

const external = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/lucia-m-adams/" },
  { label: "GitHub", href: "https://github.com/maledadams" },
];

export default function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");

  const internal = [
    { label: nav("home"), href: "/" },
    { label: nav("work"), href: "/work" },
    { label: nav("contact"), href: "/contact" },
  ] as const;

  return (
    <footer className="mt-10 border-t border-line py-14">
      <div className="center grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-[auto_auto_1fr]">
        <div className="flex flex-col items-start gap-2 text-[0.8em]">
          {internal.map((item) => (
            <Link key={item.href} href={item.href} className="link capitalize">
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex flex-col items-start gap-2 text-[0.8em]">
          {external.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="link"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="col-span-2 sm:col-span-1 sm:max-w-[320px] sm:justify-self-end">
          <h2 className="font-semibold">{t("ctaTitle")}</h2>
          <p className="mt-1 text-[0.8em] text-muted">{t("ctaBody")}</p>
          <Link
            href="/contact"
            className="mt-4 inline-block border border-line bg-surface px-5 py-2.5 text-[0.8em] transition-colors hover:border-fg"
          >
            {t("ctaButton")}
          </Link>
        </div>
      </div>

      <p className="center mt-10 font-mono text-[0.7em] text-muted">
        {t("note")}
      </p>
    </footer>
  );
}
